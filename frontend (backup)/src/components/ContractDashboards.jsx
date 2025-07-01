import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Button } from '@/components/ui/button.jsx'
import { 
  CreditCard, 
  Building, 
  Shield, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  Info,
  Calculator,
  Clock,
  Users,
  MapPin,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react'

// Dashboard para Contratos de Financiamento
export const FinancingDashboard = ({ contractData }) => {
  const [selectedMonth, setSelectedMonth] = useState(1)
  
  if (!contractData || !contractData.extracted_data) {
    return (
      <div className="text-center py-8">
        <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">Dados de financiamento não disponíveis</p>
      </div>
    )
  }

  const data = contractData.extracted_data
  
  // Simular dados de amortização baseados nos dados extraídos
  const generateAmortizationData = () => {
    const numParcelas = parseInt(data.numero_parcelas) || 360
    const valorFinanciado = parseFloat(data.valor_financiado?.replace(/[R$.,\s]/g, '').replace(',', '.')) || 350000
    const valorParcela = parseFloat(data.valor_parcela?.replace(/[R$.,\s]/g, '').replace(',', '.')) || 2450
    
    const amortizationData = []
    let saldoDevedor = valorFinanciado
    
    for (let i = 1; i <= Math.min(numParcelas, 12); i++) {
      const juros = saldoDevedor * 0.007 // 0.7% ao mês
      const amortizacao = valorParcela - juros
      saldoDevedor -= amortizacao
      
      amortizationData.push({
        parcela: i,
        valorParcela: valorParcela,
        juros: juros,
        amortizacao: amortizacao,
        saldoDevedor: Math.max(0, saldoDevedor)
      })
    }
    
    return amortizationData
  }

  const amortizationData = generateAmortizationData()
  const selectedData = amortizationData[selectedMonth - 1] || amortizationData[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <CreditCard className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Dashboard de Financiamento</h2>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Valor Financiado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.valor_financiado || 'R$ 350.000,00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Valor da Parcela</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.valor_parcela || 'R$ 2.450,00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Número de Parcelas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data.numero_parcelas || '360'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações Contratuais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Informações do Contrato</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.taxas_juros && (
              <div className="flex justify-between">
                <span className="text-slate-600">Taxa de Juros:</span>
                <Badge variant="outline">{data.taxas_juros[0]}</Badge>
              </div>
            )}
            
            {data.sistema_amortizacao && (
              <div className="flex justify-between">
                <span className="text-slate-600">Sistema:</span>
                <Badge variant="outline">{data.sistema_amortizacao}</Badge>
              </div>
            )}
            
            {data.datas && data.datas.length > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Data de Início:</span>
                <span className="font-medium">{data.datas[0]}</span>
              </div>
            )}

            {data.entidades?.pessoas && (
              <div>
                <span className="text-slate-600">Contratante:</span>
                <div className="mt-1">
                  {data.entidades.pessoas.map((pessoa, index) => (
                    <Badge key={index} variant="secondary" className="mr-2">
                      {pessoa}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Simulador de Parcela */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Simulador de Parcela</span>
            </CardTitle>
            <CardDescription>Selecione o mês para ver a composição da parcela</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Mês:</label>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full mt-1 p-2 border rounded-md"
              >
                {amortizationData.map((_, index) => (
                  <option key={index} value={index + 1}>
                    Parcela {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Valor da Parcela:</span>
                <span className="font-bold">R$ {selectedData.valorParcela.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Juros:</span>
                  <span className="text-red-600">R$ {selectedData.juros.toFixed(2)}</span>
                </div>
                <Progress 
                  value={(selectedData.juros / selectedData.valorParcela) * 100} 
                  className="h-2 bg-red-100"
                />
                
                <div className="flex justify-between text-sm">
                  <span>Amortização:</span>
                  <span className="text-blue-600">R$ {selectedData.amortizacao.toFixed(2)}</span>
                </div>
                <Progress 
                  value={(selectedData.amortizacao / selectedData.valorParcela) * 100} 
                  className="h-2 bg-blue-100"
                />
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-slate-600">Saldo Devedor:</span>
                  <span className="font-medium">R$ {selectedData.saldoDevedor.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evolução das Parcelas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Evolução das Primeiras 12 Parcelas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {amortizationData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                    {item.parcela}
                  </div>
                  <div>
                    <div className="font-medium">Parcela {item.parcela}</div>
                    <div className="text-sm text-slate-500">
                      Juros: R$ {item.juros.toFixed(2)} | Amortização: R$ {item.amortizacao.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">R$ {item.valorParcela.toFixed(2)}</div>
                  <div className="text-sm text-slate-500">
                    Saldo: R$ {item.saldoDevedor.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Dashboard para Contratos de Aluguel
export const RentalDashboard = ({ contractData }) => {
  const [rescissionMonth, setRescissionMonth] = useState(6)
  
  if (!contractData || !contractData.extracted_data) {
    return (
      <div className="text-center py-8">
        <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">Dados de aluguel não disponíveis</p>
      </div>
    )
  }

  const data = contractData.extracted_data
  
  // Calcular multa de rescisão
  const calculateRescissionPenalty = (month) => {
    const valorAluguel = parseFloat(data.valor_aluguel?.replace(/[R$.,\s]/g, '').replace(',', '.')) || 1500
    const prazoTotal = parseInt(data.prazo_locacao) || 12
    
    if (month <= prazoTotal / 2) {
      return valorAluguel * 3 // 3 aluguéis se rescindir na primeira metade
    } else {
      return valorAluguel * 1 // 1 aluguel se rescindir na segunda metade
    }
  }

  const penaltyAmount = calculateRescissionPenalty(rescissionMonth)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Building className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold text-slate-900">Dashboard de Aluguel</h2>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Valor do Aluguel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.valor_aluguel || 'R$ 1.500,00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Prazo da Locação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.prazo_locacao ? `${data.prazo_locacao} meses` : '12 meses'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Caução</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data.valor_caucao || 'R$ 3.000,00'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações do Imóvel e Contrato */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Informações do Imóvel</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.descricao_imovel && (
              <div>
                <span className="text-slate-600">Descrição:</span>
                <p className="mt-1 text-sm bg-slate-50 p-3 rounded-lg">
                  {data.descricao_imovel}
                </p>
              </div>
            )}
            
            {data.entidades?.locais && (
              <div>
                <span className="text-slate-600">Localização:</span>
                <div className="mt-1">
                  {data.entidades.locais.map((local, index) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {local}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.entidades?.pessoas && (
              <div>
                <span className="text-slate-600">Partes do Contrato:</span>
                <div className="mt-1">
                  {data.entidades.pessoas.map((pessoa, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-1">
                      {pessoa}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calculadora de Multa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Calculadora de Rescisão</span>
            </CardTitle>
            <CardDescription>Simule o valor da multa por rescisão antecipada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600">
                Mês de rescisão:
              </label>
              <select 
                value={rescissionMonth} 
                onChange={(e) => setRescissionMonth(parseInt(e.target.value))}
                className="w-full mt-1 p-2 border rounded-md"
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}º mês
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Multa de Rescisão</span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                R$ {penaltyAmount.toFixed(2)}
              </div>
              <p className="text-sm text-red-600 mt-1">
                {rescissionMonth <= 6 
                  ? "Rescisão na primeira metade: 3 aluguéis"
                  : "Rescisão na segunda metade: 1 aluguel"
                }
              </p>
            </div>

            {data.multa_rescisao && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-sm text-blue-600">Multa contratual:</span>
                <div className="font-medium text-blue-800">{data.multa_rescisao}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline do Contrato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Timeline do Contrato</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.datas && data.datas.map((data_item, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Data Importante</div>
                  <div className="text-sm text-slate-500">{data_item}</div>
                </div>
              </div>
            ))}
            
            {(!data.datas || data.datas.length === 0) && (
              <div className="text-center py-4 text-slate-500">
                Nenhuma data específica encontrada no contrato
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Dashboard para Contratos de Seguro
export const InsuranceDashboard = ({ contractData }) => {
  if (!contractData || !contractData.extracted_data) {
    return (
      <div className="text-center py-8">
        <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">Dados de seguro não disponíveis</p>
      </div>
    )
  }

  const data = contractData.extracted_data

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="h-6 w-6 text-orange-600" />
        <h2 className="text-2xl font-bold text-slate-900">Dashboard de Seguro</h2>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Prêmio do Seguro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data.premio_seguro || 'R$ 1.200,00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Valor da Cobertura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.valor_cobertura || 'R$ 100.000,00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Franquia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {data.franquia || 'R$ 2.000,00'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações da Apólice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Informações da Apólice</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.periodo_vigencia && (
              <div>
                <span className="text-slate-600">Período de Vigência:</span>
                <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Início:</span>
                    <span className="font-medium">{data.periodo_vigencia.inicio}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm">Fim:</span>
                    <span className="font-medium">{data.periodo_vigencia.fim}</span>
                  </div>
                </div>
              </div>
            )}

            {data.entidades?.pessoas && (
              <div>
                <span className="text-slate-600">Segurado:</span>
                <div className="mt-1">
                  {data.entidades.pessoas.map((pessoa, index) => (
                    <Badge key={index} variant="secondary" className="mr-2">
                      {pessoa}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.entidades?.organizacoes && (
              <div>
                <span className="text-slate-600">Seguradora:</span>
                <div className="mt-1">
                  {data.entidades.organizacoes.map((org, index) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {org}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Condições de Sinistro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Condições de Sinistro</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Cobertura Ativa</span>
              </div>
              <p className="text-sm text-blue-600">
                Sua apólice está ativa e oferece cobertura conforme as condições contratuais.
              </p>
            </div>

            {data.franquia && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Franquia</span>
                </div>
                <p className="text-sm text-yellow-600">
                  Em caso de sinistro, você pagará {data.franquia} de franquia.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-600">Valores Monetários Encontrados:</span>
              {data.valores_monetarios && data.valores_monetarios.map((valor, index) => (
                <Badge key={index} variant="outline" className="mr-2 mb-1">
                  {valor}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exclusões e Limitações */}
      {data.exclusoes && data.exclusoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span>Exclusões e Limitações</span>
            </CardTitle>
            <CardDescription>Situações não cobertas pela apólice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.exclusoes.map((exclusao, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{exclusao}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

