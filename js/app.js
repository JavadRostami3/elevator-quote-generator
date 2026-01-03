/**
 * اپلیکیشن اصلی صدور پیش‌فاکتور آسانسور
 * =====================================
 */

// متغیرهای سراسری
let currentInvoiceData = [];
let invoiceCounter = 1000;

// DOM Elements
const systemTypeSelect = document.getElementById('systemType');
const stopCountInput = document.getElementById('stopCount');
const customerNameInput = document.getElementById('customerName');
const generateBtn = document.getElementById('generateBtn');
const invoiceSection = document.getElementById('invoiceSection');
const invoiceBody = document.getElementById('invoiceBody');
const grandTotalEl = document.getElementById('grandTotal');
const totalInWordsEl = document.getElementById('totalInWords');
const addRowBtn = document.getElementById('addRowBtn');
const printBtn = document.getElementById('printBtn');
const excelBtn = document.getElementById('excelBtn');
const addRowModal = document.getElementById('addRowModal');

// ==========================================
// توابع محاسباتی
// ==========================================

/**
 * محاسبه تعداد کالا بر اساس نوع محاسبه
 * @param {Object} item - آیتم کالا
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
            return item.baseQty || 1;
    }
}

/**
 * فیلتر کردن اقلام بر اساس نوع سیستم
 * @param {string} systemType - نوع سیستم (gearless | hydraulic)
 * @returns {Array} - لیست اقلام فیلتر شده
 */
function filterItemsBySystem(systemType) {
    return INVENTORY.filter(item => 
        item.category === systemType || item.category === 'common'
    );
}

/**
 * ساخت داده‌های فاکتور
 * @param {string} systemType - نوع سیستم
 * @param {number} stopCount - تعداد توقف
 * @returns {Array} - داده‌های فاکتور
 */
function generateInvoiceData(systemType, stopCount) {
    const filteredItems = filterItemsBySystem(systemType);
    
    return filteredItems.map((item, index) => {
        const qty = calculateQuantity(item, stopCount);
        const totalPrice = qty * item.price;
        
        return {
            row: index + 1,
            id: item.id,
            name: item.name,
            unit: item.unit,
            qty: qty,
            price: item.price,
            total: totalPrice,
            isCustom: false
        };
    });
}

/**
 * محاسبه جمع کل فاکتور
 * @returns {number} - جمع کل
 */
function calculateGrandTotal() {
    return currentInvoiceData.reduce((sum, item) => sum + item.total, 0);
}

// ==========================================
// توابع رندر UI
// ==========================================

/**
 * رندر کردن جدول فاکتور
 */
function renderInvoiceTable() {
    invoiceBody.innerHTML = '';
    
    currentInvoiceData.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.dataset.index = index;
        
        tr.innerHTML = `
            <td class="col-row">${toPersianDigits(item.row)}</td>
            <td class="col-name editable" data-field="name">${item.name}</td>
            <td class="col-unit">${item.unit}</td>
            <td class="col-qty editable" data-field="qty">${toPersianDigits(item.qty)}</td>
            <td class="col-price editable" data-field="price">${toPersianDigits(formatNumber(item.price))}</td>
            <td class="col-total">${toPersianDigits(formatNumber(item.total))}</td>
            <td class="col-action no-print">
                <button class="btn-delete" onclick="deleteRow(${index})" title="حذف">🗑️</button>
            </td>
        `;
        
        invoiceBody.appendChild(tr);
    });
    
    updateTotals();
    attachEditListeners();
}

/**
 * به‌روزرسانی جمع کل
 */
function updateTotals() {
    const grandTotal = calculateGrandTotal();
    grandTotalEl.textContent = toPersianDigits(formatNumber(grandTotal));
    totalInWordsEl.textContent = numberToWords(grandTotal) + ' ریال';
}

/**
 * به‌روزرسانی اطلاعات هدر فاکتور
 */
