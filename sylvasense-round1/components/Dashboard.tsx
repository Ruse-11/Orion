 "use client";

import { useEffect, useState } from "react";
import {
  Activity, AlertTriangle, BarChart3, BrainCircuit, ChevronRight,
  CircleDot, Download, Layers3, Leaf, Map as MapIcon, RadioTower,
  ScanSearch, Satellite, ShieldCheck, TreePine, Waves, X
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { forest, forestRegions, biomassTrend, alerts, canopyGeoJson, tree } from "@/data/demo";
import MapMock from "./MapMock";

type Page = "overview" | "explorer" | "fusion" | "canopy" | "biomass" | "change" | "alerts" | "validation";

const nav: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Mission Control", icon: Activity },
  { id: "explorer", label: "Forest Explorer", icon: MapIcon },
  { id: "fusion", label: "Data Fusion", icon: Layers3 },
  { id: "canopy", label: "Canopy Intelligence", icon: ScanSearch },
  { id: "biomass", label: "Biomass & Carbon", icon: Leaf },
  { id: "change", label: "Change Detection", icon: Waves },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
  { id: "validation", label: "Validation", icon: ShieldCheck }
];

export default function Dashboard() {
  const [page, setPage] = useState<Page>("overview");
  const [layer, setLayer] = useState<"optical" | "ndvi" | "sar" | "canopy" | "biomass" | "change">("optical");
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [selectedTree, setSelectedTree] = useState(false);
  const [regionPicker, setRegionPicker] = useState(false);
  const [activeForest, setActiveForest] = useState<(typeof forestRegions)[number]>(forestRegions[0]);

  const runAnalysis = () => {
    setAnalysisRunning(true);
    setTimeout(() => {
      setAnalysisRunning(false);
      setPage("canopy");
    }, 2600);
  };

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><TreePine size={21} /></div>
          <div>
            <div className="brand-name">SYLVASENSE</div>
            <div className="brand-sub">FOREST INTELLIGENCE</div>
          </div>
        </div>

        <div className="nav-section">PLATFORM</div>
        <nav>
          {nav.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
                <Icon size={17} />
                <span>{item.label}</span>
                {page === item.id && <ChevronRight size={14} className="nav-arrow" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-card">
            <div className="system-title"><span className="pulse" /> SYSTEM ONLINE</div>
            <div className="system-line">S2 · S1 · LIDAR READY</div>
            <div className="system-line">MODEL SYLVASENSE-A1.4</div>
          </div>
          <button className="new-analysis" onClick={runAnalysis}>
            <RadioTower size={17} /> RUN NEW ANALYSIS
          </button>
        </div>
      </aside>

      <section className="main">
        <header className="topbar">
          <div>
            <div className="eyebrow">ORION-PS-03 · ROUND 1 PROTOTYPE</div>
            <h1>{page === "overview" ? "Mission Control" : nav.find(n => n.id === page)?.label}</h1>
          </div>
          <div className="top-actions">
            <button className="location-pill location-select" style={{ display: "flex" }} onClick={() => setRegionPicker(true)}><CircleDot size={13} /> {activeForest.name.replace(" Landscape", "").replace(" Forest Reserve", "").replace(" Biosphere", "")} <ChevronRight size={13}/></button>
            <div className="status-pill"><span className="pulse" /> LIVE</div>
            <button className="icon-button"><AlertTriangle size={17} /></button>
          </div>
        </header>

        {page === "overview" && <Overview forest={activeForest} setPage={setPage} setLayer={setLayer} runAnalysis={runAnalysis} />}
        {page === "explorer" && <Explorer layer={layer} setLayer={setLayer} onTree={() => setSelectedTree(true)} />}
        {page === "fusion" && <Fusion />}
        {page === "canopy" && <Canopy onTree={() => setSelectedTree(true)} />}
        {page === "biomass" && <Biomass />}
        {page === "change" && <Change onAlert={() => setPage("alerts")} />}
        {page === "alerts" && <Alerts onExplore={() => { setLayer("change"); setPage("explorer"); }} />}
        {page === "validation" && <Validation />}

        <footer className="footer">
          <span>SYLVASENSE • DEMO DATASET • ROUND 1</span>
          <span>{activeForest.name} · analysis {activeForest.analysisDate}</span>
        </footer>
      </section>

      {selectedTree && <TreePanel onClose={() => setSelectedTree(false)} />}
      {analysisRunning && <AnalysisOverlay onFinish={() => setAnalysisRunning(false)} />}
      {regionPicker && <RegionPicker active={activeForest.name} onClose={() => setRegionPicker(false)} onSelect={(next) => { setActiveForest(next); setRegionPicker(false); setPage("overview"); }} />}
    </main>
  );
}

function RegionPicker({ active, onClose, onSelect }: { active: string; onClose: () => void; onSelect: (forest: (typeof forestRegions)[number]) => void }) {
  return <div className="drawer-backdrop region-backdrop" onClick={onClose}><section className="region-picker" onClick={event => event.stopPropagation()}>
    <div className="drawer-head"><div><span className="eyebrow">DEMO OPERATING AREA</span><h2>Select forest region</h2></div><button className="icon-button" onClick={onClose}><X size={17}/></button></div>
    <p>Switching regions loads a prepared deterministic monitoring scenario. No external data source is required.</p>
    <div className="region-list">{forestRegions.map((item, index) => <button key={item.name} className={`region-option ${active === item.name ? "selected" : ""}`} onClick={() => onSelect(item)}><div className="region-marker">0{index + 1}</div><div><b>{item.name}</b><span>{item.region}</span><small>{item.areaHa} ha · {item.trees.toLocaleString()} detected trees</small></div>{active === item.name && <span className="region-active">ACTIVE</span>}</button>)}</div>
    <div className="region-note"><span className="pulse"/> All scenarios are ready for multi-sensor analysis</div>
  </section></div>;
}

function Overview({ forest: activeForest, setPage, setLayer, runAnalysis }: any) {
  return (
    <div className="content">
      <div className="hero-row">
        <div>
          <div className="tag"><Satellite size={13} /> MULTI-SENSOR FOREST ANALYSIS</div>
          <h2>From satellite signals to <span>tree-level intelligence.</span></h2>
          <p className="hero-copy">Fuse optical, SAR and structural observations to enumerate canopies, estimate biomass and detect forest change.</p>
          <div className="live-feed"><span className="pulse"/> <b>LIVE TELEMETRY</b><i/> Sentinel-1 pass synchronized <i/> Canopy model ready <i/> Last refresh 14s ago</div>
        </div>
        <button className="primary-button" onClick={runAnalysis}><RadioTower size={17} /> Start live analysis <ChevronRight size={16} /></button>
      </div>

      <div className="kpi-grid">
        <Kpi icon={<TreePine />} label="TREES DETECTED" value={activeForest.trees.toLocaleString()} delta="+3.2%" />
        <Kpi icon={<MapIcon />} label="CANOPY AREA" value={`${activeForest.areaHa} ha`} delta={`${activeForest.canopy}% coverage`} />
        <Kpi icon={<BarChart3 />} label="ABOVEGROUND BIOMASS" value={`${activeForest.agb.toLocaleString()} t`} delta={`${activeForest.biomassDensity} t/ha`} />
        <Kpi icon={<Leaf />} label="CARBON STOCK" value={`${activeForest.carbon.toLocaleString()} tC`} delta={`${activeForest.co2e.toLocaleString()} tCO₂e`} />
      </div>

      <div className="grid-main">
        <div className="panel map-panel">
          <PanelHeader title="FOREST OBSERVATION" meta="21 SEP 2026" action={<button className="text-button" onClick={() => setPage("explorer")}>Open explorer <ChevronRight size={14}/></button>} />
          <div className="map-wrap"><MapMock layer="optical" /></div>
        </div>
        <div className="panel health-panel">
          <PanelHeader title="FOREST HEALTH" meta="COMPOSITE INDEX" />
          <div className="health-score"><strong>{activeForest.health}</strong><span>/100</span></div>
          <div className="health-bar"><span style={{ width: `${activeForest.health}%` }} /></div>
          <Metric label="Vegetation health" value="91%" />
          <Metric label="Canopy integrity" value="87%" />
          <Metric label="Biomass stability" value="76%" />
          <Metric label="Change risk" value="LOW" />
          <div className="mini-alert"><AlertTriangle size={15} /><div><b>3 change zones</b><span>require review</span></div></div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="panel">
          <PanelHeader title="BIOMASS TRAJECTORY" meta="2022 — 2026" />
          <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={biomassTrend}><defs><linearGradient id="biomassFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.32}/><stop offset="100%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false}/><YAxis hide/><Tooltip contentStyle={{ background: "#071521", border: "1px solid #1e3a4d", borderRadius: 8, color: "#e6f6ff" }}/><Area type="monotone" dataKey="value" stroke="#22d3ee" fill="url(#biomassFill)" strokeWidth={2}/></AreaChart></ResponsiveContainer></div>
        </div>
        <div className="panel alerts-panel">
          <PanelHeader title="ACTIVE ALERTS" meta="3 EVENTS" action={<button className="text-button" onClick={() => setPage("change")}>View all <ChevronRight size={14}/></button>} />
          {alerts.map(a => <div className="alert-row" key={a.id}><span className={`severity ${a.severity.toLowerCase()}`} /> <div><b>{a.type}</b><span>{a.date} · {a.area}</span></div><strong>{a.confidence}%</strong></div>)}
        </div>
      </div>
    </div>
  );
}

