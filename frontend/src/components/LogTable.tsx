import React, { useRef } from 'react';
import { SystemLog } from '../types';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTranslation } from 'react-i18next';

interface LogTableProps {
  logs: SystemLog[];
}

const LogTable: React.FC<LogTableProps> = ({ logs }) => {
  const { t } = useTranslation();
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: logs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // Estimated row height in pixels
    overscan: 10,
  });

  return (
    <div className="p-4">
      {/* Scrollable Container with fixed height for virtualization */}
      <div
        ref={parentRef}
        className="w-full h-[600px] overflow-auto border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-inner bg-white dark:bg-neutral-900"
      >
        <table className="w-full min-w-[800px] text-left border-collapse relative">
          <thead className="sticky top-0 bg-neutral-100 dark:bg-neutral-800 z-10 shadow-sm">
            <tr className="text-neutral-600 dark:text-neutral-400 text-sm border-b border-neutral-200 dark:border-neutral-700">
              <th className="py-3 px-4 font-semibold">Zaman</th>
              <th className="py-3 px-4 font-semibold">Seviye</th>
              <th className="py-3 px-4 font-semibold">Modül</th>
              <th className="py-3 px-4 font-semibold">Mesaj</th>
            </tr>
          </thead>
          <tbody
            className="font-mono text-sm"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-neutral-500 font-medium">
                  {t('logs.empty')}
                </td>
              </tr>
            ) : (
              virtualizer.getVirtualItems().map((virtualRow) => {
                const log = logs[virtualRow.index];
                return (
                  <tr
                    key={log.id}
                    className="border-b border-neutral-100 dark:border-neutral-700/50 hover:bg-neutral-50 dark:hover:bg-neutral-700/20 transition-colors absolute w-full left-0 top-0"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        log.level === 'ERROR' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                        log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                      }`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-blue-600 dark:text-blue-300 font-medium">{log.module}</td>
                    <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">{log.message}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogTable;
