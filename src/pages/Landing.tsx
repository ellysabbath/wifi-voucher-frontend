// src/pages/Landing.tsx
import { Link } from "react-router-dom";
import {
  Church,
  Users,
  Calendar,
  BookOpen,
  MessageCircle,
  
  Newspaper,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Heart,
  Menu,
  X,
  Quote,
  ChevronDown,
  Music,
  Baby,
  GraduationCap,
  HandHeart,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";

import { eventApi, type ChurchEvent } from "../lib/eventApi";
import { newsApi, type NewsItem } from "../lib/newsApi";
import { ministriesApi, type Ministry } from "../lib/ministriesApi";

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [ministries, setMinistries] = useState<Ministry[]>([]);

  useEffect(() => {
    Promise.all([
      eventApi.list({ page: 1, page_size: 3 }),
      newsApi.list({ page: 1, page_size: 3, published: true }),
      ministriesApi.list({ page: 1, page_size: 6, active: true }),
    ])
      .then(([e, n, m]) => {
        setEvents(e.results ?? []);
        setNews(n.results ?? []);
        setMinistries(m.results ?? []);
      })
      .catch(() => {
        // Silent — landing page tolerates missing data
      });
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "For Who", href: "#for-who" },
    { label: "Ministries", href: "#ministries" },
    { label: "Events", href: "#events" },
    { label: "News", href: "#news" },
    { label: "FAQ", href: "#faq" },
  ];

  const audiences = [
    {
      icon: Users,
      title: "Members",
      description:
        "Join our spiritual family. Share in worship, ministry, and spiritual growth.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: HandHeart,
      title: "Visitors",
      description:
        "Welcome home. Never been here? Your first step is here. We are ready to receive you.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: GraduationCap,
      title: "Youth",
      description:
        "A place to grow spiritually, socially, and academically. Join your fellow youth.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Baby,
      title: "Children",
      description:
        "Sabbath School and children's activities that nurture God's love from an early age.",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: Music,
      title: "Music Lovers",
      description:
        "Join our choir and use your musical talent for God's glory.",
      color: "from-orange-500 to-amber-600",
    },
    {
      icon: Sparkles,
      title: "Community",
      description:
        "Even if you are not a member, you can take part in our community activities.",
      color: "from-teal-500 to-cyan-600",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Love",
      description: "We love God and all people without discrimination.",
    },
    {
      icon: BookOpen,
      title: "Word of God",
      description: "The Bible is the foundation of our faith and life.",
    },
    {
      icon: Users,
      title: "Unity",
      description: "We are together as one spiritual family.",
    },
    {
      icon: HandHeart,
      title: "Service",
      description: "We serve the community and others with the love of Christ.",
    },
  ];

  const testimonials = [
    {
      name: "Martha Nyerere",
      role: "Member for 10 years",
      text: "This church has become my home. I have learned so much and found a spiritual family.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Daudi Komba",
      role: "Youth Leader",
      text: "Young people get a great opportunity to grow spiritually and socially. I am grateful to be part of this church.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Esther Mwansasu",
      role: "Choir Member",
      text: "Our choir has helped me use my musical talent for God. Thank you so much.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const faqs = [
    {
      question: "When do you hold services?",
      answer:
        "We hold services every Saturday from 9:00 AM to 12:00 PM. We also have a prayer meeting every Wednesday evening.",
    },
    {
      question: "Can I come even if I am not Adventist?",
      answer:
        "Yes! You are very welcome. Our church is open to everyone — members, visitors, and guests. There is no discrimination.",
    },
    {
      question: "What services do you offer for children?",
      answer:
        "We have Sabbath School for children of all ages, along with social and educational activities that nurture Christian values.",
    },
    {
      question: "How can I join a ministry?",
      answer:
        "You can talk to any church leader, or register on our system and choose the ministry you want.",
    },
    {
      question: "Do you help the community?",
      answer:
        "Yes. We carry out various community activities including helping those in need, evangelism, and development projects.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white shadow-lg">
                <Church size={20} />
              </div>
              <div>
                <h1 className="font-bold text-primary text-lg leading-none">
                  Bahi SDA
                </h1>
                <p className="text-xs text-gray-500">Welcome Home</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-primary transition"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-700 hover:text-primary px-4 py-2 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition shadow-lg shadow-primary/20"
              >
                Join Us
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t flex gap-2">
              <Link
                to="/login"
                className="flex-1 text-center py-2.5 text-sm font-semibold border rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center py-2.5 text-sm font-semibold bg-primary text-white rounded-lg"
              >
                Join Us
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section
        id="home"
        className="relative pt-32 lg:pt-40 pb-20 lg:pb-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Sparkles size={14} />
                Welcome to our spiritual family
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Welcome{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  home
                </span>
                , a place of love and hope
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Bahi SDA Church is a spiritual family open to everyone —
                members, visitors, youth, elders, and the whole community. Come
                and find love, hope, and meaning in life.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  to="/register"
                  className="bg-primary text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-primary-dark transition shadow-lg shadow-primary/30 flex items-center gap-2"
                >
                  Join Us <ArrowRight size={18} />
                </Link>
                <a
                  href="#about"
                  className="bg-white text-gray-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition border border-gray-200 flex items-center gap-2"
                >
                  Learn More
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[
                      "photo-1544005313-94ddf0286df2",
                      "photo-1507003211169-0a1dd7228f2d",
                      "photo-1494790108377-be9c29b29330",
                      "photo-1500648767791-00dcc994a43e",
                    ].map((id, i) => (
                      <img
                        key={i}
                        src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop&crop=face`}
                        alt=""
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      One family
                    </p>
                    <p className="text-xs text-gray-500">Of love</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} className="fill-yellow-400" />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Welcome</p>
                    <p className="text-xs text-gray-500">Everyone</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=600&fit=crop"
                  alt="Church interior"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <Quote size={32} className="mb-2 opacity-80" />
                  <p className="text-lg font-medium italic">
                    "Come to me, all you who are weary and burdened, and I will
                    give you rest."
                  </p>
                  <p className="text-sm text-white/80 mt-2">— Matthew 11:28</p>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2 border">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Heart size={16} className="fill-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Love</p>
                  <p className="text-xs text-gray-500">For all</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2 border">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Users size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Family</p>
                  <p className="text-xs text-gray-500">One</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VERSE OF THE DAY ===== */}
      <section className="py-12 lg:py-16 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center text-white">
          <BookOpen size={32} className="mx-auto mb-4 opacity-80" />
          <p className="text-xl lg:text-2xl font-medium italic mb-3">
            "For God so loved the world that he gave his one and only Son, that
            whoever believes in him shall not perish but have eternal life."
          </p>
          <p className="text-blue-100 text-sm">— John 3:16</p>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Church size={14} />
                About Us
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Who are we?
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Bahi SDA Church is a Seventh-day Adventist church located in
                Bahi, Tanzania. We are a family of believers who love God and
                all people.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We believe in Jesus Christ as our Savior, and the Bible as the
                Word of God. We strive to live a life of love, service, and
                hope — for our members and for the whole community.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {values.map((v, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <v.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">
                        {v.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {v.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600&h=700&fit=crop"
                alt="Church building"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border max-w-xs hidden lg:block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Heart size={24} className="fill-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">Welcome</p>
                    <p className="text-xs text-gray-500">Everyone</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Even if you have never been to church, you can start your
                  spiritual journey here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOR WHO ===== */}
      <section id="for-who" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Users size={14} />
              For Who
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our church is for everyone
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Whether you are a member, a visitor, a youth, an elder, or a
              community member — you have a place here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiences.map((a, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <a.icon size={26} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {a.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Quote size={14} />
              Testimonials
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              What do they say?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Words from our members about our church.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 lg:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Quote size={28} className="text-primary/30 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MINISTRIES ===== */}
      <section id="ministries" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Church size={14} />
              Ministries
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our ministries
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every member has a chance to take part in the various ministries
              of the church.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ministries.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-5 text-center border border-gray-100 animate-pulse"
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gray-200 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2 mx-auto"></div>
                  </div>
                ))
              : ministries.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl p-5 text-center border border-gray-100 hover:shadow-lg hover:border-primary transition"
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                      <Church size={22} />
                    </div>
                    <h3 className="font-bold text-sm text-gray-800 mb-1 truncate">
                      {m.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {m.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ===== EVENTS ===== */}
      <section id="events" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Calendar size={14} />
                Events
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
                Welcome to our events
              </h2>
            </div>
            <Link
              to="/events"
              className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all"
            >
              See all <ArrowRight size={18} />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-500">
              No events scheduled yet. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-40 bg-gradient-to-br from-primary to-blue-700 relative">
                    <div className="absolute top-4 left-4 bg-white rounded-xl px-3 py-2 text-center shadow-lg">
                      <p className="text-xs font-semibold text-primary uppercase">
                        {format(parseISO(e.event_date), "MMM")}
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {format(parseISO(e.event_date), "dd")}
                      </p>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-white/20 backdrop-blur text-white text-xs px-3 py-1 rounded-full font-semibold capitalize">
                        {e.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-primary transition">
                      {e.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {e.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {e.event_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {e.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== NEWS ===== */}
      <section id="news" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Newspaper size={14} />
                News
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
                Latest news
              </h2>
            </div>
            <Link
              to="/news"
              className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all"
            >
              See all <ArrowRight size={18} />
            </Link>
          </div>

          {news.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
              No news yet. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((n) => (
                <div
                  key={n.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                        n.category === "announcement"
                          ? "bg-blue-100 text-blue-700"
                          : n.category === "event"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {n.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                    {n.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {n.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
                    <span>{n.author_email || "Bahi SDA"}</span>
                    <span>{new Date(n.created_at).toLocaleDateString("en-US")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20 lg:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <MessageCircle size={14} />
              FAQ
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-gray-600">
              Have a question? Here are answers to common questions.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-100 transition"
                >
                  <span className="font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-500 flex-shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-700 to-indigo-800 p-8 lg:p-16 text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full -ml-40 -mb-40"></div>

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-6">
                <Heart size={32} className="fill-white" />
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-4">
                Welcome home
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Even if you have never been to church, you can start your
                spiritual journey here. Come and find love, hope, and family.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg flex items-center gap-2"
                >
                  Join Us <ArrowRight size={18} />
                </Link>
                <a
                  href="#contact"
                  className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30 transition border border-white/30"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Phone size={14} />
              Contact
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Let us talk
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have a question, need help, or want to visit? Contact us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: "Location",
                value: "Bahi, Tanzania",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Phone,
                title: "Phone",
                value: "+255 712 345 678",
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: Mail,
                title: "Email",
                value: "info@bahisda.org",
                color: "from-purple-500 to-purple-600",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 text-center border border-gray-100 hover:shadow-xl transition"
              >
                <div
                  className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white mb-4 shadow-lg`}
                >
                  <c.icon size={26} />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{c.title}</h3>
                <p className="text-gray-600 text-sm">{c.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-secondary text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Church size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Bahi SDA</h3>
                  <p className="text-xs text-gray-400">Welcome Home</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                A spiritual family open to everyone. Come and find love, hope,
                and meaning in life.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#about" className="hover:text-primary transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#for-who" className="hover:text-primary transition">
                    For Who
                  </a>
                </li>
                <li>
                  <a
                    href="#ministries"
                    className="hover:text-primary transition"
                  >
                    Ministries
                  </a>
                </li>
                <li>
                  <a href="#events" className="hover:text-primary transition">
                    Events
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-primary transition">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Spiritual</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/login" className="hover:text-primary transition">
                    Books
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary transition">
                    News
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary transition">
                    Calendar
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary transition">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary transition">
                    Chat
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <MapPin size={14} /> Bahi, Tanzania
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} /> +255 712 345 678
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={14} /> info@bahisda.org
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-700 flex flex-col lg:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2026 Bahi SDA Church. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-primary transition">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition">
                Terms
              </a>
              <a href="#" className="hover:text-primary transition">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}