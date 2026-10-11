import { useState } from 'react';
import { useEventStore } from '../store/eventStore';
import { Plus, Trash2, Calendar as CalIcon, Clock, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Modal from '../components/Modal';

export default function Calendar() {
  const events = useEventStore(s => s.events);
  const addEvent = useEventStore(s => s.addEvent);
  const deleteEvent = useEventStore(s => s.deleteEvent);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '',
    location: '', category: 'ibada' as const
  });

  const resetForm = () => setForm({
    title: '', description: '', date: '', time: '', location: '', category: 'ibada'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent(form);
    resetForm();
    setIsModalOpen(false);
  };

  const handleClose = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  const colors: Record<string, string> = {
    ibada: 'border-blue-500',
    mkutano: 'border-green-500',
    sherehe: 'border-yellow-500',
    kikao: 'border-purple-500',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kalenda ya Kanisa</h1>
        <button onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Ongeza Tukio
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} title="Ongeza Tukio Jipya">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Kichwa *</label>
            <input required value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Tarehe *</label>
            <input required type="date" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Muda *</label>
            <input required type="time" value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Mahali *</label>
            <input required value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Kategoria</label>
            <select value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value as any })}
              className="w-full border rounded-lg px-3 py-2">
              <option value="ibada">Ibada</option>
              <option value="mkutano">Mkutano</option>
              <option value="sherehe">Sherehe</option>
              <option value="kikao">Kikao</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Maelezo</label>
            <textarea value={form.description}
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

      <div className="space-y-4">
        {sorted.map(e => (
          <div key={e.id} className={`bg-white rounded-lg shadow p-5 border-l-4 ${colors[e.category]}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{e.title}</h3>
                <p className="text-gray-600 mt-1">{e.description}</p>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalIcon size={14} /> {format(parseISO(e.date), 'dd MMM yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {e.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {e.location}
                  </span>
                </div>
              </div>
              <button onClick={() => deleteEvent(e.id)} className="text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}