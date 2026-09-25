// =============================================================================
// HAITECH BOT - ĐỘNG CƠ TỰ ĐỘNG TRẢ LỜI ZALO CÁ NHÂN 24/7
// Tác giả: HAITECH BOT (Zalo/Hotline: 0988 739 896 - Email: vanhaitech.86@gmail.com)
// =============================================================================

import { Zalo, ThreadType, LoginQRCallbackEventType } from "zca-js";
import qrcode from "qrcode-terminal";
import { PNG } from "pngjs";
import jsQR from "jsqr";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { generateReplyAsync } from "./api/knowledge-engine.js";

const SESSION_FILE = "./session.json";
const KNOWLEDGE_FILE = "./knowledge.json";
const QR_PNG_FILE = "./qr.png";
const QR_HTML_FILE = "./qr.html";

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

// Tự động cập nhật tri thức khi sửa file knowledge.json
try {
    fs.watch(KNOWLEDGE_FILE, (eventType) => {
        if (eventType === "change") {
            console.log("🔄 Phát hiện thay đổi trong knowledge.json! Đang nạp lại...");
            loadKnowledge();
        }
    });
} catch (err) {}

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

    // 2.4. Mặc định
    return `Dạ em là ${knowledge.botName || "HAITECH BOT"}. Em đã nhận được tin nhắn của anh/chị: "${userMessage}". Để được tư vấn chi tiết nhất, anh/chị vui lòng gọi hoặc nhắn Zalo hotline: ${knowledge.phone || "0988 739 896"} nhé ạ! Cảm ơn anh/chị! 🙏`;
}

