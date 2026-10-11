import { useState, useRef } from 'react';
import { useUserStore } from '../store/userStore';
import {
  User, Mail, Phone, MapPin, Calendar, Edit3,
  Camera, Upload, X, Check, Save, Shield
} from 'lucide-react';

export default function Profile() {
  const user = useUserStore(s => s.user);
  const updateUser = useUserStore(s => s.updateUser);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(user);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(form);
    setIsEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleCancel = () => {
    setForm(user);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Wasifu Wangu</h1>
        <p className="text-gray-500 text-sm mt-1">Simamia taarifa zako za kibinafsi</p>
      </div>

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 flex items-center gap-3">
          <Check size={20} />
          <span className="font-semibold">Taarifa zimehifadhiwa kikamilifu!</span>
        </div>
      )}

      {/* Profile header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-primary via-blue-700 to-indigo-800 relative">
          <div className="absolute inset-0 bg-white/5"></div>
        </div>

        <div className="px-6 lg:px-8 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 -mt-12">
            {/* Photo */}
            <div className="relative">
              <img
                src={form.photo}
                alt={form.fullName}
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition"
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

            {/* Name + role */}
            <div className="flex-1 lg:pb-2">
              <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
              <p className="text-primary font-semibold flex items-center gap-1 mt-1">
                <Shield size={14} /> {user.role}
              </p>
            </div>

            {/* Actions */}
            <div className="lg:pb-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center gap-2"
                >
                  <Edit3 size={16} /> Hariri Wasifu
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center gap-2"
                  >
                    <X size={16} /> Ghairi
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center gap-2"
                  >
                    <Save size={16} /> Hifadhi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Taarifa za Kibinafsi</h3>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Jina Kamili
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                disabled={!isEditing}
                className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Barua Pepe
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                disabled={!isEditing}
                className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Namba ya Simu
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Anwani
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                disabled={!isEditing}
                className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Wasifu
            </label>
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              disabled={!isEditing}
              rows={4}
              className="w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          {/* Joined */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Alijiunga
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                value={new Date(user.joinedAt).toLocaleDateString('sw-TZ', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
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