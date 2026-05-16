import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { users } from "../../services/api";

export default function CandidateProfileEdit() {
  const [profile, setProfile] = useState({ fullName: "", headline: "", location: "", bio: "", facebook: "", linkedin: "", github: "" });
  const [skillsInput, setSkillsInput] = useState("");
  const [skills, setSkills] = useState(["React", "Node.js"]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await users.getPreference("candidate-profile");
        const value = response?.data?.data || {};
        if (value.profile && typeof value.profile === "object") {
          setProfile((prev) => ({ ...prev, ...value.profile }));
        }
        if (Array.isArray(value.skills)) {
          setSkills(value.skills);
        }
      } catch (error) {
        void error;
      }
    };
    load();
  }, []);

  const addSkill = () => {
    const value = skillsInput.trim();
    if (!value || skills.includes(value)) return;
    setSkills((prev) => [...prev, value]);
    setSkillsInput("");
  };

  const removeSkill = (skill) => setSkills((prev) => prev.filter((item) => item !== skill));

  const saveProfile = async () => {
    try {
      await users.savePreference("candidate-profile", { profile, skills });
      toast.success("Profile changes saved.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save profile.");
    }
  };

  return (
    <form className="space-y-6">
      <section className="border border-border rounded-xl p-4 space-y-3">
        <h2 className="font-head text-lg font-semibold text-dark">Personal Info</h2>
        <input value={profile.fullName} onChange={(event) => setProfile((prev) => ({ ...prev, fullName: event.target.value }))} placeholder="Full Name" className="w-full border border-border rounded-lg px-3 py-2.5" />
        <input value={profile.headline} onChange={(event) => setProfile((prev) => ({ ...prev, headline: event.target.value }))} placeholder="Headline" className="w-full border border-border rounded-lg px-3 py-2.5" />
        <input value={profile.location} onChange={(event) => setProfile((prev) => ({ ...prev, location: event.target.value }))} placeholder="Location" className="w-full border border-border rounded-lg px-3 py-2.5" />
        <textarea value={profile.bio} onChange={(event) => setProfile((prev) => ({ ...prev, bio: event.target.value }))} placeholder="Bio" className="w-full border border-border rounded-lg px-3 py-2.5" rows={4} />
      </section>

      <section className="border border-border rounded-xl p-4 space-y-3">
        <h2 className="font-head text-lg font-semibold text-dark">Social Links</h2>
        <input value={profile.facebook} onChange={(event) => setProfile((prev) => ({ ...prev, facebook: event.target.value }))} placeholder="Facebook URL" className="w-full border border-border rounded-lg px-3 py-2.5" />
        <input value={profile.linkedin} onChange={(event) => setProfile((prev) => ({ ...prev, linkedin: event.target.value }))} placeholder="LinkedIn URL" className="w-full border border-border rounded-lg px-3 py-2.5" />
        <input value={profile.github} onChange={(event) => setProfile((prev) => ({ ...prev, github: event.target.value }))} placeholder="GitHub URL" className="w-full border border-border rounded-lg px-3 py-2.5" />
      </section>

      <section className="border border-border rounded-xl p-4 space-y-3">
        <h2 className="font-head text-lg font-semibold text-dark">Skills</h2>
        <div className="flex gap-2">
          <input value={skillsInput} onChange={(event) => setSkillsInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), addSkill())} placeholder="Type skill and press Enter" className="w-full border border-border rounded-lg px-3 py-2.5" />
          <button type="button" onClick={addSkill} className="btn btn-secondary px-3">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button type="button" key={skill} onClick={() => removeSkill(skill)} className="px-2.5 py-1 bg-primary-light text-primary rounded-md text-xs">
              {skill} ×
            </button>
          ))}
        </div>
      </section>

      <button type="button" onClick={saveProfile} className="btn btn-primary px-5 py-2.5">Save Changes</button>
    </form>
  );
}
