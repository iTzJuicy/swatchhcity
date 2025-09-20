import Zone from "../models/Zone.js";
import Complaint from "../models/Complaint.js";


/**
 * Predict garbage per zone using all complaints and historical data
 */
export const predictWasteForAllZones = async (req, res) => {
  try {
    // 1️⃣ Fetch all zones
    const zones = await Zone.find();
    if (!zones.length) return res.status(404).json({ message: "No zones found" });

    // 2️⃣ Fetch all complaints grouped by zone
    const complaints = await Complaint.find();
    const zoneComplaintsMap = {}; // { zoneId: [complaints] }

    complaints.forEach(c => {
      if (!c.zoneId) return;
      if (!zoneComplaintsMap[c.zoneId]) zoneComplaintsMap[c.zoneId] = [];
      zoneComplaintsMap[c.zoneId].push(c);
    });

    // 3️⃣ Process each zone
    const updates = [];

    for (const zone of zones) {
      const zoneComplaints = zoneComplaintsMap[zone._id] || [];

      // Skip if no complaints (optional: assign minimal predicted waste)
      if (!zoneComplaints.length) {
        zone.predictedWasteKg = 0;
        zone.peakGarbageHour = null;
        updates.push(zone);
        continue;
      }

      // 4️⃣ Aggregate by hour of complaint creation to find peak hour
      const hourCounts = {};
      zoneComplaints.forEach(c => {
        const h = new Date(c.createdAt).getHours();
        hourCounts[h] = (hourCounts[h] || 0) + 1;
      });

      const peakHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b);

      // 5️⃣ Optionally, send complaints text to LLM to predict waste type/weight
      const complaintsText = zoneComplaints.map(c => c.description).join("\n");
      let predictedWeight = 0;

      try {
        const llmPrediction = await analyzeWasteText(complaintsText); // return { category: 'wet', weightKg: 10 }
        if (llmPrediction?.weightKg) predictedWeight = llmPrediction.weightKg;
        else predictedWeight = zoneComplaints.length * 5; // fallback: 5kg per complaint
      } catch (err) {
        console.error("LLM prediction failed for zone", zone.name, err.message);
        predictedWeight = zoneComplaints.length * 5; // fallback
      }

      // 6️⃣ Update zone
      zone.predictedWasteKg = predictedWeight;
      zone.peakGarbageHour = peakHour;
      zone.lastUpdated = Date.now();

      updates.push(zone);
    }

    // 7️⃣ Save all updates
    await Promise.all(updates.map(z => z.save()));

    res.status(200).json({
      message: "Predicted waste for all zones updated",
      zones: updates
    });

  } catch (err) {
    console.error("Error in predictWasteForAllZones:", err);
    res.status(500).json({ message: "Failed to predict waste for zones", error: err.message });
  }
};
