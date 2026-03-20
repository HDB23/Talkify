import Image from "next/image"
import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="hidden lg:block w-full border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-4 gap-8">

        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/mascot.svg"
              alt="Talkify Mascot"
              width={40}
              height={40}
            />
            <h3 className="text-xl font-bold text-slate-800">
              Talkify
            </h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Learn, practice, and master English fluency with fun exercises,
            interactive games, and real conversation practice.
          </p>
        </div>

        {/* Platform Links */}
        <div>
          <h4 className="font-semibold text-slate-800 mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/courses" className="hover:text-green-600">Courses</Link></li>
            <li><Link href="/practice" className="hover:text-green-600">Practice</Link></li>
            <li><Link href="/games" className="hover:text-green-600">Games</Link></li>
            <li><Link href="/pricing" className="hover:text-green-600">Pricing</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-slate-800 mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/about" className="hover:text-green-600">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-green-600">Contact</Link></li>
            <li><Link href="/blog" className="hover:text-green-600">Blog</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold text-slate-800 mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/privacy" className="hover:text-green-600">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-green-600">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-slate-200 py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Talkify. All rights reserved.</span>
          <span>Made with ❤️ for confident speakers.</span>
        </div>
      </div>
    </footer>
  )
}
