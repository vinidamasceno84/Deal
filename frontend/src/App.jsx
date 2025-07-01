import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { FinancingDashboard, RentalDashboard, InsuranceDashboard } from './components/ContractDashboards.jsx'
import { 
  Home, 
  FileText, 
  BarChart3, 
  Upload as UploadIcon, 
  Shield, 
  CreditCard, 
  Building,
  AlertTriangle,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Menu,
  X,
  CheckCircle,
  Info,
  Download,
  Eye,
  Settings,
  Loader2
} from 'lucide-react'
import './App.css'

// API Configuration
const API_BASE_URL = '/api'

// API Service
const apiService = {
  async uploadContract(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE_URL}/contracts/upload`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Upload failed')
    }
    
    return response.json()
  },

  async getContracts() {
    const response = await fetch(`${API_BASE_URL}/contracts`)
    if (!response.ok) {
      throw new Error('Failed to fetch contracts')
    }
    return response.json()
  },

  async getContractStats() {
    const response = await fetch(`${API_BASE_URL}/contracts/stats`)
    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }
    return response.json()
  },

  async getContractData(contractId) {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/data`)
    if (!response.ok) {
      throw new Error('Failed to fetch contract data')
    }
    return response.json()
  },

  async getContractStatus(contractId) {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/status`)
    if (!response.ok) {
      throw new Error('Failed to fetch contract status')
    }
    return response.json()
  }
}

// Componente Sidebar
const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'upload', label: 'Upload', icon: UploadIcon },
    { id: 'contracts', label: 'Contratos', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:transform-none`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold">LegalDesign</h1>
                <p className="text-sm text-slate-400">AI</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-slate-800"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start text-left ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsMobileOpen(false)
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">Versão Beta</span>
            </div>
            <p className="text-xs text-slate-400">
              Plataforma em desenvolvimento. Feedback é bem-vindo!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// Componente Dashboard
const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, contractsData] = await Promise.all([
          apiService.getContractStats(),
          apiService.getContracts()
        ])
        setStats(statsData)
        setContracts(contractsData.slice(0, 4)) // Show only first 4 contracts
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Ativo', variant: 'default', color: 'bg-green-100 text-green-800' },
      processing: { label: 'Processando', variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      error: { label: 'Erro', variant: 'destructive', color: 'bg-red-100 text-red-800' }
    }
    
    const config = statusConfig[status] || statusConfig.processing
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getContractTypeIcon = (type) => {
    const icons = {
      financing: CreditCard,
      rental: Building,
      insurance: Shield
    }
    return icons[type] || FileText
  }

  const getContractTypeLabel = (type) => {
    const labels = {
      financing: 'Financiamento',
      rental: 'Aluguel',
      insurance: 'Seguro'
    }
    return labels[type] || 'Contrato'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Visão geral dos seus contratos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Contratos Ativos</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats?.completed_contracts || 0}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Processando</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats?.processing_contracts || 0}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Com Erro</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats?.error_contracts || 0}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Processados</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats?.total_contracts || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Types Chart */}
      {stats?.contract_types && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Tipos de Contrato</span>
            </CardTitle>
            <CardDescription>Distribuição por categoria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-sm">Financiamento</span>
                </div>
                <span className="text-sm font-medium">{stats.contract_types.financing}</span>
              </div>
              <Progress value={(stats.contract_types.financing / stats.total_contracts) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm">Aluguel</span>
                </div>
                <span className="text-sm font-medium">{stats.contract_types.rental}</span>
              </div>
              <Progress value={(stats.contract_types.rental / stats.total_contracts) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                  <span className="text-sm">Seguro</span>
                </div>
                <span className="text-sm font-medium">{stats.contract_types.insurance}</span>
              </div>
              <Progress value={(stats.contract_types.insurance / stats.total_contracts) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Contracts */}
      <Card>
        <CardHeader>
          <CardTitle>Contratos Recentes</CardTitle>
          <CardDescription>Últimos contratos processados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contracts.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Nenhum contrato encontrado</p>
            ) : (
              contracts.map((contract) => {
                const Icon = getContractTypeIcon(contract.contract_type)
                return (
                  <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Icon className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">{contract.original_filename}</h3>
                        <p className="text-sm text-slate-500">
                          {getContractTypeLabel(contract.contract_type)} • {new Date(contract.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(contract.status)}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente Upload
const UploadPage = () => {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file) => {
    setUploading(true)
    setUploadResult(null)

    try {
      const result = await apiService.uploadContract(file)
      setUploadResult({
        success: true,
        message: 'Arquivo enviado com sucesso!',
        contractId: result.contract_id
      })
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Erro ao enviar arquivo: ' + error.message
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Upload de Contrato</h1>
        <p className="text-slate-600 mt-2">Envie seus contratos para análise automática</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-300 hover:border-slate-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 text-blue-600 mx-auto animate-spin" />
                <p className="text-lg font-medium text-slate-900">Enviando arquivo...</p>
                <p className="text-sm text-slate-500">Processamento iniciará automaticamente</p>
              </div>
            ) : (
              <>
                <UploadIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Arraste e solte seu arquivo aqui
                </h3>
                <p className="text-slate-500 mb-6">
                  Ou clique para selecionar um arquivo
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.tiff,.bmp"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button className="cursor-pointer">
                    Selecionar Arquivo
                  </Button>
                </label>
                <p className="text-xs text-slate-400 mt-4">
                  Formatos suportados: PDF, Word, Imagens (JPG, PNG, TIFF, BMP)
                </p>
              </>
            )}
          </div>

          {uploadResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              uploadResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                {uploadResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
                <p className={`font-medium ${
                  uploadResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {uploadResult.message}
                </p>
              </div>
              {uploadResult.success && (
                <p className="text-sm text-green-600 mt-2">
                  ID do contrato: {uploadResult.contractId}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Componente Contracts
const Contracts = () => {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState(null)
  const [contractData, setContractData] = useState(null)

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await apiService.getContracts()
        setContracts(data)
      } catch (error) {
        console.error('Error fetching contracts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [])

  const handleContractSelect = async (contract) => {
    setSelectedContract(contract)
    setContractData(null)

    if (contract.status === 'completed') {
      try {
        const data = await apiService.getContractData(contract.id)
        setContractData(data)
      } catch (error) {
        console.error('Error fetching contract data:', error)
      }
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Concluído', color: 'bg-green-100 text-green-800' },
      processing: { label: 'Processando', color: 'bg-yellow-100 text-yellow-800' },
      error: { label: 'Erro', color: 'bg-red-100 text-red-800' }
    }
    
    const config = statusConfig[status] || statusConfig.processing
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getContractTypeIcon = (type) => {
    const icons = {
      financing: CreditCard,
      rental: Building,
      insurance: Shield
    }
    return icons[type] || FileText
  }

  const getContractTypeLabel = (type) => {
    const labels = {
      financing: 'Financiamento',
      rental: 'Aluguel',
      insurance: 'Seguro'
    }
    return labels[type] || 'Contrato'
  }

  const renderContractDashboard = () => {
    if (!selectedContract || !contractData) return null

    switch (contractData.contract_type) {
      case 'financing':
        return <FinancingDashboard contractData={contractData} />
      case 'rental':
        return <RentalDashboard contractData={contractData} />
      case 'insurance':
        return <InsuranceDashboard contractData={contractData} />
      default:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-slate-900 mb-2">Tipo de Contrato</h3>
              <Badge className="bg-blue-100 text-blue-800">
                {getContractTypeLabel(contractData.contract_type)}
              </Badge>
            </div>

            {contractData.extracted_data && Object.keys(contractData.extracted_data).length > 0 && (
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Dados Extraídos</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                    {JSON.stringify(contractData.extracted_data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Contratos</h1>
        <p className="text-slate-600 mt-2">Gerencie e visualize seus contratos</p>
      </div>

      {selectedContract && contractData ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedContract(null)
                  setContractData(null)
                }}
              >
                ← Voltar à Lista
              </Button>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedContract.original_filename}</h2>
                <p className="text-slate-500">
                  {getContractTypeLabel(contractData.contract_type)} • {new Date(selectedContract.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            {getStatusBadge(selectedContract.status)}
          </div>
          
          {renderContractDashboard()}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de Contratos */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Contratos</CardTitle>
              <CardDescription>Clique em um contrato para ver detalhes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contracts.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">Nenhum contrato encontrado</p>
                ) : (
                  contracts.map((contract) => {
                    const Icon = getContractTypeIcon(contract.contract_type)
                    return (
                      <div
                        key={contract.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-slate-50 ${
                          selectedContract?.id === contract.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => handleContractSelect(contract)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-slate-600" />
                            <div>
                              <h3 className="font-medium text-slate-900">{contract.original_filename}</h3>
                              <p className="text-sm text-slate-500">
                                {getContractTypeLabel(contract.contract_type)} • {new Date(contract.created_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(contract.status)}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Contrato */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Contrato</CardTitle>
              <CardDescription>
                {selectedContract ? 'Dados extraídos do contrato' : 'Selecione um contrato para ver detalhes'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedContract ? (
                <p className="text-slate-500 text-center py-8">Nenhum contrato selecionado</p>
              ) : selectedContract.status === 'processing' ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-slate-600">Processando contrato...</p>
                </div>
              ) : selectedContract.status === 'error' ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
                  <p className="text-red-600">Erro ao processar contrato</p>
                </div>
              ) : contractData ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2">Tipo de Contrato</h3>
                    <Badge className="bg-blue-100 text-blue-800">
                      {getContractTypeLabel(contractData.contract_type)}
                    </Badge>
                  </div>

                  <Button 
                    onClick={() => handleContractSelect(selectedContract)}
                    className="w-full"
                  >
                    Ver Dashboard Completo
                  </Button>

                  {contractData.extracted_data && Object.keys(contractData.extracted_data).length > 0 && (
                    <div>
                      <h3 className="font-medium text-slate-900 mb-2">Resumo dos Dados</h3>
                      <div className="bg-slate-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                        <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                          {JSON.stringify(contractData.extracted_data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">Carregando dados...</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Componente Analytics
const Analytics = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getContractStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-2">Análise detalhada dos seus contratos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats?.total_contracts > 0 
                ? Math.round((stats.completed_contracts / stats.total_contracts) * 100)
                : 0}%
            </div>
            <p className="text-sm text-slate-500 mt-2">
              {stats?.completed_contracts} de {stats?.total_contracts} contratos processados com sucesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tipo Mais Comum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.contract_types && Object.keys(stats.contract_types).length > 0
                ? Object.entries(stats.contract_types).reduce((a, b) => 
                    stats.contract_types[a[0]] > stats.contract_types[b[0]] ? a : b
                  )[0] === 'financing' ? 'Financiamento' :
                  Object.entries(stats.contract_types).reduce((a, b) => 
                    stats.contract_types[a[0]] > stats.contract_types[b[0]] ? a : b
                  )[0] === 'rental' ? 'Aluguel' : 'Seguro'
                : 'N/A'
              }
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Categoria com mais contratos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Processamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.processing_contracts || 0}
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Contratos sendo processados
            </p>
          </CardContent>
        </Card>
      </div>

      {stats?.contract_types && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.contract_types).map(([type, count]) => {
                const percentage = stats.total_contracts > 0 ? (count / stats.total_contracts) * 100 : 0
                const labels = {
                  financing: 'Financiamento',
                  rental: 'Aluguel',
                  insurance: 'Seguro'
                }
                
                return (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{labels[type] || type}</span>
                      <span className="text-sm text-slate-500">{count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Componente Principal
function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'upload':
        return <UploadPage />
      case 'contracts':
        return <Contracts />
      case 'analytics':
        return <Analytics />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg font-bold text-slate-900">LegalDesign AI</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App

