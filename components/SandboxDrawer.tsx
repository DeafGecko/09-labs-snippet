'use client';

import { useState } from 'react';
import { X, Terminal, Play, RefreshCw } from 'lucide-react';

interface SandboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SandboxDrawer({ isOpen, onClose }: SandboxDrawerProps) {
  const [inputCode, setInputCode] = useState('// Type JavaScript or CSS test code here\nconsole.log("09 Labs Sandbox Active");');
  const [outputLog, setOutputLog] = useState<string[]>(['Ready for execution...']);

  if (!isOpen) return null;

  const handleRunCode = () => {
    try {
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
      
      // eslint-disable-next-line no-eval
      eval(inputCode);
      
      console.log = originalLog;
      setOutputLog(logs.length > 0 ? logs : ['Execution completed with no console output.']);
    } catch (err: any) {
      setOutputLog([`Error: ${err.message}`]);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <button 
        type="button" 
        onClick={onClose} 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" 
        aria-label="Close sandbox"
      />

      <div className="relative z-10 w-full max-w-2xl h-[85vh] rounded-3xl bg-[var(--bg-surface)] border border-[var(--border)] p-6 md:p-8 shadow-2xl flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Component Sandbox</h2>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--bg-active)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-4 py-4 overflow-y-auto">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Live Scratchpad</label>
              <button 
                onClick={handleRunCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Code</span>
              </button>
            </div>
            <textarea 
              rows={5}
              value={inputCode}
              onChange={e => setInputCode(e.target.value)}
              className="w-full p-4 rounded-xl bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border)] font-mono text-xs resize-y focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Console Output</label>
              <button 
                onClick={() => setOutputLog(['Cleared output.'])}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
            <textarea 
              readOnly
              rows={4}
              value={outputLog.join('\n')}
              className="w-full p-4 rounded-xl bg-[var(--bg-main)] text-[var(--text-primary)] border border-[var(--border)] font-mono text-xs resize-y focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)] text-center shrink-0">
          Test snippets safely in your local browser runtime.
        </div>
      </div>
    </div>
  );
}