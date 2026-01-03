# پیش‌فاکتور آسانسور - Elevator Quote Generator

سامانه صدور پیش‌فاکتور آسانسور با استک مدرن PWA

## استک تکنولوژی

### Frontend
- **Next.js 14** (App Router)
- **React 18** + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Redux Toolkit** - مدیریت state
- **TanStack React Query** - مدیریت درخواست‌ها
- **GraphQL Request** - کلاینت GraphQL
- **React Hook Form** + Zod - مدیریت فرم‌ها
- **PWA** - قابلیت نصب روی موبایل و آفلاین

### Backend
- **Node.js** + Express
- **Apollo Server** - GraphQL API
- **MongoDB** + Mongoose - دیتابیس
- **Zod** - اعتبارسنجی
- **WebSocket** - ارتباط بلادرنگ

### دیپلوی
- **Docker** + Docker Compose
- **Nginx** - Reverse Proxy

---

## راه‌اندازی محلی (بدون Docker)

### پیش‌نیازها
- Node.js 18+
- MongoDB (نصب محلی یا MongoDB Atlas)
- npm یا yarn

### مرحله ۱: نصب MongoDB

#### روش ۱: نصب محلی
از [mongodb.com](https://www.mongodb.com/try/download/community) دانلود و نصب کنید.

#### روش ۲: MongoDB Atlas (ابری - رایگان)
1. ثبت‌نام در [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. ایجاد یک Cluster رایگان
3. دریافت Connection String

### مرحله ۲: کلون پروژه

```bash
git clone https://github.com/javadrostami3/elevator-quote-generator.git
cd elevator-quote-generator
```

### مرحله ۳: نصب وابستگی‌ها

```bash
# نصب وابستگی‌های root
npm install

# نصب وابستگی‌های backend
cd apps/backend
npm install

# نصب وابستگی‌های frontend
cd ../frontend
npm install
```

### مرحله ۴: تنظیم متغیرهای محیطی

#### Backend (.env)
```bash
cd apps/backend
# فایل .env از قبل ایجاد شده، در صورت نیاز تغییر دهید:
MONGODB_URI=mongodb://localhost:27017/elevator-quote
PORT=4000
NODE_ENV=development
```

### مرحله ۵: کپی فونت‌ها

```bash
# از پوشه اصلی پروژه اجرا کنید (Windows)
mkdir apps\frontend\public\fonts
copy "Kalameh 4 font\01- Standard Fonts\Fonts\_Woff2\*" "apps\frontend\public\fonts\"
```

### مرحله ۶: Seed دیتابیس

```bash
cd apps/backend
npm run seed
```

### مرحله ۷: اجرای پروژه

#### ترمینال ۱ - Backend:
```bash
cd apps/backend
npm run dev
```

#### ترمینال ۲ - Frontend:
```bash
cd apps/frontend
npm run dev
```

### مرحله ۸: باز کردن در مرورگر

- Frontend: [http://localhost:3000](http://localhost:3000)
- GraphQL Playground: [http://localhost:4000/graphql](http://localhost:4000/graphql)

---

## راه‌اندازی با Docker

### پیش‌نیازها
- Docker
- Docker Compose

### اجرا

```bash
# از پوشه اصلی پروژه
docker-compose up -d
```

### توقف

```bash
docker-compose down
```

---

## ساختار پروژه

```
elevator-quote-generator/
├── apps/
│   ├── backend/           # Express + Apollo Server
│   │   ├── src/
│   │   │   ├── graphql/   # Schema و Resolvers
│   │   │   ├── models/    # Mongoose Models
│   │   │   ├── index.ts   # Entry point
│   │   │   └── seed.ts    # Seed script
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── frontend/          # Next.js App
│       ├── src/
│       │   ├── app/       # App Router pages
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/       # GraphQL client & queries
│       │   └── store/     # Redux store
│       ├── public/
│       │   ├── fonts/
│       │   ├── icons/
│       │   └── manifest.json
│       ├── Dockerfile
│       └── package.json
│
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── package.json
```

---

## API GraphQL

### Queries

```graphql
# لیست اقلام
query {
  inventoryItems(category: GEARLESS) {
    itemId
    name
    price
    unit
  }
}

# محاسبه پیش‌فاکتور
query {
  calculateQuote(systemType: GEARLESS, stopCount: 7) {
    items {
      name
      quantity
      price
      total
    }
    grandTotal
  }
}

# لیست فاکتورها
query {
  invoices(limit: 10) {
    invoiceNumber
    customerName
    grandTotal
    status
  }
}
```

### Mutations

```graphql
# ایجاد فاکتور
mutation {
  createInvoice(input: {
    customerName: "مشتری تست"
    systemType: GEARLESS
    stopCount: 7
    items: [...]
    grandTotal: 629352000
  }) {
    invoiceNumber
    _id
  }
}
```

---

## ویژگی‌ها

- ✅ محاسبه خودکار قیمت بر اساس نوع سیستم و تعداد توقف
- ✅ ذخیره و مدیریت فاکتورها
- ✅ ویرایش قیمت و تعداد اقلام
- ✅ خروجی Excel
- ✅ قابلیت چاپ
- ✅ PWA - نصب روی موبایل
- ✅ طراحی واکنش‌گرا (Responsive)
- ✅ پشتیبانی کامل از فارسی (RTL)
- ✅ فونت کلامه

---

## توسعه‌دهنده

این پروژه توسط [Javad Rostami](https://github.com/javadrostami3) توسعه داده شده است.

## لایسنس

MIT License
