import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Share2,
  Check,
  Copy,
  Twitter,
  Linkedin,
  Facebook,
  Send,
  Mail,
} from 'lucide-react';

export interface ShareContext {
  url: string;
  title: string;
  text: string;
}

interface SocialShareMenuProps {
  /** Builds the share payload from the current template and PortfolioConfig. */
  getShareContext: () => ShareContext;
}

interface SocialTarget {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: (context: ShareContext) => string;
}

const SOCIAL_TARGETS: SocialTarget[] = [
  {
    id: 'x',
    label: 'Share on X',
    icon: <Twitter className="w-4 h-4" />,
    href: ({ url, text }) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: 'linkedin',
    label: 'Share on LinkedIn',
    icon: <Linkedin className="w-4 h-4" />,
    href: ({ url }) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: 'facebook',
    label: 'Share on Facebook',
    icon: <Facebook className="w-4 h-4" />,
    href: ({ url }) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'telegram',
    label: 'Share on Telegram',
    icon: <Send className="w-4 h-4" />,
    href: ({ url, text }) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: 'email',
    label: 'Share via email',
    icon: <Mail className="w-4 h-4" />,
    href: ({ url, title, text }) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
  },
];

const MENU_WIDTH = 208;

export const SocialShareMenu: React.FC<SocialShareMenuProps> = ({ getShareContext }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const copyTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyTimerRef.current), []);

  const placeMenu = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const left = Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8));
    setPosition({ top: rect.bottom + 6, left });
  }, []);

  useLayoutEffect(() => {
    if (open) placeMenu();
  }, [open, placeMenu]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const node = event.target as Node;
      if (buttonRef.current?.contains(node) || menuRef.current?.contains(node)) return;
      setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', placeMenu);
    window.addEventListener('scroll', placeMenu, true);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', placeMenu);
      window.removeEventListener('scroll', placeMenu, true);
    };
  }, [open, placeMenu]);

  const openSocial = (target: SocialTarget) => {
    window.open(target.href(getShareContext()), '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareContext().url);
      setCopied(true);
      window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Share to social media"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono transition-colors shrink-0 whitespace-nowrap"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span className="font-medium">Share</span>
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label="Share to social media"
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed p-1 rounded-xl border border-neutral-800 bg-black/95 backdrop-blur-md shadow-2xl z-[60] text-xs"
          >
            {SOCIAL_TARGETS.map((target) => (
              <button
                key={target.id}
                type="button"
                role="menuitem"
                onClick={() => openSocial(target)}
                className="flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-neutral-300 hover:bg-neutral-800/70 hover:text-neutral-100 font-mono transition-colors"
              >
                {target.icon}
                <span>{target.label}</span>
              </button>
            ))}
            <div className="my-1 h-[1px] bg-neutral-800" />
            <button
              type="button"
              role="menuitem"
              onClick={copyLink}
              className="flex w-full items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-neutral-300 hover:bg-neutral-800/70 hover:text-neutral-100 font-mono transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link copied' : 'Copy link'}</span>
            </button>
          </div>,
          document.body,
        )}
    </>
  );
};
