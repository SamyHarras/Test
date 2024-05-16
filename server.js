const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Use the port provided by Render.com or default to 3000

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dataFilePath = path.join(__dirname, 'data.json');

// Function to read data from the JSON file
const readDataFromFile = () => {
    if (!fs.existsSync(dataFilePath)) {
        return { bookings: {}, bookingHistory: [] };
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
};

// Function to write data to the JSON file
const writeDataToFile = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Load initial data
let { bookings, bookingHistory } = readDataFromFile();

// Handle API requests
app.get('/api/bookings', (req, res) => {
    res.json(bookings);
});

app.get('/api/history', (req, res) => {
    res.json(bookingHistory);
});

app.post('/api/book', (req, res) => {
    console.log('Received booking request:', req.body); // Log the incoming request

    const { userName, expertName } = req.body;
    if (!userName || !expertName) {
        return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    if (!bookings[userName]) {
        bookings[userName] = [];
    }

    let message;
    let booked = false;
    if (bookings[userName].includes(expertName)) {
        bookings[userName] = bookings[userName].filter(expert => expert !== expertName);
        bookingHistory.push(`${userName} cancelled booking with ${expertName}`);
        message = `Cancelled booking with ${expertName}`;
    } else {
        bookings[userName].push(expertName);
        bookingHistory.push(`${userName} booked a meeting with ${expertName}`);
        booked = true;
        message = `Booked a meeting with ${expertName}`;
    }

    // Write updated data to the JSON file
    writeDataToFile({ bookings, bookingHistory });

    console.log('Updated bookings:', bookings); // Log the updated bookings
    console.log('Updated booking history:', bookingHistory); // Log the updated booking history

    res.json({ success: true, booked, message }); // Send the response
});

app.post('/api/clear', (req, res) => {
    bookings = {};
    bookingHistory = [];
    writeDataToFile({ bookings, bookingHistory }); // Write the cleared data to the JSON file
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
