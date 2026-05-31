import Image from "next/image"
import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="hidden lg:block w-full border-t border-slate-200/40 bg-gradient-to-b from-[#f5f9ff] to-[#eef6ff] py-14">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-4 gap-8">

        {/* Brand Section wrapped in a gorgeous premium card */}
        <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_8px_24px_rgba(224,236,255,0.25)] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/mascot.svg"
                alt="Talkify Mascot"
                width={36}
                height={36}
              />
              <h3 className="text-lg font-black text-[#0059e3] tracking-wide font-sans">
                Talkify
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Learn, practice, and master English fluency with fun exercises,
              interactive games, and real conversation practice.
            </p>
          </div>
        </div>

        {/* Platform Links */}
        <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_8px_24px_rgba(224,236,255,0.25)]">
          <h4 className="font-extrabold text-slate-800 mb-4 text-sm uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2 text-xs text-slate-500 font-semibold">
            <li><Link href="/courses" className="hover:text-[#0059e3] transition-colors">Courses</Link></li>
            <li><Link href="/practice" className="hover:text-[#0059e3] transition-colors">Practice</Link></li>
            <li><Link href="/games" className="hover:text-[#0059e3] transition-colors">Games</Link></li>
            <li><Link href="/pricing" className="hover:text-[#0059e3] transition-colors">Pricing</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_8px_24px_rgba(224,236,255,0.25)]">
          <h4 className="font-extrabold text-slate-800 mb-4 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-xs text-slate-500 font-semibold">
            <li><Link href="/about" className="hover:text-[#0059e3] transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-[#0059e3] transition-colors">Contact</Link></li>
            <li><Link href="/blog" className="hover:text-[#0059e3] transition-colors">Blog</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-[0_8px_24px_rgba(224,236,255,0.25)]">
          <h4 className="font-extrabold text-slate-800 mb-4 text-sm uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2 text-xs text-slate-500 font-semibold">
            <li><Link href="/privacy" className="hover:text-[#0059e3] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[#0059e3] transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-slate-200/30 py-4 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-wider">
          <span>© {new Date().getFullYear()} Talkify. All rights reserved.</span>
          <span>Made with ❤️ for confident speakers.</span>
        </div>
      </div>
    </footer>
  )
}
