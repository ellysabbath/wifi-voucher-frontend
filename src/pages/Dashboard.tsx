import { useMemberStore } from '../store/memberStore';
import { useSMSStore } from '../store/smsStore';
import { useEventStore } from '../store/eventStore';
import { useNewsStore } from '../store/newsStore';
import { Users, MessageSquare, Calendar, Newspaper } from 'lucide-react';

export default function Dashboard() {
  const members = useMemberStore(s => s.members);
  const messages = useSMSStore(s => s.messages);
  const events = useEventStore(s => s.events);
  const news = useNewsStore(s => s.news);

  const stats = [
    { label: 'Wanachama', value: members.length, icon: Users, color: 'bg-blue-500' },
    { label: 'SMS Zilizotumwa', value: messages.length, icon: MessageSquare, color: 'bg-green-500' },
    { label: 'Matukio Yajayo', value: events.length, icon: Calendar, color: 'bg-purple-500' },
    { label: 'Habari', value: news.length, icon: Newspaper, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold mb-2">Karibu Bahi SDA Church</h1>
      <p className="text-gray-500 mb-6 lg:mb-8">Mfumo wa usimamizi wa kanisa</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg shadow p-5 lg:p-6">
            <div className={`w-12 h-12 ${s.color} rounded-lg mb-4 flex items-center justify-center text-white`}>
              <s.icon size={24} />
            </div>
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-2xl lg:text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow p-5 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold mb-4">Matukio Yajayo</h2>
          <div className="space-y-3">
            {events.slice(0, 4).map(e => (
              <div key={e.id} className="border-l-4 border-primary pl-3">
                <p className="font-semibold text-sm lg:text-base">{e.title}</p>
                <p className="text-xs lg:text-sm text-gray-500">{e.date} - {e.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold mb-4">Habari za Hivi Karibuni</h2>
          <div className="space-y-3">
            {news.slice(0, 4).map(n => (
              <div key={n.id} className="border-l-4 border-accent pl-3">
                <p className="font-semibold text-sm lg:text-base">{n.title}</p>
                <p className="text-xs lg:text-sm text-gray-500">{n.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}