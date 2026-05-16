import { Link } from "react-router-dom";
import { PUBLIC_POSTS } from "../data/publicData";

export default function Blog() {
  return (
    <div className="bg-bg min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-head font-bold text-dark mb-2">News & Blog</h1>
          <p className="text-secondary">Latest hiring insights and product updates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PUBLIC_POSTS.map((post) => (
            <article key={post.id} className="bg-white border border-border rounded-xl p-6">
              <span className="inline-block text-xs font-medium bg-primary-light text-primary px-2 py-1 rounded">{post.category}</span>
              <h3 className="text-xl font-head font-semibold text-dark mt-3 mb-2">{post.title}</h3>
              <p className="text-secondary text-sm mb-5">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">{post.date}</span>
                <Link to={`/blog/${post.slug}`} className="text-primary text-sm font-medium hover:underline">Read More</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
