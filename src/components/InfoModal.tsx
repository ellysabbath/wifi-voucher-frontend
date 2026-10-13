// src/components/InfoModal.tsx
import { Info, CheckCircle2, X } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  variant?: "info" | "success";
  onClose: () => void;
}

export default function InfoModal({
  isOpen,
  title,
  children,
  variant = "info",
  onClose,
}: InfoModalProps) {
  if (!isOpen) return null;

  const iconWrapClasses =
    variant === "success"
      ? "bg-green-100 text-green-600"
      : "bg-primary/10 text-primary";

  const Icon = variant === "success" ? CheckCircle2 : Info;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${iconWrapClasses}`}
            >
              <Icon size={22} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
              <div className="text-sm text-gray-700 space-y-2">{children}</div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}