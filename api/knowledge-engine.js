// =============================================================================
// HAITECH BOT - MULTI-PLATFORM DUAL-BRAIN KNOWLEDGE ENGINE
// HỆ THỐNG TRÍ TUỆ KÉP ĐA NỀN TẢNG: BỘ NÃO 1 (RULES) + BỘ NÃO 2 (MULTI-AI)
// Hỗ trợ: Google Gemini (Free), GroqCloud LPU (Free), OpenRouter, DeepSeek, OpenAI, Ollama
// Hotline/Zalo hỗ trợ: 0988 739 896 - Email: vanhaitech.86@gmail.com
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';

// Danh sách các nhà cung cấp mô hình AI được hỗ trợ
export const AI_PROVIDERS = {
    gemini: {
        id: "gemini",
        name: "Google Gemini (Google AI Studio)",
        badge: "Miễn phí 100% · 1.500 lượt/ngày",
        defaultModel: "gemini-1.5-flash",
        models: ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"],
        keyPlaceholder: "AIzaSy...",
        keyUrl: "https://aistudio.google.com/app/apikey",
        isFree: true,
        type: "gemini"
    },
    groq: {
        id: "groq",
        name: "GroqCloud LPU (Siêu tốc 0.3s)",
        badge: "Miễn phí 100% · Tốc độ nhanh nhất thế giới",
        defaultModel: "llama-3.3-70b-versatile",
        models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
        baseUrl: "https://api.groq.com/openai/v1",
        keyPlaceholder: "gsk_...",
        keyUrl: "https://console.groq.com/keys",
        isFree: true,
        type: "openai-compatible"
    },
    openrouter: {
        id: "openrouter",
        name: "OpenRouter.ai (Đa Model Free)",
        badge: "Có nhiều model :free miễn phí",
        defaultModel: "google/gemini-2.0-flash-exp:free",
        models: [
            "google/gemini-2.0-flash-exp:free",
            "meta-llama/llama-3.3-70b-instruct:free",
            "deepseek/deepseek-r1:free",
            "mistralai/mistral-7b-instruct:free"
        ],
        baseUrl: "https://openrouter.ai/api/v1",
        keyPlaceholder: "sk-or-v1-...",
        keyUrl: "https://openrouter.ai/keys",
        isFree: true,
        type: "openai-compatible"
    },
    deepseek: {
        id: "deepseek",
        name: "DeepSeek AI (Suy luận đỉnh cao)",
        badge: "Tặng credit trải nghiệm · Siêu rẻ",
        defaultModel: "deepseek-chat",
        models: ["deepseek-chat", "deepseek-reasoner"],
        baseUrl: "https://api.deepseek.com",
        keyPlaceholder: "sk-...",
        keyUrl: "https://platform.deepseek.com/api_keys",
        isFree: false,
        type: "openai-compatible"
    },
    openai: {
        id: "openai",
        name: "OpenAI ChatGPT",
        badge: "Tiêu chuẩn quốc tế",
        defaultModel: "gpt-4o-mini",
        models: ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"],
        baseUrl: "https://api.openai.com/v1",
        keyPlaceholder: "sk-proj-...",
        keyUrl: "https://platform.openai.com/api-keys",
        isFree: false,
        type: "openai-compatible"
    },
    custom: {
        id: "custom",
        name: "Custom / Ollama Local (Offline)",
        badge: "0đ vĩnh viễn · Chạy trên máy",
        defaultModel: "llama3",
        models: ["llama3", "qwen2.5", "mistral", "gemma2"],
        baseUrl: "http://localhost:11434/v1",
        keyPlaceholder: "Không bắt buộc nếu chạy Local",
        keyUrl: "https://ollama.com",
        isFree: true,
        type: "openai-compatible"
    }
};

