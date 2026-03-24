import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { LinkedInLayout } from "../layout/LinkedInLayout";
import { PostCard } from "../components/linkedin/PostCard";
import { Edit2, Plus, ArrowRight, Briefcase, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const isMe = id === "me" || !id;
  const [isFollowing, setIsFollowing] = useState(false);

  const derivedName = user?.email ? user.email.split('@')[0] : "Current User";
  const derivedAvatar = `https://ui-avatars.com/api/?name=${derivedName}&background=6366f1&color=fff`;

  // Mock static data
  const profile = {
    name: isMe ? derivedName : "Alex Developer",
    headline: "Senior Frontend Engineer | React | Node.js | Building AI-Powered ATS",
    location: "San Francisco Bay Area",
    connections: "500+",
    avatar: isMe ? derivedAvatar : "https://ui-avatars.com/api/?name=Alex+Dev&background=6366f1&color=fff",
    bannerImg: "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=1500",
    about: "Passionate software engineer with 5+ years of experience building scalable web applications. Currently focused on AI-powered tools and modern frontend architectures using React, Next.js, and Tailwind CSS. Always eager to learn new technologies and collaborate with brilliant minds.",
    experience: [
      {
        id: 1,
        title: "Senior Software Engineer",
        company: "TechNova Inc.",
        logo: "https://ui-avatars.com/api/?name=TN&background=333&color=fff",
        date: "Jan 2024 - Present",
        duration: "3 mos",
        description: "Leading the frontend development of an AI-powered applicant tracking system. Mentoring junior developers and establishing best practices for code quality and testing.",
      },
      {
        id: 2,
        title: "Software Engineer",
        company: "WebSolutions LLC",
        logo: "https://ui-avatars.com/api/?name=WS&background=0088cc&color=fff",
        date: "Jun 2021 - Dec 2023",
        duration: "2 yrs 7 mos",
        description: "Developed and maintained multiple enterprise web applications. Improved application performance by 40% through code splitting and optimized rendering.",
      }
    ],
    skills: [
      { name: "React.js", endorsements: 42 },
      { name: "JavaScript", endorsements: 38 },
      { name: "Tailwind CSS", endorsements: 25 },
      { name: "Node.js", endorsements: 19 },
      { name: "Next.js", endorsements: 15 },
    ]
  };

  return (
    <LinkedInLayout>
      <div className="flex flex-col lg:flex-row gap-6 justify-center">
        
        {/* Main Content (Center) */}
        <main className="flex-1 max-w-3xl min-w-0">
          
          {/* Top Profile Card */}
          <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden mb-4 pb-4">
            {/* Banner */}
            <div className="h-48 relative bg-muted">
              {profile.bannerImg && (
                <img src={profile.bannerImg} alt="Banner" className="w-full h-full object-cover" />
              )}
              {isMe && (
                <button className="absolute top-4 right-4 bg-surface p-2 rounded-full text-secondary hover:text-primary shadow-sm hover:bg-bg transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Top Section */}
            <div className="px-6 relative">
              <div className="flex justify-between items-start">
                {/* Avatar */}
                <div className="w-36 h-36 rounded-full border-4 border-surface bg-bg -mt-16 relative hover:shadow-lg transition-shadow">
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                  {isMe && (
                    <button className="absolute bottom-1 right-1 bg-surface p-2 rounded-full shadow border border-border text-secondary hover:text-primary">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {/* Edit Btn if Me */}
                {isMe && (
                  <button className="mt-4 p-2 rounded-full text-secondary hover:bg-bg hover:text-primary transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="mt-4 md:flex justify-between items-start">
                <div className="flex-1 max-w-xl">
                  <h1 className="text-2xl font-bold text-primary">{profile.name}</h1>
                  <p className="text-base text-primary mt-1">{profile.headline}</p>
                  <p className="text-sm text-secondary mt-1">{profile.location} • <span className="text-accent font-semibold hover:underline cursor-pointer">Contact info</span></p>
                  <p className="text-sm font-semibold text-accent mt-2 hover:underline cursor-pointer">
                    {profile.connections} connections
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-4 max-w-[200px]">
                  <span className="flex items-center gap-2 text-sm text-primary font-semibold hover:text-accent hover:underline mb-2 cursor-pointer">
                    <Briefcase className="w-4 h-4" /> TechNova Inc.
                  </span>
                  <span className="flex items-center gap-2 text-sm text-primary font-semibold hover:text-accent hover:underline cursor-pointer">
                    <GraduationCap className="w-4 h-4" /> University of Technology
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {isMe ? (
                  <>
                    <button className="px-4 py-1.5 rounded-full bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-colors">
                      Open to
                    </button>
                    <button className="px-4 py-1.5 rounded-full border border-accent text-accent font-semibold text-sm hover:bg-accent/10 transition-colors">
                      Add profile section
                    </button>
                    <button className="px-4 py-1.5 rounded-full border border-secondary text-secondary font-semibold text-sm hover:bg-border transition-colors">
                      More
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-colors ${
                        isFollowing
                          ? "border border-secondary text-secondary hover:bg-border bg-surface"
                          : "bg-accent text-white hover:bg-accent-hover"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                    <button className="px-4 py-1.5 rounded-full border border-accent text-accent font-semibold text-sm hover:bg-accent/10 transition-colors">
                      Message
                    </button>
                    <button className="px-4 py-1.5 rounded-full border border-secondary text-secondary font-semibold text-sm hover:bg-border transition-colors">
                      More
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-surface rounded-lg shadow-sm border border-border p-6 mb-4 relative">
            <h2 className="text-xl font-semibold text-primary mb-2">About</h2>
            {isMe && (
              <button className="absolute top-6 right-6 p-2 rounded-full text-secondary hover:bg-bg hover:text-primary transition-colors">
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            <p className="text-sm text-primary leading-relaxed whitespace-pre-line">
              {profile.about}
            </p>
          </div>

          {/* Experience Section */}
          <div className="bg-surface rounded-lg shadow-sm border border-border p-6 mb-4 relative">
            <h2 className="text-xl font-semibold text-primary mb-4">Experience</h2>
            {isMe && (
              <div className="absolute top-6 right-6 flex gap-2">
                <button className="p-2 rounded-full text-secondary hover:bg-bg hover:text-primary transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full text-secondary hover:bg-bg hover:text-primary transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            )}
            
            <div className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={exp.id}>
                  <div className="flex gap-4">
                    <img src={exp.logo} alt={exp.company} className="w-12 h-12 object-cover rounded shadow-sm" />
                    <div>
                      <h3 className="text-base font-semibold text-primary">{exp.title}</h3>
                      <p className="text-sm text-primary">{exp.company}</p>
                      <p className="text-sm text-secondary">{exp.date} · {exp.duration}</p>
                      <p className="text-sm text-primary mt-2">{exp.description}</p>
                    </div>
                  </div>
                  {index < profile.experience.length - 1 && (
                    <div className="h-px bg-border my-6 ml-16"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-surface rounded-lg shadow-sm border border-border p-6 mb-4 relative">
            <h2 className="text-xl font-semibold text-primary mb-4">Skills</h2>
             {isMe && (
              <div className="absolute top-6 right-6 flex gap-2">
                <button className="p-2 rounded-full text-secondary hover:bg-bg hover:text-primary transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full text-secondary hover:bg-bg hover:text-primary transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="space-y-4">
              {profile.skills.map((skill, index) => (
                <div key={index}>
                  <h3 className="text-sm font-semibold text-primary">{skill.name}</h3>
                  <div className="flex items-center gap-2 mt-1 -ml-1">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold border border-surface z-10">
                        {skill.endorsements}
                      </div>
                      <img src="https://i.pravatar.cc/150?img=1" className="w-6 h-6 rounded-full border border-surface" />
                      <img src="https://i.pravatar.cc/150?img=2" className="w-6 h-6 rounded-full border border-surface" />
                    </div>
                    <span className="text-xs text-secondary">endorsements</span>
                  </div>
                  {index < profile.skills.length - 1 && (
                     <div className="h-px bg-border my-4"></div>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border-t border-border text-secondary font-semibold hover:bg-bg transition-colors flex items-center justify-center gap-1 rounded-b-lg -mx-6 px-6 -mb-6 pb-4 pt-4">
              Show all skills <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          {/* People Also Viewed */}
          <div className="bg-surface rounded-lg shadow-sm border border-border p-4 sticky top-20">
            <h2 className="font-semibold text-primary mb-4">People also viewed</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-2">
                  <img src={`https://i.pravatar.cc/150?img=${i+20}`} alt="Person" className="w-12 h-12 rounded-full cursor-pointer hover:shadow transition-shadow" />
                  <div>
                    <h3 className="text-sm font-semibold text-primary hover:underline cursor-pointer group-hover:text-accent">Recruiter {i}</h3>
                    <p className="text-xs text-secondary line-clamp-2">Talent Acquisition Specialist at BigCompany</p>
                    <button className="mt-1 px-3 py-1 rounded-full border border-secondary text-secondary font-semibold text-xs hover:bg-border transition-colors">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </LinkedInLayout>
  );
}
