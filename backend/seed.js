// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Truck from "./models/Truck.js";
import Zone from "./models/Zone.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/swatchhcity";

const zonesData = [
  { name: "Koramangala", coordinates: [77.6412, 12.9340], complaints: 5, predictedWasteKg: 120 },
  { name: "Indiranagar", coordinates: [77.6406, 12.9716], complaints: 4, predictedWasteKg: 100 },
  { name: "Whitefield", coordinates: [77.7480, 12.9698], complaints: 3, predictedWasteKg: 90 },
  { name: "Malleshwaram", coordinates: [77.5672, 13.0104], complaints: 6, predictedWasteKg: 130 },
  { name: "Jayanagar", coordinates: [77.5946, 12.9250], complaints: 5, predictedWasteKg: 110 },
  { name: "Banaswadi", coordinates: [77.6281, 13.0220], complaints: 2, predictedWasteKg: 80 },
  { name: "HSR Layout", coordinates: [77.6416, 12.9121], complaints: 3, predictedWasteKg: 95 },
  { name: "Yelahanka", coordinates: [77.5938, 13.0846], complaints: 1, predictedWasteKg: 60 },
  { name: "Rajajinagar", coordinates: [77.5550, 12.9976], complaints: 4, predictedWasteKg: 105 },
  { name: "Electronic City", coordinates: [77.6556, 12.8442], complaints: 5, predictedWasteKg: 115 },
];

const trucksData = [
  { name: "Truck 1", licensePlate: "KA01AB1111", capacity: 500, status: "idle" },
  { name: "Truck 2", licensePlate: "KA01AB2222", capacity: 400, status: "idle" },
  { name: "Truck 3", licensePlate: "KA01AB3333", capacity: 600, status: "idle" },
  { name: "Truck 4", licensePlate: "KA01AB4444", capacity: 450, status: "on-route" },
  { name: "Truck 5", licensePlate: "KA01AB5555", capacity: 500, status: "idle" },
  { name: "Truck 6", licensePlate: "KA01AB6666", capacity: 550, status: "on-route" },
  { name: "Truck 7", licensePlate: "KA01AB7777", capacity: 500, status: "idle" },
  { name: "Truck 8", licensePlate: "KA01AB8888", capacity: 400, status: "idle" },
  { name: "Truck 9", licensePlate: "KA01AB9999", capacity: 600, status: "idle" },
  { name: "Truck 10", licensePlate: "KA01AB1010", capacity: 450, status: "idle" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await Zone.deleteMany({});
    await Truck.deleteMany({});

    // Create zones
    const createdZones = await Zone.insertMany(zonesData);
    console.log("Zones seeded:", createdZones.map(z => z.name));

    // Assign some zones to on-route trucks randomly
    const onRouteTrucks = trucksData.filter(t => t.status === "on-route");
    onRouteTrucks.forEach((truck, i) => {
      truck.assignedZones = [createdZones[i]._id];
    });

    // Create trucks
    const createdTrucks = await Truck.insertMany(trucksData);
    console.log("Trucks seeded:", createdTrucks.map(t => `${t.name} (${t.status})`));

    console.log("Seeding complete!");
    mongoose.disconnect();
  } catch (err) {
    console.error("Seeder error:", err);
  }
};

seedDB();
