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
        let allLeads = [...memoryLeads];
        try {
            const fs = await import('node:fs');
            const path = await import('node:path');
            const leadsFile = path.resolve('leads.json');
            if (fs.existsSync(leadsFile)) {
                const fileLeads = JSON.parse(fs.readFileSync(leadsFile, 'utf8') || '[]');
                if (Array.isArray(fileLeads)) {
                    // Trộn và loại bỏ trùng lặp theo ID hoặc SĐT
                    const seen = new Set();
                    const combined = [...fileLeads, ...allLeads].filter(item => {
                        const key = item.id || (item.phone + '_' + item.createdAt);
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });
                    allLeads = combined;
                }
            }
        } catch (_) {}

        return res.status(200).json({
            status: 'success',
            total: allLeads.length,
            leads: allLeads,
            serverTime: new Date().toISOString()
        });
    }

    // 2. POST: Lưu thông tin khách hàng mới
    if (req.method === 'POST') {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
            const customerName = body.customerName || body.name || 'Khách Đăng Ký';
            const phone = body.phone || body.phoneInput || '';
            const email = body.email || '';
            const shopName = body.shopName || body.shop || 'Cửa hàng';
            const industry = body.industry || body.category || 'Bán lẻ';
            const message = body.message || `Đăng ký trải nghiệm 7 ngày (${industry})`;
            const trialKey = body.trialKey || ('HAI-TRIAL-' + Math.random().toString(36).substring(2, 7).toUpperCase());
            const threadId = body.threadId || '';

            if (!phone && !message && !email) {
                return res.status(400).json({ status: 'error', message: 'Thiếu thông tin phone hoặc email' });
            }

            const now = new Date();
            const exp = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

            const newLead = {
                id: 'lead_' + Date.now(),
                name: customerName,
                customerName: customerName,
                phone: phone,
                email: email,
                shop: shopName,
                shopName: shopName,
                industry: industry,
                category: industry,
                message: message,
                trialKey: trialKey,
                threadId: threadId,
                status: 'active',
                referredBy: body.referredBy || 'Trực tiếp',
                createdAt: now.toISOString(),
                expiresAt: exp.toISOString(),
                timeStr: now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
                time: now.toLocaleTimeString('vi-VN') + ' ' + now.toLocaleDateString('vi-VN')
            };

            memoryLeads.unshift(newLead);
            if (memoryLeads.length > 500) memoryLeads = memoryLeads.slice(0, 500);

            // Lưu vào leads.json nếu có môi trường Node FS cục bộ
            try {
                const fs = await import('node:fs');
                const path = await import('node:path');
                const leadsFile = path.resolve('leads.json');
                let curLeads = [];
                if (fs.existsSync(leadsFile)) {
                    curLeads = JSON.parse(fs.readFileSync(leadsFile, 'utf8') || '[]');
                }
                curLeads.unshift(newLead);
                fs.writeFileSync(leadsFile, JSON.stringify(curLeads.slice(0, 500), null, 2), 'utf8');
            } catch (_) {}

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
