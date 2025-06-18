import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import type { Feature, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";

const usStatesUrl =
  "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";

// Function returns default style for states — fresh object each call to avoid stale styles
const getDefaultStyle = (): L.PathOptions => ({
  fillColor: "#00ffff33", // Light cyan fill with 20% opacity (0x33 hex) for subtle neon glow inside states
  weight: 1, // Border thickness of the state shapes
  opacity: 0.8, // Border opacity (mostly visible)
  color: "#00ffff77", // Cyan border color with ~47% opacity (0x77 hex) for a glowing outline
  fillOpacity: 1, // Fill opacity maxed at 1 to respect fillColor alpha channel transparency
});

const USMap: React.FC = () => {
  const [statesData, setStatesData] = useState<Feature<Geometry> | null>(null);

  const predictPrice = async ({
    state,
    city,
    bedrooms,
    bathrooms,
    sqft,
  }: {
    state: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
  }) => {
    try {
      const response = await fetch("https://housing-model-api-359511347434.us-central1.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state, city, bedrooms, bathrooms, sqft }),
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      alert(`Estimated price: $${data.predicted_price}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong during prediction.");
    }
  };

  useEffect(() => {
    fetch(usStatesUrl)
      .then((res) => res.json())
      .then((data: Feature<Geometry>) => setStatesData(data))
      .catch(console.error);
  }, []);

  const onEachState = (feature: Feature, layer: L.Layer) => {
    layer.on({
      click: async () => {
        const stateName = feature.properties?.name as string;

        const city = prompt(`Enter the city/borough for ${stateName}:`);
        if (!city) return;

        const bedrooms = parseInt(prompt("Enter number of bedrooms:") || "0", 10);
        if (isNaN(bedrooms)) return;

        const bathrooms = parseInt(prompt("Enter number of bathrooms:") || "0", 10);
        if (isNaN(bathrooms)) return;

        const sqft = parseInt(prompt("Enter square footage:") || "0", 10);
        if (isNaN(sqft)) return;

        await predictPrice({
          state: stateName,
          city,
          bedrooms,
          bathrooms,
          sqft,
        });
      },
      mouseover: (e: L.LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle({
          weight: 2,
          color: "#012a81",
          fillColor: "#00ffff88",
          fillOpacity: 0.5,
        });
        target.bringToFront();
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle(getDefaultStyle());
      },
    });
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        background:
          "radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)",
        overflow: "hidden",
      }}
    >
      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),  /* Horizontal cyan grid lines, very faint */
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px) /* Vertical cyan grid lines */
          `,
          backgroundSize: "40px 40px", // Grid cell size
          zIndex: 1,
          pointerEvents: "none", // Let mouse events pass through grid overlay
        }}
      />

      <MapContainer
        center={[37.8, -96]}
        zoom={4}
        style={{ height: "100%", width: "100%", zIndex: 2 }}
        zoomControl={false}
        zoomAnimation={true} // Enable zoom animation for smooth transitions
        zoomSnap={0.3} // Smaller snap to allow fractional zoom levels (smoother zoom)
        zoomDelta={0.9} // Smaller zoom step increments for smooth zooming
      >
        {/* Base map tiles from OpenStreetMap with normal colors */}
        <TileLayer
url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution=""
        />

        {statesData && (
          <GeoJSON
            data={statesData}
            onEachFeature={onEachState}
            style={getDefaultStyle} // Assign default neon style to states
          />
        )}
      </MapContainer>
    </div>
  );
};

export default USMap;
