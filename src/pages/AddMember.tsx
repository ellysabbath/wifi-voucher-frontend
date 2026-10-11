import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemberStore } from '../store/memberStore';

export default function AddMember() {
  const addMember = useMemberStore(s => s.addMember);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    gender: 'me' as const,
    ageGroup: 'vijana' as const,
    ministry: 'Vijana',
    baptized: false,
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMember(form);
    navigate('/members');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ongeza Mwanachama Mpya</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="md:col-span-2 flex gap-3">
          <button type="submit"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark">
            Hifadhi Mwanachama
          </button>
          <button type="button" onClick={() => navigate('/members')}
            className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300">
            Ghairi
          </button>
        </div>
      </form>
    </div>
  );
}