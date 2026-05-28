import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { TimelineEvent, TimelineEventType } from '../types/TimelineEvent'
import type { LeadStatus } from '../types/Lead'
import { STATUS_LABELS } from '../types/Lead'
import { createLead } from './leadsService'
import { getQuoteEstimate } from './quoteEstimateService'
import { createAppointment, type AppointmentFormData } from './appointmentService'
import { createTaskIfNotExists, hoursFromNow, daysFromNow } from './taskService'

const DEFAULT_TENANT = 'pilar'

export async function createTimelineEvent(
  tenantId: string,
  leadId: string,
  event: {
    type: TimelineEventType
    title: string
    description?: string
    visibility: 'internal' | 'customer'
    createdBy?: string
  },
): Promise<string> {
  const col = collection(db, `tenants/${tenantId}/leads/${leadId}/timeline`)
  const ref = await addDoc(col, { ...event, createdAt: serverTimestamp() })
  return ref.id
}

export async function getLeadTimeline(
  tenantId: string,
  leadId: string,
): Promise<TimelineEvent[]> {
  const snap = await getDocs(
    query(
      collection(db, `tenants/${tenantId}/leads/${leadId}/timeline`),
      orderBy('createdAt', 'asc'),
    ),
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TimelineEvent)
}

export function subscribeLeadTimeline(
  tenantId: string,
  leadId: string,
  callback: (events: TimelineEvent[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, `tenants/${tenantId}/leads/${leadId}/timeline`),
    orderBy('createdAt', 'asc'),
  )
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TimelineEvent)),
  )
}

export async function convertQuoteToLead(
  quoteId: string,
  tenantId = DEFAULT_TENANT,
  customerUid?: string,
): Promise<string> {
  const quote = await getQuoteEstimate(tenantId, quoteId)
  if (!quote) throw new Error('Estimativa não encontrada')

  if (quote.leadId) return quote.leadId

  const uid = customerUid ?? quote.customerUid

  const leadId = await createLead(
    {
      name: quote.client.name,
      phone: quote.client.phone,
      city: quote.client.city,
      neighborhood: quote.client.neighborhood ?? '',
      serviceType: quote.serviceType,
      description: quote.inputs.notes ?? '',
      budgetRange: '',
      desiredTimeline: '',
      notes: '',
    },
    { customerUid: uid, tenantId, quoteEstimateId: quoteId, source: 'calculator' },
  )

  await updateDoc(doc(db, `tenants/${tenantId}/quoteEstimates`, quoteId), {
    leadId,
    status: 'aguardando_contato',
    updatedAt: serverTimestamp(),
  })

  try {
    await createTimelineEvent(tenantId, leadId, {
      type: 'quote_created',
      title: 'Estimativa gerada',
      description: `Estimativa para ${quote.serviceType} criada pela calculadora.`,
      visibility: 'customer',
      createdBy: uid,
    })
    await createTimelineEvent(tenantId, leadId, {
      type: 'lead_created',
      title: 'Solicitação enviada',
      description: 'Você solicitou análise da estimativa. Nossa equipe entrará em contato.',
      visibility: 'customer',
      createdBy: uid,
    })
  } catch (err) {
    console.warn('[convertQuoteToLead] timeline creation failed:', err)
  }

  try {
    await createTaskIfNotExists(
      tenantId,
      `lead:${leadId}:contact_new_lead`,
      {
        type: 'contact_new_lead',
        title: 'Responder novo pedido',
        priority: 'high',
        dueAt: daysFromNow(1),
        leadId,
        quoteEstimateId: quoteId,
        customerUid: uid,
      },
    )
  } catch (err) {
    console.warn('[convertQuoteToLead] task creation failed:', err)
  }

  return leadId
}

export async function requestVisitFromQuote(
  quoteId: string,
  appointmentData: Omit<AppointmentFormData, 'quoteEstimateId'> & { leadId?: string },
  tenantId = DEFAULT_TENANT,
): Promise<string> {
  const appointmentId = await createAppointment({
    ...appointmentData,
    quoteEstimateId: quoteId,
    leadId: appointmentData.leadId,
    customerUid: appointmentData.customerUid,
    tenantId,
  })

  await updateDoc(doc(db, `tenants/${tenantId}/quoteEstimates`, quoteId), {
    appointmentId,
    status: 'visita_solicitada',
    updatedAt: serverTimestamp(),
  })

  if (appointmentData.leadId) {
    await updateDoc(doc(db, `tenants/${tenantId}/leads`, appointmentData.leadId), {
      appointmentId,
      status: 'visita_agendada',
      updatedAt: serverTimestamp(),
    })
    try {
      await createTimelineEvent(tenantId, appointmentData.leadId, {
        type: 'appointment_requested',
        title: 'Visita técnica solicitada',
        description: `Data preferida: ${appointmentData.date} às ${appointmentData.startTime}`,
        visibility: 'customer',
        createdBy: appointmentData.customerUid,
      })
    } catch (err) {
      console.warn('[requestVisitFromQuote] timeline creation failed:', err)
    }

    try {
      await createTaskIfNotExists(
        tenantId,
        `appointment:${appointmentId}:confirm_appointment`,
        {
          type: 'confirm_appointment',
          title: 'Confirmar visita técnica',
          priority: 'high',
          dueAt: hoursFromNow(24),
          leadId: appointmentData.leadId,
          appointmentId,
          customerUid: appointmentData.customerUid,
        },
      )
    } catch (err) {
      console.warn('[requestVisitFromQuote] task creation failed:', err)
    }
  }

  return appointmentId
}

