import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchClients,
  fetchClientDetail,
  updateClientProfile,
  updateClientEmail,
  createClientAddress,
  deleteClientAddress,
  type ClientFilters,
  type UpdateClientData,
  type CreateAddressData,
} from '../services/clients'

export function useClients(filters: ClientFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'clients', filters],
    queryFn: () => fetchClients(filters),
  })
}

export function useClientDetail(id: string | null) {
  return useQuery({
    queryKey: ['admin', 'clients', 'detail', id],
    queryFn: () => fetchClientDetail(id!),
    enabled: !!id,
  })
}

export function useUpdateClientProfile() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientData }) =>
      updateClientProfile(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'clients'] })
      qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Perfil atualizado')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useUpdateClientEmail() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, email }: { userId: string; email: string }) =>
      updateClientEmail(userId, email),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'clients'] })
      toast.success('Email atualizado')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useCreateClientAddress() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAddressData) => createClientAddress(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'clients'] })
      toast.success('Endereço adicionado')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useDeleteClientAddress() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (addressId: string) => deleteClientAddress(addressId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'clients'] })
      toast.success('Endereço excluído')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
