import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { GeoJSONProps } from 'react-leaflet';
import L from 'leaflet';
import type { Feature, Geometry } from 'geojson';
import 'leaflet/dist/leaflet.css';

// ... rest of your code


// URL to US states GeoJSON
const usStatesUrl = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

// Define style for polygons
const defaultStyle: GeoJSONProps['style'] = {
  fillColor: '#00ffff',
  weight: 1,
  opacity: 1,
  color: 'black',
  fillOpacity: 0.3,
};

const USMap: React.FC = () => {
  const [statesData, setStatesData] = useState<Feature<Geometry> | null>(null);
  // Removed unused selectedState state variable

  useEffect(() => {
    fetch(usStatesUrl)
      .then(res => res.json())
      .then((data: Feature<Geometry>) => setStatesData(data))
      .catch(console.error);
  }, []);

  const onEachState = (feature: Feature, layer: L.Layer) => {
    layer.on({
      click: () => {
        const name = feature.properties?.name as string;
        // setSelectedState(name); // Removed unused setter
        alert(`You clicked: ${name}`);
      },
      mouseover: (e: L.LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle({
          weight: 3,
          color: '#00f',
          fillOpacity: 0.7,
        });
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle(defaultStyle as L.PathOptions);
      },
    });
  };

  return (
    <MapContainer center={[37.8, -96]} zoom={4} style={{ height: '80vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {statesData && (
        <GeoJSON
          data={statesData}
          onEachFeature={onEachState}
          style={defaultStyle}
        />
      )}
    </MapContainer>
  );
};

export default USMap;
