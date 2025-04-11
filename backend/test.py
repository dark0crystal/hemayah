import json
import random
from datetime import datetime, timedelta

# Sample options for disability fields
disability_types = ["Physical", "Mental", "Visual", "Hearing"]
descriptions = {
    "Physical": ["Limb loss", "Paralysis", "Amputation below knee"],
    "Mental": ["Autism", "Depression", "Schizophrenia"],
    "Visual": ["Partial blindness", "Color blindness", "Total blindness"],
    "Hearing": ["Deaf in one ear", "Complete hearing loss", "Mild hearing loss"]
}

# --- Generate Training Cases (500 cases over 60 days) ---
start_date = datetime.strptime("2025-01-01", "%Y-%m-%d")
training_cases = []

for i in range(500):
    day_offset = random.randint(0, 59)
    case_date = start_date + timedelta(days=day_offset)
    disability_type = random.choice(disability_types)
    description = random.choice(descriptions[disability_type])

    training_cases.append({
        "Civil ID": f"1000{i+1:04d}",
        "Disability Description": description,
        "Disability Type": disability_type,
        "Date Submitted": case_date.strftime("%Y-%m-%d")
    })

# --- Generate Test Cases (100 cases on one abnormal day) ---
test_date = datetime.strptime("2025-03-15", "%Y-%m-%d")
test_cases = []

for i in range(100):
    disability_type = random.choice(disability_types)
    description = random.choice(descriptions[disability_type])
    test_cases.append({
        "Civil ID": f"2000{i+1:04d}",
        "Disability Description": description,
        "Disability Type": disability_type,
        "Date Submitted": test_date.strftime("%Y-%m-%d")
    })

# Save files
with open("training_cases.json", "w") as f:
    json.dump(training_cases, f, indent=2)

with open("test_cases.json", "w") as f:
    json.dump(test_cases, f, indent=2)