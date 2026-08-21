import React from "react"

export default function GovernmentEmblem({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circular frame */}
      <circle cx="50" cy="50" r="46" stroke="#D97706" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="42" stroke="#1E3A8A" strokeWidth="1" strokeDasharray="3 3" />
      
      {/* Tricolour gradients in background */}
      <path d="M12 50 C 12 25, 88 25, 88 50 C 88 75, 12 75, 12 50 Z" fill="url(#tricolour-grad)" opacity="0.15" />

      {/* Stylized Ashoka Chakra */}
      <circle cx="50" cy="50" r="16" stroke="#1E3A8A" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="3" fill="#1E3A8A" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24
        const radians = (angle * Math.PI) / 180
        const x2 = 50 + 16 * Math.cos(radians)
        const y2 = 50 + 16 * Math.sin(radians)
        return (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={x2}
            y2={y2}
            stroke="#1E3A8A"
            strokeWidth="0.75"
          />
        )
      })}

      {/* Stylized Lion Capital Silhouette / Representation */}
      <path
        d="M42 35 C42 28, 45 22, 50 22 C55 22, 58 28, 58 35 C58 42, 56 46, 50 46 C44 46, 42 42, 42 35 Z"
        fill="#D97706"
        opacity="0.8"
      />
      <path
        d="M46 32 C46 29, 48 27, 50 27 C52 27, 54 29, 54 32 C54 35, 52 38, 50 38 C48 38, 46 35, 46 32 Z"
        fill="#FFFFFF"
      />
      <path
        d="M48 44 L52 44 L53 50 L47 50 Z"
        fill="#B45309"
      />
      
      {/* Base Pedestal */}
      <path
        d="M32 68 L68 68 L64 74 L36 74 Z"
        fill="#1E3A8A"
      />
      <rect x="36" y="74" width="28" height="4" fill="#D97706" rx="1" />

      {/* Satyamev Jayate Text Representation (Devenagari script aesthetic lines) */}
      <path
        d="M40 82 H60 M44 86 H56"
        stroke="#1E3A8A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <defs>
        <linearGradient id="tricolour-grad" x1="50" y1="12" x2="50" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF9933" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#128807" />
        </linearGradient>
      </defs>
    </svg>
  )
}
