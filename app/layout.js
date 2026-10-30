import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Culture Scouts — Find Kerala's hidden festivals",
  description: "Young scouts snap Malayalam festival posters; Gemma turns them into a live, multilingual Theyyam map for visitors.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Inter:wght@400;500;600&family=Noto+Sans+Malayalam:wght@400;600&family=Noto+Naskh+Arabic:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="topbar">
          <Link href="/" className="brand">
            <span className="brand-mark">◈</span> Culture Scouts
            <span className="ml brand-ml">തെയ്യം · ഉത്സവം</span>
          </Link>
          <nav>
            <Link href="/translate">🌐 Read a poster</Link>
            <Link href="/#leaderboard">Top scouts</Link>
            <Link href="/scout" className="btn btn-primary">📸 Scout a poster</Link>
          </nav>
        </header>
        <div className="kasavu" aria-hidden />
        <main>{children}</main>
        <footer className="footer">Built at Hacktoberfest Hack Day Dubai · Powered by Gemma 4 · Open source</footer>
      </body>
    </html>
  );
}
