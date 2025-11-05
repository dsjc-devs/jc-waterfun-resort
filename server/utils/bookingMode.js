import { formatDateInTimeZone } from './formatDate.js'

// Heuristic to detect night bookings even if flags are missing
export const isNightBooking = ({ mode, isDayMode, startDate, endDate, timeZone = 'Asia/Manila' } = {}) => {
  // Explicit flags win
  if (isDayMode === false) return true
  if (String(mode || '').toLowerCase() === 'night') return true

  if (!startDate || !endDate) return false

  const start = new Date(startDate)
  const end = new Date(endDate)

  // Local hours in target TZ
  const hourFmt = new Intl.DateTimeFormat('en-US', { timeZone, hour12: false, hour: 'numeric' })
  const dayFmt = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })

  const startHour = Number(hourFmt.format(start))
  const endHour = Number(hourFmt.format(end))
  const startDayStr = dayFmt.format(start)
  const endDayStr = dayFmt.format(end)

  const crossesMidnight = startDayStr !== endDayStr
  const durationHrs = Math.abs(end.getTime() - start.getTime()) / 36e5

  // Typical night window is around 10 hours and crosses midnight, start in evening, end in early morning
  const startsEvening = startHour >= 17 && startHour <= 22 // 5 PM - 10 PM
  const endsEarlyMorning = endHour >= 0 && endHour <= 6 // 12 AM - 6 AM

  if (crossesMidnight && startsEvening && endsEarlyMorning) return true
  if (crossesMidnight && durationHrs >= 8 && durationHrs <= 12) return true

  return false
}

export const getNightDisplayStrings = (startDate, endDate, { timeZone = 'Asia/Manila' } = {}) => {
  const start = `${formatDateInTimeZone(startDate, { includeTime: false, timeZone })} 7:00 PM`
  const end = `${formatDateInTimeZone(endDate, { includeTime: false, timeZone })} 5:00 AM`
  return { start, end }
}

export default {
  isNightBooking,
  getNightDisplayStrings,
}
