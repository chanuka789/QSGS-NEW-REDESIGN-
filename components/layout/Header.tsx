"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ArrowLong } from "@/components/ui/ArrowLong";
import { company, mainNav, offices, routes, type NavItem } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, item: NavItem) {
  if (item.href === "/") return pathname === "/";
  if (pathname === item.href) return true;
  return !!item.children?.some((c) => c.href === pathname);
}

export function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (mobileOpen || openMenu) return;
    if (y > 480 && y - prev > 6) setHidden(true);
    else if (y - prev < -4 || y < 200) setHidden(false);
  });

  // Close menus when the route changes (state adjustment during render, per React docs).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
    setHidden(false);
  }

  useEffect(() => {
    if (mobileOpen) lenis?.stop();
    else lenis?.start();
  }, [mobileOpen, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-5"
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 30 }}
      >
        <div
          className={cn(
            "glass glass-pill glass-lens relative mx-auto flex h-[68px] items-center justify-between gap-4 overflow-hidden pl-6 pr-2.5 transition-[max-width] duration-700 ease-[var(--ease-liquid)] sm:pl-7",
            scrolled ? "glass-strong max-w-[1120px]" : "max-w-[1320px]",
          )}
        >
          <Link href="/" aria-label={`${company.name} — home`} className="shrink-0 transition-opacity hover:opacity-80">
            <Logo className="h-[32px] w-auto text-brand sm:h-[38px]" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active = isActive(pathname, item);
                const hasChildren = !!item.children?.length;
                const base = cn(
                  "relative flex h-11 items-center gap-1 rounded-full px-4 text-[0.95rem] transition-colors",
                  active ? "text-ink" : "text-ink-2/80 hover:text-ink",
                );
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => (hasChildren ? open(item.label) : setOpenMenu(null))}
                    onMouseLeave={hasChildren ? scheduleClose : undefined}
                  >
                    {hasChildren ? (
                      <button
                        type="button"
                        aria-expanded={openMenu === item.label}
                        aria-haspopup="true"
                        onClick={() => setOpenMenu((m) => (m === item.label ? null : item.label))}
                        className={base}
                      >
                        {item.label}
                        <ChevronDown className={cn("h-3.5 w-3.5 opacity-60 transition-transform duration-300", openMenu === item.label && "rotate-180")} />
                      </button>
                    ) : (
                      <Link href={item.href} aria-current={active ? "page" : undefined} className={base}>
                        {item.label}
                      </Link>
                    )}
                    {active && <motion.span layoutId="nav-dot" className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand" />}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href={routes.contact} className="btn btn-primary btn-sm hidden sm:inline-flex">
              Schedule a meeting <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="grid h-12 w-12 place-items-center rounded-full transition-colors hover:bg-ink/5 lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="relative block h-3 w-8" aria-hidden>
                <motion.span className="absolute left-0 top-0 h-[1.5px] w-8 rounded-full bg-ink" animate={mobileOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }} />
                <motion.span className="absolute left-0 top-[11px] h-[1.5px] w-8 rounded-full bg-ink" animate={mobileOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }} />
              </span>
            </button>
          </div>

          {/* Scroll progress line */}
          <motion.span aria-hidden className="absolute inset-x-8 bottom-0 h-[2px] origin-left rounded-full bg-brand" style={{ scaleX: progress }} />
        </div>

        {/* Desktop dropdown panel */}
        <AnimatePresence>
          {openMenu && (
            <motion.div
              key={openMenu}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
              exit={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="mx-auto mt-3 hidden max-w-[760px] lg:block"
              onMouseEnter={() => open(openMenu)}
              onMouseLeave={scheduleClose}
            >
              <div className="glass glass-strong grid grid-cols-2 gap-1 p-3">
                {mainNav
                  .find((i) => i.label === openMenu)
                  ?.children?.map((c, i) => (
                    <Link key={c.href + c.label} href={c.href} className="group flex items-start gap-4 rounded-[18px] p-4 transition-colors hover:bg-white/70">
                      <span className="num pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2 text-[1.02rem] font-medium text-ink">
                          {c.label}
                          <ArrowUpRight className="h-4 w-4 text-brand opacity-0 transition-opacity group-hover:opacity-100" />
                        </span>
                        <span className="mt-1 block text-[0.88rem] leading-snug text-muted">{c.description}</span>
                      </span>
                    </Link>
                  ))}
                {openMenu === "Services" && (
                  <Link href={routes.services} className="link-arrow col-span-2 mt-1 rounded-[18px] px-4 py-3 text-[0.95rem] hover:bg-white/70">
                    Explore all quantity surveying services <ArrowLong />
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 overflow-y-auto bg-paper/95 px-6 pb-10 pt-28 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            data-lenis-prevent
          >
            <nav aria-label="Mobile">
              <ul className="border-t border-line">
                {mainNav.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-line"
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive(pathname, item) ? "page" : undefined}
                      className="flex items-baseline gap-5 py-5 text-[2rem] font-medium leading-none tracking-[-0.02em] text-ink"
                    >
                      <span className="num text-[0.85rem]">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </Link>
                    {item.children && (
                      <ul className="-mt-1 grid gap-1 pb-5 pl-10">
                        {item.children.map((c) => (
                          <li key={c.href + c.label}>
                            <Link href={c.href} className={cn("block py-1.5 text-[1.02rem] text-muted", pathname === c.href && "text-ink")}>
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10 space-y-8">
              <Link href={routes.contact} className="btn btn-primary w-full justify-between">
                Schedule an online meeting <ArrowUpRight className="h-5 w-5" />
              </Link>
              <div className="grid grid-cols-2 gap-6 text-[0.9rem]">
                {offices.map((o) => (
                  <div key={o.country}>
                    <p className="eyebrow !text-[0.7rem]">{o.country}</p>
                    {o.phone && (
                      <a href={o.phoneHref} className="mt-2 block text-ink-2">
                        {o.phone}
                      </a>
                    )}
                    <a href={`mailto:${o.email}`} className="mt-1 block break-all text-muted">
                      {o.email}
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
