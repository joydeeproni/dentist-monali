"use client"

import { useState } from "react"
import { Phone, MapPin, ChevronRight, ChevronDown, ChevronUp, Clock, Calendar } from "lucide-react"
import type { Clinic } from "@/lib/types"
import { getNextAppointment } from "@/lib/utils"

interface ClinicCardProps {
  clinic: Clinic
}

export function ClinicCard({ clinic }: ClinicCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { appointmentInfo } = getNextAppointment(clinic.availability)

  const callNumber =
    clinic.phoneNumbers && clinic.phoneNumbers.length > 0 ? clinic.phoneNumbers[0] : "+919337412510"

  return (
    <div className="bg-card rounded-lg border border-border p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between h-full">
      <div>
        {/* Header: Name + Chevron */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-start justify-between w-full text-left mb-3"
        >
          <h3 className="text-base font-semibold text-foreground leading-snug pr-2">{clinic.name}</h3>
          <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        </button>

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
      <div className="flex items-center gap-3">
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
