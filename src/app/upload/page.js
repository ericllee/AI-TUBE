"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { detectProvider, youtubeThumb } from "../../lib/providers";

export default function UploadPage() {
  const [session, setSession] = useState(null);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit() {
    setMsg("");

    if (!session) return setMsg("Please sign in first.");
    if (!title.trim()) return setMsg("Title is required.");
    if (!videoUrl.trim()) return setMsg("Video URL is required.");

    const provider = detectProvider(videoUrl);
    const thumbnail_url = provider === "youtube" ? youtubeThumb(videoUrl) : "";

    const { error } = await supabase.from("videos").insert({
      user_id: session.user.id,
      title: title.trim(),
      description: desc || "",
      video_url: videoUrl.trim(),
      provider,
      thumbnail_url
    });

    if (error) return setMsg(error.message);

    setMsg("Posted! ✅");
    setTitle("");
    setVideoUrl("");
    setDesc("");
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ marginTop: 0 }}>Upload (Link Post)</h2>
      <p style={{ opacity: 0.75, marginTop: 0 }}>
        For now, AITube is free by letting creators post YouTube/TikTok links.
      </p>

      {!session && (
        <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12, marginBottom: 12 }}>
          You’re not signed in. <a href="/auth">Sign in here</a>.
        </div>
      )}

      <label>Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
        placeholder="My new AI video"
      />

      <label>Video URL (YouTube/TikTok)</label>
      <input
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
        placeholder="https://www.youtube.com/watch?v=..."
      />

      <label>Description</label>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        rows={5}
        style={{ width: "100%", padding: 10, margin: "6px 0 12px" }}
        placeholder="What is this video about?"
      />

      <button onClick={submit} style={{ padding: "10px 14px" }}>
        Post
      </button>

      {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
    </div>
  );
}
