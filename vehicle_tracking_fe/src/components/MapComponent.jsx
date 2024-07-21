import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const vehicleIcon = new L.Icon({
  iconUrl: '/vehicle-icon.png',
  iconSize: [25, 25]
});

const MapComponent = () => {
  const [positions, setPositions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:3001/api/vehicle-location');
      setPositions(response.data);
      setCurrentPosition(response.data[response.data.length - 1]);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const initialCenter = positions.length > 0 ? [positions[0].latitude, positions[0].longitude] : [12.950030000000002, 80.18432];

  return (
    <MapContainer center={initialCenter} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {currentPosition && (
        <Marker position={[currentPosition.latitude, currentPosition.longitude]} icon={vehicleIcon} >
             <Popup>
            <div>
              <p><strong>Current Location:</strong></p>
              <p>Latitude: {currentPosition.latitude}</p>
              <p>Longitude: {currentPosition.longitude}</p>
              <p>Timestamp: {currentPosition.timestamp}</p>
            </div>
          </Popup>
            </Marker>
        
      )}
      <Polyline positions={positions.map(pos => [pos.latitude, pos.longitude])} />
    </MapContainer>
  );
};

export default MapComponent;
