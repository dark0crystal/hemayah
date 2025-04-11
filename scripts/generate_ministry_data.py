import pandas as pd
import numpy as np
from faker import Faker
import random
from datetime import datetime, timedelta

# Initialize Faker with Arabic locale
fake = Faker('ar_SA')

# Define disability types and descriptions
disability_types = {
    "حركية": ["شلل رباعي", "شلل نصفي سفلي", "شلل أطفال", "بتر طرف سفلي", "بتر طرف علوي", "إعاقة حركية مركبة", "ضمور العضلات"],
    "بصرية": ["كفيف كلي", "ضعف بصر شديد", "عمى جزئي", "ضمور العصب البصري", "فقدان مجال الرؤية"],
    "سمعية": ["صمم كلي", "فقدان سمع شديد", "فقدان سمع متوسط", "ضعف سمعي وتوازني"],
    "ذهنية": ["إعاقة ذهنية بسيطة", "إعاقة ذهنية متوسطة", "إعاقة ذهنية شديدة", "متلازمة داون"],
    "التوحد": ["اضطراب طيف التوحد", "متلازمة أسبرجر", "اضطراب النمو الشامل غير المحدد"],
    "صعوبات التعلم": ["عسر القراءة", "عسر الكتابة", "عسر الحساب", "صعوبات تعلم متعددة"],
    "متعددة": ["إعاقة مزدوجة حركية وبصرية", "إعاقة مزدوجة حركية وسمعية", "إعاقات متعددة"]
}

# Generate 10,000 records
num_records = 10000
data = []

# Generate dates within the last 2 years
start_date = datetime.now() - timedelta(days=730)
end_date = datetime.now()

for _ in range(num_records):
    # Generate a realistic Civil ID (12 digits for Kuwait/10 digits for Saudi)
    civil_id = str(random.randint(1000000000, 9999999999))
    
    # Randomly select a disability type
    disability_type = random.choice(list(disability_types.keys()))
    
    # Select a matching description
    disability_description = random.choice(disability_types[disability_type])
    
    # Generate a random date within the last 2 years
    random_days = random.randint(0, 730)
    date_submitted = (end_date - timedelta(days=random_days)).strftime("%Y-%m-%d")
    
    # Add some data issues for testing (approximately 5% of the data)
    if random.random() < 0.05:
        # Create data issues:
        issue_type = random.randint(1, 5)
        
        if issue_type == 1:
            # Invalid civil ID (too short or repeating digits)
            civil_id = str(random.randint(1, 9)) * random.randint(5, 8)
        elif issue_type == 2:
            # Mismatch between type and description
            other_types = list(set(disability_types.keys()) - {disability_type})
            wrong_type = random.choice(other_types)
            disability_description = random.choice(disability_types[wrong_type])
        elif issue_type == 3:
            # Future date
            days_in_future = random.randint(1, 30)
            date_submitted = (end_date + timedelta(days=days_in_future)).strftime("%Y-%m-%d")
        elif issue_type == 4:
            # Old date (more than 2 years)
            days_old = random.randint(731, 1095)
            date_submitted = (end_date - timedelta(days=days_old)).strftime("%Y-%m-%d")
        elif issue_type == 5:
            # Empty or generic description
            if random.random() < 0.5:
                disability_description = ""
            else:
                disability_description = "حالة غير محددة"
    
    data.append({
        'Civil ID': civil_id,
        'Disability Description': disability_description,
        'Disability Type': disability_type,
        'Date Submitted': date_submitted
    })

# Create DataFrame
df = pd.DataFrame(data)

# Save to Excel
output_file = 'ministry_data.xlsx'
df.to_excel(output_file, index=False, engine='openpyxl')

print(f"Generated {num_records} records and saved to {output_file}")
print("\nSample of the generated data:")
print(df.head()) 