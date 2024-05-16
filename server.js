const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const dataPath = path.join(__dirname, 'data.json');

app.post('/api/book', (req, res) => {
    const { userName, expertName } = req.body;
    if (!userName || !expertName) {
        return res.status(400).json({ success: false, message: 'Missing userName or expertName' });
    }

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ success: false, message: 'Internal server error' });

        let jsonData = JSON.parse(data || '{}');
        jsonData.bookings = jsonData.bookings || {};
        jsonData.bookingHistory = jsonData.bookingHistory || [];

        if (!jsonData.bookings[userName]) {
            jsonData.bookings[userName] = [];
        }
        if (!jsonData.bookings[userName].includes(expertName)) {
            jsonData.bookings[userName].push(expertName);
            jsonData.bookingHistory.push({ userName, expertName, timestamp: new Date() });
        }

        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
            return res.status(200).json({ success: true, message: 'Meeting booked successfully', booked: true });
        });
    });
});

app.get('/api/bookings', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ success: false, message: 'Internal server error' });
        let jsonData = JSON.parse(data || '{}');
        return res.status(200).json(jsonData.bookings);
    });
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
