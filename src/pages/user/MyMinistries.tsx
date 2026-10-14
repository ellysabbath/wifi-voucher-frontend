// src/pages/user/MyMinistries.tsx
import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  Calendar as CalIcon,
  X,
  Church,
} from "lucide-react";
import { Skeleton } from "../../components/skeleton";
import { ministriesApi, type Ministry } from "../../lib/ministriesApi";

export default function MyMinistries() {
  const [items, setItems] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState<Ministry | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await ministriesApi.list({
        q: search || undefined,
        active: true,
        page: 1,
        page_size: 200,
      });
      setItems(res.results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load ministries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Ministries</h1>
          <p className="text-gray-500 text-sm mt-1">
            Explore the church ministries
          </p>
        </div>
        <button
          onClick={load}
          className="border rounded-lg px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg p-3 text-sm border bg-red-50 border-red-200 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            placeholder="Search ministries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-5/6 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No ministries to show.
          </div>
        ) : (
          items.map((m) => (
            <button
              key={m.id}
              onClick={() => setViewItem(m)}
              className="bg-white rounded-lg shadow p-6 text-left hover:shadow-md transition"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {m.icon ? (
                    <span className="text-xl font-bold">{m.icon}</span>
                  ) : (
                    <Church size={22} />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold truncate">{m.name}</h3>
                  <p className="text-xs text-gray-500">
                    {m.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {m.description || "No description."}
              </p>

              <div className="space-y-1.5 text-sm text-gray-600">
                <p className="flex items-center gap-2 truncate">
                  <Users size={14} /> {m.leader_name || "Leader not assigned"}
                </p>
                <p className="flex items-center gap-2">
                  <CalIcon size={14} /> {m.meeting_day}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Viewer */}
      {viewItem && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setViewItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  {viewItem.icon || <Church size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{viewItem.name}</h2>
                  <p className="text-sm text-gray-500">
                    {viewItem.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewItem(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-800 whitespace-pre-line">
                {viewItem.description || "—"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                  <Users size={16} className="text-primary" />
                  <span>{viewItem.leader_name || "—"}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                  <CalIcon size={16} className="text-primary" />
                  <span>{viewItem.meeting_day}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}