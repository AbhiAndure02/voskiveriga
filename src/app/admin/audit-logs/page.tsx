'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  adminEmail: string;
  entityType: string;
  entityId?: string | null;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadLogs = async () => {
      try {
        const res = await fetch('/api/admin/audit-logs?limit=100', { cache: 'no-store' });
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Failed to load audit logs');
        }

        if (!cancelled) {
          setLogs(json.data || []);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to load audit logs');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadLogs();
    const interval = window.setInterval(loadLogs, 10000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm mb-1">
            <Sparkles className="w-4 h-4" />
            <span>SECURITY AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Admin Audit Logs</h1>
          <p className="text-slate-300 text-sm mt-1">
            Administrator actions, product edits, coupon changes, and order modifications from the database.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Administrator</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    Loading live audit logs...
                  </td>
                </tr>
              )}

              {error && !isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-rose-600">
                    {error}
                  </td>
                </tr>
              )}

              {!error && !isLoading && logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    No audit logs found.
                  </td>
                </tr>
              )}

              {!error && !isLoading && logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-bold text-slate-900 font-mono text-xs text-blue-600">{log.action}</td>
                  <td className="px-6 py-4 text-slate-700">{log.adminEmail}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">
                    {log.entityType}{log.entityId ? ` #${log.entityId}` : ''}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
