/**
 * HAITECH BOT - LIVECHAT AI WIDGET CHO WEBSITE
 * Nhúng vào bất kỳ website nào chỉ với 1 dòng mã script:
 * <script src="https://bot-zalo-ai.vercel.app/haitech-chat-widget.js" async></script>
 * Hotline hỗ trợ: 0988 739 896 - Email: vanhaitech.86@gmail.com
 */

(function () {
    // Tránh khởi tạo 2 lần nếu script bị nạp lặp
    if (window.HaitechChatWidgetLoaded) return;
    window.HaitechChatWidgetLoaded = true;

    // 1. Cấu hình mặc định & đọc thuộc tính từ thẻ script
    const currentScript = document.currentScript || document.querySelector('script[src*="haitech-chat-widget"]');
    const config = {
        apiUrl: currentScript?.getAttribute('data-api-url') || 'https://bot-zalo-ai.vercel.app/api/website-chat',
        botName: currentScript?.getAttribute('data-bot-name') || 'Em Thùy Linh - Trợ lý HAITECH BOT',
        phone: currentScript?.getAttribute('data-phone') || '0988 739 896',
        zaloUrl: currentScript?.getAttribute('data-zalo-url') || 'https://zalo.me/0988739896',
        primaryColor: currentScript?.getAttribute('data-color') || '#0077B6',
        position: currentScript?.getAttribute('data-position') || 'right', // 'right' | 'left'
        greeting: currentScript?.getAttribute('data-greeting') || 'Dạ em chào anh/chị ạ! Em là Thùy Linh - Trợ lý AI của HAITECH BOT. Anh/chị cần em tư vấn sản phẩm hay gửi bảng giá hôm nay ạ? 😊'
    };

    const cleanPhone = config.phone.replace(/[^0-9]/g, '');

    // 2. Chèn Scoped CSS
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        #haitech-widget-container {
            position: fixed;
            bottom: 24px;
            ${config.position === 'left' ? 'left: 24px;' : 'right: 24px;'}
            z-index: 9999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            box-sizing: border-box;
        }
        #haitech-widget-container * {
            box-sizing: border-box;
        }

        /* Nút tròn nổi mở Chat */
        .haitech-launcher-btn {
            width: 62px;
            height: 62px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${config.primaryColor}, #00B4D8);
            box-shadow: 0 8px 24px rgba(0, 119, 182, 0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
            outline: none;
            transition: all .25s ease;
            position: relative;
        }
        .haitech-launcher-btn:hover {
            transform: scale(1.08);
            box-shadow: 0 12px 30px rgba(0, 119, 182, 0.55);
        }
        .haitech-launcher-icon {
            font-size: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .haitech-online-badge {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 14px;
            height: 14px;
            background: #10B981;
            border: 2.5px solid white;
            border-radius: 50%;
        }

        /* Cửa sổ Chat Box */
        .haitech-chat-window {
            position: absolute;
            bottom: 78px;
            ${config.position === 'left' ? 'left: 0;' : 'right: 0;'}
            width: 380px;
            max-width: calc(100vw - 36px);
            height: 560px;
            max-height: calc(100vh - 120px);
            background: #FFFFFF;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.22);
            border: 1px solid rgba(0, 0, 0, 0.08);
            display: none;
            flex-direction: column;
            overflow: hidden;
            animation: haitechFadeUp .25s ease forwards;
        }
        .haitech-chat-window.open {
            display: flex;
        }
        @keyframes haitechFadeUp {
            from { opacity: 0; transform: translateY(12px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Header */
        .haitech-chat-header {
            background: linear-gradient(135deg, ${config.primaryColor}, #023E8A);
            color: #FFFFFF;
            padding: 16px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .haitech-header-user {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .haitech-header-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        .haitech-header-title {
            font-weight: 700;
            font-size: 15px;
            line-height: 1.2;
        }
        .haitech-header-status {
            font-size: 12px;
            opacity: 0.9;
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: 2px;
        }
        .haitech-status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #10B981;
        }
        .haitech-header-close-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: background .2s;
        }
        .haitech-header-close-btn:hover {
            background: rgba(255,255,255,0.3);
        }

        /* Thanh Chuyển Tiếp Đa Kênh (Zalo + Hotline) */
        .haitech-omni-bar {
            background: #F0F9FF;
            border-bottom: 1px solid #BAE6FD;
            padding: 8px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }
        .haitech-omni-btn {
            flex: 1;
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            text-decoration: none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all .2s;
        }
        .haitech-omni-btn.zalo {
            background: #0068FF;
            color: white;
        }
        .haitech-omni-btn.hotline {
            background: #059669;
            color: white;
        }
        .haitech-omni-btn:hover {
            opacity: 0.92;
            transform: translateY(-1px);
        }

        /* Khung Tin Nhắn */
        .haitech-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            background: #F8FAFC;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .haitech-bubble {
            max-width: 82%;
            padding: 10px 14px;
            border-radius: 16px;
            font-size: 13.5px;
            line-height: 1.5;
            word-break: break-word;
            white-space: pre-wrap;
        }
        .haitech-bubble.bot {
            align-self: flex-start;
            background: #FFFFFF;
            color: #1E293B;
            border: 1px solid #E2E8F0;
            border-bottom-left-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .haitech-bubble.user {
            align-self: flex-end;
            background: linear-gradient(135deg, ${config.primaryColor}, #0096C7);
            color: #FFFFFF;
            border-bottom-right-radius: 4px;
            box-shadow: 0 3px 10px rgba(0, 119, 182, 0.25);
        }
        .haitech-typing {
            align-self: flex-start;
            padding: 8px 14px;
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 16px;
            color: #64748B;
            font-size: 12.5px;
            display: none;
        }

        /* Gợi Ý Nhanh */
        .haitech-quick-prompts {
            display: flex;
            gap: 6px;
            padding: 8px 14px;
            background: #FFFFFF;
            border-top: 1px solid #F1F5F9;
            overflow-x: auto;
            scrollbar-width: none;
        }
        .haitech-quick-prompts::-webkit-scrollbar {
            display: none;
        }
        .haitech-prompt-chip {
            white-space: nowrap;
            padding: 5px 11px;
            background: #E0F2FE;
            color: ${config.primaryColor};
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            border: 1px solid #BAE6FD;
            transition: all .15s;
        }
        .haitech-prompt-chip:hover {
            background: #BAE6FD;
        }

        /* Input Bar */
        .haitech-chat-input-row {
            display: flex;
            padding: 12px 14px;
            background: #FFFFFF;
            border-top: 1px solid #E2E8F0;
            gap: 8px;
        }
        .haitech-chat-input {
            flex: 1;
            border: 1.5px solid #CBD5E1;
            border-radius: 12px;
            padding: 10px 14px;
            font-size: 13.5px;
            outline: none;
            transition: border-color .2s;
            font-family: inherit;
        }
        .haitech-chat-input:focus {
            border-color: ${config.primaryColor};
        }
        .haitech-send-btn {
            background: ${config.primaryColor};
            color: white;
            border: none;
            border-radius: 12px;
            padding: 0 16px;
            font-weight: 700;
            cursor: pointer;
            transition: opacity .2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .haitech-send-btn:hover {
            opacity: 0.9;
        }
    `;
    document.head.appendChild(styleEl);

    // 3. Tạo cấu trúc DOM
    const container = document.createElement('div');
    container.id = 'haitech-widget-container';
    container.innerHTML = `
        <!-- Nút Tròn Mở Chat -->
        <button class="haitech-launcher-btn" id="haitechLauncherBtn" aria-label="Mở Trợ lý AI">
            <div class="haitech-launcher-icon" id="haitechLauncherIcon">💬</div>
            <div class="haitech-online-badge"></div>
        </button>

        <!-- Khung Cửa Sổ Chat -->
        <div class="haitech-chat-window" id="haitechChatWindow">
            <div class="haitech-chat-header">
                <div class="haitech-header-user">
                    <div class="haitech-header-avatar">🤖</div>
                    <div>
                        <div class="haitech-header-title">${config.botName}</div>
                        <div class="haitech-header-status">
                            <span class="haitech-status-dot"></span> Trực tuyến 24/7 (AI Ready)
                        </div>
                    </div>
                </div>
                <button class="haitech-header-close-btn" id="haitechCloseBtn">&times;</button>
            </div>

            <!-- Thanh Đa Kênh Kết Nối Nhanh -->
            <div class="haitech-omni-bar">
                <a href="${config.zaloUrl}" target="_blank" class="haitech-omni-btn zalo">
                    <span>💬</span> Nhắn Zalo
                </a>
                <a href="tel:${cleanPhone}" class="haitech-omni-btn hotline">
                    <span>📞</span> Gọi Hotline
                </a>
            </div>

            <!-- Nội Dung Tin Nhắn -->
            <div class="haitech-chat-messages" id="haitechChatMessages">
                <div class="haitech-bubble bot">${config.greeting}</div>
            </div>

            <div class="haitech-typing" id="haitechTyping">🤖 ${config.botName} đang soạn câu trả lời...</div>

            <!-- Gợi Ý Nhanh -->
            <div class="haitech-quick-prompts">
                <span class="haitech-prompt-chip" data-text="Báo giá sản phẩm">Báo giá 📋</span>
                <span class="haitech-prompt-chip" data-text="Chính sách bảo hành">Bảo hành 🛠️</span>
                <span class="haitech-prompt-chip" data-text="Gặp trực tiếp tư vấn viên">Tư vấn viên 📞</span>
                <span class="haitech-prompt-chip" data-text="Phương thức giao hàng">Giao hàng 🚚</span>
            </div>

            <!-- Khung Nhập Tin Nhắn -->
            <form class="haitech-chat-input-row" id="haitechChatForm">
                <input type="text" class="haitech-chat-input" id="haitechChatInput" placeholder="Nhập câu hỏi của bạn..." autocomplete="off" />
                <button type="submit" class="haitech-send-btn">Gửi</button>
            </form>
        </div>
    `;
    document.body.appendChild(container);

    // 4. Các biến và Element
    const launcherBtn = document.getElementById('haitechLauncherBtn');
    const launcherIcon = document.getElementById('haitechLauncherIcon');
    const chatWindow = document.getElementById('haitechChatWindow');
    const closeBtn = document.getElementById('haitechCloseBtn');
    const chatForm = document.getElementById('haitechChatForm');
    const chatInput = document.getElementById('haitechChatInput');
    const messagesBox = document.getElementById('haitechChatMessages');
    const typingIndicator = document.getElementById('haitechTyping');

    let isOpen = false;

    // Toggle Cửa sổ
    function toggleChat(forceState) {
        isOpen = typeof forceState === 'boolean' ? forceState : !isOpen;
        if (isOpen) {
            chatWindow.classList.add('open');
            launcherIcon.textContent = '✕';
            chatInput.focus();
        } else {
            chatWindow.classList.remove('open');
            launcherIcon.textContent = '💬';
        }
    }

    launcherBtn.addEventListener('click', () => toggleChat());
    closeBtn.addEventListener('click', () => toggleChat(false));

    // Thêm tin nhắn vào hộp chat
    function appendMessage(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `haitech-bubble ${sender}`;
        bubble.textContent = text;
        messagesBox.appendChild(bubble);
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    // Gửi tin nhắn đến API
    async function sendMessage(text) {
        const userText = text.trim();
        if (!userText) return;

        appendMessage(userText, 'user');
        chatInput.value = '';

        // Hiện typing
        typingIndicator.style.display = 'block';
        messagesBox.scrollTop = messagesBox.scrollHeight;

        try {
            const response = await fetch(config.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText })
            });

            const data = await response.json();
            typingIndicator.style.display = 'none';

            if (data.success && data.reply) {
                appendMessage(data.reply, 'bot');
            } else {
                appendMessage(`Dạ em đã ghi nhận yêu cầu của anh/chị. Anh/chị liên hệ hotline: ${config.phone} để em hỗ trợ tư vấn ngay nhé ạ!`, 'bot');
            }
        } catch (error) {
            typingIndicator.style.display = 'none';
            appendMessage(`Dạ em chào anh/chị! Hiện kết nối mạng đang gián đoạn, anh/chị vui lòng gọi trực tiếp hotline/Zalo: ${config.phone} để được hỗ trợ tức thì nhé ạ! 🙏`, 'bot');
        }
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage(chatInput.value);
    });

    // Bấm chip gợi ý nhanh
    document.querySelectorAll('.haitech-prompt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-text');
            sendMessage(prompt);
        });
    });

})();
