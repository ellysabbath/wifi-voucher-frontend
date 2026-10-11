import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Eye, EyeOff, Phone, UserPlus,
  Camera, Upload, X, RefreshCw, CheckCircle2
} from 'lucide-react';
import AuthLayout from './AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState<string>('');
  const [photoMode, setPhotoMode] = useState<'upload' | 'webcam' | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  // ===== WEBCAM =====
  const startCamera = async () => {
    setCameraError('');
    setPhotoMode('webcam');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraOn(true);
    } catch (err) {
      setCameraError('Imeshindwa kufungua kamera. Hakikisha umeruhusu kutumia kamera.');
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOn(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setPhoto(dataUrl);
        stopCamera();
        setPhotoMode(null);
      }
    }
  };

  const retakePhoto = () => {
    setPhoto('');
    startCamera();
  };

  // ===== UPLOAD =====
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Tafadhali chagua faili la picha');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Picha isizidi 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
      setPhotoMode(null);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  // ===== CLEANUP =====
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // ===== SUBMIT =====
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.email || !form.phone || !form.password) {
      setError('Jaza sehemu zote');
      return;
    }
    if (form.password.length < 6) {
      setError('Nenosiri liwe na herufi 6 au zaidi');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Nenosiri hazifanani');
      return;
    }

    // Hapa unaweza kutuma `photo` (base64) kwenye API yako
    console.log('Photo:', photo);

    navigate('/verify-account', { state: { email: form.email } });
  };

  return (
    <AuthLayout title="Jisajili" subtitle="Unda akaunti yako ya mfumo wa kanisa">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ===== PHOTO SECTION ===== */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {photo ? (
              <div className="relative">
                <img
                  src={photo}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setPhoto('')}
                  className="absolute -top-1 -right-1 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition"
                  aria-label="Ondoa picha"
                >
                  <X size={14} />
                </button>
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                  <CheckCircle2 size={14} />
                </div>
              </div>
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                <User size={40} />
              </div>
            )}
          </div>

          {/* Buttons za kupakia/kuchukua picha */}
          {!photo && (
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-lg transition"
              >
                <Upload size={14} /> Pakia Picha
              </button>
              <button
                type="button"
                onClick={startCamera}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-lg transition"
              >
                <Camera size={14} /> Chukua Picha
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* ===== WEBCAM MODAL ===== */}
        {photoMode === 'webcam' && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-bold text-gray-800">Chukua Picha</h3>
                <button
                  type="button"
                  onClick={() => { stopCamera(); setPhotoMode(null); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4">
                {cameraError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4 text-center">
                    {cameraError}
                  </div>
                ) : (
                  <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Guide circle */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 rounded-full border-4 border-white/50 border-dashed"></div>
                    </div>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />

                <div className="flex gap-3 justify-center mt-4">
                  {cameraError ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center gap-2"
                    >
                      <RefreshCw size={16} /> Jaribu Tena
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={!isCameraOn}
                      className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center gap-2 disabled:opacity-50"
                    >
                      <Camera size={16} /> Chukua Picha
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== FORM FIELDS ===== */}
        <div>
          <label className="block text-sm font-semibold mb-1">Jina Kamili</label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              placeholder="Jina lako kamili"
              className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Barua Pepe</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="jina@bahisda.org"
              className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Namba ya Simu</label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+255712345678"
              className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Nenosiri</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full border rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Rudia Nenosiri</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2"
        >
          <UserPlus size={18} /> Jisajili
        </button>

        <p className="text-center text-sm text-gray-600">
          Una akaunti tayari?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Ingia
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}