// Cấu hình tri thức mặc định
export const DEFAULT_KNOWLEDGE = {
    botName: "Em Lan - Trợ lý HAITECH BOT",
    brandName: "HAITECH BOT STUDIO",
    phone: "0988 739 896",
    email: "vanhaitech.86@gmail.com",
    welcomeMessage: "Dạ em chào anh/chị ạ! Em là Trợ lý AI của HAITECH BOT. Em có thể hỗ trợ tư vấn thông tin gì cho anh/chị hôm nay ạ? 😊",
    defaultContact: "Dạ anh/chị có thể liên hệ ngay hotline/Zalo: 0988 739 896 để gặp trực tiếp chuyên viên tư vấn 24/7 ạ!",
    aiConfig: {
        provider: "gemini", // "gemini" | "groq" | "openrouter" | "deepseek" | "openai" | "custom"
        enabled: true,
        apiKey: "",
        model: "gemini-1.5-flash",
        mode: "hybrid", // "hybrid" (Ưu tiên Bộ Não 1, câu mở gọi AI) | "full-ai" (Luôn gọi AI có tri thức)
        temperature: 0.7,
        maxTokens: 500,
        systemPrompt: "",
        customBaseUrl: ""
    },
    rules: [
        {
            keywords: ["giá", "nhiêu tiền", "chi phí", "báo giá", "bảng giá"],
            reply: "Dạ bên em có các gói giải pháp tối ưu cho cá nhân và doanh nghiệp với ưu đãi đặc biệt hôm nay. Anh/chị đang quan tâm đến dòng sản phẩm nào để em gửi bảng báo giá chi tiết kèm ưu đãi ạ? 📋 Hotline/Zalo: 0988 739 896"
        },
        {
            keywords: ["chào", "alo", "hi", "hello", "shop ơi", "ad ơi"],
            reply: "Dạ em chào anh/chị ạ! Rất vui được hỗ trợ anh/chị. Anh/chị cần em giải đáp thông tin sản phẩm hay chính sách nào ạ? 😊"
        },
        {
            keywords: ["bảo hành", "hỏng", "sửa", "đổi trả", "lỗi"],
            reply: "Dạ tất cả sản phẩm và dịch vụ bên em đều được cam kết bảo hành chính hãng tận nơi 12 tháng, bảo dưỡng định kỳ và hỗ trợ kỹ thuật nhanh chóng trong vòng 24h ạ!"
        },
        {
            keywords: ["hotline", "số điện thoại", "sđt", "liên hệ", "địa chỉ", "ở đâu"],
            reply: "Dạ thông tin liên hệ chính thức của bên em:\n📞 Hotline/Zalo: 0988 739 896\n✉️ Email: vanhaitech.86@gmail.com\nAnh/chị có thể gọi ngay hoặc để lại tin nhắn em hỗ trợ tư vấn ngay ạ!"
        },
        {
            keywords: ["lắp đặt", "giao hàng", "ship", "vận chuyển"],
            reply: "Dạ bên em hỗ trợ giao hàng và triển khai tận nơi trên toàn quốc, có kỹ thuật viên bàn giao và hướng dẫn vận hành chi tiết ạ!"
        },
        {
            keywords: ["tư vấn", "hỗ trợ", "mua hàng", "đặt hàng"],
            reply: "Dạ anh/chị vui lòng để lại số điện thoại hoặc kết nối trực tiếp Zalo hotline: 0988 739 896 để em báo chuyên viên tư vấn gọi hỗ trợ ngay trong 5 phút ạ!"
        }
    ]
};

// Đọc tri thức từ knowledge.json nếu có
export function getKnowledgeBase() {
    try {
        const knowledgePath = path.resolve(process.cwd(), 'knowledge.json');
        if (fs.existsSync(knowledgePath)) {
            const raw = fs.readFileSync(knowledgePath, 'utf8');
            const parsed = JSON.parse(raw);

            // Gộp cấu hình AI (ưu tiên aiConfig, sau đó gptConfig cũ nếu có)
            const legacyGpt = parsed.gptConfig || {};
            const baseAiConfig = {
                ...DEFAULT_KNOWLEDGE.aiConfig,
                ...(parsed.aiConfig || legacyGpt)
            };

            return {
                ...DEFAULT_KNOWLEDGE,
                ...parsed,
                aiConfig: baseAiConfig,
                gptConfig: baseAiConfig // Giữ tương thích ngược
            };
        }
    } catch (e) {
        console.warn("⚠️ Không thể đọc knowledge.json, dùng cấu hình mặc định:", e.message);
    }
    return DEFAULT_KNOWLEDGE;
}

