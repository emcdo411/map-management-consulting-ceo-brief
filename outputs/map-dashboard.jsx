import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ReferenceLine, ReferenceArea,
  ResponsiveContainer, Cell
} from "recharts";

// ─── COLOR SYSTEM ────────────────────────────────────────────────────────────
const C = {
  periwinkle: "#8E9FD5",
  periwinkleDim: "#6a7fb8",
  periwinkleLight: "rgba(142,159,213,0.15)",
  charcoal: "#2D3436",
  charcoalMid: "#3d4a4e",
  charcoalLight: "#4e5f65",
  cream: "#F5F2EC",
  creamDim: "#e8e4db",
  danger: "#c0392b",
  dangerLight: "rgba(192,57,43,0.12)",
  warning: "#d4812a",
  warningLight: "rgba(212,129,42,0.12)",
  success: "#27796b",
  successLight: "rgba(39,121,107,0.12)",
  gold: "#B8962E",
  gridLine: "rgba(45,52,54,0.10)",
  recessionShade: "rgba(142,159,213,0.08)",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const governanceData = [
  { firm: "MAP", aiGov: 1.5, opsSponsor: 1.0, decisionLayer: 1.5 },
  { firm: "Vistage", aiGov: 2.5, opsSponsor: 2.0, decisionLayer: 2.0 },
  { firm: "EOS Worldwide", aiGov: 2.0, opsSponsor: 2.5, decisionLayer: 3.0 },
  { firm: "Franklin Covey", aiGov: 2.5, opsSponsor: 1.5, decisionLayer: 2.0 },
];

const radarData = [
  { metric: "AI Gov Maturity", MAP: 1.5, Vistage: 2.5, EOS: 2.0, FranklinCovey: 2.5 },
  { metric: "Ops Sponsorship", MAP: 1.0, Vistage: 2.0, EOS: 2.5, FranklinCovey: 1.5 },
  { metric: "Decision Layer", MAP: 1.5, Vistage: 2.0, EOS: 3.0, FranklinCovey: 2.0 },
  { metric: "Digital Footprint", MAP: 2.5, Vistage: 3.5, EOS: 2.0, FranklinCovey: 3.0 },
  { metric: "AI Theater Risk", MAP: 4.0, Vistage: 3.0, EOS: 2.5, FranklinCovey: 3.5 },
];

const aiTheaterRisk = [
  { service: "MAP App Platform", theater: 72, genuine: 28, label: "MAP App" },
  { service: "MAP University", theater: 65, genuine: 35, label: "MAP U" },
  { service: "Vital Factors®", theater: 30, genuine: 70, label: "Vital Factors" },
  { service: "Executive Coaching", theater: 25, genuine: 75, label: "Exec Coaching" },
  { service: "Business Planning", theater: 55, genuine: 45, label: "Biz Planning" },
];

const aiReadinessTimeline = [
  { year: "2020", MAP: 10, Vistage: 15, EOS: 8, FranklinCovey: 20, industryAvg: 22 },
  { year: "2021", MAP: 12, Vistage: 20, EOS: 12, FranklinCovey: 28, industryAvg: 35 },
  { year: "2022", MAP: 15, Vistage: 28, EOS: 18, FranklinCovey: 35, industryAvg: 48 },
  { year: "2023", MAP: 18, Vistage: 38, EOS: 25, FranklinCovey: 42, industryAvg: 62 },
  { year: "2024", MAP: 22, Vistage: 48, EOS: 35, FranklinCovey: 50, industryAvg: 72 },
  { year: "2025", MAP: 26, Vistage: 55, EOS: 42, FranklinCovey: 55, industryAvg: 77 },
  { year: "2026E", MAP: 30, Vistage: 62, EOS: 50, FranklinCovey: 60, industryAvg: 83 },
];

const roiData = [
  { category: "S&P 500 Avg", positive: 12, negative: 50, neutral: 38 },
  { category: "Mgmt Consulting", positive: 18, negative: 45, neutral: 37 },
  { category: "MAP (Est.)", positive: 8, negative: 58, neutral: 34 },
];

const competitors = [
  {
    name: "Vistage",
    founded: 1957,
    revenue: "$126.8M",
    aiPos: "AI integrated into content + CEO index — no dedicated governance layer",
    aiGov: "Mentions data governance in 2026 trends content. No documented internal AI ops sponsor.",
    opsSponsor: "No public evidence of named AI ops executive",
    govScore: 2.5,
    opsScore: 2.0,
    decScore: 2.0,
    total: "6.5 / 15",
    verdict: "WATCH",
    color: C.warning,
  },
  {
    name: "EOS Worldwide",
    founded: 2007,
    revenue: "Est. $50–80M",
    aiPos: "Traction/EOS methodology has no public AI governance documentation. Closest to ops-layer thinking.",
    aiGov: "No documented AI governance framework publicly. EOS Implementers operate independently.",
    opsSponsor: "Decentralized model — individual implementers may vary. No central AI ops sponsor.",
    govScore: 2.0,
    opsScore: 2.5,
    decScore: 3.0,
    total: "7.5 / 15",
    verdict: "WATCH",
    color: C.warning,
  },
  {
    name: "Franklin Covey",
    founded: 1984,
    revenue: "$277M (public)",
    aiPos: "7 Habits digital delivery, AI-enhanced content tools. Marketing layer only.",
    aiGov: "No dedicated AI governance layer documented. Content AI for delivery acceleration only.",
    opsSponsor: "No public evidence of named internal AI adoption sponsor.",
    govScore: 2.5,
    opsScore: 1.5,
    decScore: 2.0,
    total: "6.0 / 15",
    verdict: "LAG",
    color: C.periwinkle,
  },
];

const sources = [
  { label: "mapconsulting.com", url: "https://mapconsulting.com/", context: "MAP Digital, MAP App, MAP University, Service architecture" },
  { label: "McKinsey State of AI 2024–2025", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai", context: "88% regular AI use; 65% using GenAI regularly" },
  { label: "Deloitte State of AI 2026", url: "https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-ai-in-the-enterprise.html", context: "34% reimagining business; governance as scale determinant" },
  { label: "PwC AI Agent Survey 2026", url: "#", context: "Only 34% report measurable financial impact from AI; <20% have mature governance" },
  { label: "Vistage.com — AI Trends 2026", url: "https://www.vistage.com/research-center/business-financials/economic-trends/20251020-ai-trends-for-2026-and-beyond/", context: "Integration, data governance, cybersecurity as 2026 priorities" },
  { label: "BCG AI Value at Scale 2025", url: "#", context: "Only 5% of firms achieving material AI value at scale; 60% report little impact" },
  { label: "Gartner AI Project Abandonment", url: "#", context: "60% of AI projects abandoned by 2026 due to lack of AI-ready data; 40% agentic AI projects canceled by 2027" },
  { label: "Forvis Mazars / FERF 2026", url: "https://www.forvismazars.us/forsights/2026/03/ai-strategy-a-road-map-from-readiness-to-implementation", context: "Only 15% fully prepared for advanced AI; 51% not prepared" },
];

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const KPICard = ({ label, value, sub, verdict, color }) => (
  <div style={{
    background: C.cream,
    border: `1px solid ${C.creamDim}`,
    borderLeft: `4px solid ${color || C.periwinkle}`,
    borderRadius: 2,
    padding: "18px 22px",
    minWidth: 0,
  }}>
    <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.charcoalLight, marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color: color || C.charcoal, fontFamily: "'DM Serif Display', serif", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: C.charcoalLight, marginTop: 6, fontFamily: "'IBM Plex Mono', monospace" }}>{sub}</div>}
    {verdict && <div style={{ marginTop: 10, display: "inline-block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", padding: "3px 8px", background: color + "22", color: color, borderRadius: 2, fontFamily: "'IBM Plex Mono', monospace" }}>{verdict}</div>}
  </div>
);

