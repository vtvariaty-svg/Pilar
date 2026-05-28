import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Proposal, ProposalItem, ProposalStatus } from '../types/Proposal'
import { createTimelineEvent } from './commercialFlowService'
import { createTaskIfNotExists, daysFromNow } from './taskService'

export interface ProposalFormData {
  leadId: string
  quoteEstimateId?: string
  appointmentId?: string
  customerUid?: string
  title: string
  description: string
  items: ProposalItem[]
  subtotal: number
  discount?: number
  total: number
  paymentTerms?: string
  executionDeadline?: string
  warrantyInfo?: string
  notes?: string
  validUntil?: string
}

function tenantProposalsCol(tenantId: string) {
  return collection(db, `tenants/${tenantId}/proposals`)
}

export async function createProposal(
  tenantId: string,
  data: ProposalFormData,
  createdBy?: string,
): Promise<string> {
  const ref = await addDoc(tenantProposalsCol(tenantId), {
    ...data,
    tenantId,
    status: 'rascunho' as ProposalStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  await createTimelineEvent(tenantId, data.leadId, {
    type: 'proposal_created',
    title: 'Proposta criada',
    visibility: 'internal',
    createdBy,
  })
  return ref.id
}

export async function updateProposal(
  tenantId: string,
  proposalId: string,
  data: Partial<ProposalFormData>,
): Promise<void> {
  await updateDoc(doc(db, `tenants/${tenantId}/proposals`, proposalId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function sendProposal(
  tenantId: string,
  proposalId: string,
  leadId: string,
  createdBy?: string,
): Promise<void> {
  await updateDoc(doc(db, `tenants/${tenantId}/proposals`, proposalId), {
    status: 'enviada' as ProposalStatus,
    sentAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  await createTimelineEvent(tenantId, leadId, {
    type: 'proposal_sent',
    title: 'Proposta enviada',
    description: 'Sua proposta comercial está disponível para análise.',
    visibility: 'customer',
    createdBy,
  })
  try {
    await createTaskIfNotExists(
      tenantId,
      `proposal:${proposalId}:follow_up_proposal`,
      {
        type: 'follow_up_proposal',
        title: 'Fazer follow-up da proposta',
        priority: 'medium',
        dueAt: daysFromNow(2),
        leadId,
        proposalId,
      },
      createdBy,
    )
  } catch (err) {
    console.warn('[sendProposal] task creation failed:', err)
  }
}

export async function acceptProposal(
  tenantId: string,
  proposalId: string,
  leadId: string,
  createdBy?: string,
): Promise<void> {
  await updateDoc(doc(db, `tenants/${tenantId}/proposals`, proposalId), {
    status: 'aceita' as ProposalStatus,
    acceptedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  await createTimelineEvent(tenantId, leadId, {
    type: 'proposal_accepted',
    title: 'Proposta aceita',
    visibility: 'customer',
    createdBy,
  })
  try {
    await createTaskIfNotExists(
      tenantId,
      `proposal:${proposalId}:start_project`,
      {
        type: 'start_project',
        title: 'Iniciar planejamento da execução',
        priority: 'high',
        dueAt: daysFromNow(1),
        leadId,
        proposalId,
      },
      createdBy,
    )
  } catch (err) {
    console.warn('[acceptProposal] task creation failed:', err)
  }
}

export async function rejectProposal(
  tenantId: string,
  proposalId: string,
  leadId: string,
  createdBy?: string,
): Promise<void> {
  await updateDoc(doc(db, `tenants/${tenantId}/proposals`, proposalId), {
    status: 'recusada' as ProposalStatus,
    rejectedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  await createTimelineEvent(tenantId, leadId, {
    type: 'proposal_rejected',
    title: 'Proposta recusada',
    visibility: 'internal',
    createdBy,
  })
}

export async function getProposalById(tenantId: string, proposalId: string): Promise<Proposal | null> {
  const snap = await getDoc(doc(db, `tenants/${tenantId}/proposals`, proposalId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Proposal
}

export function subscribeLeadProposals(
  tenantId: string,
  leadId: string,
  cb: (items: Proposal[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    tenantProposalsCol(tenantId),
    where('leadId', '==', leadId),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Proposal)),
    (err) => {
      console.error('[subscribeLeadProposals]', err)
      onError ? onError(err) : cb([])
    },
  )
}

export function subscribeCustomerProposals(
  tenantId: string,
  customerUid: string,
  cb: (items: Proposal[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    tenantProposalsCol(tenantId),
    where('customerUid', '==', customerUid),
    where('status', 'in', ['enviada', 'aceita', 'recusada']),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Proposal)),
    (err) => {
      console.error('[subscribeCustomerProposals]', err)
      onError ? onError(err) : cb([])
    },
  )
}
