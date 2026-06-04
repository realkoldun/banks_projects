import openpyxl
import json
import re

wb = openpyxl.load_workbook('110.xlsx')
ws = wb.active

BANK_MAP = {
    'Белинвестбанк': 'belinvestbank',
    'Беларусьбанк': 'belarusbank',
    'Приорбанк': 'priorbank',
    'АльфаБанк': 'alfa-bank',
    'Белагропромбанк': 'belagroprombank',
    'БелВЭБ': 'bank-belveb',
    'МТБанк': 'mtbank',
    'СберБанк': 'sberbank',
}

TYPE_MAP = {
    'Потребительский': 'consumer',
    'Авто': 'auto',
    'Жильё': 'mortgage',
}

# Продукты которые нужно исключить (овердрафты)
EXCLUDED_NAMES = [
    'овердрафт',
    'хуткі',
    'альфа овердрафт',
]

def parse_term(s):
    """Парсит строку типа 'до 5 лет', 'до 20 лет' -> months"""
    if not s:
        return 60
    s = str(s).strip().lower()
    m = re.search(r'(\d+[.,]?\d*)', s)
    if not m:
        return 60
    num = float(m.group(1).replace(',', '.'))
    if 'год' in s or 'лет' in s:
        return int(num * 12)
    if 'мес' in s:
        return int(num)
    return int(num * 12)

def parse_amount(s, product_type='consumer'):
    """Парсит сумму из столбца 'Сумма (BYN)'"""
    if not s:
        # Если пусто — ставим разумный лимит по типу
        if product_type == 'mortgage':
            return 200000
        elif product_type == 'auto':
            return 50000
        else:
            return 50000
    s = str(s).strip()
    # Если содержит % — это не сумма, а ставка попала в столбец
    if '%' in s:
        if product_type == 'mortgage':
            return 200000
        elif product_type == 'auto':
            return 50000
        else:
            return 50000
    # Ищем число
    m = re.search(r'(\d[\d\s]*)', s)
    if not m:
        if product_type == 'mortgage':
            return 200000
        return 50000
    num = int(m.group(1).replace(' ', ''))
    if num < 1000:
        if product_type == 'mortgage':
            return 200000
        elif product_type == 'auto':
            return 50000
        else:
            return 50000
    return num

def parse_rate(s):
    """Парсит ставку '17.7' или 'индивидуально' -> float"""
    if not s:
        return 0
    s = str(s).strip().lower()
    if s in ['индивидуально', '—', '-', '']:
        return 0
    m = re.search(r'(\d+[.,]?\d*)', s)
    if not m:
        return 0
    return float(m.group(1).replace(',', '.'))

def parse_first_months(s):
    """Парсит '7.9% первые 3 мес.' -> {'rate': 7.9, 'months': 3} или None"""
    if not s:
        return None
    s = str(s).strip()
    if not s or s in ['-', '—']:
        return None
    m_rate = re.search(r'(\d+[.,]?\d*)\s*%', s)
    m_months = re.search(r'(\d+)\s*мес', s)
    if m_rate:
        return {
            'rate': float(m_rate.group(1).replace(',', '.')),
            'months': int(m_months.group(1)) if m_months else 0
        }
    return None

def parse_first_payment(s):
    """Парсит первый взнос 'от 25%', '10%' -> число (процент) или None"""
    if not s:
        return None
    s = str(s).strip()
    if not s or s in ['-', '—', 'необязателен']:
        return None
    m = re.search(r'(\d+[.,]?\d*)', s)
    if m:
        return float(m.group(1).replace(',', '.'))
    return None

def is_excluded(name):
    """Проверяет нужно ли исключить продукт"""
    name_lower = name.lower()
    for excl in EXCLUDED_NAMES:
        if excl in name_lower:
            return True
    return False

def sanitize_id(name):
    """Создаёт безопасный id из названия"""
    name = name.lower()
    name = name.replace('«', '').replace('»', '').replace('"', '').replace("'", '')
    name = name.replace(' ', '-').replace(',', '').replace('.', '')
    name = name.replace('(', '').replace(')', '').replace('/', '-')
    name = re.sub(r'[^a-zа-яё0-9\-]', '', name)
    name = re.sub(r'-+', '-', name).strip('-')
    return name[:60]