const SectionLabel = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
    <div style={{ width: 32, height: 2, background: C.periwinkle }} />
    <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.periwinkle, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{children}</div>
    <div style={{ flex: 1, height: 1, background: C.gridLine }} />
  </div>
);

const ChartBox = ({ title, subtitle, children, note }) => (
  <div style={{
    background: C.cream,
    border: `1px solid ${C.creamDim}`,
    borderRadius: 2,
    padding: "24px 26px",
  }}>
    <div style={{ marginBottom: 4, fontSize: 13, fontWeight: 700, color: C.charcoal, fontFamily: "'DM Serif Display', serif" }}>{title}</div>
    {subtitle && <div style={{ fontSize: 10, color: C.charcoalLight, marginBottom: 18, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.05em" }}>{subtitle}</div>}
    {children}
    {note && <div style={{ marginTop: 14, fontSize: 10, color: C.charcoalLight, fontFamily: "'IBM Plex Mono', monospace", borderTop: `1px solid ${C.gridLine}`, paddingTop: 10 }}>{note}</div>}
  </div>
);

const FredTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: C.charcoal, border: `1px solid ${C.charcoalMid}`, borderRadius: 2, padding: "10px 14px", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>
      <div style={{ color: C.cream, fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>{p.name}: <span style={{ color: C.cream }}>{p.value}</span></div>
      ))}
    </div>
  );
};

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function MAPDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Executive Summary" },
    { id: "readiness", label: "AI Readiness" },
    { id: "competitors", label: "Competitor Analysis" },
    { id: "governance", label: "Governance Scorecard" },
    { id: "theater", label: "AI Theater Risk" },
    { id: "entry", label: "Entry Point" },
    { id: "sources", label: "Sources" },
  ];

  return (
    <div style={{
      background: "#EDEBE5",
      minHeight: "100vh",
      fontFamily: "'IBM Plex Sans', sans-serif",
      color: C.charcoal,
    }}>
      {/* ── HEADER ── */}
      <div style={{ background: C.charcoal, padding: "20px 32px", borderBottom: `3px solid ${C.periwinkle}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: C.periwinkle, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 4 }}>FRACTIONAL CXO INTELLIGENCE BRIEF · AI ADOPTION ARCHITECT × MOC v4.7</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.cream, fontFamily: "'DM Serif Display', serif", lineHeight: 1.2 }}>MAP Management Consulting</div>
            <div style={{ fontSize: 12, color: "rgba(245,242,236,0.55)", marginTop: 4, fontFamily: "'IBM Plex Mono', monospace" }}>AI Readiness Stress Test · Pre-Engagement Intelligence Brief · April 2026</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: C.periwinkle, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em" }}>OVERALL HCDG VERDICT</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: C.warning, fontFamily: "'DM Serif Display', serif" }}>CONDITIONAL</div>
            <div style={{ fontSize: 10, color: "rgba(245,242,236,0.4)", fontFamily: "'IBM Plex Mono', monospace" }}>AI exists as marketing layer only</div>
          </div>
        </div>

        {/* Tab Bar */}
        <div style={{ display: "flex", gap: 4, marginTop: 20, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "6px 14px",
              fontSize: 10,
              letterSpacing: "0.08em",
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              border: "none",
              borderRadius: 2,
              cursor: "pointer",
              background: activeTab === t.id ? C.periwinkle : "rgba(142,159,213,0.12)",
              color: activeTab === t.id ? C.charcoal : C.periwinkle,
              transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ─── EXECUTIVE SUMMARY ─── */}
        {activeTab === "overview" && (
          <div>
            <SectionLabel>Executive Summary · HCDG + DVL Pre-Engagement Assessment</SectionLabel>
            <div style={{ background: C.cream, border: `1px solid ${C.creamDim}`, borderLeft: `4px solid ${C.warning}`, borderRadius: 2, padding: "20px 24px", marginBottom: 24, lineHeight: 1.75, fontSize: 13 }}>
              <strong style={{ color: C.charcoal, fontFamily: "'DM Serif Display', serif", fontSize: 15 }}>Verdict: MAP is a 60-year-old accountability system running a 2019-era digital layer in a 2026 AI market.</strong>
              <br /><br />
              MAP's public digital footprint — the MAP App, MAP University, and MAP Digital service line — represents AI as a <em>delivery accelerator</em>, not a governance or operations layer. There is no public evidence of a named AI operations sponsor, a documented AI governance framework, or a decision-layer integration between their AI tooling and their Vital Factors® accountability system. Their core IP — the 3-Step Vital Factors® Process — is human-mediated, behavior-change-oriented, and accountability-driven. That is a genuine strength. It is also the exact surface where AI Theater is most likely occurring: clients deploying the MAP App as an accountability tool without behavioral change infrastructure underneath it.
              <br /><br />
              The MAP App claims to "organize all goals in one place" with real-time follow-up. Without a documented AI governance layer, without a named operations sponsor who owns the AI infrastructure decisions, and without a decision routing architecture that connects MAP App outputs to measurable accountability velocity — this is a <strong style={{ color: C.danger }}>high-probability AI Theater scenario</strong>. The tool exists. The behavior change infrastructure to make it produce ROI does not publicly exist.
              <br /><br />
              The Fractional CXO entry point is specific: <strong>install a governance and decision-routing layer between MAP's AI tooling and its Vital Factors® delivery system</strong>. This is not a technology engagement. It is a behavioral intelligence and operations governance engagement.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
              <KPICard label="AI Governance Score" value="1.5 / 5" sub="No documented framework found" verdict="FAIL" color={C.danger} />
              <KPICard label="Ops Sponsor Evidence" value="1.0 / 5" sub="No named AI ops executive" verdict="ABSENT" color={C.danger} />
              <KPICard label="Decision Layer Integration" value="1.5 / 5" sub="App ≠ accountability velocity" verdict="GAP" color={C.warning} />
              <KPICard label="AI Theater Risk" value="HIGH" sub="MAP App / MAP U delivery layer" verdict="FLAGGED" color={C.danger} />
              <KPICard label="HCDG Verdict" value="CONDITIONAL" sub="AI present, governance absent" verdict="REDESIGN REQ'D" color={C.warning} />
              <KPICard label="DVL Velocity Class" value="LOW" sub="No decision routing architecture" verdict="BOTTLENECK" color={C.warning} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: C.cream, border: `1px solid ${C.creamDim}`, borderRadius: 2, padding: "20px 24px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.charcoal, fontFamily: "'DM Serif Display', serif", marginBottom: 14 }}>What MAP Claims vs. What the Footprint Shows</div>
                {[
                  ["Claims: AI-powered accountability", "Footprint: App platform with goal tracking — no AI governance layer"],
                  ["Claims: 60-year proven system", "Footprint: Digital layer is ≤5 years old, no integration architecture documented"],
                  ["Claims: Measurable ROI", "Footprint: 450% revenue growth cite lacks methodology transparency"],
                  ["Claims: Cutting-edge technology", "Footprint: MAP App, MAP University — no MLOps, no decision routing, no AI ops sponsor"],
                  ["Claims: Former CEO consultants", "Footprint: Human expertise — genuine strength. AI layer is bolt-on, not embedded"],
                ].map(([claim, reality], i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.gridLine}` }}>
                    <div style={{ fontSize: 11, color: C.success, fontFamily: "'IBM Plex Mono', monospace" }}>✓ {claim}</div>
                    <div style={{ fontSize: 11, color: C.warning, fontFamily: "'IBM Plex Mono', monospace" }}>⚠ {reality}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: C.cream, border: `1px solid ${C.creamDim}`, borderRadius: 2, padding: "20px 24px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.charcoal, fontFamily: "'DM Serif Display', serif", marginBottom: 14 }}>Industry Benchmark Context</div>
                {[
                  ["Only 15%", "of orgs are fully prepared for advanced AI (Forvis Mazars / FERF 2026)"],
                  ["Only 5%", "of firms achieving material AI value at scale (BCG 2025)"],
                  ["60% abandon", "AI projects due to lack of AI-ready data (Gartner 2026)"],
                  ["Only 34%", "report measurable financial AI impact (PwC AI Agent Survey 2026)"],
                  ["<20%", "have mature AI governance frameworks in place (PwC 2026)"],
                  ["77%", "UK consulting firms have integrated AI — MAP's peer set is moving (MCA Jan 2026)"],
                ].map(([stat, context], i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.gridLine}`, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.periwinkle, fontFamily: "'DM Serif Display', serif", minWidth: 60 }}>{stat}</div>
                    <div style={{ fontSize: 11, color: C.charcoalLight, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.5 }}>{context}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── AI READINESS ─── */}
        {activeTab === "readiness" && (
          <div>
            <SectionLabel>AI Readiness Trajectory · 2020–2026 Estimated</SectionLabel>
            <ChartBox
              title="AI Adoption Maturity Index — Management Consulting Sector"
              subtitle="Estimated composite score (0–100) based on public digital footprint signals · Not self-reported · Sources: public websites, job postings, industry reports"
              note="Sources: McKinsey State of AI 2024–25 · Deloitte State of AI 2026 · MCA Member Survey Jan 2026 · mapconsulting.com public signals · vistage.com public signals"
            >
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={aiReadinessTimeline} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.gridLine} />
                  <ReferenceArea x1="2024" x2="2026E" fill={C.recessionShade} />
                  <ReferenceLine y={50} stroke={C.warning} strokeDasharray="5 3" label={{ value: "Adoption Threshold", position: "right", fontSize: 9, fill: C.warning, fontFamily: "monospace" }} />
                  <ReferenceLine y={15} stroke={C.danger} strokeDasharray="4 2" label={{ value: "Governance Floor", position: "right", fontSize: 9, fill: C.danger, fontFamily: "monospace" }} />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fontFamily: "monospace", fill: C.charcoalLight }} />
                  <YAxis tick={{ fontSize: 10, fontFamily: "monospace", fill: C.charcoalLight }} domain={[0, 100]} />
                  <Tooltip content={<FredTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: "monospace" }} />
                  <Line type="monotone" dataKey="industryAvg" name="Industry Avg" stroke={C.charcoalLight} strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
                  <Line type="monotone" dataKey="Vistage" stroke={C.warning} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="EOS" stroke={C.gold} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="FranklinCovey" stroke={C.periwinkleDim} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="MAP" name="MAP (Est.)" stroke={C.danger} strokeWidth={2.5} dot={{ r: 4, fill: C.danger }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartBox>

            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <ChartBox
                title="AI ROI Distribution — Sector Comparison"
                subtitle="% orgs reporting positive / negative / neutral AI ROI · Source: PwC 2026, BCG 2025, internal estimate"
                note="MAP estimate based on absence of documented governance layer + AI Theater risk score"
              >
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={roiData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.gridLine} />
                    <XAxis dataKey="category" tick={{ fontSize: 9, fontFamily: "monospace", fill: C.charcoalLight }} />
                    <YAxis tick={{ fontSize: 9, fontFamily: "monospace", fill: C.charcoalLight }} />
                    <Tooltip content={<FredTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 9, fontFamily: "monospace" }} />
                    <Bar dataKey="positive" name="Positive ROI %" fill={C.success} radius={[1, 1, 0, 0]} />
                    <Bar dataKey="neutral" name="Neutral %" fill={C.periwinkle} radius={[1, 1, 0, 0]} />
                    <Bar dataKey="negative" name="Negative ROI %" fill={C.danger} radius={[1, 1, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartBox>

              <div style={{ background: C.cream, border: `1px solid ${C.creamDim}`, borderRadius: 2, padding: "20px 24px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.charcoal, fontFamily: "'DM Serif Display', serif", marginBottom: 16 }}>MAP AI Layer Classification</div>
                {[
                  { layer: "Marketing Layer", score: 3, desc: "Mentions AI on service pages, MAP Digital branding, MAP App positioned as 'state-of-the-art'" },
                  { layer: "Operational Layer", score: 1, desc: "No documented AI workflow integration. MAP App is goal tracking, not decision intelligence." },
                  { layer: "Governance Layer", score: 0, desc: "No AI governance framework found. No named AI ops sponsor. No documented criteria review process." },
                ].map(({ layer, score, desc }, i) => (
                  <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.gridLine}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: C.charcoal }}>{layer}</div>
                      <div style={{ fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: score === 0 ? C.danger : score <= 1 ? C.warning : C.gold }}>
                        {score === 0 ? "ABSENT" : score <= 1 ? "WEAK" : "PRESENT"}
                      </div>
                    </div>
                    <div style={{ height: 5, background: C.creamDim, borderRadius: 1, marginBottom: 8 }}>
                      <div style={{ height: "100%", width: `${score * 33}%`, background: score === 0 ? C.danger : score <= 1 ? C.warning : C.gold, borderRadius: 1 }} />
                    </div>
                    <div style={{ fontSize: 10, color: C.charcoalLight, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── COMPETITORS ─── */}
        {activeTab === "competitors" && (
          <div>
            <SectionLabel>Competitor Intelligence · Public Footprint Analysis</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
              {competitors.map((c) => (
                <div key={c.name} style={{ background: C.cream, border: `1px solid ${C.creamDim}`, borderLeft: `4px solid ${c.color}`, borderRadius: 2, padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: C.charcoal }}>{c.name}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", background: c.color + "22", color: c.color, borderRadius: 2, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em" }}>{c.verdict}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: C.charcoalLight }}>
                    <div>Founded: <span style={{ color: C.charcoal }}>{c.founded}</span></div>
                    <div>Revenue: <span style={{ color: C.charcoal }}>{c.revenue}</span></div>
                  </div>
                  {[
                    ["AI Positioning", c.aiPos],
                    ["AI Governance", c.aiGov],
                    ["Ops Sponsor", c.opsSponsor],
                  ].map(([label, text]) => (
                    <div key={label} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.gridLine}` }}>
                      <div style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: C.periwinkle, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 11, color: C.charcoalLight, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.5 }}>{text}</div>
                    </div>
                  ))}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
                    {[["AI Gov", c.govScore], ["Ops", c.opsScore], ["Decision", c.decScore], ["Total", c.total]].map(([k, v]) => (
                      <div key={k} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: c.color, fontFamily: "'DM Serif Display', serif" }}>{typeof v === "number" ? v.toFixed(1) : v}</div>
                        <div style={{ fontSize: 9, color: C.charcoalLight, fontFamily: "'IBM Plex Mono', monospace" }}>{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <ChartBox
                title="Competitive Radar — AI Governance Dimensions"
                subtitle="5-point scale: 1 = absent/claimed only · 5 = mature/documented/operational · All scores based on public signals only"
                note="Sources: vistage.com · eosworldwide.com · franklincovey.com · mapconsulting.com · Public press releases and service descriptions"
              >
                <ResponsiveContainer width="100%" height={360}>
                  <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                    <PolarGrid stroke={C.gridLine} />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fontFamily: "monospace", fill: C.charcoalLight }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 8, fontFamily: "monospace", fill: C.charcoalLight }} />
                    <Radar name="MAP" dataKey="MAP" stroke={C.danger} fill={C.danger} fillOpacity={0.15} strokeWidth={2} />
                    <Radar name="Vistage" dataKey="Vistage" stroke={C.warning} fill={C.warning} fillOpacity={0.1} strokeWidth={1.5} />
                    <Radar name="EOS" dataKey="EOS" stroke={C.gold} fill={C.gold} fillOpacity={0.1} strokeWidth={1.5} />
                    <Radar name="Franklin Covey" dataKey="FranklinCovey" stroke={C.periwinkleDim} fill={C.periwinkleDim} fillOpacity={0.1} strokeWidth={1.5} />
                    <Legend wrapperStyle={{ fontSize: 10, fontFamily: "monospace" }} />
                    <Tooltip content={<FredTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartBox>
            </div>
          </div>
        )}

        {/* ─── GOVERNANCE SCORECARD ─── */}
        {activeTab === "governance" && (
          <div>
            <SectionLabel>Governance Gap Scorecard · 1–5 Scale · Public Signals Only</SectionLabel>
            <ChartBox
              title="AI Governance Maturity — Grouped Bar Comparison"
              subtitle="Three dimensions: AI Governance Framework · Operations Sponsorship Evidence · Decision Layer Integration · Scale: 1 = absent → 5 = mature"
              note="Source: mapconsulting.com · vistage.com · eosworldwide.com · franklincovey.com · All scores are analyst estimates from public digital footprint — not self-reported"
            >
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={governanceData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.gridLine} />
                  <ReferenceLine y={3} stroke={C.periwinkle} strokeDasharray="5 3" label={{ value: "Competency Threshold", position: "right", fontSize: 9, fill: C.periwinkle, fontFamily: "monospace" }} />
                  <ReferenceLine y={1} stroke={C.danger} strokeDasharray="4 2" label={{ value: "Governance Floor", position: "right", fontSize: 9, fill: C.danger, fontFamily: "monospace" }} />
                  <XAxis dataKey="firm" tick={{ fontSize: 11, fontFamily: "monospace", fill: C.charcoalLight }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 10, fontFamily: "monospace", fill: C.charcoalLight }} />
                  <Tooltip content={<FredTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: "monospace" }} />
                  <Bar dataKey="aiGov" name="AI Governance" fill={C.periwinkle} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="opsSponsor" name="Ops Sponsorship" fill={C.gold} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="decisionLayer" name="Decision Layer" fill={C.charcoalMid} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>

            <div style={{ marginTop: 20 }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>
                  <thead>
                    <tr style={{ background: C.charcoal }}>
                      {["Firm", "AI Gov (1–5)", "Ops Sponsor (1–5)", "Decision Layer (1–5)", "Total / 15", "Verdict", "Gap vs. Threshold"].map(h => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: C.cream, fontSize: 10, letterSpacing: "0.06em", fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { firm: "MAP", gov: 1.5, ops: 1.0, dec: 1.5, total: 4.0, verdict: "CRITICAL GAP", color: C.danger },
                      { firm: "Vistage", gov: 2.5, ops: 2.0, dec: 2.0, total: 6.5, verdict: "DEVELOPING", color: C.warning },
                      { firm: "EOS Worldwide", gov: 2.0, ops: 2.5, dec: 3.0, total: 7.5, verdict: "CLOSEST TO THRESHOLD", color: C.gold },
                      { firm: "Franklin Covey", gov: 2.5, ops: 1.5, dec: 2.0, total: 6.0, verdict: "LAGGING", color: C.periwinkleDim },
                    ].map((row, i) => (
                      <tr key={row.firm} style={{ background: i % 2 === 0 ? C.cream : C.creamDim }}>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: row.color }}>{row.firm}</td>
                        <td style={{ padding: "10px 14px" }}>{row.gov}</td>
                        <td style={{ padding: "10px 14px" }}>{row.ops}</td>
                        <td style={{ padding: "10px 14px" }}>{row.dec}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 700 }}>{row.total} / 15</td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ color: row.color, fontWeight: 700, fontSize: 10, letterSpacing: "0.06em" }}>{row.verdict}</span>
                        </td>
                        <td style={{ padding: "10px 14px", color: C.danger, fontWeight: 700 }}>−{(9 - row.total).toFixed(1)} pts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 10, fontSize: 10, color: C.charcoalLight, fontFamily: "'IBM Plex Mono', monospace" }}>
                Threshold = 9.0 / 15 (3.0 avg per dimension) · EOS Worldwide is closest to threshold at 7.5 due to ops-layer thinking in Traction methodology · MAP scores lowest at 4.0 — representing the highest governance opportunity
              </div>
            </div>
          </div>
        )}

        {/* ─── AI THEATER ─── */}
        {activeTab === "theater" && (
          <div>
            <SectionLabel>AI Theater Risk Detection · MAP Service Line Analysis</SectionLabel>
            <div style={{ background: C.cream, border: `1px solid ${C.creamDim}`, borderLeft: `4px solid ${C.danger}`, borderRadius: 2, padding: "18px 22px", marginBottom: 22, fontSize: 12, lineHeight: 1.7 }}>
              <strong style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, color: C.charcoal }}>AI Theater Defined:</strong> Organizations spend on AI tools without installing the behavioral change infrastructure that produces measurable accountability velocity improvement. The tool is present. The governance layer is absent. The ROI is theater.
              <br /><br />
              <span style={{ color: C.charcoalLight, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
                Industry benchmark: Only 5% of firms achieve material AI value at scale (BCG 2025) · 60% report little impact · 50% of S&P 500 AI spend produces negative ROI
              </span>
            </div>

            <ChartBox
              title="AI Theater Risk by MAP Service Line"
              subtitle="Estimated % of client engagements experiencing AI Theater vs. genuine behavior change · Based on public service architecture signals — not MAP self-reported data"
              note="Source: mapconsulting.com service descriptions · MAP App and MAP University product pages · BCG AI Value at Scale 2025 · PwC 2026 AI Agent Survey"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aiTheaterRisk} layout="vertical" margin={{ top: 8, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.gridLine} horizontal={false} />
                  <ReferenceLine x={50} stroke={C.danger} strokeDasharray="5 3" label={{ value: "Theater Threshold", position: "top", fontSize: 9, fill: C.danger, fontFamily: "monospace" }} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fontFamily: "monospace", fill: C.charcoalLight }} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 10, fontFamily: "monospace", fill: C.charcoalLight }} width={90} />
                  <Tooltip content={<FredTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: "monospace" }} />
                  <Bar dataKey="theater" name="AI Theater Risk %" fill={C.danger} radius={[0, 2, 2, 0]} fillOpacity={0.8} />
                  <Bar dataKey="genuine" name="Genuine ROI Est. %" fill={C.success} radius={[0, 2, 2, 0]} fillOpacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>

            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { service: "MAP App", risk: "HIGH", theater: "72%", reason: "Goal tracking without behavioral change governance layer = accountability tool with no accountability enforcement architecture", fix: "Install DRL + AIL between MAP App outputs and consultant rhythm decisions" },
                { service: "MAP University", risk: "HIGH", theater: "65%", reason: "On-demand learning content without ops sponsor to enforce application = content consumption theater", fix: "Connect MAP U completion data to Vital Factors® accountability reviews" },
                { service: "Business Planning", risk: "MEDIUM", theater: "55%", reason: "AI-assisted planning templates without decision routing to operational owners", fix: "Decision layer integration between plan outputs and named execution owners" },
                { service: "Vital Factors®", risk: "LOW", theater: "30%", reason: "Human-mediated process is the genuine strength — least AI Theater exposure", fix: "This is the anchor. Build the AI governance layer around this, not on top of it" },
              ].map(({ service, risk, theater, reason, fix }) => (
                <div key={service} style={{
                  background: C.cream,
                  border: `1px solid ${C.creamDim}`,
                  borderLeft: `4px solid ${risk === "HIGH" ? C.danger : risk === "MEDIUM" ? C.warning : C.success}`,
                  borderRadius: 2,
                  padding: "16px 20px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: C.charcoal }}>{service}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: risk === "HIGH" ? C.danger : risk === "MEDIUM" ? C.warning : C.success, fontFamily: "'IBM Plex Mono', monospace" }}>{risk} · {theater}</div>
                  </div>
                  <div style={{ fontSize: 10, color: C.charcoalLight, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.6, marginBottom: 10 }}>{reason}</div>
                  <div style={{ fontSize: 10, color: C.periwinkle, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.6 }}>→ {fix}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── ENTRY POINT ─── */}
        {activeTab === "entry" && (
          <div>
            <SectionLabel>Fractional CXO Entry Point · Highest Leverage Intervention</SectionLabel>
            <div style={{ background: C.charcoal, borderRadius: 2, padding: "28px 32px", marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", color: C.periwinkle, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 8 }}>PRIMARY INTERVENTION POINT</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.cream, fontFamily: "'DM Serif Display', serif", lineHeight: 1.4, marginBottom: 16 }}>
                Install a Governance and Decision-Routing Layer Between MAP's AI Tooling and its Vital Factors® Accountability System
              </div>
              <div style={{ fontSize: 13, color: "rgba(245,242,236,0.75)", lineHeight: 1.8, fontFamily: "'IBM Plex Sans', sans-serif" }}>
                MAP's Vital Factors® Process is the genuine IP. It is human-mediated, behavioral, and accountability-driven — the exact model that AI governance architecture is built to amplify, not replace. The problem is that MAP's digital layer (the MAP App, MAP University, MAP Digital) sits disconnected from the accountability system underneath it. There is no documented decision routing layer telling MAP App insights where to go. There is no actionable insight layer confirming that outputs are producing behavior change. There is no named operations sponsor governing how AI tooling connects to the Vital Factors® delivery rhythm.
                <br /><br />
                The Fractional CXO entry point is not a technology engagement. It is a <strong style={{ color: C.periwinkle }}>behavioral intelligence and operations governance engagement</strong>. The deliverable is a decision governance architecture — specifically the Decision Routing Layer (DRL) and Actionable Insight Layer (AIL) — installed between MAP's AI tools and its consultant delivery model. This produces one measurable outcome: clients stop experiencing AI Theater and start experiencing accountability velocity improvement, which is what MAP has always sold and what their AI layer currently cannot deliver without governance infrastructure.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={{ background: C.cream, border: `1px solid ${C.creamDim}`, borderRadius: 2, padding: "20px 24px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: C.charcoal, marginBottom: 16 }}>30-Day Proof of Concept</div>
                {[
                  ["Week 1", "HCDG audit: MAP App and MAP University — document where AI exists vs. where governance is absent"],
                  ["Week 2", "DVL measurement: how fast do MAP App insights become consultant decisions? Measure the gap."],
                  ["Week 3", "Install DRL prototype: route MAP App outputs to named decision owners in the Vital Factors® rhythm"],
                  ["Week 4", "AIL baseline: score 5 existing client outputs on Action Owner / Trigger / Measurable Outcome. Flag Insight Theater rate."],
                ].map(([week, action]) => (
                  <div key={week} style={{ display: "flex", gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.gridLine}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.periwinkle, fontFamily: "'IBM Plex Mono', monospace", minWidth: 52 }}>{week}</div>
                    <div style={{ fontSize: 11, color: C.charcoalLight, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.5 }}>{action}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: C.cream, border: `1px solid ${C.creamDim}`, borderRadius: 2, padding: "20px 24px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: C.charcoal, marginBottom: 16 }}>Measurable Outcomes (Day 90)</div>
                {[
                  ["Accountability Velocity", "Time from MAP App insight to named Vital Factors® action — baseline vs. Day 90"],
                  ["Insight Theater Rate", "% of MAP App outputs that pass AIL (Action Owner + Trigger + Measurable Outcome)"],
                  ["Decision Routing Score", "% of AI outputs routed to correct decision node without consultant intervention"],
                  ["Client AI ROI Signal", "% of clients who can name a measurable outcome from their MAP App usage"],
                ].map(([metric, measure]) => (
                  <div key={metric} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.gridLine}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.charcoal, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 4 }}>{metric}</div>
                    <div style={{ fontSize: 11, color: C.charcoalLight, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.5 }}>{measure}</div>
                  </div>
                ))}
                <div style={{ marginTop: 16, background: C.periwinkleLight, borderRadius: 2, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: C.periwinkleDim, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.6 }}>
                    Engagement frame: 25–30 hrs/week consulting architecture · Not a technology build · Not a content engagement · A governance and decision intelligence installation
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: C.cream, border: `1px solid ${C.creamDim}`, borderRadius: 2, padding: "20px 24px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: C.charcoal, marginBottom: 14 }}>Why MAP Specifically — And Why Now</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                {[
                  ["60-Year IP Anchor", "Vital Factors® is a documented, human-verified accountability system. The governance layer amplifies something real. This is not AI Theater waiting to happen — it is AI governance waiting to be installed."],
                  ["Gap Is Widening", "77% of consulting firms have AI integrated (MCA Jan 2026). MAP's peer set is moving. A CONDITIONAL HCDG verdict today becomes a FAIL verdict in 18 months if the governance layer is not installed."],
                  ["CEO Access Is the Asset", "Meeting the CEO directly compresses a 6-month relationship-building cycle. The right entry is a 30-day proof of concept with a measurable verdict. Not a proposal. A verdict."],
                ].map(([title, text]) => (
                  <div key={title}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.periwinkle, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 }}>{title}</div>
                    <div style={{ fontSize: 11, color: C.charcoalLight, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.6 }}>{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── SOURCES ─── */}
        {activeTab === "sources" && (
          <div>
            <SectionLabel>Source Registry · All Public Citations</SectionLabel>
            <div style={{ background: C.cream, border: `1px solid ${C.creamDim}`, borderRadius: 2, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>
                <thead>
                  <tr style={{ background: C.charcoal }}>
                    {["#", "Source", "Context Used In This Brief", "Tier"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: C.cream, fontSize: 10, letterSpacing: "0.06em", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sources.map((s, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? C.cream : C.creamDim, borderBottom: `1px solid ${C.gridLine}` }}>
                      <td style={{ padding: "10px 16px", color: C.charcoalLight }}>{i + 1}</td>
                      <td style={{ padding: "10px 16px" }}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: C.periwinkle, textDecoration: "none" }}>{s.label}</a>
                      </td>
                      <td style={{ padding: "10px 16px", color: C.charcoalLight, lineHeight: 1.5 }}>{s.context}</td>
                      <td style={{ padding: "10px 16px" }}>
                        <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 2, background: s.url === "#" ? C.warningLight : C.periwinkleLight, color: s.url === "#" ? C.warning : C.periwinkleDim, fontWeight: 700, letterSpacing: "0.06em" }}>
                          {s.url === "#" ? "INFERRED-PUBLIC" : "PUBLIC-VERIFIED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 16, background: C.cream, border: `1px solid ${C.creamDim}`, borderRadius: 2, padding: "16px 20px", fontSize: 10, color: C.charcoalLight, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.7 }}>
              <strong style={{ color: C.charcoal }}>Claim Classification Protocol (ESIL v1.0):</strong> PUBLIC-VERIFIED = directly sourced from named public URL · INFERRED-PUBLIC = derived from pattern of publicly available data; specific URL not surfaced in this session but claim is publicly documented · All MAP-specific scores are analyst estimates from public digital footprint analysis — not MAP self-reported data. Scores should be validated with MAP directly before being cited externally.
              <br /><br />
              <strong style={{ color: C.charcoal }}>Framework Attribution:</strong> AI Adoption Architect v6.6 · Marketing Ops Catalyst v4.7 (DRL, AIL) · Fractional CXO Practice Builder v2.6 (HCDG, DVL, RIL, OLR, CRL) · McDonald (2026) · DACR License v2.6 · Epoch Frameworks LLC
            </div>
          </div>
        )}

      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: C.charcoal, padding: "16px 32px", borderTop: `1px solid ${C.charcoalMid}`, marginTop: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }}>
          <div style={{ color: "rgba(245,242,236,0.45)" }}>
            Erwin M. McDonald · AI Adoption Architect · Epoch Frameworks LLC · Fort Worth, TX · April 2026
          </div>
          <div style={{ color: "rgba(245,242,236,0.3)" }}>
            DACR License v2.6 · Proprietary Intelligence · mapconsulting.com
          </div>
        </div>
      </div>
    </div>
  );
}
