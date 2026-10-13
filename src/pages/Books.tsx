// src/pages/Books.tsx
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Download,
  Search,
  Edit3,
  Loader2,
  X,
  Check,
  RefreshCw,
  Upload,
  FileText,
  BookOpen,
  Eye,
} from "lucide-react";

import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import FileViewerModal from "../components/FileViewerModal";
import { Skeleton, SkeletonText } from "../components/skeleton";

import { booksApi, type Book, type BookPayload } from "../lib/booksApi";

// =========================================================
// Types
// =========================================================
type BookFormState = {
  title: string;
  author: string;
  description: string;
  category: string;
  file: string;
  file_name: string;
};

const EMPTY_FORM: BookFormState = {
  title: "",
  author: "",
  description: "",
  category: "Faith",
  file: "",
  file_name: "",
};

type ConfirmState = {
  title: string;
  message: string;
  confirmLabel: string;
  variant: "danger" | "primary";
  onConfirm: () => Promise<void>;
};

type FlashState = {
  kind: "ok" | "err";
  text: string;
};

type ViewerState = {
  title: string;
  base64: string;
  fileName: string;
} | null;

// =========================================================
// Helpers
// =========================================================
function stripDataUrlPrefix(dataUrl: string): string {
  return dataUrl.replace(/^data:[^;]+;base64,/, "");
}

