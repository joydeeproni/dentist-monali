"use client"

import { useState } from "react"
import { Phone, MapPin, ChevronDown, ChevronUp, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Clinic } from "@/lib/types"
import { checkAvailability, getNextAppointment } from "@/lib/utils"

interface ClinicCardProps {
  clinic: Clinic
}

export function ClinicCard({ clinic }: ClinicCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { status, statusColor } = checkAvailability(clinic.availability)
  const { hasAppointmentToday, appointmentInfo, isUpcoming } = getNextAppointment(clinic.availability)

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{clinic.name}</h3>
          <Badge
            variant={statusColor === "green" ? "default" : "secondary"}
            className="ml-2 whitespace-nowrap text-black"
          >
            {status}
          </Badge>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          <span>{clinic.gpsLabel}</span>
        </div>

        <div className="flex items-center text-sm text-gray-700 mb-4">
          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
          <span className={hasAppointmentToday ? "font-medium" : ""}>{appointmentInfo}</span>
        </div>

        {expanded && (
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-400" /> Availability
              </p>
              <ul className="space-y-1 pl-5 list-disc">
                {clinic.availability.split(";").map((slot, index) => (
                  <li key={index}>{slot.trim()}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-medium mb-1">Full Address</p>
              <p className="text-gray-600">{clinic.address}</p>
            </div>

            <div>
              <p className="font-medium mb-1">Contact Numbers</p>
              <ul className="space-y-1">
                {clinic.phoneNumbers.map((number, index) => (
                  <li key={index} className="flex items-center">
                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                    <span>{number}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row gap-3">
        <Button
          className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white"
          onClick={() => (window.location.href = "tel:+919337412510")}
        >
          <Phone className="h-4 w-4 mr-2" /> Call Now
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto border-black text-black hover:bg-gray-100"
          onClick={() => window.open(clinic.gpsLink, "_blank")}
        >
          <MapPin className="h-4 w-4 mr-2" /> View on Maps
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-black hover:bg-gray-100"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" /> Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" /> More
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
