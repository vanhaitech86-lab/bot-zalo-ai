// =============================================================================
// HAITECH BOT - ĐỘNG CƠ TỰ ĐỘNG TRẢ LỜI ZALO CÁ NHÂN 24/7
// Tác giả: HAITECH BOT (Zalo/Hotline: 0988 739 896 - Email: vanhaitech.86@gmail.com)
// =============================================================================

import { Zalo, ThreadType, LoginQRCallbackEventType } from "zca-js";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";

const SESSION_FILE = "./session.json";
const KNOWLEDGE_FILE = "./knowledge.json";

// 1. Nạp và theo dõi dữ liệu tri thức (Knowledge Base)
let knowledge = {};
function loadKnowledge() {
    try {
        if (fs.existsSync(KNOWLEDGE_FILE)) {
            const raw = fs.readFileSync(KNOWLEDGE_FILE, "utf8");
            knowledge = JSON.parse(raw);
            console.log("📚 [Bộ não AI] Đã nạp dữ liệu tri thức từ knowledge.json!");
        }
    } catch (e) {
        console.warn("⚠️ Chưa đọc được knowledge.json, dùng cấu hình mặc định.");
        knowledge = {
            botName: "Em Lan - Trợ lý HAITECH BOT",
            phone: "0988739896",
            rules: []
        };
    }
}

// Tự động cập nhật tri thức khi sửa file knowledge.json mà không cần bật lại bot
try {
    fs.watch(KNOWLEDGE_FILE, (eventType) => {
        if (eventType === "change") {
            console.log("🔄 Phát hiện thay đổi trong knowledge.json! Đang nạp lại...");
            loadKnowledge();
        }
    });
} catch (err) {
    // Bỏ qua nếu môi trường không hỗ trợ fs.watch
}

// 2. Logic sinh câu trả lời thông minh dựa vào tri thức
function generateReply(userMessage) {
    const textLower = userMessage.toLowerCase().trim();

    // 2.1. Khớp từ khóa trong bộ quy tắc (knowledge.rules)
    if (knowledge.rules && Array.isArray(knowledge.rules)) {
        for (const rule of knowledge.rules) {
            if (rule.keywords && rule.keywords.some(k => textLower.includes(k.toLowerCase().trim()))) {
                return rule.reply;
            }
        }
    }

    // 2.2. Chào hỏi thông dụng
    if (textLower.includes("chào") || textLower.includes("hi") || textLower.includes("hello") || textLower.includes("alo") || textLower.includes("ê")) {
        return knowledge.welcomeMessage || "Dạ em chào anh/chị ạ! Em là Trợ lý AI của HAITECH BOT. Anh/chị cần em hỗ trợ tư vấn sản phẩm hay dịch vụ nào ạ? 😊";
    }

    // 2.3. Hỏi giá
    if (textLower.includes("giá") || textLower.includes("nhiêu tiền") || textLower.includes("chi phí") || textLower.includes("báo giá")) {
        return `Dạ bên em có bảng giá ưu đãi tốt nhất hôm nay. Anh/chị vui lòng liên hệ trực tiếp hotline/Zalo: ${knowledge.phone || "0988 739 896"} để em gửi bảng giá chi tiết kèm ưu đãi ạ! 📋`;
    }

    // 2.4. Câu trả lời mặc định khi không khớp từ khóa
    return `Dạ em là ${knowledge.botName || "HAITECH BOT"}. Em đã nhận được tin nhắn của anh/chị: "${userMessage}". Để được tư vấn chi tiết nhất, anh/chị vui lòng gọi hoặc nhắn Zalo hotline: ${knowledge.phone || "0988 739 896"} nhé ạ! Cảm ơn anh/chị! 🙏`;
}

