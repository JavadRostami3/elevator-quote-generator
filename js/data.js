/**
 * دیتابیس اقلام آسانسور
 * =====================================
 * این فایل بر اساس فایل‌های اکسل نمونه (gearless_.xlsx و hydrolic_.xlsx) ساخته شده
 * 
 * نکته مهم: قیمت‌ها به تومان است
 * 
 * فرمول محاسبه تعداد:
 * - fixed: تعداد = baseQty
 * - simple_var: تعداد = تعداد توقف
 * - coeff_var: تعداد = (تعداد توقف × coeff) + baseQty
 */

const INVENTORY = [
    // ==========================================
    // اقلام اختصاصی گیرلس (gearless)
    // ==========================================
    {
        id: 1,
        name: "موتور گیرلس ۸ نفره آلبرتو ساسی اسپانیا",
        unit: "دستگاه",
        category: "gearless",
        calcType: "fixed",
        price: 105000000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 2,
        name: "کابین تمام استیل لوکس ۸ نفره (قیمت پایه)",
        unit: "دستگاه",
        category: "gearless",
        calcType: "fixed",
        price: 70000000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 3,
        name: "متعلقات یوک، کارد وزنه، پاراشوت دو طرفه و کفشک",
        unit: "دستگاه",
        category: "gearless",
        calcType: "fixed",
        price: 45000000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 4,
        name: "فلکه هرزگرد ۴۰ سنگین ۶ شیار شفت ۵۰ سه بلبرینگ پرهام",
        unit: "حلقه",
        category: "gearless",
        calcType: "fixed",
        price: 8500000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 5,
        name: "سیم بکسل نمره ۱۰ گوستاوولف چین مغزی فولاد",
        unit: "متر",
        category: "gearless",
        calcType: "coeff_var",
        price: 145000,
        baseQty: 110,
        coeff: 20
    },
    {
        id: 6,
        name: "سیم بکسل نمره ۶ گالوانیزه",
        unit: "متر",
        category: "gearless",
        calcType: "coeff_var",
        price: 16000,
        baseQty: 20,
        coeff: 10
    },
    {
        id: 7,
        name: "کرپی فولادی نمره ۱۰ داکتیل",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 7500,
        baseQty: 36,
        coeff: 0
    },
    {
        id: 8,
        name: "کرپی فولادی نمره ۶ داکتیل",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 6500,
        baseQty: 6,
        coeff: 0
    },
    {
        id: 9,
        name: "اشکی نمره ۶ گالوانیزه",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 10000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 10,
        name: "قلاب سربکسل نمره ۱۰ داکتیل پرشیا",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 190000,
        baseQty: 12,
        coeff: 0
    },
    {
        id: 11,
        name: "لاستیک زیر موتور بزرگ نرم",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 25000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 12,
        name: "وزنه تعادل بتونی روکش فلز",
        unit: "کیلو",
        category: "gearless",
        calcType: "fixed",
        price: 6000,
        baseQty: 900,
        coeff: 0
    },
    {
        id: 13,
        name: "پیچ موتور و مهره نمره ۱۸ خوشکه همراه با واشر و مهره اضافه",
        unit: "سری",
        category: "gearless",
        calcType: "fixed",
        price: 85000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 14,
        name: "درب کابین نیمه اتوماتیک رنگی عرض ۸۰ یاران همراه با کمان",
        unit: "لنگه",
        category: "gearless",
        calcType: "fixed",
        price: 23000000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 15,
        name: "کاور در آسان شایان همراه با متعلقات کامل و وزنه",
        unit: "دستگاه",
        category: "gearless",
        calcType: "fixed",
        price: 3400000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 16,
        name: "محافظ گاورنر",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 180000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 17,
        name: "تابلو ۳ فاز استاندارد ۳۲ آمپر",
        unit: "دستگاه",
        category: "gearless",
        calcType: "fixed",
        price: 950000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 18,
        name: "تابلو فرمان گیرلس متناسب با موتور ۱۰ نفره آریان کنترل",
        unit: "دستگاه",
        category: "gearless",
        calcType: "fixed",
        price: 76400000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 19,
        name: "جعبه رویزیون کارکدک آریان کنترل",
        unit: "دستگاه",
        category: "gearless",
        calcType: "fixed",
        price: 7500000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 20,
        name: "یو پی اس (UPS) همراه با باطری",
        unit: "دستگاه",
        category: "gearless",
        calcType: "fixed",
        price: 13000000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 21,
        name: "سنسور شتابی آریان کنترل",
        unit: "بسته",
        category: "gearless",
        calcType: "fixed",
        price: 800000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 22,
        name: "شابلون آهنربا آریان کنترل",
        unit: "عدد",
        category: "gearless",
        calcType: "coeff_var",
        price: 40000,
        baseQty: 2,
        coeff: 1
    },
    {
        id: 23,
        name: "دی ام وی (Drive) تابلو فرمان",
        unit: "دستگاه",
        category: "gearless",
        calcType: "fixed",
        price: 4800000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 24,
        name: "ضربه گیر ۱۸۰۰ کیلو",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 4200000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 25,
        name: "قفل و دیکتاتور و فنر در",
        unit: "عدد",
        category: "gearless",
        calcType: "simple_var",
        price: 2500000,
        baseQty: 0,
        coeff: 1
    },
    {
        id: 26,
        name: "شستی داخل کابین ۹ توقف تمام اتوماتیک ۲ متری تاچ",
        unit: "دستگاه",
        category: "gearless",
        calcType: "fixed",
        price: 12000000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 27,
        name: "شستی طبقات سگمنت طرح میتسوبیشی",
        unit: "عدد",
        category: "gearless",
        calcType: "simple_var",
        price: 480000,
        baseQty: 0,
        coeff: 1
    },
    {
        id: 28,
        name: "تراول کابل ۲۴ رشته درجه ۱ ایرانی",
        unit: "متر",
        category: "gearless",
        calcType: "coeff_var",
        price: 230000,
        baseQty: 27,
        coeff: 4
    },
    {
        id: 29,
        name: "بست تراول کابل مواد نو",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 18000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 30,
        name: "سیم نمره ۰.۷۵ افشان استاندارد",
        unit: "کلاف",
        category: "gearless",
        calcType: "simple_var",
        price: 270000,
        baseQty: 0,
        coeff: 1
    },
    {
        id: 31,
        name: "سیم نمره ۴ افشان استاندارد",
        unit: "متر",
        category: "gearless",
        calcType: "fixed",
        price: 16000,
        baseQty: 50,
        coeff: 0
    },
    {
        id: 32,
        name: "سیم آیفونی ۶ زوج استاندارد",
        unit: "متر",
        category: "gearless",
        calcType: "coeff_var",
        price: 18000,
        baseQty: 33,
        coeff: 6
    },
    {
        id: 33,
        name: "کابل ۴*۱ نور",
        unit: "متر",
        category: "gearless",
        calcType: "fixed",
        price: 18000,
        baseQty: 40,
        coeff: 0
    },
    {
        id: 34,
        name: "نوار چسب جک اسمیت",
        unit: "حلقه",
        category: "gearless",
        calcType: "fixed",
        price: 10000,
        baseQty: 15,
        coeff: 0
    },
    {
        id: 35,
        name: "لیمیت سوییچ شناسایی پروانه‌ای پارسیان",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 105000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 36,
        name: "پیچ و مهره ۱۲ و ۱۰ با واشر اضافه",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 8250,
        baseQty: 20,
        coeff: 0
    },
    {
        id: 37,
        name: "کلید استپ قارچی همراه قاب کامل",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 62000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 38,
        name: "روغن دان مواد نو طرح ترک",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 35000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 39,
        name: "روغن گیر ONSA",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 15000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 40,
        name: "بست کمربندی ۳۰ سانتی",
        unit: "بسته",
        category: "gearless",
        calcType: "fixed",
        price: 95000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 41,
        name: "کانال نمره ۴ مواد نو",
        unit: "متر",
        category: "gearless",
        calcType: "coeff_var",
        price: 32000,
        baseQty: 6,
        coeff: 6
    },
    {
        id: 42,
        name: "کانال نمره ۹ مواد نو",
        unit: "متر",
        category: "gearless",
        calcType: "fixed",
        price: 52500,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 43,
        name: "کانال نمره ۹ فلزی با درب پوش",
        unit: "متر",
        category: "gearless",
        calcType: "fixed",
        price: 105000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 44,
        name: "لوله خرطومی ۱۶ فلزی روکش دار فلکسی",
        unit: "متر",
        category: "gearless",
        calcType: "fixed",
        price: 25000,
        baseQty: 20,
        coeff: 0
    },
    {
        id: 45,
        name: "لوله خرطومی ۱۳ پلاستیکی عبدی",
        unit: "بسته",
        category: "gearless",
        calcType: "fixed",
        price: 18000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 46,
        name: "پریز بارانی روکار",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 32000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 47,
        name: "کلید تبدیل صنعتی روکار",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 32000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 48,
        name: "سرپیچ معمولی",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 10000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 49,
        name: "لامپ ۱۵ وات LED داخل کابین",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 45000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 50,
        name: "چراغ تونلی حباب دار سرپیچ دار",
        unit: "شعله",
        category: "gearless",
        calcType: "coeff_var",
        price: 68000,
        baseQty: 0,
        coeff: 2
    },
    {
        id: 51,
        name: "لامپ ۹ وات LED تونلی",
        unit: "عدد",
        category: "gearless",
        calcType: "coeff_var",
        price: 32000,
        baseQty: 0,
        coeff: 2
    },
    {
        id: 52,
        name: "فن تهویه ۱۰*۱۰ فلزی",
        unit: "عدد",
        category: "gearless",
        calcType: "fixed",
        price: 550000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 53,
        name: "تلفن دیواری روکار",
        unit: "دستگاه",
        category: "gearless",
        calcType: "fixed",
        price: 180000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 54,
        name: "اورلود دیجیتال گیرلس",
        unit: "دستگاه",
        category: "gearless",
        calcType: "fixed",
        price: 420000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 55,
        name: "سنسور نقطه‌ای فتوسل دو کانال کابین",
        unit: "دستگاه",
        category: "gearless",
        calcType: "fixed",
        price: 3600000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 56,
        name: "پیچ رول پلاک و پرچ و واشر",
        unit: "بسته",
        category: "gearless",
        calcType: "fixed",
        price: 1200000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 57,
        name: "علایم استاندارد گیرلس و کلید سه گوش",
        unit: "ست",
        category: "gearless",
        calcType: "fixed",
        price: 100000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 58,
        name: "اجرت نصب (بست و راه‌اندازی موارد جزئی)",
        unit: "ست",
        category: "gearless",
        calcType: "fixed",
        price: 95000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 59,
        name: "نصب و راه اندازی (توقف)",
        unit: "توقف",
        category: "gearless",
        calcType: "simple_var",
        price: 18000000,
        baseQty: 0,
        coeff: 1
    },

    // ==========================================
    // اقلام اختصاصی هیدرولیک (hydraulic)
    // ==========================================
    {
        id: 101,
        name: "پاور یونیت ۹/۵ کیلووات برند GMV ایتالیا",
        unit: "دستگاه",
        category: "hydraulic",
        calcType: "fixed",
        price: 326000000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 102,
        name: "جک رومانی ۳ توقف ۹۰ * ۵/۵۰ * ۵/۵",
        unit: "دستگاه",
        category: "hydraulic",
        calcType: "fixed",
        price: 154000000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 103,
        name: "راپچر",
        unit: "دستگاه",
        category: "hydraulic",
        calcType: "fixed",
        price: 9500000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 104,
        name: "شیلنگ روغن ۱/۲ اینچ",
        unit: "متر",
        category: "hydraulic",
        calcType: "fixed",
        price: 1500000,
        baseQty: 5,
        coeff: 0
    },
    {
        id: 105,
        name: "روغن هیدرولیک ۶۸",
        unit: "لیتر",
        category: "hydraulic",
        calcType: "fixed",
        price: 2800000,
        baseQty: 8,
        coeff: 0
    },
    {
        id: 106,
        name: "روغن روانکاری ۴۰",
        unit: "لیتر",
        category: "hydraulic",
        calcType: "fixed",
        price: 90000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 107,
        name: "درب طبقات لولایی رنگی یاران یا روانکار بازشو ۸۰ دو لنگه",
        unit: "عدد",
        category: "hydraulic",
        calcType: "simple_var",
        price: 19500000,
        baseQty: 0,
        coeff: 1
    },
    {
        id: 108,
        name: "درب داخلی لولایی رنگی یاران",
        unit: "عدد",
        category: "hydraulic",
        calcType: "fixed",
        price: 30000000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 109,
        name: "سیم بکسل نمره ۱۰ طرح گوستاولف آسانسوری چینی",
        unit: "متر",
        category: "hydraulic",
        calcType: "coeff_var",
        price: 135000,
        baseQty: 20,
        coeff: 20
    },
    {
        id: 110,
        name: "کرپی نمره ۱۰ داکتیل",
        unit: "عدد",
        category: "hydraulic",
        calcType: "fixed",
        price: 22000,
        baseQty: 24,
        coeff: 0
    },
    {
        id: 111,
        name: "قلاب سر بکسل کارسلینگی نمره ۱۰",
        unit: "دست",
        category: "hydraulic",
        calcType: "fixed",
        price: 320000,
        baseQty: 8,
        coeff: 0
    },
    {
        id: 112,
        name: "تابلو فرمان هیدرولیک با قابلیت AFP",
        unit: "دستگاه",
        category: "hydraulic",
        calcType: "fixed",
        price: 58000000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 113,
        name: "تابلو سه فاز استاندارد",
        unit: "دستگاه",
        category: "hydraulic",
        calcType: "fixed",
        price: 1200000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 114,
        name: "شاسی داخل کابین ۴ توقف تمام اتومات ۲ متری",
        unit: "دستگاه",
        category: "hydraulic",
        calcType: "fixed",
        price: 8500000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 115,
        name: "شاسی طبقات",
        unit: "دستگاه",
        category: "hydraulic",
        calcType: "simple_var",
        price: 2500000,
        baseQty: 0,
        coeff: 1
    },
    {
        id: 116,
        name: "کابین تمام لوکس کف سنگ تمام استیل با لاین نوری",
        unit: "دستگاه",
        category: "hydraulic",
        calcType: "fixed",
        price: 85000000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 117,
        name: "ریل T16 چینی (با لوازم)",
        unit: "شاخه",
        category: "hydraulic",
        calcType: "coeff_var",
        price: 8000000,
        baseQty: -1,
        coeff: 2
    },
    {
        id: 118,
        name: "کاراسلینگ شرکتی cnc",
        unit: "دستگاه",
        category: "hydraulic",
        calcType: "fixed",
        price: 55000000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 119,
        name: "چشمی نوری",
        unit: "عدد",
        category: "hydraulic",
        calcType: "fixed",
        price: 4500000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 120,
        name: "تراول کابل طرح دتویلر ۲۴ رشته تمام مس دت فایلر",
        unit: "متر",
        category: "hydraulic",
        calcType: "coeff_var",
        price: 325000,
        baseQty: 8,
        coeff: 5
    },
    {
        id: 121,
        name: "اورلود",
        unit: "عدد",
        category: "hydraulic",
        calcType: "fixed",
        price: 4100000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 122,
        name: "کارکدک",
        unit: "عدد",
        category: "hydraulic",
        calcType: "fixed",
        price: 3800000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 123,
        name: "بست تراول کابل مواد نو",
        unit: "عدد",
        category: "hydraulic",
        calcType: "fixed",
        price: 30000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 124,
        name: "سیم نمره ۰/۷۵ استاندارد هادی",
        unit: "کلاف",
        category: "hydraulic",
        calcType: "coeff_var",
        price: 350000,
        baseQty: 2,
        coeff: 1
    },
    {
        id: 125,
        name: "سیم نمره ۴ استاندارد",
        unit: "کلاف",
        category: "hydraulic",
        calcType: "fixed",
        price: 13000,
        baseQty: 50,
        coeff: 0
    },
    {
        id: 126,
        name: "سیم ۶ زوج آیفونی",
        unit: "متر",
        category: "hydraulic",
        calcType: "coeff_var",
        price: 50000,
        baseQty: 30,
        coeff: 5
    },
    {
        id: 127,
        name: "کابل تونلی ۱*۲",
        unit: "متر",
        category: "hydraulic",
        calcType: "fixed",
        price: 25000,
        baseQty: 40,
        coeff: 0
    },
    {
        id: 128,
        name: "نوار چسب جکسون",
        unit: "حلقه",
        category: "hydraulic",
        calcType: "fixed",
        price: 12000,
        baseQty: 20,
        coeff: 0
    },
    {
        id: 129,
        name: "آژیر",
        unit: "دستگاه",
        category: "hydraulic",
        calcType: "fixed",
        price: 200000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 130,
        name: "لیمیت سوییچ شناسایی شهاب",
        unit: "عدد",
        category: "hydraulic",
        calcType: "fixed",
        price: 270000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 131,
        name: "پیچ و مهره ۱۲ و ۱۰ با واشر اضافه",
        unit: "جفت",
        category: "hydraulic",
        calcType: "fixed",
        price: 12000,
        baseQty: 20,
        coeff: 0
    },
    {
        id: 132,
        name: "سنسور مغناطیسی ۴ توقف فلزی پیشرو",
        unit: "دست",
        category: "hydraulic",
        calcType: "fixed",
        price: 1200000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 133,
        name: "کلید استپ قارچی همراه پایه",
        unit: "بسته",
        category: "hydraulic",
        calcType: "fixed",
        price: 180000,
        baseQty: 3,
        coeff: 0
    },
    {
        id: 134,
        name: "روغن دان طرح ترک",
        unit: "عدد",
        category: "hydraulic",
        calcType: "fixed",
        price: 85000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 135,
        name: "بست کمربندی ۳۰ سانتی",
        unit: "بسته",
        category: "hydraulic",
        calcType: "fixed",
        price: 130000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 136,
        name: "فن ۱۰*۱۰ فلزی",
        unit: "دستگاه",
        category: "hydraulic",
        calcType: "fixed",
        price: 320000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 137,
        name: "کانال نمره ۳ مواد نو",
        unit: "متر",
        category: "hydraulic",
        calcType: "coeff_var",
        price: 150000,
        baseQty: 0,
        coeff: 7
    },
    {
        id: 138,
        name: "کانال نمره ۹ مواد نو",
        unit: "متر",
        category: "hydraulic",
        calcType: "fixed",
        price: 38000,
        baseQty: 4,
        coeff: 0
    },
    {
        id: 139,
        name: "کانال نمره ۹ فلزی",
        unit: "متر",
        category: "hydraulic",
        calcType: "fixed",
        price: 95000,
        baseQty: 2,
        coeff: 0
    },
    {
        id: 140,
        name: "کلید و پریز بارانی",
        unit: "عدد",
        category: "hydraulic",
        calcType: "fixed",
        price: 60000,
        baseQty: 3,
        coeff: 0
    },
    {
        id: 141,
        name: "علائم استاندارد و کلید سه گوش",
        unit: "عدد",
        category: "hydraulic",
        calcType: "fixed",
        price: 300000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 142,
        name: "لوله خرطومی فلزی",
        unit: "متر",
        category: "hydraulic",
        calcType: "fixed",
        price: 35000,
        baseQty: 15,
        coeff: 0
    },
    {
        id: 143,
        name: "لوله خرطومی پلاستیکی",
        unit: "بسته",
        category: "hydraulic",
        calcType: "fixed",
        price: 15000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 144,
        name: "پیچ رول پلاک و پرچ و واشر",
        unit: "بسته",
        category: "hydraulic",
        calcType: "fixed",
        price: 150000,
        baseQty: 1,
        coeff: 0
    },
    {
        id: 145,
        name: "اجرت نصب و راه اندازی",
        unit: "-",
        category: "hydraulic",
        calcType: "simple_var",
        price: 20000000,
        baseQty: 0,
        coeff: 1
    }
];

// برای دسترسی آسان‌تر - صادر کردن دیتابیس
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { INVENTORY };
}
