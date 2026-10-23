import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import websiteChatHandler from './api/website-chat.js';
import syncLeadsHandler from './api/sync-leads.js';
import { getKnowledgeBase } from './api/knowledge-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8'
};

function parseBody(req) {
    return new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
            try {
                resolve(data ? JSON.parse(data) : {});
            } catch (e) {
                resolve(data);
            }
        });
    });
}

function adaptResponse(res) {
    res.status = function(code) {
        this.statusCode = code;
        return this;
    };
    res.json = function(obj) {
        this.setHeader('Content-Type', 'application/json; charset=utf-8');
        this.end(JSON.stringify(obj));
        return this;
    };
    return res;
}

const server = http.createServer(async (req, res) => {
    let reqUrl = req.url.split('?')[0];

    // Helper CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 1. API: /api/bot-status (Đọc & cập nhật trạng thái / chế độ Bot)
    if (reqUrl === '/api/bot-status') {
        const statusFile = path.join(__dirname, 'bot-status.json');
        if (req.method === 'POST') {
            const body = await parseBody(req);
            const current = fs.existsSync(statusFile) ? JSON.parse(fs.readFileSync(statusFile, 'utf8')) : {};
            const updated = {
                active: typeof body.active === 'boolean' ? body.active : (current.active ?? true),
                mode: body.mode || current.mode || 'smart_customer_only',
                updatedAt: new Date().toISOString()
            };
            fs.writeFileSync(statusFile, JSON.stringify(updated, null, 2), 'utf8');
            return adaptResponse(res).status(200).json({ success: true, status: updated });
        } else {
            let data = { active: true, mode: 'smart_customer_only' };
            if (fs.existsSync(statusFile)) {
                try { data = JSON.parse(fs.readFileSync(statusFile, 'utf8')); } catch(e) {}
            }
            return adaptResponse(res).status(200).json({ success: true, status: data });
        }
    }

    // 2. API: /api/leads (Đọc danh sách leads lưu cục bộ từ Zalo)
    if (reqUrl === '/api/leads') {
        const leadsFile = path.join(__dirname, 'leads.json');
        let leads = [];
        if (fs.existsSync(leadsFile)) {
            try { leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8')); } catch(e) {}
        }
        return adaptResponse(res).status(200).json({ success: true, total: leads.length, leads });
    }

    // 3. API: /api/knowledge (Lấy & lưu dữ liệu tri thức)
    if (reqUrl === '/api/knowledge') {
        if (req.method === 'POST') {
            const body = await parseBody(req);
            const knowledgeFile = path.join(__dirname, 'knowledge.json');
            let current = {};
            try { current = JSON.parse(fs.readFileSync(knowledgeFile, 'utf8')); } catch(e) {}
            const merged = { ...current, ...body };
            fs.writeFileSync(knowledgeFile, JSON.stringify(merged, null, 2), 'utf8');
            return adaptResponse(res).status(200).json({ success: true, message: 'Đã lưu cấu hình tri thức & nhóm thành công!', knowledge: merged });
        }
        const kb = getKnowledgeBase();
        return adaptResponse(res).status(200).json({ success: true, knowledge: kb });
    }

    // 4. API: /api/website-chat
    if (reqUrl === '/api/website-chat') {
        req.body = await parseBody(req);
        return websiteChatHandler(req, adaptResponse(res));
    }

    // 5. API: /api/sync-leads
    if (reqUrl === '/api/sync-leads') {
        req.body = await parseBody(req);
        return syncLeadsHandler(req, adaptResponse(res));
    }

    // 6. API: /api/qr-status (Kiểm tra trạng thái quét mã QR kết nối Zalo)
    if (reqUrl === '/api/qr-status') {
        const sessionFile = path.join(__dirname, 'session.json');
        const qrPngFile = path.join(__dirname, 'qr.png');
        const statusFile = path.join(__dirname, 'bot-status.json');
        
        let isConnected = false;
        let sessionInfo = null;
        if (fs.existsSync(sessionFile)) {
            try {
                const raw = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
                if (raw && (raw.cookies || raw.imei || raw.userAgent)) {
                    isConnected = true;
                    sessionInfo = {
                        hasSession: true,
                        updatedAt: fs.statSync(sessionFile).mtime.toISOString()
                    };
                }
            } catch (e) {}
        }

        const hasQrPng = fs.existsSync(qrPngFile);
        let qrMtime = hasQrPng ? fs.statSync(qrPngFile).mtime.toISOString() : null;

        let botStatus = { active: true, mode: 'smart_customer_only' };
        if (fs.existsSync(statusFile)) {
            try { botStatus = JSON.parse(fs.readFileSync(statusFile, 'utf8')); } catch (e) {}
        }

        return adaptResponse(res).status(200).json({
            success: true,
            status: isConnected ? 'connected' : (hasQrPng ? 'waiting_scan' : 'not_started'),
            isConnected,
            hasQrPng,
            qrMtime,
            botStatus,
            message: isConnected 
                ? '✅ Bot đã kết nối Zalo thành công và đang trực 24/7!' 
                : (hasQrPng ? '📱 Đang chờ quét mã QR bằng ứng dụng Zalo trên điện thoại...' : '⏳ Bot đang chuẩn bị mã QR đăng nhập...')
        });
    }

    // Static files & Route mapping
    if (reqUrl === '/' || reqUrl === '') reqUrl = '/tro-ly-rieng.html';
    if (reqUrl === '/qr') reqUrl = '/qr.html';

    const filePath = path.join(__dirname, decodeURIComponent(reqUrl));

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>404 Not Found</h1><p><a href="/tro-ly-rieng.html">Mở Trợ lý Thùy Linh</a></p>');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        });

        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`🌐 HAITECH BOT Server đang chạy tại:`);
    console.log(`   👉 Trợ lý riêng: http://localhost:${PORT}/tro-ly-rieng.html`);
    console.log(`   👉 Dashboard:    http://localhost:${PORT}/dashboard.html`);
    console.log(`   👉 Trang chủ:    http://localhost:${PORT}/index.html`);
});
