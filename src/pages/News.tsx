// src/pages/News.tsx
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Search,
  Edit3,
  Loader2,
  X,
  Check,
  RefreshCw,
  Eye,
  Upload,
  Image as ImageIcon,
  User as UserIcon,
  Calendar as CalIcon,
  Tag,
  FileText,
} from "lucide-react";

import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import { Skeleton, SkeletonText } from "../components/skeleton";

import {
  newsApi,
  type NewsItem,
  type NewsCategory,
  type NewsPayload,
} from "../lib/newsApi";

// =========================================================
// Constants
// =========================================================
const CATEGORIES: {
  value: NewsCategory;
  label: string;
  badge: string;
}[] = [
  {
    value: "announcement",
    label: "Announcement",
    badge: "bg-blue-100 text-blue-700",
  },
  { value: "event", label: "Event", badge: "bg-green-100 text-green-700" },
  { value: "news", label: "News", badge: "bg-orange-100 text-orange-700" },
];

const CATEGORY_BADGE: Record<NewsCategory, string> = {
  announcement: "bg-blue-100 text-blue-700",
  event: "bg-green-100 text-green-700",
  news: "bg-orange-100 text-orange-700",
};

const CATEGORY_LABEL: Record<NewsCategory, string> = {
  announcement: "Announcement",
  event: "Event",
  news: "News",
};

type NewsFormState = {
  title: string;
  content: string;
  image: string;        // raw base64
  imagePreview: string; // data URL for preview
  category: NewsCategory;
  is_published: boolean;
};