const STATUS_EVENT: Record<string, { type: TimelineEventType; title: string; visibility: 'internal' | 'customer' }> = {
  em_atendimento: { type: 'status_changed', title: 'Em atendimento', visibility: 'internal' },
  visita_agendada: { type: 'appointment_confirmed', title: 'Visita agendada', visibility: 'customer' },
  proposta_enviada: { type: 'proposal_sent', title: 'Proposta enviada', visibility: 'customer' },
  fechado: { type: 'closed', title: 'Pedido fechado', visibility: 'customer' },
  perdido: { type: 'lost', title: 'Pedido encerrado sem fechamento', visibility: 'internal' },
}

export async function updateLeadCommercialStatus(
  tenantId: string,
  leadId: string,
  status: LeadStatus,
  createdBy?: string,
): Promise<void> {
  await updateDoc(doc(db, `tenants/${tenantId}/leads`, leadId), {
    status,
    updatedAt: serverTimestamp(),
  })

  const evt = STATUS_EVENT[status]
  if (evt) {
    await createTimelineEvent(tenantId, leadId, { ...evt, createdBy })
  }
}

export async function linkQuoteToLead(
  tenantId: string,
  quoteId: string,
  leadId: string,
): Promise<void> {
  const ts = { updatedAt: serverTimestamp() }
  await updateDoc(doc(db, `tenants/${tenantId}/quoteEstimates`, quoteId), { leadId, ...ts })
  await updateDoc(doc(db, `tenants/${tenantId}/leads`, leadId), { quoteEstimateId: quoteId, ...ts })
}

export async function linkAppointmentToLead(
  tenantId: string,
  appointmentId: string,
  leadId: string,
): Promise<void> {
  const ts = { updatedAt: serverTimestamp() }
  await updateDoc(doc(db, `tenants/${tenantId}/appointments`, appointmentId), { leadId, ...ts })
  await updateDoc(doc(db, `tenants/${tenantId}/leads`, leadId), { appointmentId, ...ts })
}

export async function updateLeadStatusWithTimeline(
  tenantId: string,
  leadId: string,
  status: LeadStatus,
  previousStatus?: LeadStatus,
  createdBy?: string,
): Promise<void> {
  await updateDoc(doc(db, `tenants/${tenantId}/leads`, leadId), {
    status,
    updatedAt: serverTimestamp(),
  })

  const evt = STATUS_EVENT[status]
  if (evt) {
    const description = previousStatus && previousStatus !== status
      ? `De "${STATUS_LABELS[previousStatus]}" para "${STATUS_LABELS[status]}"`
      : undefined
    await createTimelineEvent(tenantId, leadId, { ...evt, description, createdBy })
  }
}

export async function linkQuoteLeadAppointment({
  tenantId = DEFAULT_TENANT,
  quoteId,
  leadId,
  appointmentId,
}: {
  tenantId?: string
  quoteId?: string
  leadId?: string
  appointmentId?: string
}): Promise<void> {
  const ts = { updatedAt: serverTimestamp() }

  if (quoteId && leadId) {
    await updateDoc(doc(db, `tenants/${tenantId}/quoteEstimates`, quoteId), { leadId, ...ts })
    await updateDoc(doc(db, `tenants/${tenantId}/leads`, leadId), { quoteEstimateId: quoteId, ...ts })
  }
  if (quoteId && appointmentId) {
    await updateDoc(doc(db, `tenants/${tenantId}/quoteEstimates`, quoteId), { appointmentId, ...ts })
  }
  if (leadId && appointmentId) {
    await updateDoc(doc(db, `tenants/${tenantId}/leads`, leadId), { appointmentId, ...ts })
    await updateDoc(doc(db, `tenants/${tenantId}/appointments`, appointmentId), { leadId, ...ts })
  }
}
