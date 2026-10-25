import React, { useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  title,
  content,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FAF9F6] dark:bg-[#161614] text-[#202020] dark:text-[#EDEBE6] rounded-xs shadow-2xl border border-[#DDD9CE] dark:border-[#2C2A26] overflow-hidden p-6 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#E5E3DE] dark:border-[#2D2C28]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#8B2635] dark:text-[#E06371]" />
            <h3 className="font-display text-lg font-bold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#888] hover:text-black dark:hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 whitespace-pre-line text-sm leading-relaxed text-[#444] dark:text-[#CCC] font-sans">
          {content}
        </div>

        <div className="pt-3 border-t border-[#E5E3DE] dark:border-[#2D2C28] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#202020] dark:bg-[#EDEBE6] text-[#FAF9F6] dark:text-[#121211] text-xs font-semibold rounded-xs"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
