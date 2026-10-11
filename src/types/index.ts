// ===== WANACHAMA =====
export interface Member {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  gender: 'me' | 'ke';
  ageGroup: 'watoto' | 'vijana' | 'wazee';
  ministry: string;
  role?: string;
  address?: string;
  baptized: boolean;
  joinedAt: string;
  photo?: string;
}

// ===== SMS =====
export interface SMSMessage {
  id: string;
  recipients: string[]; // member IDs
  message: string;
  sentAt: string;
  status: 'pending' | 'sent' | 'failed';
  group?: string;
}

// ===== GALLERY =====
export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  album: string;
  uploadedAt: string;
}

// ===== BOOKS =====
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  fileUrl: string;
  category: string;
  uploadedAt: string;
}

// ===== CHAT =====
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  room: string;
}

// ===== LEADERSHIP =====
export interface Leader {
  id: string;
  name: string;
  position: string;
  photo: string;
  phone: string;
  email?: string;
  bio?: string;
}

// ===== NEWS =====
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  publishedAt: string;
  category: 'tangazo' | 'tukio' | 'habari';
}

// ===== CALENDAR =====
export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'ibada' | 'mkutano' | 'sherehe' | 'kikao';
}

// ===== MINISTRIES =====
export interface Ministry {
  id: string;
  name: string;
  description: string;
  leader: string;
  memberCount: number;
  meetingDay: string;
  icon: string;
}