// 3. Khởi động Bot
async function startBot() {
    console.log("=================================================================");
    console.log("🤖 HAITECH BOT - HỆ THỐNG TỰ ĐỘNG TRẢ LỜI TIN NHẮN ZALO CÁ NHÂN 24/7");
    console.log("=================================================================");
    loadKnowledge();

    const zalo = new Zalo();
    let api = null;

    // 3.1. Thử đăng nhập lại bằng phiên đăng nhập đã lưu (session.json)
    if (fs.existsSync(SESSION_FILE)) {
        try {
            console.log("\n🔑 Đang tìm phiên đăng nhập trước đó từ session.json...");
            const sessionData = JSON.parse(fs.readFileSync(SESSION_FILE, "utf8"));
            api = await zalo.login(sessionData);
            console.log("✅ Đăng nhập bằng phiên cũ thành công! Không cần quét lại mã QR.");
        } catch (err) {
            console.log("⚠️ Phiên cũ đã hết hạn hoặc không hợp lệ. Chuẩn bị quét mã QR mới...");
            api = null;
        }
    }

    // 3.2. Nếu chưa có phiên hoặc phiên hết hạn, tiến hành đăng nhập bằng mã QR
    if (!api) {
        console.log("\n⏳ Đang khởi tạo mã QR đăng nhập Zalo...");
        try {
            api = await zalo.loginQR(
                { qrPath: "qr.png" },
                (event) => {
                    if (event.type === LoginQRCallbackEventType.QRCodeGenerated) {
                        event.actions.saveToFile("qr.png").then(() => {
                            console.log("\n🖼️ ĐÃ TẠO MÃ QR ĐĂNG NHẬP THÀNH CÔNG!");
                            console.log("👉 Đang tự động mở ảnh mã QR trên màn hình máy tính...");
                            console.log("👉 Bạn cũng có thể mở trực tiếp file 'qr.png' trong thư mục dự án.");
                            console.log("📱 Vui lòng mở Zalo trên điện thoại -> Bấm quét mã QR để đăng nhập!\n");
                            // Tự động mở ảnh QR trên Windows
                            exec("start qr.png", (err) => {});
                        });
                    } else if (event.type === LoginQRCallbackEventType.QRCodeScanned) {
                        console.log("📱 -> ĐÃ QUÉT MÃ QR! Vui lòng bấm [Đăng nhập] hoặc [Xác nhận] trên điện thoại...");
                    } else if (event.type === LoginQRCallbackEventType.QRCodeExpired) {
                        console.log("⏳ Mã QR đã hết hạn, đang tự tạo lại mã mới...");
                        event.actions.retry();
                    } else if (event.type === LoginQRCallbackEventType.GotLoginInfo) {
                        try {
                            fs.writeFileSync(SESSION_FILE, JSON.stringify(event.data, null, 2), "utf8");
                            console.log("💾 Đã lưu phiên đăng nhập vào session.json cho lần sau!");
                        } catch (e) {}
                    }
                }
            );
        } catch (err) {
            console.error("\n❌ Đăng nhập QR thất bại:", err.message);
            console.log("💡 Gợi ý: Hãy kiểm tra mạng Internet và thử chạy lại CHAY_BOT_ZALO.bat nhé!");
            return;
        }
    }

    // 3.3. Đăng nhập thành công, bắt đầu lắng nghe và trả lời tin nhắn
    console.log("\n=================================================================");
    console.log("🎉 HAITECH BOT ĐÃ SẴN SÀNG HOẠT ĐỘNG 100%!");
    console.log("🟢 BOT ĐANG CHẠY NỀN TRỰC CHAT TRÊN ZALO CỦA BẠN!");
    console.log(`📞 Số điện thoại hotline: ${knowledge.phone || "0988 739 896"}`);
    console.log("💬 Bất kỳ ai nhắn tin đến Zalo, Bot sẽ tự động trả lời theo dữ liệu tri thức.");
    console.log("🛑 Nhấn Ctrl + C hoặc đóng cửa sổ đen này nếu muốn tắt bot.");
    console.log("=================================================================\n");

    api.listener.on("message", async (message) => {
        try {
            const isPlainText = typeof message.data.content === "string";
            // Bỏ qua tin nhắn của chính mình hoặc tin nhắn không phải văn bản
            if (message.isSelf || !isPlainText) return;

            const userText = message.data.content.trim();
            const timeStr = new Date().toLocaleTimeString("vi-VN");
            console.log(`\n📩 [${timeStr}] Khách nhắn: "${userText}"`);

            // Sinh câu trả lời thông minh
            const replyText = generateReply(userText);
            console.log(`🤖 [${timeStr}] HAITECH BOT trả lời: "${replyText.substring(0, 80)}..."`);

            // Gửi tin nhắn phản hồi cho khách
            try {
                await api.sendMessage(
                    {
                        msg: replyText,
                        quote: message.data,
                    },
                    message.threadId,
                    message.type
                );
            } catch (quoteErr) {
                // Nếu reply trích dẫn lỗi thì gửi thường
                await api.sendMessage(
                    { msg: replyText },
                    message.threadId,
                    message.type
                );
            }
            console.log(`✅ [${timeStr}] Gửi phản hồi thành công!`);
        } catch (e) {
            console.error("⚠️ Lỗi khi xử lý tin nhắn:", e.message);
        }
    });

    api.listener.start();
}

startBot();
