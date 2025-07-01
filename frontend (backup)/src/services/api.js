// API service for communicating with Flask backend
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async uploadContract(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/contracts/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  }

  async getContracts() {
    const response = await fetch(`${API_BASE_URL}/contracts`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch contracts');
    }

    return response.json();
  }

  async getContract(id) {
    const response = await fetch(`${API_BASE_URL}/contracts/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch contract');
    }

    return response.json();
  }

  async getContractData(id) {
    const response = await fetch(`${API_BASE_URL}/contracts/${id}/data`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch contract data');
    }

    return response.json();
  }

  async getContractStatus(id) {
    const response = await fetch(`${API_BASE_URL}/contracts/${id}/status`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch contract status');
    }

    return response.json();
  }

  async getContractsStats() {
    const response = await fetch(`${API_BASE_URL}/contracts/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch contracts stats');
    }

    return response.json();
  }
}

export const apiService = new ApiService();

