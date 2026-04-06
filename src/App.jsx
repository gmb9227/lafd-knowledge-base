import { useState, useRef, useEffect } from "react";

const POLICY_DB = [
  { id: "CR4-001", jurisdiction: "LAFD (City of Los Angeles)", source: "Chief's Regulation 4", title: "Fire Alarm System Testing", category: "Testing & Inspection", effective_date: "2025-01-05", body: "All fire alarm systems shall be tested annually by a licensed contractor. Testing must include: initiating device verification, notification appliance circuit testing, supervising station signal transmission, battery load testing (24-hour standby, 5-minute alarm), and detector sensitivity testing per NFPA 72. Building owners must maintain a log of all tests, available for inspection by LAFD. Systems failing annual inspection must be repaired within 30 days and re-tested. Failure to comply may result in a Notice of Non-Compliance and potential building closure order." },
  { id: "CR4-002", jurisdiction: "LAFD (City of Los Angeles)", source: "Chief's Regulation 4", title: "Standpipe System Testing", category: "Testing & Inspection", effective_date: "2025-01-05", body: "Standpipe systems shall be tested every 5 years with a hydrostatic test at 200 psi for 2 hours, or 50 psi above maximum operating pressure (whichever is greater). Flow tests shall be conducted annually. All Class I and Class III standpipe systems in buildings over 75 feet must have hose connections on every floor. Pressure-reducing valves must be tested annually and adjusted to maintain 100-175 psi at the outlet. Fire Department Connections (FDC) must be inspected quarterly for caps, gaskets, swivel operation, and clapper valve function." },
  { id: "CR4-003", jurisdiction: "LAFD (City of Los Angeles)", source: "Chief's Regulation 4", title: "Fire Pump Testing", category: "Testing & Inspection", effective_date: "2025-01-05", body: "Fire pumps shall be tested weekly (churn/no-flow test for minimum 10 minutes) and annually (full flow test per NFPA 25). Annual tests must demonstrate pump performance at 150% of rated flow at not less than 65% of rated pressure. Diesel fire pumps must be tested weekly for 30 minutes minimum. Electric fire pumps: weekly for 10 minutes. All test results must be recorded on LAFD Form FP-005 and kept on-site for 3 years. Jockey pump operation and controller settings must be verified monthly." },
  { id: "CR4-004", jurisdiction: "LAFD (City of Los Angeles)", source: "Chief's Regulation 4", title: "Emergency Generator Testing", category: "Testing & Inspection", effective_date: "2025-01-05", body: "Emergency generators serving fire protection systems shall be tested monthly under load for minimum 30 minutes, and annually under full building load for 2 hours. Transfer switches must be tested monthly. Fuel supply must be maintained at minimum 2/3 capacity at all times, sufficient for 2 hours of full-load operation. Generators must start within 10 seconds of power failure. Annual load bank testing is required if the generator has not carried minimum 30% of nameplate rating for at least 30 minutes during monthly testing." },
  { id: "PR-001", jurisdiction: "LAFD (City of Los Angeles)", source: "LAFD Policies & Requirements", title: "High-Rise Retrofit Ordinance Requirements", category: "Building Requirements", effective_date: "2024-07-01", body: "All existing high-rise buildings (75+ feet) constructed before 1974 must be retrofitted with automatic sprinkler systems. Compliance deadline is phased: residential high-rises by 2029, commercial by 2032. Buildings must also install voice evacuation alarm systems, stairwell pressurization or smokeproof enclosures, and emergency generator backup for fire life safety systems. Building owners must submit a compliance plan to LAFD Fire Prevention Bureau within 1 year of notification. Failure to comply results in escalating fines starting at $500/day." },
  { id: "PR-002", jurisdiction: "LAFD (City of Los Angeles)", source: "LAFD Policies & Requirements", title: "Construction Site Fire Safety - Requirement #07", category: "Construction Safety", effective_date: "2024-01-15", body: "All construction sites must maintain: a 20-foot clear perimeter for fire apparatus access at all times, a minimum of one 2A:10BC fire extinguisher per 3,000 sq ft of floor area, a fire watch during and 30 minutes after all hot work operations. For buildings under construction over 50 feet, a standpipe must be maintained within one floor of the highest work area. Combustible waste must be removed daily. On-site fire safety manager is required for projects exceeding 5 stories or 50,000 sq ft. LAFD must be notified 48 hours before any street/access road closures affecting emergency response." },
  { id: "PR-003", jurisdiction: "LAFD (City of Los Angeles)", source: "LAFD Policies & Requirements", title: "Solar Panel Placement Requirements", category: "Building Requirements", effective_date: "2024-03-01", body: "Solar photovoltaic systems must maintain: a 3-foot clear perimeter around rooftop edges on residential buildings, designated pathways minimum 4 feet wide for firefighter roof access, arrays must not obstruct fire department roof ventilation areas. Rapid shutdown systems are required per NEC 690.12 - panels must de-energize to 80V or less within 30 seconds of rapid shutdown initiation. DC conduit must be labeled with warning placards every 10 feet. Ground-mounted systems require 10-foot clearance from structures. Residential systems require LAFD permit; commercial systems require plan check review." },
  { id: "FC-001", jurisdiction: "LAFD (City of Los Angeles)", source: "2023 LA Fire Code", title: "Fire Apparatus Access Roads", category: "Fire Code", effective_date: "2023-07-01", body: "Fire apparatus access roads shall have an unobstructed width of not less than 20 feet and an unobstructed vertical clearance of not less than 13 feet 6 inches. Dead-end fire apparatus access roads exceeding 150 feet shall be provided with turnarounds. Roads must support an imposed load of at least 75,000 lbs GVW. Fire lanes must be marked with red curb paint and NO PARKING - FIRE LANE signs. Gates across fire access roads must have a minimum 20-foot clear opening, be equipped with approved locks (Knox Box), and must not obstruct more than one lane during opening/closing." },
  { id: "FC-002", jurisdiction: "LAFD (City of Los Angeles)", source: "2023 LA Fire Code", title: "Fire Hydrant Spacing and Access", category: "Fire Code", effective_date: "2023-07-01", body: "Fire hydrants shall be provided along required fire apparatus access roads and adjacent public streets. Hydrant spacing: commercial/industrial - maximum 300 feet apart; residential - maximum 600 feet apart. Hydrants must be within 400 feet of all portions of the first floor exterior wall. A 3-foot clear space must be maintained around hydrants. No parking within 15 feet of a hydrant. Hydrants must flow minimum 1,000 GPM in commercial areas and 500 GPM in residential areas at 20 psi residual pressure." },
  { id: "FC-003", jurisdiction: "LAFD (City of Los Angeles)", source: "2023 LA Fire Code", title: "Occupancy Load and Exit Requirements", category: "Fire Code", effective_date: "2023-07-01", body: "Maximum occupancy loads shall be posted in assembly occupancies. Exit doors must swing in the direction of egress when serving 50+ occupants. Minimum two exits required when occupant load exceeds 49 in any space. Exit width: 0.2 inches per occupant for stairways, 0.15 inches per occupant for other exits (with sprinklers). Exit signs must be internally illuminated, visible from 100 feet, connected to emergency power. Panic hardware required on exit doors serving 50+ occupants in assembly and educational occupancies. Maximum travel distance to exit: 250 feet (sprinklered), 200 feet (non-sprinklered)." },
  { id: "LAC-001", jurisdiction: "LA County Fire Department", source: "County Guidance Documents", title: "Hazardous Materials Storage Requirements", category: "Hazmat", effective_date: "2024-06-01", body: "Facilities storing hazardous materials must obtain a Unified Program Facility Permit from LA County Fire Health Hazardous Materials Division. Quantities exceeding permit thresholds require a Hazardous Materials Business Plan (HMBP) filed through CERS (California Environmental Reporting System). Storage must comply with: segregation of incompatible materials per CFC Table 5003.9.8, secondary containment for liquids (110% of largest container), approved cabinets for flammable liquids (max 60 gallons per cabinet), and maximum allowable quantities per control area. Annual inspections are conducted by County Fire inspectors." },
  { id: "LAC-002", jurisdiction: "LA County Fire Department", source: "County Guidance Documents", title: "Vegetation Management - Brush Clearance", category: "Wildfire Prevention", effective_date: "2024-04-01", body: "Properties in fire hazard severity zones must maintain brush clearance: Zone 1 (0-100 feet from structure) - remove all dead vegetation, trim trees 6+ feet from ground, maintain grass at 3 inches or less, remove all brush within 30 feet of structures. Zone 2 (100-200 feet) - reduce fuel load by 50%, remove dead materials, create spacing between plant groupings. Inspections begin annually on April 1. Non-compliance results in County abatement at owner expense plus administrative fees. Properties in Very High Fire Hazard Severity Zones (VHFHSZ) have additional requirements per PRC 4291." },
  { id: "LAC-003", jurisdiction: "LA County Fire Department", source: "County Emergency Procedures", title: "Building Emergency/Evacuation Procedures", category: "Emergency Operations", effective_date: "2024-01-01", body: "All commercial buildings must have a written Emergency Procedures Manual designating: a Floor Warden for each floor, primary and secondary evacuation routes, assembly areas minimum 200 feet from building, procedures for persons with disabilities (buddy system and areas of refuge), fire department notification procedures (call 911 first, then building management). Evacuation drills required: quarterly for high-rise buildings, semi-annually for all other commercial buildings. Drill records must be maintained for 3 years. Building fire alarm must be used for drills - do not use bullhorns as substitutes." },
  { id: "LAC-004", jurisdiction: "LA County Fire Department", source: "County Guidance Documents", title: "Underground Storage Tank (UST) Requirements", category: "Hazmat", effective_date: "2024-06-01", body: "All underground storage tanks must be: double-walled with interstitial monitoring, equipped with automatic leak detection (checked every 30 days), tested for tightness every 12 months using approved methods. UST owners must obtain an Operating Permit from LA County Fire Dept - CUPA (Certified Unified Program Agency). Spill buckets required at fill ports, minimum 5-gallon capacity. Overfill prevention: automatic shutoff at 95% capacity, alarm at 90%. Financial responsibility documentation must be maintained ($1M per occurrence, $2M aggregate). Monthly monitoring reports retained for 3 years." },
  { id: "SOP-001", jurisdiction: "General - LAFD / LA County", source: "Standard Operating Procedures", title: "SCBA (Self-Contained Breathing Apparatus) Usage", category: "Operations / Safety", effective_date: "2024-01-01", body: "SCBA shall be worn by all personnel operating in IDLH (Immediately Dangerous to Life or Health) atmospheres. Donning must be completed within 60 seconds. Minimum cylinder pressure before entry: 4,050 psi (45-minute rated cylinder). The 2-in/2-out rule applies: at least two firefighters must enter the IDLH atmosphere while at least two remain outside for rescue. Low-air alarm activates at approximately 33% (1,350 psi). Upon low-air alarm: immediately notify crew and begin egress. Annual fit testing is mandatory per OSHA 29 CFR 1910.134. Daily checks: facepiece seal, regulator function, cylinder pressure, PASS device activation." },
  { id: "SOP-002", jurisdiction: "General - LAFD / LA County", source: "Standard Operating Procedures", title: "Incident Command System (ICS) Structure", category: "Operations / Command", effective_date: "2024-01-01", body: "All incidents operate under ICS per NIMS. First arriving company officer assumes Incident Commander (IC) until relieved by a senior officer. IC responsibilities: establish command post (upwind/uphill), provide initial size-up to dispatch, request additional resources, assign tactical objectives. ICS sections activated as needed: Operations, Planning, Logistics, Finance/Admin. Span of control: 3-7 subordinates (optimal 5). All personnel must check in at staging. Transfer of command must include face-to-face briefing covering: situation status, resource deployment, safety concerns, and incident action plan." },
  { id: "SOP-003", jurisdiction: "General - LAFD / LA County", source: "Standard Operating Procedures", title: "Mayday Procedures", category: "Operations / Safety", effective_date: "2024-01-01", body: "A MAYDAY is declared when a firefighter is lost, trapped, injured, low on air, or in imminent danger. Procedure for the firefighter: transmit MAYDAY MAYDAY MAYDAY on tactical channel, provide LUNAR report (Location, Unit, Name, Assignment/Air supply, Resources needed). Activate PASS device. Conserve air. Attempt self-rescue. Procedure for IC upon receiving MAYDAY: clear the radio channel, assign RIT/RIC (Rapid Intervention Team/Crew), assign dedicated rescue radio channel, maintain accountability of all other crews. All non-essential radio traffic ceases immediately. PAR (Personnel Accountability Report) for all companies." },
  { id: "SOP-004", jurisdiction: "General - LAFD / LA County", source: "Standard Operating Procedures", title: "Wildland-Urban Interface (WUI) Operations", category: "Operations / Wildfire", effective_date: "2024-01-01", body: "In WUI incidents: structure triage uses the Triage Assessment model - defensible (protect), non-defensible (do not commit resources), threatened (monitor). Safety zones must be established with minimum 4x the flame length clearance. LCES protocol mandatory: Lookouts posted, Communications established, Escape routes identified (minimum 2), Safety zones designated. Apparatus positioning: nose facing escape route, windows up, headlights on, all equipment stowed for rapid deployment or evacuation. Firefighters must carry fire shelters in all wildland assignments. Red Flag Warning conditions require heightened staffing and pre-positioned resources." }
];

