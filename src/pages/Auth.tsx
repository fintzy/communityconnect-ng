import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {  Shield,  Mail,  Lock,  User,  MapPin,  Eye,  EyeOff,  CircleAlert,  CheckCircle,  Sparkles,} from "lucide-react";
import { store } from "../services/store";

type AuthMode = "login" | "register";

/* ============================================================
   LGA OPTIONS
============================================================ */

const LGA_OPTIONS = [
  { lga: "Abuja Municipal", state: "FCT" },
  { lga: "Ikeja", state: "Lagos" },
  { lga: "Oshimili", state: "Delta" },
  { lga: "Eti-Osa", state: "Lagos" },
  { lga: "Surulere", state: "Lagos" },
  { lga: "Kaduna Central Zone", state: "Kaduna" },
  { lga: "Port Harcourt", state: "Rivers" },
  { lga: "Onitsha North", state: "Anambra" },
  { lga: "Ibadan North", state: "Oyo" },
  { lga: "Benin City", state: "Edo" },
  { lga: "Jos North", state: "Plateau" },
  { lga: "Aba North", state: "Abia" },
  { lga: "Calabar Municipal", state: "Cross River" },
  { lga: "Warri South", state: "Delta" },
  { lga: "Zaria", state: "Kaduna" },
  { lga: "Maiduguri", state: "Borno" },
  { lga: "Kano Municipal", state: "Kano" },
  { lga: "Sokoto North", state: "Sokoto" },
];

/* ============================================================
   WARD OPTIONS
============================================================ */

const WARD_OPTIONS: Record<string, string[]> = { 
    "Abuja Municipal": [ "Garki Unit 1", "Garki Unit 2", "Wuse 1", "Wuse 2", "Maitama", ],
    "Ikeja": [ "Alausa", "Opebi", "GRA Ikeja", "Ojodu", "Agidingbi", ],
    "Oshimili": [ "Asaba North", "Asaba South", "Ogbe-Ofu", "Ibusa", ], 
    "Eti-Osa": [ "Lekki Phase 1", "Lekki Phase 2", "Victoria Island", "Ikoyi", ],
    "Surulere": [ "Aguda", "Iponri", "Shitta", "Ojuelegba", ],
    "Kaduna Central Zone": [ "Unguwar Rimi", "Unguwar Sarki", "Unguwar Dosa", ],
    "Port Harcourt": [ "Rumuola", "Rumuokoro", "Elelenwo", "D-Line", ],
    "Onitsha North": [ "Odoakpu", "Fegge", "Umuezike", "Odoakpu", ],
    "Ibadan North": [ "Agodi GRA", "Bodija", "Ring Road", "Sango", ],
    "Benin City": [ "Uselu", "GRA Benin", "Sapele Road", "Oredo", ],
    "Jos North": [ "Rayfield", "Bukuru", "Bukuru GRA", "Jenta", ],
    "Aba North": [ "Eziama", "Umuola", "Ariaria", "Osusu", ],
    "Calabar Municipal": [ "Anantigha", "Ikot Ansa", "Ekorinim", "Big Qua", ],
    "Warri South": [ "Ekpan", "Udu", "Ovwian", "Oghara", ],
    "Zaria": [ "Tudun Wada", "Samaru", "Sabo Gari", "Kofar Kuyanbana", ],
    "Maiduguri": [ "Maiduguri Metropolitan", "Kashim Ibrahim", "Shehuri", "Bulabulin", ],
    "Kano Municipal": [ "Fagge", "Gwale", "Nassarawa", "Dala", ],
    "Sokoto North": [ "Tambuwal", "Wurno", "Gwadabawa", "Binji", ],
};

/* ============================================================
   AUTH COMPONENT
============================================================ */

