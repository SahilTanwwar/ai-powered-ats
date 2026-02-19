import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import AppLayout from "../layout/AppLayout";
import { Card, Btn, Icon, PageWrap } from "../components/UI";
import { T } from "../theme";

export function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppLayout title="Settings">
      <PageWrap>
        <div style={{ maxWidth: 560 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: T.text, letterSpacing: -0.4, marginBottom: 3 }}>Settings</h2>
            <p style={{ fontSize: 13, color: T.textLight }}>Manage your account and workspace preferences.</p>
          </div>

          {/* Profile */}
          <Card style={{ padding: "24px", marginBottom: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: T.text, marginBottom: 18, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>Profile</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#C8F135,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: "#fff" }}>
                {user?.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 3 }}>{user?.email?.split("@")[0]}</div>
                <div style={{ fontSize: 13, color: T.textLight }}>{user?.email}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, padding: "14px 16px", background: T.bg, borderRadius: T.r10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, color: T.textLight, fontWeight: 600, marginBottom: 2 }}>Role</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{user?.role}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, color: T.textLight, fontWeight: 600, marginBottom: 2 }}>User ID</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{user?.id}</div>
              </div>
            </div>
          </Card>

          {/* AI Config */}
          <Card style={{ padding: "24px", marginBottom: 16 }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: T.text, marginBottom: 18, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>AI Configuration</div>
            {[
              { label: "Scoring Model", val: "Gemini + Hybrid Scoring" },
              { label: "Skills Weight", val: "50%" },
              { label: "Semantic Weight", val: "30%" },
              { label: "Experience Weight", val: "20%" },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 13.5, color: T.textMid, fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 13.5, color: T.text, fontWeight: 700 }}>{val}</span>
              </div>
            ))}
            <div style={{ marginTop: 14, padding: "12px 14px", background: T.limeSoft, borderRadius: T.r10, fontSize: 12.5, color: "#3a4a0a", fontWeight: 500 }}>
              ✨ Auto-shortlist candidates with score ≥ 80 · Auto-reject below 40
            </div>
          </Card>

          {/* Danger */}
          <Card style={{ padding: "24px", border: `1px solid ${T.danger}30` }}>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: T.danger, marginBottom: 14 }}>Danger Zone</div>
            <p style={{ fontSize: 13, color: T.textLight, marginBottom: 16 }}>Sign out of your account on this device.</p>
            <Btn variant="danger" icon={<Icon.Logout />} onClick={() => { logout(); navigate("/login"); }}>Sign Out</Btn>
          </Card>
        </div>
      </PageWrap>
    </AppLayout>
  );
}

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center" }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: T.text, letterSpacing: -4, marginBottom: 12 }}>404</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 8 }}>Page not found</div>
        <p style={{ fontSize: 14, color: T.textLight, marginBottom: 28 }}>The page you're looking for doesn't exist.</p>
        <Btn variant="primary" onClick={() => navigate("/dashboard")}>Go to Dashboard</Btn>
      </motion.div>
    </div>
  );
}
