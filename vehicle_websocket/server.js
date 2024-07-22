const WebSocket = require('ws');
const dotenv = require('dotenv')
const routeData = require("./data/routeData.json")

dotenv.config()

const port = process.env.PORT;

const wss = new WebSocket.Server({ port });



wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send a default route
    let selectedDate = '2024-07-21'; // Default date
    let route = routeData[selectedDate] || [];
    let index = 0;
    let vehicleData = {
        id: 1,
        currentLocation: route[index],
        route: route.slice(0, index + 1)
    };

    ws.send(JSON.stringify(vehicleData));

    // Update the route data based on the selected date
    ws.on('message', (message) => {
        const { date } = JSON.parse(message);
        selectedDate = date;
        route = routeData[selectedDate] || [];
        index = 0;
        vehicleData = {
            id: 1,
            currentLocation: route[index],
            route: route.slice(0, index + 1)
        };
        ws.send(JSON.stringify(vehicleData));
    });

    // Set up an interval to send updates
    const interval = setInterval(() => {
        index = (index + 1) % route.length;
        vehicleData.currentLocation = route[index];
        vehicleData.route = route.slice(0, index + 1);
        ws.send(JSON.stringify(vehicleData));
    }, 5000); // Update every 5 seconds

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});

console.log(`WebSocket server running at ws://localhost:${port}`);