export default function Auth() {
  const navigate = useNavigate();

  /* ==========================================================
     AUTH MODE
  ========================================================== */

  const [mode, setMode] = useState<AuthMode>("login");

  /* ==========================================================
     UI STATE
  ========================================================== */

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  /* ==========================================================
     LOGIN STATE
  ========================================================== */

  const [loginEmail, setLoginEmail] =
    useState("");

  const [loginPassword, setLoginPassword] =
    useState("");

  /* ==========================================================
     REGISTRATION STATE
  ========================================================== */

  const [regName, setRegName] =
    useState("");

  const [regEmail, setRegEmail] =
    useState("");

  const [regPassword, setRegPassword] =
    useState("");

  const [regLga, setRegLga] =
    useState("");

  const [regWard, setRegWard] =
    useState("");

  /* ==========================================================
     LOGIN
  ========================================================== */

  const handleLogin = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = store.login(
        loginEmail.trim(),
        loginPassword
      );

      if (!result) {
        setError(
          "Invalid email or password."
        );

        return;
      }

      const loggedInUser = result.user;

      window.dispatchEvent(
        new Event("authChanged")
      );

      /*
       * SUPER ADMIN
       */

      if (
        loggedInUser.role ===
        "super-admin"
      ) {
        navigate("/super-admin", {
          replace: true,
        });

        return;
      }

      /*
       * ADMIN / RESIDENT
       */

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Login failed.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     REGISTRATION
  ========================================================== */

  const handleRegister = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    if (
      !regName.trim() ||
      !regEmail.trim() ||
      !regPassword ||
      !regLga ||
      !regWard
    ) {
      setError(
        "Please fill in all registration fields."
      );

      setLoading(false);
      return;
    }

    if (regPassword.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );

      setLoading(false);
      return;
    }

    try {
      const lgaObj =
        LGA_OPTIONS.find(
          (option) =>
            option.lga === regLga
        );

      /*
       * PUBLIC REGISTRATION ALWAYS CREATES
       * A RESIDENT ACCOUNT.
       */

      store.register({
        email: regEmail.trim(),
        name: regName.trim(),
        password: regPassword,
        role: "resident",
        ward: regWard,
        lga: regLga,
        state: lgaObj?.state ?? "",
      });

      window.dispatchEvent(
        new Event("authChanged")
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     DEMO CREDENTIALS
  ========================================================== */

  const fillCredentials = (
    email: string,
    password: string
  ) => {
    setLoginEmail(email);
    setLoginPassword(password);
    setError("");
  };

  /* ==========================================================
     CHANGE MODE
  ========================================================== */

  const changeMode = (
    newMode: AuthMode
  ) => {
    setMode(newMode);
    setError("");
    setShowPassword(false);
  };

  /* ==========================================================
     SHARED INPUT CLASSES
  ========================================================== */

  const inputClasses =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 dark:border-white/10 dark:bg-[#0D2119] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#D4AF37] dark:focus:ring-[#D4AF37]/20";

  const passwordInputClasses =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-11 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 dark:border-white/10 dark:bg-[#0D2119] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#D4AF37] dark:focus:ring-[#D4AF37]/20";

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] w-full overflow-hidden bg-[#FDFBF7] px-4 py-10 transition-colors duration-300 dark:bg-[#071A14] sm:px-6 sm:py-14">

      {/* ======================================================
          BACKGROUND AMBIENT LIGHT
      ====================================================== */}

      <div
        className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-3xl dark:bg-[#D4AF37]/8"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#0F4C3A]/10 blur-3xl dark:bg-[#0F4C3A]/20"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute right-0 top-1/3 h-64 w-64 rounded-full bg-[#D4AF37]/5 blur-3xl dark:bg-[#D4AF37]/5"
        aria-hidden="true"
      />

      {/* ======================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative mx-auto flex w-full max-w-md items-center justify-center">

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
          className="w-full"
        >

          {/* ==================================================
              BRAND HEADER
          ================================================== */}

          <div className="mb-7 text-center">

            {/* Pulsating Light */}
            <div className="relative mx-auto mb-5 h-20 w-20">

              {/* Outer glow */}
              <motion.div
                animate={{
                  opacity: [0.45, 0.9, 0.45],
                  scale: [0.88, 1.08, 0.88],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-[#D4AF37]/30 blur-xl"
              />

              {/* Secondary glow */}
              <motion.div
                animate={{
                  opacity: [0.55, 1, 0.55],
                  scale: [0.92, 1.04, 0.92],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-2 rounded-full bg-[#FFE58A]/30 blur-lg"
              />

              {/* Main brand icon */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 18px rgba(212,175,55,0.30)",
                    "0 0 34px rgba(212,175,55,0.65)",
                    "0 0 18px rgba(212,175,55,0.30)",
                  ],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-2 flex items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#0F4C3A] dark:bg-[#0B2E23]"
              >
                <Shield className="h-8 w-8 text-[#FFE58A]" />
              </motion.div>

              {/* Small spark */}
              <motion.div
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#FFE58A] shadow-[0_0_14px_4px_rgba(212,175,55,0.65)]"
              />

              <Sparkles className="absolute -bottom-1 -left-1 h-4 w-4 text-[#D4AF37]" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#0F4C3A] dark:text-white sm:text-3xl">
              {mode === "login"
                ? "Welcome Back"
                : "Join CommunityConnect"}
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {mode === "login"
                ? "Sign in to track reports and community issues"
                : "Create an account to start reporting issues in your community"}
            </p>
          </div>

          {/* ==================================================
              AUTH CARD
          ================================================== */}

          <div className="rounded-2xl border border-gray-200/80 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,76,58,0.08)] backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#0D2119]/95 dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-6">

            {/* =================================================
                MODE TOGGLE
            ================================================= */}

            <div className="mb-6 flex rounded-xl border border-gray-200 bg-gray-100/80 p-1 dark:border-white/10 dark:bg-black/20">

              <button
                type="button"
                onClick={() =>
                  changeMode("login")
                }
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  mode === "login"
                    ? "bg-white text-[#0F4C3A] shadow-sm dark:bg-[#16362A] dark:text-[#FFE58A]"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() =>
                  changeMode("register")
                }
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  mode === "register"
                    ? "bg-white text-[#0F4C3A] shadow-sm dark:bg-[#16362A] dark:text-[#FFE58A]"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                Register
              </button>
            </div>

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-500/20 dark:bg-red-500/10"
              >
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />

                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </motion.div>
            )}

            {/* =================================================
                LOGIN
            ================================================= */}

            {mode === "login" ? (
              <form
                onSubmit={handleLogin}
                className="space-y-4"
              >

                {/* EMAIL */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) =>
                        setLoginEmail(
                          e.target.value
                        )
                      }
                      className={inputClasses}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={loginPassword}
                      onChange={(e) =>
                        setLoginPassword(
                          e.target.value
                        )
                      }
                      className={
                        passwordInputClasses
                      }
                      placeholder="Enter password"
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#0F4C3A] dark:text-gray-500 dark:hover:text-[#FFE58A]"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl bg-[#0F4C3A] py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#0a3a2c] hover:shadow-lg hover:shadow-[#0F4C3A]/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#10533F] dark:hover:bg-[#126047]"
                >
                  <span className="relative z-10">
                    {loading
                      ? "Signing in..."
                      : "Sign In"}
                  </span>

                  {!loading && (
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  )}
                </button>

                {/* DEMO ACCESS */}

                <div className="pt-3">

                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-100 dark:bg-white/10" />

                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      Demo Access
                    </p>

                    <div className="h-px flex-1 bg-gray-100 dark:bg-white/10" />
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">

                    <button
                      type="button"
                      onClick={() =>
                        fillCredentials(
                          "chioma@example.com",
                          "password"
                        )
                      }
                      className="rounded-lg border border-[#0F4C3A]/10 bg-[#0F4C3A]/5 py-2.5 text-xs font-semibold text-[#0F4C3A] transition-all hover:bg-[#0F4C3A]/10 dark:border-[#0F4C3A]/30 dark:bg-[#0F4C3A]/15 dark:text-[#7DE0BC] dark:hover:bg-[#0F4C3A]/25"
                    >
                      Resident
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        fillCredentials(
                          "admin@communityconnect.ng",
                          "password"
                        )
                      }
                      className="rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/10 py-2.5 text-xs font-semibold text-[#8B6914] transition-all hover:bg-[#D4AF37]/20 dark:border-[#D4AF37]/20 dark:bg-[#D4AF37]/10 dark:text-[#FFE58A] dark:hover:bg-[#D4AF37]/20"
                    >
                      Admin
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        fillCredentials(
                          "okutu@communityconnect.ng",
                          "password"
                        )
                      }
                      className="rounded-lg border border-red-100 bg-red-50 py-2.5 text-xs font-semibold text-red-700 transition-all hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                    >
                      Super Admin
                    </button>

                  </div>
                </div>
              </form>
            ) : (

              /* =================================================
                 REGISTRATION
              ================================================= */

              <form
                onSubmit={handleRegister}
                className="space-y-4"
              >

                {/* FULL NAME */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                    <input
                      type="text"
                      value={regName}
                      onChange={(e) =>
                        setRegName(
                          e.target.value
                        )
                      }
                      className={inputClasses}
                      placeholder="Chioma Nwosu"
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>

                {/* EMAIL */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) =>
                        setRegEmail(
                          e.target.value
                        )
                      }
                      className={inputClasses}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={regPassword}
                      onChange={(e) =>
                        setRegPassword(
                          e.target.value
                        )
                      }
                      className={
                        passwordInputClasses
                      }
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
                      minLength={6}
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#0F4C3A] dark:text-gray-500 dark:hover:text-[#FFE58A]"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                    Use at least 6 characters.
                  </p>
                </div>

                {/* LGA + WARD */}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  {/* LGA */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      LGA
                    </label>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                      <select
                        value={regLga}
                        onChange={(e) => {
                          setRegLga(
                            e.target.value
                          );

                          setRegWard("");
                        }}
                        className={`${inputClasses} appearance-none`}
                        required
                      >
                        <option value="">
                          Select LGA
                        </option>

                        {LGA_OPTIONS.map(
                          (option) => (
                            <option
                              key={option.lga}
                              value={option.lga}
                            >
                              {option.lga}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {/* WARD */}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ward
                    </label>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                      <select
                        value={regWard}
                        onChange={(e) =>
                          setRegWard(
                            e.target.value
                          )
                        }
                        className={`${inputClasses} appearance-none disabled:bg-gray-50 disabled:text-gray-400 dark:disabled:bg-black/20 dark:disabled:text-gray-600`}
                        disabled={!regLga}
                        required
                      >
                        <option value="">
                          Select Ward
                        </option>

                        {(
                          WARD_OPTIONS[
                            regLga
                          ] ?? []
                        ).map(
                          (ward) => (
                            <option
                              key={ward}
                              value={ward}
                            >
                              {ward}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* LOCATION INFORMATION */}

                {regLga && regWard && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -4,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="flex items-start gap-2 rounded-xl border border-[#0F4C3A]/10 bg-[#0F4C3A]/5 p-3 dark:border-[#0F4C3A]/30 dark:bg-[#0F4C3A]/15"
                  >
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0F4C3A] dark:text-[#72DDB7]" />

                    <p className="text-xs leading-relaxed text-[#0F4C3A] dark:text-[#A4EFD4]">
                      Your community location is set to{" "}
                      <strong>
                        {regWard}
                      </strong>
                      ,{" "}
                      <strong>
                        {regLga}
                      </strong>
                      .
                    </p>
                  </motion.div>
                )}

                {/* REGISTER BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl bg-[#0F4C3A] py-3 font-semibold text-white shadow-sm transition-all hover:bg-[#0a3a2c] hover:shadow-lg hover:shadow-[#0F4C3A]/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#10533F] dark:hover:bg-[#126047]"
                >
                  <span className="relative z-10">
                    {loading
                      ? "Creating account..."
                      : "Create Account"}
                  </span>

                  {!loading && (
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  )}
                </button>
              </form>
            )}

            {/* =================================================
                TERMS
            ================================================= */}

            <p className="mt-6 text-center text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
              By continuing, you agree to our{" "}
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Privacy Policy
              </span>
              .
            </p>
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="mt-6 text-center">
            <p className="text-[11px] text-gray-400 dark:text-gray-600">
              CommunityConnect NG
            </p>

            <p className="mt-1 text-[10px] text-gray-400/80 dark:text-gray-600">
              Smart community engagement platform
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}