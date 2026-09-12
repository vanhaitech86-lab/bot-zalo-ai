// =============================================================================
// VERCEL SERVERLESS FUNCTION: FACEBOOK FANPAGE MESSENGER WEBHOOK HANDLER
// HAITECH BOT OMNICHANNEL - HỆ THỐNG TRỢ LÝ AI CHĂM SÓC KHÁCH HÀNG TỰ ĐỘNG
// Tác giả: HAITECH (Hotline: 0988 739 896 - Email: vanhaitech.86@gmail.com)
// =============================================================================

import { generateReply } from './knowledge-engine.js';

// Token xác thực mặc định (người dùng có thể cấu hình qua biến môi trường hoặc trong dashboard)
const DEFAULT_VERIFY_TOKEN = 'haitech_fanpage_bot_secret';

export default async function handler(req, res) {
    // 1. Cấu hình Headers & CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
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

    // 2. Xử lý GET: Xác minh Webhook từ Meta / Facebook for Developers
    if (req.method === 'GET') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        const expectedToken = process.env.FB_VERIFY_TOKEN || DEFAULT_VERIFY_TOKEN;

        // Nếu Facebook gửi yêu cầu xác thực webhook
        if (mode && token) {
            if (mode === 'subscribe' && token === expectedToken) {
                console.log('✅ Facebook Webhook xác thực thành công 100%!');
                return res.status(200).send(challenge);
            } else {
                console.warn('❌ Xác thực thất bại: Sai Verify Token:', token);
                return res.status(403).send('Verification token mismatch');
            }
        }

        // Truy cập trực tiếp qua trình duyệt để kiểm tra trạng thái
        return res.status(200).json({
            status: 'online',
            channel: 'Facebook Fanpage Messenger',
            system: 'HAITECH BOT Omnichannel Studio',
            verifyTokenDefault: DEFAULT_VERIFY_TOKEN,
            instructions: 'Dán URL này và Verify Token vào Meta for Developers > Messenger > Webhooks',
            timestamp: new Date().toISOString()
        });
    }

    // 3. Xử lý POST: Nhận sự kiện tin nhắn từ Facebook Messenger hoặc Yêu cầu Test từ Dashboard
    if (req.method === 'POST') {
        try {
            const body = req.body || {};

            // 3.1. Hỗ trợ kiểm tra kết nối từ Dashboard (Action Test)
            if (body.action === 'test_connection') {
                const testToken = body.pageAccessToken || process.env.FB_PAGE_ACCESS_TOKEN;
                if (!testToken) {
                    return res.status(400).json({
                        success: false,
                        message: 'Chưa có Page Access Token để kiểm tra'
                    });
                }

                // Gọi API lấy thông tin Fanpage để kiểm tra Token có hợp lệ không
                const testRes = await fetch(`https://graph.facebook.com/v21.0/me?access_token=${testToken}`);
                const testData = await testRes.json();

                if (testData.error) {
                    return res.status(400).json({
                        success: false,
                        error: testData.error.message
                    });
                }

                return res.status(200).json({
                    success: true,
                    page: testData,
                    message: `Kết nối thành công tới Fanpage: ${testData.name} (ID: ${testData.id})`
                });
            }

            // 3.2. Xử lý sự kiện tin nhắn thực tế từ Meta Messenger
            if (body.object === 'page') {
                const entries = body.entry || [];

                for (const entry of entries) {
                    const pageId = entry.id;
                    const messagingEvents = entry.messaging || [];

                    for (const event of messagingEvents) {
                        const senderId = event.sender?.id;
                        const message = event.message;

                        // Bỏ qua tin nhắn do chính Trang gửi (is_echo) hoặc tin không có nội dung văn bản
                        if (!message || message.is_echo || !message.text) {
                            continue;
                        }

                        const userText = message.text.trim();
                        const timeStr = new Date().toLocaleTimeString('vi-VN');
                        console.log(`\n📩 [Facebook - ${timeStr}] Khách (${senderId}) nhắn: "${userText}"`);

                        // Tạo câu trả lời thông minh từ Bộ não AI
                        const replyText = generateReply(userText);
                        console.log(`🤖 [Facebook - ${timeStr}] Bot trả lời: "${replyText.substring(0, 70)}..."`);

                        // Gửi tin nhắn phản hồi về lại Facebook Messenger
                        const pageAccessToken = process.env.FB_PAGE_ACCESS_TOKEN;
                        if (pageAccessToken) {
                            await sendFacebookMessage(pageAccessToken, senderId, replyText);
                        } else {
                            console.log('⚠️ Chưa cấu hình biến môi trường FB_PAGE_ACCESS_TOKEN. Nội dung giả lập:', replyText);
                        }
                    }
                }

                // Luôn trả về 200 OK để Meta xác nhận đã nhận sự kiện
                return res.status(200).send('EVENT_RECEIVED');
            }

            return res.status(404).send('Not a page event');
        } catch (error) {
            console.error('❌ Lỗi xử lý Webhook Facebook:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

// Hàm gửi tin nhắn qua Facebook Graph API (Send API)
async function sendFacebookMessage(pageAccessToken, recipientId, text) {
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${pageAccessToken}`;
    const payload = {
        recipient: {
            id: recipientId
        },
        messaging_type: 'RESPONSE',
        message: {
            text: text
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.error) {
            console.error('⚠️ Lỗi gửi tin nhắn Facebook:', data.error.message);
        } else {
            console.log('✅ Đã gửi phản hồi Facebook Messenger thành công cho khách:', recipientId);
        }
        return data;
    } catch (err) {
        console.error('❌ Ngoại lệ khi gửi Facebook API:', err.message);
        return null;
    }
}
