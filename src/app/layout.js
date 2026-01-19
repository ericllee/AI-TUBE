export const metadata = { title: "AITube" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, Arial" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/" style={{ fontWeight: 800, textDecoration: "none", color: "inherit" }}>AITube</a>
          <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
            <a href="/auth">Sign in</a>
          </div>
        </div>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>{children}</div>
      </body>
    </html>
  );
}
