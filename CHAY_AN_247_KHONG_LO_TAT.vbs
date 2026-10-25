' =====================================================================
' HAITECH BOT - CHẠY ẨN TRỢ LÝ THÙY LINH 24/7 TRONG NỀN WINDOWS
' Tác giả: HAITECH AI (Hotline/Zalo: 0988 739 896)
' Mục tiêu: Giữ bot chạy ngầm vĩnh viễn, không có cửa sổ đen CMD,
'           hoàn toàn không lo bị tắt nhầm khi dùng máy tính!
' =====================================================================

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
currentDir = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = currentDir

' Kiểm tra nếu chưa có phiên đăng nhập thì yêu cầu quét QR trước
If Not fso.FileExists(currentDir & "\session.json") Then
    WScript.Echo "⚠️ [CHÚ Ý] CHƯA CÓ PHIÊN ĐĂNG NHẬP HOẶC PHIÊN ZALO ĐÃ HẾT HẠN!" & vbCrLf & vbCrLf & _
                 "👉 Để kết nối Zalo, vui lòng bấm mở file:" & vbCrLf & _
                 "   'BAT_THUY_LINH.bat' (hoặc 'CHAY_BOT_ZALO.bat')" & vbCrLf & _
                 "để quét mã QR bằng điện thoại trước." & vbCrLf & vbCrLf & _
                 "✅ Sau khi quét đăng nhập xong 1 lần duy nhất, bạn bấm file chạy ẩn này để bot chạy ngầm 24/7 cực kỳ tiện lợi!"
    WScript.Quit
End If

' Cập nhật trạng thái BẬT trực chiến 24/7
WshShell.Run "powershell -NoProfile -Command ""Set-Content -Path 'bot-status.json' -Value '{\""active\"": true, \""mode\"": \""smart_customer_only\"", \""updatedAt\"": \""' + (Get-Date).ToString('o') + '\""}' -Encoding UTF8""", 0, True

' Khởi động BAT_THUY_LINH.bat ở chế độ hoàn toàn ẩn (0 = Hidden)
WshShell.Run "cmd /c """ & currentDir & "\BAT_THUY_LINH.bat""", 0, False

WScript.Echo "🌸 [EM THÙY LINH ĐÃ BẬT TRỰC CHIẾN 24/7 ẨN TRONG NỀN] 🌸" & vbCrLf & vbCrLf & _
             "✅ Em Thùy Linh đang chạy ngầm an toàn 24/7 trong máy tính của anh Hải." & vbCrLf & _
             "✅ Không còn cửa sổ đen CMD -> Không sợ bị bấm dấu [X] tắt nhầm!" & vbCrLf & _
             "✅ Tự động tư vấn khách hỏi dịch vụ và xin số điện thoại." & vbCrLf & _
             "✅ Bảo vệ bạn bè: Bạn bè chat riêng thì Thùy Linh im lặng." & vbCrLf & vbCrLf & _
             "📱 ĐIỀU KHIỂN TRÊN ĐIỆN THOẠI (Zalo -> 'Cloud của tôi'):" & vbCrLf & _
             "   • Nhắn '#bat' : Bật trực khách 24/7" & vbCrLf & _
             "   • Nhắn '#tat' : Tắt trực khách (tự chat tay)" & vbCrLf & _
             "   • Nhắn '#rieng': Chỉ phục vụ riêng một mình Sếp Hải" & vbCrLf & _
             "   • Nhắn '#leads': Xem danh sách SĐT khách đã lưu" & vbCrLf & vbCrLf & _
             "💡 Muốn kiểm tra bot đang chạy: Bấm 'KIEM_TRA_TRANG_THAI_BOT.bat'" & vbCrLf & _
             "💡 Muốn dừng bot hoàn toàn: Bấm 'DUNG_BOT_HOAN_TOAN.bat'"
