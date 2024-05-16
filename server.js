const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const dataPath = path.join(__dirname, 'data.json');

// Endpoint to book a meeting
app.post('/api/book', (req, res) => {
    const { userName, expertName } = req.body;

    if (!userName || !expertName) {
        return res.status(400).json({ success: false, message: 'Missing userName or expertName' });
    }

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (err) {
            console.error('Error parsing JSON:', err);
            return res.status(500).json({ success: false, message: 'Error parsing JSON' });
        }

        // Ensure bookings and bookingHistory are initialized
        if (!jsonData.bookings) {
            jsonData.bookings = {};
        }
        if (!jsonData.bookingHistory) {
            jsonData.bookingHistory = [];
        }

        if (!jsonData.bookings[userName]) {
            jsonData.bookings[userName] = [];
        }
        if (!jsonData.bookings[userName].includes(expertName)) {
            jsonData.bookings[userName].push(expertName);
            jsonData.bookingHistory.push({ userName, expertName, timestamp: new Date() });
        }

        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing data file:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            return res.status(200).json({ success: true, message: 'Meeting booked successfully', booked: true });
        });
    });
});

// Endpoint to get all bookings
app.get('/api/bookings', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (err) {
            console.error('Error parsing JSON:', err);
            return res.status(500).json({ success: false, message: 'Error parsing JSON' });
        }

        return res.status(200).json(jsonData.bookings);
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
