import type {
  Member, GalleryItem, Book, ChatMessage,
  Leader, NewsItem, ChurchEvent, Ministry, SMSMessage
} from '../types';

export const initialMembers: Member[] = [
  { id: '1', fullName: 'Yohana Mwakyusa', phone: '+255712345678', gender: 'me', ageGroup: 'wazee', ministry: 'Uongozi', role: 'Mchungaji', baptized: true, joinedAt: '2010-05-15', address: 'Bahi' },
  { id: '2', fullName: 'Martha Nyerere', phone: '+255713456789', gender: 'ke', ageGroup: 'wazee', ministry: 'Wanawake', baptized: true, joinedAt: '2012-08-20', address: 'Bahi' },
  { id: '3', fullName: 'Daudi Komba', phone: '+255714567890', gender: 'me', ageGroup: 'vijana', ministry: 'Vijana', baptized: true, joinedAt: '2018-01-10', address: 'Bahi' },
  { id: '4', fullName: 'Esther Mwansasu', phone: '+255715678901', gender: 'ke', ageGroup: 'vijana', ministry: 'Kwaya', baptized: false, joinedAt: '2020-03-05', address: 'Bahi' },
  { id: '5', fullName: 'Petro Mwakyusa', phone: '+255716789012', gender: 'me', ageGroup: 'wazee', ministry: 'Wazee', role: 'Mzee wa Kanisa', baptized: true, joinedAt: '2008-11-12', address: 'Bahi' },
];

export const initialGallery: GalleryItem[] = [
  { id: '1', title: 'Ibada ya Jumamosi', imageUrl: 'https://picsum.photos/400/300?random=1', album: 'Ibada', uploadedAt: '2026-01-15' },
  { id: '2', title: 'Kambi ya Vijana', imageUrl: 'https://picsum.photos/400/300?random=2', album: 'Vijana', uploadedAt: '2026-02-20' },
  { id: '3', title: 'Sherehe ya Krismasi', imageUrl: 'https://picsum.photos/400/300?random=3', album: 'Sherehe', uploadedAt: '2025-12-25' },
  { id: '4', title: 'Kwaya ya Kanisa', imageUrl: 'https://picsum.photos/400/300?random=4', album: 'Kwaya', uploadedAt: '2026-03-10' },
];

export const initialBooks: Book[] = [
  { id: '1', title: 'Steps to Christ', author: 'Ellen G. White', description: 'Kitabu cha msingi kwa kila Mkristo', coverUrl: 'https://picsum.photos/200/300?random=10', fileUrl: '#', category: 'Imani', uploadedAt: '2026-01-01' },
  { id: '2', title: 'The Great Controversy', author: 'Ellen G. White', description: 'Historia ya vita kuu kati ya wema na uovu', coverUrl: 'https://picsum.photos/200/300?random=11', fileUrl: '#', category: 'Unabii', uploadedAt: '2026-01-05' },
  { id: '3', title: 'Biblia Takatifu', author: 'Mungu', description: 'Neno la Mungu', coverUrl: 'https://picsum.photos/200/300?random=12', fileUrl: '#', category: 'Biblia', uploadedAt: '2026-01-10' },
];

export const initialMessages: ChatMessage[] = [
  { id: '1', senderId: '2', senderName: 'Martha Nyerere', message: 'Habari za leo wote!', timestamp: new Date().toISOString(), room: 'general' },
  { id: '2', senderId: '3', senderName: 'Daudi Komba', message: 'Salama mama, Mungu mwema', timestamp: new Date().toISOString(), room: 'general' },
];

export const initialLeaders: Leader[] = [
  { id: '1', name: 'Yohana Mwakyusa', position: 'Mchungaji', photo: 'https://i.pravatar.cc/150?u=1', phone: '+255712345678', email: 'yohana@bahisda.org' },
  { id: '2', name: 'Petro Mwakyusa', position: 'Mzee wa Kanisa', photo: 'https://i.pravatar.cc/150?u=2', phone: '+255716789012' },
  { id: '3', name: 'Martha Nyerere', position: 'Mkurugenzi wa Wanawake', photo: 'https://i.pravatar.cc/150?u=3', phone: '+255713456789' },
  { id: '4', name: 'Daudi Komba', position: 'Kiongozi wa Vijana', photo: 'https://i.pravatar.cc/150?u=4', phone: '+255714567890' },
];

export const initialNews: NewsItem[] = [
  { id: '1', title: 'Kambi ya Vijana 2026', content: 'Kambi ya vijana itafanyika tarehe 15-20 Julai 2026 katika kanisa letu. Karibuni wote.', author: 'Daudi Komba', publishedAt: '2026-06-01', category: 'tukio' },
  { id: '2', title: 'Mkutano wa Wanawake', content: 'Wanawake wote wa kanisa wanakaribishwa kwenye mkutano wa maombi Jumamosi ijayo.', author: 'Martha Nyerere', publishedAt: '2026-09-15', category: 'tangazo' },
  { id: '3', title: 'Ubatizo Mpya', content: 'Wanachama 5 wamebatizwa Jumamosi iliyopita. Mungu awabariki.', author: 'Yohana Mwakyusa', publishedAt: '2026-09-20', category: 'habari' },
];

export const initialEvents: ChurchEvent[] = [
  { id: '1', title: 'Ibada ya Jumamosi', description: 'Ibada kuu ya wiki', date: '2026-10-10', time: '09:00', location: 'Kanisa Kuu', category: 'ibada' },
  { id: '2', title: 'Mkutano wa Maombi', description: 'Maombi ya jioni', date: '2026-10-14', time: '18:00', location: 'Kanisa Kuu', category: 'mkutano' },
  { id: '3', title: 'Kikao cha Uongozi', description: 'Kikao cha viongozi wote', date: '2026-10-18', time: '16:00', location: 'Ofisi ya Kanisa', category: 'kikao' },
  { id: '4', title: 'Sherehe ya Shukrani', description: 'Sherehe ya mwaka', date: '2026-11-05', time: '10:00', location: 'Kanisa Kuu', category: 'sherehe' },
];

export const initialMinistries: Ministry[] = [
  { id: '1', name: 'Kwaya', description: 'Uimbaji wa nyimbo za Mungu', leader: 'Esther Mwansasu', memberCount: 25, meetingDay: 'Jumanne', icon: '🎵' },
  { id: '2', name: 'Vijana', description: 'Umoja wa vijana wa kanisa', leader: 'Daudi Komba', memberCount: 40, meetingDay: 'Jumamosi', icon: '🔥' },
  { id: '3', name: 'Wanawake', description: 'Umoja wa wanawake', leader: 'Martha Nyerere', memberCount: 35, meetingDay: 'Alhamisi', icon: '💐' },
  { id: '4', name: 'Wazee', description: 'Umoja wa wazee', leader: 'Petro Mwakyusa', memberCount: 20, meetingDay: 'Jumatano', icon: '🕊️' },
  { id: '5', name: 'Usabato', description: 'Shule ya Sabato', leader: 'Yohana Mwakyusa', memberCount: 50, meetingDay: 'Jumamosi', icon: '📖' },
  { id: '6', name: 'Uinjilisti', description: 'Kazi ya uinjilisti', leader: 'Daudi Komba', memberCount: 15, meetingDay: 'Jumapili', icon: '✝️' },
];

export const initialSMS: SMSMessage[] = [
  { id: '1', recipients: ['1', '2', '3'], message: 'Habari wanachama, ibada ya Jumamosi itaanza saa 3 asubuhi.', sentAt: '2026-09-25T10:00:00Z', status: 'sent', group: 'Wote' },
];