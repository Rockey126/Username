const express = require('express');
const axios = require('axios');
const app = express();

// Your Proxy URL
const YOUR_PROXY_API_URL = 'https://numinfo-proxy-api.vercel.app';

// Root route (for home page)
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to Number Info API",
        usage: "/get-info?phone=9876543210"
    });
});

app.get('/get-info', async (req, res) => {
    const { phone } = req.query;

    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        // Fetch from YOUR Proxy
        const response = await axios.get(`${YOUR_PROXY_API_URL}/?num=${phone}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
});

// For Vercel, we export the app
module.exports = app;

// For local testing
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