function Explorer({ layer, setLayer, onTree }: any) {
  const layers = [
    ["optical", "True Color", Satellite], ["ndvi", "NDVI", Leaf], ["sar", "SAR VV / VH", RadioTower],
    ["canopy", "Canopy Mask", ScanSearch], ["biomass", "Biomass Density", BarChart3], ["change", "Change Heatmap", AlertTriangle]
  ];
  return <div className="content">
    <div className="section-heading"><div><div className="eyebrow">GEOSPATIAL EXPLORER</div><h2>Forest observation layers</h2></div><div className="date-pill">2024 <span>→</span> 2026</div></div>
    <div className="explorer-grid">
      <div className="panel map-panel big-map"><div className="map-wrap"><MapMock layer={layer} /></div></div>
      <div className="panel layer-panel">
        <PanelHeader title="DATA LAYERS" meta="12 AVAILABLE" />
        {layers.map(([id, name, I]) => { const Icon = I as any; return <button key={id as string} className={`layer-row ${layer === id ? "selected" : ""}`} onClick={() => setLayer(id as any)}><Icon size={16}/><span>{name as string}</span>{layer === id && <span className="layer-live">ACTIVE</span>}</button> })}
        <div className="layer-divider"/>
        <div className="small-label">OPACITY</div><input className="range" type="range" defaultValue={86}/>
        <div className="legend"><div><span className="legend-dot low"/>LOW</div><div><span className="legend-dot mid"/>MEDIUM</div><div><span className="legend-dot high"/>HIGH</div></div>
        <button className="outline-button" onClick={onTree}><ScanSearch size={15}/> Inspect canopy</button>
      </div>
    </div>
  </div>;
}