function updateInvoiceHeader(customerName, systemType) {
    document.getElementById('invoiceNumber').textContent = toPersianDigits(invoiceCounter);
    document.getElementById('invoiceDate').textContent = getPersianDate();
    document.getElementById('invoiceCustomer').textContent = customerName || '-';
    document.getElementById('invoiceSystem').textContent = 
        systemType === 'gearless' ? 'گیرلس' : 'هیدرولیک';
}

// ==========================================
// ویرایش Inline
// ==========================================

/**
 * اتصال Event Listener برای ویرایش سلول‌ها
 */
function attachEditListeners() {
    const editableCells = document.querySelectorAll('.editable');
    
    editableCells.forEach(cell => {
        cell.addEventListener('click', startEditing);
    });
}

/**
 * شروع ویرایش سلول
 */
function startEditing(e) {
    const cell = e.target;
    if (cell.querySelector('input')) return; // در حال ویرایش است
    
    const currentValue = cell.textContent;
    const field = cell.dataset.field;
    const row = cell.parentElement;
    const index = parseInt(row.dataset.index);
    
    // تبدیل به اعداد انگلیسی برای ویرایش
    let editValue = toEnglishDigits(currentValue.replace(/,/g, ''));
    
    const input = document.createElement('input');
    input.type = field === 'name' ? 'text' : 'number';
    input.value = editValue;
    input.className = 'inline-edit-input';
    
    if (field !== 'name') {
        input.min = 0;
    }
    
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
    input.select();
    
    // ذخیره با Enter یا خروج از فوکوس
    input.addEventListener('blur', () => finishEditing(cell, input, field, index));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        } else if (e.key === 'Escape') {
            cell.textContent = currentValue;
        }
    });
}

/**
 * پایان ویرایش سلول
 */
function finishEditing(cell, input, field, index) {
    let newValue = input.value;
    
    if (field === 'name') {
        currentInvoiceData[index].name = newValue;
        cell.textContent = newValue;
    } else {
        newValue = parseFloat(newValue) || 0;
        currentInvoiceData[index][field] = newValue;
        
        // به‌روزرسانی قیمت کل ردیف
        currentInvoiceData[index].total = 
            currentInvoiceData[index].qty * currentInvoiceData[index].price;
        
        // نمایش مقدار جدید
        if (field === 'qty') {
            cell.textContent = toPersianDigits(newValue);
        } else {
            cell.textContent = toPersianDigits(formatNumber(newValue));
        }
        
        // به‌روزرسانی ستون قیمت کل
        const totalCell = cell.parentElement.querySelector('.col-total');
        totalCell.textContent = toPersianDigits(formatNumber(currentInvoiceData[index].total));
    }
    
    updateTotals();
}

// ==========================================
// عملیات ردیف‌ها
// ==========================================

/**
 * حذف ردیف از فاکتور
 */
function deleteRow(index) {
    if (confirm('آیا از حذف این ردیف مطمئن هستید؟')) {
        currentInvoiceData.splice(index, 1);
        // شماره‌گذاری مجدد ردیف‌ها
        currentInvoiceData.forEach((item, i) => {
            item.row = i + 1;
        });
        renderInvoiceTable();
    }
}

/**
 * باز کردن مودال افزودن سطر
 */
function openAddRowModal() {
    addRowModal.style.display = 'flex';
    document.getElementById('newItemName').value = '';
    document.getElementById('newItemUnit').value = 'عدد';
    document.getElementById('newItemQty').value = 1;
    document.getElementById('newItemPrice').value = 0;
    document.getElementById('newItemName').focus();
}

/**
 * بستن مودال
 */
function closeModal() {
    addRowModal.style.display = 'none';
}

/**
 * افزودن ردیف جدید
 */
function addNewRow() {
    const name = document.getElementById('newItemName').value.trim();
    const unit = document.getElementById('newItemUnit').value.trim();
    const qty = parseFloat(document.getElementById('newItemQty').value) || 1;
    const price = parseFloat(document.getElementById('newItemPrice').value) || 0;
    
    if (!name) {
        alert('لطفاً نام کالا را وارد کنید');
        return;
    }
    
    const newItem = {
        row: currentInvoiceData.length + 1,
        id: Date.now(), // ID یکتا
        name: name,
        unit: unit,
        qty: qty,
        price: price,
        total: qty * price,
        isCustom: true
    };
    
    currentInvoiceData.push(newItem);
    renderInvoiceTable();
    closeModal();
}

