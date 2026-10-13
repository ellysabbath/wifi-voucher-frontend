// src/pages/Leadership.tsx
import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Search,
  Edit3,
  Loader2,
  X,
  Check,
  RefreshCw,
  User as UserIcon,
  Phone,
  Mail,
  Award,
  Power,
  PowerOff,
  Eye,
  Calendar as CalIcon,
} from "lucide-react";

import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import { Skeleton } from "../components/skeleton";

import {
  leadersApi,
  type Leader,
  type LeaderPayload,
} from "../lib/leadersApi";
import {
  adminApi,
  type AdminUserListItem,
} from "../lib/adminApi";

// =========================================================
// Types
// =========================================================
type LeaderFormState = {
  user_id: string;
  position: string;
  bio: string;
  display_order: number;
  is_active: boolean;
  appointed_at: string;
};

const EMPTY_FORM: LeaderFormState = {
  user_id: "",
  position: "",
  bio: "",
  display_order: 0,
  is_active: true,
  appointed_at: "",
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
function base64ToDataUrl(b64: string | null, mime = "image/jpeg"): string {
  if (!b64) return "";
  if (b64.startsWith("data:")) return b64;
  return `data:${mime};base64,${b64}`;
}

function prettyDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// =========================================================
// Component
// =========================================================
export default function Leadership() {
  // list
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"" | "true" | "false">("");

  // users for the picker
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // create / edit
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LeaderFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // view
  const [viewItem, setViewItem] = useState<Leader | null>(null);

  // confirm
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // flash
  const [flash, setFlash] = useState<FlashState | null>(null);

  // =========================================================
  // Load leaders
  // =========================================================
  const loadLeaders = async () => {
    setLoading(true);
    setPageError("");
    try {
      const res = await leadersApi.list({
        q: search || undefined,
        active: activeFilter === "" ? undefined : activeFilter === "true",
        page: 1,
        page_size: 300,
      });
      setLeaders(res.results);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load leaders.";
      setPageError(msg);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Load users (for the picker inside the create modal)
  // =========================================================
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await adminApi.listUsers({ page: 1, page_size: 500 });
      setUsers(res.results);
    } catch {
      // silent — user picker will just be empty
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadLeaders();
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
  const openCreate = async () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalError("");
    setModalMode("create");
    if (users.length === 0) await loadUsers();
  };

  const openEdit = (l: Leader) => {
    setForm({
      user_id: l.user_id ?? "",
      position: l.position,
      bio: l.bio ?? "",
      display_order: l.display_order,
      is_active: l.is_active,
      appointed_at: l.appointed_at,
    });
    setEditingId(l.id);
    setModalError("");
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalError("");
  };

  const openView = (l: Leader) => setViewItem(l);

  // =========================================================
  // Save
  // =========================================================
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (modalMode === "create" && !form.user_id) {
      setModalError("Please select a user.");
      return;
    }
    if (!form.position.trim()) {
      setModalError("Position is required.");
      return;
    }
    if (!form.appointed_at) {
      setModalError("Appointed date is required.");
      return;
    }

    setSaving(true);
    try {
      if (modalMode === "create") {
        const payload: LeaderPayload = {
          user_id: form.user_id,
          position: form.position.trim(),
          bio: form.bio,
          display_order: form.display_order,
          is_active: form.is_active,
          appointed_at: form.appointed_at,
        };
        await leadersApi.create(payload);
        setFlash({ kind: "ok", text: "Leader added." });
      } else if (modalMode === "edit" && editingId) {
        await leadersApi.update(editingId, {
          position: form.position.trim(),
          bio: form.bio,
          display_order: form.display_order,
          is_active: form.is_active,
          appointed_at: form.appointed_at,
        });
        setFlash({ kind: "ok", text: "Leader updated." });
      }

      closeModal();
      await loadLeaders();
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
  const handleDelete = (l: Leader) => {
    askConfirm({
      title: "Delete leader",
      message: `Delete leadership record for ${
        l.user_full_name || l.user_email || "this user"
      }? This action cannot be undone.`,
      confirmLabel: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await leadersApi.remove(l.id);
          setFlash({ kind: "ok", text: "Leader deleted." });
          await loadLeaders();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Delete failed.";
          setFlash({ kind: "err", text: msg });
        }
      },
    });
  };

  const handleToggleActive = async (l: Leader) => {
    try {
      await leadersApi.update(l.id, { is_active: !l.is_active });
      setFlash({
        kind: "ok",
        text: `${l.user_full_name || l.user_email} ${
          l.is_active ? "deactivated" : "activated"
        }.`,
      });
      await loadLeaders();
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
        <h1 className="text-3xl font-bold">Church Leadership</h1>
        <button
          onClick={openCreate}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
        >
          <Plus size={18} /> Add Leader
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
        title={modalMode === "create" ? "Add Leader" : "Edit Leader"}
      >
        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* User picker */}
          {modalMode === "create" ? (
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                User *
              </label>
              {usersLoading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <select
                  required
                  value={form.user_id}
                  onChange={(e) =>
                    setForm({ ...form, user_id: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- Select a user --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name || u.email} ({u.email})
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Pick a user account to promote as a leader.
              </p>
            </div>
          ) : (
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                User
              </label>
              <div className="flex items-center gap-3 bg-gray-50 border rounded-lg px-3 py-2">
                <UserIcon size={18} className="text-gray-400" />
                <span className="text-sm text-gray-700">
                  {viewItem?.user_full_name || viewItem?.user_email || "—"}
                </span>
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Position *
            </label>
            <input
              required
              value={form.position}
              onChange={(e) =>
                setForm({ ...form, position: e.target.value })
              }
              placeholder="Pastor, Church Elder, Youth Leader…"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Appointed Date *
            </label>
            <input
              required
              type="date"
              value={form.appointed_at}
              onChange={(e) =>
                setForm({ ...form, appointed_at: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Display Order
            </label>
            <input
              type="number"
              value={form.display_order}
              onChange={(e) =>
                setForm({
                  ...form,
                  display_order: Number(e.target.value) || 0,
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Bio</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <input
              id="leader-is-active"
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
            />
            <label htmlFor="leader-is-active" className="text-sm">
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
            className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {viewItem.user_photo ? (
                    <img
                      src={base64ToDataUrl(viewItem.user_photo)}
                      alt={viewItem.user_full_name ?? ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={28} className="text-primary" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {viewItem.user_full_name || "—"}
                  </h2>
                  <p className="text-primary font-semibold text-sm">
                    {viewItem.position}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {viewItem.is_active ? "Active" : "Inactive"}
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

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Bio
                </h3>
                <p className="text-gray-800 whitespace-pre-line">
                  {viewItem.bio || "—"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow
                  icon={<Mail size={16} className="text-primary" />}
                  label="Email"
                  value={viewItem.user_email || "—"}
                />
                <DetailRow
                  icon={<Phone size={16} className="text-primary" />}
                  label="Phone"
                  value={viewItem.user_phone || "—"}
                />
                <DetailRow
                  icon={<Award size={16} className="text-primary" />}
                  label="Position"
                  value={viewItem.position}
                />
                <DetailRow
                  icon={<CalIcon size={16} className="text-primary" />}
                  label="Appointed"
                  value={prettyDate(viewItem.appointed_at)}
                />
                <DetailRow
                  icon={<Power size={16} className="text-primary" />}
                  label="Status"
                  value={viewItem.is_active ? "Active" : "Inactive"}
                />
                <DetailRow
                  icon={<Award size={16} className="text-primary" />}
                  label="Display Order"
                  value={String(viewItem.display_order)}
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
            placeholder="Search by name, position, or contact..."
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
            onClick={loadLeaders}
            className="border rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Grid — with Skeleton loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-6 text-center"
            >
              <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
              <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-3 w-1/2 mx-auto mb-4" />
              <div className="space-y-2 max-w-[200px] mx-auto">
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          ))
        ) : pageError ? (
          <div className="col-span-full p-6 text-red-600 text-sm">
            {pageError}
          </div>
        ) : leaders.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            No leaders found.
          </div>
        ) : (
          leaders.map((l) => (
            <div
              key={l.id}
              className="bg-white rounded-lg shadow p-6 text-center relative group"
            >
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <button
                  onClick={() => openView(l)}
                  className="p-1.5 text-gray-700 hover:bg-gray-100 rounded"
                  title="View"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => openEdit(l)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleToggleActive(l)}
                  className={`p-1.5 rounded ${
                    l.is_active
                      ? "text-orange-600 hover:bg-orange-50"
                      : "text-green-600 hover:bg-green-50"
                  }`}
                  title={l.is_active ? "Deactivate" : "Activate"}
                >
                  {l.is_active ? <PowerOff size={16} /> : <Power size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(l)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center overflow-hidden">
                {l.user_photo ? (
                  <img
                    src={base64ToDataUrl(l.user_photo)}
                    alt={l.user_full_name ?? ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon size={32} className="text-primary" />
                )}
              </div>

              <h3 className="font-bold text-lg truncate">
                {l.user_full_name || "—"}
              </h3>
              <p className="text-primary font-semibold text-sm mb-3 truncate">
                {l.position}
              </p>

              <div className="space-y-1 text-sm text-gray-600">
                {l.user_phone && (
                  <p className="flex items-center justify-center gap-2 truncate">
                    <Phone size={14} /> {l.user_phone}
                  </p>
                )}
                {l.user_email && (
                  <p className="flex items-center justify-center gap-2 truncate">
                    <Mail size={14} /> {l.user_email}
                  </p>
                )}
              </div>

              {l.bio && (
                <p className="text-xs text-gray-500 mt-3 italic line-clamp-3">
                  {l.bio}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// =========================================================
// Small helper — detail row inside the view modal
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