"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [username, setUsername] = useState("");
  const [session, setSession] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signUp() {
    setMsg("");
    const { data, error } = await supabase.auth.signUp({ email, password: pw });
    if (error) return setMsg(error.message);

    const userId = data.user?.id;
    if (userId) {
      const { error: pErr } = await supabase.from("profiles").insert({
        id: userId,
        username: username || email.split("@")[0],
        display_name: username || ""
      });
      if (pErr) return setMsg(pErr.message);
    }

    setMsg("Account created! Check your email if confirmation is required.");
  }

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
      <h2 style={{ marginTop: 0 }}>Sign in to AITube</h2>

      {session ? (
        <>
          <div style={{ marginBottom: 12 }}>Signed in as {session.user.email}</div>
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

          <label>Username (for sign up)</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={signIn}>Sign in</button>
            <button onClick={signUp}>Create account</button>
          </div>

          {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
        </>
      )}
    </div>
  );
}
