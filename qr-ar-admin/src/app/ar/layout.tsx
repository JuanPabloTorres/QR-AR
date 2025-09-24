// Layout especial para páginas AR (override del layout principal)
import "../globals.css";

export default function ArLayout({ children }: { children: React.ReactNode }) {
  return <div className="ar-fullscreen-container">{children}</div>;
}