function Fusion() {
  const [optical, setOptical] = useState(true);
  return <div className="content">
    <div className="section-heading"><div><div className="eyebrow">MULTI-SENSOR PIPELINE</div><h2>Optical + SAR fusion</h2></div><div className="status-chip">FUSION READY</div></div>
    <div className="fusion-grid">
      <SensorCard type="SENTINEL-2" title="OPTICAL / MULTI-SPECTRAL" icon={<Satellite />} good={optical} onClick={() => setOptical(!optical)} />
      <div className="fusion-center"><div className="fusion-line"/><div className="fusion-node"><BrainCircuit size={21}/></div><div className="fusion-line"/></div>
      <SensorCard type="SENTINEL-1" title="SAR / RADAR" icon={<RadioTower />} good={true} />
    </div>
    <div className="fusion-process">
      <div className="process-title"><span>FUSION PIPELINE</span><span className="live-text">● PROCESSING READY</span></div>
      <ProcessStep n="01" title="Spectral feature extraction" value="12 features" />
      <ProcessStep n="02" title="SAR backscatter extraction" value="VV + VH" />
      <ProcessStep n="03" title="Multi-sensor feature fusion" value="14 dimensions" />
      <ProcessStep n="04" title="Canopy + biomass inference" value="MODEL A1.4" />
    </div>
    <div className="recovery-card">
      <div className="recovery-icon"><ShieldCheck size={20}/></div>
      <div><b>Cloud-aware sensor fallback</b><span>When optical quality drops, SAR remains available to preserve structural observations and support the fused analysis.</span></div>
      <div className={`quality ${optical ? "good" : "warn"}`}><span>OPTICAL</span><strong>{optical ? "92%" : "31%"}</strong></div>
      <div className="quality good"><span>SAR</span><strong>96%</strong></div>
    </div>
  </div>;
}

