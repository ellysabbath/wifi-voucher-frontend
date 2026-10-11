import { useState } from 'react';
import { useNewsStore } from '../store/newsStore';
import { Plus, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

export default function News() {
  const news = useNewsStore(s => s.news);
  const addNews = useNewsStore(s => s.addNews);
  const deleteNews = useNewsStore(s => s.deleteNews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', content: '', author: 'Msimamizi', category: 'tangazo' as const
  });

  const resetForm = () => setForm({
    title: '', content: '', author: 'Msimamizi', category: 'tangazo'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNews(form);
    resetForm();
    setIsModalOpen(false);
  };

  const handleClose = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const colors: Record<string, string> = {
    tangazo: 'bg-blue-100 text-blue-700',
    tukio: 'bg-green-100 text-green-700',
    habari: 'bg-orange-100 text-orange-700',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Habari na Matangazo</h1>
        <button onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Ongeza Habari
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} title="Ongeza Habari Mpya">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Kichwa *</label>
            <input required value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Maudhui *</label>
            <textarea required value={form.content} rows={4}
              onChange={e => setForm({ ...form, content: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Kategoria</label>
            <select value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value as any })}
              className="w-full border rounded-lg px-3 py-2">
              <option value="tangazo">Tangazo</option>
              <option value="tukio">Tukio</option>
              <option value="habari">Habari</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button type="button" onClick={handleClose}
              className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300">
              Ghairi
            </button>
            <button type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark">
              Hifadhi
            </button>
          </div>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map(n => (
          <div key={n.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-2">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[n.category]}`}>
                {n.category}
              </span>
              <button onClick={() => deleteNews(n.id)} className="text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
            <h3 className="text-xl font-bold mb-2">{n.title}</h3>
            <p className="text-gray-600 mb-3">{n.content}</p>
            <p className="text-sm text-gray-400">
              {n.author} - {new Date(n.publishedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}