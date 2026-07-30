import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, User, MapPin, Eye, EyeOff, CircleAlert } from "lucide-react";
import { store } from "../services/store";

type AuthMode = "login" | "register";

const LGA_OPTIONS = [
  { lga: "Abuja Municipal", state: "FCT" },
  { lga: "Ikeja", state: "Lagos" },
  { lga: "Oshimili", state: "Delta" },
  { lga: "Eti-Osa", state: "Lagos" },
  { lga: "Surulere", state: "Lagos" },
  { lga: "Kaduna Central Zone", state: "Kaduna" }
];

const WARD_OPTIONS: Record<string, string[]> = {
  "Abuja Municipal": ["Garki Unit 1", "Garki Unit 2", "Wuse 1", "Wuse 2", "Maitama"],
  "Ikeja": ["Ikeja Central", "Ikeja North", "Ikeja South", "Opebi", "Alausa"],
  "Oshimili": ["Oshimili North", "Oshimili South", "Asaba", "Okpanam", "Ibusa"],
  "Eti-Osa": ["Lekki Phase 1", "Lekki Phase 2", "Victoria Island", "Ikoyi"],
  "Surulere": ["Aguda", "Itire", "Ikate", "Ojuelegba"], 
  "Kaduna Central Zone": ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Kaduna North", "Kaduna South", "Kajuru"],
};

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("chioma@example.com");
  const [loginPassword, setLoginPassword] = useState("password");

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLga, setRegLga] = useState("");
  const [regWard, setRegWard] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = store.login(loginEmail, loginPassword);
     if (result) {
    window.dispatchEvent(new Event("authChanged"));
    navigate("/dashboard");
    } else {
        setError("Invalid email or password. Try: chioma@example.com / password");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!regName || !regEmail || !regPassword || !regLga || !regWard) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const lgaObj = LGA_OPTIONS.find((o) => o.lga === regLga);
      store.register({
      email: regEmail,
      name: regName,
      password: regPassword,
      role: "resident",
      ward: regWard,
      lga: regLga,
      state: lgaObj?.state ?? "",
});
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

 const fillCredentials = (
    email: string,
    password: string
) => {
    setLoginEmail(email);
    setLoginPassword(password);
};

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#FDFBF7] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#0F4C3A] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F4C3A]">
            {mode === "login" ? "Welcome Back" : "Join CommunityConnect"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "login"
              ? "Sign in to track reports and community issues"
              : "Create an account to start reporting"}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === "login" ? "bg-white text-[#0F4C3A] shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === "register" ? "bg-white text-[#0F4C3A] shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2"
          >
            <CircleAlert className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Login Form */}
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#0F4C3A] text-white font-semibold rounded-xl hover:bg-[#0a3a2c] transition-all disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-3">Quick demo access</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials("chioma@example.com", "password")}
                  className="flex-1 py-2 text-xs font-medium bg-[#0F4C3A]/5 text-[#0F4C3A] rounded-lg hover:bg-[#0F4C3A]/10 transition-all">
                  Resident Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials("admin@communityconnect.ng", "password")}
                  className="flex-1 py-2 text-xs font-medium bg-[#D4AF37]/10 text-[#8B6914] rounded-lg hover:bg-[#D4AF37]/20 transition-all">
                  Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials("okutu@communityconnect.ng", "password")}
                  className="flex-1 py-2 text-xs font-medium bg-[#D4AF37]/10 text-[#8B6914] rounded-lg hover:bg-[#D4AF37]/20 transition-all">
                  Super Admin Demo
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all"
                  placeholder="Chioma Nwosu"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all"
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">LGA</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={regLga}
                    onChange={(e) => {setRegLga(e.target.value); setRegWard("");}}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all appearance-none"
                    required>
                    <option value="">Select LGA</option>
                    {LGA_OPTIONS.map((o) => (
                      <option key={o.lga} value={o.lga}>{o.lga}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ward</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={regWard}
                    onChange={(e) => setRegWard(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all appearance-none"
                    disabled={!regLga}
                    required
                  >
                    <option value="">Select Ward</option>
                    {(WARD_OPTIONS[regLga] || []).map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#0F4C3A] text-white font-semibold rounded-xl hover:bg-[#0a3a2c] transition-all disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}