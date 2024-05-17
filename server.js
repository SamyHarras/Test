const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const app = express();
app.use(express.json());

const serviceAccount = require('./serviceAccountKey.json'); // Path to your service account key file

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.post('/api/book', async (req, res) => {
    const { userName, expertName } = req.body;
    if (!userName || !expertName) {
        return res.status(400).json({ success: false, message: 'Missing userName or expertName' });
    }

    try {
        const bookingsRef = db.collection('bookings').doc(userName);
        const userBookings = await bookingsRef.get();

        if (!userBookings.exists) {
            await bookingsRef.set({ experts: [expertName] });
        } else {
            const experts = userBookings.data().experts;
            if (!experts.includes(expertName)) {
                await bookingsRef.update({
                    experts: admin.firestore.FieldValue.arrayUnion(expertName)
                });
            }
        }

        await db.collection('bookingHistory').add({
            userName,
            expertName,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.status(200).json({ success: true, message: 'Meeting booked successfully', booked: true });
    } catch (error) {
        console.error('Error booking meeting:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const snapshot = await db.collection('bookings').get();
        const bookings = {};
        snapshot.forEach(doc => {
            bookings[doc.id] = doc.data().experts;
        });
        return res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/api/history', async (req, res) => {
    try {
        const snapshot = await db.collection('bookingHistory').orderBy('timestamp', 'desc').get();
        const history = [];
        snapshot.forEach(doc => {
            const { userName, expertName, timestamp } = doc.data();
            history.push(`${userName} booked a meeting with ${expertName} at ${timestamp.toDate()}`);
        });
        return res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching booking history:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
