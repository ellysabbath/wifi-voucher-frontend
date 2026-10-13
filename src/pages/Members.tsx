// src/pages/Members.tsx
import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Search,
  Edit3,
  ShieldCheck,
  ShieldOff,
  Power,
  PowerOff,
  RefreshCw,
  KeyRound,
  Loader2,
  X,
  Check,
  CheckCircle2,
  XCircle,
  Copy,
} from "lucide-react";

import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import InfoModal from "../components/InfoModal";
import { Skeleton } from "../components/skeleton";

import {
  adminApi,
  type AdminUserListItem,
  type CreateUserPayload,
  type UpdateUserPayload,
} from "../lib/adminApi";

// =========================================================
// Types & constants
// =========================================================
type MemberFormState = {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role: string;
  email_verified: boolean;
  is_active: boolean;
  is_staff: boolean;
  bio: string;
  address: string;
};

const EMPTY_FORM: MemberFormState = {
  email: "",
  password: "",
  full_name: "",
  phone: "",
  role: "member",
  email_verified: true,
  is_active: true,
  is_staff: false,
  bio: "",
  address: "",
};

const ROLES = ["admin", "pastor", "elder", "leader", "member"] as const;

type ConfirmState = {
  title: string;
  message: string;
  confirmLabel: string;
  variant: "danger" | "primary";
  onConfirm: () => Promise<void>;
};

type InfoState = {
  title: string;
  body: React.ReactNode;
};

type FlashState = {
  kind: "ok" | "err";
  text: string;
};

