import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HardHat } from 'lucide-react'
import QuoteProgress from '../components/quote/QuoteProgress'
import QuoteStepService from '../components/quote/QuoteStepService'
import QuoteStepInputs from '../components/quote/QuoteStepInputs'
import QuoteStepClient from '../components/quote/QuoteStepClient'
import QuoteResult from '../components/quote/QuoteResult'
import { getPricingForService } from '../services/pricingSettingsService'
import { calculateQuoteEstimate, getDefaultSettings } from '../services/quoteCalculator'
import { createQuoteEstimate } from '../services/quoteEstimateService'
import type { QuoteInputs, QuoteClient, QuoteCalculation } from '../types/QuoteEstimate'
import { env } from '../utils/env'

const INITIAL_INPUTS: QuoteInputs = {
  areaM2: 0,
  propertyType: '',
  currentCondition: '',
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

export default function QuoteCalculator() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [serviceType, setServiceType] = useState('')
  const [inputs, setInputs] = useState<QuoteInputs>(INITIAL_INPUTS)
  const [client, setClient] = useState<QuoteClient>(INITIAL_CLIENT)
  const [calculation, setCalculation] = useState<QuoteCalculation | null>(null)
  const [loading, setLoading] = useState(false)
  const [saveWarning, setSaveWarning] = useState(false)
  const [quoteId, setQuoteId] = useState<string | undefined>(undefined)

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
        const id = await createQuoteEstimate({ client, serviceType, inputs, calculation: calc })
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

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <HardHat className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-neutral-950">{env.companyName}</span>
          </button>
          <p className="text-sm text-neutral-500">Calculadora de estimativa</p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Progress */}
        <div className="mb-8">
          <QuoteProgress current={step} />
        </div>

        {/* Steps */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          {step === 0 && (
            <QuoteStepService
              value={serviceType}
              onChange={setServiceType}
              onNext={() => setStep(1)}
            />
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
            <>
              {saveWarning && (
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Estimativa calculada, mas não foi possível salvar. Anote os valores ou{' '}
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5500000000000'}?text=Ol%C3%A1%2C+preciso+de+um+or%C3%A7amento`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline"
                  >
                    fale pelo WhatsApp
                  </a>
                  .
                </div>
              )}
              <QuoteResult
                serviceType={serviceType}
                inputs={inputs}
                client={client}
                calculation={calculation}
                onScheduleVisit={handleScheduleVisit}
                onRestart={handleRestart}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
