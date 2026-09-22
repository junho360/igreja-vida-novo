function pad(n: number) {
  return String(n).padStart(2, '0')
}

function isoDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function listDiasDiaria(
  dataInicio?: string | Date | null,
  dataFim?: string | Date | null
): string[] {
  if (!dataInicio) return []
  const start = new Date(dataInicio)
  if (isNaN(start.getTime())) return []

  const endParsed = dataFim ? new Date(dataFim) : start
  if (isNaN(endParsed.getTime()) || endParsed < start) return []

  const dias: string[] = []
  const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const last = new Date(
    endParsed.getFullYear(),
    endParsed.getMonth(),
    endParsed.getDate()
  )
  while (cur.getTime() <= last.getTime()) {
    dias.push(isoDate(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return dias
}

export function formatDiaDiaria(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (isNaN(d.getTime())) return iso
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
}

export function formatDiaDiariaLong(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  if (isNaN(d.getTime())) return iso
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}
