import pandas as pd
import numpy as np
from faker import Faker
import random
from datetime import datetime

# Initialize Faker with Arabic locale
fake = Faker('ar_SA')

# Define disability types
disability_types = [
    "حركية",  # Physical
    "بصرية",  # Visual
    "سمعية",  # Hearing
    "ذهنية",  # Intellectual
    "نفسية",  # Psychological
    "كلامية",  # Speech
    "متعددة"   # Multiple
]

# Generate 10,000 records
num_records = 10000
data = []

for _ in range(num_records):
    # Generate a realistic Saudi national ID (10 digits)
    national_id = str(random.randint(1000000000, 9999999999))
    
    # Generate a realistic name
    name = fake.name()
    
    # Randomly select a disability type
    disability_type = random.choice(disability_types)
    
    # Add some randomness to make the data more realistic
    # 5% chance of having multiple disabilities
    if random.random() < 0.05:
        disability_type = "متعددة"
    
    # Add some suspicious patterns (for testing the verification system)
    # 2% chance of having suspicious data
    is_suspicious = random.random() < 0.02
    if is_suspicious:
        # Make the national ID suspicious (repeating digits)
        national_id = str(random.randint(1, 9)) * 10
        # Or make the name suspicious (too short)
        name = fake.first_name()
    
    data.append({
        'الاسم': name,
        'رقم الهوية': national_id,
        'نوع الإعاقة': disability_type,
        'تاريخ الطلب': fake.date_between(start_date='-2y', end_date='today').strftime('%Y-%m-%d'),
        'المحافظة': fake.city(),
        'العمر': random.randint(18, 80),
        'الجنس': random.choice(['ذكر', 'أنثى']),
        'الحالة الاجتماعية': random.choice(['أعزب', 'متزوج', 'مطلق', 'أرمل']),
        'مستوى التعليم': random.choice(['ابتدائي', 'متوسط', 'ثانوي', 'جامعي', 'ما بعد الجامعة', 'بدون تعليم']),
        'نوع التأمين': random.choice(['حكومي', 'خاص', 'بدون تأمين']),
        'الدخل الشهري': random.randint(1000, 20000),
        'عدد المعالين': random.randint(0, 10),
        'نوع السكن': random.choice(['ملك', 'إيجار', 'مع الأهل', 'مؤسسة رعاية']),
        'تاريخ تشخيص الإعاقة': fake.date_between(start_date='-30y', end_date='-1y').strftime('%Y-%m-%d'),
        'درجة الإعاقة': f"{random.randint(20, 100)}%",
        'الحاجة لمساعد': random.choice(['نعم', 'لا']),
        'نوع المساعدة المطلوبة': random.choice(['حركية', 'سمعية', 'بصرية', 'تعليمية', 'لا يحتاج']),
        'ملاحظات': fake.text(max_nb_chars=100) if random.random() < 0.3 else ''
    })

# Create DataFrame
df = pd.DataFrame(data)

# Save to Excel
output_file = 'test_data.xlsx'
df.to_excel(output_file, index=False, engine='openpyxl')

print(f"Generated {num_records} records and saved to {output_file}")
print("\nSample of the generated data:")
print(df.head()) 