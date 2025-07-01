import { useState } from 'react';
import { useContracts, useContractData } from '../hooks/useContracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Building,
  Shield,
  Calendar,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Contracts = () => {
  const { contracts, loading, error } = useContracts();
  const [selectedContract, setSelectedContract] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'processing':
        return 'Processando';
      case 'error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getContractTypeIcon = (type) => {
    switch (type) {
      case 'financing':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'rental':
        return <Building className="h-4 w-4 text-green-600" />;
      case 'insurance':
        return <Shield className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getContractTypeLabel = (type) => {
    switch (type) {
      case 'financing':
        return 'Financiamento';
      case 'rental':
        return 'Aluguel';
      case 'insurance':
        return 'Seguro';
      default:
        return 'Contrato';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Erro ao carregar contratos: {error}</p>
        </div>
      </div>
    );
  }

  if (selectedContract) {
    return <ContractDetails contract={selectedContract} onBack={() => setSelectedContract(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
        <p className="text-gray-600 mt-1">Gerencie e visualize seus contratos</p>
      </div>

      {/* Contracts List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contratos</CardTitle>
          <p className="text-sm text-gray-600">
            Clique em um contrato para ver detalhes
          </p>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum contrato encontrado</p>
              <p className="text-sm text-gray-500 mt-1">
                Faça upload de um contrato para começar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedContract(contract)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getContractTypeIcon(contract.contract_type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {contract.original_filename}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">
                            {getContractTypeLabel(contract.contract_type)}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">
                            {contract.created_at && format(
                              new Date(contract.created_at), 
                              'dd/MM/yyyy', 
                              { locale: ptBR }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(contract.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(contract.status)}
                        <span>{getStatusLabel(contract.status)}</span>
                      </div>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ContractDetails = ({ contract, onBack }) => {
  const { contractData, loading, error } = useContractData(contract.id);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Lista
          </Button>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Lista
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Erro ao carregar dados do contrato</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Lista
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {contract.original_filename}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-gray-600">
                {getContractTypeLabel(contract.contract_type)}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {contract.created_at && format(
                  new Date(contract.created_at), 
                  'dd/MM/yyyy', 
                  { locale: ptBR }
                )}
              </span>
            </div>
          </div>
        </div>
        <Badge variant={getStatusVariant(contract.status)}>
          {getStatusLabel(contract.status)}
        </Badge>
      </div>

      {/* Contract Dashboard */}
      {contractData?.contract_type === 'financing' && (
        <FinancingDashboard data={contractData.extracted_data} />
      )}
      
      {contractData?.contract_type === 'rental' && (
        <RentalDashboard data={contractData.extracted_data} />
      )}
      
      {contractData?.contract_type === 'insurance' && (
        <InsuranceDashboard data={contractData.extracted_data} />
      )}

      {(!contractData?.contract_type || contractData?.contract_type === 'unknown') && (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Dados do contrato não disponíveis ou ainda processando
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const FinancingDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span>Dashboard de Financiamento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Valor Financiado</p>
              <p className="text-2xl font-bold text-blue-600">
                {data?.valor_financiado || 'N/A'}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Valor da Parcela</p>
              <p className="text-2xl font-bold text-green-600">
                {data?.valor_parcela || 'N/A'}
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Número de Parcelas</p>
              <p className="text-2xl font-bold text-orange-600">
                {data?.numero_parcelas || 'N/A'}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Informações do Contrato
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de Juros:</span>
                  <span className="font-medium">
                    {data?.taxas_juros?.[0] || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sistema:</span>
                  <span className="font-medium">
                    {data?.sistema_amortizacao || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data de Início:</span>
                  <span className="font-medium">
                    {data?.datas?.[0] || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Valores Identificados
              </h3>
              <div className="space-y-2 text-sm">
                {data?.valores_monetarios?.map((valor, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">Valor {index + 1}:</span>
                    <span className="font-medium">{valor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RentalDashboard = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building className="h-5 w-5 text-green-600" />
          <span>Dashboard de Aluguel</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Dashboard de aluguel em desenvolvimento...</p>
      </CardContent>
    </Card>
  );
};

const InsuranceDashboard = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-orange-600" />
          <span>Dashboard de Seguro</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Dashboard de seguro em desenvolvimento...</p>
      </CardContent>
    </Card>
  );
};

export default Contracts;

