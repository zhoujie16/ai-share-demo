import Header from "@/components/Header";
import PostList from "@/components/PostList";

export default function HomePage() {
  return (
    <>
      <Header action="post" />
      <main className="page-shell">
        <section className="hero">
          <div>
            <p className="eyebrow">Local Camping Journal</p>
            <h1>记录每一次扎营、炊烟和醒来的清晨</h1>
          </div>
          <p>无需注册登录，直接分享你的露营照片、路线心得和营地体验。</p>
        </section>

        <PostList />
      </main>
    </>
  );
}
