import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Shield, Clock } from 'lucide-react'
import QuoteProgress from '../components/quote/QuoteProgress'
import QuoteStepService from '../components/quote/QuoteStepService'
import QuoteStepInputs from '../components/quote/QuoteStepInputs'
import QuoteStepClient from '../components/quote/QuoteStepClient'
import QuoteResult from '../components/quote/QuoteResult'
import { Logo } from '../components/ui/Logo'
import { getPricingForService } from '../services/pricingSettingsService'
import { calculateQuoteEstimate, getDefaultSettings } from '../services/quoteCalculator'
import { createQuoteEstimate } from '../services/quoteEstimateService'
import { convertQuoteToLead } from '../services/commercialFlowService'
import type { QuoteInputs, QuoteClient, QuoteCalculation } from '../types/QuoteEstimate'
import { env } from '../utils/env'
import { useAuth } from '../contexts/AuthContext'

const INITIAL_INPUTS: QuoteInputs = {
  areaM2: 0,
  propertyType: '',
  currentCondition: '',
  rooms: [],
  finishStandard: 'intermediario',
  complexity: 'media',
  timeline: 'normal',
  includesDemolition: false,
  includesElectrical: false,
  includesPlumbing: false,
  includesPainting: false,
  includesFlooring: false,
  notes: '',
}

const INITIAL_CLIENT: QuoteClient = {
  name: '',
  phone: '',
  city: '',
  neighborhood: '',
}

const STEP_LABELS = ['Serviço', 'Detalhes', 'Seus dados', 'Resultado']

const sidebar = [
  { icon: CheckCircle, text: 'Estimativa em menos de 5 minutos' },
  { icon: Shield, text: 'Sem compromisso — gratuito' },
  { icon: Clock, text: 'Visita técnica antes de qualquer proposta' },
]

