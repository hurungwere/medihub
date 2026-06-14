import json
import os
import uuid
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# -------------------------------------------------------------------------
#  Persistent JSON "Database"
# -------------------------------------------------------------------------
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data.json')

SEED_DATA = {
    "users": [
        {"id": 1, "email": "admin@medihub.com", "name": "Super Admin", "organization": "MediHub HQ", "orgType": "admin", "createdAt": "2026-01-01T00:00:00"},
        {"id": 2, "email": "sarah@citygeneral.com", "name": "Dr. Sarah Mitchell", "organization": "City General Hospital", "orgType": "clinic", "createdAt": "2026-01-15T09:30:00"},
        {"id": 3, "email": "john@medicacorp.com", "name": "John Doe", "organization": "MedicaCorp Industries", "orgType": "supplier", "createdAt": "2026-01-20T14:15:00"},
        {"id": 4, "email": "clara@metrohealth.com", "name": "Dr. Clara Oswald", "organization": "Metro Health Clinic", "orgType": "clinic", "createdAt": "2026-02-10T11:00:00"},
        {"id": 5, "email": "alex@globalhealth.com", "name": "Alex Mercer", "organization": "Global Health Distributors", "orgType": "supplier", "createdAt": "2026-02-15T16:45:00"}
    ],
    "tenders": [
        {"id": "TND-089", "title": "Defibrillator Replacement Parts", "facility": "City General Hospital", "category": "Medical Equipment", "status": "Active", "bids": 12, "deadline": "2026-06-20", "quantity": "20 units", "budget": "$8,200", "createdAt": "2026-05-01T10:00:00"},
        {"id": "TND-088", "title": "Surgical Gloves (Latex-Free)", "facility": "Metro Health Clinic", "category": "Consumables", "status": "Reviewing", "bids": 45, "deadline": "2026-06-10", "quantity": "10,000 boxes", "budget": "$18,500", "createdAt": "2026-05-02T10:00:00"},
        {"id": "TND-087", "title": "MRI Contrast Agents", "facility": "Northside Cardiology", "category": "Pharmaceuticals", "status": "Active", "bids": 8, "deadline": "2026-06-25", "quantity": "500 units", "budget": "$25,000", "createdAt": "2026-05-03T10:00:00"},
        {"id": "TND-086", "title": "N95 Respirator Masks", "facility": "Kaiser Permanente", "category": "Consumables", "status": "Closed", "bids": 62, "deadline": "2026-06-01", "quantity": "50,000 units", "budget": "$45,000", "createdAt": "2026-05-04T10:00:00"},
        {"id": "TND-085", "title": "ICU Patient Monitor", "facility": "St. Mary Hospital", "category": "Medical Equipment", "status": "Active", "bids": 9, "deadline": "2026-07-01", "quantity": "5 units", "budget": "$96,000", "createdAt": "2026-05-05T10:00:00"},
        {"id": "TND-084", "title": "Anaesthetic Agents Bundle", "facility": "Central Clinic", "category": "Pharmaceuticals", "status": "Active", "bids": 2, "deadline": "2026-06-20", "quantity": "100 units", "budget": "$67,000", "createdAt": "2026-05-06T10:00:00"}
    ],
    "suppliers": [
        {"id": 1, "name": "MedicaCorp Industries", "type": "Manufacturer", "location": "Frankfurt, Germany", "rating": 4.9, "specialties": ["Surgical Instruments", "Orthopedics"], "verified": True},
        {"id": 2, "name": "Global Health Distributors", "type": "Distributor", "location": "New York, USA", "rating": 4.8, "specialties": ["Pharmaceuticals", "Consumables"], "verified": True},
        {"id": 3, "name": "Precision Imaging Ltd", "type": "Manufacturer", "location": "Tokyo, Japan", "rating": 5.0, "specialties": ["MRI Systems", "X-Ray"], "verified": True},
        {"id": 4, "name": "Apex Medical Supplies", "type": "Distributor", "location": "London, UK", "rating": 4.7, "specialties": ["PPE", "General Medical"], "verified": True},
        {"id": 5, "name": "BioTech Synthetics", "type": "Manufacturer", "location": "Boston, USA", "rating": 4.9, "specialties": ["Implants", "Biologics"], "verified": True},
        {"id": 6, "name": "MedHub Logistics", "type": "Distributor", "location": "Dubai, UAE", "rating": 4.6, "specialties": ["Cold Chain", "Vaccines"], "verified": True}
    ],
    "clinics": [
        {"id": 1, "name": "City General Hospital", "location": "Berlin, Germany", "tendersCount": 5, "joinedDate": "2026-01-15", "status": "Verified"},
        {"id": 2, "name": "Metro Health Clinic", "location": "Munich, Germany", "tendersCount": 3, "joinedDate": "2026-02-10", "status": "Verified"},
        {"id": 3, "name": "Northside Cardiology", "location": "Hamburg, Germany", "tendersCount": 4, "joinedDate": "2026-03-01", "status": "Verified"},
        {"id": 4, "name": "Kaiser Permanente", "location": "California, USA", "tendersCount": 8, "joinedDate": "2026-01-20", "status": "Verified"},
        {"id": 5, "name": "St. Mary Hospital", "location": "London, UK", "tendersCount": 2, "joinedDate": "2026-04-12", "status": "Verified"},
        {"id": 6, "name": "Central Clinic", "location": "Paris, France", "tendersCount": 1, "joinedDate": "2026-05-05", "status": "Pending"}
    ],
    "categories": [
        {"id": 1, "name": "Pharmaceuticals", "description": "Medicines, vaccines, and chemical agents", "tendersCount": 12, "status": "Active"},
        {"id": 2, "name": "Medical Equipment", "description": "MRI, ICU monitors, and diagnostic machinery", "tendersCount": 8, "status": "Active"},
        {"id": 3, "name": "Consumables", "description": "Gloves, masks, syringes, and daily disposables", "tendersCount": 15, "status": "Active"},
        {"id": 4, "name": "Lab Supplies", "description": "Reagents, test tubes, microscopes, and pipettes", "tendersCount": 4, "status": "Active"},
        {"id": 5, "name": "Laboratory", "description": "General laboratory accessories, equipment, and calibration services", "tendersCount": 6, "status": "Active"},
        {"id": 6, "name": "IT/Healthcare Tech", "description": "EHR systems, telemedicine platforms, and medical software licenses", "tendersCount": 3, "status": "Active"},
        {"id": 7, "name": "PPE", "description": "Personal protective equipment, gowns, shields, and respirators", "tendersCount": 9, "status": "Active"},
        {"id": 8, "name": "Diagnostics", "description": "Diagnostic kits, reagents, rapid tests, and imaging accessories", "tendersCount": 5, "status": "Active"},
        {"id": 9, "name": "Surgical Instruments", "description": "Scalpels, clamps, retractors, and sterile surgery kits", "tendersCount": 2, "status": "Active"},
        {"id": 10, "name": "Imaging & Radiology", "description": "X-ray plates, MRI components, ultrasound probes, and accessories", "tendersCount": 1, "status": "Active"}
    ],
    "verifications": [
        {"id": 1, "name": "SurgePath Distributors", "type": "Supplier", "submitted": "2 hours ago", "docs": 3, "risk": "Low", "status": "Pending"},
        {"id": 2, "name": "LifeChem Labs", "type": "Supplier", "submitted": "5 hours ago", "docs": 4, "risk": "Medium", "status": "Pending"},
        {"id": 3, "name": "Royal Care Pharmacy", "type": "Clinic", "submitted": "1 day ago", "docs": 2, "risk": "Low", "status": "Pending"},
        {"id": 4, "name": "MedGlobal Corp.", "type": "Supplier", "submitted": "2 days ago", "docs": 5, "risk": "Low", "status": "Approved"},
        {"id": 5, "name": "Sunrise Hospital", "type": "Clinic", "submitted": "3 days ago", "docs": 3, "risk": "Low", "status": "Approved"}
    ],
    "settings": {
        "platformName": "MediHub",
        "maintenanceMode": False,
        "allowRegistrations": True,
        "requireVerification": True,
        "commissionRate": "2.5%",
        "supportEmail": "support@medihub.com",
        "clinicProPrice": "$99",
        "supplierStandardPrice": "$149"
    }
}

