const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000; // Use the port provided by Render.com or default to 3000

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dataFile = 'data.json';

// Read data from JSON file
function readData() {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return { bookings: {}, bookingHistory: [] };
    }
}

// Write data to JSON file
function writeData(data) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data:', error);
    }
}

// Handle API requests
app.get('/api/bookings', (req, res) => {
    const data = readData();
    res.json(data.bookings);
});

app.get('/api/history', (req, res) => {
    const data = readData();
    res.json(data.bookingHistory);
});

app.post('/api/book', (req, res) => {
    console.log('Received booking request:', req.body); // Log the incoming request

    const { userName, expertName } = req.body;
    const data = readData();

    if (!data.bookings[userName]) {
        data.bookings[userName] = [];
    }

    let message;
    let booked = false;
    if (data.bookings[userName].includes(expertName)) {
        data.bookings[userName] = data.bookings[userName].filter(expert => expert !== expertName);
        data.bookingHistory.push(`${userName} cancelled booking with ${expertName}`);
        message = `Cancelled booking with ${expertName}`;
    } else {
        data.bookings[userName].push(expertName);
        data.bookingHistory.push(`${userName} booked a meeting with ${expertName}`);
        booked = true;
        message = `Booked a meeting with ${expertName}`;
    }

    writeData(data); // Save changes to the JSON file

    console.log('Updated bookings:', data.bookings); // Log the updated bookings
    console.log('Updated booking history:', data.bookingHistory); // Log the updated booking history

    res.json({ success: true, booked, message }); // Send the response
});

app.post('/api/clear', (req, res) => {
    const data = { bookings: {}, bookingHistory: [] };
    writeData(data);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
