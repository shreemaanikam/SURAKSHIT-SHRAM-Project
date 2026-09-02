import React, { useState } from 'react';
import {
  Server,
  ShieldCheck,
  Users,
  Activity,
  Lock,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  KeyRound,
  Search,
} from 'lucide-react';
import { AuditLogItem, UserProfile } from '../../types';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface AdminDashboardProps {
  currentUser: UserProfile;
  auditLogs: AuditLogItem[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  auditLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'rbac' | 'logs' | 'integrations' | 'algo'>('rbac');
  const [logFilter, setLogFilter] = useState('');

  const rbacMatrix = [
    {
      module: 'Company Compliance Self-Audit',
      company: 'Full Write',
      inspector: 'Read Only',
      government: 'Read Only',
      worker: 'No Access',
      admin: 'Full Manage',
    },
    {
      module: 'Statutory Document Upload & OCR',
      company: 'Upload & Edit',
      inspector: 'Read & Audit',
      government: 'Audit Access',
      worker: 'No Access',
      admin: 'Full Manage',
    },
    {
      module: 'Notices & Show-Cause Management',
      company: 'Receive & Reply',
      inspector: 'Draft & Serve',
      government: 'Approve & Issue',
      worker: 'No Access',
      admin: 'System Audit',
    },
    {
      module: 'Field Inspection Workflow & Geo-Tagging',
      company: 'Read Findings',
      inspector: 'Execute & Sign',
      government: 'Review & Assign',
      worker: 'No Access',
      admin: 'Full Manage',
    },
    {
      module: 'AI Predictive Risk Radar',
      company: 'Factor Summary',
      inspector: 'Assigned List',
      government: 'Macro Telemetry',
      worker: 'No Access',
      admin: 'Model Tuning',
    },
    {
      module: 'Worker Grievance Redressal',
      company: 'View Directives',
      inspector: 'Verify On-Site',
      government: 'Monitor SLA',
      worker: 'Lodge & Track',
      admin: 'System Audit',
    },
  ];

  const integrationServices = [
    {
      name: 'Shram Suvidha Single Window API',
      protocol: 'REST v4 / OAuth 2.0',
      status: 'healthy',
      latency: '34ms',
      uptime: '99.98%',
      lastSync: '2 mins ago',
    },
    {
      name: 'e-Shram National Worker Repository',
      protocol: 'Aadhaar e-Pramaan Tokenizer',
      status: 'healthy',
      latency: '68ms',
      uptime: '99.94%',
      lastSync: 'Continuous Webhook',
    },
    {
      name: 'EPFO / ESIC Electronic Challan Bridge',
      protocol: 'Batch Sync / SFTP Encrypted',
      status: 'healthy',
      latency: '112ms',
      uptime: '99.89%',
      lastSync: '10 mins ago',
    },
    {
      name: 'MoLE-IndLabourNet ML Inference Engine',
      protocol: 'gRPC Secure Cluster',
      status: 'healthy',
      latency: '24ms',
      uptime: '99.99%',
      lastSync: 'Real-time Telemetry',
    },
  ];

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(logFilter.toLowerCase()) ||
      l.userName.toLowerCase().includes(logFilter.toLowerCase()) ||
      l.ipAddress.toLowerCase().includes(logFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-purple-500 text-white shrink-0">
            <Server className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Central System Console & RBAC Matrix
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              National Informatics Centre (NIC) • Security Policy, RBAC & API Gateway Monitor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>All 4 Federal Integrations Healthy</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'rbac'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Role-Based Access Control (RBAC)
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'integrations'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Federal Integration Bridges
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'logs'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Security Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: RBAC Matrix */}
      {activeTab === 'rbac' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <CardTitle subtitle="Role permissions matrix enforced by Surakshit Shram gateway">
                System Role Permission Matrix (5 User Archetypes)
              </CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">System Module</th>
                      <th className="px-3 py-3.5">Company</th>
                      <th className="px-3 py-3.5">Inspector</th>
                      <th className="px-3 py-3.5">Government</th>
                      <th className="px-3 py-3.5">Worker</th>
                      <th className="px-3 py-3.5">Administrator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rbacMatrix.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-5 py-3.5 font-bold text-slate-900">{row.module}</td>
                        <td className="px-3 py-3.5">
                          <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                            {row.company}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                            {row.inspector}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                            {row.government}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="font-semibold text-orange-800 bg-orange-50 px-2 py-0.5 rounded text-[11px]">
                            {row.worker}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded text-[11px]">
                            {row.admin}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* TAB 2: Federal Integrations */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
          {integrationServices.map((service, idx) => (
            <Card key={idx}>
              <CardBody className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{service.name}</span>
                  <Badge size="sm" variant="success">
                    HEALTHY
                  </Badge>
                </div>
                <p className="text-xs font-mono text-slate-500">{service.protocol}</p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Latency</span>
                    <span className="font-bold text-slate-900">{service.latency}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Uptime</span>
                    <span className="font-bold text-emerald-700">{service.uptime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Last Check</span>
                    <span className="font-semibold text-slate-700">{service.lastSync}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: Security Audit Trail */}
      {activeTab === 'logs' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <Card>
            <CardHeader
              action={
                <div className="relative w-64">
                  <input
                    type="text"
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    placeholder="Search logs by user, action, IP..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              }
            >
              <CardTitle subtitle="Immutable compliance action log trail">
                Tamper-Evident System Audit Stream
              </CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">Timestamp</th>
                      <th className="px-4 py-3">User & Role</th>
                      <th className="px-4 py-3">Action Executed</th>
                      <th className="px-4 py-3">Entity Key</th>
                      <th className="px-4 py-3">IP Address</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 text-slate-500">{log.timestamp}</td>
                        <td className="px-4 py-3">
                          <strong className="text-slate-900 font-sans">{log.userName}</strong>
                          <span className="text-slate-400 block text-[10px] capitalize font-sans">
                            {log.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-800 font-sans font-medium">
                          {log.action}
                        </td>
                        <td className="px-4 py-3 text-amber-800">{log.targetEntity}</td>
                        <td className="px-4 py-3 text-slate-500">{log.ipAddress}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold">
                            {log.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};
