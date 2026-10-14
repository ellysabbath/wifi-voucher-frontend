// src/pages/BulkSMS.tsx
import { useEffect, useState } from "react";
import {
  Send,
  Users,
  User as UserIcon,
  Plus,
  Trash2,
  RefreshCw,
  Loader2,
  X,
  Check,
  Mail,
  MessageSquare,
  Search,
  Eye,
} from "lucide-react";

import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import { Skeleton } from "../components/skeleton";

import {
  smsApi,
  type SMSGroup,
  type SMSMessage,
  type SMSMessageDetail,
  type SendMode,
  type Channel,
} from "../lib/smsApi";
import { adminApi, type AdminUserListItem } from "../lib/adminApi";

// =========================================================
// Component
// =========================================================
export default function BulkSMS() {
  // ---------- users ----------
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // ---------- groups ----------
  const [groups, setGroups] = useState<SMSGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);

  // ---------- messages ----------
  const [messages, setMessages] = useState<SMSMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // ---------- compose ----------
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [mode, setMode] = useState<SendMode>("all");
  const [groupId, setGroupId] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [channels, setChannels] = useState<Channel[]>(["sms", "email"]);
  const [sending, setSending] = useState(false);
  const [composeError, setComposeError] = useState("");

  // ---------- create group modal ----------
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState<string[]>([]);
  const [groupSaving, setGroupSaving] = useState(false);
  const [groupError, setGroupError] = useState("");
  const [userSearch, setUserSearch] = useState("");

  // ---------- viewer ----------
  const [viewItem, setViewItem] = useState<SMSMessageDetail | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // ---------- confirm ----------
  const [confirm, setConfirm] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    variant: "danger" | "primary";
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // ---------- flash ----------
  const [flash, setFlash] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  // =========================================================
  // Loaders
  // =========================================================
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await adminApi.listUsers({ page: 1, page_size: 500 });
      setUsers(res.results);
    } catch {
      // silent
    } finally {
      setUsersLoading(false);
    }
  };

  const loadGroups = async () => {
    setGroupsLoading(true);
    try {
      const res = await smsApi.listGroups({ page: 1, page_size: 200 });
      setGroups(res.results);
    } catch {
      // silent
    } finally {
      setGroupsLoading(false);
    }
  };

  const loadMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await smsApi.listMessages({ page: 1, page_size: 100 });
      setMessages(res.results);
    } catch {
      // silent
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadGroups();
    loadMessages();
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 3500);
    return () => clearTimeout(t);
  }, [flash]);

  // =========================================================
  // Recipient count helper
  // =========================================================
  const recipientCount = (): number => {
    if (mode === "all") return users.length;
    if (mode === "group") {
      const g = groups.find((x) => x.id === groupId);
      return g?.member_count ?? 0;
    }
    return selected.length;
  };

  // =========================================================
  // Send
  // =========================================================
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setComposeError("");

    if (!message.trim()) {
      setComposeError("Message is required.");
      return;
    }
    if (channels.length === 0) {
      setComposeError("Pick at least one channel (SMS or Email).");
      return;
    }
    if (mode === "group" && !groupId) {
      setComposeError("Please select a group.");
      return;
    }
    if (mode === "selected" && selected.length === 0) {
      setComposeError("Please select at least one recipient.");
      return;
    }
    if (recipientCount() === 0) {
      setComposeError("No recipients matched the selection.");
      return;
    }

    setSending(true);
    try {
      const res = await smsApi.send({
        message: message.trim(),
        subject: subject.trim() || undefined,
        mode,
        group_id: mode === "group" ? groupId : undefined,
        user_ids: mode === "selected" ? selected : undefined,
        channels,
      });

      setFlash({
        kind: "ok",
        text: `Campaign sent — ${res.campaign.sms_sent_count} SMS, ${res.campaign.email_sent_count} emails, ${res.campaign.failed_count} failed.`,
      });

      setMessage("");
      setSubject("");
      setSelected([]);
      await loadMessages();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Send failed.";
      setComposeError(msg);
    } finally {
      setSending(false);
    }
  };

  // =========================================================
  // Create group
  // =========================================================
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setGroupError("");

    if (!newGroupName.trim()) {
      setGroupError("Group name is required.");
      return;
    }
    if (newGroupMembers.length === 0) {
      setGroupError("Select at least one member.");
      return;
    }

    setGroupSaving(true);
    try {
      await smsApi.createGroup({
        name: newGroupName.trim(),
        description: newGroupDesc.trim(),
        user_ids: newGroupMembers,
      });
      setFlash({ kind: "ok", text: "Group created." });
      closeGroupModal();
      await loadGroups();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Create failed.";
      setGroupError(msg);
    } finally {
      setGroupSaving(false);
    }
  };

  const closeGroupModal = () => {
    setIsGroupModalOpen(false);
    setNewGroupName("");
    setNewGroupDesc("");
    setNewGroupMembers([]);
    setGroupError("");
    setUserSearch("");
  };

  // =========================================================
  // Delete group
  // =========================================================
  const askDeleteGroup = (g: SMSGroup) => {
    setConfirm({
      title: "Delete group",
      message: `Delete "${g.name}"? This action cannot be undone.`,
      confirmLabel: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await smsApi.removeGroup(g.id);
          setFlash({ kind: "ok", text: "Group deleted." });
          await loadGroups();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Delete failed.";
          setFlash({ kind: "err", text: msg });
        }
      },
    });
  };

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
  // View message detail
  // =========================================================
  const openViewer = async (m: SMSMessage) => {
    setViewLoading(true);
    try {
      const detail = await smsApi.getMessage(m.id);
      setViewItem(detail);
    } catch {
      setFlash({ kind: "err", text: "Failed to load message detail." });
    } finally {
      setViewLoading(false);
    }
  };

  // =========================================================
  // Filter users in the group modal
  // =========================================================
  const filteredUsers = users.filter((u) => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.full_name ?? "").toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.phone ?? "").toLowerCase().includes(q)
    );
  });

  // =========================================================
  // Render
  // =========================================================
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bulk SMS &amp; Email</h1>
        <button
          onClick={() => setIsGroupModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
        >
          <Plus size={18} /> New Group
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

      {/* ============ CREATE GROUP MODAL ============ */}
      <Modal
        isOpen={isGroupModalOpen}
        onClose={closeGroupModal}
        title="Create Group"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Group Name *
            </label>
            <input
              required
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="e.g. Elders, Choir, Youth"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <input
              value={newGroupDesc}
              onChange={(e) => setNewGroupDesc(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Members ({newGroupMembers.length} selected)
            </label>

            <div className="relative mb-2">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={16}
              />
              <input
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm"
              />
            </div>

            <div className="max-h-64 overflow-y-auto border rounded-lg p-2">
              {usersLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No users found.
                </p>
              ) : (
                filteredUsers.map((u) => (
                  <label
                    key={u.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={newGroupMembers.includes(u.id)}
                      onChange={(e) =>
                        setNewGroupMembers((prev) =>
                          e.target.checked
                            ? [...prev, u.id]
                            : prev.filter((x) => x !== u.id)
                        )
                      }
                    />
                    <span className="text-sm">
                      {u.full_name || "Unnamed"} — {u.email}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {groupError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
              {groupError}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={closeGroupModal}
              className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2"
            >
              <X size={16} /> Cancel
            </button>
            <button
              type="submit"
              disabled={groupSaving}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2 disabled:opacity-60"
            >
              {groupSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Creating…
                </>
              ) : (
                <>
                  <Check size={16} /> Create Group
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ============ COMPOSE FORM ============ */}
      <form
        onSubmit={handleSend}
        className="bg-white rounded-lg shadow p-6 mb-6 space-y-4"
      >
        {/* Recipient mode */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Recipients
          </label>
          <div className="flex gap-2 flex-wrap mb-3">
            <button
              type="button"
              onClick={() => setMode("all")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
                mode === "all" ? "bg-primary text-white" : "bg-gray-200"
              }`}
            >
              <Users size={16} /> All Users ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setMode("group")}
              className={`px-4 py-2 rounded-lg text-sm ${
                mode === "group" ? "bg-primary text-white" : "bg-gray-200"
              }`}
            >
              Group
            </button>
            <button
              type="button"
              onClick={() => setMode("selected")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
                mode === "selected" ? "bg-primary text-white" : "bg-gray-200"
              }`}
            >
              <UserIcon size={16} /> Select
            </button>
          </div>

          {/* Group mode */}
          {mode === "group" && (
            <div className="space-y-2">
              {groupsLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- Choose a group --</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.member_count})
                    </option>
                  ))}
                </select>
              )}

              {groupId && (
                <button
                  type="button"
                  onClick={() => {
                    const g = groups.find((x) => x.id === groupId);
                    if (g) askDeleteGroup(g);
                  }}
                  className="text-red-500 text-sm flex items-center gap-1 hover:underline"
                >
                  <Trash2 size={14} /> Delete this group
                </button>
              )}
            </div>
          )}

          {/* Selected mode */}
          {mode === "selected" && (
            <div className="max-h-64 overflow-y-auto border rounded-lg p-2">
              {usersLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                users.map((u) => (
                  <label
                    key={u.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(u.id)}
                      onChange={(e) =>
                        setSelected((prev) =>
                          e.target.checked
                            ? [...prev, u.id]
                            : prev.filter((x) => x !== u.id)
                        )
                      }
                    />
                    <span className="text-sm">
                      {u.full_name || "Unnamed"} — {u.email}
                    </span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {/* Channels */}
        <div>
          <label className="block text-sm font-semibold mb-2">Channels</label>
          <div className="flex gap-3 flex-wrap">
            <label className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={channels.includes("sms")}
                onChange={(e) =>
                  setChannels((prev) =>
                    e.target.checked
                      ? [...prev, "sms"]
                      : prev.filter((c) => c !== "sms")
                  )
                }
              />
              <MessageSquare size={16} /> SMS
            </label>
            <label className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={channels.includes("email")}
                onChange={(e) =>
                  setChannels((prev) =>
                    e.target.checked
                      ? [...prev, "email"]
                      : prev.filter((c) => c !== "email")
                  )
                }
              />
              <Mail size={16} /> Email
            </label>
          </div>
        </div>

        {/* Subject (email only) */}
        {channels.includes("email") && (
          <div>
            <label className="block text-sm font-semibold mb-1">
              Email Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Church Notice"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Message *
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full border rounded-lg px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            {message.length} characters — target: {recipientCount()}{" "}
            recipient(s)
          </p>
        </div>

        {composeError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {composeError}
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary-dark disabled:opacity-60"
        >
          {sending ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send size={18} /> Send Campaign
            </>
          )}
        </button>
      </form>

      {/* ============ HISTORY ============ */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Campaign History</h2>
          <button
            onClick={loadMessages}
            className="border rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {messagesLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border-l-4 border-gray-200 pl-3 py-2"
              >
                <Skeleton className="h-3 w-1/3 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">
            No campaigns yet.
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className="border-l-4 border-primary pl-3 py-2 flex justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">
                    {new Date(m.created_at).toLocaleString()} —{" "}
                    {m.group_name || "—"} — Status: {m.status}
                  </p>
                  <p className="text-sm font-medium truncate">
                    {m.subject || "(no subject)"}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {m.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Recipients: {m.recipient_count} — SMS: {m.sms_sent_count}{" "}
                    — Email: {m.email_sent_count} — Failed: {m.failed_count}
                  </p>
                </div>

                <button
                  onClick={() => openViewer(m)}
                  className="p-2 text-primary hover:bg-primary/10 rounded self-start"
                  title="View details"
                >
                  <Eye size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============ VIEWER MODAL ============ */}
      {viewItem && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setViewItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold">
                  {viewItem.subject || "(no subject)"}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(viewItem.created_at).toLocaleString()} —{" "}
                  {viewItem.group_name}
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

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 text-sm whitespace-pre-line">
                {viewItem.message}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-700 font-semibold">
                    Recipients
                  </p>
                  <p className="text-lg font-bold">
                    {viewItem.recipient_count}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-700 font-semibold">
                    SMS Sent
                  </p>
                  <p className="text-lg font-bold">
                    {viewItem.sms_sent_count}
                  </p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <p className="text-xs text-indigo-700 font-semibold">
                    Emails Sent
                  </p>
                  <p className="text-lg font-bold">
                    {viewItem.email_sent_count}
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-xs text-red-700 font-semibold">Failed</p>
                  <p className="text-lg font-bold">{viewItem.failed_count}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Per-Recipient Delivery
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">Phone</th>
                        <th className="px-3 py-2 text-left">Email</th>
                        <th className="px-3 py-2 text-left">SMS</th>
                        <th className="px-3 py-2 text-left">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewItem.recipients.map((r) => (
                        <tr key={r.id} className="border-b">
                          <td className="px-3 py-2">{r.phone || "—"}</td>
                          <td className="px-3 py-2 truncate">
                            {r.email || "—"}
                          </td>
                          <td className="px-3 py-2">
                            <StatusPill
                              status={r.sms_status}
                              error={r.sms_error}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <StatusPill
                              status={r.email_status}
                              error={r.email_error}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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

      {/* Loading overlay for detail fetch */}
      {viewLoading && (
        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow flex items-center gap-2">
            <Loader2 className="animate-spin" size={18} /> Loading…
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// Status pill component
// =========================================================
function StatusPill({
  status,
  error,
}: {
  status: "pending" | "sent" | "failed";
  error?: string | null;
}) {
  const cls =
    status === "sent"
      ? "bg-green-100 text-green-700"
      : status === "failed"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-600";

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${cls}`}
      title={error || ""}
    >
      {status}
    </span>
  );
}