import { NextResponse } from "next/server";
import { addComment } from "@/lib/posts";

export async function POST(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const post = await addComment(id, body);
    if (!post) {
      return NextResponse.json({ error: "没有找到这篇帖子" }, { status: 404 });
    }
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "评论提交失败" },
      { status: error.status || 500 }
    );
  }
}
