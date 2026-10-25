import React, { useState } from 'react';
import { Newspaper, Send, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenInfoModal: (title: string, content: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInfoModal, onOpenAdmin }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 4000);
  };

  const handleEditorialPolicy = () => {
    onOpenInfoModal(
      'Editorial Standards & Sourcing Policy',
      `The Daily Brief is committed to the highest standards of journalistic integrity and verification.

1. Source Transparency: Every syndicated article prominently cites the original reporting organization, publication timestamp, and provides a direct hyperlink to the original source.
2. Fact-Checking & Accuracy: Our editorial curators prioritize primary sources, established wire services (Reuters, AP, PTI), and peer-reviewed scientific journals.
3. Corrections & Clarifications: When factual discrepancies are identified in public reports, corrective dispatches are issued promptly.
4. Demonstration Notice: This digital newspaper interface is an editorial design prototype running on curated mock demonstration data.`
    );
  };

  const handlePrivacyPolicy = () => {
    onOpenInfoModal(
      'Privacy Policy & Reader Safeguards',
      `Your privacy and reading freedom are fundamental values at The Daily Brief.

1. No Third-Party Trackers: We do not deploy invasive third-party ad pixels or sell behavioral telemetry.
2. Local Preferences: Your theme choice (Light/Dark), font size selection, and saved bookmarks are stored exclusively within your local browser storage.
3. Newsletter Communications: Should you subscribe to our morning dispatch, your address is stored securely and never shared with commercial brokers.`
    );
  };

  const handleTermsOfUse = () => {
    onOpenInfoModal(
      'Terms of Use & Copyright Statement',
      `1. Intellectual Property: Original reporting, photographs, and logos remain the exclusive intellectual property of the respective news agencies and publications credited.
2. Fair Use & Syndication: Syndicated excerpts are reproduced under editorial review and news aggregation fair-dealing provisions.
3. Reader Conduct: Readers are granted a non-exclusive license to view and bookmark content for personal informational use.`
    );
  };

  const handleContact = () => {
    onOpenInfoModal(
      'Contact The Newsroom',
      `We welcome inquiries, editorial tips, and feedback from our readership.

• Editorial Desk: editor@dailybrief.internal
• Press Inquiries: press@dailybrief.internal
• Technical Feedback: developer@dailybrief.internal
• Newsroom Address: 14 Sansad Marg, Connaught Place, New Delhi 110001`
    );
  };

  const handleAbout = () => {
    onOpenInfoModal(
      'About The Daily Brief',
      `The Daily Brief was founded with a singular aspiration: to restore the calm dignity, clarity, and depth of traditional print journalism to the modern digital screen.

In an attention economy dominated by sensationalism and algorithmic clutter, we curate the stories that matter most—clearly reported, ethically attributed, and elegantly formatted.`
    );
  };

  return (
    <footer className="w-full bg-[#F4F2EC] dark:bg-[#141412] border-t border-[#E5E3DE] dark:border-[#2D2C28] text-xs text-[#737373] dark:text-[#9E9B93] transition-colors mt-auto">
      {/* Top Newsletter / Dispatch Box */}
      <div className="border-b border-[#E5E3DE] dark:border-[#2D2C28] py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#8B2635] dark:text-[#E06371]">
            Morning Wire Edition
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#202020] dark:text-[#EDEBE6]">
            Get the morning brief delivered to your inbox
          </h3>
          <p className="text-xs sm:text-sm text-[#555] dark:text-[#A09D96] max-w-lg mx-auto">
            A concise daily digest of verified reporting from India and around the globe.
            No spam, no clickbait.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto pt-2 flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#1F1E1B] border border-[#DDD9CE] dark:border-[#33312A] rounded-xs text-[#202020] dark:text-[#EDEBE6] placeholder-[#888] focus:outline-hidden focus:border-[#8B2635] dark:focus:border-[#E06371]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#8B2635] dark:bg-[#E06371] hover:bg-[#701E2B] text-white text-xs font-semibold rounded-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>Subscribe</span>
            </button>
          </form>

          {subscribed && (
            <div className="pt-2 flex items-center justify-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-medium animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you! You are subscribed to the daily dispatch.</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Col 1: Brand & Ethos */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#8B2635] dark:text-[#E06371]" />
              <h2 className="font-display text-xl font-bold tracking-tight text-[#202020] dark:text-[#EDEBE6]">
                The Daily Brief
              </h2>
            </div>
            <p className="text-xs leading-relaxed text-[#666] dark:text-[#999] max-w-sm">
              An independent digital broadsheet presenting news from multiple verified wire services in an uncluttered, readable format.
            </p>
            <div className="pt-1 text-[11px] text-[#888]">
              <span className="font-semibold text-[#8B2635] dark:text-[#E06371]">Source Transparency:</span> All articles visibly attribute original publishers and provide verifiable source links.
            </div>
          </div>

          {/* Col 2: Editorial & Legal Links */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#202020] dark:text-[#DDD]">
              Editorial Standards & Policies
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={handleAbout}
                  className="hover:text-[#8B2635] dark:hover:text-[#E06371] transition-colors cursor-pointer text-left"
                >
                  About The Daily Brief
                </button>
              </li>
              <li>
                <button
                  onClick={handleEditorialPolicy}
                  className="hover:text-[#8B2635] dark:hover:text-[#E06371] transition-colors cursor-pointer text-left"
                >
                  Editorial Guidelines & Fact-Checking
                </button>
              </li>
              <li>
                <button
                  onClick={handlePrivacyPolicy}
                  className="hover:text-[#8B2635] dark:hover:text-[#E06371] transition-colors cursor-pointer text-left"
                >
                  Privacy Policy & Reader Safeguards
                </button>
              </li>
              <li>
                <button
                  onClick={handleTermsOfUse}
                  className="hover:text-[#8B2635] dark:hover:text-[#E06371] transition-colors cursor-pointer text-left"
                >
                  Terms of Service & Licensing
                </button>
              </li>
              <li>
                <button
                  onClick={handleContact}
                  className="hover:text-[#8B2635] dark:hover:text-[#E06371] transition-colors cursor-pointer text-left"
                >
                  Contact The Newsroom
                </button>
              </li>
              {onOpenAdmin && (
                <li className="pt-1">
                  <button
                    onClick={onOpenAdmin}
                    className="text-[#8B2635] dark:text-[#E06371] font-semibold hover:underline cursor-pointer text-left flex items-center gap-1"
                  >
                    <span>Editorial Review Desk (Admin)</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Syndication Transparency */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#202020] dark:text-[#DDD]">
              Wire Affiliates & Sources
            </h4>
            <p className="text-[11px] text-[#737373] dark:text-[#999] leading-relaxed">
              Curated reporting aggregated from Reuters, Press Trust of India, The Hindu, AP, Bloomberg, Nature, and independent international correspondents.
            </p>
            <div className="p-2.5 bg-[#EAE7DF] dark:bg-[#1E1D1B] rounded-xs border border-[#DDD9CE] dark:border-[#2C2A26] text-[10px] text-[#666] dark:text-[#AAA]">
              ⚠️ Prototype Edition: Demonstrates newspaper layout and frontend responsiveness. No live news wire API is actively charged.
            </div>
          </div>
        </div>

        {/* Bottom Rule & Copyright */}
        <div className="mt-8 pt-6 border-t border-[#E5E3DE] dark:border-[#2D2C28] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#888]">
          <p>© {new Date().getFullYear()} The Daily Brief. All rights reserved.</p>
          <p className="font-serif italic">
            "Freedom of expression and responsible journalism for a resilient democracy."
          </p>
        </div>
      </div>
    </footer>
  );
};
