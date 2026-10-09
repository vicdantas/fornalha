// Estrutura do catálogo oficial da Fornalha (PDF do proprietário).
// Loja, card de produto e painel admin leem daqui.

export const CATEGORIES = [
  { id: 'bovino', label: 'Bovinos' },
  { id: 'acompanhamento', label: 'Acompanhamentos' },
  { id: 'tempero', label: 'Temperos e sais' },
  { id: 'paes_linguicas', label: 'Pães de alho, linguiças e queijos' },
  { id: 'suino', label: 'Suínos' },
  { id: 'ave', label: 'Aves' },
  { id: 'espetinho', label: 'Espetinhos' },
]

export const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]))

export const UNITS = [
  { id: 'kg', label: 'kg' },
  { id: 'peca', label: 'peça' },
  { id: 'un', label: 'unidade' },
  { id: 'pacote', label: 'pacote' },
]

const UNIT_LABEL = Object.fromEntries(UNITS.map(u => [u.id, u.label]))

export function unitLabel(unit) {
  return UNIT_LABEL[unit] ?? unit ?? 'kg'
}
