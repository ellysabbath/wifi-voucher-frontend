import { useState } from 'react';
import { useLeaderStore } from '../store/leaderStore';
import { Plus, Trash2, Phone, Mail } from 'lucide-react';
import Modal from '../components/Modal';

export default function Leadership() {
  const leaders = useLeaderStore(s => s.leaders);
  const addLeader = useLeaderStore(s => s.addLeader);
  const deleteLeader = useLeaderStore(s => s.deleteLeader);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', position: '', photo: '', phone: '', email: '', bio: ''
  });

  const resetForm = () => setForm({
    name: '', position: '', photo: '', phone: '', email: '', bio: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const photo = form.photo || `https://i.pravatar.cc/150?u=${encodeURIComponent(form.name)}`;
    addLeader({ ...form, photo });
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
        <h1 className="text-3xl font-bold">Uongozi wa Kanisa</h1>
        <button onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Ongeza Kiongozi
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} title="Ongeza Kiongozi Mpya">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Jina Kamili *</label>
            <input required value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Wadhifa *</label>
            <input required value={form.position}
              onChange={e => setForm({ ...form, position: e.target.value })}
              placeholder="Mchungaji, Mzee wa Kanisa, n.k."
              className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Namba ya Simu *</label>
            <input required value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+255712345678"
              className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Barua Pepe</label>
            <input type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">URL ya Picha (hiari)</label>
            <input value={form.photo}
              onChange={e => setForm({ ...form, photo: e.target.value })}
              placeholder="Acha wazi kutumia picha ya kiotomatiki"
              className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Wasifu</label>
            <textarea value={form.bio} rows={3}
              onChange={e => setForm({ ...form, bio: e.target.value })}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaders.map(l => (
          <div key={l.id} className="bg-white rounded-lg shadow p-6 text-center relative group">
            <button onClick={() => deleteLeader(l.id)}
              className="absolute top-3 right-3 text-red-500 opacity-0 group-hover:opacity-100 transition">
              <Trash2 size={16} />
            </button>
            <img src={l.photo} alt={l.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
            <h3 className="font-bold text-lg">{l.name}</h3>
            <p className="text-primary font-semibold text-sm mb-3">{l.position}</p>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex items-center justify-center gap-2">
                <Phone size={14} /> {l.phone}
              </p>
              {l.email && (
                <p className="flex items-center justify-center gap-2">
                  <Mail size={14} /> {l.email}
                </p>
              )}
            </div>
            {l.bio && (
              <p className="text-xs text-gray-500 mt-3 italic">{l.bio}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}