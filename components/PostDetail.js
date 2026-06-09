"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function formatTime(time) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(time));
}

export default function PostDetail({ postId }) {
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading");
  const [commentStatus, setCommentStatus] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPost() {
      try {
        const response = await fetch(`/api/posts/${encodeURIComponent(postId)}`, { cache: "no-store" });
        if (response.status === 404) {
          if (active) setStatus("missing");
          return;
        }
        if (!response.ok) throw new Error("Failed to load post");
        const data = await response.json();
        if (active) {
          setPost(data.post);
          setStatus("ready");
          document.title = `${data.post.title} - 林间营地`;
        }
      } catch {
        if (active) setStatus("error");
      }
    }

    loadPost();
    return () => {
      active = false;
    };
  }, [postId]);

  async function handleLike() {
    const response = await fetch(`/api/posts/${encodeURIComponent(postId)}/like`, { method: "POST" });
    if (!response.ok) return;
    const data = await response.json();
    setPost(data.post);
  }

  async function handleComment(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nickname = String(formData.get("nickname") || "").trim();
    const content = String(formData.get("content") || "").trim();
    if (!nickname || !content) return;

    setCommentStatus("正在提交...");
    const response = await fetch(`/api/posts/${encodeURIComponent(postId)}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, content })
    });
    const data = await response.json();
    if (!response.ok) {
      setCommentStatus(data.error || "评论失败，请稍后重试。");
      return;
    }

    setPost(data.post);
    form.reset();
    setCommentStatus("");
  }

  if (status === "loading") {
    return <article className="detail-card empty-state">正在加载帖子...</article>;
  }

  if (status === "missing") {
    return (
      <article className="detail-card">
        <h1>没有找到这篇帖子</h1>
        <p className="detail-body">它可能已经被删除，或当前数据库还没有这条记录。</p>
        <Link className="primary-action" href="/">
          返回首页
        </Link>
      </article>
    );
  }

  if (status === "error") {
    return <article className="detail-card empty-state">帖子加载失败，请稍后重试。</article>;
  }

  const comments = [...post.comments].sort((a, b) => a.createdAt - b.createdAt);

  return (
    <>
      <article className="detail-card">
        <div className="detail-meta">
          <span>{formatTime(post.createdAt)}</span>
          <button className="like-button" type="button" onClick={handleLike}>
            喜欢 {post.likes}
          </button>
        </div>
        <h1>{post.title}</h1>
        <p className="detail-body">{post.body}</p>
        <div className="detail-gallery">
          {post.images.map((src, index) => (
            <img src={src} alt={`${post.title} 图片 ${index + 1}`} key={`${src}-${index}`} />
          ))}
        </div>
      </article>

      <section className="comment-panel">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow">Campfire Talks</p>
            <h2>评论区</h2>
          </div>
          <span className="soft-pill">{post.comments.length} 条评论</span>
        </div>

        <form className="comment-form" onSubmit={handleComment}>
          <input name="nickname" type="text" maxLength="20" placeholder="游客昵称" required />
          <textarea name="content" rows="4" placeholder="说点什么..." required />
          <button className="primary-action button-reset" type="submit">
            提交评论
          </button>
        </form>
        {commentStatus && <p className="form-hint">{commentStatus}</p>}

        <div className="comment-list">
          {!comments.length && <div className="empty-state">还没有评论，来坐下聊两句。</div>}
          {comments.map((comment) => (
            <div className="comment-item" key={comment.id}>
              <div className="comment-head">
                <strong>{comment.nickname}</strong>
                <span>{formatTime(comment.createdAt)}</span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
