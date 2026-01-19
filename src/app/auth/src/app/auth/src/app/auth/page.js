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

    setMsg("Account created! Check your email if required.");
  }

  async function signIn() {
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pw
    });
    if (error) setMsg(error.message);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Sign in to AITube</h2>

      {session ? (
        <>
          <p>Signed in as {session.user.email}</p>
          <button onClick={signOut}>Sign out</button>
        </>
      ) : (
        <>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />

          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <br />

          <input
            placeholder="Username (signup)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />

          <button onClick={signIn}>Sign in</button>
          <button onClick={signUp}>Create account</button>
          {msg && <p>{msg}</p>}
        </>
      )}
    </div>
  );
}
