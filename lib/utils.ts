import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkAvailability(availabilityString: string): { status: string; statusColor: string } {
  const now = new Date()
  const currentDay = now.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  // Check if "By appointment" is in the availability string
  if (availabilityString.toLowerCase().includes("by appointment")) {
    return { status: "By Appointment Only", statusColor: "gray" }
  }

  const availabilitySlots = availabilityString.split(";")

  for (const slot of availabilitySlots) {
    const slotLower = slot.toLowerCase().trim()

    // Check for current day
    if (slotLower.includes(currentDay)) {
      const timeMatch = slotLower.match(/(\d+)(?::(\d+))?\s*(?:am|pm)?\s*to\s*(\d+)(?::(\d+))?\s*(?:am|pm)?/i)

      if (timeMatch) {
        let startHour = Number.parseInt(timeMatch[1])
        const startMinute = timeMatch[2] ? Number.parseInt(timeMatch[2]) : 0
        let endHour = Number.parseInt(timeMatch[3])
        const endMinute = timeMatch[4] ? Number.parseInt(timeMatch[4]) : 0

        // Convert to 24-hour format if needed
        if (slotLower.includes("pm") && startHour < 12) startHour += 12
        if (slotLower.includes("pm") && endHour < 12) endHour += 12

        // Check if current time is within the slot
        if (
          (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
          (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute))
        ) {
          return { status: "Available Now", statusColor: "green" }
        }

        // Check if slot is later today
        if (currentHour < startHour || (currentHour === startHour && currentMinute < startMinute)) {
          return { status: "Available Today", statusColor: "green" }
        }
      }
    }
  }

  // Check for tomorrow's availability
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDay = tomorrow.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase()

  for (const slot of availabilitySlots) {
    const slotLower = slot.toLowerCase().trim()
    if (slotLower.includes(tomorrowDay)) {
      return { status: "Available Tomorrow", statusColor: "green" }
    }
  }

  return { status: "Check Schedule", statusColor: "gray" }
}

// Days of the week in order starting from Sunday
const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

// Map day abbreviations to full names
const dayFullNames = {
  sun: "Sunday",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
}

export function getNextAppointment(availabilityString: string): {
  hasAppointmentToday: boolean
  appointmentInfo: string
  isUpcoming: boolean
} {
  const now = new Date()
  const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
  const currentDayAbbr = daysOfWeek[currentDay].toLowerCase()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  const availabilitySlots = availabilityString.split(";").map((slot) => slot.trim())

  // Check for today's appointments
  const todaySlots = availabilitySlots.filter((slot) => {
    const dayMatch = slot.match(/^(mon|tue|wed|thu|fri|sat|sun)/i)
    return dayMatch && dayMatch[1].toLowerCase() === currentDayAbbr
  })

  if (todaySlots.length > 0) {
    // Find the next available slot today
    for (const slot of todaySlots) {
      const timeMatch = slot.match(/$$(\d+(?::\d+)?(?:am|pm)?)\s*to\s*(\d+(?::\d+)?(?:am|pm)?)$$/i)

      if (timeMatch) {
        const [_, startTime, endTime] = timeMatch

        // Format the time for display
        return {
          hasAppointmentToday: true,
          appointmentInfo: `Today, ${startTime} to ${endTime}`,
          isUpcoming: true,
        }
      }
    }

    // If we couldn't parse the time format, just return the first slot
    return {
      hasAppointmentToday: true,
      appointmentInfo: todaySlots[0].replace(/^[^(]+/, "Today "),
      isUpcoming: true,
    }
  }

  // Find the next available day
  for (let i = 1; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7
    const nextDayAbbr = daysOfWeek[nextDay].toLowerCase()
    const nextDayFull = dayFullNames[nextDayAbbr]

    const nextDaySlots = availabilitySlots.filter((slot) => {
      const dayMatch = slot.match(/^(mon|tue|wed|thu|fri|sat|sun)/i)
      return dayMatch && dayMatch[1].toLowerCase() === nextDayAbbr
    })

    if (nextDaySlots.length > 0) {
      // Get the first slot for the next available day
      const timeMatch = nextDaySlots[0].match(/$$(\d+(?::\d+)?(?:am|pm)?)\s*to\s*(\d+(?::\d+)?(?:am|pm)?)$$/i)

      if (timeMatch) {
        const [_, startTime, endTime] = timeMatch

        return {
          hasAppointmentToday: false,
          appointmentInfo: `${nextDayFull}, ${startTime} to ${endTime}`,
          isUpcoming: true,
        }
      }

      // If we couldn't parse the time format, just return the first slot
      return {
        hasAppointmentToday: false,
        appointmentInfo: nextDaySlots[0].replace(/^[^(]+/, `${nextDayFull} `),
        isUpcoming: true,
      }
    }
  }

  // If no appointments found
  return {
    hasAppointmentToday: false,
    appointmentInfo: "No upcoming appointments scheduled",
    isUpcoming: false,
  }
}
