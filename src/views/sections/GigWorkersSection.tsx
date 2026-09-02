import React, { useState } from 'react';
import { 
  Bike, 
  UserPlus, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Building,
  Clock,
  Briefcase,
  PieChart as PieChartIcon,
  BarChart2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface PlatformStat {
  name: string;
  count: number;
  status: 'Covered' | 'Partially covered';
  color: string;
}

export const GigWorkersSection: React.FC = () => {
  const [workerName, setWorkerName] = useState('');
  const [platform, setPlatform] = useState('Zomato');
  const [hoursWorked, setHoursWorked] = useState('');

  const [activeWorkersCount, setActiveWorkersCount] = useState(1247);
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);

  const [platformStats, setPlatformStats] = useState<PlatformStat[]>([
    { name: 'Zomato', count: 412, status: 'Covered', color: '#e23744' },
    { name: 'Swiggy', count: 389, status: 'Covered', color: '#fc8019' },
    { name: 'Uber', count: 256, status: 'Partially covered', color: '#000000' },
    { name: 'Ola', count: 190, status: 'Partially covered', color: '#2563eb' },
  ]);

  // Benefit category distribution
  const benefitDistribution = [
    { name: 'Accident & Disability', value: 45, color: '#3b82f6' },
    { name: 'Health Insurance (ESIC)', value: 30, color: '#10b981' },
    { name: 'Maternity/Paternity', value: 15, color: '#ec4899' },
    { name: 'Pension & Old Age', value: 10, color: '#8b5cf6' },
  ];

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim() || !hoursWorked.trim()) return;

    // Update counts
    setActiveWorkersCount((prev) => prev + 1);
    setPlatformStats((prev) =>
      prev.map((p) =>
        p.name.toLowerCase() === platform.toLowerCase()
          ? { ...p, count: p.count + 1 }
          : p
      )
    );

    const message = `✅ ${workerName} enrolled on ${platform}! Hours: ${hoursWorked} hrs/month.`;
    setEnrollSuccessMessage(message);

    // Reset inputs
    setWorkerName('');
    setHoursWorked('');
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          For Gig Workers
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Track gig workers across platforms and ensure social security coverage
        </p>
      </div>

      {/* 📊 GIG WORKER VISUAL CHARTS & METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform Share Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                Active Gig Workers by Platform
              </h4>
              <p className="text-[11px] text-slate-500">Live platform aggregator sync</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {activeWorkersCount} Enrolled
            </span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" name="Enrolled Workers" radius={[4, 4, 0, 0]}>
                  {platformStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Social Security Fund Allocation Pie Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="border-b border-slate-100 pb-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <PieChartIcon className="w-4 h-4 text-purple-600" />
              Social Security Fund Scheme Allocation
            </h4>
            <p className="text-[11px] text-slate-500">Code on Social Security (Section 114 fund pool)</p>
          </div>
          <div className="h-52 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={benefitDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {benefitDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value}% Pool`, 'Allocation']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconSize={8}
                  formatter={(value) => <span className="text-[10px] text-slate-700 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Gig Worker Overview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bike className="w-5 h-5 text-blue-600" />
              <span>Gig Worker Overview</span>
            </h3>
          </div>

          {/* Top 2 Stat Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stat 1: Active Gig Workers */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                ACTIVE GIG WORKERS
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {activeWorkersCount.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 block">
                Across all platforms
              </span>
            </div>

            {/* Stat 2: Social Security Coverage */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                SOCIAL SECURITY COVERAGE
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
                78%
              </div>
              <span className="text-[11px] text-slate-500 block">
                Target: 100% by December 2026
              </span>
            </div>
          </div>

          {/* Platform-wise Breakdown */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Platform-wise Breakdown
            </h4>
            <div className="space-y-2">
              {platformStats.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between p-3 bg-slate-50/80 rounded-lg border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span>{p.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-700">
                      {p.count.toLocaleString()} workers
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'Covered'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {p.status === 'Covered' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{p.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Enroll Gig Worker */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span>Enroll Gig Worker</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add a new gig worker to the system
            </p>
          </div>

          <form onSubmit={handleEnroll} className="space-y-4">
            {/* Worker Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Worker Name
              </label>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder="Enter worker name"
                required
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs"
              />
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs"
              >
                <option value="Zomato">Zomato</option>
                <option value="Swiggy">Swiggy</option>
                <option value="Uber">Uber</option>
                <option value="Ola">Ola</option>
                <option value="Zepto">Zepto</option>
                <option value="Blinkit">Blinkit</option>
                <option value="Urban Company">Urban Company</option>
              </select>
            </div>

            {/* Hours Worked (This Month) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hours Worked (This Month)
              </label>
              <input
                type="number"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                placeholder="enter hours"
                required
                min="1"
                max="300"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs font-mono"
              />
            </div>

            {/* Enroll Worker Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Enroll Worker</span>
              </button>
            </div>
          </form>

          {/* Success Message Alert */}
          {enrollSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{enrollSuccessMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
