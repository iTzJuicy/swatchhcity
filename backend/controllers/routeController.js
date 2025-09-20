import Truck from "../models/Truck.js";
import Zone from "../models/Zone.js";
import axios from "axios";

const OSRM_BASE = "http://router.project-osrm.org/route/v1/driving";

// Nearest-neighbor ordering
const nearestNeighbor = (depot, zones) => {
  const ordered = [];
  let current = depot;
  const remaining = [...zones];

  while (remaining.length) {
    remaining.sort(
      (a, b) =>
        Math.hypot(current[0] - a.coordinates[0], current[1] - a.coordinates[1]) -
        Math.hypot(current[0] - b.coordinates[0], current[1] - b.coordinates[1])
    );
    const next = remaining.shift();
    ordered.push(next);
    current = next.coordinates;
  }

  return ordered;
};

export const getOptimalRoutes = async (req, res) => {
  try {
    const zones = await Zone.find({ complaints: { $gt: 0 }, assignedTruck: null });
    const trucks = await Truck.find({ status: "idle" });

    if (!zones.length || !trucks.length) {
      return res.status(400).json({ message: "No zones or trucks available" });
    }

    const depot = [77.5946, 12.9716]; // OSRM expects [lng, lat]
    const routes = [];
    let remainingZones = [...zones];

    for (const truck of trucks) {
      if (!remainingZones.length) break;

      const maxZonesPerTruck = Math.min(10, Math.ceil(remainingZones.length / trucks.length));
      const truckZones = remainingZones.splice(0, maxZonesPerTruck);
      const orderedZones = nearestNeighbor(depot, truckZones);

      // Prepare coordinates string for OSRM
      const coords = [depot, ...orderedZones.map(z => z.coordinates), depot]
        .map(c => c.join(","))
        .join(";");

      console.log(`Truck: ${truck.name}`);
      console.log("OSRM coordinates:", coords);

      try {
        const response = await axios.get(`${OSRM_BASE}/${coords}?overview=false&steps=true`);
        const osrmRoute = response.data.routes?.[0];

        if (!osrmRoute || !osrmRoute.legs?.length) {
          console.warn(`No route returned by OSRM for truck ${truck.name}`);
          continue; // skip this truck instead of failing
        }

        const routeZones = orderedZones.map((zone, i) => ({
          zoneId: zone._id,
          zoneName: zone.name,
          complaints: zone.complaints,
          predictedWasteKg: zone.predictedWasteKg,
          coordinates: zone.coordinates,
          distance: (osrmRoute.legs[i]?.distance / 1000).toFixed(2),
          duration: (osrmRoute.legs[i]?.duration / 60).toFixed(2),
        }));

        // Update truck
        truck.status = "on-route";
        truck.assignedZones = orderedZones.map(z => z._id);
        await truck.save();

        // Update zones
        for (const z of orderedZones) {
          z.assignedTruck = truck._id;
          await z.save();
        }

        routes.push({
          truckId: truck._id,
          truckName: truck.name,
          routeZones,
          totalDistance: routeZones.reduce((sum, z) => sum + parseFloat(z.distance), 0).toFixed(2),
          totalWaste: routeZones.reduce((sum, z) => sum + (z.predictedWasteKg || 0), 0),
          estimatedTime: routeZones.reduce((sum, z) => sum + parseFloat(z.duration), 0).toFixed(2),
        });

      } catch (err) {
        console.error(`OSRM API error for truck ${truck.name}:`, err.message);
        // Skip truck instead of returning 500
        continue;
      }
    }

    if (!routes.length) {
      return res.status(500).json({ message: "No routes could be generated" });
    }

    res.status(200).json({ message: "Optimal routes generated successfully", routes });

  } catch (err) {
    console.error("Error generating optimal routes:", err);
    res.status(500).json({ message: "Failed to generate optimal routes", error: err.message });
  }
};
