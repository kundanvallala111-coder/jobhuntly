#!/usr/bin/env python3
"""Fix jobs.csv to set company_id to empty to avoid foreign key errors"""

import csv

# Read jobs.csv
with open('jobs.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    jobs = list(reader)

# Set all company_id to empty
for job in jobs:
    job['company_id'] = ''

# Write back
with open('jobs.csv', 'w', newline='', encoding='utf-8') as f:
    if jobs:
        writer = csv.DictWriter(f, fieldnames=jobs[0].keys())
        writer.writeheader()
        writer.writerows(jobs)

print("Fixed jobs.csv - all company_id set to empty")



