let quotesDatabase = [];

// العناصر من واجهة المستخدم
const textElement = document.getElementById('quote-text');
const categoryElement = document.getElementById('quote-category');
const idElement = document.getElementById('quote-id');
const nextBtn = document.getElementById('next-btn');
const copyBtn = document.getElementById('copy-btn');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const resultsContainer = document.getElementById('search-results');

// 1. جلب البيانات من ملف JSON
async function loadQuotes() {
    try {
        // استبدل الرابط أدناه برابط الـ Raw الذي نسخته من حسابك
const response = await fetch(`https://raw.githubusercontent.com/Colja37/nahj-api/main/data.json?v=${new Date().getTime()}`);
        quotesDatabase = await response.json();
        // عرض عبارة عشوائية فور تحميل الموقع
        displayRandomQuote();
    } catch (error) {
        textElement.innerText = "فشل تحميل العبارات. تأكد من وجود ملف data.json بشكل صحيح.";
        console.error("Error loading JSON:", error);
    }
}

// 2. دالة اختيار وعرض عبارة عشوائية
function displayRandomQuote() {
    if (quotesDatabase.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotesDatabase.length);
    const item = quotesDatabase[randomIndex];
    renderQuote(item);
}

// دالة مساعدة لطباعة العبارة في البطاقة الرئيسية
function renderQuote(item) {
    textElement.innerText = item.text;
    categoryElement.innerText = item.category;
    idElement.innerText = `#${item.id}`;
}

// 3. نظام البحث والتصفية الحي (Live Search)
function filterQuotes() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    resultsContainer.innerHTML = ''; // تنظيف النتائج السابقة

    if (searchText === '' && selectedCategory === 'all') {
        resultsContainer.innerHTML = '<p style="color: #666; font-size: 0.85rem;">اكتب شيئاً أو اختر تصنيفاً للبحث...</p>';
        return;
    }

    const filtered = quotesDatabase.filter(item => {
        const matchesText = item.text.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesText && matchesCategory;
    });

    if (filtered.length === 0) {
        resultsContainer.innerHTML = '<p style="color: #666; font-size: 0.85rem;">لا توجد نتائج مطابقة.</p>';
        return;
    }

    // عرض النتائج في القائمة السفلى
    filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `<span class="result-tag">[${item.category}]</span> ${item.text.substring(0, 60)}...`;
        // عند الضغط على النتيجة يتم عرضها في البطاقة الرئيسية فوق
        div.addEventListener('click', () => renderQuote(item));
        resultsContainer.appendChild(div);
    });
}

// 4. دالة نسخ النص إلى الحافظة
function copyToClipboard() {
    const textToCopy = `"${textElement.innerText}" - من نهج البلاغة (${categoryElement.innerText})`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "تم النسخ! ✓";
        setTimeout(() => copyBtn.innerText = originalText, 2000);
    }).catch(err => {
        alert("فشل نسخ النص المحدّد.");
    });
}

// ربط الأحداث بالأزرار والمدخلات
nextBtn.addEventListener('click', displayRandomQuote);
copyBtn.addEventListener('click', copyToClipboard);
searchInput.addEventListener('input', filterQuotes);
categoryFilter.addEventListener('change', filterQuotes);

// تشغيل جلب البيانات عند فتح الصفحة
window.addEventListener('DOMContentLoaded', loadQuotes);
