const fs = require('fs');

// Coordinates from 'Interactive Polyline Encoder Utility'
const coordinates = [
  [80.18432, 12.950030000000002],
  [80.14037, 12.950030000000002],
  [80.09471, 12.900540000000001],
  [80.01918, 12.789740000000002],
  [79.82484000000001, 12.425120000000001],
  [79.64829, 12.22582],
  [79.54289, 12.030130000000002],
  [79.28692000000001, 11.67637],
  [78.8883, 11.22516],
  [78.70977, 10.7911],
  [79.13054000000001, 10.777610000000001]
];

// Start time for the timestamps
const startTime = Date.now();
const interval = 5000; // 5 seconds

const vehicleData = coordinates.map((coord, index) => {
  const timestamp = new Date(startTime + index * interval).toISOString();
  return {
    latitude: coord[1],
    longitude: coord[0],
    timestamp: timestamp
  };
});

fs.writeFileSync('vehicleData.json', JSON.stringify(vehicleData, null, 2));

console.log('vehicleData.json file has been created.');
