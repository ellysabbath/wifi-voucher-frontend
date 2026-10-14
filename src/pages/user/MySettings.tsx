// src/pages/user/MySettings.tsx
import { useState } from "react";
import {
  Bell,
  Globe,
  Moon,
  Mail,
  MessageSquare,
  Check,
  Save,
  Smartphone,
} from "lucide-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export default function MySettings() {
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "appearance">(
    "general"
  );
  const [success, setSuccess] = useState("");
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
  });
  const [appearance, setAppearance] = useState({
    theme: "light",
  });

  const handleSave = (section: string) => {
    setSuccess(`${section} saved!`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
          My Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account preferences
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

      {activeTab === "general" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              General Settings
            </h3>
            <p className="text-sm text-gray-500">Language, timezone, and locale</p>
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
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      )}

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
                { key: "news", label: "News & Announcements" },
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
                          !notifications[item.key as keyof typeof notifications],
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
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      )}

      {activeTab === "appearance" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Appearance
            </h3>
            <p className="text-sm text-gray-500">
              Choose how the system looks to you
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
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark flex items-center gap-2"
            >
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}