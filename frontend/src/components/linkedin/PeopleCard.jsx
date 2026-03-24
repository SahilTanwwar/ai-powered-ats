import React, { useState } from "react";
import { UserPlus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function PeopleCard({ person }) {
  const [connected, setConnected] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden flex flex-col"
    >
      {/* Banner */}
      <div className="h-16 bg-muted relative">
        {person.bannerImg ? (
          <img src={person.bannerImg} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-accent-light to-muted"></div>
        )}
      </div>

      {/* Avatar Container */}
      <div className="px-4 relative mb-2 flex justify-center sm:justify-start">
        <Link to={`/profile/${person.id}`}>
          <img
            src={person.avatar}
            alt={person.name}
            className="w-20 h-20 rounded-full border-4 border-surface -mt-10 object-cover bg-bg hover:shadow-md transition-shadow"
          />
        </Link>
      </div>

      {/* Info */}
      <div className="px-4 flex-1 text-center sm:text-left">
        <Link to={`/profile/${person.id}`} className="block group">
          <h3 className="font-semibold text-primary truncate text-base group-hover:underline">
            {person.name}
          </h3>
          <p className="text-xs text-secondary truncate mt-0.5" title={person.headline}>
            {person.headline}
          </p>
        </Link>
        <p className="text-xs text-muted mt-2 flex items-center justify-center sm:justify-start gap-1">
          {person.mutualConnections > 0 ? (
            <>
              <UsersIcon className="w-3 h-3" />
              <span>{person.mutualConnections} mutual connections</span>
            </>
          ) : (
            <span className="invisible">No mutuals</span>
          )}
        </p>
      </div>

      {/* Action */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => setConnected(!connected)}
          className={`w-full py-1.5 px-4 rounded-full text-sm font-medium border flex items-center justify-center gap-2 transition-all ${
            connected
              ? "border-secondary text-secondary hover:bg-bg"
              : "border-accent text-accent hover:bg-accent hover:text-white"
          }`}
        >
          {connected ? (
            <>
              <Check className="w-4 h-4" /> Pending
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Connect
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
