// src/pages/user/UserDashboard.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Newspaper,
  Church,
  Image as ImageIcon,
  RefreshCw,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Skeleton } from "../../components/skeleton";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { eventApi, type ChurchEvent } from "../../lib/eventApi";
import { newsApi, type NewsItem } from "../../lib/newsApi";
import { ministriesApi, type Ministry } from "../../lib/ministriesApi";
import { galleryApi } from "../../lib/galleryApi";

interface Stat {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  to: string;
}

export default function UserDashboard() {
  const { user } = useCurrentUser();

  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [galleryCount, setGalleryCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [eventsRes, newsRes, ministriesRes, galleryRes] = await Promise.all([
        eventApi.list({ page: 1, page_size: 4 }),
        newsApi.list({ page: 1, page_size: 4, published: true }),
        ministriesApi.list({ page: 1, page_size: 4, active: true }),
        galleryApi.list({ page: 1, page_size: 1 }),
      ]);
      setEvents(eventsRes.results ?? []);
      setNews(newsRes.results ?? []);
      setMinistries(ministriesRes.results ?? []);
      setGalleryCount(galleryRes.count ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const stats: Stat[] = [
    {
      label: "Upcoming Events",
      value: events.length,
      icon: Calendar,
      color: "bg-purple-500",
      to: "/user/calendar",
    },
    {
      label: "News Articles",
      value: news.length,
      icon: Newspaper,
      color: "bg-orange-500",
      to: "/user/news",
    },
    {
      label: "Ministries",
      value: ministries.length,
      icon: Church,
      color: "bg-blue-500",
      to: "/user/ministries",
    },
    {
      label: "Church Photos",
      value: galleryCount,
      icon: ImageIcon,
      color: "bg-green-500",
      to: "/user/gallery",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-1">
            Welcome{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-gray-500">Your personal church dashboard</p>
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

      {error && (
        <div className="mb-4 rounded-lg p-3 text-sm border bg-red-50 border-red-200 text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
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
          : stats.map((s) => (
              <Link
                key={s.label}
                to={s.to}
                className="bg-white rounded-lg shadow p-5 lg:p-6 hover:shadow-md transition group"
              >
                <div
                  className={`w-12 h-12 ${s.color} rounded-lg mb-4 flex items-center justify-center text-white`}
                >
                  <s.icon size={24} />
                </div>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  {s.label}
                  <ArrowRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition"
                  />
                </p>
                <p className="text-2xl lg:text-3xl font-bold">{s.value}</p>
              </Link>
            ))}
      </div>

      {/* Lower panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Events */}
        <div className="bg-white rounded-lg shadow p-5 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-primary" /> Upcoming Events
          </h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-l-4 border-gray-200 pl-3">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              No upcoming events yet.
            </p>
          ) : (
            <div className="space-y-3">
              {events.map((e) => (
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

          <Link
            to="/user/calendar"
            className="text-primary text-sm flex items-center gap-1 mt-4 hover:underline"
          >
            View full calendar <ArrowRight size={14} />
          </Link>
        </div>

        {/* News */}
        <div className="bg-white rounded-lg shadow p-5 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold mb-4 flex items-center gap-2">
            <Newspaper size={18} className="text-primary" /> Latest News
          </h2>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border-l-4 border-gray-200 pl-3">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </div>
          ) : news.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              No news articles yet.
            </p>
          ) : (
            <div className="space-y-3">
              {news.map((n) => (
                <div key={n.id} className="border-l-4 border-accent pl-3">
                  <p className="font-semibold text-sm lg:text-base truncate">
                    {n.title}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500 truncate">
                    {prettyDate(n.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/user/news"
            className="text-primary text-sm flex items-center gap-1 mt-4 hover:underline"
          >
            Read all news <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickLink to="/user/profile" label="My Profile" />
        <QuickLink to="/user/writings" label="Writings" />
        <QuickLink to="/user/gallery" label="Church Images" />
        <QuickLink to="/user/settings" label="Settings" />
      </div>
    </div>
  );
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition text-sm font-semibold flex items-center justify-between"
    >
      {label}
      <ArrowRight size={14} className="text-gray-400" />
    </Link>
  );
}