// Xây dựng System Prompt RAG cho các Model AI
export function buildAiSystemPrompt(kb) {
    const aiConfig = kb.aiConfig || kb.gptConfig || {};
    const customPrompt = aiConfig.systemPrompt?.trim();
    if (customPrompt) return customPrompt;

    let knowledgeContext = "";
    if (kb.rules && Array.isArray(kb.rules)) {
        knowledgeContext = kb.rules
            .map(r => `- Chủ đề: [${r.keywords.join(', ')}] -> Thông tin: ${r.reply}`)
            .join('\n');
    }

    return `Bạn là "${kb.botName || 'Em Lan - Trợ lý HAITECH BOT'}", trợ lý AI bán hàng và chăm sóc khách hàng của "${kb.brandName || 'HAITECH BOT STUDIO'}".
Hotline/Zalo chính thức: ${kb.phone || '0988 739 896'}.
Email liên hệ: ${kb.email || 'vanhaitech.86@gmail.com'}.

VAI TRÒ & PHONG CÁCH GIAO TIẾP:
1. Xưng hô: Luôn xưng "em" và gọi khách là "anh/chị" (hoặc "bạn" nếu khách xưng hô thân mật).
2. Phong cách: Thân thiện, chu đáo, nhiệt tình, chuyên nghiệp, tự nhiên như nhân viên thật.
3. Độ dài câu: RẤT QUAN TRỌNG! Chỉ trả lời ngắn gọn từ 2 đến 4 câu, súc tích, đi thẳng vào câu hỏi, phù hợp văn phong chat Zalo/Messenger. Không viết bài luận dài.
4. Đính kèm icon phù hợp (😊, 📋, 📞, ✨) để tạo cảm giác gần gũi.

THÔNG TIN CHÍNH THỨC CỦA CỬA HÀNG / CÔNG TY (RAG):
${knowledgeContext}

QUY TẮC BẢO VỆ THÔNG TIN:
- Cung cấp chính xác thông tin, bảng giá và chính sách có trong dữ liệu trên.
- Nếu khách hỏi điều gì chưa có trong tài liệu: Tuyệt đối không tự bịa đặt giá sai. Hãy trả lời khéo léo và mời khách để lại số điện thoại hoặc gọi trực tiếp Hotline/Zalo ${kb.phone || '0988 739 896'} để chuyên viên hỗ trợ.
- Kết thúc bằng một câu hỏi gợi mở nhẹ nhàng để tiếp tục phục vụ khách hàng.`;
}

// =============================================================================
// CÁC HÀM GỌI API CHO TỪNG NỀN TẢNG AI
// =============================================================================

// 1. Google Gemini API (Google AI Studio - Miễn phí 1.500 lượt/ngày)
export async function callGoogleGemini(userMessage, kb) {
    const aiConfig = kb.aiConfig || kb.gptConfig || {};
    const apiKey = (aiConfig.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
    if (!apiKey) {
        throw new Error('Chưa cấu hình Google Gemini API Key. Hãy lấy key miễn phí tại aistudio.google.com!');
    }

    const model = (aiConfig.model || 'gemini-1.5-flash').trim();
    const temperature = Number(aiConfig.temperature ?? 0.7);
    const maxTokens = Number(aiConfig.maxTokens ?? 600);
    const systemPrompt = buildAiSystemPrompt(kb);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: userMessage }] }
                ],
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                },
                generationConfig: {
                    temperature: temperature,
                    maxOutputTokens: maxTokens
                }
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
            throw new Error(`Google Gemini Error: ${errMsg}`);
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!reply) {
            throw new Error('Google Gemini không trả về câu trả lời hợp lệ.');
        }

        return {
            reply,
            model: model,
            provider: 'Google Gemini',
            usage: data.usageMetadata
        };
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}

