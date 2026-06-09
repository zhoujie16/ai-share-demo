import Header from "@/components/Header";
import PostDetail from "@/components/PostDetail";

export const metadata = {
  title: "帖子详情 - 林间营地"
};

export default async function DetailPage({ params }) {
  const { id } = await params;

  return (
    <>
      <Header action="post" />
      <main className="page-shell detail-shell">
        <PostDetail postId={id} />
      </main>
    </>
  );
}
