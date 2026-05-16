import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { users } from "../../services/api";

export default function CandidateResume() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await users.getMyResume();
        setResumeFile(response?.data?.data || null);
      } catch (error) {
        void error;
      }
    };
    load();
  }, []);

  const downloadResume = () => {
    if (!resumeFile) return;
    window.open(resumeFile.url, "_blank", "noopener,noreferrer");
  };

  const uploadResume = async () => {
    if (!selectedFile) {
      toast.error("Select a resume file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      const response = await users.uploadMyResume(formData);
      setResumeFile(response?.data?.data || null);
      setSelectedFile(null);
      toast.success("Resume uploaded.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload resume.");
    }
  };

  const deleteResume = async () => {
    try {
      await users.deleteMyResume();
      setResumeFile(null);
      toast.success("Resume deleted.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete resume.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="upload-zone">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
          className="w-full"
        />
        <p className="text-sm text-secondary mt-2">Max file size: 5MB</p>
        <button type="button" onClick={uploadResume} className="btn btn-primary mt-3 px-4 py-2">Upload Resume</button>
      </div>

      {resumeFile && (
        <div className="border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-medium text-dark">{resumeFile.name}</p>
            <p className="text-xs text-secondary">{((resumeFile.size || 0) / 1024).toFixed(1)} KB</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={downloadResume} className="btn btn-secondary px-4 py-2">Download</button>
            <button type="button" onClick={deleteResume} className="px-4 py-2 rounded border border-warning text-warning hover:bg-warning/10">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
