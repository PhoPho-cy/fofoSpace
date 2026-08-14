import { Link } from 'react-router-dom';

type Module = 'hero' | 'about' | 'work';

interface GlobalNavProps {
  activeModule?: Module;
  onSwitchModule?: (mod: Module) => void;
}

/**
 * 子页面的极简导航：无顶部传统导航栏，
 * 仅右上角三个符文入口（空间 / 文档 / 联系）。
 */
export default function GlobalNav(_props: GlobalNavProps) {
  return (
    <nav
      aria-label="站点导航"
      className="pointer-events-none fixed right-6 top-6 z-50 flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.28em]"
    >
      <Link to="/?act=cover" className="rune-btn pointer-events-auto">
        <span className="rune-dot" /> 空间
      </Link>
      <Link to="/thoughts" className="rune-btn pointer-events-auto">
        <span className="rune-dot" /> 文档
      </Link>
      <a href="mailto:hello@fofospace.dev" className="rune-btn pointer-events-auto">
        <span className="rune-dot" /> 联系
      </a>
    </nav>
  );
}
