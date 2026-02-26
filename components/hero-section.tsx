"use client"

import { useState } from "react"
import Image from "next/image"

const navLinks = [
  { label: "About Doctor Monali", href: "#about" },
  { label: "Appointments", href: "#appointments" },
  { label: "Reviews", href: "#reviews" },
]

const badges = [
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/years%20of%20experience-uDBwt9WblkMdpsWTEAoQb0RWkJZ2SW.png",
    value: "10+ years of",
    label: "experience",
  },
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/medal-3LwhWF9FljuwYiaXdGeIRVwaUNYcFb.png",
    value: "BDS Gold",
    label: "Medalist",
  },
  {
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/star-4uf4YwsvDdZERjEk4pshZ5Tbf9ecAf.png",
    value: "4.8",
    label: "Google Ratings",
  },
]

export function HeroSection() {
  const [showMore, setShowMore] = useState(false)

  return (
    <section className="relative w-full min-h-[420px] md:min-h-[480px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dentistmonali-cover-uQrtVgtO1qlTED27455ZFRg0PPWmKf.png"
          alt="Dr. Monali treating a patient"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 via-[#000000]/50 to-[#000000]/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full min-h-[420px] md:min-h-[480px] px-6 md:px-12 lg:px-16 py-8">
        {/* Top Navigation */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#ffffff]/80 hover:text-[#ffffff] transition-colors font-medium tracking-wide hidden md:block"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mt-auto">
          {/* Left: Profile + Name */}
          <div className="flex flex-col gap-4">
            {/* Profile Photo */}
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-[#ec4319] overflow-hidden relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/monali-dp-orange-5siXAhfLYhBm90dspydkgalQMcLkw3.png"
                alt="Dr. Monali Sengupta"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Name and description */}
            <div>
              <h1 className="text-3xl md:text-5xl font-normal text-[#ffffff] tracking-tight text-balance">
                Dr. Monali Sengupta
              </h1>
              <div className="mt-3 flex flex-wrap items-baseline gap-1">
                <p className="text-sm md:text-base text-[#d6d6d6]">
                  Pediatric dental surgeon practising in Kolkata since 2014.
                </p>
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-sm md:text-base font-semibold text-[#ffffff] underline underline-offset-2 hover:text-[#d6d6d6] transition-colors"
                >
                  {showMore ? "Read Less" : "Read More"}
                </button>
              </div>
              {showMore && (
                <div className="mt-3 max-w-xl space-y-2">
                  <p className="text-sm text-[#d6d6d6] leading-relaxed">
                    She specializes in child dentistry, having completed her MDS from KIIT University and is a gold
                    medalist in both BDS and MDS.
                  </p>
                  <p className="text-sm text-[#d6d6d6] leading-relaxed">
                    As a pediatric dental surgeon, she caters to the oral healthcare needs of child patients who require
                    extra care, behaviour management, and minimally invasive treatment approaches.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Badges */}
          <div className="flex items-center gap-4 md:gap-6">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1.5 bg-[#ffffff]/10 backdrop-blur-sm rounded-full px-4 py-4 md:px-5 md:py-5 min-w-[90px] md:min-w-[100px]"
              >
                <div className="relative w-8 h-8 md:w-10 md:h-10">
                  <Image
                    src={badge.icon}
                    alt={`${badge.value} ${badge.label}`}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs text-[#ffffff] font-medium text-center leading-tight">
                  {badge.value}
                </span>
                <span className="text-xs text-[#d6d6d6] text-center leading-tight">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
