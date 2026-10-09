FROM node:20-alpine

WORKDIR /app

# Cài đặt thư viện
COPY package*.json ./
RUN npm install --omit=dev

# Sao chép mã nguồn
COPY . .

# Khai báo cổng Cloud Keep-Alive
EXPOSE 3000
ENV PORT=3000

# Chạy trợ lý Thùy Linh
CMD ["npm", "start"]
