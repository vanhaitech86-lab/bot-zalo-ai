// =============================================================================
// HAITECH BOT - CÔNG CỤ TỰ ĐỘNG KHỞI TẠO BOT RIÊNG BIỆT CHO TỪNG KHÁCH HÀNG
// Tác giả: HAITECH BOT (Hotline/Zalo: 0988 739 896 - Email: vanhaitech.86@gmail.com)
// =============================================================================

import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question, defaultVal = '') {
    return new Promise((resolve) => {
        const prompt = defaultVal ? `${question} [Mặc định: ${defaultVal}]: ` : `${question}: `;
        rl.question(prompt, (answer) => {
            resolve(answer.trim() || defaultVal);
        });
    });
}

function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .toUpperCase();
}

async function main() {
    console.log('\n=====================================================================');
    console.log('🚀 HAITECH BOT STUDIO - CÔNG CỤ TẠO BOT RIÊNG CHO TỪNG KHÁCH HÀNG');
    console.log('   Khởi tạo tự động - Mỗi khách hàng 1 thư mục độc lập 100%');
    console.log('=====================================================================\n');

    const zipFile = path.join(__dirname, 'HAITECH_BOT_COMMERCIAL_v1.0.zip');
    if (!fs.existsSync(zipFile)) {
        console.error('❌ Không tìm thấy file "HAITECH_BOT_COMMERCIAL_v1.0.zip"!');
        console.log('💡 Đang chạy đóng gói tự động...');
        try {
            execSync('powershell -NoProfile -Command "Compress-Archive -Path \'CAI_DAT_LAN_DAU.bat\', \'BAT_THUY_LINH.bat\', \'TAT_THUY_LINH.bat\', \'KET_NOI_ZALO_THUY_LINH.bat\', \'CHAY_BOT_ZALO.bat\', \'NGAT_KET_NOI_BOT.bat\', \'TEST_BO_NAO_THU_2.bat\', \'AVATAR_THUY_LINH.jpg\', \'kol-thuy-linh.jpg\', \'haitech-kol-ai.jpg\', \'bot-avatar.png\', \'robot-assistant.png\', \'HUONG_DAN_NHANH_3_BUOC.txt\', \'DANH_SACH_LINK_VA_THONG_TIN_DAU_NOI.txt\', \'.env\', \'bot-zalo-personal.js\', \'knowledge.json\', \'package.json\', \'vercel.json\', \'MO_TRANG_WEB.bat\', \'server.js\', \'dashboard.html\', \'index.html\', \'login.html\', \'style.css\', \'haitech-chat-widget.js\', \'README.md\', \'SO_TAY_HUONG_DAN_CAI_DAT_VA_SU_DUNG.md\', \'HUONG_DAN_DONG_GOI_THUONG_MAI.md\', \'CHUNG_NHAN_BAN_QUYEN_VA_HOP_DONG_MAU.md\', \'TAI_LIEU_HUONG_DAN_KHACH_HANG_TOAN_DIEN.md\', \'HUONG_DAN_KHACH_HANG.html\', \'api\' -DestinationPath \'HAITECH_BOT_COMMERCIAL_v1.0.zip\' -Force"', { cwd: __dirname });
            console.log('✅ Đã tạo file zip thành công!\n');
        } catch(e) {
            console.error('❌ Không thể tạo file zip:', e.message);
            rl.close();
            return;
        }
    }

    // 1. Nhập thông tin khách hàng
    const rawShopName = await ask('1️⃣ Tên Shop / Tên Doanh nghiệp của khách (Ví dụ: Shop Hoa Mai Anh, Salon Tóc Ken)', 'Shop Khách Hàng A');
    const folderCode = removeAccents(rawShopName) || 'KHACH_HANG_A';
    
    const defaultTargetDir = path.join(path.dirname(__dirname), `BOT_${folderCode}`);
    const customDir = await ask(`2️⃣ Đường dẫn thư mục tạo Bot`, defaultTargetDir);
    const targetDir = path.resolve(customDir);

    const clientPhone = await ask('3️⃣ Số điện thoại Hotline / Zalo của khách', '0988 739 896');
    const assistantName = await ask('4️⃣ Tên Trợ lý AI đại diện cho Shop', `Em Thùy Linh - Trợ lý ${rawShopName}`);

    console.log('\n5️⃣ Chọn ngành hàng kinh doanh của khách:');
    console.log('   [1] Bán lẻ / Thời trang / Mỹ phẩm / Phụ kiện');
    console.log('   [2] Dịch vụ / Spa / Nha khoa / Thẩm mỹ');
    console.log('   [3] Bất động sản / Dự án / Xây dựng');
    console.log('   [4] Nhà hàng / Cafe / Ăn uống');
    console.log('   [5] Chung / Khác');
    const industryChoice = await ask('👉 Chọn số (1-5)', '1');

    const onlineWebhook = await ask('6️⃣ Link Webhook lưu trữ Online (Google Sheets / Cloud API, bấm Enter nếu để trống)', '');

    console.log('\n---------------------------------------------------------------------');
    console.log(`📁 Thư mục sẽ tạo: "${targetDir}"`);
    console.log(`🏪 Tên Shop:       "${rawShopName}"`);
    console.log(`📞 Hotline:        "${clientPhone}"`);
    console.log(`🤖 Trợ lý:         "${assistantName}"`);
    if (onlineWebhook) console.log(`☁️ Webhook Online: "${onlineWebhook}"`);
    console.log('---------------------------------------------------------------------\n');

    const confirm = await ask('❓ Bạn có chắc chắn muốn khởi tạo? (y/n)', 'y');
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
        console.log('❌ Đã hủy thao tác.');
        rl.close();
        return;
    }

    console.log('\n⏳ [1/4] Đang tạo thư mục và giải nén bộ cài sạch...');
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    try {
        const psCmd = `powershell -NoProfile -Command "Expand-Archive -Path '${zipFile}' -DestinationPath '${targetDir}' -Force"`;
        execSync(psCmd);
        console.log('✅ Đã giải nén xong mã nguồn sạch vào thư mục!');
    } catch(err) {
        console.error('❌ Lỗi khi giải nén:', err.message);
        rl.close();
        return;
    }

    console.log('⏳ [2/4] Đang tùy biến dữ liệu tri thức knowledge.json...');
    const targetKnowledgePath = path.join(targetDir, 'knowledge.json');
    let targetKnowledge = {};
    if (fs.existsSync(targetKnowledgePath)) {
        try { targetKnowledge = JSON.parse(fs.readFileSync(targetKnowledgePath, 'utf8')); } catch(e) {}
    }

    targetKnowledge.botName = assistantName;
    targetKnowledge.brandName = rawShopName;
    targetKnowledge.phone = clientPhone;
    targetKnowledge.welcomeMessage = `Dạ em chào anh/chị ạ! Em là ${assistantName}. Em có thể hỗ trợ tư vấn sản phẩm hoặc báo giá gì cho anh/chị hôm nay ạ? 😊`;
    targetKnowledge.defaultContact = `Dạ anh/chị có thể liên hệ hotline/Zalo của bên em: ${clientPhone} để được hỗ trợ nhanh nhất ạ!`;
    if (onlineWebhook) {
        targetKnowledge.onlineStorageUrl = onlineWebhook;
        targetKnowledge.onlineWebhookUrl = onlineWebhook;
    }

    // Tùy biến kịch bản mẫu theo ngành hàng
    let sampleRules = [];
    if (industryChoice === '1') {
        sampleRules = [
            {
                keywords: ["giá", "báo giá", "nhiêu tiền", "bao nhiêu", "chi phí"],
                reply: `Dạ bên em đang có ưu đãi đặc biệt hôm nay ạ! 🎁 Anh/chị cho em xin số điện thoại hoặc mã sản phẩm quan tâm để em gửi bảng giá chi tiết kèm ưu đãi ngay nhé ạ! Hotline: ${clientPhone}`
            },
            {
                keywords: ["size", "bảng size", "đổi trả", "ship", "giao hàng"],
                reply: `Dạ ${rawShopName} hỗ trợ giao hàng hỏa tốc toàn quốc, quý khách được kiểm tra hàng trước khi thanh toán và đổi size miễn phí trong 7 ngày ạ! Anh/chị cho em xin chiều cao và cân nặng để em chọn size chuẩn nhất nhé ạ! 😊`
            },
            {
                keywords: ["tài khoản", "stk", "chuyển khoản", "thanh toán"],
                reply: `Dạ bên em hỗ trợ thanh toán khi nhận hàng (COD) hoặc chuyển khoản ngân hàng. Quý khách để lại số điện thoại em gửi thông tin chi tiết nhé ạ! 💳`
            }
        ];
    } else if (industryChoice === '2') {
        sampleRules = [
            {
                keywords: ["giá", "báo giá", "chi phí", "bao nhiêu"],
                reply: `Dạ chi phí dịch vụ bên em được niêm yết rõ ràng và cam kết hiệu quả 100%. Anh/chị để lại số điện thoại để chuyên viên gọi điện tư vấn phác đồ và báo giá ưu đãi nhất nhé ạ! 📞 Hotline: ${clientPhone}`
            },
            {
                keywords: ["đặt lịch", "hẹn", "booking", "lịch hẹn"],
                reply: `Dạ anh/chị muốn đặt lịch vào khung giờ nào hoặc ngày nào ạ? Vui lòng để lại số điện thoại em xác nhận lịch khám/chăm sóc ngay nhé ạ! ✨`
            }
        ];
    } else if (industryChoice === '3') {
        sampleRules = [
            {
                keywords: ["giá", "báo giá", "mặt bằng", "chiết khấu", "chính sách"],
                reply: `Dạ dự án hiện đang có chính sách ưu đãi chiết khấu trực tiếp và hỗ trợ lãi suất 0%. Anh/chị cho em xin số điện thoại để em gửi trọn bộ tài liệu, bảng giá và chính sách qua Zalo nhé ạ! 📋 Hotline: ${clientPhone}`
            }
        ];
    }

    if (sampleRules.length > 0) {
        targetKnowledge.rules = sampleRules;
    }

    fs.writeFileSync(targetKnowledgePath, JSON.stringify(targetKnowledge, null, 2), 'utf8');
    console.log('✅ Đã cấu hình knowledge.json hoàn tất!');

    console.log('⏳ [3/4] Cập nhật danh sách khách hàng quản lý trung tâm...');
    const masterDbPath = path.join(__dirname, 'danh_sach_khach_hang_thue_bot.json');
    let masterList = [];
    if (fs.existsSync(masterDbPath)) {
        try { masterList = JSON.parse(fs.readFileSync(masterDbPath, 'utf8')); } catch(e) {}
    }

    const clientRecord = {
        id: 'client_' + Date.now(),
        shopName: rawShopName,
        phone: clientPhone,
        assistantName: assistantName,
        folderPath: targetDir,
        createdAt: new Date().toISOString(),
        status: 'Chờ quét QR',
        onlineWebhook: onlineWebhook || ''
    };
    masterList.unshift(clientRecord);
    fs.writeFileSync(masterDbPath, JSON.stringify(masterList, null, 2), 'utf8');
    console.log('✅ Đã lưu khách hàng vào danh_sach_khach_hang_thue_bot.json!');

    console.log('\n=====================================================================');
    console.log('🎉 KHỞI TẠO BOT CHO KHÁCH HÀNG THÀNH CÔNG 100%!');
    console.log('=====================================================================');
    console.log(`📁 Thư mục bot của khách: ${targetDir}`);
    console.log('👉 Bây giờ bạn có thể:');
    console.log(`   1. Chạy file: "${path.join(targetDir, 'KET_NOI_ZALO_THUY_LINH.bat')}" để tạo mã QR gửi cho khách.`);
    console.log(`   2. Khách dùng Zalo điện thoại quét mã QR -> Bấm Cho phép đăng nhập.`);
    console.log('   3. Bot sẽ tự động trực 24/7 trên Zalo của khách và lưu khách hàng online!\n');

    const openQRNow = await ask('❓ Bạn có muốn MỞ MÃ QR CHO KHÁCH HÀNG NÀY NGAY BÂY GIỜ không? (y/n)', 'y');
    if (openQRNow.toLowerCase() === 'y' || openQRNow.toLowerCase() === 'yes') {
        console.log('\n🚀 Đang khởi động tiến trình tạo mã QR...');
        const batToRun = path.join(targetDir, 'KET_NOI_ZALO_THUY_LINH.bat');
        execSync(`cmd /c start "" "${batToRun}"`, { cwd: targetDir });
        console.log('🖼️ Trình duyệt hoặc cửa sổ kết nối đang mở mã QR. Hãy chụp ảnh gửi cho khách quét!');
    }

    console.log('\n✨ Chúc bạn kinh doanh và cho thuê Bot hồng phát!');
    rl.close();
}

main().catch(err => {
    console.error('Lỗi ngoài ý muốn:', err);
    rl.close();
});