const CATEGORIES = [...new Set(POLICY_DB.map(p => p.category))].sort();
const JURISDICTIONS = [...new Set(POLICY_DB.map(p => p.jurisdiction))].sort();

const HERITAGE = {
  founded: "February 1, 1886",
  origins: "1871",
  motto: "Serving with Courage, Integrity and Pride",
  mission: "To preserve life, protect property, and safeguard our communities",
  rank: "3rd largest municipal fire department in the United States",
  personnel: "3,246 uniformed + 353 professional support",
  jurisdiction: "471 square miles, approximately 4 million residents",
  bureaus: "Central, South, Valley, West",
  designation: "Class 1 Fire Department",
  usar: "Founding member, FEMA CA Task Force 1"
};

function buildSystemPrompt() {
  return `You are the LAFD Knowledge Base AI, an authoritative reference assistant for Los Angeles City and County firefighters. You answer questions using ONLY the policy database provided below.

Be direct, professional, and cite document IDs in brackets (e.g., [CR4-001]). Give specific numbers, pressures, distances, and timeframes. Use language appropriate for fire service professionals.

If a question falls outside the database, say: "This is not covered in the current knowledge base. In a full deployment, this would be sourced from [suggest likely source]."

POLICY DATABASE:
${POLICY_DB.map(p => `[${p.id}] ${p.title} (${p.jurisdiction}, ${p.source}, effective ${p.effective_date})\n${p.body}`).join("\n\n")}

DEPARTMENT CONTEXT:
- LAFD founded ${HERITAGE.founded}, origins dating to ${HERITAGE.origins}
- Motto: "${HERITAGE.motto}"
- ${HERITAGE.rank}
- ${HERITAGE.personnel} personnel
- ${HERITAGE.jurisdiction}
- ${HERITAGE.designation}
- ${HERITAGE.usar}

RULES:
- Always cite document IDs in brackets
- Give specific numbers when available
- Reference all relevant documents for multi-topic answers
- Keep answers concise but thorough
- If uncertain, be transparent about database limitations`;
}