def load_data():
    if not os.path.exists(DATA_FILE):
        # Hash passwords for seeded users
        for u in SEED_DATA["users"]:
            if "password" not in u:
                pwd = "admin123" if u["email"] == "admin@medihub.com" else "password"
                u["password"] = generate_password_hash(pwd)
        save_data(SEED_DATA)
        return SEED_DATA
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
        # Ensure all collections exist in case migrating an older data.json
        updated = False
        for key in SEED_DATA:
            if key not in data:
                data[key] = SEED_DATA[key]
                updated = True
        
        # Ensure default categories are populated
        existing_cat_names = {c['name'] for c in data.get('categories', [])}
        for seed_c in SEED_DATA['categories']:
            if seed_c['name'] not in existing_cat_names:
                if 'categories' not in data:
                    data['categories'] = []
                max_id = max((c['id'] for c in data['categories']), default=0) + 1
                new_c = seed_c.copy()
                new_c['id'] = max_id
                data['categories'].append(new_c)
                existing_cat_names.add(new_c['name'])
                updated = True

        if updated:
            save_data(data)
        return data

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# -------------------------------------------------------------------------
#  Health Check
# -------------------------------------------------------------------------
@app.route('/api/health', methods=['GET'])
def health():
    data = load_data()
    return jsonify({
        'status': 'ok',
        'db': 'json-file',
        'users': len(data['users']),
        'tenders': len(data['tenders']),
        'suppliers': len(data['suppliers'])
    })

