// =============================================================================
// VERCEL SERVERLESS FUNCTION: WEBSITE LIVECHAT AI WIDGET API & MULTI-AI TESTER
// HAITECH BOT OMNICHANNEL - HỆ THỐNG TRỢ LÝ AI CHĂM SÓC KHÁCH HÀNG TỰ ĐỘNG
// Hỗ trợ: Google Gemini (Free), GroqCloud (Free), OpenRouter, DeepSeek, OpenAI
// Tác giả: HAITECH (Hotline: 0988 739 896 - Email: vanhaitech.86@gmail.com)
// =============================================================================

import { generateReplyAsync, getKnowledgeBase, callAiModel, AI_PROVIDERS } from './knowledge-engine.js';

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
        const aiConfig = kb.aiConfig || kb.gptConfig || {};
        return res.status(200).json({
            status: 'online',
            channel: 'Website LiveChat Widget',
            botName: kb.botName || 'HAITECH BOT',
            phone: kb.phone || '0988 739 896',
            welcomeMessage: kb.welcomeMessage,
            aiEnabled: Boolean(aiConfig.enabled),
            aiProvider: aiConfig.provider || 'gemini',
            aiModel: aiConfig.model || 'gemini-1.5-flash',
            providersAvailable: Object.keys(AI_PROVIDERS),
            timestamp: new Date().toISOString()
        });
    }

    // 3. Xử lý POST: Nhận tin nhắn từ khách truy cập Website hoặc kiểm tra AI Model
    if (req.method === 'POST') {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

            // 3.1. Hỗ trợ Dashboard Test trực tiếp các mô hình AI (Google Gemini, Groq, OpenAI, etc.)
            // 3.1. Hành động kiểm tra kết nối AI Model từ Dashboard
            if (body.action === 'list_gemini_models') {
                const apiKey = (body.apiKey || kb.aiConfig?.apiKey || '').trim();
                if (!apiKey) {
                    return res.status(400).json({ success: false, error: 'Chưa cung cấp API Key để truy vấn models' });
                }
                try {
                    const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                    const gData = await gRes.json();
                    if (!gRes.ok) throw new Error(gData.error?.message || 'Lỗi lấy danh sách models từ Google');
                    const availableModels = (gData.models || [])
                        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
                        .map(m => ({
                            id: m.name.replace(/^models\//, ''),
                            name: m.displayName ? `${m.name.replace(/^models\//, '')} (${m.displayName})` : m.name.replace(/^models\//, '')
                        }));
                    return res.status(200).json({ success: true, models: availableModels });
                } catch (e) {
                    return res.status(500).json({ success: false, error: e.message });
                }
            }

            if (body.action === 'test_ai_model' || body.action === 'test_gpt') {
                const startTime = Date.now();
                const testPrompt = body.prompt || "Chào bạn, hãy giới thiệu ngắn gọn trong 1 câu bạn là ai và sẵn sàng hỗ trợ khách hàng như thế nào.";
                const provider = body.provider || kb.aiConfig?.provider || 'gemini';
                const model = body.model || (provider === 'gemini' ? 'gemini-2.5-flash' : 'llama-3.3-70b-versatile');

                const testKb = {
                    ...kb,
                    aiConfig: {
                        ...(kb.aiConfig || {}),
                        provider: provider,
                        apiKey: body.apiKey || kb.aiConfig?.apiKey,
                        model: model,
                        temperature: body.temperature ?? kb.aiConfig?.temperature ?? 0.7,
                        systemPrompt: body.systemPrompt || kb.aiConfig?.systemPrompt,
                        customBaseUrl: body.customBaseUrl || kb.aiConfig?.customBaseUrl
                    }
                };

                const testRes = await callAiModel(testPrompt, testKb);
                const latencyMs = Date.now() - startTime;

                return res.status(200).json({
                    success: true,
                    reply: testRes.reply,
                    provider: testRes.provider || provider,
                    model: testRes.model || model,
                    latencyMs: latencyMs,
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

            // Tạo customKb nếu client gửi kèm cấu hình AI tạm từ Dashboard
            let runtimeKb = kb;
            if (body.aiConfig || body.gptConfig) {
                const clientConfig = body.aiConfig || body.gptConfig;
                runtimeKb = {
                    ...kb,
                    aiConfig: {
                        ...(kb.aiConfig || {}),
                        ...clientConfig
                    }
                };
            }

            // Gọi Động Cơ Trí Tuệ Kép Đa Nền Tảng (Bộ Não 1 + Bộ Não 2 Gemini/Groq/OpenAI)
            const result = await generateReplyAsync(userMessage, runtimeKb);
            console.log(`🤖 [Website LiveChat - ${timeStr}] [${result.provider || 'AI'} - ${result.model}] Bot trả lời: "${result.reply.substring(0, 70)}..."`);

            return res.status(200).json({
                success: true,
                reply: result.reply,
                brainUsed: result.brainUsed,
                provider: result.provider,
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
