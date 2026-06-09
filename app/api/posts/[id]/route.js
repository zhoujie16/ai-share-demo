import { NextResponse } from "next/server";
import { getPost } from "@/lib/posts";

export async function GET(_request, context) {
  try {
    const { id } = await context.params;
    const post = await getPost(id);
    if (!post) {
      return NextResponse.json({ error: "没有找到这篇帖子" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: error.message || "帖子加载失败" }, { status: 500 });
  }
}
