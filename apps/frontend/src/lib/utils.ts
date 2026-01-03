// فرمت کردن اعداد به صورت فارسی با جداکننده هزارتایی
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num);
}

// فرمت کردن قیمت به تومان
export function formatPrice(price: number): string {
  return `${formatNumber(price)} تومان`;
}

// تبدیل عدد انگلیسی به فارسی
export function toPersianDigits(str: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
}

// تبدیل عدد فارسی به انگلیسی
export function toEnglishDigits(str: string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result
      .replace(new RegExp(persianDigits[i], 'g'), String(i))
      .replace(new RegExp(arabicDigits[i], 'g'), String(i));
  }
  return result;
}

// فرمت کردن تاریخ به شمسی
export function formatPersianDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

// فرمت کردن تاریخ و زمان به شمسی
export function formatPersianDateTime(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

// تبدیل SystemType به فارسی
export function getSystemTypeName(type: 'gearless' | 'hydraulic'): string {
  return type === 'gearless' ? 'گیرلس' : 'هیدرولیک';
}

// تبدیل وضعیت فاکتور به فارسی
export function getStatusName(
  status: 'draft' | 'finalized' | 'cancelled'
): string {
  const statusMap = {
    draft: 'پیش‌نویس',
    finalized: 'نهایی شده',
    cancelled: 'لغو شده',
  };
  return statusMap[status];
}

// تبدیل وضعیت فاکتور به رنگ
export function getStatusColor(
  status: 'draft' | 'finalized' | 'cancelled'
): string {
  const colorMap = {
    draft: 'text-yellow-600 bg-yellow-100',
    finalized: 'text-green-600 bg-green-100',
    cancelled: 'text-red-600 bg-red-100',
  };
  return colorMap[status];
}


// تابع ادغام کلاس‌های Tailwind
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

