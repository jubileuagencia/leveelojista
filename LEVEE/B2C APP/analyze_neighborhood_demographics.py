import json
from datetime import datetime
from collections import defaultdict
import os

# Define file paths
# Note: Using raw string for Windows paths to avoid escape character issues
USERS_FILE_PATH = r'c:\Users\gquei\🚀 Antigravity\LEVEE\banco de dados\export-users.json'
ADDRESS_FILE_PATH = r'c:\Users\gquei\🚀 Antigravity\LEVEE\banco de dados\export-enderecos.json'
OUTPUT_REPORT_PATH = r'c:\Users\gquei\🚀 Antigravity\LEVEE\bairro_demographics.md'

def calculate_age(birth_date_str):
    """Calculates age from a date string in format 'YYYY-MM-DDT...' or similar."""
    if not birth_date_str:
        return None
    try:
        # Attempt to parse ISO format first (common in JSON dumps)
        # Taking just the date part (YYYY-MM-DD)
        date_part = birth_date_str.split('T')[0]
        birth_date = datetime.strptime(date_part, '%Y-%m-%d')
        
        today = datetime.now()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        return age
    except ValueError:
        # Fallback for other formats if necessary? 
        # For now assume mostly standard ISO-like strings based on typical Mongo/JSON exports
        try:
             # Try simple YYYY-MM-DD
            birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d')
            today = datetime.now()
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
            return age
        except:
            return None

def get_age_group(age):
    if age is None:
        return "Unknown"
    if age < 18:
        return "< 18"
    elif 18 <= age <= 25:
        return "18-25"
    elif 26 <= age <= 35:
        return "26-35"
    elif 36 <= age <= 45:
        return "36-45"
    elif 46 <= age <= 55:
        return "46-55"
    elif 56 <= age <= 65:
        return "56-65"
    else:
        return "66+"

def load_json_data(filepath):
    """Loads JSON data from a file, handling potential encoding errors."""
    if not os.path.exists(filepath):
        print(f"Error: File not found at {filepath}")
        return []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return []

def main():
    print("Starting Neighborhood Demographics Analysis...")

    # 1. Load Data
    users_data = load_json_data(USERS_FILE_PATH)
    addresses_data = load_json_data(ADDRESS_FILE_PATH)

    print(f"Loaded {len(users_data)} users and {len(addresses_data)} addresses.")

    # 2. Process Users (Create a lookup by email)
    # Storing (age)
    user_lookup = {}
    for user in users_data:
        email = user.get('email')
        if not email:
            continue
            
        # Parse 'Data de Nascimento'. The field might be named differently depending on specific schema
        # but based on prompt it is 'Data de Nascimento'.
        # However, in JSON exports keys are often keys. Let's look for likely candidates.
        # User snippet showed 'Data de Nascimento'.
        
        birth_date_val = user.get('Data de Nascimento')
        # If the key is actually in a different format (like 'birthDate' or snake_case), we might miss it.
        # But we'll trust the verified plan info for now.
        
        age = calculate_age(birth_date_val)
        user_lookup[email] = {'age': age}

    # 3. Join Addresses with Users an Group by Bairro
    neighborhood_stats = defaultdict(list) # neighborhood -> list of ages
    
    # Track unique users per neighborhood to avoid double counting if a user accepts logic 
    # (Plan said: 'prioritize... otherwise first encountered'. 
    # To strictly follow 'client count', we should ensure 1 user counts once per neighborhood 
    # or globally? usually demographics are resident-based, so 1 user = 1 location.
    # We will use a set of processed_emails to ensure 1:1 user-to-demographic mapping if we want to be strict,
    # or just mapping addresses to users. 
    # The plan says: "If a user has multiple addresses... prioritize... Otherwise, the first encountered address".
    # This implies 1 Address per User is the goal for the stats.
    
    # Let's map User -> Bairro first.
    user_to_bairro = {}
    
    # We iterate addresses. If we haven't seen this user yet, we assign them this bairro.
    # (Checking for 'standard' flag could happen here if we knew the key, skipping for now as discussed)
    
    for addr in addresses_data:
        user_email = addr.get('user')
        bairro = addr.get('bairro')
        
        if not user_email or not bairro:
            continue
            
        # Normalization
        bairro = bairro.strip().title() # Capitalize nicely
        
        # If user not already assigned a location, assign this one
        # (This implements "first encountered" logic effectively for now)
        if user_email not in user_to_bairro:
            user_to_bairro[user_email] = bairro

    # 4. Aggregation
    unknown_users_count = 0 
    
    for email, bairro in user_to_bairro.items():
        if email in user_lookup:
            age = user_lookup[email]['age']
            neighborhood_stats[bairro].append(age)
        else:
            # User in address file but not in user file? (Orphaned address technically, but we are iterating linked map)
            # We count them for volume, but age is None
            neighborhood_stats[bairro].append(None)

    # 5. Calculate Metrics
    results = []
    
    for bairro, ages in neighborhood_stats.items():
        total_clients = len(ages)
        valid_ages = [a for a in ages if a is not None]
        
        if valid_ages:
            avg_age = sum(valid_ages) / len(valid_ages)
            
            # Calculate Top Age Group
            age_groups = [get_age_group(a) for a in valid_ages]
            from collections import Counter
            most_common_group = Counter(age_groups).most_common(1)[0][0]
        else:
            avg_age = 0
            most_common_group = "N/A"
            
        results.append({
            'bairro': bairro,
            'count': total_clients,
            'avg_age': avg_age,
            'top_group': most_common_group
        })

    # Sort by count descending
    results.sort(key=lambda x: x['count'], reverse=True)

    # 6. Generate Report
    with open(OUTPUT_REPORT_PATH, 'w', encoding='utf-8') as f:
        f.write("# Relatório Demográfico por Bairro - Levee Hortiplus\n\n")
        f.write(f"**Data de Geração:** {datetime.now().strftime('%d/%m/%Y %H:%M')}\n\n")
        f.write(f"**Total de Bairros Analisados:** {len(results)}\n")
        f.write(f"**Total de Clientes Mapeados:** {len(user_to_bairro)}\n\n")
        
        f.write("| Rank | Bairro | Qtd. Clientes | Média de Idade | Faixa Etária Principal |\n")
        f.write("|---|---|---|---|---|\n")
        
        for i, row in enumerate(results, 1):
            f.write(f"| {i} | {row['bairro']} | {row['count']} | {row['avg_age']:.1f} | {row['top_group']} |\n")

    print(f"Report generated successfully at: {OUTPUT_REPORT_PATH}")

if __name__ == "__main__":
    main()
