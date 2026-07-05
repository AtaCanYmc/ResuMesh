import React from 'react';
import { SystemLog } from '../types';

interface LogTableProps {
  logs: SystemLog[];
}

const LogTable: React.FC<LogTableProps> = ({ logs }) => {
  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-neutral-400 text-sm border-b border-neutral-700">
            <th className="pb-3 font-medium">Zaman</th>
            <th className="pb-3 font-medium">Seviye</th>
            <th className="pb-3 font-medium">Modül</th>
            <th className="pb-3 font-medium">Mesaj</th>
          </tr>
        </thead>
        <tbody className="font-mono text-sm">
          {logs.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-neutral-500">
                Gösterilecek log bulunamadı.
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id} className="border-b border-neutral-700/50 hover:bg-neutral-700/20 transition-colors">
                <td className="py-3 pr-4 text-neutral-400 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString('tr-TR')}
                </td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    log.level === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                    log.level === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {log.level}
                  </span>
                </td>
                <td className="py-3 pr-4 text-blue-300">{log.module}</td>
                <td className="py-3 text-neutral-300">{log.message}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