# -------------------------------------------------------------------------
#  User Authentication Endpoints
# -------------------------------------------------------------------------
@app.route('/api/auth/register', methods=['POST'])
def register():
    data_store = load_data()
    req = request.get_json() or {}
    email = req.get('email')
    password = req.get('password')
    name = req.get('name')
    org = req.get('org')
    org_type = req.get('orgType')

    if not email or not password:
        return jsonify({'success': False, 'error': 'Email and password are required'}), 400

    if any(u['email'] == email for u in data_store['users']):
        return jsonify({'success': False, 'error': 'Email already exists'}), 409

    user_id = len(data_store['users']) + 1
    new_user = {
        'id': user_id,
        'email': email,
        'password': generate_password_hash(password),
        'name': name,
        'organization': org,
        'orgType': org_type,
        'createdAt': datetime.utcnow().isoformat()
    }
    data_store['users'].append(new_user)
    save_data(data_store)
    return jsonify({'success': True, 'userId': user_id}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data_store = load_data()
    req = request.get_json() or {}
    email = req.get('email')
    password = req.get('password')

    if not email or not password:
        return jsonify({'success': False, 'error': 'Email and password are required'}), 400

    user = next((u for u in data_store['users'] if u['email'] == email), None)
    if not user:
        return jsonify({'success': False, 'error': 'Invalid email or password'}), 401

    if check_password_hash(user['password'], password):
        safe_user = {k: v for k, v in user.items() if k != 'password'}
        return jsonify({'success': True, 'user': safe_user})
    return jsonify({'success': False, 'error': 'Invalid email or password'}), 401

# -------------------------------------------------------------------------
#  Tenders Endpoints
# -------------------------------------------------------------------------
@app.route('/api/tenders', methods=['GET'])
def get_tenders():
    data_store = load_data()
    sorted_tenders = sorted(data_store['tenders'], key=lambda x: x.get('createdAt', ''), reverse=True)
    return jsonify(sorted_tenders)

@app.route('/api/tenders', methods=['POST'])
def add_tender():
    data_store = load_data()
    req = request.get_json() or {}
    tender_id = req.get('id') or f"TND-{str(uuid.uuid4())[:6].upper()}"

    if any(t['id'] == tender_id for t in data_store['tenders']):
        return jsonify({'success': False, 'error': 'Tender ID already exists'}), 409

    new_tender = {
        'id': tender_id,
        'title': req.get('title', ''),
        'facility': req.get('facility', ''),
        'category': req.get('category', ''),
        'status': req.get('status', 'Active'),
        'bids': req.get('bids', 0),
        'deadline': req.get('deadline'),
        'quantity': req.get('quantity'),
        'budget': req.get('budget'),
        'createdAt': datetime.utcnow().isoformat()
    }
    data_store['tenders'].append(new_tender)
    save_data(data_store)
    return jsonify({'success': True, 'id': tender_id}), 201

@app.route('/api/tenders/<tender_id>', methods=['GET'])
def get_tender(tender_id):
    data_store = load_data()
    tender = next((t for t in data_store['tenders'] if t['id'] == tender_id), None)
    if not tender:
        return jsonify({'success': False, 'error': 'Tender not found'}), 404
    return jsonify(tender)

@app.route('/api/tenders/<tender_id>', methods=['PUT'])
def update_tender(tender_id):
    data_store = load_data()
    req = request.get_json() or {}
    for i, t in enumerate(data_store['tenders']):
        if t['id'] == tender_id:
            for key in ['title', 'facility', 'category', 'status', 'bids', 'deadline', 'quantity', 'budget']:
                if key in req:
                    data_store['tenders'][i][key] = req[key]
            save_data(data_store)
            return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Tender not found'}), 404

@app.route('/api/tenders/<tender_id>', methods=['DELETE'])
def delete_tender(tender_id):
    data_store = load_data()
    original_len = len(data_store['tenders'])
    data_store['tenders'] = [t for t in data_store['tenders'] if t['id'] != tender_id]
    if len(data_store['tenders']) == original_len:
        return jsonify({'success': False, 'error': 'Tender not found'}), 404
    save_data(data_store)
    return jsonify({'success': True})

# -------------------------------------------------------------------------
#  Suppliers Endpoints
# -------------------------------------------------------------------------
@app.route('/api/suppliers', methods=['GET'])
def get_suppliers():
    data_store = load_data()
    return jsonify(data_store['suppliers'])

@app.route('/api/suppliers', methods=['POST'])
def add_supplier():
    data_store = load_data()
    req = request.get_json() or {}
    new_id = max((s['id'] for s in data_store['suppliers']), default=0) + 1
    new_supplier = {
        'id': new_id,
        'name': req.get('name', ''),
        'type': req.get('type', ''),
        'location': req.get('location', ''),
        'rating': req.get('rating'),
        'specialties': req.get('specialties', []),
        'verified': req.get('verified', True)
    }
    data_store['suppliers'].append(new_supplier)
    save_data(data_store)
    return jsonify({'success': True, 'id': new_id}), 201

@app.route('/api/suppliers/<int:supplier_id>', methods=['PUT'])
def update_supplier(supplier_id):
    data_store = load_data()
    req = request.get_json() or {}
    for i, s in enumerate(data_store['suppliers']):
        if s['id'] == supplier_id:
            for key in ['name', 'type', 'location', 'rating', 'specialties', 'verified']:
                if key in req:
                    data_store['suppliers'][i][key] = req[key]
            save_data(data_store)
            return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Supplier not found'}), 404

@app.route('/api/suppliers/<int:supplier_id>', methods=['DELETE'])
def delete_supplier(supplier_id):
    data_store = load_data()
    original_len = len(data_store['suppliers'])
    data_store['suppliers'] = [s for s in data_store['suppliers'] if s['id'] != supplier_id]
    if len(data_store['suppliers']) == original_len:
        return jsonify({'success': False, 'error': 'Supplier not found'}), 404
    save_data(data_store)
    return jsonify({'success': True, 'id': new_id}), 201

# -------------------------------------------------------------------------
#  Users Endpoints
# -------------------------------------------------------------------------
@app.route('/api/users', methods=['GET'])
def get_users():
    data_store = load_data()
    safe_users = [{k: v for k, v in u.items() if k != 'password'} for u in data_store['users']]
    return jsonify(safe_users)

@app.route('/api/users', methods=['POST'])
def add_user():
    data_store = load_data()
    req = request.get_json() or {}
    email = req.get('email')
    password = req.get('password')
    if not email or not password:
        return jsonify({'success': False, 'error': 'Email and password are required'}), 400
    if any(u['email'] == email for u in data_store['users']):
        return jsonify({'success': False, 'error': 'Email already exists'}), 409
    
    new_id = max((u['id'] for u in data_store['users']), default=0) + 1
    new_user = {
        'id': new_id,
        'email': email,
        'password': generate_password_hash(password),
        'name': req.get('name', ''),
        'organization': req.get('organization', ''),
        'orgType': req.get('orgType', 'clinic'),
        'createdAt': datetime.utcnow().isoformat()
    }
    data_store['users'].append(new_user)
    save_data(data_store)
    return jsonify({'success': True, 'id': new_id}), 201

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data_store = load_data()
    req = request.get_json() or {}
    for i, u in enumerate(data_store['users']):
        if u['id'] == user_id:
            for key in ['name', 'organization', 'orgType', 'email']:
                if key in req:
                    data_store['users'][i][key] = req[key]
            if 'password' in req and req['password']:
                data_store['users'][i]['password'] = generate_password_hash(req['password'])
            save_data(data_store)
            return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'User not found'}), 404

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    data_store = load_data()
    original_len = len(data_store['users'])
    data_store['users'] = [u for u in data_store['users'] if u['id'] != user_id]
    if len(data_store['users']) == original_len:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    save_data(data_store)
    return jsonify({'success': True})

