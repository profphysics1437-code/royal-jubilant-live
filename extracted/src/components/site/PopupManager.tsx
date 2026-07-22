"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Popup {
  id: string;
  title: string;
  content: string;
  type: string;
  trigger: string;
  delaySeconds: number;
  position: string;
  imageUrl: string | null;
  buttonText: string | null;
  buttonLink: string | null;
}

export function PopupManager() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    fetch("/api/public/popups")
      .then((r) => r.json())
      .then((d) => {
        if (d.popups && d.popups.length > 0) {
          const p = d.popups[0];
          if (p.trigger === "immediate") {
            setPopup(p);
          } else if (p.trigger === "delayed") {
            setTimeout(() => setPopup(p), (p.delaySeconds || 3) * 1000);
          } else if (p.trigger === "scroll") {
            const handler = () => {
              if (window.scrollY > 500) { setPopup(p); window.removeEventListener("scroll", handler); }
            };
            window.addEventListener("scroll", handler, { passive: true });
          }
        }
      })
      .catch(() => {});
  }, [dismissed]);

  const close = () => { setPopup(null); setDismissed(true); };

  const posClass = popup?.position === "top" ? "items-start pt-20" : popup?.position === "bottom" ? "items-end pb-20" : popup?.position === "bottom-right" ? "items-end justify-end p-6" : "items-center justify-center";

  return (
    <AnimatePresence>
      {popup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className={`fixed inset-0 z-[95] bg-black/70 backdrop-blur-sm flex ${posClass} p-4`}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-md"
          >
            <button onClick={close} className="absolute top-3 right-3 z-10 size-9 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <X className="size-5 text-white" />
            </button>
            {popup.imageUrl && (
              <div className="aspect-video bg-[#F4F5F7] overflow-hidden">
                <img src={popup.imageUrl} alt={popup.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6">
              <span className="text-[10px] tracking-luxury uppercase text-[#C9A961] font-medium block mb-2 capitalize">{popup.type}</span>
              <h3 className="font-serif text-xl font-medium text-[#0A1F44] mb-2">{popup.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{popup.content}</p>
              {popup.buttonText && (
                <a href={popup.buttonLink || "#"} onClick={close} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white text-sm font-medium transition-colors">
                  {popup.buttonText}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
