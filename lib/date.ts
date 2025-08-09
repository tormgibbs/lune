import dayjs from 'dayjs'

export const formatDate = (date: string | number | Date): string => {
  const d = dayjs(date)
  const isSameYear = d.year() === dayjs().year()

  return isSameYear
    ? d.format('dddd, D MMM')
    : d.format('D MMM YYYY')
}
