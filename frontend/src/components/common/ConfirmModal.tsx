import React from "react";
import { AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="relative w-full max-w-sm md:max-w-md bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-[#ECA468]/10 animate-in zoom-in-95 duration-300">
        <div className="px-6 md:px-8 py-6 md:py-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 md:w-20 md:h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 md:mb-6">
            <AlertCircle className="w-6 h-6 md:w-10 md:h-10" />
          </div>
          <h2 className="text-xl md:text-3xl font-black text-gray-900 leading-tight mb-2 tracking-tight">{title}</h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="px-6 md:px-8 py-4 md:py-8 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-2 md:gap-4">
          <button 
            onClick={onCancel} 
            className="flex-1 px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl bg-white text-gray-500 font-black text-[8px] md:text-xs uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 px-4 md:px-10 py-2 md:py-4 rounded-xl md:rounded-2xl bg-red-500 text-white font-black text-[8px] md:text-xs uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-95 hover:-translate-y-0.5"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
