export const UNIT_LABELS: Record<string, string> = {
  un: 'Unidade',
  kg: 'Quilograma',
  cx: 'Caixa',
  maco: 'Maço',
  dz: 'Dúzia',
  bj: 'Bandeja',
  pc: 'Pacote',
}

export const UNIT_SHORT: Record<string, string> = {
  un: 'un',
  kg: 'kg',
  cx: 'cx',
  maco: 'maço',
  dz: 'dz',
  bj: 'bj',
  pc: 'pc',
}

export function getUnitLabel(unitType: string): string {
  return UNIT_LABELS[unitType] ?? unitType
}

export function getUnitShort(unitType: string): string {
  return UNIT_SHORT[unitType] ?? unitType
}