# -------------------------------------------------------------------------
#  Clinics Endpoints
# -------------------------------------------------------------------------
@app.route('/api/clinics', methods=['GET'])
def get_clinics():
    data_store = load_data()
    return jsonify(data_store['clinics'])

@app.route('/api/clinics', methods=['POST'])
def add_clinic():
    data_store = load_data()
    req = request.get_json() or {}
    new_id = max((c['id'] for c in data_store['clinics']), default=0) + 1
    new_clinic = {
        'id': new_id,
        'name': req.get('name', ''),
        'location': req.get('location', ''),
        'tendersCount': req.get('tendersCount', 0),
        'joinedDate': req.get('joinedDate') or datetime.utcnow().strftime('%Y-%m-%d'),
        'status': req.get('status', 'Verified')
    }
    data_store['clinics'].append(new_clinic)
    save_data(data_store)
    return jsonify({'success': True, 'id': new_id}), 201

@app.route('/api/clinics/<int:clinic_id>', methods=['PUT'])
def update_clinic(clinic_id):
    data_store = load_data()
    req = request.get_json() or {}
    for i, c in enumerate(data_store['clinics']):
        if c['id'] == clinic_id:
            for key in ['name', 'location', 'tendersCount', 'status']:
                if key in req:
                    data_store['clinics'][i][key] = req[key]
            save_data(data_store)
            return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Clinic not found'}), 404

