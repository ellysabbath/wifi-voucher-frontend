import { useState } from 'react';
import { useBookStore } from '../store/bookStore';
import { Plus, Trash2, Download } from 'lucide-react';
import Modal from '../components/Modal';

export default function Books() {
  const books = useBookStore(s => s.books);
  const addBook = useBookStore(s => s.addBook);
  const deleteBook = useBookStore(s => s.deleteBook);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', author: '', description: '', coverUrl: '', fileUrl: '#', category: 'Imani'
  });

  const resetForm = () => setForm({
    title: '', author: '', description: '', coverUrl: '', fileUrl: '#', category: 'Imani'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBook(form);
    resetForm();
    setIsModalOpen(false);
  };

  const handleClose = () => {
    resetForm();
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vitabu</h1>
        <button onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Ongeza Kitabu
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} title="Ongeza Kitabu Kipya">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Jina la Kitabu *</label>
            <input required value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Mwandishi *</label>
            <input required value={form.author}
              onChange={e => setForm({ ...form, author: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Kategoria</label>
            <input value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">URL ya Cover</label>
            <input value={form.coverUrl}
              onChange={e => setForm({ ...form, coverUrl: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">URL ya Faili</label>
            <input value={form.fileUrl}
              onChange={e => setForm({ ...form, fileUrl: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Maelezo</label>
            <textarea value={form.description} rows={3}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="md:col-span-2 flex gap-3 justify-end pt-4 border-t">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(b => (
          <div key={b.id} className="bg-white rounded-lg shadow p-4 flex gap-4">
            <img src={b.coverUrl} alt={b.title} className="w-24 h-32 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-bold">{b.title}</h3>
              <p className="text-sm text-gray-500">{b.author}</p>
              <p className="text-xs text-gray-400 mt-1">{b.category}</p>
              <p className="text-sm mt-2 line-clamp-2">{b.description}</p>
              <div className="flex gap-2 mt-3">
                <a href={b.fileUrl} className="text-primary text-sm flex items-center gap-1">
                  <Download size={14} /> Pakua
                </a>
                <button onClick={() => deleteBook(b.id)} className="text-red-500 text-sm">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}