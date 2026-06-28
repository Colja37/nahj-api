import os
import random
import requests

def send_nahj_quote():
    # 1. جلب التوكن والـ Chat ID من إعدادات الحماية في جيتهاب
    BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
    CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID')
    
    # رابط الـ API الخاص بك (تأكد من تغيير username باسم حسابك)
    # أو يمكنك استخدام الرابط العام لملف الـ json محلياً بما أنه في نفس المستودع
    API_URL = "https://raw.githubusercontent.com/skandaveli/nahj-api/main/data.json"
    
    try:
        # 2. جلب البيانات من الـ API
        response = requests.get(API_URL)
        quotes = response.json()
        
        # 3. اختيار عبارة عشوائية
        random_quote = random.choice(quotes)
        
        # 4. صياغة نص الرسالة وتنسيقها لتليجرام
        message = (
            f"📜 *من نهج البلاغة*\n\n"
            f"«{random_quote['text']}»\n\n"
            f"🏷️ التبويب: *{random_quote['category']}* \\| 🔢 الرقم: `{random_quote['id']}`"
        )
        
        # 5. إرسال الرسالة عبر تليجرام API
        telegram_url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": CHAT_ID,
            "text": message,
            "parse_mode": "MarkdownV2"
        }
        
        req = requests.post(telegram_url, json=payload)
        if req.status_code == 200:
            print("تم إرسال العبارة بنجاح إلى تليجرام!")
        else:
            print(f"فشل الإرسال: {req.text}")
            
    except Exception as e:
        print(f"حدث خطأ أثناء تشغيل البوت: {e}")

if __name__ == "__main__":
    send_nahj_quote()