@app.route('/api/clinics/<int:clinic_id>', methods=['DELETE'])
def delete_clinic(clinic_id):
    data_store = load_data()
    original_len = len(data_store['clinics'])
    data_store['clinics'] = [c for c in data_store['clinics'] if c['id'] != clinic_id]
    if len(data_store['clinics']) == original_len:
        return jsonify({'success': False, 'error': 'Clinic not found'}), 404
    save_data(data_store)
    return jsonify({'success': True})

# -------------------------------------------------------------------------
#  Categories Endpoints
# -------------------------------------------------------------------------
@app.route('/api/categories', methods=['GET'])
def get_categories():
    data_store = load_data()
    return jsonify(data_store['categories'])

@app.route('/api/categories', methods=['POST'])
def add_category():
    data_store = load_data()
    req = request.get_json() or {}
    new_id = max((c['id'] for c in data_store['categories']), default=0) + 1
    new_cat = {
        'id': new_id,
        'name': req.get('name', ''),
        'description': req.get('description', ''),
        'tendersCount': req.get('tendersCount', 0),
        'status': req.get('status', 'Active')
    }
    data_store['categories'].append(new_cat)
    save_data(data_store)
    return jsonify({'success': True, 'id': new_id}), 201

@app.route('/api/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    data_store = load_data()
    req = request.get_json() or {}
    for i, c in enumerate(data_store['categories']):
        if c['id'] == category_id:
            for key in ['name', 'description', 'tendersCount', 'status']:
                if key in req:
                    data_store['categories'][i][key] = req[key]
            save_data(data_store)
            return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Category not found'}), 404

@app.route('/api/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    data_store = load_data()
    original_len = len(data_store['categories'])
    data_store['categories'] = [c for c in data_store['categories'] if c['id'] != category_id]
    if len(data_store['categories']) == original_len:
        return jsonify({'success': False, 'error': 'Category not found'}), 404
    save_data(data_store)
    return jsonify({'success': True})

# -------------------------------------------------------------------------
#  Verifications Endpoints
# -------------------------------------------------------------------------
@app.route('/api/verifications', methods=['GET'])
def get_verifications():
    data_store = load_data()
    return jsonify(data_store['verifications'])

@app.route('/api/verifications/<int:verification_id>', methods=['PUT'])
def update_verification(verification_id):
    data_store = load_data()
    req = request.get_json() or {}
    for i, v in enumerate(data_store['verifications']):
        if v['id'] == verification_id:
            if 'status' in req:
                data_store['verifications'][i]['status'] = req['status']
                # If verified, we can also update their verified status in suppliers/clinics if matching
                name = v['name']
                v_type = v['type']
                if req['status'] == 'Approved':
                    if v_type == 'Supplier':
                        for j, s in enumerate(data_store['suppliers']):
                            if s['name'] == name:
                                data_store['suppliers'][j]['verified'] = True
                    elif v_type == 'Clinic':
                        for j, c in enumerate(data_store['clinics']):
                            if c['name'] == name:
                                data_store['clinics'][j]['status'] = 'Verified'
            save_data(data_store)
            return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Verification not found'}), 404

# -------------------------------------------------------------------------
#  Settings Endpoints
# -------------------------------------------------------------------------
@app.route('/api/settings', methods=['GET'])
def get_settings():
    data_store = load_data()
    return jsonify(data_store.get('settings', {}))

@app.route('/api/settings', methods=['PUT'])
def update_settings():
    data_store = load_data()
    req = request.get_json() or {}
    if 'settings' not in data_store:
        data_store['settings'] = {}
    for key in ['platformName', 'maintenanceMode', 'allowRegistrations', 'requireVerification', 'commissionRate', 'supportEmail', 'clinicProPrice', 'supplierStandardPrice']:
        if key in req:
            data_store['settings'][key] = req[key]
    save_data(data_store)
    return jsonify({'success': True})

# -------------------------------------------------------------------------
#  Reports Endpoints
# -------------------------------------------------------------------------
@app.route('/api/reports', methods=['GET'])
def get_reports():
    data_store = load_data()
    # Let's count some stats
    total_users = len(data_store['users'])
    total_tenders = len(data_store['tenders'])
    total_suppliers = len(data_store['suppliers'])
    total_clinics = len(data_store['clinics'])
    active_tenders = len([t for t in data_store['tenders'] if t.get('status') == 'Active'])
    
    # Simple monthly distribution mockup
    reports = {
        'stats': {
            'totalUsers': total_users,
            'totalTenders': total_tenders,
            'totalSuppliers': total_suppliers,
            'totalClinics': total_clinics,
            'activeTenders': active_tenders,
            'revenueEstimate': '$128,450',
            'bidsSubmitted': 8491
        },
        'userGrowth': [120, 145, 132, 178, 156, 201, 189, 224, 243, 218, 267, total_users * 15 + 2000],
        'recentActivity': [
            {'action': 'New tender posted', 'detail': 'TND-089 — Defibrillator x4', 'time': '3 min ago', 'type': 'tender'},
            {'action': 'Supplier verified', 'detail': 'MedGlobal Corp. — Verified', 'time': '12 min ago', 'type': 'verify'},
            {'action': 'Bid awarded', 'detail': 'TND-076 won by PharmaDist', 'time': '28 min ago', 'type': 'award'}
        ]
    }
    return jsonify(reports)

# -------------------------------------------------------------------------
#  File Upload Endpoints
# -------------------------------------------------------------------------
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400

    filename = file.filename
    from werkzeug.utils import secure_filename
    filename = secure_filename(filename)
    
    # Prepend unique timestamp
    filename = f"{int(datetime.utcnow().timestamp())}_{filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    return jsonify({
        'success': True, 
        'url': f'/uploads/{filename}'
    }), 200

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    from flask import send_from_directory
    return send_from_directory(UPLOAD_FOLDER, filename)

# -------------------------------------------------------------------------
#  Main Entrypoint
# -------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