// 3. Hàm tạo file HTML hiển thị mã QR đẹp mắt và mở trình duyệt
function createAndOpenQRPage(base64Image) {
    const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HAITECH BOT - Quét mã QR đăng nhập Zalo</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0b132b;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      background: #1c2541;
      padding: 36px 32px;
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);
      text-align: center;
      max-width: 440px;
      width: 100%;
      border: 1px solid #3a506b;
    }
    .badge {
      display: inline-block;
      background: #0284c7;
      color: #ffffff;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h1 {
      font-size: 24px;
      margin: 0 0 8px 0;
      color: #38bdf8;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }
    .qr-container {
      background: #ffffff;
      padding: 16px;
      border-radius: 20px;
      display: inline-block;
      margin-bottom: 24px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
    }
    .qr-container img {
      width: 260px;
      height: 260px;
      display: block;
      image-rendering: pixelated;
    }
    .steps {
      background: #0b132b;
      border-radius: 16px;
      padding: 16px 20px;
      text-align: left;
      font-size: 14px;
      line-height: 1.7;
      color: #e2e8f0;
      border-left: 4px solid #38bdf8;
    }
    .steps ol {
      margin: 0;
      padding-left: 20px;
    }
    .steps li {
      margin-bottom: 6px;
    }
    .steps li:last-child {
      margin-bottom: 0;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Động cơ Zalo 24/7</span>
    <h1>HAITECH BOT</h1>
    <p>Vui lòng quét mã QR bên dưới bằng ứng dụng Zalo trên điện thoại của bạn</p>
    
    <div class="qr-container">
      <img src="${base64Image.startsWith('data:') ? base64Image : 'data:image/png;base64,' + base64Image}" alt="Mã QR Zalo">
    </div>

    <div class="steps">
      <ol>
        <li>Mở ứng dụng <b>Zalo</b> trên điện thoại (số 0988 739 896)</li>
        <li>Nhấn biểu tượng <b>Quét mã QR</b> ở góc trên cùng bên phải</li>
        <li>Hướng camera điện thoại vào mã QR này</li>
        <li>Nhấn <b>Đăng nhập</b> (hoặc <b>Xác nhận</b>) trên điện thoại</li>
      </ol>
    </div>

    <div class="footer">
      Sau khi quét xong, bạn có thể đóng tab này lại. Bot sẽ tự động trực 24/7.
    </div>
  </div>
</body>
</html>`;

    try {
        fs.writeFileSync(QR_HTML_FILE, htmlContent, "utf8");
        const fullHtmlPath = path.resolve(QR_HTML_FILE);
        // Mở trên Windows
        exec(`cmd /c start "" "${fullHtmlPath}"`, (err) => {});
    } catch (e) {
        console.warn("⚠️ Không thể tạo qr.html:", e.message);
    }
}

// 4. Khởi động Bot
async function startBot() {
    console.log("=================================================================");
    console.log("🤖 HAITECH BOT - HỆ THỐNG TỰ ĐỘNG TRẢ LỜI TIN NHẮN ZALO CÁ NHÂN 24/7");
    console.log("=================================================================");
    loadKnowledge();

    const zalo = new Zalo();
    let api = null;

    // 4.1. Thử đăng nhập lại bằng phiên cũ (session.json)
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

    // 4.2. Nếu chưa đăng nhập, bắt đầu tạo mã QR
    if (!api) {
        console.log("\n⏳ Đang khởi tạo mã QR đăng nhập Zalo...");
        try {
            api = await zalo.loginQR(
                { qrPath: QR_PNG_FILE },
                async (event) => {
                    if (event.type === LoginQRCallbackEventType.QRCodeGenerated) {
                        try {
                            // Lưu ảnh qr.png
                            await event.actions.saveToFile(QR_PNG_FILE);
                            
                            // Tạo và mở trang web hiển thị mã QR to rõ
                            createAndOpenQRPage(event.data.image);

                            // Giải mã nội dung URL trong ảnh QR để in trực tiếp vào cửa sổ Console
                            try {
                                const buffer = fs.readFileSync(QR_PNG_FILE);
                                const png = PNG.sync.read(buffer);
                                const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
                                
                                if (decoded && decoded.data) {
                                    console.log("\n=================== QUÉT MÃ QR DƯỚI ĐÂY ===================");
                                    qrcode.generate(decoded.data, { small: true });
                                    console.log("===========================================================");
                                }
                            } catch (qrErr) {
                                // Nếu không decode được thì đã có qr.html và qr.png
                            }

                            console.log("\n🖼️ ĐÃ TẠO MÃ QR ĐĂNG NHẬP THÀNH CÔNG!");
                            console.log("👉 1. Trình duyệt web đã tự động mở trang hiển thị mã QR to rõ (qr.html).");
                            console.log("👉 2. Mã QR cũng đã được in trực tiếp ngay trong cửa sổ này (ở trên).");
                            console.log(`👉 3. Hoặc bạn có thể mở ảnh: "${path.resolve(QR_PNG_FILE)}"`);
                            console.log("📱 Vui lòng dùng ứng dụng Zalo trên điện thoại -> Quét mã để đăng nhập!\n");
                            
                        } catch (err) {
                            console.error("Lỗi xử lý QR:", err);
                        }
                    } else if (event.type === LoginQRCallbackEventType.QRCodeScanned) {
                        console.log("📱 -> ĐÃ QUÉT MÃ QR THÀNH CÔNG! Vui lòng bấm [Đăng nhập] hoặc [Xác nhận] trên điện thoại...");
                    } else if (event.type === LoginQRCallbackEventType.QRCodeExpired) {
                        console.log("⏳ Mã QR đã hết hạn, đang tự động tạo lại mã mới...");
                        event.actions.retry();
                    } else if (event.type === LoginQRCallbackEventType.GotLoginInfo) {
                        try {
                            fs.writeFileSync(SESSION_FILE, JSON.stringify(event.data, null, 2), "utf8");
                            console.log("💾 Đã lưu phiên đăng nhập vào session.json cho các lần chạy sau!");
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

    // 4.3. Đăng nhập thành công, bắt đầu nhận diện và trả lời tin nhắn
    console.log("\n=================================================================");
    console.log("🎉 HAITECH BOT ĐÃ SẴN SÀNG HOẠT ĐỘNG 100%!");
    console.log("🟢 BOT ĐANG CHẠY NỀN TRỰC CHAT TRÊN ZALO CỦA BẠN!");
    console.log(`📞 Số điện thoại hotline: ${knowledge.phone || "0988 739 896"}`);
    console.log("-----------------------------------------------------------------");
    console.log("🔒 CHẾ ĐỘ BẢO VỆ: CHỈ CHAT 1-1 VỚI KHÁCH HÀNG (TỰ ĐỘNG BỎ QUA MỌI HỘI NHÓM)");
    console.log("🛑 3 CÁCH NGẮT KẾT NỐI & DỪNG BOT:");
    console.log("   👉 Cách 1: Gõ chữ 'q' rồi bấm Enter (hoặc nhấn Ctrl + C) tại cửa sổ này.");
    console.log("   👉 Cách 2: Nhấp đúp chuột vào file: NGAT_KET_NOI_BOT.bat");
    console.log("   👉 Cách 3: Từ Zalo trên điện thoại, bạn nhắn tin chữ: #tatbot hoặc #ngatketnoi");
    console.log("=================================================================\n");

    // Lắng nghe phím bấm tại Console để ngắt kết nối nhanh
    if (process.stdin.isTTY) {
        process.stdin.setEncoding("utf8");
        process.stdin.on("data", (chunk) => {
            const input = chunk.toString().trim().toLowerCase();
            if (input === "q" || input === "exit" || input === "stop" || input === "tat" || input === "ngat") {
                console.log("\n🛑 Đang ngắt kết nối và dừng Bot theo yêu cầu của bạn...");
                try {
                    if (fs.existsSync(SESSION_FILE)) fs.unlinkSync(SESSION_FILE);
                    if (fs.existsSync(QR_PNG_FILE)) fs.unlinkSync(QR_PNG_FILE);
                    if (fs.existsSync(QR_HTML_FILE)) fs.unlinkSync(QR_HTML_FILE);
                } catch (e) {}
                console.log("✅ Đã ngắt kết nối sạch sẽ. Tạm biệt!\n");
                process.exit(0);
            }
        });
    }

    api.listener.on("message", async (message) => {
        try {
            const isPlainText = typeof message.data.content === "string";
            if (!isPlainText) return;

            const userText = message.data.content.trim();

            // 1. TÍNH NĂNG NGẮT KẾT NỐI TỪ XA:
            // Nhận diện lệnh tắt bot từ chính tài khoản của bạn (gửi từ điện thoại)
            if (message.isSelf) {
                const cmd = userText.toLowerCase();
                if (cmd === "#tatbot" || cmd === "#ngatketnoi" || cmd === "#stop" || cmd === "tat bot" || cmd === "ngat ket noi") {
                    console.log("\n=================================================================");
                    console.log("🛑 NHẬN ĐƯỢC LỆNH NGẮT KẾT NỐI TỪ ĐIỆN THOẠI CỦA BẠN (#tatbot / #ngatketnoi)!");
                    console.log("🔒 Đang dừng Bot và xóa phiên đăng nhập...");
                    console.log("=================================================================\n");
                    try {
                        if (fs.existsSync(SESSION_FILE)) fs.unlinkSync(SESSION_FILE);
                        if (fs.existsSync(QR_PNG_FILE)) fs.unlinkSync(QR_PNG_FILE);
                        if (fs.existsSync(QR_HTML_FILE)) fs.unlinkSync(QR_HTML_FILE);
                    } catch (e) {}
                    process.exit(0);
                }
                return; // Bỏ qua tin nhắn khác của chính mình
            }

            // 2. TÍNH NĂNG BẢO VỆ CHỈ CHAT 1-1 RIÊNG TƯ:
            // Tuyệt đối không bao giờ nhắn tin vào hội nhóm Zalo (Group Chat)
            if (message.type !== ThreadType.User) {
                console.log(`🛡️ [BỎ QUA HỘI NHÓM] Tin nhắn từ nhóm chat Zalo (Thread ID: ${message.threadId}). Bot CHỈ trả lời chat 1-1 với khách cá nhân.`);
                return;
            }

            const timeStr = new Date().toLocaleTimeString("vi-VN");
            console.log(`\n📩 [${timeStr}] [Khách 1-1] Nhắn: "${userText}"`);

            // Sinh câu trả lời thông minh từ Động Cơ Trí Tuệ Kép (Bộ Não 1 + Bộ Não 2 GPT)
            const result = await generateReplyAsync(userText, knowledge);
            const replyText = result.reply;
            console.log(`🤖 [${timeStr}] [${result.model}] HAITECH BOT trả lời: "${replyText.substring(0, 80)}..."`);

            // Gửi tin nhắn phản hồi cho khách cá nhân 1-1
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