function SensorCard({ type, title, icon, good, onClick }: any) {
  return <button className="sensor-card" onClick={onClick}>
    <div className="sensor-top"><div className="sensor-icon">{icon}</div><span className="sensor-id">{type}</span><span className={`sensor-status ${good ? "" : "warning"}`}><span/> {good ? "AVAILABLE" : "CLOUD IMPACT"}</span></div>
    <h3>{title}</h3><div className="sensor-bars"><i style={{width: good ? "91%" : "27%"}}/><i style={{width: good ? "84%" : "21%"}}/><i style={{width: good ? "78%" : "17%"}}/></div>
    <div className="sensor-meta"><span>Coverage <b>{good ? "100%" : "100%"}</b></span><span>Quality <b>{good ? "HIGH" : "DEGRADED"}</b></span></div>
    {!good && <div className="sensor-note">Simulated cloud obstruction detected</div>}
  </button>;
}

function ProcessStep({ n, title, value }: any) {
  return <div className="process-step"><span className="step-number">{n}</span><span className="step-title">{title}</span><span className="step-value">{value}</span><span className="step-check">✓</span></div>;
}

function downloadGeoJson() {
  const blob = new Blob([JSON.stringify(canopyGeoJson, null, 2)], { type: "application/geo+json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sylvasense-canopy-demo.geojson";
  link.click();
  URL.revokeObjectURL(url);
}

function Canopy({ onTree }: any) {
  return <div className="content">
    <div className="section-heading"><div><div className="eyebrow">COMPUTER VISION</div><h2>Canopy intelligence</h2></div><button className="outline-button export-top" onClick={downloadGeoJson}><Download size={15}/> Export GeoJSON</button></div>
    <div className="kpi-grid three"><Kpi icon={<TreePine/>} label="INDIVIDUAL CANOPIES" value="12,482" delta="94.7% confidence"/><Kpi icon={<MapIcon/>} label="CANOPY COVERAGE" value="67.4%" delta="+1.8% vs 2024"/><Kpi icon={<ScanSearch/>} label="MEAN CANOPY AREA" value="31.2 m²" delta="per detected crown"/></div>
    <div className="canopy-grid"><div className="panel map-panel big-map"><PanelHeader title="INSTANCE SEGMENTATION" meta="MASK2FORMER / YOLOV8-OBB" /><div className="map-wrap"><MapMock layer="canopy"/><button className="tree-target" onClick={onTree}><span>+</span> TREE-08421</button></div></div>
      <div className="panel side-analysis"><PanelHeader title="DETECTION ANALYSIS" meta="12,482 OBJECTS" /><Metric label="High confidence" value="76.4%" /><Metric label="Medium confidence" value="18.1%" /><Metric label="Low confidence" value="5.5%" /><div className="confidence-bars"><i style={{width:"76%"}}/><i style={{width:"18%"}}/><i style={{width:"6%"}}/></div><div className="mini-code"><span>FeatureCollection</span><b>12,482 polygons</b><small>EPSG:4326 · GeoJSON</small></div><button className="primary-button full" onClick={downloadGeoJson}><Download size={15}/> Export canopy GeoJSON</button></div>
    </div>
  </div>;
}

function Biomass() {
  return <div className="content">
    <div className="section-heading"><div><div className="eyebrow">CARBON INTELLIGENCE</div><h2>Biomass & carbon</h2></div><div className="status-chip">MODEL A1.4</div></div>
    <div className="kpi-grid"><Kpi icon={<BarChart3/>} label="ABOVEGROUND BIOMASS" value="18,421 t" delta="47.9 t/ha"/><Kpi icon={<Leaf/>} label="CARBON STOCK" value="8,658 tC" delta="0.47 × AGB"/><Kpi icon={<Waves/>} label="CO₂ EQUIVALENT" value="31,763 tCO₂e" delta="estimated"/></div>
    <div className="grid-main"><div className="panel"><PanelHeader title="BIOMASS DENSITY" meta="SPATIAL ESTIMATE" /><div className="map-wrap"><MapMock layer="biomass"/></div></div><div className="panel formula"><PanelHeader title="MODEL FORMULATION" meta="FEATURE FUSION" /><div className="formula-box">AGB = f(<b>Canopy Area</b>, <b>NDVI</b>, <b>NDMI</b>, <b>SAR-VV</b>, <b>SAR-VH</b>, <b>Tree Density</b>)</div><div className="feature-row"><span>Canopy area</span><b>42%</b></div><div className="feature-row"><span>NDVI</span><b>28%</b></div><div className="feature-row"><span>SAR backscatter</span><b>18%</b></div><div className="feature-row"><span>Tree density</span><b>8%</b></div><div className="validation-mini"><span>R²</span><b>0.91</b><span>MAE</span><b>5.17 t/ha</b></div></div></div>
  </div>;
}

function Change({ onAlert }: { onAlert: () => void }) {
  return <div className="content"><div className="section-heading"><div><div className="eyebrow">TEMPORAL FOREST MONITORING</div><h2>What changed?</h2></div><div className="date-pill">2024 <span>→</span> 2026</div></div>
    <div className="change-hero"><div className="change-number"><span>CANOPY LOSS</span><strong>7.8%</strong><small>29.6 ha affected · 1,284 estimated trees</small></div><div className="risk"><span>FOREST RISK INDEX</span><strong>23 <small>/ 100</small></strong><div className="risk-bar"><i/></div><em>LOW · 3 zones require review</em></div></div>
    <div className="what-changed"><span>WHAT CHANGED?</span><p>Canopy loss detected across <b>29.6 ha</b>, concentrated in <b>3 hotspots</b>. The largest hotspot accounts for <b>4.7 ha</b> of affected area.</p></div>
    <div className="grid-main"><div className="panel"><PanelHeader title="DEGRADATION HEATMAP" meta="2024 → 2026" /><div className="map-wrap"><MapMock layer="change"/></div></div><div className="panel alerts-panel"><PanelHeader title="DEFORESTATION ALERTS" meta="3 EVENTS" />{alerts.map(a => <button className="alert-row alert-button" key={a.id} onClick={onAlert}><span className={`severity ${a.severity.toLowerCase()}`} /><div><b>{a.type}</b><span>{a.date} · {a.area}</span></div><strong>{a.confidence}%</strong></button>)}<button className="primary-button full" onClick={onAlert}><AlertTriangle size={15}/> Review primary alert</button></div></div>
  </div>;
}

function Alerts({ onExplore }: { onExplore: () => void }) {
  const primary = alerts[0];
  return <div className="content"><div className="section-heading"><div><div className="eyebrow">ACTION QUEUE</div><h2>Forest alerts</h2></div><div className="status-chip">3 OPEN EVENTS</div></div>
    <div className="primary-alert"><div><span>ALERT #{primary.id}</span><h3>Deforestation / degradation signal</h3><p>High-confidence canopy removal event in the southern reserve buffer. This is a deterministic prototype alert.</p></div><div className="alert-stat"><b>4.7</b><span>HECTARES AFFECTED</span></div><div className="alert-stat red"><b>93.2%</b><span>CONFIDENCE</span></div><div className="alert-risk">HIGH RISK</div></div>
    <div className="grid-main"><div className="panel"><PanelHeader title="PRIMARY HOTSPOT" meta="DETECTED 14 SEP 2026" /><div className="map-wrap"><MapMock layer="change"/></div></div><div className="panel side-analysis"><PanelHeader title="ALERT EVIDENCE" meta="A-2041" /><Metric label="Change period" value="2024 → 2026"/><Metric label="Affected area" value="4.7 ha"/><Metric label="Estimated tree loss" value="204 trees"/><Metric label="Optical quality" value="Degraded"/><Metric label="SAR evidence" value="Available"/><button className="primary-button full" onClick={onExplore}><MapIcon size={15}/> Locate hotspot in explorer</button></div></div>
  </div>;
}

function Validation() {
  return <div className="content"><div className="section-heading"><div><div className="eyebrow">MODEL GOVERNANCE</div><h2>Validation & provenance</h2></div><div className="status-chip">VERIFIED DATASET</div></div>
    <div className="validation-grid"><Kpi icon={<BrainCircuit/>} label="AGB R²" value="0.91" delta="validation set"/><Kpi icon={<Activity/>} label="MAE" value="5.17 t/ha" delta="validation set"/><Kpi icon={<ShieldCheck/>} label="RMSE" value="8.42 t/ha" delta="validation set"/><Kpi icon={<ScanSearch/>} label="SAMPLES" value="1,250" delta="validation records"/></div>
    <div className="panel audit"><PanelHeader title="CARBON AUDIT TRAIL" meta="TRACEABLE RESULT" /><div className="audit-grid"><Audit k="OPTICAL SOURCE" v="Sentinel-2 / multispectral"/><Audit k="SAR SOURCE" v="Sentinel-1 / VV + VH"/><Audit k="MODEL" v="SylvaSense-A1.4"/><Audit k="ANALYSIS DATE" v="21 Sep 2026"/><Audit k="FOREST AREA" v="384.6 ha"/><Audit k="AGB ESTIMATE" v="18,421 tonnes"/><Audit k="CARBON STOCK" v="8,658 tC"/><Audit k="CO₂ EQUIVALENT" v="31,763 tCO₂e"/></div></div>
  </div>;
}

function Audit({ k, v }: any) { return <div className="audit-item"><span>{k}</span><b>{v}</b></div>; }

function Kpi({ icon, label, value, delta }: any) {
  return <div className="kpi"><div className="kpi-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{delta}</small></div></div>;
}
function Metric({ label, value }: any) { return <div className="metric"><span>{label}</span><b>{value}</b></div>; }
function PanelHeader({ title, meta, action }: any) { return <div className="panel-header"><div><b>{title}</b><span>{meta}</span></div>{action}</div>; }

function TreePanel({ onClose }: { onClose: () => void }) {
  return <div className="drawer-backdrop" onClick={onClose}><aside className="drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">CANOPY OBJECT</span><h2>{tree.id}</h2></div><button className="icon-button" onClick={onClose}><X size={17}/></button></div><div className="tree-visual"><TreePine size={68}/><span>{tree.confidence}%</span></div><Metric label="Coordinates" value={`${tree.lat}, ${tree.lon}`} /><Metric label="Canopy area" value={`${tree.canopyArea} m²`} /><Metric label="Confidence" value={`${tree.confidence}%`} /><Metric label="Estimated biomass" value={`${tree.biomass} kg`} /><Metric label="Carbon stock" value={`${tree.carbon} kg`} /><Metric label="Health status" value={tree.health} /><button className="primary-button full" onClick={downloadGeoJson}><Download size={15}/> Add to export</button></aside></div>;
}

function AnalysisOverlay({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const steps = ["Forest boundary selected", "Sentinel-2 acquired", "Optical quality checked — cloud contamination detected", "Sentinel-1 SAR acquired — cloud independent", "Spectral + SAR feature extraction", "Multi-sensor fusion", "Canopy segmentation", "Individual tree enumeration", "Biomass regression", "Carbon calculation", "Temporal change analysis", "Alert generation", "Analysis complete"];
  useEffect(() => { const id = window.setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 210); return () => window.clearInterval(id); }, [steps.length]);
  return <div className="analysis-backdrop"><div className="analysis-modal"><div className="analysis-orb"><RadioTower size={28}/></div><div className="eyebrow">SYLVASENSE INFERENCE ENGINE</div><h2>Running forest analysis</h2><p>Simulated Round 1 inference pipeline · prepared demo dataset</p><div className="analysis-steps">{steps.map((s, i) => <div className={i <= step ? "done" : ""} key={s}><span>{i <= step ? "✓" : "○"}</span>{s}</div>)}</div><div className="progress"><i style={{width: `${Math.min(100, ((step + 1) / steps.length) * 100)}%`}}/></div><div className="analysis-foot">{Math.round(Math.min(100, ((step + 1) / steps.length) * 100))}% COMPLETE <button onClick={onFinish}>Skip</button></div></div></div>;
}
