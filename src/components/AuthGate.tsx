import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import type { UserAccount } from '@/src/types/academic';

interface AuthGateProps {
  accounts: UserAccount[];
  onLoginSuccess: (account: UserAccount, remember: boolean) => void;
  onRegisterAccount: (newAccount: UserAccount, remember: boolean) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  accounts,
  onLoginSuccess,
  onRegisterAccount,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regNim, setRegNim] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regProgram, setRegProgram] = useState('Pendidikan Fisika & Teknik Komputasi');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [regShowPassword, setRegShowPassword] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const query = identifier.trim().toLowerCase();
    if (!query || !password) {
      setErrorMsg('Silakan masukkan Username ID / NIM dan kata sandi terlebih dahulu.');
      return;
    }

    const matched = accounts.find((acc) => {
      const combined = `${acc.nim}/${acc.name}`.toLowerCase();
      return (
        acc.nim.toLowerCase() === query ||
        acc.email.toLowerCase() === query ||
        acc.name.toLowerCase() === query ||
        combined === query
      );
    });

    if (!matched || matched.password !== password) {
      setErrorMsg(
        'Username ID atau kata sandi tidak cocok. Periksa kembali akun dan kata sandi Anda.'
      );
      return;
    }

    onLoginSuccess(matched, rememberSession);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = regName.trim();
    const cleanNim = regNim.trim();
    const cleanEmail = regEmail.trim();

    if (!cleanName || !cleanNim || !cleanEmail || !regPassword) {
      setErrorMsg('Lengkapi seluruh data akun mahasiswa terlebih dahulu.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMsg('Format email akademik tidak valid (contoh: nama@student.unsri.ac.id).');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Kata sandi minimal 6 karakter.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak sama.');
      return;
    }

    const exists = accounts.some(
      (acc) =>
        acc.nim.toLowerCase() === cleanNim.toLowerCase() ||
        acc.email.toLowerCase() === cleanEmail.toLowerCase()
    );

    if (exists) {
      setErrorMsg('NIM atau email tersebut sudah terdaftar. Silakan masuk melalui tab Masuk Akun.');
      return;
    }

    const created: UserAccount = {
      id: `user-${Date.now()}`,
      name: cleanName,
      nim: cleanNim,
      email: cleanEmail,
      password: regPassword,
      program: regProgram.trim() || 'Fisika Dasar',
      semester: 'Semester 3',
    };

    onRegisterAccount(created, rememberSession);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top minimal portal bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 36 36" className="w-8 h-8 shrink-0" aria-hidden="true">
            <rect width="36" height="36" rx="9" fill="#2563EB" />
            <circle cx="13" cy="18" r="5" fill="#FFFFFF" />
            <circle cx="24" cy="18" r="5" fill="#93C5FD" />
            <path
              d="M17.5 11.5L19.5 18L17.5 24.5"
              stroke="#FDE68A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="font-display text-lg font-bold tracking-tight text-slate-900">
            SIVEMA EdLink
          </span>
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Portal Pembelajaran Akademik Mahasiswa
        </span>
      </header>

      {/* Main Centered Split Auth Workspace */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Left Academic Overview Panel */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-7 sm:p-8 flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-300">
                <BookOpen className="w-4 h-4" />
                <span>Mekanika Klasik · Modul Tumbukan</span>
              </div>
              <h1 className="text-2xl font-display font-bold leading-snug text-balance">
                Masuk ke Ruang Belajar Akademik SIVEMA EdLink
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Akses materi tumbukan interaktif, simulasi animasi fisika, tugas dengan navigasi soal bebas, grafik perkembangan nilai, dan umpan balik dosen.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
              Gunakan Username ID atau NIM mahasiswa terdaftar bersama kata sandi akun Anda untuk mengakses perkuliahan.
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Daftar Akun Baru
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Autentikasi Mahasiswa
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Masukkan Username ID (NIM / Nama) serta kata sandi akun Anda.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="login-identifier"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Username ID (NIM / Nama)
                  </label>
                  <input
                    id="login-identifier"
                    type="text"
                    autoComplete="username"
                    placeholder="Masukkan NIM atau Nama akun"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Kata Sandi (Password)
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="rounded border-slate-300 accent-blue-600"
                  />
                  <span>Simpan sesi masuk di perangkat ini</span>
                </label>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Masuk ke SIVEMA EdLink
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Buat Akun Mahasiswa Baru
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Progres belajar, nilai tugas, dan catatan refleksi akan tersimpan untuk akun Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      placeholder="Nama lengkap mahasiswa"
                      value={regName}
                      onChange={(e) => {
                        setRegName(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      NIM / Username ID
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan NIM"
                      value={regNim}
                      onChange={(e) => {
                        setRegNim(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Email Akademik
                    </label>
                    <input
                      type="email"
                      placeholder="nama@student.unsri.ac.id"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Program Studi
                    </label>
                    <input
                      type="text"
                      value={regProgram}
                      onChange={(e) => setRegProgram(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Kata Sandi (Min. 6 karakter)
                    </label>
                    <div className="relative">
                      <input
                        type={regShowPassword ? 'text' : 'password'}
                        placeholder="Buat kata sandi"
                        value={regPassword}
                        onChange={(e) => {
                          setRegPassword(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-blue-600 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setRegShowPassword((s) => !s)}
                        aria-label={regShowPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-700"
                      >
                        {regShowPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Ulangi Kata Sandi
                    </label>
                    <div className="relative">
                      <input
                        type={regShowPassword ? 'text' : 'password'}
                        placeholder="Ketik ulang kata sandi"
                        value={regConfirmPassword}
                        onChange={(e) => {
                          setRegConfirmPassword(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-blue-600 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setRegShowPassword((s) => !s)}
                        aria-label={regShowPassword ? 'Sembunyikan sandi' : 'Lihat sandi'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-700"
                      >
                        {regShowPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Daftar & Masuk ke Portal
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="py-4 px-6 text-center text-xs text-slate-500">
        SIVEMA EdLink · Sistem Pembelajaran Akademik Fisika Tumbukan
      </footer>
    </div>
  );
};
