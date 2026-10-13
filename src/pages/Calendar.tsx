// src/pages/Calendar.tsx
import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Calendar as CalIcon,
  Clock,
  MapPin,
  Search,
  Edit3,
  Loader2,
  X,
  Check,
  RefreshCw,
  Eye,
  Tag,
  User as UserIcon,
} from "lucide-react";
import { format, parseISO } from "date-fns";

import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import { Skeleton, SkeletonText } from "../components/skeleton";

import {
  eventApi,
  type ChurchEvent,
  type EventCategory,
  type EventPayload,
} from "../lib/eventApi";

// =========================================================
// Constants
// =========================================================
const CATEGORIES: { value: EventCategory; label: string; border: string }[] = [
  { value: "worship", label: "Worship Service", border: "border-blue-500" },
  { value: "meeting", label: "Meeting", border: "border-green-500" },
  { value: "celebration", label: "Celebration", border: "border-yellow-500" },
  { value: "session", label: "Leadership Session", border: "border-purple-500" },
];

const CATEGORY_BORDER: Record<EventCategory, string> = {
  worship: "border-blue-500",
  meeting: "border-green-500",
  celebration: "border-yellow-500",
  session: "border-purple-500",
};

const CATEGORY_LABEL: Record<EventCategory, string> = {
  worship: "Worship Service",
  meeting: "Meeting",
  celebration: "Celebration",
  session: "Leadership Session",
};

type EventFormState = {
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  category: EventCategory;
};

const EMPTY_FORM: EventFormState = {
  title: "",
  description: "",
  event_date: "",
  event_time: "",
  location: "",
  category: "worship",
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
function prettyDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), "dd MMM yyyy");
  } catch {
    return isoDate;
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
export default function Calendar() {
  // list
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "">("");

  // create / edit
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // view
  const [viewItem, setViewItem] = useState<ChurchEvent | null>(null);

  // confirm
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // flash
  const [flash, setFlash] = useState<FlashState | null>(null);

  // =========================================================
  // Load
  // =========================================================
  const loadEvents = async () => {
    setLoading(true);
    setPageError("");
    try {
      const res = await eventApi.list({
        q: search || undefined,
        category: categoryFilter || undefined,
        page: 1,
        page_size: 500,
      });
      setEvents(res.results);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load events.";
      setPageError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
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

  const openEdit = (e: ChurchEvent) => {
    setForm({
      title: e.title,
      description: e.description ?? "",
      event_date: e.event_date,
      // input[type=time] expects HH:MM
      event_time: e.event_time.slice(0, 5),
      location: e.location,
      category: e.category,
    });
    setEditingId(e.id);
    setModalError("");
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalError("");
  };

  const openView = (e: ChurchEvent) => setViewItem(e);

  // =========================================================
  // Save
  // =========================================================
  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setModalError("");

    if (!form.title.trim()) {
      setModalError("Title is required.");
      return;
    }
    if (!form.event_date) {
      setModalError("Date is required.");
      return;
    }
    if (!form.event_time) {
      setModalError("Time is required.");
      return;
    }
    if (!form.location.trim()) {
      setModalError("Location is required.");
      return;
    }

    setSaving(true);
    try {
      const payload: EventPayload = {
        title: form.title.trim(),
        description: form.description,
        event_date: form.event_date,
        event_time:
          form.event_time.length === 5
            ? `${form.event_time}:00`
            : form.event_time,
        location: form.location.trim(),
        category: form.category,
      };

      if (modalMode === "create") {
        await eventApi.create(payload);
        setFlash({ kind: "ok", text: "Event created." });
      } else if (modalMode === "edit" && editingId) {
        await eventApi.update(editingId, payload);
        setFlash({ kind: "ok", text: "Event updated." });
      }

      closeModal();
      await loadEvents();
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
  const handleDelete = (e: ChurchEvent) => {
    askConfirm({
      title: "Delete event",
      message: `Delete "${e.title}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await eventApi.remove(e.id);
          setFlash({ kind: "ok", text: "Event deleted." });
          await loadEvents();
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
        <h1 className="text-3xl font-bold">Church Calendar</h1>
        <button
          onClick={openCreate}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
        >
          <Plus size={18} /> Add Event
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
        title={modalMode === "create" ? "Add Event" : "Edit Event"}
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
            <label className="block text-sm font-semibold mb-1">Date *</label>
            <input
              required
              type="date"
              value={form.event_date}
              onChange={(e) =>
                setForm({ ...form, event_date: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Time *</label>
            <input
              required
              type="time"
              value={form.event_time}
              onChange={(e) =>
                setForm({ ...form, event_time: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Location *
            </label>
            <input
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as EventCategory,
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

      {/* ============ VIEW DETAILS MODAL ============ */}
      {viewItem && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setViewItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={`flex items-start justify-between p-6 border-b sticky top-0 bg-white z-10 border-l-4 ${
                CATEGORY_BORDER[viewItem.category]
              }`}
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {viewItem.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {CATEGORY_LABEL[viewItem.category]}
                </p>
              </div>
              <button
                onClick={() => setViewItem(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Description
                </h3>
                <p className="text-gray-800 whitespace-pre-line">
                  {viewItem.description || "—"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow
                  icon={<CalIcon size={16} className="text-primary" />}
                  label="Date"
                  value={prettyDate(viewItem.event_date)}
                />
                <DetailRow
                  icon={<Clock size={16} className="text-primary" />}
                  label="Time"
                  value={viewItem.event_time}
                />
                <DetailRow
                  icon={<MapPin size={16} className="text-primary" />}
                  label="Location"
                  value={viewItem.location}
                />
                <DetailRow
                  icon={<Tag size={16} className="text-primary" />}
                  label="Category"
                  value={CATEGORY_LABEL[viewItem.category]}
                />
                <DetailRow
                  icon={<UserIcon size={16} className="text-primary" />}
                  label="Created By"
                  value={viewItem.created_by_email || "—"}
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
            placeholder="Search by title, description, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as EventCategory | "")
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

          <button
            onClick={loadEvents}
            className="border rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* ============ LIST — with Skeleton loading ============ */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-5 border-l-4 border-gray-200"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  {/* Title */}
                  <Skeleton className="h-6 w-1/3 mb-3" />

                  {/* Description */}
                  <SkeletonText lines={2} className="mb-4" />

                  {/* Meta row — 4 chips */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-3.5 w-3.5 rounded" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-3.5 w-3.5 rounded" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-3.5 w-3.5 rounded" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="h-3.5 w-3.5 rounded" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {Array.from({ length: 3 }).map((__, j) => (
                    <Skeleton key={j} className="h-6 w-6 rounded" />
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : pageError ? (
          <div className="bg-white rounded-lg shadow p-6 text-red-600 text-sm">
            {pageError}
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No events found.
          </div>
        ) : (
          events.map((e) => (
            <div
              key={e.id}
              className={`bg-white rounded-lg shadow p-5 border-l-4 ${
                CATEGORY_BORDER[e.category]
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold truncate">{e.title}</h3>
                  <p className="text-gray-600 mt-1">{e.description}</p>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <CalIcon size={14} /> {prettyDate(e.event_date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {e.event_time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {e.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={14} /> {CATEGORY_LABEL[e.category]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openView(e)}
                    className="p-1.5 text-gray-700 hover:bg-gray-100 rounded"
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => openEdit(e)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(e)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 size={16} />
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