# Terminal Safety

Trước khi sửa:

- Chạy `Get-Location`.
- Chạy `git status` nếu có Git.

Quy tắc:

- Chỉ làm trong thư mục `fe-admin`.
- Không chạy `Remove-Item -Recurse -Force` ngoài phạm vi task.
- Không chạy `git reset --hard`.
- Không chạy `git clean -fd`.
- Không xóa file người dùng.
- Không sửa `.env`.
- Không in token hoặc secret.