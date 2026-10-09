// =============================================================================
// HAITECH BOT - ONLINE LEADS & CUSTOMER STORAGE API (VERCEL CLOUD)
// Lưu trữ & Đồng bộ dữ liệu khách hàng Online 24/7
// =============================================================================

// Bộ nhớ đệm bộ nhớ cho Vercel Serverless
let memoryLeads = [];

export default async function handler(req, res) {
    // Cho phép gọi CORS từ mọi nơi
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 1. GET: Lấy danh sách khách hàng / Leads đã lưu
    if (req.method === 'GET') {
        return res.status(200).json({
            status: 'success',
            total: memoryLeads.length,
            leads: memoryLeads,
            serverTime: new Date().toISOString()
        });
    }

    // 2. POST: Lưu thông tin khách hàng mới
    if (req.method === 'POST') {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
            const { customerName, phone, message, shopName, threadId } = body;

            if (!phone && !message) {
                return res.status(400).json({ status: 'error', message: 'Thiếu thông tin phone hoặc message' });
            }

            const newLead = {
                id: 'lead_' + Date.now(),
                customerName: customerName || 'Khách Zalo',
                phone: phone || '',
                message: message || '',
                shopName: shopName || 'HAITECH BOT',
                threadId: threadId || '',
                createdAt: new Date().toISOString(),
                timeStr: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
            };

            memoryLeads.unshift(newLead);
            if (memoryLeads.length > 500) memoryLeads = memoryLeads.slice(0, 500);

            // Chuyển tiếp tới Google Sheets Webhook nếu được cấu hình
            const googleSheetWebhook = process.env.GOOGLE_SHEETS_WEBHOOK;
            if (googleSheetWebhook && googleSheetWebhook.startsWith('http')) {
                try {
                    await fetch(googleSheetWebhook, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newLead)
                    });
                } catch(sheetErr) {
                    console.warn('Lỗi chuyển tiếp tới Google Sheets:', sheetErr.message);
                }
            }

            return res.status(200).json({
                status: 'success',
                message: 'Đã lưu trữ dữ liệu khách hàng online thành công!',
                data: newLead
            });
        } catch (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
    }

    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
}
