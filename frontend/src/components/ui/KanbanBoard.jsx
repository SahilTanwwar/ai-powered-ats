import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { User, Mail, Phone, MoreVertical } from "lucide-react";
import Badge from "./Badge";
import ScoreRing from "./ScoreRing";

// Sortable Candidate Card
function CandidateCard({ candidate, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="glass-card p-4 mb-3 cursor-grab active:cursor-grabbing hover:shadow-glow focus:outline-none"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {candidate.name?.charAt(0) || "?"}
          </div>
          <div className="flex-1">
            <h4
              className="font-semibold text-slate-900 text-sm hover:text-blue-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(candidate);
              }}
            >
              {candidate.name}
            </h4>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Mail size={10} /> {candidate.email}
            </p>
          </div>
        </div>
        <ScoreRing score={candidate.atsScore || candidate.hybridScore || 0} size={40} strokeWidth={4} />
      </div>

      {candidate.matchedSkills && candidate.matchedSkills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {candidate.matchedSkills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium"
            >
              {skill}
            </span>
          ))}
          {candidate.matchedSkills.length > 3 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md font-medium">
              +{candidate.matchedSkills.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Kanban Column
function KanbanColumn({ status, candidates, onCandidateClick }) {
  const statusConfig = {
    APPLIED: {
      label: "Applied",
      color: "bg-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    SHORTLISTED: {
      label: "Shortlisted",
      color: "bg-violet-500",
      bg: "bg-violet-50",
      border: "border-violet-200",
    },
    HIRED: {
      label: "Hired",
      color: "bg-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    REJECTED: {
      label: "Rejected",
      color: "bg-red-500",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  };

  const config = statusConfig[status] || statusConfig.APPLIED;
  const candidateIds = candidates.map((c) => c.id);

  return (
    <div className="flex flex-col h-full min-w-[300px]">
      {/* Column Header */}
      <div className={`flex items-center justify-between p-4 rounded-t-2xl border-b border-white/40 shadow-sm backdrop-blur-md ${config.bg.replace('50', '50/70')} `}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${config.color}`} />
          <span className="font-semibold text-slate-900">{config.label}</span>
          <span className="px-2 py-0.5 bg-white/80 rounded-full text-xs font-medium text-slate-600 shadow-sm">
            {candidates.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-4 bg-white/30 backdrop-blur-sm rounded-b-2xl overflow-y-auto border border-white/20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]" style={{ minHeight: "500px" }}>
        <SortableContext items={candidateIds} strategy={verticalListSortingStrategy}>
          {candidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <User size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No candidates here</p>
            </div>
          ) : (
            candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onClick={onCandidateClick}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}

// Main Kanban Board
export default function KanbanBoard({ candidates, onStatusChange, onCandidateClick }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group candidates by status
  const groupedCandidates = {
    APPLIED: candidates.filter((c) => c.status === "APPLIED"),
    SHORTLISTED: candidates.filter((c) => c.status === "SHORTLISTED"),
    HIRED: candidates.filter((c) => c.status === "HIRED"),
    REJECTED: candidates.filter((c) => c.status === "REJECTED"),
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    // If dragging over a column (not a candidate card)
    if (over.id && typeof over.id === "string" && ["APPLIED", "SHORTLISTED", "HIRED", "REJECTED"].includes(over.id)) {
      return;
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Find which column the candidate was dropped in
    const newStatus = Object.keys(groupedCandidates).find((status) =>
      groupedCandidates[status].some((c) => c.id === over.id)
    );

    // Or if dropped directly on a status column
    const directStatus = ["APPLIED", "SHORTLISTED", "HIRED", "REJECTED"].find(
      (s) => s === over.id
    );

    const targetStatus = directStatus || newStatus;

    if (targetStatus && active.id !== over.id) {
      const candidate = candidates.find((c) => c.id === active.id);
      if (candidate && candidate.status !== targetStatus) {
        onStatusChange(candidate.id, targetStatus);
      }
    }
  };

  const activeCandidate = activeId
    ? candidates.find((c) => c.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Object.keys(groupedCandidates).map((status) => (
          <div key={status} className="flex-shrink-0">
            <SortableContext
              id={status}
              items={groupedCandidates[status].map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                status={status}
                candidates={groupedCandidates[status]}
                onCandidateClick={onCandidateClick}
              />
            </SortableContext>
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeCandidate ? (
          <div className="bg-white rounded-lg border-2 border-blue-400 p-4 shadow-xl opacity-90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {activeCandidate.name?.charAt(0) || "?"}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">
                  {activeCandidate.name}
                </h4>
                <p className="text-xs text-slate-400">{activeCandidate.email}</p>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
