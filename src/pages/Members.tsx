import { useState } from 'react';
import { useMemberStore } from '../store/memberStore';
import { Plus, Trash2, Search } from 'lucide-react';
import Modal from '../components/Modal';

export default function Members() {
  const members = useMemberStore(s => s.members);
  const addMember = useMemberStore(s => s.addMember);
  const deleteMember = useMemberStore(s => s.deleteMember);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    fullName: '', phone: '', gender: 'me' as const,
    ageGroup: 'vijana' as const, ministry: 'Vijana',
    baptized: false, address: ''
  });

  const filtered = members.filter(m =>
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search)
  );

  const resetForm = () => {
    setForm({ fullName: '', phone: '', gender: 'me', ageGroup: 'vijana', ministry: 'Vijana', baptized: false, address: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMember(form);
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
        <h1 className="text-3xl font-bold">Wanachama</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
        >
          <Plus size={18} /> Ongeza Mwanachama
        </button>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleClose} title="Ongeza Mwanachama Mpya">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Jina Kamili *</label>
            <input required value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
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
            <label className="block text-sm font-semibold mb-1">Jinsia</label>
            <select value={form.gender}
              onChange={e => setForm({ ...form, gender: e.target.value as any })}
              className="w-full border rounded-lg px-3 py-2">
              <option value="me">Me</option>
              <option value="ke">Ke</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Kundi la Umri</label>
            <select value={form.ageGroup}
              onChange={e => setForm({ ...form, ageGroup: e.target.value as any })}
              className="w-full border rounded-lg px-3 py-2">
              <option value="watoto">Watoto</option>
              <option value="vijana">Vijana</option>
              <option value="wazee">Wazee</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Huduma</label>
            <select value={form.ministry}
              onChange={e => setForm({ ...form, ministry: e.target.value })}
              className="w-full border rounded-lg px-3 py-2">
              <option>Kwaya</option>
              <option>Vijana</option>
              <option>Wanawake</option>
              <option>Wazee</option>
              <option>Usabato</option>
              <option>Uinjilisti</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Anwani</label>
            <input value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full border rounded-lg px-3 py-2" />
          </div>

          <label className="flex items-center gap-2 md:col-span-2">
            <input type="checkbox" checked={form.baptized}
              onChange={e => setForm({ ...form, baptized: e.target.checked })} />
            <span>AmeBatizwa</span>
          </label>

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

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            placeholder="Tafuta kwa jina au simu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-3 py-2"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Jina</th>
              <th className="px-4 py-3 text-left">Simu</th>
              <th className="px-4 py-3 text-left">Jinsia</th>
              <th className="px-4 py-3 text-left">Kundi</th>
              <th className="px-4 py-3 text-left">Huduma</th>
              <th className="px-4 py-3 text-left">Ubatizo</th>
              <th className="px-4 py-3 text-left">Hatua</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{m.fullName}</td>
                <td className="px-4 py-3">{m.phone}</td>
                <td className="px-4 py-3">{m.gender === 'me' ? 'Me' : 'Ke'}</td>
                <td className="px-4 py-3 capitalize">{m.ageGroup}</td>
                <td className="px-4 py-3">{m.ministry}</td>
                <td className="px-4 py-3">{m.baptized ? '✅' : '❌'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => deleteMember(m.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}