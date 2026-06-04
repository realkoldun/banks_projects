import json

# Читаем спарсенные данные
with open('bank-credits-app/public/api/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Генерируем banksData.js
banks_list = [
    {"id": "belinvestbank", "name": "Белинвестбанк", "logo": "🏭", "marketShare": 6.2, "physicalLoansShare": 7.3, "deaRank": 12, "totalCredits": 112000, "color": "#8b5cf6"},
    {"id": "belarusbank", "name": "Беларусбанк", "logo": "🏦", "marketShare": 45.6, "physicalLoansShare": 60.7, "deaRank": 22, "totalCredits": 765700, "color": "#3b82f6"},
    {"id": "priorbank", "name": "Приорбанк", "logo": "⭐", "marketShare": 5.8, "physicalLoansShare": 6.1, "deaRank": 6, "totalCredits": 98000, "color": "#f59e0b"},
    {"id": "alfa-bank", "name": "Альфа-банк", "logo": "🔴", "marketShare": 3.7, "physicalLoansShare": 4.9, "deaRank": 5, "totalCredits": 68000, "color": "#ef4444"},
    {"id": "belagroprombank", "name": "Белагропромбанк", "logo": "🌾", "marketShare": 12.3, "physicalLoansShare": 15.2, "deaRank": 21, "totalCredits": 245000, "color": "#10b981"},
    {"id": "bank-belveb", "name": "Банк БелВЭБ", "logo": "🌍", "marketShare": 4.9, "physicalLoansShare": 5.4, "deaRank": 10, "totalCredits": 87000, "color": "#06b6d4"},
    {"id": "mtbank", "name": "МТБанк", "logo": "📱", "marketShare": 3.2, "physicalLoansShare": 4.2, "deaRank": 3, "totalCredits": 58000, "color": "#ec4899"},
    {"id": "sberbank", "name": "Сбер Банк", "logo": "💚", "marketShare": 4.1, "physicalLoansShare": 5.8, "deaRank": 7, "totalCredits": 76000, "color": "#22c55e"},
]

def format_js_product(p):
    lines = ['  {']
    lines.append(f"    id: '{p['id']}',")
    lines.append(f"    bankId: '{p['bankId']}',")
    lines.append(f"    name: '{p['name']}',")
    lines.append(f"    type: '{p['type']}',")
    lines.append(f"    rate: {p['rate']},")
    lines.append(f"    maxAmount: {p['maxAmount']},")
    lines.append(f"    maxTerm: {p['maxTerm']},")
    if 'firstMonths' in p:
        fm = p['firstMonths']
        lines.append(f"    firstMonths: {{ rate: {fm['rate']}, months: {fm['months']} }},")
    if 'firstPayment' in p:
        lines.append(f"    firstPayment: {p['firstPayment']},")
    if 'specialTerms' in p:
        lines.append(f"    specialTerms: '{p['specialTerms']}',")
    lines.append('  },')
    return '\n'.join(lines)

def format_json_product(p):
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
    return jp

def format_bank(b):
    lines = ['  {']
    for k, v in b.items():
        if isinstance(v, str):
            lines.append(f"    {k}: '{v}',")
        else:
            lines.append(f"    {k}: {v},")
    lines.append('  },')
    return '\n'.join(lines)

# Генерируем banksData.js
js_lines = []
js_lines.append("export const banks = [")
for b in banks_list:
    js_lines.append(format_bank(b))
js_lines.append("]")
js_lines.append("")
js_lines.append("export const creditProducts = [")
for p in products:
    js_lines.append(format_js_product(p))
js_lines.append("]")
js_lines.append("")
js_lines.append("export const creditTypes = {")
js_lines.append("  consumer: 'Потребительский',")
js_lines.append("  auto: 'Автокредит',")
js_lines.append("  mortgage: 'Ипотечный'")
js_lines.append("}")
js_lines.append("")

with open('bank-credits-app/src/data/banksData.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(js_lines))
print("✅ bank-credits-app/src/data/banksData.js")

# Генерируем banks.js (такой же)
with open('bank-credits-app/src/data/banks.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(js_lines))
print("✅ bank-credits-app/src/data/banks.js")

# Генерируем public/api/products.json
products_json = [format_json_product(p) for p in products]
with open('bank-credits-app/public/api/products.json', 'w', encoding='utf-8') as f:
    json.dump(products_json, f, ensure_ascii=False, indent=2)
print("✅ bank-credits-app/public/api/products.json")

# Генерируем public/api/banks.json
with open('bank-credits-app/public/api/banks.json', 'w', encoding='utf-8') as f:
    json.dump(banks_list, f, ensure_ascii=False, indent=2)
print("✅ bank-credits-app/public/api/banks.json")

# Генерируем public/api/credit-types.json
credit_types = {
    "consumer": "Потребительский",
    "auto": "Автокредит",
    "mortgage": "Ипотечный"
}
with open('bank-credits-app/public/api/credit-types.json', 'w', encoding='utf-8') as f:
    json.dump(credit_types, f, ensure_ascii=False, indent=2)
print("✅ bank-credits-app/public/api/credit-types.json")

print(f"\nВсего продуктов: {len(products)}")
print(f"Всего банков: {len(banks_list)}")