// 2. OpenAI-Compatible API (Groq, OpenRouter, DeepSeek, OpenAI, Custom/Ollama)
export async function callOpenAiCompatible(userMessage, kb, defaultBaseUrl = 'https://api.openai.com/v1') {
    const aiConfig = kb.aiConfig || kb.gptConfig || {};
    const apiKey = (aiConfig.apiKey || process.env.OPENAI_API_KEY || '').trim();

    // Đối với Custom/Ollama, API Key có thể không bắt buộc
    const isCustom = aiConfig.provider === 'custom';
    if (!apiKey && !isCustom) {
        throw new Error(`Chưa cấu hình API Key cho nền tảng ${aiConfig.provider || 'AI'}.`);
    }

    const baseUrl = (aiConfig.customBaseUrl || defaultBaseUrl).replace(/\/$/, '');
    const model = (aiConfig.model || 'gpt-4o-mini').trim();
    const temperature = Number(aiConfig.temperature ?? 0.7);
    const maxTokens = Number(aiConfig.maxTokens ?? 500);
    const systemPrompt = buildAiSystemPrompt(kb);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

    // Thêm header định danh cho OpenRouter nếu có
    if (aiConfig.provider === 'openrouter') {
        headers['HTTP-Referer'] = 'https://haitech.vn';
        headers['X-Title'] = 'HAITECH BOT STUDIO';
    }

    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: temperature,
                max_tokens: maxTokens
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
            throw new Error(`API Error (${aiConfig.provider || 'AI'}): ${errMsg}`);
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (!reply) {
            throw new Error('Mô hình AI không trả về câu trả lời hợp lệ.');
        }

        const providerInfo = AI_PROVIDERS[aiConfig.provider] || { name: aiConfig.provider || 'AI' };

        return {
            reply,
            model: data.model || model,
            provider: providerInfo.name,
            usage: data.usage
        };
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}

// 3. Dispatcher điều phối gọi Model theo đúng Nền tảng được chọn
export async function callAiModel(userMessage, kb) {
    const aiConfig = kb.aiConfig || kb.gptConfig || {};
    const provider = aiConfig.provider || 'gemini';

    if (provider === 'gemini') {
        return await callGoogleGemini(userMessage, kb);
    }

    const providerDef = AI_PROVIDERS[provider] || AI_PROVIDERS.openai;
    const baseUrl = aiConfig.customBaseUrl || providerDef.baseUrl || 'https://api.openai.com/v1';
    return await callOpenAiCompatible(userMessage, kb, baseUrl);
}

// Giữ hàm callOpenAiGpt cho tương thích ngược
export async function callOpenAiGpt(userMessage, kb) {
    return await callAiModel(userMessage, kb);
}

// =============================================================================
// HÀM XỬ LÝ SINH CÂU TRẢ LỜI ĐỒNG BỘ VÀ BẤT ĐỒNG BỘ
// =============================================================================

