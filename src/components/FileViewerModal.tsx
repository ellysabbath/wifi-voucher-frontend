// src/components/FileViewerModal.tsx
import { useEffect, useMemo, useState } from "react";
import {
  X,
  Download,
  FileText,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface FileViewerModalProps {
  isOpen: boolean;
  title: string;
  /** Raw base64 string (no data: prefix) */
  base64: string;
  /** Original file name, e.g. "bible.pdf" */
  fileName: string;
  onClose: () => void;
}

type ViewKind = "pdf" | "image" | "text" | "unknown";

function detectKind(fileName: string): ViewKind {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"].includes(ext))
    return "image";
  if (["txt", "md", "csv", "log", "json", "xml", "html"].includes(ext))
    return "text";
  return "unknown";
}

function mimeForKind(kind: ViewKind, fileName: string): string {
  if (kind === "pdf") return "application/pdf";
  if (kind === "image") {
    const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
    if (ext === "png") return "image/png";
    if (ext === "gif") return "image/gif";
    if (ext === "webp") return "image/webp";
    if (ext === "bmp") return "image/bmp";
    if (ext === "svg") return "image/svg+xml";
    return "image/jpeg";
  }
  if (kind === "text") return "text/plain;charset=utf-8";
  return "application/octet-stream";
}

/**
 * Decode base64 → Uint8Array backed by a regular ArrayBuffer.
 * Fixes the TS 5.7+ `Uint8Array<ArrayBufferLike>` incompatibility with Blob.
 */
function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const byteChars = atob(b64);
  const buffer = new ArrayBuffer(byteChars.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < byteChars.length; i++) {
    bytes[i] = byteChars.charCodeAt(i);
  }
  return bytes as Uint8Array<ArrayBuffer>;
}

export default function FileViewerModal({
  isOpen,
  title,
  base64,
  fileName,
  onClose,
}: FileViewerModalProps) {
  const [blobUrl, setBlobUrl] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const kind = useMemo(() => detectKind(fileName), [fileName]);

  // Build Blob URL when modal opens
  useEffect(() => {
    if (!isOpen || !base64) return;

    setLoading(true);
    setError("");
    setBlobUrl("");
    setTextContent("");

    try {
      const bytes = base64ToBytes(base64);
      const mime = mimeForKind(kind, fileName);
      const blob = new Blob([bytes], { type: mime });

      if (kind === "text") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setTextContent(String(reader.result ?? ""));
          setLoading(false);
        };
        reader.onerror = () => {
          setError("Could not read the file.");
          setLoading(false);
        };
        reader.readAsText(blob);
      } else {
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setLoading(false);
      }
    } catch {
      setError("File is not a valid base64 payload.");
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, base64, fileName, kind]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  const handleDownload = () => {
    if (!base64) return;
    try {
      const bytes = base64ToBytes(base64);
      const mime = mimeForKind(kind, fileName);
      const blob = new Blob([bytes], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not download the file.");
    }
  };

  const handleOpenNewTab = () => {
    if (blobUrl) window.open(blobUrl, "_blank", "noopener,noreferrer");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50 flex-shrink-0">
          <div className="min-w-0 flex items-center gap-2">
            <FileText size={18} className="text-primary flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-bold text-gray-800 truncate">{title}</h3>
              <p className="text-xs text-gray-500 truncate">{fileName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {blobUrl && kind !== "text" && (
              <button
                type="button"
                onClick={handleOpenNewTab}
                className="p-2 hover:bg-gray-200 rounded-lg"
                title="Open in new tab"
              >
                <ExternalLink size={18} />
              </button>
            )}
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 hover:bg-gray-200 rounded-lg"
              title="Download"
            >
              <Download size={18} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden bg-gray-100">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-500 gap-2">
              <Loader2 className="animate-spin" size={20} /> Loading file…
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <AlertCircle size={40} className="text-red-500 mb-3" />
              <p className="text-gray-700 font-semibold mb-1">
                Could not display this file
              </p>
              <p className="text-sm text-gray-500 mb-4">{error}</p>
              <button
                onClick={handleDownload}
                className="bg-primary text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
              >
                <Download size={16} /> Download instead
              </button>
            </div>
          ) : kind === "pdf" ? (
            <iframe
              src={blobUrl}
              title={title}
              className="w-full h-full border-0"
            />
          ) : kind === "image" ? (
            <div className="h-full w-full flex items-center justify-center p-4 overflow-auto">
              <img
                src={blobUrl}
                alt={title}
                className="max-w-full max-h-full object-contain rounded shadow"
              />
            </div>
          ) : kind === "text" ? (
            <div className="h-full w-full overflow-auto p-4 bg-white">
              <pre className="text-sm whitespace-pre-wrap break-words font-mono text-gray-800">
                {textContent}
              </pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <FileText size={48} className="text-gray-400 mb-3" />
              <p className="text-gray-700 font-semibold mb-1">
                Preview not available
              </p>
              <p className="text-sm text-gray-500 mb-4">
                This file type cannot be previewed in the browser.
              </p>
              <button
                onClick={handleDownload}
                className="bg-primary text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
              >
                <Download size={16} /> Download to open
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}