import { useState } from 'react';
import { useGalleryStore } from '../store/galleryStore';
import { Plus, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

export default function Gallery() {
  const items = useGalleryStore(s => s.items);
  const addItem = useGalleryStore(s => s.addItem);
  const deleteItem = useGalleryStore(s => s.deleteItem);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', imageUrl: '', album: 'Ibada' });

  const albums = ['Zote', ...new Set(items.map(i => i.album))];
  const [filter, setFilter] = useState('Zote');
  const filtered = filter === 'Zote' ? items : items.filter(i => i.album === filter);

  const resetForm = () => setForm({ title: '', imageUrl: '', album: 'Ibada' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItem(form);
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
        <h1 className="text-3xl font-bold">Picha za Kanisa</h1>
        <button onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Ongeza Picha
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} title="Ongeza Picha Mpya">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Kichwa cha Picha *</label>
            <input required value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">URL ya Picha *</label>
            <input required value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Albamu</label>
            <input value={form.album}
              onChange={e => setForm({ ...form, album: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
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

      <div className="flex gap-2 mb-4 flex-wrap">
        {albums.map(a => (
          <button key={a} onClick={() => setFilter(a)}
            className={`px-4 py-2 rounded-lg text-sm ${filter === a ? 'bg-primary text-white' : 'bg-white'}`}>
            {a}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden group">
            <div className="relative">
              <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
              <button onClick={() => deleteItem(item.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="p-3">
              <p className="font-semibold">{item.title}</p>
              <p className="text-xs text-gray-500">{item.album}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}