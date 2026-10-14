// src/pages/user/MyCalendar.tsx
import { useEffect, useState } from "react";
import {
  Calendar as CalIcon,
  Clock,
  MapPin,
  Search,
  RefreshCw,
  X,
  Tag,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Skeleton } from "../../components/skeleton";
import { eventApi, type ChurchEvent, type EventCategory } from "../../lib/eventApi";

const CATEGORY_BORDER: Record<EventCategory, string> = {
  worship: "border-blue-500",
  meeting: "border-green-500",
  celebration: "border-yellow-500",
  session: "border-purple-500",
};

const CATEGORY_LABEL: Record<EventCategory, string> = {
  worship: "Worship Service",
  meeting: "Meeting",
  celebration: "Celebration",
  session: "Leadership Session",
};

function prettyDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), "dd MMM yyyy");
  } catch {
    return isoDate;
  }
}

export default function MyCalendar() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "">("");
  const [viewItem, setViewItem] = useState<ChurchEvent | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await eventApi.list({
        q: search || undefined,
        category: categoryFilter || undefined,
        page: 1,
        page_size: 500,
      });
      setEvents(res.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">
            Upcoming church events and services
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as EventCategory | "")
          }
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {(Object.keys(CATEGORY_LABEL) as EventCategory[]).map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-5 border-l-4 border-gray-200"
            >
              <Skeleton className="h-6 w-1/3 mb-3" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex gap-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))
        ) : events.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No events scheduled.
          </div>
        ) : (
          events.map((e) => (
            <button
              key={e.id}
              onClick={() => setViewItem(e)}
              className={`bg-white rounded-lg shadow p-5 border-l-4 ${
                CATEGORY_BORDER[e.category]
              } text-left w-full hover:shadow-md transition`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold truncate">{e.title}</h3>
                  <p className="text-gray-600 mt-1 line-clamp-2">
                    {e.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <CalIcon size={14} /> {prettyDate(e.event_date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {e.event_time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {e.location}
                    </span>
                  </div>
                </div>
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
            <div
              className={`flex justify-between items-start p-6 border-b border-l-4 ${CATEGORY_BORDER[viewItem.category]}`}
            >
              <div>
                <h2 className="text-xl font-bold">{viewItem.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {CATEGORY_LABEL[viewItem.category]}
                </p>
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
                  <CalIcon size={16} className="text-primary" />
                  <span>{prettyDate(viewItem.event_date)}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                  <Clock size={16} className="text-primary" />
                  <span>{viewItem.event_time}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                  <MapPin size={16} className="text-primary" />
                  <span>{viewItem.location}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                  <Tag size={16} className="text-primary" />
                  <span>{CATEGORY_LABEL[viewItem.category]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}