// src/components/ConfirmModal.tsx
import { AlertTriangle, Loader2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const confirmClasses =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-primary hover:bg-primary-dark text-white";

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
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                variant === "danger"
                  ? "bg-red-100 text-red-600"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <AlertTriangle size={22} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {message}
              </p>
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

        <div className="px-6 py-4 bg-gray-50 border-t flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-60 ${confirmClasses}`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Please wait…
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}