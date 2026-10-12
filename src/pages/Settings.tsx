// src/pages/Settings.tsx
import { useState } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  Bell, Lock, Globe, Moon, Mail, MessageSquare,
  Eye, EyeOff, Check, Save, Trash2, Shield,
  Smartphone, Key,
} from "lucide-react";

export default function Settings() {
  const { user } = useCurrentUser();

  const [activeTab, setActiveTab] = useState<
    "general" | "notifications" | "security" | "appearance"
  >("general");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [general, setGeneral] = useState({
    language: "en",
    timezone: "Africa/Dar_es_Salaam",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    events: true,
    news: true,
    chat: true,
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [appearance, setAppearance] = useState({
    theme: "light",
    primaryColor: "blue",
  });

  const handleSave = (section: string) => {
    setSuccess(`${section} saved!`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Moon },
  ] as const;

  const Toggle = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition ${
        checked ? "bg-primary" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
          Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account settings
          {user?.email && <span className="ml-1">({user.email})</span>}
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 flex items-center gap-3">
          <Check size={20} />
          <span className="font-semibold">{success}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* GENERAL */}
      {activeTab === "general" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              General Settings
            </h3>
            <p className="text-sm text-gray-500">
              Language, timezone, and basic preferences
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Language
            </label>
            <select
              value={general.language}
              onChange={(e) =>
                setGeneral({ ...general, language: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="en">English</option>
              <option value="sw">Swahili</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Timezone
            </label>
            <select
              value={general.timezone}
              onChange={(e) =>
                setGeneral({ ...general, timezone: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Africa/Dar_es_Salaam">
                Africa/Dar es Salaam (EAT)
              </option>
              <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              onClick={() => handleSave("General settings")}
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Notifications
            </h3>
            <p className="text-sm text-gray-500">
              Choose how you want to receive updates
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                key: "email",
                label: "Email",
                desc: "Receive notifications by email",
                icon: Mail,
              },
              {
                key: "sms",
                label: "SMS",
                desc: "Receive notifications by SMS",
                icon: MessageSquare,
              },
              {
                key: "push",
                label: "Push",
                desc: "Receive push notifications",
                icon: Smartphone,
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
                <Toggle
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      [item.key]:
                        !notifications[item.key as keyof typeof notifications],
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-gray-700 text-sm mb-3">
              Notification Types
            </h4>
            <div className="space-y-3">
              {[
                { key: "events", label: "Church Events" },
                { key: "news", label: "New Announcements" },
                { key: "chat", label: "Chat Messages" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <Toggle
                    checked={
                      notifications[item.key as keyof typeof notifications]
                    }
                    onChange={() =>
                      setNotifications({
                        ...notifications,
                        [item.key]:
                          !notifications[
                            item.key as keyof typeof notifications
                          ],
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              onClick={() => handleSave("Notifications")}
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      )}

      {/* SECURITY */}
      {activeTab === "security" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Security</h3>
            <p className="text-sm text-gray-500">
              Change your password and manage security
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full border rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Key size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password.newPassword}
                  onChange={(e) =>
                    setPassword({ ...password, newPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Key size={18} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password.confirm}
                  onChange={(e) =>
                    setPassword({ ...password, confirm: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              onClick={() => {
                if (
                  !password.current ||
                  !password.newPassword ||
                  !password.confirm
                ) {
                  setSuccess("Fill in all password fields");
                  setTimeout(() => setSuccess(""), 3000);
                  return;
                }
                if (password.newPassword !== password.confirm) {
                  setSuccess("Passwords do not match");
                  setTimeout(() => setSuccess(""), 3000);
                  return;
                }
                handleSave("Password");
                setPassword({ current: "", newPassword: "", confirm: "" });
              }}
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center gap-2"
            >
              <Save size={16} /> Change Password
            </button>
          </div>

          <div className="pt-6 border-t">
            <h4 className="font-bold text-red-600 text-sm mb-3 flex items-center gap-2">
              <Shield size={16} /> Danger Zone
            </h4>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-red-800 text-sm">
                  Delete Account
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  This action cannot be undone
                </p>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition text-sm flex items-center gap-2">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPEARANCE */}
      {activeTab === "appearance" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Appearance</h3>
            <p className="text-sm text-gray-500">
              Change how the system looks
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: "light",
                  label: "Light",
                  bg: "bg-white",
                  border: "border-gray-200",
                },
                {
                  id: "dark",
                  label: "Dark",
                  bg: "bg-gray-800",
                  border: "border-gray-700",
                },
                {
                  id: "system",
                  label: "System",
                  bg: "bg-gradient-to-br from-white to-gray-800",
                  border: "border-gray-300",
                },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() =>
                    setAppearance({ ...appearance, theme: theme.id })
                  }
                  className={`p-4 rounded-xl border-2 transition ${
                    appearance.theme === theme.id
                      ? "border-primary ring-2 ring-primary/20"
                      : theme.border
                  }`}
                >
                  <div
                    className={`w-full h-12 rounded-lg ${theme.bg} border mb-2`}
                  />
                  <p className="text-sm font-semibold text-gray-700">
                    {theme.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              onClick={() => handleSave("Appearance")}
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}