import React from "react";
import { Link } from "react-router-dom";
import { LinkedInLayout } from "../layout/LinkedInLayout";
import { PostCard } from "../components/linkedin/PostCard";
import { StoryBar } from "../components/linkedin/StoryBar";
import { Image, Video, Calendar, FileText, Bookmark, Users, Hash } from "lucide-react";

// Mock Data
const MOCK_USER = {
  id: "me",
  name: "Current User",
  headline: "Software Engineer | React Enthusiast",
  avatar: "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff",
  bannerImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1000",
  connections: 521,
  profileViews: 124,
};

const MOCK_POSTS = [
  {
    id: 1,
    authorId: "jane",
    authorName: "Jane Doe",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    authorHeadline: "Senior Product Manager at TechCorp",
    timeAgo: "2h",
    content: "Just published a new article on Product Management best practices in 2026. \n\nCheck it out below! Thoughts?",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    likes: 342,
    comments: 54,
    shares: 12,
  },
  {
    id: 2,
    authorId: "john",
    authorName: "John Smith",
    authorAvatar: "https://i.pravatar.cc/150?img=2",
    authorHeadline: "Frontend Developer | Open Source Contributor",
    timeAgo: "5h",
    content: "Excited to share that I've just started a new position as Lead Frontend Developer at Innovate LLC! Thanks to everyone who supported me along the way.",
    likes: 892,
    comments: 120,
    shares: 4,
  },
  {
    id: 3,
    authorId: "alice",
    authorName: "Alice Johnson",
    authorAvatar: "https://i.pravatar.cc/150?img=3",
    authorHeadline: "UX/UI Designer",
    timeAgo: "1d",
    content: "Clean interfaces aren't just about aesthetics; they're about reducing cognitive load. Here's a thread on how white space impacts user retention 🧵👇",
    likes: 415,
    comments: 89,
    shares: 45,
  }
];
import { useAuth } from "../context/AuthContext";

export default function Feed() {
  const { user } = useAuth();
  const derivedName = user?.email ? user.email.split('@')[0] : "Current User";
  const derivedAvatar = `https://ui-avatars.com/api/?name=${derivedName}&background=6366f1&color=fff`;

  const currentUser = {
    ...MOCK_USER,
    id: user?.id || "me",
    name: derivedName,
    avatar: derivedAvatar,
  };
  return (
    <LinkedInLayout>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        
        {/* Left Sidebar - Profile Summary */}
        <aside className="hidden md:block w-56 lg:w-64 flex-shrink-0">
          <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden mb-4">
            <div className="h-16 relative">
              <img src={currentUser.bannerImage} alt="Cover" className="w-full h-full object-cover" />
            </div>
            <div className="px-4 pb-4">
              <Link to="/profile/me">
                <div className="flex justify-center -mt-8 mb-2 relative">
                  <div className="w-16 h-16 rounded-full border-2 border-surface bg-bg overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="text-center group cursor-pointer">
                  <h2 className="font-semibold text-primary group-hover:underline text-base leading-tight">{currentUser.name}</h2>
                  <p className="text-xs text-secondary mt-1 line-clamp-2">{currentUser.headline}</p>
                </div>
              </Link>
            </div>
            
            <div className="border-t border-border py-3">
              <div className="px-4 py-1 hover:bg-bg cursor-pointer transition-colors flex justify-between items-center text-xs">
                <span className="text-secondary font-medium">Profile viewers</span>
                <span className="text-accent font-semibold">{currentUser.profileViews}</span>
              </div>
              <div className="px-4 py-1 hover:bg-bg cursor-pointer transition-colors flex justify-between items-center text-xs">
                <span className="text-secondary font-medium">Connections</span>
                <span className="text-accent font-semibold">{currentUser.connections}</span>
              </div>
            </div>

            <div className="border-t border-border px-4 py-3 hover:bg-bg cursor-pointer transition-colors flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-secondary" />
              <span className="text-xs font-medium text-primary">Saved items</span>
            </div>
          </div>

          <div className="bg-surface rounded-lg shadow-sm border border-border pb-2 sticky top-20">
            <div className="px-4 pt-3 pb-1">
              <h3 className="text-xs font-semibold text-primary">Recent</h3>
            </div>
            {[
              { icon: Users, text: "React Developers" },
              { icon: Hash, text: "javascript" },
              { icon: Hash, text: "webdevelopment" },
              { icon: Users, text: "UI/UX Design Patterns" }
            ].map((item, i) => (
              <div key={i} className="px-4 py-1.5 hover:bg-bg cursor-pointer flex items-center gap-2 text-xs text-secondary transition-colors">
                <item.icon className="w-3 h-3" />
                <span className="truncate">{item.text}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Feed Center */}
        <main className="flex-1 max-w-2xl min-w-0">
          <StoryBar />

          {/* Create Post Box */}
          <div className="bg-surface rounded-lg shadow-sm border border-border p-4 mb-4">
            <div className="flex gap-3">
              <img src={currentUser.avatar} alt="Me" className="w-12 h-12 rounded-full cursor-pointer" />
              <button className="flex-1 bg-bg hover:bg-[#ebebeb] text-left px-4 py-3 rounded-full text-sm text-secondary font-medium transition-colors border border-transparent hover:border-border">
                Start a post
              </button>
            </div>
            <div className="flex flex-wrap justify-between items-center mt-3 px-2 sm:px-6">
              {[
                { icon: Image, text: "Media", color: "text-blue-500" },
                { icon: Video, text: "Video", color: "text-green-600" },
                { icon: Calendar, text: "Event", color: "text-orange-500" },
                { icon: FileText, text: "Write article", color: "text-red-500", hiddenOnMobile: true }
              ].map((btn, i) => (
                <button key={i} className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md hover:bg-bg transition-colors ${btn.hiddenOnMobile ? 'hidden sm:flex' : 'flex'}`}>
                  <btn.icon className={`w-5 h-5 ${btn.color}`} />
                  <span className="text-sm font-medium text-secondary">{btn.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feed Sorter */}
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-xs text-secondary">Sort by: <span className="font-semibold text-primary cursor-pointer">Top ▼</span></span>
          </div>

          {/* Posts list */}
          <div className="flex flex-col space-y-4">
            {MOCK_POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>

        {/* Right Sidebar - Trending/News */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-surface rounded-lg shadow-sm border border-border p-4 sticky top-20">
            <h2 className="font-semibold text-primary mb-4">LinkedIn News</h2>
            <ul className="space-y-4">
              {[
                { title: "Tech hiring rebounds in Q1", time: "Top news • 10,234 readers" },
                { title: "The rise of AI in ATS systems", time: "1d ago • 5,432 readers" },
                { title: "Remote work: 2026 trends", time: "2d ago • 14,320 readers" },
                { title: "Top skills for frontend devs", time: "14h ago • 8,901 readers" },
                { title: "How to ace your next interview", time: "3d ago • 2,100 readers" }
              ].map((news, i) => (
                <li key={i} className="group cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0 group-hover:bg-accent transition-colors"></div>
                    <div>
                      <h3 className="text-sm font-semibold text-primary group-hover:text-accent transition-colors line-clamp-1">
                        {news.title}
                      </h3>
                      <p className="text-xs text-secondary mt-0.5">{news.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button className="text-xs text-secondary font-medium mt-4 hover:text-primary flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-bg">
              Show more ▼
            </button>
          </div>
        </aside>

      </div>
    </LinkedInLayout>
  );
}
