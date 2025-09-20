import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import L from "leaflet";

// Custom truck icon
const truckIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448585.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// Bangalore depot coordinates
const DEPOT = [12.9716, 77.5946];

export default function WasteMap({ zones = [], routes = [] }) {
  // Center map at depot
  const center = DEPOT;

  // Color zones based on predicted waste
  const getZoneColor = (weight) => {
    if (weight >= 120) return "red";
    if (weight >= 100) return "orange";
    if (weight > 0) return "yellow";
    return "green";
  };

  return (
    <MapContainer center={center} zoom={12} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
      />

      {/* Zones */}
      {zones.map((zone) => (
        <CircleMarker
          key={zone._id}
          center={[zone.coordinates[1], zone.coordinates[0]]} // [lat, lng]
          radius={10}
          color={getZoneColor(zone.predictedWasteKg)}
          fillOpacity={0.5}
        >
          <Popup>
            <strong>{zone.name}</strong>
            <br />
            Predicted Waste: {zone.predictedWasteKg} kg
            <br />
            Complaints: {zone.complaints}
          </Popup>
        </CircleMarker>
      ))}

      {/* Truck routes */}
      {routes.map((truck) => {
        // Polyline starts at depot, goes through zones, ends at depot
        const polylinePoints = [
          DEPOT,
          ...truck.routeZones.map((z) => [z.coordinates[1], z.coordinates[0]]),
          DEPOT,
        ];

        return (
          <React.Fragment key={truck.truckId}>
            <Polyline positions={polylinePoints} color="blue" />
            <Marker position={polylinePoints[0]} icon={truckIcon}>
              <Popup>
                <strong>Truck: {truck.truckName}</strong>
                <br />
                Assigned Zones: {truck.routeZones.map((z) => z.zoneName).join(", ")}
              </Popup>
            </Marker>
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
}
