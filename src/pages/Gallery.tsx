// src/pages/Gallery.tsx
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
  Upload,
  Image as ImageIcon,
} from "lucide-react";

import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import { Skeleton } from "../components/skeleton";

import {
  galleryApi,
  type GalleryItem,
  type GalleryPayload,
} from "../lib/galleryApi";

// =========================================================
// Types
// =========================================================
type GalleryFormState = {
  title: string;
  album: string;
  image: string;        // raw base64
  imagePreview: string; // data URL for preview
};

const EMPTY_FORM: GalleryFormState = {
  title: "",
  album: "Worship",
  image: "",
  imagePreview: "",
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

// =========================================================
// Component
// =========================================================
export default function Gallery() {
  // list
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [albumFilter, setAlbumFilter] = useState("");

  // create / edit
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<GalleryFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

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
  const loadGallery = async () => {
    setLoading(true);
    setPageError("");
    try {
      const res = await galleryApi.list({
        q: search || undefined,
        album: albumFilter || undefined,
        page: 1,
        page_size: 300,
      });
      setItems(res.results);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load gallery.";
      setPageError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, albumFilter]);

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

  const openEdit = (g: GalleryItem) => {
    setForm({
      title: g.title,
      album: g.album,
      image: g.image,
      imagePreview: base64ToDataUrl(g.image),
    });
    setEditingId(g.id);
    setModalError("");
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalError("");
  };

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
    if (!form.album.trim()) {
      setModalError("Album is required.");
      return;
    }
    if (!form.image) {
      setModalError("Please choose an image.");
      return;
    }

    setSaving(true);
    try {
      const payload: GalleryPayload = {
        title: form.title.trim(),
        album: form.album.trim(),
        image: form.image,
      };

      if (modalMode === "create") {
        await galleryApi.create(payload);
        setFlash({ kind: "ok", text: "Photo added." });
      } else if (modalMode === "edit" && editingId) {
        await galleryApi.update(editingId, payload);
        setFlash({ kind: "ok", text: "Photo updated." });
      }

      closeModal();
      await loadGallery();
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
  const handleDelete = (g: GalleryItem) => {
    askConfirm({
      title: "Delete photo",
      message: `Delete "${g.title}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await galleryApi.remove(g.id);
          setFlash({ kind: "ok", text: "Photo deleted." });
          await loadGallery();
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
        <h1 className="text-3xl font-bold">Church Gallery</h1>
        <button
          onClick={openCreate}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
        >
          <Plus size={18} /> Add Photo
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
        title={modalMode === "create" ? "Add Photo" : "Edit Photo"}
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
            <label className="block text-sm font-semibold mb-1">Album *</label>
            <input
              required
              value={form.album}
              onChange={(e) => setForm({ ...form, album: e.target.value })}
              placeholder="Worship, Youth, Christmas…"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Image *
            </label>
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                      setForm((f) => ({
                        ...f,
                        image: "",
                        imagePreview: "",
                      }))
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
            placeholder="Search by title or album..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <input
            placeholder="Filter by album"
            value={albumFilter}
            onChange={(e) => setAlbumFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={loadGallery}
            className="border rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Grid — with Skeleton loading */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Image placeholder */}
              <Skeleton className="w-full h-48 rounded-none" />

              <div className="p-3">
                {/* Title */}
                <Skeleton className="h-4 w-3/4 mb-2" />
                {/* Album */}
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : pageError ? (
          <div className="col-span-full p-6 text-red-600 text-sm">
            {pageError}
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            No photos found.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={base64ToDataUrl(item.image)}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => openEdit(item)}
                    className="bg-blue-600 text-white p-1.5 rounded"
                    title="Edit"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="bg-red-500 text-white p-1.5 rounded"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="p-3">
                <p className="font-semibold truncate">{item.title}</p>
                <p className="text-xs text-gray-500 truncate">{item.album}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}