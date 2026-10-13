// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import {
  Users,
  MessageSquare,
  Calendar,
  Newspaper,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Skeleton } from "../components/skeleton";

// Real API clients
import { adminApi } from "../lib/adminApi";
import { eventApi, type ChurchEvent } from "../lib/eventApi";
import { newsApi, type NewsItem } from "../lib/newsApi";
import { galleryApi } from "../lib/galleryApi";

// =========================================================
// Types
// =========================================================
interface StatItem {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

interface DashboardData {
  stats: StatItem[];
  events: ChurchEvent[];
  news: NewsItem[];
  galleryCount: number;
}

// =========================================================
// Component
// =========================================================
export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // Load dashboard data
  // =========================================================
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [membersRes, eventsRes, newsRes, galleryRes] = await Promise.all([
        adminApi.listUsers({ page: 1, page_size: 1 }),
        eventApi.list({ page: 1, page_size: 4 }),
        newsApi.list({ page: 1, page_size: 4 }),
        galleryApi.list({ page: 1, page_size: 1 }),
      ]);

      const stats: StatItem[] = [
        {
          label: "Members",
          value: membersRes.count ?? 0,
          icon: Users,
          color: "bg-blue-500",
        },
        {
          label: "Photos",
          value: galleryRes.count ?? 0,
          icon: MessageSquare,
          color: "bg-green-500",
        },
        {
          label: "Upcoming Events",
          value: eventsRes.count ?? 0,
          icon: Calendar,
          color: "bg-purple-500",
        },
        {
          label: "News Articles",
          value: newsRes.count ?? 0,
          icon: Newspaper,
          color: "bg-orange-500",
        },
      ];

      setData({
        stats,
        events: eventsRes.results ?? [],
        news: newsRes.results ?? [],
        galleryCount: galleryRes.count ?? 0,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load dashboard.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================================
  // Formatting helpers
  // =========================================================
  const prettyDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  // =========================================================
  // Render
  // =========================================================
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">
            Welcome to Bahi SDA Church
          </h1>
          <p className="text-gray-500">Church management system</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="self-start sm:self-auto text-sm text-gray-600 hover:text-black disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Refreshing…
            </>
          ) : (
            <>
              <RefreshCw size={14} /> Refresh
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg p-3 text-sm border bg-red-50 border-red-200 text-red-700">
          {error}
        </div>
      )}

      {/* ============ STATS ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-5 lg:p-6"
              >
                <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                <Skeleton className="h-3 w-24 mb-3" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))
          : (data?.stats ?? []).map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-lg shadow p-5 lg:p-6"
              >
                <div
                  className={`w-12 h-12 ${s.color} rounded-lg mb-4 flex items-center justify-center text-white`}
                >
                  <s.icon size={24} />
                </div>
                <p className="text-gray-500 text-sm">{s.label}</p>
                <p className="text-2xl lg:text-3xl font-bold">{s.value}</p>
              </div>
            ))}
      </div>

      {/* ============ LOWER PANELS ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Upcoming events */}
        <div className="bg-white rounded-lg shadow p-5 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold mb-4">
            Upcoming Events
          </h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="border-l-4 border-gray-200 pl-3"
                >
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : !data?.events || data.events.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              No upcoming events yet.
            </p>
          ) : (
            <div className="space-y-3">
              {data.events.slice(0, 4).map((e) => (
                <div key={e.id} className="border-l-4 border-primary pl-3">
                  <p className="font-semibold text-sm lg:text-base truncate">
                    {e.title}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500">
                    {prettyDate(e.event_date)} — {e.event_time}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest news */}
        <div className="bg-white rounded-lg shadow p-5 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold mb-4">
            Latest News
          </h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="border-l-4 border-gray-200 pl-3"
                >
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </div>
          ) : !data?.news || data.news.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              No news articles yet.
            </p>
          ) : (
            <div className="space-y-3">
              {data.news.slice(0, 4).map((n) => (
                <div key={n.id} className="border-l-4 border-accent pl-3">
                  <p className="font-semibold text-sm lg:text-base truncate">
                    {n.title}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500 truncate">
                    {n.author_email || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}