// ==========================================
// خروجی‌ها
// ==========================================

/**
 * چاپ فاکتور
 */
function printInvoice() {
    window.print();
}

/**
 * خروجی اکسل
 */
function exportToExcel() {
    // بررسی وجود کتابخانه SheetJS
    if (typeof XLSX === 'undefined') {
        alert('کتابخانه SheetJS بارگذاری نشده است. لطفاً فایل xlsx.full.min.js را در پوشه lib قرار دهید.');
        return;
    }
    
    // آماده‌سازی داده‌ها
    const excelData = [
        ['ردیف', 'شرح کالا', 'واحد', 'تعداد', 'قیمت واحد (ریال)', 'قیمت کل (ریال)']
    ];
    
    currentInvoiceData.forEach(item => {
        excelData.push([
            item.row,
            item.name,
            item.unit,
            item.qty,
            item.price,
            item.total
        ]);
    });
    
    // اضافه کردن جمع کل
    const grandTotal = calculateGrandTotal();
    excelData.push([]);
    excelData.push(['', '', '', '', 'جمع کل:', grandTotal]);
    
    // ساخت WorkBook
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    // تنظیم عرض ستون‌ها
    ws['!cols'] = [
        { width: 8 },   // ردیف
        { width: 40 },  // شرح کالا
        { width: 12 },  // واحد
        { width: 10 },  // تعداد
        { width: 20 },  // قیمت واحد
        { width: 20 }   // قیمت کل
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'فاکتور');
    
    // دانلود فایل
    const customerName = customerNameInput.value.trim() || 'فاکتور';
    const fileName = `پیش‌فاکتور_${customerName}_${invoiceCounter}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

// ==========================================
// ساخت فاکتور
// ==========================================

/**
 * ساخت فاکتور جدید
 */
function generateInvoice() {
    const systemType = systemTypeSelect.value;
    const stopCount = parseInt(stopCountInput.value) || 7;
    const customerName = customerNameInput.value.trim();
    
    // اعتبارسنجی
    if (stopCount < 2 || stopCount > 50) {
        alert('تعداد توقف باید بین ۲ تا ۵۰ باشد');
        return;
    }
    
    // افزایش شماره فاکتور
    invoiceCounter++;
    
    // ساخت داده‌های فاکتور
    currentInvoiceData = generateInvoiceData(systemType, stopCount);
    
    // به‌روزرسانی UI
    updateInvoiceHeader(customerName, systemType);
    renderInvoiceTable();
    
    // نمایش بخش فاکتور
    invoiceSection.style.display = 'block';
    
    // اسکرول به فاکتور
    invoiceSection.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// Event Listeners
// ==========================================

// دکمه ساخت فاکتور
generateBtn.addEventListener('click', generateInvoice);

// دکمه افزودن سطر
addRowBtn.addEventListener('click', openAddRowModal);

// دکمه چاپ
printBtn.addEventListener('click', printInvoice);

// دکمه اکسل
excelBtn.addEventListener('click', exportToExcel);

// بستن مودال با کلیک بیرون
addRowModal.addEventListener('click', (e) => {
    if (e.target === addRowModal) {
        closeModal();
    }
});

// بستن مودال با Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && addRowModal.style.display === 'flex') {
        closeModal();
    }
});

// ساخت فاکتور با Enter در فیلد تعداد توقف
stopCountInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        generateInvoice();
    }
});

// ==========================================
// شروع برنامه
// ==========================================

console.log('✅ اپلیکیشن صدور پیش‌فاکتور آسانسور بارگذاری شد');
console.log(`📦 تعداد اقلام در دیتابیس: ${INVENTORY.length}`);
