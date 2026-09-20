// =============================================================================
// HAITECH BOT - DUAL-BRAIN UNIFIED KNOWLEDGE ENGINE
// HỆ THỐNG TRÍ TUỆ KÉP: BỘ NÃO 1 (RULES & TRI THỨC) + BỘ NÃO 2 (OPENAI GPT)
// Dùng chung cho: Zalo cá nhân, Zalo OA, Facebook Fanpage và Website LiveChat
// Hotline/Zalo hỗ trợ: 0988 739 896 - Email: vanhaitech.86@gmail.com
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';

// Cấu hình tri thức mặc định
export const DEFAULT_KNOWLEDGE = {
    botName: "Em Lan - Trợ lý HAITECH BOT",
    brandName: "HAITECH BOT STUDIO",
    phone: "0988 739 896",
    email: "vanhaitech.86@gmail.com",
    welcomeMessage: "Dạ em chào anh/chị ạ! Em là Trợ lý AI của HAITECH BOT. Em có thể hỗ trợ tư vấn thông tin gì cho anh/chị hôm nay ạ? 😊",
    defaultContact: "Dạ anh/chị có thể liên hệ ngay hotline/Zalo: 0988 739 896 để gặp trực tiếp chuyên viên tư vấn 24/7 ạ!",
    gptConfig: {
        enabled: true,
        apiKey: "",
        model: "gpt-4o-mini",
        mode: "hybrid", // "hybrid" (Ưu tiên Bộ Não 1, câu mở gọi GPT) | "full-ai" (Luôn gọi GPT có tri thức)
        temperature: 0.7,
        maxTokens: 500,
        systemPrompt: ""
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
            return {
                ...DEFAULT_KNOWLEDGE,
                ...parsed,
                gptConfig: {
                    ...DEFAULT_KNOWLEDGE.gptConfig,
                    ...(parsed.gptConfig || {})
                }
            };
        }
    } catch (e) {
        console.warn("⚠️ Không thể đọc knowledge.json, dùng cấu hình mặc định:", e.message);
    }
    return DEFAULT_KNOWLEDGE;
}

// Tạo System Prompt RAG cho GPT dựa trên dữ liệu tri thức của doanh nghiệp
export function buildGptSystemPrompt(kb) {
    const customPrompt = kb.gptConfig?.systemPrompt?.trim();
    if (customPrompt) return customPrompt;

    // Tổng hợp danh mục quy tắc & FAQ làm ngữ cảnh
    let knowledgeContext = "";
    if (kb.rules && Array.isArray(kb.rules)) {
        knowledgeContext = kb.rules
            .map((r, i) => `- Chủ đề / Từ khóa: [${r.keywords.join(', ')}] -> Thông tin chính xác: ${r.reply}`)
            .join('\n');
    }

    return `Bạn là "${kb.botName || 'Em Lan - Trợ lý HAITECH BOT'}", nhân viên tư vấn khách hàng thông minh và chu đáo của "${kb.brandName || 'HAITECH BOT STUDIO'}".
Hotline/Zalo chính thức: ${kb.phone || '0988 739 896'}.
Email hỗ trợ: ${kb.email || 'vanhaitech.86@gmail.com'}.

VAI TRÒ & PHONG CÁCH GIAO TIẾP:
1. Xưng hô: "em" và gọi khách là "anh/chị" (hoặc "bạn" nếu khách xưng hô thân mật).
2. Giọng điệu: Thân thiện, lịch sự, nhiệt tình, chuyên nghiệp, luôn sẵn sàng lắng nghe và giải đáp.
3. Độ dài câu trả lời: Rất quan trọng! Hãy trả lời ngắn gọn (2 - 4 câu), súc tích, đi thẳng vào câu hỏi của khách, phù hợp phong cách nhắn tin Zalo/Messenger/LiveChat. Không viết quá dài kiểu luận văn.
4. Đính kèm icon tinh tế (😊, 📋, 📞, ✨) để tạo cảm giác gần gũi.

NGUYÊN TẮC THÔNG TIN & GIÁ CẢ (RAG):
Dưới đây là các thông tin chính thức của công ty:
${knowledgeContext}

CHỈ DẪN XỬ LÝ:
- Nếu khách hỏi về giá hoặc dịch vụ có trong thông tin trên: Hãy cung cấp chính xác và tư vấn khéo léo.
- Nếu khách hỏi điều chưa có trong tài liệu: Tuyệt đối không tự bịa đặt giá hoặc thông số sai. Hãy trả lời rằng em đã ghi nhận câu hỏi và mời khách để lại số điện thoại hoặc gọi trực tiếp Hotline/Zalo ${kb.phone || '0988 739 896'} để kỹ thuật viên tư vấn chuẩn xác nhất.
- Luôn giữ thái độ chào đón và kết thúc bằng một câu hỏi gợi mở để tiếp tục hỗ trợ khách hàng.`;
}

