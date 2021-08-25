// Public: Formats the specified seconds as minutes:second, example: 1:03.
export function formatSecondsAsMinutes (secondsDuration: number): string {
  if (!isFinite(secondsDuration)) return '     '

  secondsDuration = Math.round(secondsDuration)
  const minutes = Math.floor(secondsDuration / 60)
  const seconds = secondsDuration % 60
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
