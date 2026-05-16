import React, { useState, useEffect } from "react";
import { LinkedInLayout } from "../layout/LinkedInLayout";
import { PeopleCard } from "../components/linkedin/PeopleCard";
import { Users, UserPlus, Hash, FileText, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MOCK_PEOPLE = [
  {
    id: "p1",
    name: "Michael Chen",
    headline: "Recruiter at TechFlow | Looking for Frontend Devs",
    avatar: "https://i.pravatar.cc/150?img=11",
    mutualConnections: 12,
  },
  {
    id: "p2",
    name: "Sarah Williams",
    headline: "Senior Software Engineer | Ex-Google",
    avatar: "https://i.pravatar.cc/150?img=12",
    bannerImg: "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=1000",
    mutualConnections: 45,
  },
  {
    id: "p3",
    name: "David Kim",
    headline: "Full Stack Developer (MERN)",
    avatar: "https://i.pravatar.cc/150?img=13",
    mutualConnections: 0,
  },
  {
    id: "p4",
    name: "Emily Davis",
    headline: "UI/UX Designer building intuitive web apps",
    avatar: "https://i.pravatar.cc/150?img=14",
    mutualConnections: 3,
  },
  {
    id: "p5",
    name: "Alex Rodriguez",
    headline: "CTO at StartupX | Hiring Engineers!",
    avatar: "https://i.pravatar.cc/150?img=15",
    mutualConnections: 18,
  },
  {
    id: "p6",
    name: "Lisa Wong",
    headline: "Frontend Architect",
    avatar: "https://i.pravatar.cc/150?img=16",
    mutualConnections: 8,
  },
  {
    id: "p7",
    name: "James Smith",
    headline: "Engineering Manager",
    avatar: "https://i.pravatar.cc/150?img=17",
    mutualConnections: 21,
  },
  {
    id: "p8",
    name: "Jessica Taylor",
    headline: "React Developer",
    avatar: "https://i.pravatar.cc/150?img=18",
    mutualConnections: 5,
  }
];

export default function Network() {
  const { token, user } = useAuth();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiBase}/users/public`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        
        // Map backend users to UI format, exclude current user
        const mappedUsers = (json.data || [])
          .filter(u => u.id !== user?.id)
          .map(u => ({
            id: u.id,
            name: u.email.split('@')[0],
            headline: u.role === "RECRUITER" ? "Talent Acquisition Specialist" : "User",
            avatar: `https://ui-avatars.com/api/?name=${u.email.split('@')[0]}&background=random&color=fff`,
            mutualConnections: Math.floor(Math.random() * 50), // mock
          }));
        
        setPeople(mappedUsers.length > 0 ? mappedUsers : MOCK_PEOPLE);
      } catch (err) {
        console.error(err);
        setPeople(MOCK_PEOPLE);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUsers();
  }, [token, user]);
  return (
    <LinkedInLayout>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        
        {/* Left Sidebar */}
        <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0">
          <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden sticky top-20">
            <h2 className="px-4 py-3 font-semibold text-primary border-b border-border">Manage my network</h2>
            <ul className="py-2">
              {[
                { icon: Users, text: "Connections", count: "521" },
                { icon: UserPlus, text: "Following & followers" },
                { icon: Users, text: "Groups" },
                { icon: FileText, text: "Events" },
                { icon: FileText, text: "Pages" },
                { icon: FileText, text: "Newsletters" },
                { icon: Hash, text: "Hashtags" }
              ].map((item, i) => (
                <li key={i} className="px-4 py-2 hover:bg-bg cursor-pointer flex items-center justify-between text-secondary transition-colors group">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
                    <span className="text-sm p-1 text-secondary group-hover:text-primary transition-colors">{item.text}</span>
                  </div>
                  {item.count && <span className="text-sm font-medium text-secondary">{item.count}</span>}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl">
          
          {/* Pending Invitations */}
          <div className="bg-surface rounded-lg shadow-sm border border-border p-4 mb-4 flex items-center justify-between group cursor-pointer hover:shadow-md transition-shadow">
            <h2 className="text-base text-primary">Invitations</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-accent group-hover:underline">Manage (3)</span>
            </div>
          </div>

          {/* People you may know */}
          <div className="bg-surface rounded-lg shadow-sm border border-border py-4 px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-primary">People you may know</h2>
              <span className="text-sm font-semibold text-secondary hover:bg-bg px-2 py-1 rounded cursor-pointer transition-colors">See all</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {loading ? (
                <div className="col-span-full flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : (
                people.map((person) => (
                  <PeopleCard key={person.id} person={person} />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </LinkedInLayout>
  );
}
