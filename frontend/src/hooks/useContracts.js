import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getContracts();
      setContracts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const uploadContract = async (file) => {
    try {
      const result = await apiService.uploadContract(file);
      // Refresh contracts list after upload
      await fetchContracts();
      return result;
    } catch (err) {
      throw err;
    }
  };

  return {
    contracts,
    loading,
    error,
    uploadContract,
    refetch: fetchContracts
  };
};

export const useContractData = (contractId) => {
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContractData = useCallback(async () => {
    if (!contractId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getContractData(contractId);
      setContractData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  return {
    contractData,
    loading,
    error,
    refetch: fetchContractData
  };
};

export const useContractsStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getContractsStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

