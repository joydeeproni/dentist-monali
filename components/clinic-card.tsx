"use client"

import { useState } from "react"
import { Phone, MapPin, ChevronRight, Clock, Calendar } from "lucide-react"
import type { Clinic } from "@/lib/types"
import { getNextAppointment } from "@/lib/utils"

interface ClinicCardProps {
  clinic: Clinic
}

function getAvailabilityChip(availability: string): {
  label: string
  isToday: boolean
} {
  const now = new Date()
  const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
  const dayFullNames: Record<string, string> = {
    sun: "Sunday",
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
  }
  const currentDay = now.getDay()
  const currentDayAbbr = daysOfWeek[currentDay]

  const slots = availability.split(";").map((s) => s.trim())

  // Check today
  const todaySlot = slots.find((slot) => {
    const dayMatch = slot.match(/^(mon|tue|wed|thu|fri|sat|sun)/i)
    return dayMatch && dayMatch[1].toLowerCase() === currentDayAbbr
  })

  if (todaySlot) {
    return { label: "Today", isToday: true }
  }

  // Check tomorrow
  const tomorrowDay = (currentDay + 1) % 7
  const tomorrowAbbr = daysOfWeek[tomorrowDay]
  const tomorrowSlot = slots.find((slot) => {
    const dayMatch = slot.match(/^(mon|tue|wed|thu|fri|sat|sun)/i)
    return dayMatch && dayMatch[1].toLowerCase() === tomorrowAbbr
  })

  if (tomorrowSlot) {
    return { label: "Tomorrow", isToday: false }
  }

  // Find next available day
  for (let i = 2; i <= 7; i++) {
    const nextDay = (currentDay + i) % 7
    const nextDayAbbr = daysOfWeek[nextDay]
    const nextDaySlot = slots.find((slot) => {
      const dayMatch = slot.match(/^(mon|tue|wed|thu|fri|sat|sun)/i)
      return dayMatch && dayMatch[1].toLowerCase() === nextDayAbbr
    })

    if (nextDaySlot) {
      return { label: dayFullNames[nextDayAbbr], isToday: false }
    }
  }

  return { label: "Check Schedule", isToday: false }
}

export function ClinicCard({ clinic }: ClinicCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { appointmentInfo } = getNextAppointment(clinic.availability)
  const chip = getAvailabilityChip(clinic.availability)

  const callNumber =
    clinic.phoneNumbers && clinic.phoneNumbers.length > 0 ? clinic.phoneNumbers[0] : "+919337412510"

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="bg-card rounded-lg border border-border p-5 transition-colors duration-150 hover:border-foreground/30 cursor-pointer flex flex-col justify-between h-full"
    >
      <div>
        {/* Availability Chip */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono uppercase text-[12px] leading-none tracking-wide ${
              chip.isToday
                ? "bg-[#16a34a]/10 text-[#16a34a]"
                : "bg-[#ca8a04]/10 text-[#ca8a04]"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                chip.isToday ? "bg-[#16a34a]" : "bg-[#ca8a04]"
              }`}
            />
            {`Available - ${chip.label}`}
          </span>
        </div>

        {/* Header: Name + Chevron */}
        <div className="flex items-start justify-between w-full text-left mb-3">
          <h3 className="text-lg font-normal text-foreground leading-snug pr-2">{clinic.name}</h3>
          <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
        </div>

        {/* Time */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1.5">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>{appointmentInfo}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{clinic.gpsLabel}</span>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mb-4 space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1 flex items-center gap-1 text-foreground">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Full Schedule
              </p>
              <ul className="space-y-0.5 pl-5 list-disc text-muted-foreground">
                {clinic.availability.split(";").map((slot, index) => (
                  <li key={index}>{slot.trim()}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-medium mb-1 text-foreground">Full Address</p>
              <p className="text-muted-foreground">{clinic.address}</p>
            </div>

            <div>
              <p className="font-medium mb-1 text-foreground">Contact Numbers</p>
              <ul className="space-y-0.5">
                {clinic.phoneNumbers.map((number, index) => (
                  <li key={index} className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{number}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => (window.location.href = `tel:${callNumber.replace(/\s+/g, "")}`)}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#ec4319] text-[#ffffff] text-sm font-medium hover:bg-[#d63a15] transition-colors"
        >
          Call
        </button>
        <button
          onClick={() => window.open(clinic.gpsLink, "_blank")}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-full border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
        >
          Map
        </button>
      </div>
    </div>
  )
}
