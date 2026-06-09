import Link from "next/link";
import { appPath } from "@/lib/paths";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/quiz-maken", label: "Quiz maken" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-white/70 bg-white/72 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="text-xl font-black text-ink" href={appPath("/")}>
          Begrippen Battle
        </Link>
        <nav className="flex flex-wrap gap-2" aria-label="Hoofdnavigatie">
          {navItems.map((item) => (
            <Link
              className="rounded-lg px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-teal-50 hover:text-ocean"
              href={appPath(item.href)}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
