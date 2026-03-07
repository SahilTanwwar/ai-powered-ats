const { CandidateNote, Candidate, Job, User } = require("../models");

const getNotes = async (req, res) => {
    try {
        const { candidateId } = req.params;

        const candidate = await Candidate.findByPk(candidateId, {
            include: [{ model: Job, as: "Job", attributes: ["userId"] }],
        });

        if (!candidate) return res.status(404).json({ message: "Candidate not found" });

        // Access control: if recruiter, they must own the job
        if (req.user.role === "RECRUITER" && candidate.Job.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const notes = await CandidateNote.findAll({
            where: { candidateId },
            include: [
                {
                    model: User,
                    as: "author",
                    attributes: ["id", "email"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return res.json({ success: true, data: notes });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const createNote = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: "Content is required" });
        }

        const candidate = await Candidate.findByPk(candidateId, {
            include: [{ model: Job, as: "Job", attributes: ["userId"] }],
        });

        if (!candidate) return res.status(404).json({ message: "Candidate not found" });

        if (req.user.role === "RECRUITER" && candidate.Job.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const note = await CandidateNote.create({
            candidateId,
            userId: req.user.id,
            content,
        });

        const fullNote = await CandidateNote.findByPk(note.id, {
            include: [{ model: User, as: "author", attributes: ["id", "email"] }],
        });

        return res.status(201).json({ success: true, data: fullNote });
    } catch (error) {
        console.error("Error creating note:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const deleteNote = async (req, res) => {
    try {
        const { candidateId, noteId } = req.params;

        const note = await CandidateNote.findOne({
            where: { id: noteId, candidateId },
        });

        if (!note) return res.status(404).json({ message: "Note not found" });

        // Only the author or ADMIN can delete a note
        if (req.user.role !== "ADMIN" && note.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await note.destroy();

        return res.json({ success: true, message: "Note deleted" });
    } catch (error) {
        console.error("Error deleting note:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getNotes,
    createNote,
    deleteNote,
};
