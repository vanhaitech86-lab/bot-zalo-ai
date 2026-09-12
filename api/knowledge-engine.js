// =============================================================================
// HAITECH BOT - UNIFIED KNOWLEDGE ENGINE (BỘ NÃO AI DÙNG CHUNG ĐA KÊNH)
// Dùng chung cho: Zalo cá nhân, Zalo OA và Facebook Fanpage Messenger
// Hotline/Zalo hỗ trợ: 0988 739 896 - Email: vanhaitech.86@gmail.com
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';

// Cấu hình tri thức mặc định
const DEFAULT_KNOWLEDGE = {
    botName: "Em Lan - Trợ lý HAITECH BOT",
    phone: "0988 739 896",
    email: "vanhaitech.86@gmail.com",
    welcomeMessage: "Dạ em chào anh/chị ạ! Em là Trợ lý AI của HAITECH BOT. Em có thể hỗ trợ tư vấn thông tin gì cho anh/chị hôm nay ạ? 😊",
    defaultContact: "Dạ anh/chị có thể liên hệ ngay hotline/Zalo: 0988 739 896 để gặp trực tiếp chuyên viên tư vấn 24/7 ạ!",
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
            return { ...DEFAULT_KNOWLEDGE, ...parsed };
        }
    } catch (e) {
        console.warn("⚠️ Không thể đọc knowledge.json, dùng cấu hình mặc định:", e.message);
    }
    return DEFAULT_KNOWLEDGE;
}

// Hàm sinh câu trả lời thông minh dựa vào tin nhắn khách
export function generateReply(userMessage, customKnowledge = null) {
    const kb = customKnowledge || getKnowledgeBase();
    if (!userMessage || typeof userMessage !== 'string') {
        return kb.welcomeMessage;
    }

    const textLower = userMessage.toLowerCase().trim();

    // 1. Khớp theo bộ quy tắc từ khóa (rules)
    if (kb.rules && Array.isArray(kb.rules)) {
        for (const rule of kb.rules) {
            if (rule.keywords && rule.keywords.some(k => textLower.includes(k.toLowerCase().trim()))) {
                return rule.reply;
            }
        }
    }

    // 2. Chào hỏi
    if (textLower.includes("chào") || textLower.includes("hi") || textLower.includes("hello") || textLower.includes("alo") || textLower.includes("ê")) {
        return kb.welcomeMessage;
    }

    // 3. Hỏi giá
    if (textLower.includes("giá") || textLower.includes("nhiêu tiền") || textLower.includes("chi phí") || textLower.includes("báo giá")) {
        return `Dạ bên em đang có chính sách giá ưu đãi tốt nhất. Anh/chị vui lòng liên hệ hotline/Zalo: ${kb.phone || "0988 739 896"} để em gửi bảng báo giá chi tiết kèm ưu đãi hôm nay nhé ạ! 📋`;
    }

    // 4. Mặc định
    return `Dạ em là ${kb.botName || "HAITECH BOT"}. Em đã nhận được yêu cầu của anh/chị về: "${userMessage}". Để được hỗ trợ nhanh nhất, anh/chị có thể gọi hoặc nhắn tin hotline/Zalo: ${kb.phone || "0988 739 896"} nhé ạ! Cảm ơn anh/chị! 🙏`;
}