export default function QuoteCalculator() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [serviceType, setServiceType] = useState('')
  const [inputs, setInputs] = useState<QuoteInputs>(INITIAL_INPUTS)
  const [client, setClient] = useState<QuoteClient>(INITIAL_CLIENT)
  const [calculation, setCalculation] = useState<QuoteCalculation | null>(null)
  const [loading, setLoading] = useState(false)
  const [saveWarning, setSaveWarning] = useState(false)
  const [quoteId, setQuoteId] = useState<string | undefined>(undefined)
  const [requestingAnalysis, setRequestingAnalysis] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  async function handleSubmit() {
    setLoading(true)
    setSaveWarning(false)
    try {
      const settings = await getPricingForService(serviceType).catch(() => getDefaultSettings(serviceType))
      const calc = calculateQuoteEstimate(inputs, serviceType, settings)
      setCalculation(calc)
      try {
        const id = await createQuoteEstimate({
          client, serviceType, inputs, calculation: calc,
          customerUid: user?.uid,
        })
        setQuoteId(id)
      } catch {
        setSaveWarning(true)
      }
      setStep(3)
    } catch {
      const fallback = getDefaultSettings(serviceType)
      const calc = calculateQuoteEstimate(inputs, serviceType, fallback)
      setCalculation(calc)
      setSaveWarning(true)
      setStep(3)
    } finally {
      setLoading(false)
    }
  }

  function handleRestart() {
    setStep(0)
    setServiceType('')
    setInputs(INITIAL_INPUTS)
    setClient(INITIAL_CLIENT)
    setCalculation(null)
    setSaveWarning(false)
  }

  function handleScheduleVisit() {
    navigate('/agendar', {
      state: {
        clientName: client.name,
        phone: client.phone,
        city: client.city,
        neighborhood: client.neighborhood,
        serviceType,
        quoteEstimateId: quoteId,
      },
    })
  }

  async function handleRequestAnalysis() {
    if (!user) {
      navigate('/criar-conta', { state: { from: '/orcamento', quoteId } })
      return
    }
    if (!quoteId) {
      navigate('/criar-conta')
      return
    }
    setRequestingAnalysis(true)
    try {
      const leadId = await convertQuoteToLead(quoteId, 'pilar', user.uid)
      navigate(`/cliente/solicitacoes/${leadId}`)
    } catch {
      navigate('/cliente/solicitacoes')
    } finally {
      setRequestingAnalysis(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark text-brand-offwhite">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e1c] bg-brand-dark/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="h-8 w-auto" alt={env.companyName} />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-medium text-brand-limestone/40 transition hover:text-brand-limestone"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao site
          </Link>
        </div>
      </header>

      {/* Hero compact */}
      <div className="pt-24 pb-10 px-4 sm:px-6 lg:px-8 border-b border-[#1e1e1c] bg-[#0B0B0A]">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Calculadora</p>
          <h1 className="font-serif text-3xl font-bold text-brand-offwhite sm:text-4xl">
            Calcule uma estimativa inicial para sua obra.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-limestone/50">
            Informe os principais dados do projeto e receba uma faixa preliminar para orientar a próxima etapa.
            <span className="block mt-1 text-brand-limestone/30">Esta estimativa não substitui visita técnica ou proposta formal.</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Main */}
          <div>
            {/* Progress */}
            {step < 3 && (
              <div className="mb-8 border border-[#1e1e1c] bg-[#111110] px-6 py-5">
                <QuoteProgress current={step} />
              </div>
            )}

            {/* Steps */}
            <div className={`border border-[#1e1e1c] bg-brand-concrete p-6 sm:p-8 ${step === 3 ? 'bg-brand-dark border-[#2a2a28]' : ''}`}>
              {saveWarning && step === 3 && (
                <div className="mb-6 border border-amber-700/30 bg-amber-900/20 px-4 py-3 text-xs text-amber-400">
                  Estimativa calculada, mas não foi possível salvar.{' '}
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5500000000000'}?text=Ol%C3%A1%2C+preciso+de+um+or%C3%A7amento`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline"
                  >
                    Fale pelo WhatsApp
                  </a>
                  .
                </div>
              )}

              {step === 0 && (
                <QuoteStepService value={serviceType} onChange={setServiceType} onNext={() => setStep(1)} />
              )}
              {step === 1 && (
                <QuoteStepInputs
                  serviceType={serviceType}
                  inputs={inputs}
                  onChange={(patch) => setInputs((prev) => ({ ...prev, ...patch }))}
                  onNext={() => setStep(2)}
                  onBack={() => setStep(0)}
                />
              )}
              {step === 2 && (
                <QuoteStepClient
                  client={client}
                  onChange={(patch) => setClient((prev) => ({ ...prev, ...patch }))}
                  onNext={handleSubmit}
                  onBack={() => setStep(1)}
                  loading={loading}
                />
              )}
              {step === 3 && calculation && (
                <QuoteResult
                  serviceType={serviceType}
                  inputs={inputs}
                  client={client}
                  calculation={calculation}
                  onScheduleVisit={handleScheduleVisit}
                  onRequestAnalysis={handleRequestAnalysis}
                  onRestart={handleRestart}
                  isLoggedIn={!!user}
                  isSavingAnalysis={requestingAnalysis}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-4">
              {/* Etapa atual */}
              {step < 3 && (
                <div className="border border-[#1e1e1c] bg-[#111110] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-limestone/30 mb-4">Progresso</p>
                  {STEP_LABELS.map((label, i) => (
                    <div key={label} className={`flex items-center gap-3 py-2.5 border-b border-[#1a1a18] last:border-0 ${i === step ? 'text-brand-offwhite' : i < step ? 'text-brand-gold/60' : 'text-brand-limestone/20'}`}>
                      <div className={`h-5 w-5 shrink-0 flex items-center justify-center text-xs font-bold border ${i < step ? 'border-brand-gold bg-brand-gold text-brand-dark' : i === step ? 'border-brand-gold/60 text-brand-gold' : 'border-[#2a2a28] text-brand-limestone/20'}`}>
                        {i < step ? (
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : i + 1}
                      </div>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Garantias */}
              <div className="border border-[#1e1e1c] bg-[#111110] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-limestone/30 mb-4">Por que usar</p>
                <div className="space-y-4">
                  {sidebar.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3">
                      <Icon className="h-4 w-4 shrink-0 text-brand-gold mt-0.5" />
                      <p className="text-sm text-brand-limestone/60">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Método */}
              <div className="border border-[#1e1e1c] bg-[#111110] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-limestone/30 mb-3">Após a estimativa</p>
                <ol className="space-y-2">
                  {['Visita técnica gratuita', 'Proposta formal detalhada', 'Execução com cronograma'].map((s, i) => (
                    <li key={s} className="flex items-start gap-3 text-sm text-brand-limestone/50">
                      <span className="font-serif text-base font-bold text-brand-gold/20 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Disclaimer */}
              <div className="border border-[#1e1e1c] p-4">
                <p className="text-xs text-brand-limestone/25 leading-5">
                  Estimativa inicial para orientação. Proposta formal depende de análise técnica presencial.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
