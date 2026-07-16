# CÁCH CHẠY

Mở PowerShell tại thư mục FE rồi chạy:

`powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\audit-fe-current-state.ps1 -Root . -IncludeSourceSnapshot
`

Nếu script nằm ở thư mục khác:

`powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\duong-dan\audit-fe-current-state.ps1" 
  -Root "D:\DỰ ÁN TỐT NGHIỆP\mô tả của Trello\gd3\fe-admin" 
  -IncludeSourceSnapshot
`

Kết quả tạo trong thư mục:

`	ext
FE_CURRENT_STATE_AUDIT_yyyyMMdd_HHmmss
`

và một file ZIP cùng tên ở thư mục cha.
