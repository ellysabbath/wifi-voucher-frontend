import { useState } from 'react';
import { useMemberStore } from '../store/memberStore';
import { useSMSStore } from '../store/smsStore';
import { Send, Users, User, Plus, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

export default function BulkSMS() {
  const members = useMemberStore(s => s.members);
  const sendSMS = useSMSStore(s => s.sendSMS);
  const messages = useSMSStore(s => s.messages);
  const groups = useSMSStore(s => s.groups);
  const addGroup = useSMSStore(s => s.addGroup);
  const deleteGroup = useSMSStore(s => s.deleteGroup);

  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'all' | 'group' | 'select'>('all');
  const [group, setGroup] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [success, setSuccess] = useState('');

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupMembers, setNewGroupMembers] = useState<string[]>([]);

  const ministries = [...new Set(members.map(m => m.ministry))];

  const getRecipients = () => {
    if (mode === 'all') return members.map(m => m.id);
    if (mode === 'group') {
      if (groups[group]) return groups[group];
      return members.filter(m => m.ministry === group).map(m => m.id);
    }
    return selected;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const recipients = getRecipients();
    if (recipients.length === 0) return alert('Chagua wapokeaji');
    sendSMS(recipients, message, mode === 'group' ? group : mode === 'all' ? 'Wote' : 'Wateule');
    setSuccess(`SMS imetumwa kwa wanachama ${recipients.length}!`);
    setMessage('');
    setSelected([]);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || newGroupMembers.length === 0) return;
    addGroup(newGroupName, newGroupMembers);
    setNewGroupName('');
    setNewGroupMembers([]);
    setIsGroupModalOpen(false);
  };

  const handleCloseGroupModal = () => {
    setNewGroupName('');
    setNewGroupMembers([]);
    setIsGroupModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tuma SMS</h1>
        <button onClick={() => setIsGroupModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Unda Group
        </button>
      </div>

      <Modal isOpen={isGroupModalOpen} onClose={handleCloseGroupModal} title="Unda Group Mpya">
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Jina la Group *</label>
            <input required value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Mfano: Viongozi, Kwaya..."
              className="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Chagua Wanachama ({newGroupMembers.length} wamechaguliwa) *
            </label>
            <div className="max-h-60 overflow-y-auto border rounded-lg p-2">
              {members.map(m => (
                <label key={m.id} className="flex items-center gap-2 p-2 hover:bg-gray-50">
                  <input type="checkbox"
                    checked={newGroupMembers.includes(m.id)}
                    onChange={e => setNewGroupMembers(prev =>
                      e.target.checked ? [...prev, m.id] : prev.filter(i => i !== m.id)
                    )} />
                  <span>{m.fullName} - {m.phone}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button type="button" onClick={handleCloseGroupModal}
              className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300">
              Ghairi
            </button>
            <button type="submit"
              disabled={!newGroupName.trim() || newGroupMembers.length === 0}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50">
              Unda Group
            </button>
          </div>
        </form>
      </Modal>

      <form onSubmit={handleSend} className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Wapokeaji</label>
          <div className="flex gap-2 mb-3 flex-wrap">
            <button type="button" onClick={() => setMode('all')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${mode === 'all' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              <Users size={16} /> Wote
            </button>
            <button type="button" onClick={() => setMode('group')}
              className={`px-4 py-2 rounded-lg ${mode === 'group' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              Kwa Group
            </button>
            <button type="button" onClick={() => setMode('select')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${mode === 'select' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              <User size={16} /> Chagua
            </button>
          </div>

          {mode === 'group' && (
            <div className="space-y-2">
              <select value={group} onChange={e => setGroup(e.target.value)}
                className="w-full border rounded-lg px-3 py-2">
                <option value="">-- Chagua Group --</option>
                <optgroup label="Groups Zilizoundwa">
                  {Object.keys(groups).map(g => (
                    <option key={g} value={g}>{g} ({groups[g].length})</option>
                  ))}
                </optgroup>
                <optgroup label="Huduma">
                  {ministries.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </optgroup>
              </select>

              {groups[group] && (
                <button type="button" onClick={() => deleteGroup(group)}
                  className="text-red-500 text-sm flex items-center gap-1">
                  <Trash2 size={14} /> Futa group hii
                </button>
              )}
            </div>
          )}

          {mode === 'select' && (
            <div className="max-h-60 overflow-y-auto border rounded-lg p-2">
              {members.map(m => (
                <label key={m.id} className="flex items-center gap-2 p-2 hover:bg-gray-50">
                  <input type="checkbox" checked={selected.includes(m.id)}
                    onChange={e => setSelected(prev =>
                      e.target.checked ? [...prev, m.id] : prev.filter(i => i !== m.id)
                    )} />
                  <span>{m.fullName} - {m.phone}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Ujumbe</label>
          <textarea required value={message}
            onChange={e => setMessage(e.target.value)} rows={4}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Andika ujumbe wako hapa..." />
          <p className="text-sm text-gray-500 mt-1">{message.length} herufi</p>
        </div>

        <button type="submit"
          className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary-dark">
          <Send size={18} /> Tuma SMS
        </button>

        {success && <p className="mt-4 text-green-600 font-semibold">{success}</p>}
      </form>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Historia ya SMS</h2>
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m.id} className="border-l-4 border-primary pl-3 py-2">
              <p className="text-sm text-gray-500">
                {new Date(m.sentAt).toLocaleString()} - Kwa: {m.group || `${m.recipients.length} wateule`}
              </p>
              <p>{m.message}</p>
              <span className="text-xs text-green-600">{m.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}