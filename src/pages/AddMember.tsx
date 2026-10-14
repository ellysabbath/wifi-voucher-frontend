// src/pages/AddMember.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Check, X } from "lucide-react";
import { adminApi } from "../lib/adminApi";

export default function AddMember() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "member",
    emailVerified: true,
    isActive: true,
    isStaff: false,
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    try {
      await adminApi.createUser({
        email: form.email,
        password: form.password,
        full_name: form.fullName,
        phone: form.phone,
        role: form.role,
        email_verified: form.emailVerified,
        is_active: form.isActive,
        is_staff: form.isStaff,
      });
      navigate("/admin/members");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Member</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            Full Name *
          </label>
          <input
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            Password *
          </label>
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            <option value="member">Member</option>
            <option value="leader">Leader</option>
            <option value="elder">Elder</option>
            <option value="pastor">Pastor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.emailVerified}
              onChange={(e) =>
                setForm({ ...form, emailVerified: e.target.checked })
              }
            />
            <span className="text-sm">Email Verified</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            <span className="text-sm">Active</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isStaff}
              onChange={(e) =>
                setForm({ ...form, isStaff: e.target.checked })
              }
            />
            <span className="text-sm">Staff</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">Address</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {error && (
          <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="md:col-span-2 flex gap-3 pt-4 border-t">
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
                <Check size={16} /> Save Member
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/members")}
            className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2"
          >
            <X size={16} /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}