// Gọi OpenAI API trực tiếp qua native fetch (hỗ trợ gpt-4o-mini, gpt-4o, v.v.)
export async function callOpenAiGpt(userMessage, kb) {
    const apiKey = (kb.gptConfig?.apiKey || process.env.OPENAI_API_KEY || '').trim();
    if (!apiKey) {
        throw new Error('Chưa cấu hình OpenAI API Key (OPENAI_API_KEY)');
    }

    const model = (kb.gptConfig?.model || process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();
    const temperature = Number(kb.gptConfig?.temperature ?? 0.7);
    const maxTokens = Number(kb.gptConfig?.maxTokens ?? 500);
    const systemPrompt = buildGptSystemPrompt(kb);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
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
            throw new Error(`OpenAI API Error: ${errMsg}`);
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (!reply) {
            throw new Error('OpenAI không trả về nội dung hợp lệ.');
        }

        return {
            reply,
            model: data.model || model,
            usage: data.usage
        };
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
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

// 2. Hệ Thống Trí Tuệ Kép (Dual-Brain Hybrid Async Engine)
export async function generateReplyAsync(userMessage, customKnowledge = null) {
    const kb = customKnowledge || getKnowledgeBase();
    if (!userMessage || typeof userMessage !== 'string') {
        return {
            reply: kb.welcomeMessage,
            brainUsed: 'rules',
            model: 'Bộ Não 1 (Quy tắc tri thức)'
        };
    }

    const textLower = userMessage.toLowerCase().trim();
    const gptConfig = kb.gptConfig || {};
    const isGptEnabled = gptConfig.enabled !== false;
    const gptMode = gptConfig.mode || 'hybrid';
    const hasApiKey = Boolean((gptConfig.apiKey || process.env.OPENAI_API_KEY || '').trim());

    // CHẾ ĐỘ 1: HYBRID (Ưu tiên Bộ Não 1 để trả lời nhanh <0.1s & 0đ chi phí cho các câu khớp luật)
    if (gptMode === 'hybrid') {
        // Kiểm tra xem có khớp quy tắc tri thức chính xác không
        if (kb.rules && Array.isArray(kb.rules)) {
            for (const rule of kb.rules) {
                if (rule.keywords && rule.keywords.some(k => textLower.includes(k.toLowerCase().trim()))) {
                    return {
                        reply: rule.reply,
                        brainUsed: 'rules',
                        model: 'Bộ Não 1 (Quy tắc tri thức chuẩn)'
                    };
                }
            }
        }
    }

    // NẾU LÀ CHẾ ĐỘ FULL-AI HOẶC BỘ NÃO 1 KHÔNG KHỚP LUẬT NÀO -> KÍCH HOẠT BỘ NÃO 2 (GPT)
    if (isGptEnabled && hasApiKey) {
        try {
            const gptResult = await callOpenAiGpt(userMessage, kb);
            return {
                reply: gptResult.reply,
                brainUsed: 'gpt',
                model: `Bộ Não 2 (Model ${gptResult.model})`,
                usage: gptResult.usage
            };
        } catch (gptErr) {
            console.warn(`⚠️ [Dual-Brain Engine] Bộ Não 2 GPT gặp lỗi: "${gptErr.message}". Tự động chuyển sang Bộ Não 1 Fallback.`);
        }
    }

    // BỘ NÃO 1 FALLBACK (An toàn tuyệt đối nếu chưa có API Key hoặc GPT lỗi)
    const fallbackReply = generateReply(userMessage, kb);
    return {
        reply: fallbackReply,
        brainUsed: 'fallback',
        model: 'Bộ Não 1 (Fallback)'
    };
}
