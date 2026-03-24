import React from "react";
import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function StoryBar() {
  const { user } = useAuth();
  const derivedName = user?.email ? user.email.split('@')[0] : "Me";
  const derivedAvatar = `https://ui-avatars.com/api/?name=${derivedName}&background=6366f1&color=fff`;

  const stories = [
    { id: 1, name: "Me", avatar: derivedAvatar, isAdd: true },
    { id: 2, name: "Jane Doe", avatar: "https://i.pravatar.cc/150?img=1", hasSeen: false },
    { id: 3, name: "John Smith", avatar: "https://i.pravatar.cc/150?img=2", hasSeen: false },
    { id: 4, name: "Alice J.", avatar: "https://i.pravatar.cc/150?img=3", hasSeen: true },
    { id: 5, name: "Bob W.", avatar: "https://i.pravatar.cc/150?img=4", hasSeen: true },
    { id: 6, name: "Charlie", avatar: "https://i.pravatar.cc/150?img=5", hasSeen: false },
  ];

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-border p-4 mb-4" style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group">
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full p-0.5 ${
                  story.isAdd
                    ? "border-2 border-transparent"
                    : story.hasSeen
                    ? "border-2 border-border"
                    : "border-2 border-accent"
                }`}
              >
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-full h-full rounded-full object-cover bg-bg group-hover:opacity-90 transition-opacity"
                />
              </div>
              {story.isAdd && (
                <div className="absolute bottom-0 right-0 bg-accent text-white rounded-full p-0.5 border-2 border-surface">
                  <Plus className="w-4 h-4" />
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-secondary group-hover:text-primary transition-colors">
              {story.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
