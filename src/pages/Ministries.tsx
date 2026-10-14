// src/pages/Ministries.tsx
import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Users,
  Calendar,
  Search,
  Edit3,
  Loader2,
  X,
  Check,
  RefreshCw,
  Power,
  PowerOff,
  Eye,
} from "lucide-react";

import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import { Skeleton, SkeletonText } from "../components/skeleton";

import {
  ministriesApi,
  type Ministry,
  type MinistryPayload,
} from "../lib/ministriesApi";

// =========================================================
// Constants
// =========================================================
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type MinistryFormState = {
  name: string;
  description: string;
  leader_name: string;
  meeting_day: string;
  meeting_time: string;
  icon: string;
  is_active: boolean;
};

const EMPTY_FORM: MinistryFormState = {
  name: "",
  description: "",
  leader_name: "",
  meeting_day: "Saturday",
  meeting_time: "",
  icon: "",
  is_active: true,
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
// Component
// =========================================================
export default function Ministries() {
  // list
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"" | "true" | "false">("");

  // create / edit
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MinistryFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // view details
  const [viewItem, setViewItem] = useState<Ministry | null>(null);

  // confirm
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // flash
  const [flash, setFlash] = useState<FlashState | null>(null);

  // =========================================================
  // Load
  // =========================================================
  const loadMinistries = async () => {
    setLoading(true);
    setPageError("");
    try {
      const res = await ministriesApi.list({
        q: search || undefined,
        active: activeFilter === "" ? undefined : activeFilter === "true",
        page: 1,
        page_size: 200,
      });
      setMinistries(res.results);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load ministries.";
      setPageError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMinistries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeFilter]);

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

  const openEdit = (m: Ministry) => {
    setForm({
      name: m.name,
      description: m.description ?? "",
      leader_name: m.leader_name ?? "",
      meeting_day: m.meeting_day || "Saturday",
      meeting_time: m.meeting_time ?? "",
      icon: m.icon ?? "",
      is_active: m.is_active,
    });
    setEditingId(m.id);
    setModalError("");
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalError("");
  };

  const openView = (m: Ministry) => setViewItem(m);

  // =========================================================
  // Save
  // =========================================================
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!form.name.trim()) {
      setModalError("Ministry name is required.");
      return;
    }

    setSaving(true);
    try {
      const payload: MinistryPayload = {
        name: form.name.trim(),
        description: form.description,
        leader_name: form.leader_name,
        meeting_day: form.meeting_day,
        meeting_time: form.meeting_time || null,
        icon: form.icon,
        is_active: form.is_active,
      };

      if (modalMode === "create") {
        await ministriesApi.create(payload);
        setFlash({ kind: "ok", text: "Ministry created." });
      } else if (modalMode === "edit" && editingId) {
        await ministriesApi.update(editingId, payload);
        setFlash({ kind: "ok", text: "Ministry updated." });
      }

      closeModal();
      await loadMinistries();
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
  // Row actions
  // =========================================================
  const handleDelete = (m: Ministry) => {
    askConfirm({
      title: "Delete ministry",
      message: `Delete "${m.name}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await ministriesApi.remove(m.id);
          setFlash({ kind: "ok", text: "Ministry deleted." });
          await loadMinistries();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Delete failed.";
          setFlash({ kind: "err", text: msg });
        }
      },
    });
  };

  const handleToggleActive = async (m: Ministry) => {
    try {
      await ministriesApi.update(m.id, { is_active: !m.is_active });
      setFlash({
        kind: "ok",
        text: `${m.name} ${m.is_active ? "deactivated" : "activated"}.`,
      });
      await loadMinistries();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Action failed.";
      setFlash({ kind: "err", text: msg });
    }
  };

  // =========================================================
  // Render
  // =========================================================
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ministries</h1>
        <button
          onClick={openCreate}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
        >
          <Plus size={18} /> Add Ministry
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
        title={modalMode === "create" ? "Add Ministry" : "Edit Ministry"}
      >
        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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

          <div>
            <label className="block text-sm font-semibold mb-1">
              Leader Name
            </label>
            <input
              value={form.leader_name}
              onChange={(e) =>
                setForm({ ...form, leader_name: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Meeting Day
            </label>
            <select
              value={form.meeting_day}
              onChange={(e) =>
                setForm({ ...form, meeting_day: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Meeting Time
            </label>
            <input
              type="time"
              value={form.meeting_time}
              onChange={(e) =>
                setForm({ ...form, meeting_time: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Icon (emoji or short text)
            </label>
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <input
              id="ministry-is-active"
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
            />
            <label htmlFor="ministry-is-active" className="text-sm">
              Active
            </label>
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
            <div className="flex items-start justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  {viewItem.icon || viewItem.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {viewItem.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    <span
                      className={
                        viewItem.is_active
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {viewItem.is_active ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
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
                  icon={<Users size={16} className="text-primary" />}
                  label="Leader"
                  value={viewItem.leader_name || "—"}
                />
                <DetailRow
                  icon={<Calendar size={16} className="text-primary" />}
                  label="Meeting Day"
                  value={viewItem.meeting_day || "—"}
                />
                <DetailRow
                  icon={<Calendar size={16} className="text-primary" />}
                  label="Meeting Time"
                  value={viewItem.meeting_time || "—"}
                />
                <DetailRow
                  icon={<Power size={16} className="text-primary" />}
                  label="Active"
                  value={viewItem.is_active ? "Yes" : "No"}
                />
              </div>

              <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
                <p>
                  <span className="font-semibold">ID:</span> {viewItem.id}
                </p>
                <p>
                  <span className="font-semibold">Created:</span>{" "}
                  {new Date(viewItem.created_at).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Updated:</span>{" "}
                  {new Date(viewItem.updated_at).toLocaleString()}
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
            placeholder="Search ministries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <select
            value={activeFilter}
            onChange={(e) =>
              setActiveFilter(e.target.value as "" | "true" | "false")
            }
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="true">Active only</option>
            <option value="false">Inactive only</option>
          </select>

          <button
            onClick={loadMinistries}
            className="border rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 relative">
              {/* Action buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-1">
                {Array.from({ length: 4 }).map((__, j) => (
                  <Skeleton key={j} className="h-6 w-6 rounded" />
                ))}
              </div>

              {/* Title */}
              <Skeleton className="h-6 w-3/4 mb-3 pr-24" />

              {/* Description */}
              <SkeletonText lines={2} className="mb-4" />

              {/* Detail rows */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <div className="pt-1">
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </div>
          ))
        ) : pageError ? (
          <div className="col-span-full p-6 text-red-600 text-sm">
            {pageError}
          </div>
        ) : ministries.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            No ministries found.
          </div>
        ) : (
          ministries.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-lg shadow p-6 relative group"
            >
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <button
                  onClick={() => openView(m)}
                  className="p-1.5 text-gray-700 hover:bg-gray-100 rounded"
                  title="View details"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => openEdit(m)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit"
                >
                  <Edit3 size={16} />
                </button>

                <button
                  onClick={() => handleToggleActive(m)}
                  className={`p-1.5 rounded ${
                    m.is_active
                      ? "text-orange-600 hover:bg-orange-50"
                      : "text-green-600 hover:bg-green-50"
                  }`}
                  title={m.is_active ? "Deactivate" : "Activate"}
                >
                  {m.is_active ? <PowerOff size={16} /> : <Power size={16} />}
                </button>

                <button
                  onClick={() => handleDelete(m)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="text-xl font-bold mb-2 pr-24">{m.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{m.description}</p>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-gray-600">
                  <Users size={14} /> Leader: {m.leader_name || "—"}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <Calendar size={14} /> Day: {m.meeting_day}
                </p>
                {m.meeting_time && (
                  <p className="flex items-center gap-2 text-gray-600">
                    <Calendar size={14} /> Time: {m.meeting_time}
                  </p>
                )}
                <p className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                  Status: {m.is_active ? "Active" : "Inactive"}
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
// Small helper — detail row used inside the view modal
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