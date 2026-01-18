export const metadata = { title: "AITube" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, Arial" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
          <strong>AITube</strong>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
