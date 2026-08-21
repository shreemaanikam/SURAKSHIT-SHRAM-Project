"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building2, Landmark, HardHat, ShieldCheck, ShoppingBag, MessageSquareWarning, ArrowRight } from "lucide-react"
import GovernmentEmblem from "@/components/GovernmentEmblem"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { useLanguage } from "@/components/LanguageContext"

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [selectedPortal, setSelectedPortal] = useState("government")
  const [username, setUsername] = useState("demo-user")
  const [password, setPassword] = useState("••••••••")
  const [loading, setLoading] = useState(false)

  const PORTALS = [
    {
      id: "government",
      label: t.govPortal,
      icon: Landmark,
      description: t.govDesc,
      href: "/government/dashboard",
      badge: t.officialOnly,
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
    {
      id: "company",
      label: t.companyPortal,
      icon: Building2,
      description: t.companyDesc,
      href: "/company/dashboard",
      badge: t.employer,
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      id: "small-business",
      label: t.msmePortal,
      icon: ShoppingBag,
      description: t.msmeDesc,
      href: "/small-business/dashboard",
      badge: t.msme,
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    {
      id: "gig-worker",
      label: t.gigPortal,
      icon: HardHat,
      description: t.gigDesc,
      href: "/gig-worker/dashboard",
      badge: t.eshram,
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      id: "complaint",
      label: t.complaintPortal,
      icon: MessageSquareWarning,
      description: t.complaintDesc,
      href: "/worker/grievances",
      badge: t.anonymous,
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    },
  ]

  const activePortal = PORTALS.find((p) => p.id === selectedPortal)!

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (selectedPortal === "government" && (username.toLowerCase().includes("inspector") || username.toLowerCase().includes("rajesh"))) {
        router.push("/inspector/dashboard")
      } else {
        router.push(activePortal.href)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Language / Accessibility Header */}
      <LanguageSwitcher />

      {/* Saffron and Green highlight accents at top */}
      <div className="h-1.5 flex shrink-0">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-[#FFFFFF]" />
        <div className="flex-1 bg-[#128807]" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-5xl grid gap-8 md:grid-cols-12 items-center">
          {/* Brand/Gateway Info - Left Column */}
          <div className="md:col-span-6 space-y-6 text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <div className="p-1 bg-white rounded-full shadow-md border border-amber-500/30">
                <GovernmentEmblem className="h-20 w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Badge variant="outline" className="border-amber-600/30 bg-amber-50 text-amber-800 font-bold text-[10px] tracking-wide uppercase px-2.5 py-0.5 rounded-full">
                  {t.goi}
                </Badge>
                <Badge variant="outline" className="border-blue-600/30 bg-blue-50 text-blue-800 font-bold text-[10px] tracking-wide uppercase px-2.5 py-0.5 rounded-full">
                  {t.ministry}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                {t.title} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
                  COMPLIANCE GATEWAY
                </span>
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto md:mx-0">
                {t.subtitle}. Designed to ensure workplace safety, verify wage records, and protect worker welfare.
              </p>
            </div>

            {/* Quick Stats or Features */}
            <div className="grid grid-cols-3 gap-4 pt-2 max-w-md mx-auto md:mx-0">
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-700 leading-none">4.1K+</p>
                <p className="text-[10px] text-slate-400 mt-1">Registries</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-700 leading-none">99.2%</p>
                <p className="text-[10px] text-slate-400 mt-1">AI Verified</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-700 leading-none">Form 26</p>
                <p className="text-[10px] text-slate-400 mt-1">Standards</p>
              </div>
            </div>
          </div>

          {/* Portal Sign-in Form - Right Column */}
          <div className="md:col-span-6 space-y-4">
            <Card className="shadow-md border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-slate-800">{t.gatewayTitle}</CardTitle>
                <CardDescription className="text-xs">{t.gatewayDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Grid of the 5 separate sections */}
                <div className="grid gap-2">
                  {PORTALS.map((portal) => {
                    const Icon = portal.icon
                    const isSelected = selectedPortal === portal.id
                    return (
                      <button
                        key={portal.id}
                        onClick={() => {
                          setSelectedPortal(portal.id)
                          // Automatically set a sensible default username when clicking the portal
                          if (portal.id === "government") setUsername("official")
                          else if (portal.id === "company") setUsername("acme")
                          else if (portal.id === "small-business") setUsername("apex")
                          else if (portal.id === "gig-worker") setUsername("ramesh")
                          else if (portal.id === "complaint") setUsername("worker")
                        }}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-2 border-blue-600 bg-blue-50/50 shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-slate-800 leading-tight">{portal.label}</p>
                            <Badge variant="outline" className={`text-[9px] font-bold px-1.5 py-0 rounded ${portal.badgeColor}`}>
                              {portal.badge}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{portal.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Login fields */}
                <form onSubmit={handleLogin} className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label htmlFor="login-username" className="text-xs font-semibold text-slate-600">{t.userIdLabel}</label>
                      <Input
                        id="login-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="h-9 text-xs"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="login-password" className="text-xs font-semibold text-slate-600">{t.passwordLabel}</label>
                      <Input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-9 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold h-10 mt-1" disabled={loading}>
                    {loading ? t.signingIn : `${t.signInBtn}`}
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </form>

                {/* Quick demo roles credentials panel */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-2">
                  <p className="text-xs font-bold text-slate-700">Quick Role Access / Demo Login Credentials:</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => { setSelectedPortal("government"); setUsername("official"); }}
                      className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Government Official
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedPortal("government"); setUsername("inspector"); }}
                      className="bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Field Inspector
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedPortal("company"); setUsername("acme"); }}
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Company Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedPortal("small-business"); setUsername("apex"); }}
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Small Business (MSME)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedPortal("gig-worker"); setUsername("ramesh"); }}
                      className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Gig Worker Portal
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedPortal("complaint"); setUsername("worker"); }}
                      className="bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Worker Complaint Center
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