export default function App() {
  const [view, setView] = useState("ask");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [filterJur, setFilterJur] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [searchBrowse, setSearchBrowse] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [adminMsg, setAdminMsg] = useState("");
  const [commitNote, setCommitNote] = useState("");
  const [deploying, setDeploying] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (statusMsg) {
      const t = setTimeout(() => setStatusMsg(""), 4000);
      return () => clearTimeout(t);
    }
  }, [statusMsg]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("deploy")) setShowAdmin(true);
  }, []);

  const handleAsk = async () => {
    if (!query.trim() || loading) return;
    const userMsg = query.trim();
    setQuery("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    setStatusMsg("Searching policies...");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: buildSystemPrompt(), message: userMsg })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API error");
      setMessages(prev => [...prev, { role: "assistant", text: data.answer }]);
      setStatusMsg("Response received.");
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: "Error: " + err.message }]);
      setStatusMsg("Error receiving response.");
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleDeploy = async () => {
    if (!adminPass.trim() || !adminCode.trim() || deploying) return;
    setDeploying(true);
    setAdminMsg("Pushing to GitHub...");
    try {
      const res = await fetch("/api/deploy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: adminPass, content: adminCode, commitMessage: commitNote.trim() || "Update App.jsx via deploy panel" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deploy failed");
      setAdminMsg("Deployed! " + data.message + " Commit: " + data.commitSha.substring(0, 7));
    } catch (err) { setAdminMsg("Error: " + err.message); }
    setDeploying(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setAdminCode(evt.target.result);
      setAdminMsg("Loaded " + file.name + " (" + evt.target.result.length.toLocaleString() + " characters)");
    };
    reader.readAsText(file);
  };

  const filteredPolicies = POLICY_DB.filter(p => {
    const matchCat = filterCat === "All" || p.category === filterCat;
    const matchJur = filterJur === "All" || p.jurisdiction === filterJur;
    const matchSearch = !searchBrowse ||
      p.title.toLowerCase().includes(searchBrowse.toLowerCase()) ||
      p.body.toLowerCase().includes(searchBrowse.toLowerCase()) ||
      p.id.toLowerCase().includes(searchBrowse.toLowerCase());
    return matchCat && matchJur && matchSearch;
  });

  const SAMPLE_QUESTIONS = [
    "How often do fire pumps need testing?",
    "What is the 2-in/2-out rule for SCBA?",
    "What are the brush clearance zone requirements?",
    "How do I declare a MAYDAY?",
    "What is required for high-rise retrofits?",
    "Solar panel roof access requirements?"
  ];

  const togglePolicy = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b1120", color: "#e2dfd8", fontFamily: "'Libre Franklin', 'Helvetica Neue', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;500;600;700;800;900&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Skip nav for keyboard users */
        .skip-link { position: absolute; top: -100px; left: 8px; background: #c8a84e; color: #0d1528; padding: 8px 16px; z-index: 200; border-radius: 0 0 6px 6px; font-weight: 700; font-size: 14px; text-decoration: none; }
        .skip-link:focus { top: 0; }

        /* Focus indicators - WCAG 2.4.7 */
        *:focus-visible { outline: 2px solid #c8a84e; outline-offset: 2px; }
        button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid #c8a84e; outline-offset: 2px; }

        /* Screen reader only utility */
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

        .hdr { background: linear-gradient(180deg, #0d1528 0%, #0b1120 100%); border-bottom: 2px solid #c8a84e; padding: 12px 24px; position: sticky; top: 0; z-index: 100; }
        .hdr-inner { max-width: 980px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .hdr-brand { display: flex; align-items: center; gap: 14px; }
        .hdr-shield { width: 44px; height: 44px; background: linear-gradient(160deg, #c8a84e 0%, #a6882e 50%, #c8a84e 100%); border-radius: 4px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(200,168,78,0.25), inset 0 1px 0 rgba(255,255,255,0.3); }
        .hdr-shield-text { font-family: 'Source Serif 4', Georgia, serif; font-size: 14px; font-weight: 700; color: #0d1528; letter-spacing: 1px; }
        .hdr-title { font-family: 'Source Serif 4', Georgia, serif; font-size: 17px; font-weight: 700; color: #c8a84e; letter-spacing: 0.5px; }
        .hdr-sub { font-size: 11px; font-weight: 400; color: #94a3be; letter-spacing: 0.3px; margin-top: 1px; }
        .tab-bar { display: flex; gap: 2px; background: rgba(200,168,78,0.06); border: 1px solid rgba(200,168,78,0.15); border-radius: 8px; padding: 3px; }
        .tab-btn { font-family: 'Libre Franklin', sans-serif; font-size: 12px; font-weight: 600; padding: 8px 18px; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s; color: #94a3be; background: transparent; letter-spacing: 0.5px; text-transform: uppercase; }
        .tab-btn.active { background: rgba(200,168,78,0.15); color: #c8a84e; }
        .tab-btn:hover:not(.active) { background: rgba(255,255,255,0.04); color: #b8c4d8; }

        .hero { position: relative; width: 100%; height: 420px; overflow: hidden; }
        .hero img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; display: block; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(11,17,32,0.15) 0%, rgba(11,17,32,0.4) 40%, rgba(11,17,32,0.85) 75%, rgba(11,17,32,1) 100%); display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding: 0 24px 28px; text-align: center; }
        .hero-est { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: #c8a84e; margin-bottom: 6px; opacity: 0.85; }
        .hero h1 { font-family: 'Source Serif 4', Georgia, serif; font-size: 32px; font-weight: 700; color: #ffffff; text-shadow: 0 2px 16px rgba(0,0,0,0.6); letter-spacing: -0.3px; }
        .hero-motto { font-family: 'Libre Franklin', sans-serif; font-size: 13px; font-weight: 400; font-style: italic; color: #d4bc72; margin-top: 6px; letter-spacing: 0.5px; }
        .hero-divider { width: 48px; height: 2px; background: #c8a84e; margin: 12px auto 0; border-radius: 1px; opacity: 0.5; }

        .stats-bar { background: rgba(200,168,78,0.04); border-bottom: 1px solid rgba(200,168,78,0.1); padding: 10px 24px; }
        .stats-bar-inner { max-width: 980px; margin: 0 auto; display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }
        .stat-item { font-size: 11px; color: #8899b0; letter-spacing: 0.3px; }
        .stat-item strong { color: #a8b8d0; font-weight: 600; }

        .main { max-width: 980px; margin: 0 auto; padding: 24px; }

        .chat-wrap { display: flex; flex-direction: column; min-height: calc(100vh - 440px); }
        .msgs { flex: 1; padding-bottom: 16px; }

        .empty { display: flex; flex-direction: column; align-items: center; padding: 36px 20px; text-align: center; }
        .empty h2 { font-family: 'Source Serif 4', Georgia, serif; font-size: 22px; font-weight: 600; color: #c4bfb0; margin-bottom: 8px; }
        .empty p { font-size: 14px; color: #8899b0; margin-bottom: 28px; max-width: 460px; line-height: 1.55; }
        .sample-grid { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; max-width: 640px; }
        .sample-q { font-family: 'Libre Franklin', sans-serif; font-size: 12px; padding: 9px 16px; background: rgba(200,168,78,0.06); border: 1px solid rgba(200,168,78,0.15); border-radius: 20px; color: #b8a878; cursor: pointer; transition: all 0.2s; }
        .sample-q:hover { background: rgba(200,168,78,0.12); border-color: rgba(200,168,78,0.35); color: #c8a84e; }

        .msg { margin-bottom: 16px; display: flex; flex-direction: column; }
        .msg.user { align-items: flex-end; }
        .msg.assistant { align-items: flex-start; }
        .msg-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; padding: 0 4px; }
        .msg.user .msg-label { color: #a8b8d0; }
        .msg.assistant .msg-label { color: #c8a84e; }
        .msg-bubble { max-width: 85%; padding: 14px 18px; border-radius: 10px; font-size: 14px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }
        .msg.user .msg-bubble { background: rgba(100,130,180,0.1); border: 1px solid rgba(100,130,180,0.2); color: #d0d6e2; border-bottom-right-radius: 3px; }
        .msg.assistant .msg-bubble { background: rgba(200,168,78,0.05); border: 1px solid rgba(200,168,78,0.12); color: #c4bfb0; border-bottom-left-radius: 3px; }

        .input-area { position: sticky; bottom: 0; background: linear-gradient(transparent, #0b1120 20%); padding: 16px 0 8px; }
        .input-row { display: flex; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(200,168,78,0.15); border-radius: 10px; padding: 5px; transition: border-color 0.2s; }
        .input-row:focus-within { border-color: rgba(200,168,78,0.4); }
        .input-row input { flex: 1; font-family: 'Libre Franklin', sans-serif; font-size: 14px; background: transparent; border: none; outline: none; color: #e2dfd8; padding: 10px 12px; }
        .input-row input::placeholder { color: #596b85; }
        .send-btn { font-family: 'Libre Franklin', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; padding: 10px 24px; background: linear-gradient(135deg, #c8a84e, #a6882e); border: none; border-radius: 7px; color: #0d1528; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .send-btn:hover:not(:disabled) { background: linear-gradient(135deg, #d4b85e, #c8a84e); box-shadow: 0 0 16px rgba(200,168,78,0.25); }
        .send-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .loading-dots::after { content: ''; animation: dots 1.5s infinite; }
        @keyframes dots { 0%, 20% { content: '.'; } 40% { content: '..'; } 60%, 100% { content: '...'; } }

        .browse-filters { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
        .browse-search { flex: 1; min-width: 200px; font-family: 'Libre Franklin', sans-serif; font-size: 13px; padding: 10px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(200,168,78,0.12); border-radius: 8px; color: #e2dfd8; outline: none; transition: border-color 0.2s; }
        .browse-search:focus { border-color: rgba(200,168,78,0.35); }
        .browse-search::placeholder { color: #596b85; }
        .filter-select { font-family: 'Libre Franklin', sans-serif; font-size: 12px; padding: 10px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(200,168,78,0.12); border-radius: 8px; color: #e2dfd8; outline: none; cursor: pointer; appearance: none; min-width: 140px; }
        .filter-select option { background: #0d1528; color: #e2dfd8; }
        .browse-count { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8899b0; margin-bottom: 12px; }
        .browse-stats { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .bstat { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8899b0; background: rgba(200,168,78,0.04); border: 1px solid rgba(200,168,78,0.08); padding: 6px 12px; border-radius: 6px; }
        .bstat em { color: #c8a84e; font-weight: 600; font-style: normal; }

        .pcard { background: rgba(255,255,255,0.015); border: 1px solid rgba(200,168,78,0.07); border-radius: 8px; margin-bottom: 6px; cursor: pointer; overflow: hidden; transition: all 0.2s; }
        .pcard:hover { border-color: rgba(200,168,78,0.2); background: rgba(255,255,255,0.025); }
        .pcard.open { border-color: rgba(200,168,78,0.3); }
        .pcard-hd { padding: 13px 16px; display: flex; align-items: flex-start; gap: 12px; }
        .pcard-id { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500; color: #c8a84e; background: rgba(200,168,78,0.08); padding: 3px 8px; border-radius: 3px; white-space: nowrap; margin-top: 2px; }
        .pcard-info { flex: 1; }
        .pcard-title { font-family: 'Source Serif 4', Georgia, serif; font-size: 14px; font-weight: 600; color: #d4d0c4; margin-bottom: 3px; }
        .pcard-meta { font-size: 11px; color: #8899b0; display: flex; gap: 10px; flex-wrap: wrap; }
        .pcard-body { padding: 0 16px 14px; margin-left: 68px; font-size: 13px; line-height: 1.7; color: #a0adc0; border-top: 1px solid rgba(200,168,78,0.06); padding-top: 10px; }
        .demo-badge { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: #c8a84e; border: 1px solid rgba(200,168,78,0.25); padding: 3px 10px; border-radius: 3px; margin-left: 10px; vertical-align: middle; }
      
    .hero-fire-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,100,15,0.28), transparent 70%);
      mix-blend-mode: screen;
      opacity: 0;
      animation: fireFlicker 0.4s ease-in-out infinite alternate, fireFadeIn 0.5s 0.3s ease forwards, fireFadeOut 0.8s 5s ease forwards;
      pointer-events: none;
      z-index: 1;
    }
    @keyframes fireFlicker {
      0% { opacity: 0.4; transform: scale(1); filter: hue-rotate(0deg); }
      30% { opacity: 0.75; transform: scale(1.01); filter: hue-rotate(-5deg); }
      60% { opacity: 0.35; transform: scale(0.995); filter: hue-rotate(5deg); }
      100% { opacity: 0.65; transform: scale(1.005); filter: hue-rotate(-3deg); }
    }
    @keyframes fireFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fireFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
      50% { opacity: 0.8; filter: blur(2px) brightness(1.5); }
      100% { opacity: 0.35; filter: blur(0.5px) brightness(1.2); }
    }
      to { opacity: 1; }
    }
      to { opacity: 0; }
    }
    .hero-brightness-pulse {
      animation: brightPulse 0.5s ease-in-out infinite alternate, brightFadeOut 0.8s 5s ease forwards;
    }
    @keyframes brightPulse {
      0% { filter: brightness(1); }
      50% { filter: brightness(1.08); }
      100% { filter: brightness(0.95); }
    }
    @keyframes brightFadeOut {
      to { animation: none; filter: brightness(1); }
    }
  \n`}</style>

      {/* Skip navigation - WCAG 2.4.1 */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Live region for screen readers - WCAG 4.1.3 */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">{statusMsg}</div>

      <header className="hdr" role="banner">
        <div className="hdr-inner">
          <div className="hdr-brand">
            <div className="hdr-shield" aria-hidden="true"><span className="hdr-shield-text">LAFD</span></div>
            <div>
              <div className="hdr-title">LAFD Knowledge Base<span className="demo-badge">Demo</span></div>
              <div className="hdr-sub">Los Angeles Fire Department - AI Policy Reference System</div>
            </div>
          </div>
          <nav aria-label="Main navigation">
            <div className="tab-bar" role="tablist" aria-label="Content sections">
              <button role="tab" aria-selected={view === "ask"} aria-controls="panel-ask" id="tab-ask" className={`tab-btn ${view === "ask" ? "active" : ""}`} onClick={() => setView("ask")}>Ask AI</button>
              <button role="tab" aria-selected={view === "browse"} aria-controls="panel-browse" id="tab-browse" className={`tab-btn ${view === "browse" ? "active" : ""}`} onClick={() => setView("browse")}>Browse</button>
              <button role="tab" aria-selected={view === "about"} aria-controls="panel-about" id="tab-about" className={`tab-btn ${view === "about" ? "active" : ""}`} onClick={() => setView("about")}>Heritage</button>
              {showAdmin && <button role="tab" aria-selected={view === "admin"} className={`tab-btn ${view === "admin" ? "active" : ""}`} onClick={() => setView("admin")}>Deploy</button>}
            </div>
          </nav>
        </div>
      </header>

      <div className="hero" aria-label="LAFD firefighters battling a structure fire at night">
        <video src="/hero-video.mp4" autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", display: "block" }} aria-hidden="true" />
        <div className="hero-overlay">
          <div className="hero-est">Est. February 1, 1886 - Los Angeles, California</div>
          <h1>LAFD Knowledge Base</h1>
          <div className="hero-motto">&quot;{HERITAGE.motto}&quot;</div>
          <div className="hero-divider" aria-hidden="true" />
        </div>
      </div>

      <div className="stats-bar" aria-label="Department statistics">
        <div className="stats-bar-inner">
          <span className="stat-item"><strong>140</strong> years of service</span>
          <span className="stat-item"><strong>3,246</strong> sworn personnel</span>
          <span className="stat-item"><strong>471</strong> sq mi jurisdiction</span>
          <span className="stat-item"><strong>~4M</strong> residents protected</span>
          <span className="stat-item"><strong>Class 1</strong> rated department</span>
        </div>
      </div>

      <main id="main-content" className="main">
        {view === "ask" && (
          <div role="tabpanel" id="panel-ask" aria-labelledby="tab-ask" className="chat-wrap">
            <div className="msgs" aria-label="Conversation messages">
              {messages.length === 0 ? (
                <div className="empty">
                  <h2>What do you need to know?</h2>
                  <p>Ask any question about LAFD or LA County Fire policies, procedures, codes, and SOPs. This demo covers {POLICY_DB.length} sample policies.</p>
                  <div className="sample-grid" role="group" aria-label="Sample questions">
                    {SAMPLE_QUESTIONS.map((q, i) => (
                      <button key={i} className="sample-q" onClick={() => setQuery(q)} aria-label={"Ask: " + q}>{q}</button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={"msg " + m.role} role="article" aria-label={(m.role === "user" ? "Your question" : "Knowledge base response")}>
                    <div className="msg-label" aria-hidden="true">{m.role === "user" ? "You" : "LAFD Knowledge Base"}</div>
                    <div className="msg-bubble">{m.text}</div>
                  </div>
                ))
              )}
              {loading && (
                <div className="msg assistant" role="article" aria-label="Loading response">
                  <div className="msg-label" aria-hidden="true">LAFD Knowledge Base</div>
                  <div className="msg-bubble">Searching policies<span className="loading-dots" aria-hidden="true"></span></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
              <label htmlFor="ask-input" className="sr-only">Ask a question about fire policies</label>
              <div className="input-row">
                <input id="ask-input" ref={inputRef} placeholder="Ask about fire codes, testing schedules, SOPs, requirements..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAsk()} aria-describedby="ask-hint" />
                <button className="send-btn" onClick={handleAsk} disabled={loading || !query.trim()} aria-label={loading ? "Searching policies" : "Submit question"}>{loading ? "Searching..." : "Ask"}</button>
              </div>
              <div id="ask-hint" className="sr-only">Type your question and press Enter or click Ask</div>
            </div>
          </div>
        )}

        {view === "browse" && (
          <div role="tabpanel" id="panel-browse" aria-labelledby="tab-browse">
            <div className="browse-stats" aria-label="Database summary">
              <div className="bstat"><em>{POLICY_DB.length}</em> policies</div>
              <div className="bstat"><em>{JURISDICTIONS.length}</em> jurisdictions</div>
              <div className="bstat"><em>{CATEGORIES.length}</em> categories</div>
              <div className="bstat">Sample dataset - proof of concept</div>
            </div>
            <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
              <legend className="sr-only">Filter policies</legend>
              <div className="browse-filters">
                <label htmlFor="browse-search" className="sr-only">Search policies</label>
                <input id="browse-search" className="browse-search" placeholder="Search by keyword, title, or ID..." value={searchBrowse} onChange={e => setSearchBrowse(e.target.value)} />
                <label htmlFor="filter-cat" className="sr-only">Filter by category</label>
                <select id="filter-cat" className="filter-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <label htmlFor="filter-jur" className="sr-only">Filter by jurisdiction</label>
                <select id="filter-jur" className="filter-select" value={filterJur} onChange={e => setFilterJur(e.target.value)}>
                  <option value="All">All Jurisdictions</option>
                  {JURISDICTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
            </fieldset>
            <div className="browse-count" aria-live="polite">{filteredPolicies.length} of {POLICY_DB.length} policies</div>
            <div role="list" aria-label="Policy documents">
              {filteredPolicies.map(p => (
                <div key={p.id} role="listitem" className={"pcard " + (expandedId === p.id ? "open" : "")} onClick={() => togglePolicy(p.id)} onKeyDown={e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), togglePolicy(p.id))} tabIndex={0} aria-expanded={expandedId === p.id} aria-label={p.id + ": " + p.title}>
                  <div className="pcard-hd">
                    <div className="pcard-id" aria-hidden="true">{p.id}</div>
                    <div className="pcard-info">
                      <div className="pcard-title">{p.title}</div>
                      <div className="pcard-meta">
                        <span>{p.jurisdiction}</span><span aria-hidden="true">|</span><span>{p.source}</span><span aria-hidden="true">|</span><span>{p.category}</span>
                      </div>
                    </div>
                  </div>
                  {expandedId === p.id && <div className="pcard-body">{p.body}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "about" && (
          <div role="tabpanel" id="panel-about" aria-labelledby="tab-about" style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#c8a84e", marginBottom: 8 }}>Department Heritage</div>
              <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 26, fontWeight: 700, color: "#d4d0c4", marginBottom: 8 }}>Los Angeles Fire Department</h2>
              <p style={{ fontSize: 14, color: "#94a3be", fontStyle: "italic", lineHeight: 1.5 }}>&quot;{HERITAGE.motto}&quot;</p>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: "#a0adc0", marginBottom: 28 }}>
              <p style={{ marginBottom: 16 }}>The history of the LAFD is one of the most unique and inspiring in U.S. fire service history. Its origins trace back to 1871 when George M. Fall, the County Clerk for Los Angeles County, organized Engine Company No. 1 - a volunteer force with a hand-drawn Amoskeag fire engine.</p>
              <p style={{ marginBottom: 16 }}>On February 1, 1886, Mayor Spence signed Ordinance No. 205, officially creating the Los Angeles Fire Department. The city began paying 31 firefighters - including a Chief Engineer and Assistant Chief - for a service that 380 volunteers had provided for 15 years. By 1900, the department had grown to 18 stations, 123 firefighters, and 80 fire horses.</p>
              <p style={{ marginBottom: 16 }}>Today, the LAFD is the third-largest municipal fire department in the United States, serving approximately 4 million residents across 471 square miles. The department holds a Class 1 rating and is the founding member of FEMA California Task Force 1 for Urban Search and Rescue.</p>
              <p>From a small city of 30 square miles to a metropolis of 470+ square miles, the LAFD has served and sacrificed for generations - and continues to set the standard for fire service excellence.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }} role="list" aria-label="Department facts">
              {[
                ["Founded", HERITAGE.founded], ["Origins", HERITAGE.origins + " (volunteer)"],
                ["Ranking", HERITAGE.rank], ["Personnel", HERITAGE.personnel],
                ["Jurisdiction", HERITAGE.jurisdiction], ["Bureaus", HERITAGE.bureaus],
                ["Rating", HERITAGE.designation], ["USAR", HERITAGE.usar],
              ].map(([label, value], i) => (
                <div key={i} role="listitem" style={{ background: "rgba(200,168,78,0.04)", border: "1px solid rgba(200,168,78,0.08)", borderRadius: 6, padding: "10px 14px" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "#8899b0", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13, color: "#c4bfb0", fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", padding: "20px 0", borderTop: "1px solid rgba(200,168,78,0.1)", fontSize: 12, color: "#8899b0", fontStyle: "italic" }}>
              &quot;140 years of service to the people of Los Angeles with continuous improvements and progress to become a true Class 1 Fire Department.&quot;
            </div>
          </div>
        )}
      
        {view === "admin" && showAdmin && (
          <div role="tabpanel" style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#d4d0c4", marginBottom: 8 }}>Deploy Panel</h2>
              <p style={{ fontSize: 13, color: "#8899b0" }}>Paste updated App.jsx code below and push directly to GitHub. Vercel auto-deploys on commit.</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="deploy-pass" style={{ display: "block", fontSize: 12, color: "#8899b0", marginBottom: 4, fontWeight: 600 }}>Deploy Password</label>
              <input id="deploy-pass" type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="Enter deploy password" style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,168,78,0.12)", borderRadius: 8, color: "#e2dfd8", fontFamily: "'Libre Franklin', sans-serif", fontSize: 14, outline: "none" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="commit-msg" style={{ display: "block", fontSize: 12, color: "#8899b0", marginBottom: 4, fontWeight: 600 }}>Commit Message (optional)</label>
              <input id="commit-msg" type="text" value={commitNote} onChange={e => setCommitNote(e.target.value)} placeholder="e.g. Fix contrast, add new policy" style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,168,78,0.12)", borderRadius: 8, color: "#e2dfd8", fontFamily: "'Libre Franklin', sans-serif", fontSize: 14, outline: "none" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="deploy-code" style={{ display: "block", fontSize: 12, color: "#8899b0", marginBottom: 4, fontWeight: 600 }}>App.jsx Content</label>
              
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <label htmlFor="file-upload" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(200,168,78,0.08)", border: "1px solid rgba(200,168,78,0.2)", borderRadius: 6, color: "#c8a84e", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                  <span>Upload File</span>
                  <input id="file-upload" type="file" accept=".jsx,.js,.tsx,.ts,.txt" onChange={handleFileUpload} style={{ display: "none" }} />
                </label>
                <span style={{ fontSize: 12, color: "#596b85", alignSelf: "center" }}>or paste code below</span>
              </div>
              <textarea id="deploy-code" value={adminCode} onChange={e => setAdminCode(e.target.value)} placeholder="Paste the full contents of the updated App.jsx file here..." rows={18} style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,168,78,0.12)", borderRadius: 8, color: "#c4bfb0", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.6, outline: "none", resize: "vertical" }} />
              <div style={{ fontSize: 12, color: "#8899b0", marginTop: 4 }}>{adminCode.length > 0 ? adminCode.length.toLocaleString() + " characters" : "No content yet"}</div>
            </div>
            <button onClick={handleDeploy} disabled={deploying || !adminPass.trim() || !adminCode.trim()} style={{ width: "100%", padding: "14px", background: deploying ? "rgba(200,168,78,0.15)" : "linear-gradient(135deg, #c8a84e, #a6882e)", border: "none", borderRadius: 8, color: deploying ? "#c8a84e" : "#0d1528", fontFamily: "'Libre Franklin', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", cursor: deploying ? "not-allowed" : "pointer", opacity: (!adminPass.trim() || !adminCode.trim()) ? 0.35 : 1 }}>{deploying ? "Pushing to GitHub..." : "Deploy to Production"}</button>
            {adminMsg && (<div style={{ marginTop: 16, padding: "12px 16px", background: adminMsg.startsWith("Error") ? "rgba(220,50,50,0.1)" : "rgba(80,180,80,0.1)", border: "1px solid " + (adminMsg.startsWith("Error") ? "rgba(220,50,50,0.25)" : "rgba(80,180,80,0.25)"), borderRadius: 8, fontSize: 13, color: adminMsg.startsWith("Error") ? "#e88" : "#8c8", lineHeight: 1.5 }} role="alert">{adminMsg}</div>)}
            <div style={{ marginTop: 24, padding: "16px", background: "rgba(200,168,78,0.03)", border: "1px solid rgba(200,168,78,0.08)", borderRadius: 8, fontSize: 13, color: "#8899b0", lineHeight: 1.7 }}><strong style={{ color: "#c8a84e" }}>How this works:</strong> When you click Deploy, the code is committed to your GitHub repo via API. Vercel detects the commit and automatically rebuilds the site in about 60 seconds.</div>
          </div>
        )}
      </main>
    </div>
  );
}
