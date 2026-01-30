const { Telegraf } = require('telegraf');
const axios = require('axios');
const express = require('express');

// Using your provided token
const bot = new Telegraf('8526907845:AAHhTigjev75sSM97ZP3BQoC4L0SA_tUV9E');
const app = express();

// Your proxy URL from previous images
const PROXY_URL = 'https://numinfo-proxy-api.vercel.app';

// Middleware for Vercel to handle Telegram updates
app.use(bot.webhookCallback('/api/bot'));

bot.start((ctx) => {
    ctx.reply('Welcome! Send me a phone number (digits only) to get information.');
});

bot.on('text', async (ctx) => {
    const phone = ctx.message.text.trim();

    // Validate that it is a number
    if (!/^\d+$/.test(phone)) {
        return ctx.reply('❌ Please send a valid phone number containing only digits.');
    }

    await ctx.reply('🔍 Searching... please wait.');

    try {
        // Fetching data from your proxy API
        const response = await axios.get(`${PROXY_URL}/?num=${phone}`);
        
        // Formats the JSON data for Telegram
        const message = 📊 **Results for ${phone}:**\n\n\`\`\`json\n${JSON.stringify(response.data, null, 2)}\n\`\`\`;
        
        ctx.replyWithMarkdown(message);
    } catch (error) {
        ctx.reply('⚠️ Error: The lookup service is currently unavailable. Please try again later.');
        console.error('API Error:', error.message);
    }
});

// Needed for Vercel deployment
module.exports = app;