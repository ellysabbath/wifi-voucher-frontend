import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Lock, Eye, EyeOff, Phone, UserPlus,
  Camera, Upload, X, RefreshCw, CheckCircle2,
} from "lucide-react";
import AuthLayout from "./AuthLayout";
import { authApi } from "../../lib/auth";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState<string>("");
  const [photoMode, setPhotoMode] = useState<"upload" | "webcam" | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [loading, setLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // ===== WEBCAM ===== (same as before)
  const startCamera = async () => {
    setCameraError("");
    setPhotoMode("webcam");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraOn(true);
    } catch {
      setCameraError("Unable to open the camera. Make sure you allow camera access.");
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
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
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setPhoto(dataUrl);
        stopCamera();
        setPhotoMode(null);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
      setPhotoMode(null);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => () => stopCamera(), []);

  // ===== SUBMIT → API =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email || !form.phone || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
        // Send only base64 (strip data URL prefix)
        photo: photo ? photo.replace(/^data:image\/\w+;base64,/, "") : undefined,
      });
      navigate("/verify-account", { state: { email: form.email } });
    } catch (err: any) {
      setError(err?.message ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Set up your church management account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo section — same as before */}
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
                  onClick={() => setPhoto("")}
                  className="absolute -top-1 -right-1 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600"
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

          {!photo && (
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-lg"
              >
                <Upload size={14} /> Upload
              </button>
              <button
                type="button"
                onClick={startCamera}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-lg"
              >
                <Camera size={14} /> Camera
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

        {/* Webcam modal — same as before */}
        {photoMode === "webcam" && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-bold text-gray-800">Take Photo</h3>
                <button
                  type="button"
                  onClick={() => { stopCamera(); setPhotoMode(null); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
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
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 rounded-full border-4 border-white/50 border-dashed" />
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-3 justify-center mt-4">
                  {cameraError ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2"
                    >
                      <RefreshCw size={16} /> Try again
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={!isCameraOn}
                      className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
                    >
                      <Camera size={16} /> Capture
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fields */}
        <div>
          <label className="block text-sm font-semibold mb-1">Full Name</label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Your full name"
              className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Phone Number</label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+255712345678"
              className="w-full border rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
          <label className="block text-sm font-semibold mb-1">Confirm Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
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
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <UserPlus size={18} /> {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}