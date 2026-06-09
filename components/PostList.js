"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DEFAULT_COVER } from "@/lib/constants";

function formatTime(time) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(time));
}

function excerpt(text, max = 86) {
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > max ? `${compact.slice(0, max)}...` : compact;
}

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      try {
        const response = await fetch("/api/posts", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load posts");
        const data = await response.json();
        if (active) {
          setPosts(data.posts || []);
          setStatus("ready");
        }
      } catch {
        if (active) setStatus("error");
      }
    }

    loadPosts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="section-heading">
        <div>
          <p className="eyebrow">Latest Posts</p>
          <h2>最新帖子</h2>
        </div>
        <span className="soft-pill">
          {status === "ready" ? `${posts.length} 篇帖子` : "加载中"}
        </span>
      </section>

      <section className="post-grid" aria-live="polite">
        {status === "loading" && <div className="empty-state">正在加载营地笔记...</div>}
        {status === "error" && <div className="empty-state">帖子加载失败，请稍后重试。</div>}
        {status === "ready" && !posts.length && (
          <div className="empty-state">还没有帖子，去发布第一篇露营笔记吧。</div>
        )}
        {status === "ready" &&
          posts.map((post) => (
            <Link className="post-card" href={`/detail/${encodeURIComponent(post.id)}`} key={post.id}>
              <img
                className="card-cover"
                src={post.images?.[0] || DEFAULT_COVER}
                alt={post.title}
              />
              <div className="card-body">
                <h3>{post.title}</h3>
                <p>{excerpt(post.body)}</p>
                <div className="meta-row">
                  <span>{formatTime(post.createdAt)}</span>
                  <span className="metric-group">
                    <span>{post.likes} 赞</span>
                    <span>{post.comments.length} 评</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
      </section>
    </>
  );
}
