# glibc لتقليل أعطال الـ natives مقارنة بـ Alpine (مثل lightningcss/esbuild على musl).
FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# بناء التطبيق كـ full-stack مع دعم SSR ومسارات API.
RUN npm run build
RUN test -f dist/server/server.js
# بعض المنصّات تستدعي تلقائياً dist/server/index.js — رابط له نفس نقطة تشغيل server.js.
RUN ln -sf server.js dist/server/index.js

ENV NODE_ENV=production
# Nitro (TanStack Start) يقرأ NITRO_HOST ثم HOST؛ بدون ذلك قد يبقى الربط على localhost فقط
# فيفشل الـ health على Railway («Application failed to respond»).
ENV HOST=0.0.0.0
ENV NITRO_HOST=0.0.0.0

EXPOSE 3000

# SSR + API عبر preset node في vite.config؛ لا تستخدم «serve» للملفات الثابتة فقط.
# متغير PORT يحقنه المنصّة في بيئة العملية؛ exec-form يحافظ على نقل كل env إلى node.
CMD ["node", "dist/server/server.js"]
