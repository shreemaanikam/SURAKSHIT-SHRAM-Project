"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Shield, Send } from "lucide-react"
import Link from "next/link"

const categories = [
  { id: "wages", label: "Wages & Salary", desc: "Non-payment, underpayment, deductions" },
  { id: "safety", label: "Safety & Health", desc: "Unsafe conditions, missing equipment" },
  { id: "harassment", label: "Harassment", desc: "Verbal, physical, or sexual harassment" },
  { id: "termination", label: "Wrongful Termination", desc: "Unfair dismissal or forced resignation" },
  { id: "other", label: "Other", desc: "Any other workplace issue" },
]

export default function NewGrievancePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [category, setCategory] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => router.push("/worker/grievances"), 2500)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <Send className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Grievance Filed</h2>
        <p className="text-sm text-slate-500 max-w-xs">
          Your complaint has been received. You will be notified of any updates. Your identity remains confidential.
        </p>
        <p className="text-xs text-slate-400">Redirecting you back…</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/worker/grievances" className="p-2 -ml-2 rounded-full hover:bg-slate-200">
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </Link>
        <h2 className="text-xl font-bold text-slate-900">File a Grievance</h2>
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="py-3 flex gap-3">
          <Shield className="h-5 w-5 text-green-700 shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">
            Your complaint is <strong>anonymous</strong>. Your name will not be disclosed to your employer.
            This is protected under the Factories Act.
          </p>
        </CardContent>
      </Card>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              s < step ? "bg-green-600 text-white" : s === step ? "bg-green-700 text-white" : "bg-slate-200 text-slate-500"
            }`}>{s}</div>
            {s < 3 && <div className={`h-0.5 w-8 ${s < step ? "bg-green-500" : "bg-slate-200"}`} />}
          </div>
        ))}
        <span className="ml-2 text-xs text-slate-500">
          {step === 1 ? "Category" : step === 2 ? "Details" : "Review"}
        </span>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What is your complaint about?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`w-full flex flex-col items-start px-5 py-4 border-b last:border-b-0 text-left transition-colors ${
                  category === cat.id ? "bg-green-50" : "hover:bg-slate-50"
                }`}
              >
                <span className={`text-sm font-semibold ${category === cat.id ? "text-green-800" : "text-slate-900"}`}>{cat.label}</span>
                <span className="text-xs text-slate-500 mt-0.5">{cat.desc}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Describe your complaint</CardTitle>
            <CardDescription>Provide as much detail as possible. Do not include your name.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Subject</label>
              <Input
                placeholder="e.g. Overtime wages not paid for 3 months"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                className="w-full min-h-[140px] p-3 text-sm border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30"
                placeholder="Describe what happened, when it started, and how it affects you..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-slate-400">{description.length} characters — be as specific as possible</p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review before submitting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-md space-y-2">
              <div>
                <p className="text-xs text-slate-500">Category</p>
                <p className="text-sm font-medium capitalize">{category}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Subject</p>
                <p className="text-sm font-medium">{subject}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed">{description}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              By submitting, you confirm this is a genuine complaint. False complaints may lead to action.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">Back</Button>
        )}
        {step < 3 ? (
          <Button
            className="flex-1 bg-green-700 hover:bg-green-800"
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 1 && !category) ||
              (step === 2 && (subject.length < 5 || description.length < 20))
            }
          >
            Continue
          </Button>
        ) : (
          <Button className="flex-1 bg-green-700 hover:bg-green-800" onClick={handleSubmit}>
            <Send className="h-4 w-4 mr-2" />Submit Grievance
          </Button>
        )}
      </div>
    </div>
  )
}