const EMPTY_FORM: NewsFormState = {
  title: "",
  content: "",
  image: "",
  imagePreview: "",
  category: "announcement",
  is_published: true,
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

// =========================================================
// Helpers
// =========================================================
function stripDataUrlPrefix(dataUrl: string): string {
  return dataUrl.replace(/^data:[^;]+;base64,/, "");
}

function base64ToDataUrl(b64: string | null, mime = "image/jpeg"): string {
  if (!b64) return "";
  if (b64.startsWith("data:")) return b64;
  return `data:${mime};base64,${b64}`;
}

function prettyDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

function prettyDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

// =========================================================
// Component
// =========================================================
export default function News() {
  // list
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<NewsCategory | "">("");
  const [publishedFilter, setPublishedFilter] = useState<"" | "true" | "false">(
    ""
  );

  // create / edit
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewsFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // view
  const [viewItem, setViewItem] = useState<NewsItem | null>(null);

  // confirm
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // flash
  const [flash, setFlash] = useState<FlashState | null>(null);

  // refs
  const imageInputRef = useRef<HTMLInputElement>(null);

  // =========================================================
  // Load
  // =========================================================
  const loadNews = async () => {
    setLoading(true);
    setPageError("");
    try {
      const res = await newsApi.list({
        q: search || undefined,
        category: categoryFilter || undefined,
        published:
          publishedFilter === "" ? undefined : publishedFilter === "true",
        page: 1,
        page_size: 200,
      });
      setItems(res.results);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load news.";
      setPageError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter, publishedFilter]);

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

  const openEdit = (n: NewsItem) => {
    setForm({
      title: n.title,
      content: n.content,
      image: n.image ?? "",
      imagePreview: n.image ? base64ToDataUrl(n.image) : "",
      category: n.category,
      is_published: n.is_published,
    });
    setEditingId(n.id);
    setModalError("");
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalError("");
  };

  const openView = (n: NewsItem) => setViewItem(n);

  // =========================================================
  // Image picker
  // =========================================================
  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setModalError("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setForm((f) => ({
        ...f,
        image: stripDataUrlPrefix(dataUrl),
        imagePreview: dataUrl,
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

    if (!form.title.trim()) {
      setModalError("Title is required.");
      return;
    }
    if (!form.content.trim()) {
      setModalError("Content is required.");
      return;
    }

    setSaving(true);
    try {
      const payload: NewsPayload = {
        title: form.title.trim(),
        content: form.content.trim(),
        image: form.image || null,
        category: form.category,
        is_published: form.is_published,
      };

      if (modalMode === "create") {
        await newsApi.create(payload);
        setFlash({ kind: "ok", text: "Article created." });
      } else if (modalMode === "edit" && editingId) {
        await newsApi.update(editingId, payload);
        setFlash({ kind: "ok", text: "Article updated." });
      }

      closeModal();
      await loadNews();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed.";
      setModalError(msg);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // Confirm helper
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
  const handleDelete = (n: NewsItem) => {
    askConfirm({
      title: "Delete article",
      message: `Delete "${n.title}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await newsApi.remove(n.id);
          setFlash({ kind: "ok", text: "Article deleted." });
          await loadNews();
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
        <h1 className="text-3xl font-bold">News and Announcements</h1>
        <button
          onClick={openCreate}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
        >
          <Plus size={18} /> Add Article
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

      {/* ============ CREATE / EDIT MODAL ============ */}
      <Modal
        isOpen={modalMode !== null}
        onClose={closeModal}
        title={modalMode === "create" ? "Add Article" : "Edit Article"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Content *
            </label>
            <textarea
              required
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as NewsCategory,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <input
                id="news-published"
                type="checkbox"
                checked={form.is_published}
                onChange={(e) =>
                  setForm({ ...form, is_published: e.target.checked })
                }
              />
              <label htmlFor="news-published" className="text-sm">
                Published
              </label>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Image (optional)
            </label>
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
                {form.imagePreview ? (
                  <img
                    src={form.imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={28} className="text-gray-300" />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="text-sm flex items-center gap-2 border rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                  <Upload size={14} /> Choose image
                </button>
                {form.image && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, image: "", imagePreview: "" }))
                    }
                    className="text-xs text-red-600 hover:underline self-start"
                  >
                    Remove image
                  </button>
                )}
              </div>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImagePick}
                className="hidden"
              />
            </div>
          </div>

          {modalError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {modalError}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t">
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

      {/* ============ VIEW DETAILS MODAL ============ */}
      {viewItem && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setViewItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div className="min-w-0">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${
                    CATEGORY_BADGE[viewItem.category]
                  }`}
                >
                  {CATEGORY_LABEL[viewItem.category]}
                </span>
                <h2 className="text-xl font-bold text-gray-800">
                  {viewItem.title}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {viewItem.is_published ? "Published" : "Draft"}
                </p>
              </div>
              <button
                onClick={() => setViewItem(null)}
                className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {viewItem.image && (
                <div className="rounded-xl overflow-hidden border">
                  <img
                    src={base64ToDataUrl(viewItem.image)}
                    alt={viewItem.title}
                    className="w-full max-h-96 object-contain bg-gray-50"
                  />
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Content
                </h3>
                <p className="text-gray-800 whitespace-pre-line">
                  {viewItem.content || "—"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow
                  icon={<UserIcon size={16} className="text-primary" />}
                  label="Author"
                  value={viewItem.author_email || "—"}
                />
                <DetailRow
                  icon={<Tag size={16} className="text-primary" />}
                  label="Category"
                  value={CATEGORY_LABEL[viewItem.category]}
                />
                <DetailRow
                  icon={<CalIcon size={16} className="text-primary" />}
                  label="Published On"
                  value={prettyDate(viewItem.created_at)}
                />
                <DetailRow
                  icon={<FileText size={16} className="text-primary" />}
                  label="Status"
                  value={viewItem.is_published ? "Published" : "Draft"}
                />
              </div>

              <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
                <p>
                  <span className="font-semibold">ID:</span> {viewItem.id}
                </p>
                <p>
                  <span className="font-semibold">Created:</span>{" "}
                  {prettyDateTime(viewItem.created_at)}
                </p>
                <p>
                  <span className="font-semibold">Updated:</span>{" "}
                  {prettyDateTime(viewItem.updated_at)}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 justify-end p-6 bg-gray-50 border-t">
              <button
                onClick={() => setViewItem(null)}
                className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const item = viewItem;
                  setViewItem(null);
                  openEdit(item);
                }}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
              >
                <Edit3 size={16} /> Edit
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            placeholder="Search by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as NewsCategory | "")
            }
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={publishedFilter}
            onChange={(e) =>
              setPublishedFilter(e.target.value as "" | "true" | "false")
            }
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>

          <button
            onClick={loadNews}
            className="border rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* ============ GRID — with Skeleton loading ============ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Image placeholder */}
              <Skeleton className="w-full h-40 rounded-none" />

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  {/* Category badge placeholder */}
                  <Skeleton className="h-6 w-24 rounded" />
                  {/* Action buttons placeholder */}
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((__, j) => (
                      <Skeleton key={j} className="h-6 w-6 rounded" />
                    ))}
                  </div>
                </div>

                {/* Title */}
                <Skeleton className="h-5 w-3/4 mb-3" />

                {/* Content lines */}
                <SkeletonText lines={3} className="mb-4" />

                {/* Author + date */}
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : pageError ? (
          <div className="col-span-full bg-white rounded-lg shadow p-6 text-red-600 text-sm">
            {pageError}
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No articles found.
          </div>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {n.image && (
                <img
                  src={base64ToDataUrl(n.image)}
                  alt={n.title}
                  className="w-full h-40 object-cover"
                />
              )}

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      CATEGORY_BADGE[n.category]
                    }`}
                  >
                    {CATEGORY_LABEL[n.category]}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openView(n)}
                      className="p-1.5 text-gray-700 hover:bg-gray-100 rounded"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openEdit(n)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(n)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{n.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-3">{n.content}</p>
                <p className="text-sm text-gray-400">
                  {n.author_email || "Unknown"} — {prettyDate(n.created_at)}
                  {!n.is_published && (
                    <span className="ml-2 text-orange-600 font-semibold">
                      (Draft)
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// =========================================================
// Small helper — detail row
// =========================================================
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 uppercase font-semibold">
          {label}
        </p>
        <p className="text-sm text-gray-800 break-words">{value}</p>
      </div>
    </div>
  );
}