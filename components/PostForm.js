"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEFAULT_COVER } from "@/lib/constants";

function imageFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const maxSide = 1400;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.84));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function PostForm() {
  const router = useRouter();
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [hint, setHint] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleFiles(event) {
    const selected = Array.from(event.target.files || []);
    setFiles(selected);
    setPreviews(selected.map((file) => ({ src: URL.createObjectURL(file), name: file.name })));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") || "").trim();
    const body = String(formData.get("body") || "").trim();
    if (!title || !body) return;

    setSubmitting(true);
    setHint("正在保存图片...");

    try {
      const images = files.length ? await Promise.all(files.map(imageFileToDataUrl)) : [DEFAULT_COVER];
      setHint("正在发布帖子...");
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, images })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "发布失败");
      router.push(`/detail/${encodeURIComponent(data.post.id)}`);
      router.refresh();
    } catch (error) {
      setHint(error.message || "发布失败，请稍后重试。");
      setSubmitting(false);
    }
  }

  return (
    <form className="compose-card" onSubmit={handleSubmit}>
      <label className="field">
        <span>标题</span>
        <input
          name="title"
          type="text"
          maxLength="60"
          placeholder="例如：周末去了溪边森林营地"
          required
        />
      </label>

      <label className="field">
        <span>正文</span>
        <textarea
          name="body"
          rows="10"
          placeholder="写下你的露营体验、路线建议、装备心得..."
          required
        />
      </label>

      <div className="field">
        <span>图片</span>
        <label className="upload-box" htmlFor="imageInput">
          <strong>选择多张图片</strong>
          <small>支持 JPG、PNG、WebP，发布前会自动压缩保存到 MongoDB</small>
        </label>
        <input
          id="imageInput"
          className="file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
        />
        <div className="preview-grid">
          {previews.map((preview) => (
            <img key={preview.src} src={preview.src} alt={preview.name} />
          ))}
        </div>
      </div>

      <div className="form-actions">
        <p className="form-hint">{hint}</p>
        <button className="primary-action button-reset" type="submit" disabled={submitting}>
          {submitting ? "发布中" : "发布帖子"}
        </button>
      </div>
    </form>
  );
}
