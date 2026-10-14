// src/pages/user/ChurchImages.tsx
import { useEffect, useState } from "react";
import { Search, RefreshCw, X, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "../../components/skeleton";
import { galleryApi, type GalleryItem } from "../../lib/galleryApi";

function base64ToDataUrl(b64: string | null, mime = "image/jpeg"): string {
  if (!b64) return "";
  if (b64.startsWith("data:")) return b64;
  return `data:${mime};base64,${b64}`;
}

export default function ChurchImages() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [albumFilter, setAlbumFilter] = useState("");
  const [viewItem, setViewItem] = useState<GalleryItem | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await galleryApi.list({
        q: search || undefined,
        album: albumFilter || undefined,
        page: 1,
        page_size: 300,
      });
      setItems(res.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, albumFilter]);

  // Unique albums for the filter chips
  const albums = Array.from(new Set(items.map((i) => i.album))).sort();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Church Images</h1>
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
            placeholder="Search by title or album..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setAlbumFilter("")}
            className={`px-4 py-2 rounded-lg text-sm ${
              albumFilter === "" ? "bg-primary text-white" : "bg-gray-100"
            }`}
          >
            All Albums
          </button>
          {albums.map((a) => (
            <button
              key={a}
              onClick={() => setAlbumFilter(a)}
              className={`px-4 py-2 rounded-lg text-sm ${
                albumFilter === a ? "bg-primary text-white" : "bg-gray-100"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
              <Skeleton className="w-full h-48 rounded-none" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No photos yet.
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => setViewItem(item)}
              className="bg-white rounded-lg shadow overflow-hidden group text-left hover:shadow-md transition"
            >
              <div className="relative">
                <img
                  src={base64ToDataUrl(item.image)}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="p-3">
                <p className="font-semibold truncate">{item.title}</p>
                <p className="text-xs text-gray-500 truncate">{item.album}</p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Viewer */}
      {viewItem && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setViewItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="font-bold">{viewItem.title}</h3>
                <p className="text-xs text-gray-500">{viewItem.album}</p>
              </div>
              <button
                onClick={() => setViewItem(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 bg-black flex items-center justify-center overflow-auto">
              <img
                src={base64ToDataUrl(viewItem.image)}
                alt={viewItem.title}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Empty state illustration when no images yet */}
      {!loading && items.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            No photos have been uploaded by the church yet.
          </p>
        </div>
      )}
    </div>
  );
}