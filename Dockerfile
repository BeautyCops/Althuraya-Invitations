# glibc لتقليل أعطال الـ natives مقارنة بـ Alpine (مثل lightningcss/esbuild على musl).
FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# بناء التطبيق كـ full-stack مع دعم SSR ومسارات API.
RUN npm run build
RUN test -f dist/server/index.js

ENV NODE_ENV=production

EXPOSE 3000

# SSR + API عبر preset node في vite.config؛ لا تستخدم هنا «serve» للملفات الثابتة فقط أو يظهر فهرس مجلدات.
# متغير PORT يُحقنه Railway عند التشغيل.
CMD PORT=${PORT:-3000} exec node dist/server/index.js
