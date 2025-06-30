from src.models.user import db
from datetime import datetime
import json

class Contract(db.Model):
    __tablename__ = 'contracts'
    
    id = db.Column(db.Integer, primary_key=True)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_type = db.Column(db.String(10), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)
    
    # Processing status
    status = db.Column(db.String(20), default='processing')  # processing, completed, error
    
    # Extracted content
    extracted_text = db.Column(db.Text)
    contract_type = db.Column(db.String(50))  # financing, rental, insurance, unknown
    extracted_data_json = db.Column(db.Text)  # JSON string of extracted data
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Contract {self.id}: {self.original_filename}>'
    
    def set_extracted_data(self, data):
        """Set extracted data as JSON string"""
        self.extracted_data_json = json.dumps(data, ensure_ascii=False)
    
    def get_extracted_data(self):
        """Get extracted data as Python object"""
        if self.extracted_data_json:
            try:
                return json.loads(self.extracted_data_json)
            except json.JSONDecodeError:
                return {}
        return {}
    
    def to_dict(self):
        """Convert contract to dictionary for API responses"""
        return {
            'id': self.id,
            'original_filename': self.original_filename,
            'file_type': self.file_type,
            'file_size': self.file_size,
            'status': self.status,
            'contract_type': self.contract_type,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