// =========================================================
// Component
// =========================================================
export default function Members() {
  // list
  const [members, setMembers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  // filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<"" | "true" | "false">(
    ""
  );

  // create / edit modal
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MemberFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // confirm modal
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // info modal
  const [info, setInfo] = useState<InfoState | null>(null);

  // flash banner
  const [flash, setFlash] = useState<FlashState | null>(null);

  // =========================================================
  // Load
  // =========================================================
  const loadMembers = async () => {
    setLoading(true);
    setPageError("");
    try {
      const res = await adminApi.listUsers({
        q: search || undefined,
        role: roleFilter || undefined,
        verified:
          verifiedFilter === "" ? undefined : verifiedFilter === "true",
        page: 1,
        page_size: 100,
      });
      setMembers(res.results);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load members.";
      setPageError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter, verifiedFilter]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 3500);
    return () => clearTimeout(t);
  }, [flash]);

  // =========================================================
  // Create / edit modal
  // =========================================================
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalError("");
    setModalMode("create");
  };

  const openEdit = async (m: AdminUserListItem) => {
    setForm({
      email: m.email,
      password: "",
      full_name: m.full_name,
      phone: m.phone,
      role: m.role,
      email_verified: m.email_verified,
      is_active: m.is_active,
      is_staff: m.is_staff,
      bio: "",
      address: "",
    });
    setEditingId(m.id);
    setModalError("");
    setModalMode("edit");

    try {
      const detail = await adminApi.getUser(m.id);
      setForm((f) => ({
        ...f,
        bio: detail.bio ?? "",
        address: detail.address ?? "",
      }));
    } catch {
      // Non-fatal — form still usable with list data
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setSaving(true);
    try {
      if (modalMode === "create") {
        if (!form.email || !form.password) {
          setModalError("Email and password are required.");
          return;
        }
        const payload: CreateUserPayload = {
          email: form.email,
          password: form.password,
          full_name: form.full_name,
          phone: form.phone,
          role: form.role,
          email_verified: form.email_verified,
          is_active: form.is_active,
          is_staff: form.is_staff,
        };
        await adminApi.createUser(payload);
        setFlash({ kind: "ok", text: "Member created." });
      } else if (modalMode === "edit" && editingId) {
        const payload: UpdateUserPayload = {
          full_name: form.full_name,
          phone: form.phone,
          role: form.role,
          email_verified: form.email_verified,
          is_active: form.is_active,
          is_staff: form.is_staff,
          bio: form.bio,
          address: form.address,
        };
        if (form.password) payload.password = form.password;
        await adminApi.updateUser(editingId, payload);
        setFlash({ kind: "ok", text: "Member updated." });
      }
      closeModal();
      await loadMembers();
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
  const handleDelete = (m: AdminUserListItem) => {
    askConfirm({
      title: "Delete member",
      message: `Are you sure you want to delete ${
        m.full_name || m.email
      }? This action cannot be undone.`,
      confirmLabel: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await adminApi.deleteUser(m.id);
          setFlash({ kind: "ok", text: "Member deleted." });
          await loadMembers();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Delete failed.";
          setFlash({ kind: "err", text: msg });
        }
      },
    });
  };

  const handleToggleVerify = async (m: AdminUserListItem) => {
    try {
      if (m.email_verified) {
        await adminApi.unverifyUser(m.id);
        setFlash({ kind: "ok", text: `${m.email} unverified.` });
      } else {
        await adminApi.verifyUser(m.id);
        setFlash({ kind: "ok", text: `${m.email} verified.` });
      }
      await loadMembers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Action failed.";
      setFlash({ kind: "err", text: msg });
    }
  };

  const handleToggleActive = async (m: AdminUserListItem) => {
    try {
      if (m.is_active) {
        await adminApi.deactivateUser(m.id);
        setFlash({ kind: "ok", text: `${m.email} deactivated.` });
      } else {
        await adminApi.activateUser(m.id);
        setFlash({ kind: "ok", text: `${m.email} activated.` });
      }
      await loadMembers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Action failed.";
      setFlash({ kind: "err", text: msg });
    }
  };

  const handleResendOtp = async (m: AdminUserListItem) => {
    try {
      await adminApi.resendOtp(m.id, "verify");
      setFlash({ kind: "ok", text: `New OTP sent to ${m.email}.` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Resend failed.";
      setFlash({ kind: "err", text: msg });
    }
  };

  const handleResetPassword = (m: AdminUserListItem) => {
    askConfirm({
      title: "Reset password",
      message: `Generate a new password for ${m.email}? The old password will stop working immediately.`,
      confirmLabel: "Reset",
      variant: "primary",
      onConfirm: async () => {
        try {
          const res = await adminApi.resetUserPassword(m.id);
          setInfo({
            title: "New password generated",
            body: (
              <div className="space-y-3">
                <p>
                  Share this password securely with{" "}
                  <span className="font-semibold">{m.email}</span>.
                </p>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-3">
                  <code className="flex-1 font-mono text-sm break-all">
                    {res.new_password}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(res.new_password);
                      setFlash({ kind: "ok", text: "Password copied." });
                    }}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded"
                    title="Copy"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  This password will not be shown again.
                </p>
              </div>
            ),
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Reset failed.";
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
        <h1 className="text-3xl font-bold">Members</h1>
        <button
          onClick={openCreate}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
        >
          <Plus size={18} /> Add Member
        </button>
      </div>

      {/* Flash banner */}
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
        title={modalMode === "create" ? "Add Member" : "Edit Member"}
      >
        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Email *</label>
            <input
              type="email"
              required
              disabled={modalMode === "edit"}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Full Name *
            </label>
            <input
              required
              value={form.full_name}
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Phone *</label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+255712345678"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              {modalMode === "create"
                ? "Password *"
                : "New Password (optional)"}
            </label>
            <input
              type="password"
              required={modalMode === "create"}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.email_verified}
                onChange={(e) =>
                  setForm({ ...form, email_verified: e.target.checked })
                }
              />
              <span className="text-sm">Verified</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              <span className="text-sm">Active</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_staff}
                onChange={(e) =>
                  setForm({ ...form, is_staff: e.target.checked })
                }
              />
              <span className="text-sm">Staff</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">
              Address
            </label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
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

      {/* Info modal */}
      <InfoModal
        isOpen={!!info}
        title={info?.title ?? ""}
        variant="success"
        onClose={() => setInfo(null)}
      >
        {info?.body}
      </InfoModal>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={verifiedFilter}
            onChange={(e) =>
              setVerifiedFilter(e.target.value as "" | "true" | "false")
            }
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Verification States</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>

          <button
            onClick={loadMembers}
            className="border rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {pageError ? (
          <div className="p-6 text-red-600 text-sm">{pageError}</div>
        ) : !loading && members.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No members found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Verified</th>
                <th className="px-4 py-3 text-left">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-48" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {Array.from({ length: 6 }).map((__, j) => (
                            <Skeleton
                              key={j}
                              className="h-6 w-6 rounded"
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                : members.map((m) => (
                    <tr key={m.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">
                        {m.full_name || "—"}
                      </td>
                      <td className="px-4 py-3">{m.email}</td>
                      <td className="px-4 py-3">{m.phone || "—"}</td>
                      <td className="px-4 py-3 capitalize">{m.role}</td>
                      <td className="px-4 py-3">
                        {m.email_verified ? (
                          <CheckCircle2
                            size={18}
                            className="text-green-600"
                            aria-label="Verified"
                          />
                        ) : (
                          <XCircle
                            size={18}
                            className="text-red-500"
                            aria-label="Unverified"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {m.is_active ? (
                          <CheckCircle2
                            size={18}
                            className="text-green-600"
                            aria-label="Active"
                          />
                        ) : (
                          <XCircle
                            size={18}
                            className="text-red-500"
                            aria-label="Inactive"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            title="Edit"
                            onClick={() => openEdit(m)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            title={m.email_verified ? "Unverify" : "Verify"}
                            onClick={() => handleToggleVerify(m)}
                            className={`p-1.5 rounded ${
                              m.email_verified
                                ? "text-yellow-600 hover:bg-yellow-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                          >
                            {m.email_verified ? (
                              <ShieldOff size={16} />
                            ) : (
                              <ShieldCheck size={16} />
                            )}
                          </button>

                          <button
                            title={m.is_active ? "Deactivate" : "Activate"}
                            onClick={() => handleToggleActive(m)}
                            className={`p-1.5 rounded ${
                              m.is_active
                                ? "text-orange-600 hover:bg-orange-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                          >
                            {m.is_active ? (
                              <PowerOff size={16} />
                            ) : (
                              <Power size={16} />
                            )}
                          </button>

                          <button
                            title="Resend OTP"
                            onClick={() => handleResendOtp(m)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded"
                          >
                            <RefreshCw size={16} />
                          </button>

                          <button
                            title="Reset Password"
                            onClick={() => handleResetPassword(m)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                          >
                            <KeyRound size={16} />
                          </button>

                          <button
                            title="Delete"
                            onClick={() => handleDelete(m)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}