// Vercel Serverless Function: Zalo OA Webhook Handler
// Handles incoming messages from Zalo OA and replies automatically using AI knowledge

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
        // Zalo sends a challenge parameter or verify token to verify endpoint ownership
        const challenge = req.query.challenge || req.query['hub.challenge'];
        if (challenge) {
            return res.status(200).send(challenge);
        }
        return res.status(200).json({
            status: 'online',
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
            const recipientId = body.recipient?.id;
            const messageObj = body.message;

            // Handle user sending text message
            if (eventName === 'user_send_text' && senderId && messageObj?.text) {
                const userText = messageObj.text.trim();
                console.log(`User ${senderId} sent: "${userText}"`);

                // Generate AI Response based on business logic
                const replyText = generateBotReply(userText);

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

// Smart reply logic
function generateBotReply(query) {
    const qLower = query.toLowerCase().trim();

    if (qLower.includes('giá') || qLower.includes('nhiêu tiền') || qLower.includes('báo giá')) {
        return `Dạ em chào anh/chị ạ! Bên em đang có chính sách giá ưu đãi đặc biệt hôm nay. Anh/chị cho em xin số điện thoại để chuyên viên tư vấn gọi gửi bảng giá chi tiết kèm chiết khấu tốt nhất nhé ạ! 📋 Hotline: 0988 739 896`;
    }
    if (qLower.includes('chào') || qLower.includes('alo') || qLower.includes('hi') || qLower.includes('hello')) {
        return `Dạ em là Trợ lý AI của HAITECH BOT. Rất vui được hỗ trợ anh/chị! Anh/chị đang quan tâm đến sản phẩm hoặc dịch vụ nào để em hỗ trợ tư vấn ngay ạ? 😊`;
    }
    if (qLower.includes('bảo hành') || qLower.includes('hỏng') || qLower.includes('sửa')) {
        return `Dạ sản phẩm bên em luôn cam kết bảo hành chính hãng tận nơi 12 tháng, bảo dưỡng định kỳ đầy đủ ạ!`;
    }
    if (qLower.includes('hotline') || qLower.includes('liên hệ') || qLower.includes('sđt') || qLower.includes('số điện thoại')) {
        return `Dạ anh/chị có thể gọi ngay hotline/Zalo: 0988 739 896 để gặp trực tiếp chuyên viên tư vấn 24/7 ạ!`;
    }

    return `Dạ em đã ghi nhận yêu cầu của anh/chị về "${query}". Em sẽ báo chuyên viên liên hệ hỗ trợ anh/chị ngay nhé ạ! Hotline/Zalo hỗ trợ: 0988 739 896 😊`;
}
