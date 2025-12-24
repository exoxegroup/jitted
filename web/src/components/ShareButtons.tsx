"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Link as LinkIcon, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Check,
  Share2
} from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for non-secure contexts (like HTTP IP addresses)
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback: Oops, unable to copy', err);
          throw err;
        }
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
      toast.error("Failed to copy link");
    }
  };

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:bg-[#1877F2] hover:text-white"
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: "hover:bg-[#1DA1F2] hover:text-white"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "hover:bg-[#0A66C2] hover:text-white"
    },
    {
      name: "WhatsApp",
      icon: Share2, // Using Share2 as generic icon or could import MessageCircle if available, sticking to Lucide defaults
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
      color: "hover:bg-[#25D366] hover:text-white"
    }
  ];

  if (!url) return null;

  return (
    <div className="p-6 bg-slate-50 rounded-lg border space-y-4">
      <h3 className="font-bold flex items-center gap-2">
        <Share2 className="h-4 w-4" />
        Share Article
      </h3>
      <div className="grid grid-cols-5 gap-2">
        <Button
          variant="outline"
          size="icon"
          className="w-full h-10 transition-colors"
          onClick={handleCopy}
          title="Copy Link"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <LinkIcon className="h-4 w-4" />}
        </Button>
        
        {shareLinks.map((link) => (
          <Button
            key={link.name}
            variant="outline"
            size="icon"
            className={`w-full h-10 transition-colors ${link.color}`}
            asChild
          >
            <a href={link.href} target="_blank" rel="noopener noreferrer" title={`Share on ${link.name}`}>
              <link.icon className="h-4 w-4" />
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
