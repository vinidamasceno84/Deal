import { useContractsStats } from '../hooks/useContracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const Analytics = () => {
  const { stats, loading, error } = useContractsStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-64 bg-gray-200 rounded"></div>
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
          <p className="text-gray-600">Erro ao carregar analytics: {error}</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const contractTypeData = Object.entries(stats?.contract_types || {}).map(([type, count]) => ({
    name: type === 'financing' ? 'Financiamento' : 
          type === 'rental' ? 'Aluguel' : 
          type === 'insurance' ? 'Seguro' : type,
    value: count,
    color: type === 'financing' ? '#3B82F6' : 
           type === 'rental' ? '#10B981' : 
           type === 'insurance' ? '#F59E0B' : '#6B7280'
  }));

  const statusData = [
    { name: 'Concluídos', value: stats?.completed_contracts || 0, color: '#10B981' },
    { name: 'Processando', value: stats?.processing_contracts || 0, color: '#F59E0B' },
    { name: 'Com Erro', value: stats?.error_contracts || 0, color: '#EF4444' }
  ];

  const monthlyData = [
    { month: 'Jan', contracts: 2 },
    { month: 'Fev', contracts: 5 },
    { month: 'Mar', contracts: 3 },
    { month: 'Abr', contracts: 8 },
    { month: 'Mai', contracts: 6 },
    { month: 'Jun', contracts: stats?.total_contracts || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Análise detalhada dos seus contratos
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Distribuição por Tipo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contractTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contractTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Status dos Contratos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Contratos por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="contracts" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Estatístico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total de Contratos</span>
                <span className="text-2xl font-bold text-gray-900">
                  {stats?.total_contracts || 0}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-600">Taxa de Sucesso</span>
                <span className="text-2xl font-bold text-green-600">
                  {stats?.total_contracts > 0 
                    ? Math.round((stats.completed_contracts / stats.total_contracts) * 100)
                    : 0
                  }%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-600">Tipo Mais Comum</span>
                <span className="text-lg font-bold text-blue-600">
                  {contractTypeData.length > 0 
                    ? contractTypeData.reduce((prev, current) => 
                        prev.value > current.value ? prev : current
                      ).name
                    : 'N/A'
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-600">Em Processamento</span>
                <span className="text-2xl font-bold text-orange-600">
                  {stats?.processing_contracts || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

