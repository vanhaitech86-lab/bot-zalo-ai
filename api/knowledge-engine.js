// =============================================================================
// HAITECH BOT - MULTI-PLATFORM DUAL-BRAIN KNOWLEDGE ENGINE
// HỆ THỐNG TRÍ TUỆ KÉP ĐA NỀN TẢNG: BỘ NÃO 1 (RULES) + BỘ NÃO 2 (MULTI-AI)
// Hỗ trợ: Google Gemini (Free), GroqCloud LPU (Free), OpenRouter, DeepSeek, OpenAI, Ollama
// Hotline/Zalo hỗ trợ: 0988 739 896 - Email: vanhaitech.86@gmail.com
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';

// Nạp tự động các biến môi trường từ .env nếu có
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const lines = fs.readFileSync(envPath, 'utf8').split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const idx = trimmed.indexOf('=');
                    if (idx > 0) {
                        const key = trimmed.slice(0, idx).trim();
                        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
                        if (!process.env[key]) process.env[key] = val;
                    }
                }
            }
        }
    } catch (e) {}
}
loadEnv();

// Danh sách các nhà cung cấp mô hình AI được hỗ trợ
export const AI_PROVIDERS = {
    gemini: {
        id: "gemini",
        name: "Google Gemini (Google AI Studio)",
        badge: "Miễn phí 100% · 1.500 lượt/ngày",
        defaultModel: "gemini-3.8-flash",
        models: [
            "gemini-3.8-flash",
            "gemini-3.5-flash",
            "gemini-2.5-flash-lite",
            "gemini-flash-latest",
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-2.5-pro"
        ],
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
    botName: "Em Thùy Linh - Trợ lý HAITECH BOT",
    brandName: "HAITECH BOT STUDIO",
    phone: "0988 739 896",
    email: "vanhaitech.86@gmail.com",
    welcomeMessage: "Dạ em chào anh/chị ạ! Em là Thùy Linh - Trợ lý AI của HAITECH BOT. Em có thể hỗ trợ tư vấn thông tin gì cho anh/chị hôm nay ạ? 😊",
    defaultContact: "Dạ anh/chị có thể liên hệ ngay hotline/Zalo: 0988 739 896 để gặp trực tiếp chuyên viên tư vấn 24/7 ạ!",
    aiConfig: {
        provider: "gemini", // "gemini" | "groq" | "openrouter" | "deepseek" | "openai" | "custom"
        enabled: true,
        apiKey: "",
        model: "gemini-3.8-flash",
        mode: "hybrid", // "hybrid" (Ưu tiên Bộ Não 1, câu mở gọi AI) | "full-ai" (Luôn gọi AI có tri thức)
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: "",
        customBaseUrl: ""
    },
    rules: [
        {
            keywords: ["giá", "nhiêu tiền", "chi phí", "báo giá", "bảng giá"],
            reply: "Dạ bên em có các gói giải pháp linh hoạt từ cơ bản đến chuyên sâu với nhiều ưu đãi. Anh/chị đang quan tâm đến gói giải pháp nào để em gửi bảng báo giá chi tiết và ưu đãi tốt nhất hôm nay ạ? 📋"
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
            reply: "Dạ anh/chị đang cần giải pháp cụ thể cho bài toán nào ạ? Anh/chị cứ chia sẻ nhu cầu, em sẽ tư vấn phương án tối ưu nhất ngay tại đây ạ!"
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

            if (!baseAiConfig.apiKey) {
                baseAiConfig.apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.OPENAI_API_KEY || '').trim();
            }

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
            .map(r => `- Chủ đề: [${r.keywords.join(', ')}] -> Nội dung: ${r.reply}`)
            .join('\n');
    }

    return `Bạn là "${kb.botName || 'Em Thùy Linh - Trợ lý HAITECH BOT'}", trợ lý tư vấn thông minh và tận tâm của "${kb.brandName || 'HAITECH BOT STUDIO'}".

NGUYÊN TẮC GIAO TIẾP QUAN TRỌNG NHẤT (BẮT BUỘC TUÂN THỦ 100%):
1. ĐI THẲNG VÀO VẤN ĐỀ - TỰ NHIÊN, CỤ THỂ, KHÔNG NÓI VĂN MẪU CHUNG CHUNG:
   - Trả lời trực diện, thông minh, đúng trọng tâm câu hỏi của khách hàng.
   - TUYỆT ĐỐI KHÔNG dùng các câu văn mẫu sáo rỗng, quảng cáo chung chung (Ví dụ KHÔNG NÓI: "giải pháp bên em đang hỗ trợ rất nhiều doanh nghiệp...", "bên em tự động thu hút khách hàng 24/7...", v.v.).
   - Khi khách hỏi về bất kỳ chủ đề/dịch vụ nào (như Business Coaching, chiến lược, marketing, kỹ thuật...): Hãy đi thẳng vào nội dung cốt lõi, giải thích rõ ràng lộ trình, cách làm thực tế hoặc giải pháp cụ thể giúp ích cho khách.

2. TUYỆT ĐỐI BỎ SỐ ĐIỆN THOẠI TRONG CÂU TRẢ LỜI:
   - Khách hàng ĐANG TRÒ CHUYỆN TRỰC TIẾP TRÊN ZALO VỚI BẠN. Do đó KHÔNG BAO GIỜ được nói: "Anh có thể nhắn qua Zalo số...", "gọi vào hotline...", "nhắn tin số điện thoại...". Việc tự ý chèn số điện thoại khi đang chat Zalo là cấm kỵ.
   - CHỈ DUY NHẤT khi khách hàng chủ động hỏi: "Cho xin số điện thoại", "Hotline là gì", "Địa chỉ liên hệ ở đâu" thì mới cung cấp: ${kb.phone || '0988 739 896'}.

3. PHONG CÁCH TỰ NHIÊN NHƯ NGƯỜI THẬT:
   - Xưng "em", gọi khách là "anh/chị" (hoặc "anh", "chị" tùy xưng hô của khách).
   - Độ dài: Ngắn gọn từ 2 đến 3 câu súc tích, văn phong tự nhiên, lịch sự, chuyên nghiệp như một chuyên gia tư vấn giàu kinh nghiệm.
   - Luôn kết thúc bằng 1 câu hỏi định hướng ngắn gọn để tiếp tục cuộc trò chuyện và hiểu rõ bài toán của khách (Ví dụ: "Hiện tại anh đang muốn tối ưu cho đội ngũ kinh doanh hay xây dựng hệ thống tự động cho toàn doanh nghiệp ạ?").
   - Hạn chế icon, chỉ dùng tối đa 1 icon tinh tế (😊 hoặc ✨).

4. TUYỆT ĐỐI KHÔNG LẶP LẠI LỜI CHÀO HỎI NẾU ĐANG TRONG CUỘC HỘI THOẠI:
   - Nếu trong lịch sử trò chuyện đã chào rồi, hoặc khách hàng đang hỏi về dịch vụ, nhu cầu, nghiệp vụ...: TUYỆT ĐỐI KHÔNG mở đầu bằng "Dạ em chào anh/chị ạ!".
   - Hãy đi thẳng vào nội dung phản hồi, thảo luận hoặc đưa ra giải pháp giúp khách ngay.

DỮ LIỆU THAM KHẢO NỘI BỘ:
${knowledgeContext}

LƯU Ý VỀ GIÁ & CHÍNH SÁCH:
- Nếu khách hỏi giá: Báo rõ các mức giá định hướng hoặc hỏi rõ quy mô để tư vấn mức chi phí chính xác nhất, không né tránh câu hỏi giá.`;
}

// =============================================================================
// CÁC HÀM GỌI API CHO TỪNG NỀN TẢNG AI
// =============================================================================

// Hàm kiểm tra khớp từ khóa nguyên từ (word boundary), tránh trường hợp "coaching" bị khớp với "hi"
export function matchKeyword(textLower, keyword) {
    if (!textLower || !keyword) return false;
    const cleanKw = keyword.trim().toLowerCase();
    if (!cleanKw) return false;
    const escaped = cleanKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`, 'u');
    return regex.test(textLower);
}

// 1. Google Gemini API (Google AI Studio - Miễn phí 1.500 lượt/ngày)
export async function callGoogleGemini(userMessage, kb, conversationHistory = []) {
    const aiConfig = kb.aiConfig || kb.gptConfig || {};
    const apiKey = (aiConfig.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
    if (!apiKey) {
        throw new Error('Chưa cấu hình Google Gemini API Key. Hãy lấy key miễn phí tại aistudio.google.com!');
    }

    const requestedModel = (aiConfig.model || 'gemini-3.6-flash').trim();
    const temperature = Number(aiConfig.temperature ?? 0.7);
    const maxTokens = Number(aiConfig.maxTokens ?? 600);
    const systemPrompt = buildAiSystemPrompt(kb);

    // Danh sách model tối ưu trên Google AI Studio (ưu tiên gemini-flash-lite-latest để phản hồi siêu tốc 1-2s)
    const candidateModels = Array.from(new Set([
        'gemini-flash-lite-latest',
        'gemini-3.5-flash-lite',
        requestedModel,
        'gemini-3.8-flash',
        'gemini-3.6-flash'
    ]));

    // Xây dựng ngữ cảnh hội thoại đa lượt (Multi-turn chat)
    const contents = [];
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        for (const msg of conversationHistory.slice(-8)) {
            contents.push({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            });
        }
    }
    contents.push({
        role: 'user',
        parts: [{ text: userMessage }]
    });

    let lastError = null;

    for (const curModel of candidateModels) {
        const cleanModel = curModel.replace(/^models\//, '');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;

        // Thử tối đa 2 lần cho mỗi model nếu gặp 503 spike
        for (let attempt = 1; attempt <= 2; attempt++) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);
            try {
                const generationConfig = {
                    temperature: temperature,
                    maxOutputTokens: Math.max(maxTokens, 1500)
                };
                // gemini-flash-lite không hỗ trợ thinkingConfig (sẽ bị lỗi 400 INVALID_ARGUMENT)
                if (cleanModel.includes('thinking')) {
                    generationConfig.thinkingConfig = { thinkingBudget: 0 };
                }

                const reqBody = {
                    contents: contents,
                    generationConfig: generationConfig
                };
                // systemInstruction is supported on gemini models, ignore on gemma if needed
                if (!cleanModel.includes('gemma')) {
                    reqBody.systemInstruction = {
                        parts: [{ text: systemPrompt }]
                    };
                }

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reqBody),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                    if (reply) {
                        return {
                            reply,
                            model: cleanModel,
                            provider: 'Google Gemini',
                            usage: data.usageMetadata
                        };
                    }
                }

                const errData = await response.json().catch(() => ({}));
                const errMsg = errData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
                lastError = new Error(errMsg);

                if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('API key not valid')) {
                    throw new Error(`Google Gemini Error: ${errMsg}`);
                }

                // Nếu gặp 503 / high demand và còn lượt thử, đợi 800ms rồi thử lại
                if ((response.status === 503 || errMsg.includes('high demand') || errMsg.includes('temporarily unavailable')) && attempt < 2) {
                    await new Promise(r => setTimeout(r, 800));
                    continue;
                }

                // Chuyển sang model tiếp theo
                break;
            } catch (err) {
                clearTimeout(timeoutId);
                if (err.message && (err.message.includes('API_KEY_INVALID') || err.message.includes('API key not valid'))) {
                    throw err;
                }
                lastError = err;
                if (attempt < 2) {
                    await new Promise(r => setTimeout(r, 800));
                }
            }
        }
    }

    throw lastError || new Error('Không thể kết nối tới Google Gemini. Vui lòng kiểm tra lại API Key hoặc chọn Model khác.');
}

// 2. OpenAI-Compatible API (Groq, OpenRouter, DeepSeek, OpenAI, Custom/Ollama)
export async function callOpenAiCompatible(userMessage, kb, defaultBaseUrl = 'https://api.openai.com/v1', conversationHistory = []) {
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

    // Xây dựng danh sách tin nhắn có lịch sử đa lượt
    const messages = [{ role: 'system', content: systemPrompt }];
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        for (const msg of conversationHistory.slice(-8)) {
            messages.push({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.text
            });
        }
    }
    messages.push({ role: 'user', content: userMessage });

    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                model: model,
                messages: messages,
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
export async function callAiModel(userMessage, kb, conversationHistory = []) {
    const aiConfig = kb.aiConfig || kb.gptConfig || {};
    let provider = aiConfig.provider || 'gemini';
    const apiKey = (aiConfig.apiKey || '').trim();

    // TỰ ĐỘNG CHUẨN HÓA: Nếu dán key Google Gemini (AIzaSy...) nhưng dropdown đang để Groq (hoặc ngược lại)
    if (apiKey.startsWith('AIzaSy') && provider !== 'gemini') {
        provider = 'gemini';
    } else if (apiKey.startsWith('gsk_') && provider !== 'groq') {
        provider = 'groq';
    }

    if (provider === 'gemini') {
        return await callGoogleGemini(userMessage, { ...kb, aiConfig: { ...aiConfig, provider: 'gemini' } }, conversationHistory);
    }

    const providerDef = AI_PROVIDERS[provider] || AI_PROVIDERS.openai;
    const baseUrl = aiConfig.customBaseUrl || providerDef.baseUrl || 'https://api.openai.com/v1';
    return await callOpenAiCompatible(userMessage, { ...kb, aiConfig: { ...aiConfig, provider } }, baseUrl, conversationHistory);
}

// Giữ hàm callOpenAiGpt cho tương thích ngược
export async function callOpenAiGpt(userMessage, kb, conversationHistory = []) {
    return await callAiModel(userMessage, kb, conversationHistory);
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

    // 1.1. Khớp theo bộ quy tắc từ khóa (rules) theo nguyên từ
    if (kb.rules && Array.isArray(kb.rules)) {
        for (const rule of kb.rules) {
            if (rule.keywords && rule.keywords.some(k => matchKeyword(textLower, k))) {
                return rule.reply;
            }
        }
    }

    // 1.2. Chào hỏi
    const greetings = ["chào", "hi", "hello", "alo", "ê"];
    if (greetings.some(g => matchKeyword(textLower, g))) {
        return kb.welcomeMessage;
    }

    // 1.3. Hỏi giá
    const priceKws = ["giá", "nhiêu tiền", "chi phí", "báo giá", "bảng giá"];
    if (priceKws.some(p => matchKeyword(textLower, p))) {
        return `Dạ bên em đang có chính sách giá ưu đãi rất tốt cho từng giải pháp. Anh/chị đang quan tâm đến gói giải pháp nào để em gửi bảng báo giá chi tiết và ưu đãi tốt nhất hôm nay ạ? 📋`;
    }

    // 1.4. Mặc định
    return `Dạ em đã ghi nhận yêu cầu của anh/chị về: "${userMessage}". Anh/chị có thể chia sẻ cụ thể hơn để em tư vấn phương án tối ưu nhất nhé ạ! 😊`;
}

// 2. Hệ Thống Trí Tuệ Kép Đa Nền Tảng (Multi-Platform Dual-Brain Engine)
export async function generateReplyAsync(userMessage, customKnowledge = null, conversationHistory = []) {
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
                if (rule.keywords && rule.keywords.some(k => matchKeyword(textLower, k))) {
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
            const aiResult = await callAiModel(userMessage, kb, conversationHistory);
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
