import { useState } from 'react';
import { useMinistryStore } from '../store/ministryStore';
import { Plus, Trash2, Users, Calendar } from 'lucide-react';
import Modal from '../components/Modal';

export default function Ministries() {
  const ministries = useMinistryStore(s => s.ministries);
  const addMinistry = useMinistryStore(s => s.addMinistry);
  const deleteMinistry = useMinistryStore(s => s.deleteMinistry);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', leader: '',
    memberCount: 0, meetingDay: 'Jumamosi', icon: ''
  });

  const resetForm = () => setForm({
    name: '', description: '', leader: '',
    memberCount: 0, meetingDay: 'Jumamosi', icon: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMinistry(form);
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
        <h1 className="text-3xl font-bold">Huduma za Kanisa</h1>
        <button onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Ongeza Huduma
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} title="Ongeza Huduma Mpya">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Jina la Huduma *</label>
            <input required value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Maelezo</label>
            <textarea value={form.description} rows={3}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Kiongozi *</label>
            <input required value={form.leader}
              onChange={e => setForm({ ...form, leader: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Idadi ya Wanachama</label>
            <input type="number" min={0} value={form.memberCount}
              onChange={e => setForm({ ...form, memberCount: +e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Siku ya Mkutano</label>
            <select value={form.meetingDay}
              onChange={e => setForm({ ...form, meetingDay: e.target.value })}
              className="w-full border rounded-lg px-3 py-2">
              <option>Jumatatu</option>
              <option>Jumanne</option>
              <option>Jumatano</option>
              <option>Alhamisi</option>
              <option>Ijumaa</option>
              <option>Jumamosi</option>
              <option>Jumapili</option>
            </select>
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
        {ministries.map(m => (
          <div key={m.id} className="bg-white rounded-lg shadow p-6 relative group">
            <button onClick={() => deleteMinistry(m.id)}
              className="absolute top-3 right-3 text-red-500 opacity-0 group-hover:opacity-100 transition">
              <Trash2 size={16} />
            </button>
            <h3 className="text-xl font-bold mb-2">{m.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{m.description}</p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-600">
                <Users size={14} /> Kiongozi: {m.leader}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Users size={14} /> Wanachama: {m.memberCount}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Calendar size={14} /> Siku: {m.meetingDay}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}