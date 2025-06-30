import { useContractsStats } from '../hooks/useContracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  CreditCard,
  Building,
  Shield,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const { stats, loading, error } = useContractsStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
          <p className="text-gray-600">Erro ao carregar estatísticas: {error}</p>
        </div>
      </div>
    );
  }

  const contractTypeIcons = {
    financing: CreditCard,
    rental: Building,
    insurance: Shield
  };

  const contractTypeLabels = {
    financing: 'Financiamento',
    rental: 'Aluguel',
    insurance: 'Seguro'
  };

  const contractTypeColors = {
    financing: 'text-blue-600',
    rental: 'text-green-600',
    insurance: 'text-orange-600'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral dos seus contratos</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contratos Ativos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.completed_contracts || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processando</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.processing_contracts || 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Com Erro</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.error_contracts || 0}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Processados</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.total_contracts || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Tipos de Contrato</span>
          </CardTitle>
          <p className="text-sm text-gray-600">Distribuição por categoria</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats?.contract_types || {}).map(([type, count]) => {
              const Icon = contractTypeIcons[type];
              const label = contractTypeLabels[type];
              const colorClass = contractTypeColors[type];
              const percentage = stats?.total_contracts > 0 
                ? (count / stats.total_contracts) * 100 
                : 0;

              return (
                <div key={type} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <Icon className={`h-4 w-4 ${colorClass}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {label}
                      </span>
                      <span className="text-sm text-gray-600">
                        {count}
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

