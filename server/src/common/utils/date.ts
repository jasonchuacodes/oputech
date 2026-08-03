import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const APP_TZ = process.env.TZ || 'Asia/Manila'

/**
 * Get the [start, end] instants (UTC Date objects) of the business day
 * containing `date`, anchored to APP_TZ regardless of host timezone.
 */
export const getDayBoundsUTC = (date: string | Date): { from: Date; to: Date } => {
  const day = dayjs.tz(date, APP_TZ)
  return {
    from: day.startOf('day').toDate(),
    to: day.endOf('day').toDate(),
  }
}
