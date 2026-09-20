// =============================================================================
// VERCEL SERVERLESS FUNCTION: WEBSITE LIVECHAT AI WIDGET API & GPT TESTER
// HAITECH BOT OMNICHANNEL - HỆ THỐNG TRỢ LÝ AI CHĂM SÓC KHÁCH HÀNG TỰ ĐỘNG
// Tác giả: HAITECH (Hotline: 0988 739 896 - Email: vanhaitech.86@gmail.com)
// =============================================================================

import { generateReplyAsync, getKnowledgeBase, callOpenAiGpt } from './knowledge-engine.js';

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
            gptEnabled: Boolean(kb.gptConfig?.enabled),
            gptModel: kb.gptConfig?.model || 'gpt-4o-mini',
            timestamp: new Date().toISOString()
        });
    }

    // 3. Xử lý POST: Nhận tin nhắn từ khách truy cập Website hoặc kiểm tra GPT
    if (req.method === 'POST') {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

            // 3.1. Hỗ trợ Dashboard Test trực tiếp OpenAI GPT
            if (body.action === 'test_gpt') {
                const testPrompt = body.prompt || "Chào bạn, hãy giới thiệu ngắn gọn trong 1 câu bạn là ai.";
                const testKb = {
                    ...kb,
                    gptConfig: {
                        ...kb.gptConfig,
                        apiKey: body.apiKey || kb.gptConfig?.apiKey,
                        model: body.model || kb.gptConfig?.model || 'gpt-4o-mini',
                        temperature: body.temperature ?? kb.gptConfig?.temperature ?? 0.7,
                        systemPrompt: body.systemPrompt || kb.gptConfig?.systemPrompt
                    }
                };

                const testRes = await callOpenAiGpt(testPrompt, testKb);
                return res.status(200).json({
                    success: true,
                    reply: testRes.reply,
                    model: testRes.model,
                    usage: testRes.usage
                });
            }

            // 3.2. Xử lý tin nhắn khách hàng gửi đến Widget LiveChat
            const userMessage = (body.message || '').trim();
            if (!userMessage) {
                return res.status(400).json({
                    success: false,
                    message: 'Tin nhắn không được để trống'
                });
            }

            const timeStr = new Date().toLocaleTimeString('vi-VN');
            console.log(`\n💬 [Website LiveChat - ${timeStr}] Khách nhắn: "${userMessage}"`);

            // Tạo customKb nếu client gửi kèm cấu hình GPT tạm từ Dashboard
            let runtimeKb = kb;
            if (body.gptConfig) {
                runtimeKb = {
                    ...kb,
                    gptConfig: {
                        ...kb.gptConfig,
                        ...body.gptConfig
                    }
                };
            }

            // Gọi Động Cơ Trí Tuệ Kép (Bộ Não 1 + Bộ Não 2 GPT)
            const result = await generateReplyAsync(userMessage, runtimeKb);
            console.log(`🤖 [Website LiveChat - ${timeStr}] [${result.model}] Bot trả lời: "${result.reply.substring(0, 70)}..."`);

            return res.status(200).json({
                success: true,
                reply: result.reply,
                brainUsed: result.brainUsed,
                model: result.model,
                botName: runtimeKb.botName || 'HAITECH BOT',
                phone: runtimeKb.phone || '0988 739 896',
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
