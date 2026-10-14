// src/pages/user/MyProfile.tsx
import { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Camera,
  X,
  Check,
  Save,
  Shield,
  Loader2,
} from "lucide-react";
import { Skeleton } from "../../components/skeleton";
import { useCurrentUser } from "../../hooks/useCurrentUser";

function base64ToDataUrl(b64: string | null, mime = "image/jpeg"): string {
  if (!b64) return "";
  if (b64.startsWith("data:")) return b64;
  return `data:${mime};base64,${b64}`;
}

function stripDataUrlPrefix(dataUrl: string): string {
  return dataUrl.replace(/^data:[^;]+;base64,/, "");
}

export default function MyProfile() {
  const { user, loading, error, update } = useCurrentUser();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    photo: "",
    photoPreview: "",
    bio: "",
    address: "",
  });
  const [success, setSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name ?? "",
        phone: user.phone ?? "",
        photo: user.photo ?? "",
        photoPreview: user.photo ? base64ToDataUrl(user.photo) : "",
        bio: user.bio ?? "",
        address: user.address ?? "",
      });
    }
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setForm((f) => ({
        ...f,
        photo: stripDataUrlPrefix(dataUrl),
        photoPreview: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      await update({
        full_name: form.full_name,
        phone: form.phone,
        photo: form.photo,
        bio: form.bio,
        address: form.address,
      });
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        full_name: user.full_name ?? "",
        phone: user.phone ?? "",
        photo: user.photo ?? "",
        photoPreview: user.photo ? base64ToDataUrl(user.photo) : "",
        bio: user.bio ?? "",
        address: user.address ?? "",
      });
    }
    setSaveError("");
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-end gap-4 -mt-12">
            <Skeleton className="w-32 h-32 rounded-2xl" />
            <div className="flex-1">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8 text-center text-red-600">
        {error || "Profile not available."}
      </div>
    );
  }

  const displayPhoto = form.photoPreview
    ? form.photoPreview
    : `https://i.pravatar.cc/150?u=${encodeURIComponent(user.email)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
          My Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your personal information
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 flex items-center gap-3">
          <Check size={20} />
          <span className="font-semibold">Profile updated successfully!</span>
        </div>
      )}
      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {saveError}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary via-blue-700 to-indigo-800" />
        <div className="px-6 lg:px-8 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 -mt-12">
            <div className="relative">
              <img
                src={displayPhoto}
                alt={user.full_name}
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover border-4 border-white shadow-lg bg-gray-100"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark"
                >
                  <Camera size={16} />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1 lg:pb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {user.full_name}
              </h2>
              <p className="text-primary font-semibold flex items-center gap-1 mt-1">
                <Shield size={14} /> {user.role}
              </p>
            </div>

            <div className="lg:pb-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark flex items-center gap-2"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 flex items-center gap-2"
                  >
                    <X size={16} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark flex items-center gap-2 disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Saving…
                      </>
                    ) : (
                      <>
                        <Save size={16} /> Save
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6">
          Personal Information
        </h3>

        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                disabled={!isEditing}
                className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border rounded-lg pl-10 pr-3 py-2.5 bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Phone
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Address
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                disabled={!isEditing}
                className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Bio
            </label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              disabled={!isEditing}
              className="w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Joined
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                value={
                  user.joined_at
                    ? new Date(user.joined_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"
                }
                disabled
                className="w-full border rounded-lg pl-10 pr-3 py-2.5 bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}