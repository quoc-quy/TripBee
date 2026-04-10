# Giai đoạn 1: Build source code bằng Node.js
# Sử dụng node:20-alpine để đảm bảo môi trường Linux nhẹ và tương thích
FROM node:20-alpine AS build
WORKDIR /app

# Chỉ copy file package để cài đặt dependencies trước (tối ưu cache Docker)
COPY package*.json ./

# Xóa file lock cũ từ Windows để tránh xung đột module native của Rollup/Vite
RUN rm -f package-lock.json

# Cài đặt sạch và ép buộc tải đúng module cho nền tảng Linux x64 bên trong Docker
# Thêm --include=optional để đảm bảo có các gói native cần thiết cho Vite/Rollup
RUN npm install --platform=linux --arch=x64 --include=optional

# Copy toàn bộ mã nguồn frontend vào container
COPY . .

# Thực hiện build dự án (Vite sẽ tạo ra thư mục dist)
RUN npm run build

# Giai đoạn 2: Sử dụng Nginx để phục vụ các file tĩnh sau khi build
FROM nginx:alpine

# Copy các file đã build từ giai đoạn 1 vào thư mục mặc định của Nginx
# Lưu ý: 'dist' là thư mục mặc định của Vite (nếu bạn dùng CRA hãy đổi thành 'build')
COPY --from=build /app/dist /usr/share/nginx/html

# Cấu hình Nginx để hỗ trợ Client-side Routing (tránh lỗi 404 khi nhấn F5 trang web)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Port mặc định mà container sẽ lắng nghe
EXPOSE 80

# Chạy Nginx ở chế độ foreground
CMD ["nginx", "-g", "daemon off;"]