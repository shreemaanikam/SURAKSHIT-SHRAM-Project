import React from 'react';

interface GovLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const GovLogo: React.FC<GovLogoProps> = ({
  className = '',
  size = 48,
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Ashoka Emblem SVG */}
      <div 
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size * 1.25 }}
      >
        <svg
          viewBox="0 0 100 125"
          className="w-full h-full text-slate-800"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ashoka Stambh / State Emblem of India representation */}
          {/* Top Lion Crests */}
          <path
            d="M 50,5 C 45,5 41,8 40,12 C 37,11 32,12 30,16 C 28,20 29,25 32,28 C 30,30 29,34 31,37 C 33,40 37,42 41,41 C 43,45 47,47 50,47 C 53,47 57,45 59,41 C 63,42 67,40 69,37 C 71,34 70,30 68,28 C 71,25 72,20 70,16 C 68,12 63,11 60,12 C 59,8 55,5 50,5 Z"
            className="text-amber-700"
          />
          {/* Center Lion Head details */}
          <path
            d="M 44,18 C 44,16 46,14 50,14 C 54,14 56,16 56,18 C 56,22 54,24 50,24 C 46,24 44,22 44,18 Z"
            fill="#ffffff"
            opacity="0.85"
          />
          <circle cx="47" cy="18" r="1.5" fill="#1e293b" />
          <circle cx="53" cy="18" r="1.5" fill="#1e293b" />
          <path d="M 48,21 L 52,21 L 50,23 Z" fill="#b45309" />
          
          {/* Left Lion details */}
          <circle cx="35" cy="22" r="1.2" fill="#ffffff" />
          <circle cx="35" cy="22" r="0.7" fill="#1e293b" />
          
          {/* Right Lion details */}
          <circle cx="65" cy="22" r="1.2" fill="#ffffff" />
          <circle cx="65" cy="22" r="0.7" fill="#1e293b" />

          {/* Mane and pillar torso */}
          <path
            d="M 36,36 C 36,44 42,50 50,50 C 58,50 64,44 64,36 C 62,38 58,40 50,40 C 42,40 38,38 36,36 Z"
            className="text-amber-800"
          />

          {/* Abacus Base Platform */}
          <rect x="22" y="52" width="56" height="7" rx="1.5" className="text-amber-800" />
          
          {/* Central Ashoka Chakra on Abacus */}
          <circle cx="50" cy="67" r="9" fill="none" stroke="#1d4ed8" strokeWidth="1.8" />
          <circle cx="50" cy="67" r="2" fill="#1d4ed8" />
          {/* Chakra Spokes (24 simplified to 12) */}
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="67"
              x2={50 + 8 * Math.cos((i * 30 * Math.PI) / 180)}
              y2={67 + 8 * Math.sin((i * 30 * Math.PI) / 180)}
              stroke="#1d4ed8"
              strokeWidth="0.8"
            />
          ))}

          {/* Bull on left of abacus */}
          <path
            d="M 28,64 Q 31,61 34,64 Q 35,68 31,69 Q 27,67 28,64 Z"
            className="text-amber-900"
          />
          {/* Horse on right of abacus */}
          <path
            d="M 66,64 Q 69,61 72,64 Q 73,68 69,69 Q 65,67 66,64 Z"
            className="text-amber-900"
          />

          {/* Lower Bell Capital / Lotus Base */}
          <path
            d="M 20,78 C 24,73 34,71 50,71 C 66,71 76,73 80,78 L 76,84 C 64,82 56,82 50,82 C 44,82 36,82 24,84 Z"
            className="text-amber-700"
          />

          {/* Satyameva Jayate (सत्यमेव जयते) Inscription Banner */}
          <rect x="16" y="87" width="68" height="12" rx="2" fill="#0f172a" />
          <text
            x="50"
            y="95.5"
            textAnchor="middle"
            fill="#f8fafc"
            fontSize="6"
            fontFamily="serif"
            fontWeight="bold"
            letterSpacing="0.4"
          >
            सत्यमेव जयते
          </text>

          {/* Govt Motto subtitle */}
          <text
            x="50"
            y="107"
            textAnchor="middle"
            fill="#475569"
            fontSize="4.5"
            fontWeight="bold"
            fontFamily="sans-serif"
            letterSpacing="0.8"
          >
            GOVT OF INDIA
          </text>
        </svg>
      </div>

      {/* Official Government of India Text */}
      {showText && (
        <div className="leading-tight">
          <div className="text-[11px] font-black tracking-widest text-[#0A192F] uppercase font-sans">
            GOVERNMENT OF INDIA
          </div>
          <div className="text-[10px] font-extrabold text-[#D95D00] uppercase tracking-wide">
            श्रम एवं रोजगार मंत्रालय
          </div>
          <div className="text-[10px] font-bold text-[#138808]">
            Ministry of Labour & Employment
          </div>
        </div>
      )}
    </div>
  );
};
