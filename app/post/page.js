import Header from "@/components/Header";
import PostForm from "@/components/PostForm";

export const metadata = {
  title: "发布帖子 - 林间营地"
};

export default function PostPage() {
  return (
    <>
      <Header action="back" />
      <main className="page-shell narrow-shell">
        <section className="form-intro">
          <p className="eyebrow">New Story</p>
          <h1>发布一篇露营笔记</h1>
          <p>上传多张照片，写下这次营地的天气、装备、风景和一点点小发现。</p>
        </section>

        <PostForm />
      </main>
    </>
  );
}