// 1. Bộ Não 1: Đồng bộ theo luật nghiệp vụ (Rules & Business Knowledge)
export function generateReply(userMessage, customKnowledge = null) {
    const kb = customKnowledge || getKnowledgeBase();
    if (!userMessage || typeof userMessage !== 'string') {
        return kb.welcomeMessage;
    }

    const textLower = userMessage.toLowerCase().trim();

    // 1.1. Khớp theo bộ quy tắc từ khóa (rules)
    if (kb.rules && Array.isArray(kb.rules)) {
        for (const rule of kb.rules) {
            if (rule.keywords && rule.keywords.some(k => textLower.includes(k.toLowerCase().trim()))) {
                return rule.reply;
            }
        }
    }

    // 1.2. Chào hỏi
    if (textLower.includes("chào") || textLower.includes("hi") || textLower.includes("hello") || textLower.includes("alo") || textLower.includes("ê")) {
        return kb.welcomeMessage;
    }

    // 1.3. Hỏi giá
    if (textLower.includes("giá") || textLower.includes("nhiêu tiền") || textLower.includes("chi phí") || textLower.includes("báo giá")) {
        return `Dạ bên em đang có chính sách giá ưu đãi tốt nhất. Anh/chị vui lòng liên hệ hotline/Zalo: ${kb.phone || "0988 739 896"} để em gửi bảng báo giá chi tiết kèm ưu đãi hôm nay nhé ạ! 📋`;
    }

    // 1.4. Mặc định
    return `Dạ em là ${kb.botName || "HAITECH BOT"}. Em đã nhận được yêu cầu của anh/chị về: "${userMessage}". Để được hỗ trợ nhanh nhất, anh/chị có thể gọi hoặc nhắn tin hotline/Zalo: ${kb.phone || "0988 739 896"} nhé ạ! Cảm ơn anh/chị! 🙏`;
}

// 2. Hệ Thống Trí Tuệ Kép Đa Nền Tảng (Multi-Platform Dual-Brain Engine)
export async function generateReplyAsync(userMessage, customKnowledge = null) {
    const kb = customKnowledge || getKnowledgeBase();
    if (!userMessage || typeof userMessage !== 'string') {
        return {
            reply: kb.welcomeMessage,
            brainUsed: 'rules',
            provider: 'Bộ Não 1',
            model: 'Quy tắc tri thức chuẩn'
        };
    }

    const textLower = userMessage.toLowerCase().trim();
    const aiConfig = kb.aiConfig || kb.gptConfig || {};
    const isAiEnabled = aiConfig.enabled !== false;
    const mode = aiConfig.mode || 'hybrid';
    const provider = aiConfig.provider || 'gemini';
    const hasApiKey = Boolean((aiConfig.apiKey || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || '').trim()) || provider === 'custom';

    // CHẾ ĐỘ 1: HYBRID (Ưu tiên Bộ Não 1 để trả lời nhanh <0.1s & 0đ chi phí cho các câu khớp luật)
    if (mode === 'hybrid') {
        if (kb.rules && Array.isArray(kb.rules)) {
            for (const rule of kb.rules) {
                if (rule.keywords && rule.keywords.some(k => textLower.includes(k.toLowerCase().trim()))) {
                    return {
                        reply: rule.reply,
                        brainUsed: 'rules',
                        provider: 'Bộ Não 1',
                        model: 'Quy tắc tri thức chuẩn'
                    };
                }
            }
        }
    }

    // NẾU LÀ CHẾ ĐỘ FULL-AI HOẶC BỘ NÃO 1 KHÔNG KHỚP LUẬT NÀO -> KÍCH HOẠT BỘ NÃO 2 (MULTI-AI)
    if (isAiEnabled && hasApiKey) {
        try {
            const aiResult = await callAiModel(userMessage, kb);
            return {
                reply: aiResult.reply,
                brainUsed: 'ai',
                provider: aiResult.provider,
                model: aiResult.model,
                usage: aiResult.usage
            };
        } catch (aiErr) {
            console.warn(`⚠️ [Dual-Brain Multi-AI] Lỗi gọi ${provider}: "${aiErr.message}". Tự động chuyển sang Bộ Não 1 Fallback.`);
        }
    }

    // BỘ NÃO 1 FALLBACK (An toàn tuyệt đối nếu chưa cấu hình key hoặc AI lỗi)
    const fallbackReply = generateReply(userMessage, kb);
    return {
        reply: fallbackReply,
        brainUsed: 'fallback',
        provider: 'Bộ Não 1',
        model: 'Tri thức chuẩn (Fallback)'
    };
}
