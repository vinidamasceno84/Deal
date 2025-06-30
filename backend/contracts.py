import os
import uuid
import threading
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from src.models.user import db
from src.models.contract import Contract
from src.services.document_processor import DocumentProcessor

contracts_bp = Blueprint('contracts', __name__)

# Initialize document processor
doc_processor = DocumentProcessor()

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'jpg', 'jpeg', 'png', 'tiff', 'bmp', 'txt'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_type(filename):
    """Get file extension"""
    return filename.rsplit('.', 1)[1].lower()

def process_contract_async(contract_id, app):
    """Process contract in background thread"""
    with app.app_context():
        try:
            contract = Contract.query.get(contract_id)
            if not contract:
                return
            
            # Process the document
            extracted_text, contract_type, extracted_data = doc_processor.process_document(
                contract.file_path, 
                contract.file_type
            )
            
            # Update contract in database
            contract.extracted_text = extracted_text
            contract.contract_type = contract_type
            contract.set_extracted_data(extracted_data)
            contract.status = 'completed' if extracted_text else 'error'
            
            db.session.commit()
            
            print(f"Contract {contract_id} processed successfully. Type: {contract_type}")
            
        except Exception as e:
            print(f"Error processing contract {contract_id}: {str(e)}")
            # Update contract status to error
            try:
                contract = Contract.query.get(contract_id)
                if contract:
                    contract.status = 'error'
                    db.session.commit()
            except:
                pass

@contracts_bp.route('/contracts/upload', methods=['POST'])
def upload_contract():
    """Upload a contract file for processing"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Create uploads directory if it doesn't exist
        upload_folder = current_app.config.get('UPLOAD_FOLDER', 
                                               os.path.join(os.path.dirname(__file__), '..', 'uploads'))
        os.makedirs(upload_folder, exist_ok=True)
        
        # Generate unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(upload_folder, unique_filename)
        
        # Save file
        file.save(file_path)
        
        # Create contract record in database
        contract = Contract(
            original_filename=filename,
            file_path=file_path,
            file_type=get_file_type(filename),
            file_size=os.path.getsize(file_path),
            status='processing'
        )
        
        db.session.add(contract)
        db.session.commit()
        
        # Start background processing
        thread = threading.Thread(
            target=process_contract_async, 
            args=(contract.id, current_app._get_current_object())
        )
        thread.daemon = True
        thread.start()
        
        return jsonify({
            'message': 'File uploaded successfully',
            'contract_id': contract.id,
            'status': 'processing'
        }), 201
        
    except Exception as e:
        print(f"Error uploading file: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@contracts_bp.route('/contracts', methods=['GET'])
def get_contracts():
    """Get list of all contracts"""
    try:
        contracts = Contract.query.order_by(Contract.created_at.desc()).all()
        return jsonify([contract.to_dict() for contract in contracts])
    except Exception as e:
        print(f"Error getting contracts: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@contracts_bp.route('/contracts/<int:contract_id>', methods=['GET'])
def get_contract(contract_id):
    """Get specific contract details"""
    try:
        contract = Contract.query.get_or_404(contract_id)
        return jsonify(contract.to_dict())
    except Exception as e:
        print(f"Error getting contract {contract_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@contracts_bp.route('/contracts/<int:contract_id>/data', methods=['GET'])
def get_contract_data(contract_id):
    """Get extracted data from a specific contract"""
    try:
        contract = Contract.query.get_or_404(contract_id)
        
        response_data = {
            'id': contract.id,
            'status': contract.status,
            'contract_type': contract.contract_type,
            'extracted_data': contract.get_extracted_data()
        }
        
        return jsonify(response_data)
    except Exception as e:
        print(f"Error getting contract data {contract_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@contracts_bp.route('/contracts/<int:contract_id>/status', methods=['GET'])
def get_contract_status(contract_id):
    """Get processing status of a specific contract"""
    try:
        contract = Contract.query.get_or_404(contract_id)
        return jsonify({
            'id': contract.id,
            'status': contract.status,
            'contract_type': contract.contract_type
        })
    except Exception as e:
        print(f"Error getting contract status {contract_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@contracts_bp.route('/contracts/stats', methods=['GET'])
def get_contracts_stats():
    """Get statistics about contracts"""
    try:
        total_contracts = Contract.query.count()
        completed_contracts = Contract.query.filter_by(status='completed').count()
        processing_contracts = Contract.query.filter_by(status='processing').count()
        error_contracts = Contract.query.filter_by(status='error').count()
        
        # Count by contract type
        financing_count = Contract.query.filter_by(contract_type='financing').count()
        rental_count = Contract.query.filter_by(contract_type='rental').count()
        insurance_count = Contract.query.filter_by(contract_type='insurance').count()
        
        return jsonify({
            'total_contracts': total_contracts,
            'completed_contracts': completed_contracts,
            'processing_contracts': processing_contracts,
            'error_contracts': error_contracts,
            'contract_types': {
                'financing': financing_count,
                'rental': rental_count,
                'insurance': insurance_count
            }
        })
    except Exception as e:
        print(f"Error getting contract stats: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

