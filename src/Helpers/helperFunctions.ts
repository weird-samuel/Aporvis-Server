export const formatNormalDate = (dateString: string): string => {
  const date = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }

  const formattedDate: string = date.toLocaleString('en-US', options)
  return formattedDate
}
