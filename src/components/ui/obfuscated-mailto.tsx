"use client";

import { useEffect, useState, AnchorHTMLAttributes } from "react";

interface ObfuscatedMailtoProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  user: string;
  domain: string;
  subject?: string;
}

/**
 * Obfuscates email addresses by constructing the mailto link on the client side.
 * This helps prevent simple scrapers from harvesting the email from the static HTML.
 */
export function ObfuscatedMailto({
  user,
  domain,
  subject,
  children,
  className,
  ...props
}: ObfuscatedMailtoProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const email = `${user}@${domain}`;
  const subjectParam = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  const href = isMounted ? `mailto:${email}${subjectParam}` : "#";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isMounted) {
      e.preventDefault();
      window.location.href = `mailto:${email}${subjectParam}`;
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children || "Contact Me"}
    </a>
  );
}
