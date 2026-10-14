// src/pages/user/Writings.tsx
import { useEffect, useState } from "react";
import { BookOpen, Search, RefreshCw, X } from "lucide-react";
import { Skeleton, SkeletonText } from "../../components/skeleton";
import { booksApi, type Book } from "../../lib/booksApi";

function prettyDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function Writings() {
  const [items, setItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState<Book | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await booksApi.list({
        q: search || undefined,
        page: 1,
        page_size: 100,
      });
      setItems(res.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load writings.");
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
          <h1 className="text-3xl font-bold">Writings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Articles and books from the church
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
            placeholder="Search writings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-4 flex gap-4"
            >
              <Skeleton className="w-20 h-28 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-3" />
                <SkeletonText lines={2} className="mb-3" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No writings yet.
          </div>
        ) : (
          items.map((b) => (
            <button
              key={b.id}
              onClick={() => setViewItem(b)}
              className="bg-white rounded-lg shadow p-4 flex gap-4 text-left hover:shadow-md transition"
            >
              <div className="w-20 h-28 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen size={28} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{b.title}</h3>
                <p className="text-sm text-gray-500 truncate">{b.author}</p>
                <p className="text-xs text-gray-400 mt-1">{b.category}</p>
                <p className="text-sm mt-2 line-clamp-2">{b.description}</p>
              </div>
            </button>
          ))
        )}
      </div>

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
              <div>
                <h2 className="text-xl font-bold">{viewItem.title}</h2>
                <p className="text-sm text-gray-500">
                  {viewItem.author} — {viewItem.category}
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
              <p className="text-gray-700 whitespace-pre-line">
                {viewItem.description || "No description."}
              </p>
              <p className="text-xs text-gray-500">
                Added {prettyDate(viewItem.created_at)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}