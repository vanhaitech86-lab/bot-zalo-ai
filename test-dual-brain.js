// =============================================================================
// HAITECH BOT - CÔNG CỤ TEST THỬ NGHIỆM BỘ NÃO THỨ 2 (GOOGLE GEMINI / MULTI-AI)
// =============================================================================

import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import { generateReplyAsync, callGoogleGemini } from './api/knowledge-engine.js';

const KNOWLEDGE_FILE = './knowledge.json';

let knowledge = {};
try {
    if (fs.existsSync(KNOWLEDGE_FILE)) {
        knowledge = JSON.parse(fs.readFileSync(KNOWLEDGE_FILE, 'utf8'));
    }
} catch (e) {
    knowledge = {};
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
    console.log('\n=================================================================');
    console.log('🧠 CÔNG CỤ KIỂM TRA & TEST THỬ NGHIỆM BỘ NÃO THỨ 2 (GOOGLE GEMINI)');
    console.log('   HAITECH BOT STUDIO - HỆ THỐNG TRÍ TUỆ NHÂN TẠO ĐA NỀN TẢNG');
    console.log('=================================================================\n');

    let currentKey = (knowledge?.aiConfig?.apiKey || process.env.GEMINI_API_KEY || '').trim();

    if (!currentKey) {
        console.log('⚠️ Hiện tại chưa có Google Gemini API Key trong knowledge.json.');
        console.log('👉 Google cấp MIỄN PHÍ 100% (1.500 tin nhắn/ngày, không cần thẻ visa):');
        console.log('   🔗 Link lấy key trong 30 giây: https://aistudio.google.com/app/apikey\n');

        const inputKey = await ask('🔑 Nhập hoặc dán Google Gemini API Key của bạn vào đây (bắt đầu bằng AIzaSy...): ');
        if (!inputKey.trim()) {
            console.log('\n⚠️ Bạn chưa nhập API Key. Hệ thống sẽ test chế độ BỘ NÃO 1 (Tri thức bảng giá cơ bản).');
        } else {
            currentKey = inputKey.trim();
            // Lưu vào knowledge.json nếu người dùng đồng ý
            knowledge.aiConfig = knowledge.aiConfig || {};
            knowledge.aiConfig.enabled = true;
            knowledge.aiConfig.provider = 'gemini';
            knowledge.aiConfig.model = 'gemini-2.5-flash';
            knowledge.aiConfig.apiKey = currentKey;

            knowledge.gptConfig = knowledge.gptConfig || {};
            knowledge.gptConfig.enabled = true;
            knowledge.gptConfig.provider = 'gemini';
            knowledge.gptConfig.model = 'gemini-2.5-flash';
            knowledge.gptConfig.apiKey = currentKey;

            try {
                fs.writeFileSync(KNOWLEDGE_FILE, JSON.stringify(knowledge, null, 2), 'utf8');
                console.log('💾 Đã lưu Google Gemini API Key vào knowledge.json thành công!\n');
            } catch (err) {
                console.warn('⚠️ Không thể ghi file knowledge.json:', err.message);
            }
        }
    } else {
        const masked = currentKey.substring(0, 8) + '...' + currentKey.substring(currentKey.length - 4);
        console.log(`✅ Đã tìm thấy Google Gemini API Key sẵn có: ${masked}`);
        console.log(`🤖 Mô hình đang dùng: ${knowledge?.aiConfig?.model || 'gemini-2.5-flash'}\n`);
    }

    // Kiểm tra kết nối thử nghiệm mẫu
    if (currentKey) {
        console.log('⏳ Đang gửi thử 1 câu hỏi kiểm tra kết nối tới Google Gemini...');
        const t0 = Date.now();
        try {
            const testResult = await generateReplyAsync('Chào em, cho anh hỏi bên mình có những dịch vụ và sản phẩm gì?', knowledge);
            const latency = Date.now() - t0;
            console.log(`\n🎉 KẾT NỐI BỘ NÃO THỨ 2 THÀNH CÔNG RỰC RỠ! (Độ trễ: ${latency}ms)`);
            console.log(`📌 Nguồn xử lý: [${testResult.model}]`);
            console.log(`💬 Câu trả lời mẫu:\n"${testResult.reply}"\n`);
        } catch (err) {
            console.error(`\n❌ Lỗi kết nối Google Gemini: ${err.message}`);
            console.log('💡 Gợi ý: Hãy kiểm tra xem API Key có đúng không hoặc lấy key mới tại aistudio.google.com.\n');
        }
    }

    console.log('=================================================================');
    console.log('💬 BẮT ĐẦU CHAT TEST THỬ NGHIỆM BỘ NÃO AI TRỰC TIẾP');
    console.log('   (Gõ bất kỳ câu hỏi nào bạn muốn hỏi khách hàng, gõ "exit" để thoát)');
    console.log('=================================================================\n');

    while (true) {
        const query = await ask('👤 Bạn hỏi: ');
        if (!query.trim()) continue;
        if (query.trim().toLowerCase() === 'exit' || query.trim().toLowerCase() === 'quit') {
            console.log('👋 Tạm biệt!');
            break;
        }

        const tStart = Date.now();
        try {
            const res = await generateReplyAsync(query, knowledge);
            const duration = Date.now() - tStart;
            console.log(`\n🤖 [${res.model}] (${duration}ms):`);
            console.log(`"${res.reply}"\n`);
        } catch (e) {
            console.error(`⚠️ Lỗi: ${e.message}\n`);
        }
    }

    rl.close();
}

main();
