"use client"

import { useState } from "react"
import Image from "next/image"

const navLinks = [
  { label: "About Doctor Monali", href: "#about" },
  { label: "Appointments", href: "#appointments" },
  { label: "Reviews", href: "#reviews" },
]

interface HeroSectionProps {
  doctor: {
    name: string
    shortDescription: string
    longDescription: string[]
    profileImage: string
    coverImage: string
  }
  badges: {
    icon: string
    value: string
    label: string
  }[]
}

export function HeroSection({ doctor, badges }: HeroSectionProps) {
  const [showMore, setShowMore] = useState(false)

  return (
    <section className="relative w-full min-h-[420px] md:min-h-[480px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={doctor.coverImage}
          alt={`${doctor.name} treating a patient`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 via-[#000000]/50 to-[#000000]/30" />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full min-h-[420px] md:min-h-[480px] px-6 md:px-12 lg:px-16 py-8">
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

        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mt-auto">
          <div className="flex flex-col gap-4">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-[#ec4319] overflow-hidden relative">
              <Image
                src={doctor.profileImage}
                alt={doctor.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-normal text-[#ffffff] tracking-tight text-balance">
                {doctor.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-baseline gap-1">
                <p className="text-sm md:text-base text-[#d6d6d6]">
                  {doctor.shortDescription}
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
                  {doctor.longDescription.map((paragraph, i) => (
                    <p key={i} className="text-sm text-[#d6d6d6] leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1.5 bg-[#ffffff]/10 backdrop-blur-sm rounded-full px-4 py-4 md:px-5 md:py-5 min-w-[90px] md:min-w-[100px]"
              >
                {badge.icon.startsWith("http") ? (
                  <div className="relative w-8 h-8 md:w-10 md:h-10">
                    <Image
                      src={badge.icon}
                      alt={`${badge.value} ${badge.label}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-2xl md:text-3xl leading-none">{badge.icon}</span>
                )}
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
