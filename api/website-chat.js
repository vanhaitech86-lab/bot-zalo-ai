// =============================================================================
// VERCEL SERVERLESS FUNCTION: WEBSITE LIVECHAT AI WIDGET API
// HAITECH BOT OMNICHANNEL - HỆ THỐNG TRỢ LÝ AI CHĂM SÓC KHÁCH HÀNG TỰ ĐỘNG
// Tác giả: HAITECH (Hotline: 0988 739 896 - Email: vanhaitech.86@gmail.com)
// =============================================================================

import { generateReply, getKnowledgeBase } from './knowledge-engine.js';

export default async function handler(req, res) {
    // 1. Cấu hình Headers & CORS để mọi website đều có thể nhúng và gọi API
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const kb = getKnowledgeBase();

    // 2. Xử lý GET: Kiểm tra trạng thái hoặc tải cấu hình Widget
    if (req.method === 'GET') {
        return res.status(200).json({
            status: 'online',
            channel: 'Website LiveChat Widget',
            botName: kb.botName || 'HAITECH BOT',
            phone: kb.phone || '0988 739 896',
            welcomeMessage: kb.welcomeMessage,
            timestamp: new Date().toISOString()
        });
    }

    // 3. Xử lý POST: Nhận tin nhắn từ khách truy cập Website
    if (req.method === 'POST') {
        try {
            const body = req.body || {};
            const userMessage = (body.message || '').trim();

            if (!userMessage) {
                return res.status(400).json({
                    success: false,
                    message: 'Tin nhắn không được để trống'
                });
            }

            const timeStr = new Date().toLocaleTimeString('vi-VN');
            console.log(`\n💬 [Website LiveChat - ${timeStr}] Khách nhắn: "${userMessage}"`);

            // Tạo câu trả lời thông minh từ Bộ não AI dùng chung
            const replyText = generateReply(userMessage, kb);
            console.log(`🤖 [Website LiveChat - ${timeStr}] Bot trả lời: "${replyText.substring(0, 70)}..."`);

            return res.status(200).json({
                success: true,
                reply: replyText,
                botName: kb.botName || 'HAITECH BOT',
                phone: kb.phone || '0988 739 896',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('❌ Lỗi xử lý tin nhắn Website LiveChat:', error);
            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
