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

// Bắt các lỗi chưa xử lý để đảm bảo Bot chạy 24/7 không bị dừng đột ngột (Crash Protection)
process.on('uncaughtException', (err) => {
    console.error('⚠️ [Hệ thống tự bảo vệ] Bắt lỗi Uncaught Exception (ngăn sập bot):', err?.message || err);
});
process.on('unhandledRejection', (reason) => {
    console.warn('⚠️ [Hệ thống tự bảo vệ] Bắt lỗi Unhandled Rejection (ngăn sập bot):', reason?.message || reason);
});

const SESSION_FILE = "./session.json";
const KNOWLEDGE_FILE = "./knowledge.json";
const QR_PNG_FILE = "./qr.png";
const QR_HTML_FILE = "./qr.html";
const STATUS_FILE = "./bot-status.json";

// Biến trạng thái BẬT/TẮT & Chế độ hoạt động
let isBotActive = true;
let botMode = "smart_customer_only"; // "smart_customer_only" (Lọc khách) | "assistant_only" (Chỉ phục vụ Sếp) | "all_247" (Tất cả)

// Hàm chuẩn hóa chuỗi lệnh tiếng Việt (bỏ dấu, chuyển chữ thường, loại bỏ ký tự đặc biệt)
function normalizeCommand(str) {
    if (!str) return "";
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// Bộ nhớ đệm lưu các câu trả lời do Bot vừa phát ra để chống lặp vô tận khi tự chat
const recentSentReplies = new Set();
function markSentReply(text) {
    if (!text) return;
    const norm = text.trim();
    recentSentReplies.add(norm);
    setTimeout(() => recentSentReplies.delete(norm), 35000);
}

function loadBotStatus() {
    try {
        if (fs.existsSync(STATUS_FILE)) {
            const raw = fs.readFileSync(STATUS_FILE, "utf8");
            const parsed = JSON.parse(raw);
            if (typeof parsed.active === "boolean") {
                isBotActive = parsed.active;
            }
            if (parsed.mode) {
                botMode = parsed.mode;
            }
        }
    } catch (e) {}
}
loadBotStatus();

// Nếu chạy từ BAT_THUY_LINH.bat hoặc có tham số --force-active, đảm bảo luôn BẬT
if (process.argv.includes('--force-active') || process.env.FORCE_ACTIVE === 'true') {
    isBotActive = true;
    botMode = "smart_customer_only";
    try {
        fs.writeFileSync(STATUS_FILE, JSON.stringify({
            active: true,
            mode: "smart_customer_only",
            updatedAt: new Date().toISOString()
        }, null, 2), "utf8");
    } catch (e) {}
}

function setBotStatus(active, mode = null) {
    if (active !== null) isBotActive = active;
    if (mode !== null) botMode = mode;
    try {
        fs.writeFileSync(STATUS_FILE, JSON.stringify({
            active: isBotActive,
            mode: botMode,
            updatedAt: new Date().toISOString()
        }, null, 2), "utf8");
    } catch (e) {}
}

function setBotActive(active) {
    setBotStatus(active, null);
}

// Tự động cập nhật trạng thái khi file bot-status.json thay đổi
try {
    if (!fs.existsSync(STATUS_FILE)) {
        setBotStatus(true, "smart_customer_only");
    }
    fs.watch(STATUS_FILE, (eventType) => {
        if (eventType === "change") {
            loadBotStatus();
            const modeText = botMode === 'assistant_only' ? '👑 Trợ lý riêng cho Sếp Hải' : (botMode === 'smart_customer_only' ? '🎯 Lọc khách thông minh' : '🌐 Toàn diện 24/7');
            console.log(`🔄 Trạng thái Bot đã cập nhật: ${isBotActive ? '🟢 ĐANG BẬT (Trực 24/7)' : '🛑 ĐANG TẮT'} | Chế độ: ${modeText}`);
        }
    });
} catch (err) {}

// Hàm nhận diện câu hỏi có ý định mua hàng / dịch vụ / công nghệ (Lọc bạn bè thông minh)
function isBusinessInquiry(text, kb) {
    if (!text) return false;
    const lower = text.toLowerCase().trim();

    // 1. Khớp từ khóa trong quy tắc tri thức knowledge.json
    if (kb && kb.rules && Array.isArray(kb.rules)) {
        for (const rule of kb.rules) {
            if (Array.isArray(rule.keywords)) {
                for (const kw of rule.keywords) {
                    if (lower.includes(kw.toLowerCase())) return true;
                }
            }
        }
    }

    // 2. Các từ khóa kinh doanh, thương mại, báo giá, hỏi dịch vụ
    const bizKeywords = [
        "mua", "bán", "giá", "nhiêu", "chi phí", "báo giá", "tư vấn", "dịch vụ",
        "hỗ trợ", "triển khai", "demo", "dùng thử", "trial", "liên hệ", "sđt", "hotline",
        "stk", "tài khoản", "ngân hàng", "chuyển khoản", "hợp đồng", "dự án", "thiết kế",
        "lập trình", "viết phần mềm", "quảng cáo", "marketing", "affiliate", "mmo",
        "kiếm tiền", "cào dữ liệu", "nuôi nick", "shop", "công ty", "bên bạn", "bên em",
        "sản phẩm", "gói", "phần mềm", "website", "ứng dụng", "tiktok", "reels"
    ];
    for (const kw of bizKeywords) {
        if (lower.includes(kw)) return true;
    }

    // 3. Lời chào của khách hàng/người lạ hoặc gọi đích danh Trợ lý Thùy Linh / Bot
    const greetings = [
        "thùy linh", "thuylinh", "thuy linh", "bot ơi", "bot oi", "em thùy linh", "em thuylinh",
        "trợ lý", "tro ly", "@thuylinh", "chào shop", "xin chào shop", "chào công ty",
        "ad ơi", "admin ơi", "shop ơi", "chào bạn", "chào em", "alo em"
    ];
    for (const g of greetings) {
        if (lower.includes(g)) return true;
    }

    return false;
}

// Hàm kiểm tra xem bot có được gọi tên / tag @mentions / quote trong nhóm chat Zalo không
function isBotMentionedInGroup(message, userText, ownId) {
    if (!userText && !message.data?.quote) return false;

    const groupConfig = knowledge.groupConfig || {};
    // 0. Nếu tính năng nhóm bị tắt hoàn toàn trong cấu hình -> bỏ qua
    if (groupConfig.enabled === false || knowledge.channels?.zaloPersonal?.replyInGroups === false) {
        return false;
    }

    const threadId = String(message.threadId || '');
    // Kiểm tra danh sách nhóm bị chặn (Blacklist)
    if (Array.isArray(groupConfig.blockedGroupIds) && groupConfig.blockedGroupIds.includes(threadId)) {
        return false;
    }
    // Kiểm tra danh sách nhóm chỉ định (Whitelist)
    if (Array.isArray(groupConfig.allowedGroupIds) && groupConfig.allowedGroupIds.length > 0 && !groupConfig.allowedGroupIds.includes(threadId)) {
        return false;
    }

    // Nếu cấu hình trả lời mọi tin nhắn trong nhóm (không cần gọi tên)
    if (groupConfig.replyOnlyWhenMentioned === false) {
        return true;
    }

    // 1. Kiểm tra Mentions chính thức từ Zalo protocol (khi thành viên gõ @ và chọn tài khoản Bot)
    if (message.data?.mentions && Array.isArray(message.data.mentions)) {
        if (ownId && message.data.mentions.some(m => String(m.uid) === String(ownId))) {
            return true;
        }
    }

    // 2. Kiểm tra Trích dẫn / Trả lời (Quote / Reply) tin nhắn của Bot
    // Khi một người trong nhóm bấm "Trả lời" (Quote) một tin nhắn mà Bot đã gửi trước đó
    if (message.data?.quote) {
        const q = message.data.quote;
        const quoteOwnerId = String(q.ownerId || q.uid || q.fromId || q.from || '');
        if (ownId && quoteOwnerId && quoteOwnerId === String(ownId)) {
            return true;
        }
        // Kiểm tra nội dung trích dẫn có phải là câu trả lời của Bot không
        if (q.msg && recentSentReplies.has(q.msg.trim())) {
            return true;
        }
    }

    // 3. Kiểm tra các cách gọi tên trong văn bản tin nhắn
    const lower = (userText || '').toLowerCase().trim();

    // 3.1. Các từ khóa gọi chuẩn mực
    const baseTriggers = [
        "@bot", "bot ơi", "bot oi", "bot cho hỏi", "bot cho anh hỏi", "bot cho chị hỏi", "bot cho em hỏi",
        "trợ lý ơi", "tro ly oi", "trợ lý cho hỏi", "tro ly cho hoi",
        "ad ơi", "admin ơi", "shop ơi", "em bot", "bot tư vấn"
    ];

    // 3.2. Từ khóa do chủ shop / khách hàng cấu hình trong Dashboard hoặc knowledge.json
    let customTriggers = [];
    if (Array.isArray(groupConfig.triggers) && groupConfig.triggers.length > 0) {
        customTriggers = groupConfig.triggers.map(t => String(t).toLowerCase().trim()).filter(Boolean);
    }

    // 3.3. Tự động sinh từ khóa từ Tên Trợ Lý (knowledge.botName)
    const botName = (knowledge.botName || 'Em Thùy Linh').toLowerCase();
    const nameTriggers = [];
    if (botName.includes('thùy linh') || botName.includes('thuy linh')) {
        nameTriggers.push("@thuylinh", "@thùylinh", "@thùy linh", "@thuy linh", "thùy linh ơi", "thuylinh ơi", "thuy linh oi", "thuylinh oi", "em thùy linh", "em thuylinh", "#thuylinh", "#tl");
    } else {
        // Trích xuất các từ tên gọi (ví dụ "Em Mai" -> "@mai", "mai ơi")
        const cleanName = botName.replace(/^(em|trợ lý|tro ly|bot|chuyên viên)\s+/i, '').trim();
        if (cleanName.length >= 2) {
            nameTriggers.push(`@${cleanName}`, `${cleanName} ơi`, `${cleanName} oi`);
        }
    }

    const allTriggers = Array.from(new Set([...baseTriggers, ...customTriggers, ...nameTriggers]));

    return allTriggers.some(kw => lower.includes(kw));
}

// Hàm làm sạch từ khóa mention để đưa câu hỏi thuần túy vào bộ não AI
function cleanMentionText(text) {
    if (!text) return "Chào bạn, mình cần hỗ trợ.";

    let cleaned = text;

    // Lấy các từ khóa gọi tên để xóa bỏ khỏi đầu câu
    const groupConfig = knowledge.groupConfig || {};
    const customTriggers = Array.isArray(groupConfig.triggers) ? groupConfig.triggers : [];
    const botName = knowledge.botName || 'Em Thùy Linh';

    const patterns = [
        /@?(thùy linh|thuylinh|thuy linh|bot|trợ lý|tro ly)\s*(ơi|oi)?/gi,
        /@\S+/g // Xóa tag @tên bất kỳ
    ];

    for (const pat of patterns) {
        cleaned = cleaned.replace(pat, ' ');
    }

    for (const trig of customTriggers) {
        if (trig && trig.length >= 2) {
            cleaned = cleaned.split(new RegExp(`\\b${trig}\\b`, 'gi')).join(' ');
        }
    }

    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned || `Chào ${botName}, cho mình hỏi thông tin tư vấn.`;
}

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
            botName: "Em Thùy Linh - Trợ lý HAITECH BOT",
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

    const zalo = new Zalo({ selfListen: true });
    let api = null;

    // 4.1. Thử đăng nhập lại bằng phiên cũ (từ biến môi trường ZALO_SESSION_JSON hoặc file session.json)
    let sessionData = null;
    if (process.env.ZALO_SESSION_JSON) {
        try {
            console.log("\n🔑 Đang nạp phiên đăng nhập từ biến môi trường ZALO_SESSION_JSON (Cloud)...");
            sessionData = JSON.parse(process.env.ZALO_SESSION_JSON);
        } catch (e) {
            console.warn("⚠️ Biến môi trường ZALO_SESSION_JSON không đúng JSON:", e.message);
        }
    } else if (fs.existsSync(SESSION_FILE)) {
        try {
            console.log("\n🔑 Đang tìm phiên đăng nhập trước đó từ session.json...");
            sessionData = JSON.parse(fs.readFileSync(SESSION_FILE, "utf8"));
        } catch (err) {}
    }

    if (sessionData) {
        try {
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
    console.log("🎉 HAITECH BOT - TRỢ LÝ THÙY LINH ĐÃ SẴN SÀNG HOẠT ĐỘNG 100%!");
    console.log(`🟢 TRẠNG THÁI HIỆN TẠI: ${isBotActive ? 'ĐANG BẬT (Trực 24/7)' : 'ĐANG TẮT (Tạm dừng)'}`);
    console.log(`📞 Số điện thoại hotline: ${knowledge.phone || "0988 739 896"}`);
    console.log("-----------------------------------------------------------------");
    console.log("📱 ĐIỀU KHIỂN TỪ ĐIỆN THOẠI (Qua 'Cloud của tôi' / My Documents / Truyền File):");
    console.log("   👉 Nhắn '#tat' hoặc '#tatbot': Tạm dừng trợ lý Thùy Linh (tự chat tay với khách)");
    console.log("   👉 Nhắn '#bat' hoặc '#batbot': Bật trợ lý Thùy Linh tự động trực 24/7");
    console.log("   👉 Nhắn '#trangthai': Xem trạng thái BẬT/TẮT hiện tại");
    console.log("   👉 Nhắn bất kỳ câu hỏi nào: Để trò chuyện / test trực tiếp với Thùy Linh");
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

    // Lưu trữ lịch sử hội thoại cho từng khách hàng để Bộ Não AI nhớ ngữ cảnh và trả lời liên tục
    const customerHistories = new Map();

    function getCustomerHistory(threadId) {
        if (!customerHistories.has(threadId)) {
            customerHistories.set(threadId, []);
        }
        return customerHistories.get(threadId);
    }

    function addCustomerHistory(threadId, role, text) {
        const list = getCustomerHistory(threadId);
        list.push({ role, text, time: Date.now() });
        if (list.length > 12) list.shift();
    }

    // Buffer tin nhắn chờ để gộp các tin nhắn gửi liên tục trong 1.5 giây
    // Giúp Bộ Não AI hiểu trọn vẹn ngữ cảnh của khách và trả lời đúng trọng tâm một lần duy nhất
    const pendingMessageBuffers = new Map();

    // Bộ nhớ đệm đã được quản lý ở module level

    // Tự động thu thập khách hàng tiềm năng (Leads) & Đồng bộ lưu trữ Online
    const LEADS_FILE = "./leads.json";
    async function handleLeadCapture(threadId, lastData, userText) {
        try {
            // Regex tìm số điện thoại Việt Nam 10 số (bắt đầu bằng 03, 05, 07, 08, 09)
            const phoneRegex = /(0[3|5|7|8|9][0-9]{8})\b/g;
            const matches = userText.match(phoneRegex);
            if (!matches || matches.length === 0) return;

            const capturedPhone = matches[0];
            const senderName = lastData?.dName || lastData?.displayName || "Khách Zalo";
            const timeStr = new Date().toLocaleTimeString("vi-VN");
            const dateStr = new Date().toLocaleDateString("vi-VN");

            const leadRecord = {
                id: 'lead_' + Date.now(),
                customerName: senderName,
                phone: capturedPhone,
                message: userText,
                threadId: String(threadId),
                shopName: knowledge.botName || knowledge.brandName || "HAITECH BOT",
                time: `${timeStr} ${dateStr}`,
                createdAt: new Date().toISOString()
            };

            console.log(`\n🎯 [PHÁT HIỆN SỐ ĐIỆN THOẠI KHÁCH HÀNG] 📞 SĐT: ${capturedPhone} | Tên: ${senderName}`);

            // 1. Lưu cục bộ vào file leads.json
            let localLeads = [];
            if (fs.existsSync(LEADS_FILE)) {
                try { localLeads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf8")); } catch(e) { localLeads = []; }
            }
            const isDuplicate = localLeads.some(l => l.phone === capturedPhone && (Date.now() - new Date(l.createdAt).getTime() < 86400000));
            if (!isDuplicate) {
                localLeads.unshift(leadRecord);
                if (localLeads.length > 500) localLeads = localLeads.slice(0, 500);
                fs.writeFileSync(LEADS_FILE, JSON.stringify(localLeads, null, 2), "utf8");
                console.log(`💾 Đã lưu thông tin khách vào leads.json`);
            }

            // 2. Gửi đồng bộ lên Online Webhook (Google Sheets / Cloud API) nếu có cấu hình
            const onlineUrl = knowledge.onlineStorageUrl || knowledge.onlineWebhookUrl || process.env.ONLINE_LEADS_WEBHOOK;
            if (onlineUrl && typeof onlineUrl === "string" && onlineUrl.startsWith("http")) {
                try {
                    await fetch(onlineUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(leadRecord)
                    });
                    console.log(`☁️ [Cloud Sync] Đã lưu dữ liệu khách hàng lên Online (Google Sheets/Cloud) thành công!`);
                } catch (netErr) {
                    console.warn(`⚠️ [Cloud Sync] Lỗi gửi tới Webhook Online:`, netErr.message);
                }
            }

            // 3. Bắn thông báo về "Cloud của tôi" trên Zalo của chủ shop
            const ctx = api.getContext ? api.getContext() : null;
            const send2meId = ctx?.loginInfo?.send2me_id ? String(ctx.loginInfo.send2me_id) : null;
            if (send2meId && String(threadId) !== send2meId) {
                const notifyMsg = `🔔 [CÓ KHÁCH HÀNG MỚI ĐỂ LẠI SĐT]\n\n👤 Khách: ${senderName}\n📞 Số điện thoại: ${capturedPhone}\n💬 Lời nhắn: "${userText}"\n⏰ Thời gian: ${timeStr} ${dateStr}\n\n👉 Anh/chị hãy gọi điện hoặc nhắn tin tư vấn chốt đơn ngay nhé! 🚀`;
                markSentReply(notifyMsg);
                try {
                    await api.sendMessage({ msg: notifyMsg }, send2meId, ThreadType.User);
                    console.log(`📲 Đã gửi thông báo lead mới vào 'Cloud của tôi' trên Zalo!`);
                } catch(e) {}
            }
        } catch(e) {
            console.error("Lỗi khi xử lý lead:", e.message);
        }
    }

    async function processAndReply(threadId, lastData, userText, threadType = ThreadType.User, isBossMode = false, isGroupMode = false) {
        try {
            const timeStr = new Date().toLocaleTimeString("vi-VN");
            let targetLabel = "Khách 1-1";
            if (isBossMode) targetLabel = "👑 SẾP HẢI (Cloud của tôi)";
            else if (isGroupMode || threadType === ThreadType.Group) targetLabel = `👥 Nhóm ${threadId} (Gọi @thuylinh)`;
            console.log(`\n📩 [${timeStr}] [${targetLabel}] Nhắn:\n"${userText}"`);

            // Đọc lại dữ liệu tri thức mới nhất từ knowledge.json
            loadKnowledge();

            // Tự động phát hiện SĐT khách hàng và lưu trữ online (cả chat 1-1 và trong nhóm)
            if (!isBossMode) {
                handleLeadCapture(threadId, lastData, userText);
            }

            // Xử lý lệnh đặc biệt của Sếp Hải trong Cloud của tôi: #leads hoặc xem danh sách khách
            if (isBossMode && (userText.toLowerCase() === '#leads' || userText.toLowerCase().includes('danh sách khách') || userText.toLowerCase().includes('xem lead') || userText.toLowerCase().includes('xem khách'))) {
                let leadsInfo = "📋 [DANH SÁCH KHÁCH HÀNG ĐÃ THU THẬP TỪ ZALO]\n";
                try {
                    const leadsFile = path.resolve(process.cwd(), 'leads.json');
                    if (fs.existsSync(leadsFile)) {
                        const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
                        if (leads.length > 0) {
                            leadsInfo += `Hiện có ${leads.length} khách hàng tiềm năng đã để lại SĐT:\n\n`;
                            leads.slice(-8).reverse().forEach((l, idx) => {
                                leadsInfo += `${idx + 1}. 📞 SĐT: ${l.phone}\n   👤 Tên: ${l.name || 'Khách Zalo'}\n   🕒 Giờ: ${new Date(l.capturedAt).toLocaleTimeString('vi-VN')} (${new Date(l.capturedAt).toLocaleDateString('vi-VN')})\n   💬 Tin: "${(l.context || '').slice(0, 60)}..."\n\n`;
                            });
                        } else {
                            leadsInfo += "Chưa có số điện thoại khách hàng mới nào được lưu trong hệ thống.";
                        }
                    } else {
                        leadsInfo += "Chưa có khách hàng mới nào được ghi nhận.";
                    }
                } catch (e) {
                    leadsInfo += "Lỗi đọc dữ liệu: " + e.message;
                }

                markSentReply(leadsInfo);
                const ownId = api.getOwnId ? String(api.getOwnId()) : null;
                const ctx = api.getContext ? api.getContext() : null;
                const send2meId = ctx?.loginInfo?.send2me_id ? String(ctx.loginInfo.send2me_id) : null;
                const targetThreadId = (ownId && String(threadId) === ownId && send2meId) ? send2meId : threadId;
                await api.sendMessage({ msg: leadsInfo }, targetThreadId, threadType);
                return;
            }

            // Lấy lịch sử hội thoại gần nhất của đối tượng này để Bộ Não AI hiểu ngữ cảnh
            const history = getCustomerHistory(threadId);

            // Sinh câu trả lời thông minh từ Động Cơ Trí Tuệ Kép (Bộ Não 2 Gemini/AI)
            let result;
            if (isBossMode) {
                // Prompt trợ lý cá nhân riêng biệt dành cho Sếp Nguyễn Văn Hải
                const bossKb = {
                    ...knowledge,
                    aiConfig: {
                        ...(knowledge.aiConfig || {}),
                        systemPrompt: `Bạn là 'Em Thùy Linh', thư ký và trợ lý AI riêng đắc lực, thông minh, tận tâm của anh Nguyễn Văn Hải (Nhà sáng lập HaiTech AI - Hotline/Zalo: 0988 739 896).
Hiện tại bạn ĐANG LÀM VIỆC TRỰC TIẾP VỚI ANH HẢI (SẾP / CHỦ NHÂN CỦA BẠN) trong kênh riêng tư 'Cloud của tôi'.

QUY TẮC PHỤC VỤ ANH HẢI:
1. Xưng 'em', gọi anh là 'anh Hải' hoặc 'anh' một cách kính trọng, thân mật, nhanh nhẹn, tháo vát (Ví dụ: "Dạ em nghe anh Hải đây ạ!", "Dạ để em hỗ trợ anh Hải ngay nhé!").
2. TUYỆT ĐỐI KHÔNG coi anh Hải là khách hàng ngoài hay tư vấn bán dịch vụ cho anh Hải. Anh Hải chính là Sếp đã tạo ra bạn!
3. TRỢ LÝ TOÀN NĂNG HỖ TRỢ ANH HẢI:
   - Soạn bài viết bán hàng, viết content Zalo/Facebook, viết kịch bản video TikTok/Reels viral triệu view.
   - Hỗ trợ lập trình code, viết tool tự động hóa MMO, sửa code web/app, giải đáp kỹ thuật, thuật toán.
   - Lên kế hoạch kinh doanh, tính giá thành dự án, phân tích thị trường, dịch thuật nhanh.
   - Trả lời nhanh gọn, sắc sảo, đi thẳng vào đáp án và giải pháp thực tế nhất cho anh Hải.`
                    }
                };
                result = await generateReplyAsync(userText, bossKb, history);
            } else if (isGroupMode || threadType === ThreadType.Group) {
                // Prompt trợ lý tư vấn trong nhóm chat & hỗ trợ chốt đơn
                const botName = knowledge.botName || 'Em Thùy Linh';
                const brandName = knowledge.brandName || 'HaiTech AI';
                const phone = knowledge.phone || '0988 739 896';
                const groupCustomPrompt = knowledge.groupConfig?.groupSystemPrompt || '';

                const groupKb = {
                    ...knowledge,
                    aiConfig: {
                        ...(knowledge.aiConfig || {}),
                        systemPrompt: groupCustomPrompt || `Bạn là '${botName}' — trợ lý AI thông minh, duyên dáng và chuyên nghiệp của ${brandName} (Hotline/Zalo: ${phone}).
Hiện tại bạn ĐANG TRẢ LỜI MỘT THÀNH VIÊN TRONG HỘI NHÓM ZALO vừa gọi tên hoặc trích dẫn bạn.

NGUYÊN TẮC TRẢ LỜI TRONG HỘI NHÓM:
1. Xưng 'em', gọi người hỏi là 'anh/chị' một cách lịch sự, nhã nhặn, tôn trọng.
2. Trả lời trực tiếp, rõ ràng, cô đọng trong 2 - 3 câu để KHÔNG LÀM LOÃNG HỘI NHÓM.
3. TƯ VẤN & HỖ TRỢ CHỐT ĐƠN:
   - Nếu khách hỏi về sản phẩm/dịch vụ: Tư vấn trọng tâm giải pháp, ngắn gọn và hữu ích.
   - Gợi ý khách kết nối trực tiếp hoặc nhắn tin riêng với shop để được tư vấn chuyên sâu và nhận báo giá ưu đãi nhất!
4. TUYỆT ĐỐI không spam, không chèn số điện thoại tràn lan trừ khi thành viên hỏi trực tiếp.`
                    }
                };
                result = await generateReplyAsync(userText, groupKb, history);
            } else {
                result = await generateReplyAsync(userText, knowledge, history);
            }

            const replyText = result.reply;
            let logName = "HAITECH BOT";
            if (isBossMode) logName = "EM THÙY LINH (Trợ lý riêng)";
            else if (isGroupMode || threadType === ThreadType.Group) logName = "EM THÙY LINH (Trực nhóm)";
            console.log(`🤖 [${timeStr}] [${result.model}] ${logName} trả lời: "${replyText.substring(0, 100)}..."`);

            // Đánh dấu câu trả lời của Bot để chống vòng lặp tự phản hồi chính mình
            markSentReply(replyText);

            // Cập nhật vào lịch sử hội thoại đa lượt
            addCustomerHistory(threadId, 'user', userText);
            addCustomerHistory(threadId, 'model', replyText);

            // Xác định ID đích chuẩn: Nếu gửi cho chính mình hoặc Cloud của tôi, dùng send2me_id
            const ownId = api.getOwnId ? String(api.getOwnId()) : null;
            const ctx = api.getContext ? api.getContext() : null;
            const send2meId = ctx?.loginInfo?.send2me_id ? String(ctx.loginInfo.send2me_id) : null;
            const targetThreadId = (ownId && String(threadId) === ownId && send2meId) ? send2meId : threadId;

            // Nghỉ nhẹ tự nhiên: 0ms khi phục vụ Sếp trong Cloud, 150ms khi chat với khách
            if (!isBossMode && targetThreadId !== send2meId) {
                await new Promise(r => setTimeout(r, 150));
            }

            // Gửi tin nhắn phản hồi (ưu tiên quote trích dẫn trong nhóm để mọi người nhận biết)
            try {
                if (threadType === ThreadType.Group && lastData) {
                    await api.sendMessage(
                        {
                            msg: replyText,
                            quote: lastData
                        },
                        targetThreadId,
                        threadType
                    );
                    console.log(`✅ [${timeStr}] Gửi phản hồi nhóm thành công (trích dẫn)!`);
                } else {
                    await api.sendMessage(
                        { msg: replyText },
                        targetThreadId,
                        threadType
                    );
                    console.log(`✅ [${timeStr}] Gửi phản hồi thành công!`);
                }
            } catch (sendErr) {
                // Nếu gửi thường không được thì thử gửi dạng trích dẫn (chỉ khi không phải gửi vào Cloud của tôi)
                if (targetThreadId !== send2meId) {
                    try {
                        await api.sendMessage(
                            {
                                msg: replyText,
                                quote: lastData,
                            },
                            targetThreadId,
                            threadType
                        );
                        console.log(`✅ [${timeStr}] Gửi phản hồi thành công (trích dẫn dự phòng)!`);
                    } catch (quoteErr) {
                        console.error("⚠️ Lỗi khi gửi tin nhắn Zalo:", quoteErr.message);
                    }
                } else {
                    console.error("⚠️ Lỗi khi gửi tin nhắn Zalo vào Cloud:", sendErr.message);
                }
            }
        } catch (e) {
            console.error("⚠️ Lỗi khi xử lý tin nhắn:", e.message);
        }
    }

    api.listener.on("message", async (message) => {
        try {
            const isPlainText = typeof message.data.content === "string";
            if (!isPlainText) return;

            const userText = message.data.content.trim();

            // Nếu tin nhắn này do chính Bot vừa phát ra (echo về từ socket Zalo), bỏ qua ngay!
            if (recentSentReplies.has(userText)) {
                return;
            }

            const ownId = api.getOwnId ? String(api.getOwnId()) : null;
            const ctx = api.getContext ? api.getContext() : null;
            const send2meId = ctx?.loginInfo?.send2me_id ? String(ctx.loginInfo.send2me_id) : null;

            const isCloudOfMine = (ownId && String(message.threadId) === ownId) ||
                                  (send2meId && String(message.threadId) === send2meId) ||
                                  (message.data?.idTo && String(message.data.idTo) === send2meId);
            const isTestPrefix = userText.toLowerCase().startsWith("test:") || userText.toLowerCase().startsWith("#test") || userText.toLowerCase().startsWith("bot:");
            const replyDest = (isCloudOfMine && send2meId) ? send2meId : message.threadId;

            // 1. NẾU LÀ TIN NHẮN TRONG HỘI NHÓM:
            if (message.type === ThreadType.Group) {
                // CHỈ PHẢN HỒI TRONG NHÓM KHI CÓ NGƯỜI GỌI TÊN @thuylinh HOẶC MENTION (Kể cả Sếp Hải hay thành viên khác)
                const ownId = api.getOwnId ? String(api.getOwnId()) : null;
                const isMentioned = isBotMentionedInGroup(message, userText, ownId);

                if (!isMentioned) {
                    // Nếu không có ai gọi @thuylinh -> Tuyệt đối im lặng, không xen vào trò chuyện của nhóm
                    return;
                }

                // Nếu bot đang tắt -> không phản hồi
                if (!isBotActive) {
                    return;
                }

                // Đã được gọi tên trong nhóm -> Làm sạch tiền tố mention và phản hồi ngay lập tức
                const cleanGroupPrompt = cleanMentionText(userText);
                console.log(`\n👥 [NHÓM ZALO ${message.threadId}] Có người gọi @thuylinh: "${userText}"`);
                await processAndReply(message.threadId, message.data, cleanGroupPrompt, ThreadType.Group, false, true);
                return;
            }

            // 2. TÍNH NĂNG ĐIỀU KHIỂN & LÀM VIỆC TRỰC TIẾP VỚI SẾP HẢI QUA "CLOUD CỦA TÔI" (TRUYỀN FILE):
            const isFromBoss = message.isSelf || isCloudOfMine;
            if (isFromBoss) {
                const rawCmd = userText.toLowerCase().trim();
                const normCmd = normalizeCommand(userText);

                // 2.1. LỆNH ĐĂNG XUẤT HOÀN TOÀN
                const isLogoutCmd = rawCmd === "#dangxuat" || rawCmd === "#đăngxuất" || rawCmd === "#logout" || rawCmd === "#reset" ||
                                    normCmd === "dang xuat" || normCmd === "logout";
                if (isLogoutCmd) {
                    console.log("\n=================================================================");
                    console.log("🛑 NHẬN ĐƯỢC LỆNH ĐĂNG XUẤT TỪ ĐIỆN THOẠI CỦA BẠN (#dangxuat)!");
                    console.log("🔒 Đang dừng Bot và xóa phiên đăng nhập...");
                    console.log("=================================================================\n");
                    try {
                        const logoutMsg = "🔒 [HAITECH BOT] Đã ngắt kết nối và đăng xuất tài khoản Zalo theo yêu cầu của bạn. Tạm biệt!";
                        markSentReply(logoutMsg);
                        await api.sendMessage({ msg: logoutMsg }, replyDest, ThreadType.User);
                    } catch (e) {}
                    try {
                        if (fs.existsSync(SESSION_FILE)) fs.unlinkSync(SESSION_FILE);
                        if (fs.existsSync(QR_PNG_FILE)) fs.unlinkSync(QR_PNG_FILE);
                        if (fs.existsSync(QR_HTML_FILE)) fs.unlinkSync(QR_HTML_FILE);
                    } catch (e) {}
                    process.exit(0);
                }

                // 2.2. LỆNH BẬT BOT (TRỰC CHIẾN 24/7) - Nhận diện linh hoạt mọi biến thể lệnh bật
                const isTurnOnCmd = (
                    rawCmd === "#bat" || rawCmd === "#bật" || rawCmd === "#batbot" || rawCmd === "#bậtbot" ||
                    rawCmd === "#on" || rawCmd === "#start" || rawCmd === "#resume" || rawCmd === "#online" ||
                    normCmd === "bat" || normCmd === "bat bot" || normCmd === "bat len" || normCmd === "bat lai" ||
                    normCmd === "bat tro ly" || normCmd === "bat thuy linh" || normCmd === "bat em thuy linh" ||
                    normCmd === "mo bot" || normCmd === "mo lai bot" || normCmd === "mo tro ly" ||
                    normCmd === "kich hoat" || normCmd === "kich hoat bot" || normCmd === "start" || normCmd === "on" ||
                    normCmd === "resume" || normCmd === "online" || normCmd === "hoat dong" || normCmd === "hoat dong lai" ||
                    normCmd === "bat truc khach" || normCmd === "bat 24 7" || normCmd === "bat online" ||
                    normCmd.startsWith("bat bot") || normCmd.startsWith("bat tro ly") || normCmd.startsWith("mo bot") ||
                    ((normCmd.includes("bat bot") || normCmd.includes("bat truc khach") || normCmd.includes("bat len") || normCmd.includes("bat lai") || normCmd.includes("bat thuy linh")) && !normCmd.includes("tat"))
                );

                if (isTurnOnCmd) {
                    setBotStatus(true, "smart_customer_only");
                    console.log("\n🟢 [LỆNH TỪ CLOUD] ĐÃ BẬT TRỢ LÝ TRỰC CHIẾN 24/7 (TIẾP KHÁCH THÔNG MINH).");
                    const confirmMsg = `🟢 [ĐÃ BẬT TRỢ LÝ TRỰC CHIẾN 24/7]\n\nEm Thùy Linh đã sẵn sàng trực chiến 24/7!\n\n✨ Trạng thái hiện tại:\n• Tự động tư vấn khách hỏi dịch vụ: Web, App, Tool MMO, Video AI, Bot Zalo, Báo giá...\n• Tự động xin SĐT khách hàng và lưu trữ Online\n• Tự động bảo vệ bạn bè: Bạn bè chat riêng thì em im lặng để anh Hải tự chat\n\n💡 Lệnh nhanh trên Zalo:\n👉 Nhắn "#rieng": Chỉ phục vụ Sếp Hải (không trả lời người ngoài)\n👉 Nhắn "#tat": Tạm dừng trực khách (tự chat tay)\n👉 Nhắn "#trangthai": Kiểm tra tình trạng hoạt động`;
                    markSentReply(confirmMsg);
                    try {
                        await api.sendMessage({ msg: confirmMsg }, replyDest, ThreadType.User);
                    } catch (e) {}
                    return;
                }

                // 2.3. LỆNH TẮT BOT (TẠM DỪNG TỰ ĐỘNG TRẢ LỜI KHÁCH HÀNG)
                const isTurnOffCmd = (
                    rawCmd === "#tat" || rawCmd === "#tắt" || rawCmd === "#tatbot" || rawCmd === "#tắtbot" ||
                    rawCmd === "#off" || rawCmd === "#stop" || rawCmd === "#pause" ||
                    normCmd === "tat" || normCmd === "tat bot" || normCmd === "tat di" || normCmd === "tat bot di" ||
                    normCmd === "dung bot" || normCmd === "tam dung" || normCmd === "nghi ngoi" || normCmd === "tat truc khach" ||
                    normCmd === "stop" || normCmd === "pause" || normCmd === "off" ||
                    normCmd.startsWith("tat bot") || normCmd.startsWith("tam dung") ||
                    ((normCmd.includes("tat bot") || normCmd.includes("dung bot") || normCmd.includes("tat truc khach")) && !normCmd.includes("bat"))
                );

                if (isTurnOffCmd) {
                    setBotStatus(false);
                    console.log("\n🛑 [LỆNH TỪ CLOUD] ĐÃ TẮT TRỰC KHÁCH.");
                    const confirmMsg = `🛑 [ĐÃ TẮT TỰ ĐỘNG TRỰC KHÁCH]\n\nEm đã tạm dừng tự động trả lời người ngoài. Em vẫn luôn túc trực hỗ trợ anh Hải trong Cloud này nhé!\n\n👉 Bật lại chế độ tiếp khách thông minh 24/7: Nhắn "#khach" hoặc "#bat"`;
                    markSentReply(confirmMsg);
                    try {
                        await api.sendMessage({ msg: confirmMsg }, replyDest, ThreadType.User);
                    } catch (e) {}
                    return;
                }

                // 2.4. CHẾ ĐỘ TRỢ LÝ RIÊNG (CHỈ PHỤC VỤ ANH HẢI, KHÔNG TRẢ LỜI NGƯỜI NGOÀI)
                const isAssistantOnlyCmd = (
                    rawCmd === "#rieng" || rawCmd === "#riêng" || rawCmd === "#troly" || rawCmd === "#trợlý" ||
                    rawCmd === "#canhan" || rawCmd === "#cánhân" ||
                    normCmd === "rieng" || normCmd === "tro ly rieng" || normCmd === "che do rieng" ||
                    normCmd === "tro ly" || normCmd === "ca nhan" || normCmd === "chi phuc vu sep" || normCmd === "phuc vu rieng"
                );

                if (isAssistantOnlyCmd) {
                    setBotStatus(true, "assistant_only");
                    console.log("\n👑 [LỆNH TỪ CLOUD] ĐÃ CHUYỂN SANG CHẾ ĐỘ TRỢ LÝ RIÊNG CHO SẾP HẢI.");
                    const confirmMsg = `👑 [CHẾ ĐỘ TRỢ LÝ RIÊNG CỦA ANH HẢI]\n\nEm Thùy Linh đã chuyển sang chế độ phục vụ RIÊNG một mình anh Hải!\n\n✨ Từ bây giờ:\n• Em sẽ CHỈ lắng nghe và làm việc cho anh Hải trong Cloud này.\n• Em hoàn toàn KHÔNG tự tiện trả lời tin nhắn của bạn bè hay người ngoài trên Zalo.\n• Anh có thể giao việc, viết bài, viết code, hỏi đáp, tra cứu thoải mái nhé!\n\n👉 Khi muốn bật trực khách 24/7: Nhắn "#khach" (Lọc thông minh) hoặc "#bat"`;
                    markSentReply(confirmMsg);
                    try {
                        await api.sendMessage({ msg: confirmMsg }, replyDest, ThreadType.User);
                    } catch (e) {}
                    return;
                }

                // 2.5. CHẾ ĐỘ LỌC KHÁCH THÔNG MINH (CHỈ TIẾP KHÁCH HỎI DỊCH VỤ, BỎ QUA BẠN BÈ)
                const isSmartFilterCmd = (
                    rawCmd === "#khach" || rawCmd === "#khách" || rawCmd === "#locthongminh" || rawCmd === "#lọcthôngminh" ||
                    rawCmd === "#tudong" || rawCmd === "#tựđộng" ||
                    normCmd === "khach" || normCmd === "loc khach" || normCmd === "tiep khach" || normCmd === "truc khach" ||
                    normCmd === "loc thong minh" || normCmd === "tu dong"
                );

                if (isSmartFilterCmd) {
                    setBotStatus(true, "smart_customer_only");
                    console.log("\n🎯 [LỆNH TỪ CLOUD] ĐÃ KÍCH HOẠT CHẾ ĐỘ LỌC KHÁCH THÔNG MINH 24/7.");
                    const confirmMsg = `🎯 [CHẾ ĐỘ TIẾP KHÁCH THÔNG MINH 24/7]\n\nEm đã kích hoạt bộ lọc bảo vệ bạn bè cá nhân:\n• Em CHỈ tự động tư vấn khi có người hỏi về: Web, App, Tool MMO, Video AI, Bot Zalo, Báo giá, Dịch vụ...\n• Khi bạn bè nhắn tin tán gẫu, trò chuyện cá nhân: Em sẽ im lặng để anh Hải tự chat thoải mái!\n\n👉 Chuyển sang trợ lý riêng cho anh: Nhắn "#rieng"\n👉 Tắt trực khách hoàn toàn: Nhắn "#tat"`;
                    markSentReply(confirmMsg);
                    try {
                        await api.sendMessage({ msg: confirmMsg }, replyDest, ThreadType.User);
                    } catch (e) {}
                    return;
                }

                // 2.6. LỆNH XEM LEADS / SĐT KHÁCH
                const isLeadsCmd = (
                    rawCmd === "#leads" || rawCmd === "#lead" || rawCmd === "#khachhang" || rawCmd === "#kháchhàng" ||
                    normCmd === "leads" || normCmd === "lead" || normCmd === "danh sach khach" ||
                    normCmd === "xem lead" || normCmd === "xem khach" || normCmd === "sdt khach"
                );

                if (isLeadsCmd) {
                    await processAndReply(replyDest, message.data, "#leads", ThreadType.User, true);
                    return;
                }

                // 2.7. LỆNH KIỂM TRA TRẠNG THÁI
                const isStatusCmd = (
                    rawCmd === "#trangthai" || rawCmd === "#trạngthái" || rawCmd === "#status" ||
                    rawCmd === "#check" || rawCmd === "#kiemtra" || rawCmd === "#kiểmtra" ||
                    normCmd === "trang thai" || normCmd === "status" || normCmd === "kiem tra" ||
                    normCmd === "kiem tra bot" || normCmd === "tinh trang" || normCmd === "check"
                );

                if (isStatusCmd) {
                    const modeLabel = botMode === 'assistant_only' ? '👑 Trợ lý riêng (Chỉ phục vụ Sếp Hải)' : (botMode === 'smart_customer_only' ? '🎯 Lọc khách thông minh (Bảo vệ bạn bè)' : '🌐 Toàn diện 24/7');
                    const statusMsg = `📊 [TRẠNG THÁI TRỢ LÝ THÙY LINH]\n• Trợ lý riêng của: Anh Nguyễn Văn Hải (HaiTech AI)\n• Trực khách ngoài: ${isBotActive ? '🟢 ĐANG BẬT (24/7)' : '🛑 ĐANG TẮT (Tạm dừng)'}\n• Chế độ: ${modeLabel}\n• Động cơ AI: Gemini Flash Lite siêu tốc (~0.8s)\n\n💡 Cú pháp điều khiển trên Zalo:\n- "#bat": Bật trực khách 24/7\n- "#tat": Tắt trực khách (tự chat tay)\n- "#rieng": Chỉ phục vụ Sếp Hải, không đụng bạn bè\n- "#khach": Tự động tư vấn khách hỏi dịch vụ\n- "#leads": Xem danh sách SĐT khách hàng đã lưu`;
                    markSentReply(statusMsg);
                    try {
                        await api.sendMessage({ msg: statusMsg }, replyDest, ThreadType.User);
                    } catch (e) {}
                    return;
                }

                // 2.8. LÀM VIỆC / TRÒ CHUYỆN VỚI SẾP HẢI TRONG CLOUD CỦA TÔI HOẶC CÓ TIỀN TỐ TEST:
                if (isCloudOfMine || isTestPrefix) {
                    const cleanText = isTestPrefix ? userText.replace(/^(test:|#test|bot:)\s*/i, '') : userText;
                    await processAndReply(replyDest, message.data, cleanText, ThreadType.User, true);
                    return;
                }

                // Nếu bạn tự tay nhắn tin với người khác từ điện thoại, Bot sẽ không can thiệp
                return;
            }

            // 3. NẾU BOT ĐANG TẮT HOẶC Ở CHẾ ĐỘ TRỢ LÝ RIÊNG -> BỎ QUA TIN NHẮN 1-1 CỦA NGƯỜI NGOÀI:
            if (!isBotActive) {
                console.log(`⏸️ [BOT TẮT TRỰC KHÁCH] Khách (${message.threadId}) nhắn: "${userText}". Bỏ qua để bạn tự chat.`);
                return;
            }
            if (botMode === 'assistant_only') {
                console.log(`👑 [CHẾ ĐỘ TRỢ LÝ RIÊNG] Tin nhắn từ (${message.threadId}): "${userText}". Bot chỉ phục vụ riêng anh Hải nên bỏ qua.`);
                return;
            }

            // 4. ĐỐI VỚI TIN NHẮN 1-1 CÁ NHÂN: BỘ LỌC BẠN BÈ THÔNG MINH (SMART FILTER)
            if (botMode === 'smart_customer_only') {
                const isBiz = isBusinessInquiry(userText, knowledge);
                if (!isBiz) {
                    console.log(`🛡️ [BẢO VỆ BẠN BÈ] Tin nhắn cá nhân thông thường (Thread ID: ${message.threadId}): "${userText}". Bot không xen vào.`);
                    return;
                }
            }

            // 5. Gộp tin nhắn 1-1 nếu khách gửi nhiều câu ngắn liên tiếp trong 350ms
            const threadId = message.threadId;
            const threadType = message.type;
            if (!pendingMessageBuffers.has(threadId)) {
                pendingMessageBuffers.set(threadId, {
                    texts: [],
                    timer: null,
                    lastData: message.data,
                    threadType
                });
            }

            const buffer = pendingMessageBuffers.get(threadId);
            buffer.texts.push(userText);
            buffer.lastData = message.data;

            if (buffer.timer) {
                clearTimeout(buffer.timer);
            }

            buffer.timer = setTimeout(async () => {
                const combinedText = buffer.texts.join('\n');
                const targetData = buffer.lastData;
                const targetType = buffer.threadType || ThreadType.User;
                pendingMessageBuffers.delete(threadId);
                await processAndReply(threadId, targetData, combinedText, targetType, false, false);
            }, 350);
        } catch (e) {
            console.error("⚠️ Lỗi khi nhận diện tin nhắn:", e.message);
        }
    });

    // Lắng nghe sự kiện socket để tự động phục hồi và chống crash
    api.listener.on("error", (err) => {
        console.warn("⚠️ [Zalo Socket Cảnh báo]:", err?.message || err);
    });

    api.listener.on("closed", (code, reason) => {
        console.log(`🔌 [Zalo Socket]: Mất kết nối tạm thời (${code}: ${reason || 'timeout'}). Đang tự động kết nối lại...`);
    });

    // Gửi thông báo kết nối thành công vào "Cloud của tôi" trên điện thoại
    try {
        const ctx = api.getContext ? api.getContext() : null;
        const send2meId = ctx?.loginInfo?.send2me_id ? String(ctx.loginInfo.send2me_id) : null;
        if (send2meId) {
            const welcomeNotify = `🌸 [EM THÙY LINH — TRỢ LÝ RIÊNG CỦA ANH HẢI]\n\n✅ Em đã kết nối Zalo thành công và sẵn sàng phục vụ anh!\n⚡ Tốc độ phản hồi: Siêu tốc ~0.8s (Google Gemini Flash Lite)\n\n📱 LỆNH ĐIỀU KHIỂN NHANH:\n• "#rieng": Chế độ Trợ lý Riêng (Chỉ phục vụ anh Hải, KHÔNG đụng bạn bè)\n• "#khach": Lọc khách thông minh (Tự động tư vấn khách hỏi dịch vụ, bỏ qua bạn bè)\n• "#leads": Xem danh sách SĐT khách hàng đã lưu\n• "#tat": Tạm dừng trực khách (tự chat tay)\n• "#bat": Bật lại trực khách\n\n👉 Anh Hải có thể giao việc, nhờ em viết bài, soạn video TikTok, viết code hoặc tra cứu ngay tại đây nhé! 😊`;
            markSentReply(welcomeNotify);
            await api.sendMessage({ msg: welcomeNotify }, send2meId, ThreadType.User);
            console.log("📲 Đã gửi thông báo sẵn sàng vào 'Cloud của tôi' trên Zalo!");
        }
    } catch (e) {
        console.warn("⚠️ Chưa gửi được lời chào vào Cloud:", e.message);
    }

    // Khởi động lắng nghe với cơ chế tự động kết nối lại
    api.listener.start({ retryOnClose: true });

    // Giám sát kết nối định kỳ (Watchdog) mỗi 60 giây để đảm bảo 24/7
    setInterval(() => {
        try {
            const now = new Date();
            if (now.getMinutes() === 0 || now.getMinutes() === 30) {
                const modeText = botMode === 'assistant_only' ? '👑 Trợ lý riêng' : (botMode === 'smart_customer_only' ? '🎯 Lọc khách thông minh' : '🌐 Toàn diện');
                console.log(`💓 [Heartbeat 24/7 - ${now.toLocaleTimeString("vi-VN")}]: Trợ lý Thùy Linh đang trực chiến ổn định. Trạng thái: ${isBotActive ? '🟢 ĐANG BẬT' : '🛑 ĐANG TẮT'} | Chế độ: ${modeText}`);
            }
        } catch (e) {}
    }, 60000);
}

// Khởi tạo HTTP Keep-Alive Server khi chạy trên Cloud (Render, Koyeb, Railway, Docker, VPS)
const CLOUD_PORT = process.env.PORT || process.env.WEB_PORT;
if (CLOUD_PORT) {
    import('http').then(({ default: http }) => {
        const srv = http.createServer((req, res) => {
            const u = req.url.split('?')[0];
            if (u === '/health' || u === '/') {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({
                    status: 'online',
                    bot: 'Em Thuy Linh — HaiTech AI',
                    mode: botMode,
                    active: isBotActive,
                    uptimeSeconds: Math.floor(process.uptime()),
                    timestamp: new Date().toISOString()
                }));
            } else if (u === '/qr') {
                if (fs.existsSync(QR_HTML_FILE)) {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    fs.createReadStream(QR_HTML_FILE).pipe(res);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end('<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;background:#0b132b;color:#fff;"><h1>✅ Bot da dang nhap thanh cong tren Cloud!</h1><p>Khong can quet lai ma QR.</p></body></html>');
                }
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }
        });
        const bindPort = Number(CLOUD_PORT) || 3000;
        srv.listen(bindPort, '0.0.0.0', () => {
            console.log(`🌐 [Cloud Keep-Alive]: HTTP Server đang lắng nghe trên 0.0.0.0:${bindPort}`);
        });
    }).catch(e => console.warn("Lỗi khởi động Cloud HTTP:", e.message));
}

startBot().catch((err) => {
    console.error("❌ Lỗi khởi động startBot:", err?.message || err);
    console.log("🔄 Đang thử khởi động lại sau 5 giây...");
    setTimeout(() => {
        startBot().catch(() => {});
    }, 5000);
});

