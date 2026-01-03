/**
 * توابع کمکی (Utility Functions)
 * =====================================
 */

/**
 * تبدیل عدد به حروف فارسی
 * @param {number} num - عدد ورودی
 * @returns {string} - عدد به حروف فارسی
 */
function numberToWords(num) {
    if (num === 0) return 'صفر';
    if (!num || isNaN(num)) return 'صفر';

    const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const hundreds = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    const thousands = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

    function convertLessThanThousand(n) {
        if (n === 0) return '';
        
        let result = '';
        
        // صدگان
        if (n >= 100) {
            result += hundreds[Math.floor(n / 100)];
            n %= 100;
            if (n > 0) result += ' و ';
        }
        
        // دهگان و یکان
        if (n >= 10 && n < 20) {
            result += teens[n - 10];
        } else {
            if (n >= 20) {
                result += tens[Math.floor(n / 10)];
                n %= 10;
                if (n > 0) result += ' و ';
            }
            if (n > 0) {
                result += ones[n];
            }
        }
        
        return result;
    }

    let n = Math.abs(Math.floor(num));
    if (n === 0) return 'صفر';

    let result = '';
    let groupIndex = 0;

    while (n > 0) {
        const group = n % 1000;
        if (group !== 0) {
            const groupText = convertLessThanThousand(group);
            if (groupIndex > 0) {
                result = groupText + ' ' + thousands[groupIndex] + (result ? ' و ' + result : '');
            } else {
                result = groupText;
            }
        }
        n = Math.floor(n / 1000);
        groupIndex++;
    }

    return num < 0 ? 'منفی ' + result : result;
}

/**
 * فرمت کردن عدد با جداکننده سه‌رقمی
 * @param {number} num - عدد ورودی
 * @returns {string} - عدد فرمت شده
 */
function formatNumber(num) {
    if (!num || isNaN(num)) return '۰';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * تبدیل اعداد انگلیسی به فارسی
 * @param {string|number} str - رشته یا عدد ورودی
 * @returns {string} - با اعداد فارسی
 */
function toPersianDigits(str) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.toString().replace(/\d/g, d => persianDigits[d]);
}

/**
 * تبدیل اعداد فارسی به انگلیسی
 * @param {string} str - رشته ورودی
 * @returns {string} - با اعداد انگلیسی
 */
function toEnglishDigits(str) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    
    for (let i = 0; i < 10; i++) {
        str = str.replace(new RegExp(persianDigits[i], 'g'), i.toString());
        str = str.replace(new RegExp(arabicDigits[i], 'g'), i.toString());
    }
    return str;
}

/**
 * دریافت تاریخ شمسی فعلی
 * @returns {string} - تاریخ به فرمت فارسی
 */
function getPersianDate() {
    const now = new Date();
    
    // تبدیل ساده به شمسی (تقریبی)
    const gy = now.getFullYear();
    const gm = now.getMonth() + 1;
    const gd = now.getDate();
    
    const jy = gy - 621;
    let jm, jd;
    
    // محاسبه تقریبی ماه و روز شمسی
    const dayOfYear = Math.floor((now - new Date(gy, 0, 0)) / (1000 * 60 * 60 * 24));
    
    if (dayOfYear <= 79) {
        // دی، بهمن، اسفند سال قبل یا فروردین
        jm = Math.floor((dayOfYear + 286) / 30);
        jd = ((dayOfYear + 286) % 30) + 1;
        if (jm > 12) jm -= 12;
    } else {
        // اردیبهشت تا آذر
        const remaining = dayOfYear - 79;
        if (remaining <= 186) {
            jm = Math.floor((remaining - 1) / 31) + 1;
            jd = ((remaining - 1) % 31) + 1;
        } else {
            const afterSix = remaining - 186;
            jm = Math.floor((afterSix - 1) / 30) + 7;
            jd = ((afterSix - 1) % 30) + 1;
        }
    }
    
    const months = ['', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 
                    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    
    return `${toPersianDigits(jd)} ${months[jm]} ${toPersianDigits(jy)}`;
}

/**
 * تولید شماره فاکتور یکتا
 * @returns {string} - شماره فاکتور
 */
function generateInvoiceNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
}

/**
 * فرمت کردن عدد به صورت فارسی با جداکننده
 * @param {number} num - عدد ورودی
 * @returns {string} - عدد فرمت شده به فارسی
 */
function formatNumberPersian(num) {
    return toPersianDigits(formatNumber(num));
}

/**
 * محاسبه تعداد بر اساس نوع محاسبه
 * @param {object} item - آیتم از دیتابیس
 * @param {number} stopCount - تعداد توقف
 * @returns {number} - تعداد محاسبه شده
 */
function calculateQuantity(item, stopCount) {
    switch (item.calcType) {
        case 'fixed':
            return item.baseQty;
        case 'simple_var':
            return stopCount;
        case 'coeff_var':
            return (stopCount * item.coeff) + item.baseQty;
        default:
            return item.baseQty;
    }
}

/**
 * حذف کاراکترهای اضافی از عدد
 * @param {string} str - رشته ورودی
 * @returns {number} - عدد خالص
 */
function parseFormattedNumber(str) {
    if (!str) return 0;
    const cleaned = toEnglishDigits(str.toString()).replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
}
