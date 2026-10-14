// src/pages/user/MyNews.tsx
import { useEffect, useState } from "react";
import {  Search, RefreshCw, X } from "lucide-react";
import { Skeleton, SkeletonText } from "../../components/skeleton";
import { newsApi, type NewsItem, type NewsCategory } from "../../lib/newsApi";

const CATEGORIES: { value: NewsCategory; label: string; badge: string }[] = [
  { value: "announcement", label: "Announcement", badge: "bg-blue-100 text-blue-700" },
  { value: "event", label: "Event", badge: "bg-green-100 text-green-700" },
  { value: "news", label: "News", badge: "bg-orange-100 text-orange-700" },
];

function base64ToDataUrl(b64: string | null, mime = "image/jpeg"): string {
  if (!b64) return "";
  if (b64.startsWith("data:")) return b64;
  return `data:${mime};base64,${b64}`;
}

export default function MyNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<NewsCategory | "">("");
  const [viewItem, setViewItem] = useState<NewsItem | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await newsApi.list({
        q: search || undefined,
        category: categoryFilter || undefined,
        published: true,
        page: 1,
        page_size: 100,
      });
      setItems(res.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }, [search, categoryFilter]);

  const prettyDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const getBadge = (c: NewsCategory) =>
    CATEGORIES.find((x) => x.value === c)?.badge ?? "bg-gray-100 text-gray-700";

  const getLabel = (c: NewsCategory) =>
    CATEGORIES.find((x) => x.value === c)?.label ?? c;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My News</h1>
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
            placeholder="Search by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as NewsCategory | "")}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
              <Skeleton className="w-full h-40 rounded-none" />
              <div className="p-6">
                <Skeleton className="h-6 w-24 mb-3" />
                <Skeleton className="h-5 w-3/4 mb-3" />
                <SkeletonText lines={3} className="mb-4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No news yet.
          </div>
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              onClick={() => setViewItem(n)}
              className="bg-white rounded-lg shadow overflow-hidden text-left hover:shadow-md transition"
            >
              {n.image && (
                <img
                  src={base64ToDataUrl(n.image)}
                  alt={n.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-6">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-3 ${getBadge(
                    n.category
                  )}`}
                >
                  {getLabel(n.category)}
                </span>
                <h3 className="text-xl font-bold mb-2">{n.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-3">{n.content}</p>
                <p className="text-sm text-gray-400">
                  {prettyDate(n.created_at)}
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
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${getBadge(
                    viewItem.category
                  )}`}
                >
                  {getLabel(viewItem.category)}
                </span>
                <h2 className="text-xl font-bold">{viewItem.title}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {prettyDate(viewItem.created_at)}
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
              {viewItem.image && (
                <div className="rounded-xl overflow-hidden border">
                  <img
                    src={base64ToDataUrl(viewItem.image)}
                    alt={viewItem.title}
                    className="w-full max-h-96 object-contain bg-gray-50"
                  />
                </div>
              )}
              <p className="text-gray-800 whitespace-pre-line">
                {viewItem.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}