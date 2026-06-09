import { NextResponse } from "next/server";
import { likePost } from "@/lib/posts";

export async function POST(_request, context) {
  try {
    const { id } = await context.params;
    const post = await likePost(id);
    if (!post) {
      return NextResponse.json({ error: "没有找到这篇帖子" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: error.message || "点赞失败" }, { status: 500 });
  }
}
