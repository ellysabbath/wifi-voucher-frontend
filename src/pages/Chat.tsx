import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { Send, Plus, Trash2, Hash } from 'lucide-react';
import Modal from '../components/Modal';

export default function Chat() {
  const messages = useChatStore(s => s.messages);
  const rooms = useChatStore(s => s.rooms);
  const addRoom = useChatStore(s => s.addRoom);
  const deleteRoom = useChatStore(s => s.deleteRoom);
  const sendMessage = useChatStore(s => s.sendMessage);
  const [text, setText] = useState('');
  const [room, setRoom] = useState('general');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const filtered = messages.filter(m => m.room === room);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filtered]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage('current-user', 'Mimi', text, room);
    setText('');
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    addRoom(roomName);
    setRoom(roomName.toLowerCase().replace(/\s+/g, '-'));
    setRoomName('');
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setRoomName('');
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mazungumzo</h1>
        <button onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> Unda Room Mpya
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Unda Room Mpya">
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Jina la Room *</label>
            <input required value={roomName}
              onChange={e => setRoomName(e.target.value)}
              placeholder="Mfano: Kwaya, Uinjilisti..."
              className="w-full border rounded-lg px-3 py-2" />
            <p className="text-xs text-gray-500 mt-1">
              Room itaonekana kama: #{roomName.toLowerCase().replace(/\s+/g, '-') || 'jina-la-room'}
            </p>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button type="button" onClick={handleCloseModal}
              className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300">
              Ghairi
            </button>
            <button type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark">
              Unda
            </button>
          </div>
        </form>
      </Modal>

      <div className="flex gap-2 mb-4 flex-wrap">
        {rooms.map(r => (
          <div key={r} className="relative group">
            <button onClick={() => setRoom(r)}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-1 ${room === r ? 'bg-primary text-white' : 'bg-white'}`}>
              <Hash size={14} /> {r}
            </button>
            {r !== 'general' && (
              <button onClick={() => deleteRoom(r)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                <Trash2 size={10} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow flex flex-col h-[600px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 mt-8">Hakuna ujumbe bado. Anza mazungumzo!</p>
          ) : (
            filtered.map(m => (
              <div key={m.id} className={`flex ${m.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg p-3 ${m.senderId === 'current-user' ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                  <p className="text-xs font-semibold mb-1">{m.senderName}</p>
                  <p>{m.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`Andika ujumbe kwenye #${room}...`}
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button type="submit" className="bg-primary text-white px-4 rounded-lg">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}