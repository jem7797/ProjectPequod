import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";

const usStatesUrl =
  "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";

// Function returns default style for states — fresh object each call
const getDefaultStyle = (): L.PathOptions => ({
  fillColor: "#00ffff33",
  weight: 1,
  opacity: 0.8,
  color: "#00ffff77",
  fillOpacity: 1,
});

const USMap: React.FC = () => {
  const [statesData, setStatesData] = useState<FeatureCollection<Geometry> | null>(null);

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
      const response = await fetch("https://house-price-api-359511347434.us-central1.run.app/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state,
          city,
          beds: bedrooms,
          baths: bathrooms,
          living_space: sqft,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      alert(`Estimated price: $${data.price.toLocaleString()}`);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Something went wrong during prediction. Check console.");
    }
  };

  useEffect(() => {
    fetch(usStatesUrl)
      .then((res) => res.json())
      .then((data: FeatureCollection<Geometry>) => setStatesData(data))
      .catch((err) => {
        console.error("Failed to load GeoJSON:", err);
      });
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
        background: "radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)",
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
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <MapContainer
        center={[37.8, -96]}
        zoom={4}
        style={{ height: "100%", width: "100%", zIndex: 2 }}
        zoomControl={false}
        zoomAnimation={true}
        zoomSnap={0.3}
        zoomDelta={0.9}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='© OpenStreetMap contributors'
        />

        {statesData && (
          <GeoJSON
            data={statesData}
            onEachFeature={onEachState}
            style={getDefaultStyle}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default USMap;
