# glibc لتقليل أعطال الـ natives مقارنة بـ Alpine (مثل lightningcss/esbuild على musl).
FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# بناء التطبيق كـ full-stack مع دعم SSR ومسارات API.
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

# تشغيل خادم Node.js. استخدام صيغة الـ CMD shell حتى لا يطبِّع Docker المتغير $PORT وقت البناء
# فيُثبَّت المنفذ خطأ؛ Railway يحقن PORT عند التشغيل فقط.
CMD PORT=${PORT:-3000} exec node dist/server/index.js
