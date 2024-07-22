import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';



// Define the custom vehicle icon
const vehicleIcon = new L.Icon({
  iconUrl: '/vehicle-icon.png',
  iconSize: [25, 25]
});

const getLocationDetails = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data && data.display_name) {
      return data.display_name;
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error fetching location details:', error);
    return null;
  }
};

const MapComponent = () => {
  const [vehicleData, setVehicleData] = useState({
    currentLocation: { latitude: 12.950030000000002, longitude: 80.18432 },
    route: []
  });
  const [locationDetails, setLocationDetails] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('wss://vehicletrackingapp.onrender.com');
    setWs(socket);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setVehicleData(data);
      getLocationDetails(data.currentLocation.latitude, data.currentLocation.longitude)
        .then(location => {
          setLocationDetails(location);
        });
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleDateChange = (event) => {
    const value = event.target.value;
    if (ws) {
      ws.send(JSON.stringify({ date: value }));
    }
  };

  const position = [vehicleData.currentLocation.latitude, vehicleData.currentLocation.longitude];
  const routePositions = vehicleData.route.map(point => [point.latitude, point.longitude]);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
     
      <MapContainer center={position} zoom={8} style={{ height: 'calc(100% - 50px)', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={vehicleIcon}>
          <Popup>
            Vehicle is here: [{vehicleData.currentLocation.latitude.toFixed(4)}, {vehicleData.currentLocation.longitude.toFixed(4)}]
            <br />
            Location: {locationDetails}
          </Popup>
        </Marker>
        <Polyline positions={routePositions} color="blue" />
      </MapContainer>
      
      <div className="form-group w-25" style={{ margin: '10px' }}>
        <select id="dateSelect" className="form-control" onChange={handleDateChange}>
          <option value="">Select date</option>
          <option value="2024-07-19">2024-07-19</option>
          <option value="2024-07-21">2024-07-21</option>
          <option value="2024-07-22">2024-07-22</option>
          
        </select>
      </div>
    </div>
  );
};

export default MapComponent;
