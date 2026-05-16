import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PUBLIC_POSTS } from "../data/publicData";

export default function BlogDetail() {
  const { slug } = useParams();
  const post = PUBLIC_POSTS.find((item) => item.slug === slug);

  if (!post) {
    return (
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
        <div className="mt-6 rounded-xl border border-border bg-white p-8 text-center">
          <h1 className="text-xl font-head font-semibold text-secondary-900">Post not found</h1>
          <p className="mt-2 text-sm text-secondary-600">The article you are looking for does not exist.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      <article className="mt-6 rounded-xl border border-border bg-white p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-medium text-primary">
          <span className="rounded-full bg-primary/10 px-2.5 py-1">{post.category}</span>
          <span className="text-secondary-500">{post.date}</span>
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-head font-semibold text-secondary-900">{post.title}</h1>
        <p className="mt-6 text-sm leading-7 text-secondary-700 whitespace-pre-line">{post.content}</p>
      </article>
    </section>
  );
}
