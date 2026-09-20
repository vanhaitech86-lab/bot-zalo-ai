// =============================================================================
// VERCEL SERVERLESS FUNCTION: ZALO OA WEBHOOK HANDLER
// HAITECH BOT OMNICHANNEL - HỆ THỐNG TRỢ LÝ AI CHĂM SÓC KHÁCH HÀNG TỰ ĐỘNG
// Tác giả: HAITECH (Hotline: 0988 739 896 - Email: vanhaitech.86@gmail.com)
// =============================================================================

import { generateReplyAsync } from './knowledge-engine.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 1. Handle GET: Zalo Webhook Verification
    if (req.method === 'GET') {
        const challenge = req.query.challenge || req.query['hub.challenge'];
        if (challenge) {
            return res.status(200).send(challenge);
        }
        return res.status(200).json({
            status: 'online',
            channel: 'Zalo Official Account (OA)',
            service: 'HAITECH BOT Zalo OA Webhook',
            time: new Date().toISOString()
        });
    }

    // 2. Handle POST: Incoming events from Zalo OA
    if (req.method === 'POST') {
        try {
            const body = req.body || {};
            console.log('Zalo OA Webhook received:', JSON.stringify(body));

            const eventName = body.event_name;
            const senderId = body.sender?.id;
            const messageObj = body.message;

            // Handle user sending text message
            if (eventName === 'user_send_text' && senderId && messageObj?.text) {
                const userText = messageObj.text.trim();
                console.log(`User ${senderId} sent: "${userText}"`);

                // Generate AI Response from Dual-Brain unified engine
                const result = await generateReplyAsync(userText);
                const replyText = result.reply;
                console.log(`[Zalo OA] [${result.model}] Bot reply: "${replyText}"`);

                // If OA Access Token is configured, send reply directly to user via Zalo Open API
                const oaAccessToken = process.env.ZALO_OA_ACCESS_TOKEN;
                if (oaAccessToken) {
                    await sendZaloOAReply(oaAccessToken, senderId, replyText);
                } else {
                    console.log('OA Access Token not configured yet. Simulated reply:', replyText);
                }

                return res.status(200).json({
                    success: true,
                    reply: replyText,
                    sender: senderId
                });
            }

            // Acknowledge other events (user_seen_message, user_received_message, etc.)
            return res.status(200).json({ success: true, message: 'Event received' });
        } catch (error) {
            console.error('Error handling Zalo Webhook:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

// Function to reply via Zalo OpenAPI
async function sendZaloOAReply(accessToken, userId, messageText) {
    const url = 'https://openapi.zalo.me/v3.0/oa/message/cs';
    const payload = {
        recipient: {
            user_id: userId
        },
        message: {
            text: messageText
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access_token': accessToken
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Zalo OA send message response:', data);
        return data;
    } catch (err) {
        console.error('Failed to send Zalo OA message:', err);
        return null;
    }
}
