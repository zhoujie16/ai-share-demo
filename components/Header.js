import Link from "next/link";

export default function Header({ action = "post" }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" />
          <span>林间营地</span>
        </Link>
        {action === "back" ? (
          <Link className="ghost-action" href="/">
            返回首页
          </Link>
        ) : (
          <Link className="primary-action" href="/post">
            发布营地笔记
          </Link>
        )}
      </div>
    </header>
  );
}
