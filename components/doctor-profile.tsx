"use client"

import { useState } from "react"
import Image from "next/image"
import { Phone, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function DoctorProfile() {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="overflow-hidden">
      <div className="relative w-full h-48 bg-yellow-400">
        <Image
          src="/images/doctor-banner.png"
          alt="Dr. Monali treating a child patient"
          fill
          className="object-cover"
          priority
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold mb-1">Dr. Monali Sengupta</h3>
        <p className="text-gray-500 mb-4">MDS, Pediatric Dental Surgeon</p>

        <div className="space-y-4">
          <p>
            Dr. Monali Sengupta is a pediatric dental surgeon practising in Kolkata since 2014. She specializes in child
            dentistry, having completed her MDS from KIIT University and is a gold medalist in both BDS and MDS.
          </p>

          {expanded && (
            <>
              <p>
                As a pediatric dental surgeon, she caters to the oral healthcare needs of child patients who require
                extra care, behaviour management, and minimally invasive treatment approaches as well as preventive
                strategies which vary from that of adult patients with dental problems.
              </p>

              <p>
                Her patients appreciate the warmth, professional integrity, and open communication that define her
                practice.
              </p>
            </>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-black p-0 h-auto"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" /> Read Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" /> Read More
              </>
            )}
          </Button>

          <Button
            className="w-full mt-4 bg-black hover:bg-gray-800 flex items-center justify-center gap-2 text-white"
            size="lg"
            onClick={() => (window.location.href = "tel:+919337412510")}
          >
            <Phone className="h-5 w-5" /> Book Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