function downloadBase64File(
  b64: string,
  filename: string,
  mime = "application/octet-stream"
) {
  try {
    const byteChars = atob(b64);
    const buffer = new ArrayBuffer(byteChars.length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < byteChars.length; i++) {
      bytes[i] = byteChars.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    // Silently ignore
  }
}

// =========================================================
// Component
// =========================================================
export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BookFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [flash, setFlash] = useState<FlashState | null>(null);

  const [viewer, setViewer] = useState<ViewerState>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // =========================================================
  // Load
  // =========================================================
  const loadBooks = async () => {
    setLoading(true);
    setPageError("");
    try {
      const res = await booksApi.list({
        q: search || undefined,
        category: categoryFilter || undefined,
        page: 1,
        page_size: 200,
      });
      setBooks(res.results);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load books.";
      setPageError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 3500);
    return () => clearTimeout(t);
  }, [flash]);

  // =========================================================
  // Modal open/close
  // =========================================================
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalError("");
    setModalMode("create");
  };

  const openEdit = (b: Book) => {
    setForm({
      title: b.title,
      author: b.author,
      description: b.description ?? "",
      category: b.category,
      file: b.file,
      file_name: b.file_name,
    });
    setEditingId(b.id);
    setModalError("");
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalError("");
  };

  const openViewer = (b: Book) => {
    setViewer({
      title: b.title,
      base64: b.file,
      fileName: b.file_name,
    });
  };

  // =========================================================
  // File picker
  // =========================================================
  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setForm((f) => ({
        ...f,
        file: stripDataUrlPrefix(dataUrl),
        file_name: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  // =========================================================
  // Save
  // =========================================================
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!form.title.trim() || !form.author.trim()) {
      setModalError("Title and author are required.");
      return;
    }
    if (modalMode === "create" && !form.file) {
      setModalError("Please attach a file.");
      return;
    }
    if (!form.file_name.trim()) {
      setModalError("File name is required.");
      return;
    }

    setSaving(true);
    try {
      const payload: BookPayload = {
        title: form.title,
        author: form.author,
        description: form.description,
        category: form.category || "General",
        file: form.file,
        file_name: form.file_name,
      };

      if (modalMode === "create") {
        await booksApi.create(payload);
        setFlash({ kind: "ok", text: "Book added." });
      } else if (modalMode === "edit" && editingId) {
        await booksApi.update(editingId, payload);
        setFlash({ kind: "ok", text: "Book updated." });
      }

      closeModal();
      await loadBooks();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed.";
      setModalError(msg);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // Confirm
  // =========================================================
  const askConfirm = (opts: ConfirmState) => setConfirm(opts);

  const runConfirm = async () => {
    if (!confirm) return;
    setConfirmLoading(true);
    try {
      await confirm.onConfirm();
    } finally {
      setConfirmLoading(false);
      setConfirm(null);
    }
  };

  // =========================================================
  // Delete
  // =========================================================
  const handleDelete = (b: Book) => {
    askConfirm({
      title: "Delete book",
      message: `Are you sure you want to delete "${b.title}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await booksApi.remove(b.id);
          setFlash({ kind: "ok", text: "Book deleted." });
          await loadBooks();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Delete failed.";
          setFlash({ kind: "err", text: msg });
        }
      },
    });
  };

  // =========================================================
  // Render
  // =========================================================
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Books</h1>
        <button
          onClick={openCreate}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
        >
          <Plus size={18} /> Add Book
        </button>
      </div>

      {/* Flash */}
      {flash && (
        <div
          className={`mb-4 rounded-lg p-3 text-sm border ${
            flash.kind === "ok"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {flash.text}
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal
        isOpen={modalMode !== null}
        onClose={closeModal}
        title={modalMode === "create" ? "Add Book" : "Edit Book"}
      >
        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Author *</label>
            <input
              required
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Faith, Bible, Prophecy…"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Book file (PDF, EPUB, etc.) *
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm flex items-center gap-2 border rounded-lg px-3 py-2 hover:bg-gray-50"
              >
                <Upload size={14} /> Choose file
              </button>

              {form.file_name && (
                <span className="text-sm text-gray-700 flex items-center gap-2">
                  <FileText size={14} /> {form.file_name}
                </span>
              )}

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFilePick}
                className="hidden"
              />
            </div>
          </div>

          {modalError && (
            <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {modalError}
            </div>
          )}

          <div className="md:col-span-2 flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2"
            >
              <X size={16} /> Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Check size={16} /> Save
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={!!confirm}
        title={confirm?.title ?? ""}
        message={confirm?.message ?? ""}
        confirmLabel={confirm?.confirmLabel ?? "Confirm"}
        variant={confirm?.variant ?? "primary"}
        loading={confirmLoading}
        onConfirm={runConfirm}
        onClose={() => setConfirm(null)}
      />

      {/* File viewer modal */}
      <FileViewerModal
        isOpen={!!viewer}
        title={viewer?.title ?? ""}
        base64={viewer?.base64 ?? ""}
        fileName={viewer?.fileName ?? ""}
        onClose={() => setViewer(null)}
      />

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <input
            placeholder="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={loadBooks}
            className="border rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* ============ Grid — with Skeleton loading ============ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-4 flex gap-4"
            >
              {/* Left: book cover area */}
              <div className="w-20 h-28 rounded bg-gray-200 animate-pulse flex-shrink-0" />

              {/* Right: text block */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <Skeleton className="h-4 w-3/4 mb-2" />

                {/* Author */}
                <Skeleton className="h-3 w-1/2 mb-3" />

                {/* Category */}
                <Skeleton className="h-3 w-1/3 mb-3" />

                {/* Description — 2 lines */}
                <SkeletonText lines={2} className="mb-3" />

                {/* Actions row */}
                <div className="flex gap-3 flex-wrap">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>
            </div>
          ))
        ) : pageError ? (
          <div className="col-span-full p-6 text-red-600 text-sm">
            {pageError}
          </div>
        ) : books.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            No books found.
          </div>
        ) : (
          books.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-lg shadow p-4 flex gap-4"
            >
              <div className="w-20 h-28 rounded overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                <BookOpen size={28} className="text-gray-400" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{b.title}</h3>
                <p className="text-sm text-gray-500 truncate">{b.author}</p>
                <p className="text-xs text-gray-400 mt-1">{b.category}</p>
                <p className="text-sm mt-2 line-clamp-2">{b.description}</p>

                <div className="flex gap-3 mt-3 items-center flex-wrap">
                  <button
                    type="button"
                    onClick={() => openViewer(b)}
                    className="text-emerald-600 text-sm flex items-center gap-1 hover:underline"
                    title="Open and preview"
                  >
                    <Eye size={14} /> Open
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      downloadBase64File(
                        b.file,
                        b.file_name || `${b.title}.bin`
                      )
                    }
                    className="text-primary text-sm flex items-center gap-1 hover:underline"
                    title="Download"
                  >
                    <Download size={14} /> Download
                  </button>

                  <button
                    type="button"
                    onClick={() => openEdit(b)}
                    className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
                    title="Edit"
                  >
                    <Edit3 size={14} /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(b)}
                    className="text-red-500 text-sm flex items-center gap-1 hover:underline"
                    title="Delete"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}