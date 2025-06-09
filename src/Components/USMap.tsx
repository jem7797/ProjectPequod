import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import type { Feature, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";

const usStatesUrl =
  "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";

// Function returns default style for states — fresh object each call to avoid stale styles
const getDefaultStyle = (): L.PathOptions => ({
  fillColor: "#00ffff33",   // Light cyan fill with 20% opacity (0x33 hex) for subtle neon glow inside states
  weight: 1,                // Border thickness of the state shapes
  opacity: 0.8,               // Border opacity (fully visible)
  color: "#00ffff77",       // Cyan border color with ~47% opacity (0x77 hex) for a glowing outline
  fillOpacity: 1,           // Fill opacity maxed at 1 to respect fillColor alpha channel transparency
});

const USMap: React.FC = () => {
  const [statesData, setStatesData] = useState<Feature<Geometry> | null>(null);

  useEffect(() => {
    fetch(usStatesUrl)
      .then((res) => res.json())
      .then((data: Feature<Geometry>) => setStatesData(data))
      .catch(console.error);
  }, []);

  const onEachState = (feature: Feature, layer: L.Layer) => {
    layer.on({
      click: () => {
        const name = feature.properties?.name as string;
        alert(`You selected: ${name}`);
      },
      mouseover: (e: L.LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle({
          weight: 2,               // Thicker border to highlight
          color: "#012a81",        //  border on hover for contrast and emphasis
          fillColor: "#00ffff88",  // Brighter cyan to highlight hovered state
          fillOpacity: 0.5,        // Slightly transparent fill so underlying map peeks through
        });
        target.bringToFront();     
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const target = e.target as L.Path;
        // Reset style to default using fresh object to avoid permanent hover color
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
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),  // Horizontal cyan grid lines, very faint
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)  // Vertical cyan grid lines
        `,
          backgroundSize: "40px 40px", // Grid cell size
          zIndex: 1,
          pointerEvents: "none",      // Let mouse events pass through grid overlay
        }}
      />

      <MapContainer
        center={[37.8, -96]}
        zoom={4}
        style={{ height: "100%", width: "100%", zIndex: 2 }}
        zoomControl={false}
      >
        {/* Base map tiles from OpenStreetMap with normal colors */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=""
        />

        {statesData && (
          <GeoJSON
            data={statesData}
            onEachFeature={onEachState}
            style={getDefaultStyle}  // Assign default neon style to states
          />
        )}
      </MapContainer>
    </div>
  );
};

export default USMap;