# Читаем данные
rows = list(ws.iter_rows(min_row=2, values_only=True))
products = []
used_ids = set()

for row in rows:
    if not row or not row[0]:
        continue
    num, bank_name, category, name, rate_str, first_months_str, amount_str, first_payment_str, term_str, special = row[:10]

    if not name or not bank_name:
        continue

    name = str(name).strip()
    if is_excluded(name):
        continue

    bank_id = BANK_MAP.get(str(bank_name).strip())
    if not bank_id:
        continue

    type_id = TYPE_MAP.get(str(category).strip()) if category else None
    if not type_id:
        continue

    rate = parse_rate(rate_str)
    first_months = parse_first_months(first_months_str)
    max_amount = parse_amount(amount_str, type_id)
    first_payment = parse_first_payment(first_payment_str)
    max_term = parse_term(term_str)
    special_terms = str(special).strip() if special else ''

    # Если ставка 0 (индивидуально), берём из first_months если есть
    if rate == 0 and first_months:
        rate = first_months.get('rate', 0)

    # Генерируем id
    base_id = f'{bank_id}-{sanitize_id(name)}'
    product_id = base_id
    counter = 1
    while product_id in used_ids:
        product_id = f'{base_id}-{counter}'
        counter += 1
    used_ids.add(product_id)

    product = {
        'id': product_id,
        'bankId': bank_id,
        'name': name,
        'type': type_id,
        'rate': rate if rate > 0 else 15.0,  # fallback
        'maxAmount': max_amount if max_amount > 1000 else 50000,
        'maxTerm': max_term,
    }

    if first_months:
        product['firstMonths'] = first_months
    if first_payment is not None:
        product['firstPayment'] = first_payment
    if special_terms:
        product['specialTerms'] = special_terms

    products.append(product)

# Выводим статистику
banks_in_data = set(p['bankId'] for p in products)
print(f"Всего продуктов: {len(products)}")
for b in sorted(banks_in_data):
    count = len([p for p in products if p['bankId'] == b])
    print(f"  {b}: {count}")
print(f"\nТипы:")
for t in sorted(set(p['type'] for p in products)):
    count = len([p for p in products if p['type'] == t])
    print(f"  {t}: {count}")

# Генерируем JS файл
js_lines = ['export const creditProducts = [']
for p in products:
    js_lines.append('  {')
    js_lines.append(f"    id: '{p['id']}',")
    js_lines.append(f"    bankId: '{p['bankId']}',")
    name_escaped = p['name'].replace("'", "\\'")
    js_lines.append(f"    name: '{name_escaped}',")
    js_lines.append(f"    type: '{p['type']}',")
    js_lines.append(f"    rate: {p['rate']},")
    js_lines.append(f"    maxAmount: {p['maxAmount']},")
    js_lines.append(f"    maxTerm: {p['maxTerm']},")
    if 'firstMonths' in p:
        js_lines.append(f"    firstMonths: {{ rate: {p['firstMonths']['rate']}, months: {p['firstMonths']['months']} }},")
    if 'firstPayment' in p:
        js_lines.append(f"    firstPayment: {p['firstPayment']},")
    if 'specialTerms' in p:
        terms_escaped = p['specialTerms'].replace("'", "\\'")
        js_lines.append(f"    specialTerms: '{terms_escaped}',")
    js_lines.append('  },')
js_lines.append(']')

js_content = '\n'.join(js_lines) + '\n'

with open('products_data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

# Генерируем JSON
json_output = []
for p in products:
    jp = {
        'id': p['id'],
        'bankId': p['bankId'],
        'name': p['name'],
        'type': p['type'],
        'rate': p['rate'],
        'maxAmount': p['maxAmount'],
        'maxTerm': p['maxTerm'],
    }
    if 'firstMonths' in p:
        jp['firstMonths'] = p['firstMonths']
    if 'firstPayment' in p:
        jp['firstPayment'] = p['firstPayment']
    if 'specialTerms' in p:
        jp['specialTerms'] = p['specialTerms']
    json_output.append(jp)

with open('products_data.json', 'w', encoding='utf-8') as f:
    json.dump(json_output, f, ensure_ascii=False, indent=2)

print("\nГотово!")
print("  - products_data.js")
print("  - products_data.json")