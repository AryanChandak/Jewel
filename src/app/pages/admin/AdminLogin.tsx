import { useState }    from 'react';
import { useNavigate } from 'react-router';
import { motion }      from 'motion/react';
import { Eye, EyeOff, Lock, User, AlertCircle, Gem } from 'lucide-react';
import { useAdmin, ADMIN_USERNAME } from '../../store/adminStore';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }  = useAdmin();
  const navigate   = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const errMsg = await login(username, password);
    setLoading(false);
    if (!errMsg) navigate('/admin', { replace: true });
    else         setError(errMsg);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Gem size={24} className="text-amber-400" />
            </div>
          </div>
          <h1 className="font-serif text-3xl text-white tracking-widest mb-1">ELEGANCE</h1>
          <p className="text-gray-600 text-xs tracking-widest uppercase">Admin Dashboard</p>
        </div>

        <div className="bg-[#161616] border border-white/8 p-8 shadow-2xl">
          <h2 className="font-serif text-xl text-white mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-7">Sign in to access the admin panel</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-[10px] tracking-widest text-gray-500 uppercase mb-2">
                Username
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                  className="w-full bg-white/5 border border-white/10 text-white pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-amber-400/50 transition-colors placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] tracking-widest text-gray-500 uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 text-white pl-9 pr-10 py-3 text-sm focus:outline-none focus:border-amber-400/50 transition-colors placeholder:text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 text-red-400 text-xs p-3 bg-red-400/10 border border-red-400/20"
              >
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 text-black font-semibold tracking-widest uppercase text-xs py-4 hover:bg-amber-300 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              )}
              {loading ? 'Signing in…' : 'Sign In to Dashboard'}
            </motion.button>
          </form>

          {/* Username hint */}
          <div className="mt-7 pt-6 border-t border-white/8">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Admin username</span>
              <code className="text-amber-400 bg-amber-400/10 px-2 py-0.5">{ADMIN_USERNAME}</code>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-gray-700 text-xs">
          © 2026 Elegance. Authorised personnel only.
        </p>
      </motion.div>
    </div>
  );
}
