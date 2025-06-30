import os
import re
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
from docx import Document
from pdf2image import convert_from_path
import tempfile
from typing import Dict, List, Optional, Tuple

class DocumentProcessor:
    def __init__(self):
        # Contract classification keywords
        self.contract_keywords = {
            'financing': [
                'financiamento', 'empréstimo', 'crédito', 'parcela', 'juros', 'amortização',
                'sac', 'price', 'cet', 'taxa', 'prestação', 'mutuário', 'credor',
                'garantia', 'hipoteca', 'alienação fiduciária', 'banco', 'instituição financeira'
            ],
            'rental': [
                'locação', 'aluguel', 'locador', 'locatário', 'inquilino', 'imóvel',
                'aluguer', 'arrendamento', 'caução', 'depósito', 'fiador', 'avalista',
                'vistoria', 'benfeitorias', 'iptu', 'condomínio', 'rescisão'
            ],
            'insurance': [
                'seguro', 'apólice', 'segurado', 'segurador', 'prêmio', 'sinistro',
                'cobertura', 'franquia', 'indenização', 'beneficiário', 'vigência',
                'renovação', 'exclusão', 'risco', 'dano', 'ressarcimento'
            ]
        }
    
    def extract_text_from_file(self, file_path: str, file_type: str) -> str:
        """Extract text from different file types"""
        try:
            if file_type.lower() == 'pdf':
                return self._extract_text_from_pdf(file_path)
            elif file_type.lower() in ['docx', 'doc']:
                return self._extract_text_from_docx(file_path)
            elif file_type.lower() in ['jpg', 'jpeg', 'png', 'tiff', 'bmp']:
                return self._extract_text_from_image(file_path)
            elif file_type.lower() == 'txt':
                return self._extract_text_from_txt(file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_type}")
        except Exception as e:
            print(f"Error extracting text from {file_path}: {str(e)}")
            return ""
    
    def _extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF using PyMuPDF and OCR fallback"""
        text = ""
        
        try:
            # First try to extract text directly
            doc = fitz.open(file_path)
            for page in doc:
                page_text = page.get_text()
                if page_text.strip():
                    text += page_text + "\n"
            
            doc.close()
            
            # If no text found, use OCR
            if not text.strip():
                print("No text found in PDF, using OCR...")
                images = convert_from_path(file_path)
                for image in images:
                    # Save image temporarily
                    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp_file:
                        image.save(tmp_file.name)
                        ocr_text = self._extract_text_from_image(tmp_file.name)
                        text += ocr_text + "\n"
                        os.unlink(tmp_file.name)
            
            return text
        except Exception as e:
            print(f"Error extracting text from PDF: {str(e)}")
            return ""
    
    def _extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            print(f"Error extracting text from DOCX: {str(e)}")
            return ""
    
    def _extract_text_from_txt(self, file_path: str) -> str:
        """Extract text from TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except UnicodeDecodeError:
            # Try with different encoding if UTF-8 fails
            try:
                with open(file_path, 'r', encoding='latin-1') as file:
                    return file.read()
            except Exception as e:
                print(f"Error reading TXT file: {str(e)}")
                return ""
        except Exception as e:
            print(f"Error extracting text from TXT: {str(e)}")
            return ""
    
    def _extract_text_from_image(self, file_path: str) -> str:
        """Extract text from image using OCR"""
        try:
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image, lang='por')
            return text
        except Exception as e:
            print(f"Error extracting text from image: {str(e)}")
            return ""
    
    def classify_contract_type(self, text: str) -> str:
        """Classify contract type based on keywords"""
        text_lower = text.lower()
        scores = {}
        
        for contract_type, keywords in self.contract_keywords.items():
            score = 0
            for keyword in keywords:
                # Count occurrences of each keyword
                score += text_lower.count(keyword.lower())
            scores[contract_type] = score
        
        # Return the type with highest score, or 'unknown' if no clear match
        if max(scores.values()) > 0:
            return max(scores, key=scores.get)
        else:
            return 'unknown'
    
    def extract_contract_data(self, text: str, contract_type: str) -> Dict:
        """Extract specific data based on contract type"""
        if contract_type == 'financing':
            return self._extract_financing_data(text)
        elif contract_type == 'rental':
            return self._extract_rental_data(text)
        elif contract_type == 'insurance':
            return self._extract_insurance_data(text)
        else:
            return self._extract_general_data(text)
    
    def _extract_financing_data(self, text: str) -> Dict:
        """Extract data specific to financing contracts"""
        data = {}
        
        # Extract monetary values
        money_pattern = r'R\$\s*[\d.,]+(?:\.\d{2})?'
        money_matches = re.findall(money_pattern, text)
        
        # Extract percentages (interest rates)
        percentage_pattern = r'\d+(?:,\d+)?%\s*(?:a\.a\.|ao ano|a\.m\.|ao mês)?'
        percentage_matches = re.findall(percentage_pattern, text)
        
        # Extract number of installments
        installment_pattern = r'(\d+)\s*(?:parcelas?|prestações?)'
        installment_matches = re.findall(installment_pattern, text, re.IGNORECASE)
        
        # Extract dates
        date_pattern = r'\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}'
        date_matches = re.findall(date_pattern, text)
        
        # Extract amortization system
        amortization_pattern = r'(SAC|PRICE|Tabela Price)'
        amortization_matches = re.findall(amortization_pattern, text, re.IGNORECASE)
        
        # Organize extracted data
        if money_matches:
            data['valores_monetarios'] = money_matches
            # Try to identify specific values
            for i, value in enumerate(money_matches):
                if i == 0:
                    data['valor_financiado'] = value
                elif i == 1:
                    data['valor_parcela'] = value
        
        if percentage_matches:
            data['taxas_juros'] = percentage_matches
        
        if installment_matches:
            data['numero_parcelas'] = installment_matches[0] if installment_matches else None
        
        if date_matches:
            data['datas'] = date_matches
        
        if amortization_matches:
            data['sistema_amortizacao'] = amortization_matches[0]
        
        return data
    
    def _extract_rental_data(self, text: str) -> Dict:
        """Extract data specific to rental contracts"""
        data = {}
        
        # Extract monetary values
        money_pattern = r'R\$\s*[\d.,]+(?:\.\d{2})?'
        money_matches = re.findall(money_pattern, text)
        
        # Extract rental period
        period_pattern = r'(\d+)\s*(?:meses?|anos?)'
        period_matches = re.findall(period_pattern, text, re.IGNORECASE)
        
        # Extract dates
        date_pattern = r'\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}'
        date_matches = re.findall(date_pattern, text)
        
        # Extract penalty information
        penalty_pattern = r'multa.*?(\d+(?:,\d+)?%|R\$\s*[\d.,]+)'
        penalty_matches = re.findall(penalty_pattern, text, re.IGNORECASE)
        
        # Organize extracted data
        if money_matches:
            data['valores_monetarios'] = money_matches
            if len(money_matches) > 0:
                data['valor_aluguel'] = money_matches[0]
            if len(money_matches) > 1:
                data['valor_caucao'] = money_matches[1]
        
        if period_matches:
            data['prazo_locacao'] = period_matches[0] if period_matches else None
        
        if date_matches:
            data['datas'] = date_matches
        
        if penalty_matches:
            data['multa_rescisao'] = penalty_matches[0] if penalty_matches else None
        
        return data
    
    def _extract_insurance_data(self, text: str) -> Dict:
        """Extract data specific to insurance contracts"""
        data = {}
        
        # Extract monetary values
        money_pattern = r'R\$\s*[\d.,]+(?:\.\d{2})?'
        money_matches = re.findall(money_pattern, text)
        
        # Extract coverage information
        coverage_pattern = r'cobertura.*?(?:até|máximo).*?(R\$\s*[\d.,]+)'
        coverage_matches = re.findall(coverage_pattern, text, re.IGNORECASE)
        
        # Extract deductible information
        deductible_pattern = r'franquia.*?(R\$\s*[\d.,]+|\d+(?:,\d+)?%)'
        deductible_matches = re.findall(deductible_pattern, text, re.IGNORECASE)
        
        # Organize extracted data
        if money_matches:
            data['valores_monetarios'] = money_matches
            if len(money_matches) > 0:
                data['premio_seguro'] = money_matches[0]
        
        if coverage_matches:
            data['valor_cobertura'] = coverage_matches[0] if coverage_matches else None
        
        if deductible_matches:
            data['franquia'] = deductible_matches[0] if deductible_matches else None
        
        return data
    
    def _extract_general_data(self, text: str) -> Dict:
        """Extract general data from any contract"""
        data = {}
        
        # Extract monetary values
        money_pattern = r'R\$\s*[\d.,]+(?:\.\d{2})?'
        money_matches = re.findall(money_pattern, text)
        
        # Extract dates
        date_pattern = r'\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}'
        date_matches = re.findall(date_pattern, text)
        
        # Extract percentages
        percentage_pattern = r'\d+(?:,\d+)?%'
        percentage_matches = re.findall(percentage_pattern, text)
        
        # Organize extracted data
        if money_matches:
            data['valores_monetarios'] = money_matches
        
        if date_matches:
            data['datas'] = date_matches
        
        if percentage_matches:
            data['percentuais'] = percentage_matches
        
        return data
    
    def process_document(self, file_path: str, file_type: str) -> Tuple[str, str, Dict]:
        """Main method to process a document and extract all relevant data"""
        # Extract text
        text = self.extract_text_from_file(file_path, file_type)
        
        if not text.strip():
            return "", "unknown", {}
        
        # Classify contract type
        contract_type = self.classify_contract_type(text)
        
        # Extract specific data
        extracted_data = self.extract_contract_data(text, contract_type)
        
        return text, contract_type, extracted_data

