import "./globals.css";

export const metadata = {
  title: "林间营地 - 本地露营社区",
  description: "记录露营照片、路线心得和营地体验的本地社区 demo"
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
