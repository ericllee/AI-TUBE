"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [session, setSession] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signIn() {
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) setMsg(error.message);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2 style={{ marginTop: 0 }}>Sign in</h2>

      {session ? (
        <>
          <p>Signed in as {session.user.email}</p>
          <button onClick={signOut}>Sign out</button>
        </>
      ) : (
        <>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
          />

          <label>Password</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
          />

          <button onClick={signIn} style={{ padding: "10px 14px" }}>Sign in</button>

          {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
        </>
      )}
    </div>
  );
}
