"use client"

import React from "react"
import { useLanguage } from "./LanguageContext"
import { Language } from "@/lib/translations"
import { Globe, Volume2 } from "lucide-react"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language)
  }

  return (
    <div className="w-full bg-[#1e293b] text-white text-[11px] py-1.5 px-4 flex justify-between items-center border-b border-slate-700 select-none">
      {/* Accessibility left side */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 hover:text-amber-400 transition-colors">
          <Volume2 className="h-3 w-3" />
          <span>Screen Reader Access</span>
        </button>
        <div className="hidden sm:flex items-center gap-2 border-l border-slate-700 pl-4">
          <span>Text Size:</span>
          <button className="hover:text-amber-400 font-bold">A-</button>
          <button className="hover:text-amber-400 font-bold bg-slate-800 px-1 rounded">A</button>
          <button className="hover:text-amber-400 font-bold">A+</button>
        </div>
      </div>

      {/* Language Right Side dropdown */}
      <div className="flex items-center gap-2">
        <Globe className="h-3 w-3 text-slate-400" />
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-[#0f172a] text-white border border-slate-700 rounded px-2 py-0.5 outline-none font-medium cursor-pointer hover:border-slate-500 transition-colors"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="mr">मराठी (Marathi)</option>
        </select>
      </div>
    </div>
  )
}
