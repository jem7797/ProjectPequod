import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";

const usStatesUrl =
  "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";

const getDefaultStyle = (): L.PathOptions => ({
  fillColor: "#00ffff33",
  weight: 1,
  opacity: 0.8,
  color: "#00ffff77",
  fillOpacity: 1,
});

const USMap: React.FC = () => {
  const [statesData, setStatesData] = useState<FeatureCollection<Geometry> | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");
  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [sqft, setSqft] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);

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
      setLoading(true);
      setPredictedPrice(null);

      const response = await fetch(
        "https://house-price-api-359511347434.us-central1.run.app/predict",
        {
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
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setPredictedPrice(data.price - 15000);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Something went wrong during prediction. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async () => {
    setModalVisible(false);
    await predictPrice({
      state: selectedState,
      city,
      bedrooms,
      bathrooms,
      sqft,
    });
  };

  const handleModalClose = () => {
    setCity("");
    setBedrooms(2);
    setBathrooms(1);
    setSqft(1000);
    setModalVisible(false);
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
      click: () => {
        const stateName = feature.properties?.name as string;
        setSelectedState(stateName);
        setModalVisible(true);
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

      {/* Spinner Overlay */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9998,
            background: "rgba(0, 0, 0, 0.8)",
            color: "#0ff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontFamily: "monospace",
          }}
        >
          <div className="spinner" style={{ marginBottom: "1rem" }}>
            <div
              style={{
                border: "5px solid #0ff",
                borderTop: "5px solid transparent",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
          Consulting Ahab...
        </div>
      )}

      {/* Input Modal */}
      {modalVisible && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            background: "#111",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 0 20px #0ff",
            color: "#0ff",
            width: "300px",
          }}
        >
          {/* Exit Button */}
          <button
            onClick={handleModalClose}
            style={{
              position: "absolute",
              top: "8px",
              right: "12px",
              background: "transparent",
              border: "none",
              color: "#0ff",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
            aria-label="Close Modal"
          >
            ×
          </button>

          <h3>Predict for {selectedState}</h3>
          <div style={{ marginBottom: "1rem" }}>
            <label>City: </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label>Bedrooms: {bedrooms}</label>
            <input
              type="range"
              min={0}
              max={10}
              value={bedrooms}
              onChange={(e) => setBedrooms(parseInt(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label>Bathrooms: {bathrooms}</label>
            <input
              type="range"
              min={0}
              max={10}
              value={bathrooms}
              onChange={(e) => setBathrooms(parseInt(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label>Sq Ft: {sqft}</label>
            <input
              type="range"
              min={200}
              max={10000}
              step={100}
              value={sqft}
              onChange={(e) => setSqft(parseInt(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <button
            onClick={handlePredict}
            style={{
              marginTop: "1rem",
              width: "100%",
              background: "#0ff",
              color: "#000",
              fontWeight: "bold",
              padding: "0.5rem",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Predict
          </button>
        </div>
      )}

      {/* Price Result Modal */}
      {predictedPrice !== null && (
        <div
          onClick={() => setPredictedPrice(null)}
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: "#0a0a0a",
            border: "2px solid #0ff",
            padding: "1rem 2rem",
            borderRadius: "12px",
            color: "#0ff",
            fontSize: "1.3rem",
            textAlign: "center",
            fontWeight: "bold",
            boxShadow: "0 0 15px #0ff",
            cursor: "pointer",
          }}
        >
          🏠 Estimated Price: ${predictedPrice.toLocaleString()}
        </div>
      )}

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
          attribution="© OpenStreetMap contributors"
        />

        {statesData && (
          <GeoJSON
            data={statesData}
            onEachFeature={onEachState}
            style={getDefaultStyle}
          />
        )}
      </MapContainer>

      {/* Spinner animation keyframes */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default USMap;
