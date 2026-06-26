import React, { useState, useMemo, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scale, Banknote, LogOut, UserPlus, Heart, GraduationCap, 
  Coins, ShieldAlert, Building2, AlertTriangle, TrendingUp, 
  Search, Users, Activity, Target, ShieldCheck, Download,
  Filter, ArrowUpRight, ArrowDownRight, RefreshCw, FileText, Eye, X,
  Play, Pause, Plus, Check, CheckSquare, CheckCircle2, Sparkles, Sliders, Clipboard
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, 
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import FlipCard from "./FlipCard";

export default function CPODashboard() {
  const [activeFilter, setActiveFilter] = useState<"All" | "Red Flags" | "Trends" | "Deep Dive">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedDateRange, setSelectedDateRange] = useState("YTD");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("All Employment Types");
  const [deepDiveModule, setDeepDiveModule] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [showExportToast, setShowExportToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Weekly Attendance Heatmap filter states
  const [heatmapDayFilter, setHeatmapDayFilter] = useState<string>("All");
  const [heatmapTimeFilter, setHeatmapTimeFilter] = useState<string>("All");
  const [heatmapIntensityFilter, setHeatmapIntensityFilter] = useState<string>("All");
  const [heatmapThemeFilter, setHeatmapThemeFilter] = useState<string>("Indigo");

  // Local overrides/synchronized filters for Weekly Attendance Heatmap
  const [heatmapBranchFilter, setHeatmapBranchFilter] = useState<string>("All Branches");
  const [heatmapDeptFilter, setHeatmapDeptFilter] = useState<string>("All Departments");
  const [heatmapEmploymentFilter, setHeatmapEmploymentFilter] = useState<string>("All Employment Types");
  const [heatmapPeriodFilter, setHeatmapPeriodFilter] = useState<string>("YTD");

  // Geographic Tour / Autoplay State
  const [isTourPlaying, setIsTourPlaying] = useState<boolean>(false);

  // CPO Planner Checklist States
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [customTasks, setCustomTasks] = useState<string[]>([]);
  const [newCustomTaskText, setNewCustomTaskText] = useState<string>("");

  // Executive Briefing States
  const [isBriefingCollapsed, setIsBriefingCollapsed] = useState(false);
  const [copiedBriefing, setCopiedBriefing] = useState(false);

  // What-If Scenario States
  const [requiredOfficeDays, setRequiredOfficeDays] = useState(3);
  const [compBudgetIncrease, setCompBudgetIncrease] = useState(10); // percent
  const [wellnessProgramTier, setWellnessProgramTier] = useState<"none" | "standard" | "premium">("standard");

  // Corporate Target KPI Customization States
  const [isTargetPanelOpen, setIsTargetPanelOpen] = useState<boolean>(false);
  const [targetAttrition, setTargetAttrition] = useState<number>(5.5);
  const [targetCompliance, setTargetCompliance] = useState<number>(95.0);
  const [targetUpskilling, setTargetUpskilling] = useState<number>(80.0);
  const [targetMorale, setTargetMorale] = useState<number>(8.0);

  // Dynamic Departmental Headcount & Cost Planner States
  const [plannerDept, setPlannerDept] = useState<string>("Engineering & Product");
  const [plannerAction, setPlannerAction] = useState<"hire" | "downsize">("hire");
  const [plannerCount, setPlannerCount] = useState<number>(5);
  const [plannerSalary, setPlannerSalary] = useState<number>(1800000); // MMK monthly avg
  const [hiringSimulationLog, setHiringSimulationLog] = useState<{dept: string, count: number, action: string, cost: number, timestamp: string}[]>([]);

  // Alerts Remediation States
  const [remediatingAlertId, setRemediatingAlertId] = useState<string | null>(null);
  const [remediationSubtasks, setRemediationSubtasks] = useState<Record<string, Record<string, boolean>>>({});
  const [resolvedAlertIds, setResolvedAlertIds] = useState<Record<string, boolean>>({});

  // Legal, Compliance, & ER Risk States
  const [payEquityAdjustmentPool, setPayEquityAdjustmentPool] = useState<number>(15000000); // MMK Monthly Budget Allocation
  const [erCases, setErCases] = useState<Array<{
    id: string;
    category: string;
    severity: "Low" | "Medium" | "High" | "Critical";
    daysActive: number;
    status: "Under Review" | "Action Pending" | "Resolved";
    filingDate: string;
    summary: string;
    timeline: string[];
  }>>([
    {
      id: "ER-2026-042",
      category: "Inappropriate Communication",
      severity: "Medium",
      daysActive: 12,
      status: "Under Review",
      filingDate: "2026-06-14",
      summary: "Anonymous complaint regarding peer communication tone and branch work atmosphere in Taunggyi.",
      timeline: ["Case Registered", "Assigned to Regional ER Representative"]
    },
    {
      id: "ER-2026-059",
      category: "Shift Scheduling Discrepancy",
      severity: "High",
      daysActive: 8,
      status: "Action Pending",
      filingDate: "2026-06-18",
      summary: "Anonymous notice of unfair shift allocation and weekend rotation policy disparities in Mandalay.",
      timeline: ["Case Registered", "Schedules audited", "Branch manager interview scheduled"]
    },
    {
      id: "ER-2026-071",
      category: "Interpersonal Operational Friction",
      severity: "Low",
      daysActive: 24,
      status: "Resolved",
      filingDate: "2026-06-02",
      summary: "Inter-departmental credit assignment dispute during regional audit cycle.",
      timeline: ["Case Registered", "Joint reconciliation session completed", "Written resolution signed"]
    }
  ]);
  const [newCaseCategory, setNewCaseCategory] = useState<string>("Inappropriate Communication");
  const [newCaseSeverity, setNewCaseSeverity] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [newCaseSummary, setNewCaseSummary] = useState<string>("");
  const [showNewCaseModal, setShowNewCaseModal] = useState<boolean>(false);
  const [selectedErCaseId, setSelectedErCaseId] = useState<string | null>(null);

  const [completedFilings, setCompletedFilings] = useState<Record<string, boolean>>({
    "Union Labor Standard Disclosure": false,
    "Annual Workplace Safety Certification": true,
    "Anti-Harassment Training Audit": false,
    "Equal Pay Act Declaration": false,
  });

  // Geographic Tour effect
  useEffect(() => {
    if (!isTourPlaying) return;

    const branches = [
      "All Branches",
      "Yangon HQ",
      "Mandalay Main",
      "Naypyidaw Office",
      "Taunggyi Agency",
      "Bago Region",
      "International HQ"
    ];

    const interval = setInterval(() => {
      setHeatmapBranchFilter((prevBranch) => {
        const currentIndex = branches.indexOf(prevBranch);
        const nextIndex = (currentIndex + 1) % branches.length;
        return branches[nextIndex];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isTourPlaying]);

  // Dynamic recommendations based on current selection
  const currentRecommendations = useMemo(() => {
    const list: string[] = [];

    // Branch specific items
    if (heatmapBranchFilter === "All Branches") {
      list.push("Conduct global branch capacity safety & regulatory review");
      list.push("Standardize terminal hardware across all sub-agencies");
    } else if (heatmapBranchFilter === "Yangon HQ") {
      list.push("Address Yangon retail teller staffing deficit immediately");
      list.push("Coordinate with Yangon regional security compliance leads");
    } else if (heatmapBranchFilter === "Mandalay Main") {
      list.push("Audit Mandalay main regional branch logistics rosters");
      list.push("Expedite hiring for back-office operations in Mandalay");
    } else if (heatmapBranchFilter === "Naypyidaw Office") {
      list.push("Align public-sector staff schedules with regulatory guidelines");
      list.push("Review Naypyidaw administrative workspace density");
    } else if (heatmapBranchFilter === "Taunggyi Agency") {
      list.push("Rebalance weekend shifts to address local agency coverage gap");
      list.push("Conduct Taunggyi hardware backup and internet integrity check");
    } else if (heatmapBranchFilter === "Bago Region") {
      list.push("Deploy localized customer experience training in Bago branch");
      list.push("Audit local Bago branch cash vault accessibility safety rules");
    } else if (heatmapBranchFilter === "International HQ") {
      list.push("Verify cross-border remote work tax classification rules");
      list.push("Review international legal safety and labor audit files");
    }

    // Department specific items
    if (heatmapDeptFilter === "All Departments") {
      list.push("Harmonize inter-departmental cross-training sessions");
    } else if (heatmapDeptFilter === "Executive Management") {
      list.push("Initiate succession readiness plans for high-impact C-suite roles");
      list.push("Set up next-quarter strategic headcount projections");
    } else if (heatmapDeptFilter === "Engineering & Product") {
      list.push("Expedite Q3 Engineering salary parity reviews to curb retention risk");
      list.push("Conduct technical engineering upskilling assessment");
    } else if (heatmapDeptFilter === "Sales & Revenue") {
      list.push("Calibrate commission structure incentives to drive sales motivation");
      list.push("Conduct onboarding efficiency review for commercial hires");
    } else if (heatmapDeptFilter === "Human Resources") {
      list.push("Draft and distribute company-wide remote-first flexibility policy");
      list.push("Audit employee sentiment survey response rates");
    } else if (heatmapDeptFilter === "Finance & Legal") {
      list.push("Perform comprehensive payroll tax compliance checks for Q2");
      list.push("Compile background regulatory verification logs");
    } else if (heatmapDeptFilter === "Operations & Support") {
      list.push("Address operations front-desk shift coverage deficits");
      list.push("Audit terminal uptime and backup systems hardware clearance");
    }

    // Staff Type specific items
    if (heatmapEmploymentFilter === "All Employment Types") {
      list.push("Review general hybrid model check-in alignment records");
    } else if (heatmapEmploymentFilter === "Full-Time (FTE)") {
      list.push("Calibrate standard mental wellness and healthcare benefits packages");
    } else if (heatmapEmploymentFilter === "Part-Time") {
      list.push("Validate part-time hours tracking logs against overtime regulations");
    } else if (heatmapEmploymentFilter === "Contractors (C2C)") {
      list.push("Verify independent contractor classification contracts are up-to-date");
    } else if (heatmapEmploymentFilter === "Temporary / Seasonal") {
      list.push("Audit seasonal worker rollover dates for standard compliance");
    } else if (heatmapEmploymentFilter === "Interns") {
      list.push("Conduct midterm intern cohort feedback and mentor alignment sync");
    }

    return list;
  }, [heatmapBranchFilter, heatmapDeptFilter, heatmapEmploymentFilter]);

  // Dynamic Pay Equity Demographics Data
  const payEquityData = useMemo(() => {
    const baseData = [
      { dept: "Exec", Male: 4500000, Female: 3900000, factor: 0.04 },
      { dept: "Eng", Male: 2800000, Female: 2400000, factor: 0.026 },
      { dept: "Sales", Male: 2100000, Female: 1850000, factor: 0.016 },
      { dept: "HR", Male: 1750000, Female: 1600000, factor: 0.01 },
      { dept: "Ops", Male: 1500000, Female: 1300000, factor: 0.013 },
    ];
    
    return baseData.map(d => {
      // dynamically add from adjustment pool based on factor, capped at Male salary
      const adjustedFemale = Math.min(d.Male, d.Female + Math.round(payEquityAdjustmentPool * d.factor * 10));
      const gapPercent = d.Male > 0 ? ((d.Male - adjustedFemale) / d.Male) * 100 : 0;
      return {
        ...d,
        Female: adjustedFemale,
        gap: parseFloat(gapPercent.toFixed(1))
      };
    });
  }, [payEquityAdjustmentPool]);

  // What-If Scenario Simulator logic
  const simulatedMetrics = useMemo(() => {
    // 1. Workforce Impact Score calculation
    let officeEffect = 0;
    if (requiredOfficeDays === 1) officeEffect = 3;
    else if (requiredOfficeDays === 2) officeEffect = 7;
    else if (requiredOfficeDays === 3) officeEffect = 12;
    else if (requiredOfficeDays === 4) officeEffect = 5;
    else if (requiredOfficeDays === 5) officeEffect = -8; // Burnout/retention risk drops score

    const compEffect = compBudgetIncrease * 1.4; // max +35

    let wellnessEffect = 0;
    if (wellnessProgramTier === "none") wellnessEffect = -10;
    else if (wellnessProgramTier === "standard") wellnessEffect = 5;
    else if (wellnessProgramTier === "premium") wellnessEffect = 18;

    const rawImpact = 65 + officeEffect + compEffect + wellnessEffect;
    const impactScore = Math.min(100, Math.max(15, Math.round(rawImpact)));

    // 2. Projected Annual Attrition Rate
    // Starts at 7.5%
    let attrOfficeEffect = 0;
    if (requiredOfficeDays > 3) attrOfficeEffect = (requiredOfficeDays - 3) * 2.2; // more days, higher attrition
    else if (requiredOfficeDays < 3) attrOfficeEffect = (requiredOfficeDays - 3) * -0.8; // flexible, lower attrition

    const attrCompEffect = - (compBudgetIncrease * 0.22); // comp budget lowers attrition

    let attrWellnessEffect = 1.2;
    if (wellnessProgramTier === "standard") attrWellnessEffect = -0.5;
    else if (wellnessProgramTier === "premium") attrWellnessEffect = -1.8;

    const rawAttrition = 7.5 + attrOfficeEffect + attrCompEffect + attrWellnessEffect;
    const attritionRate = Number(Math.min(24.0, Math.max(1.2, rawAttrition)).toFixed(1));

    // 3. Projected Burnout Index (out of 10)
    // Starts at 4.5
    const boOfficeEffect = requiredOfficeDays * 0.75; // days in office increase burnout

    const boCompEffect = - (compBudgetIncrease * 0.04); // high comp slightly buffers burnout stress

    let boWellnessEffect = 1.0;
    if (wellnessProgramTier === "standard") boWellnessEffect = -0.6;
    else if (wellnessProgramTier === "premium") boWellnessEffect = -1.8;

    const rawBurnout = 2.5 + boOfficeEffect + boCompEffect + boWellnessEffect;
    const burnoutIndex = Number(Math.min(10.0, Math.max(1.0, rawBurnout)).toFixed(1));

    // 4. Financial Feasibility
    let feasibility = "Excellent";
    let feasibilityText = "Low cost burden with high policy returns.";
    let colorClass = "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500/20";
    
    const costScore = (compBudgetIncrease * 1.5) + (wellnessProgramTier === "premium" ? 15 : wellnessProgramTier === "standard" ? 5 : 0);
    if (costScore > 30) {
      feasibility = "Critical Overspend";
      feasibilityText = "Unsustainably high budget overhead.";
      colorClass = "text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-500/20";
    } else if (costScore > 18) {
      feasibility = "Moderate Strain";
      feasibilityText = "Requires Q4 finance board clearance.";
      colorClass = "text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-500/20";
    } else if (costScore > 8) {
      feasibility = "Optimal Investment";
      feasibilityText = "High ROI balanced deployment.";
      colorClass = "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500/20";
    }

    return {
      impactScore,
      attritionRate,
      burnoutIndex,
      feasibility,
      feasibilityText,
      colorClass
    };
  }, [requiredOfficeDays, compBudgetIncrease, wellnessProgramTier]);

  // Keep heatmap local controls in sync with global dashboard controls
  useEffect(() => {
    setHeatmapBranchFilter(selectedBranch);
  }, [selectedBranch]);

  useEffect(() => {
    setHeatmapDeptFilter(selectedDepartment);
  }, [selectedDepartment]);

  useEffect(() => {
    setHeatmapEmploymentFilter(selectedEmploymentType);
  }, [selectedEmploymentType]);

  useEffect(() => {
    setHeatmapPeriodFilter(selectedDateRange);
  }, [selectedDateRange]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [
    selectedBranch, selectedDepartment, selectedDateRange, selectedEmploymentType,
    heatmapBranchFilter, heatmapDeptFilter, heatmapEmploymentFilter, heatmapPeriodFilter
  ]);

  // Clipboard briefing copying helper
  const copyBriefingToClipboard = () => {
    const text = `CPO BOARD BRIEFING — STATUS REPORT [${selectedDateRange}]\n` +
      `Segment: ${selectedBranch} | ${selectedDepartment} | ${selectedEmploymentType}\n\n` +
      `• HEADCOUNT & ENGAGEMENT: Footprint is ${summaryMetrics.globalHeadcount} FTEs, with ${summaryMetrics.upskillingAdoption}% upskilling program adoption. Wellness Index: ${sentimentData.pulseScore}/10.\n` +
      `• COMPLIANCE & TURNOVER: Regulatory compliance is ${complianceData.overallRate}%. Attrition rate: ${separationsData.annualTurnoverRate}%.\n` +
      `• ACTIVE RECOMMENDATIONS:\n` +
      currentRecommendations.slice(0, 3).map((r, i) => `  ${i + 1}. ${r}`).join("\n");
      
    navigator.clipboard.writeText(text);
    setCopiedBriefing(true);
    setTimeout(() => setCopiedBriefing(false), 2000);
  };

  // Trigger brief simulation of excel/pdf exports
  const triggerExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  const [showPlannerFeedback, setShowPlannerFeedback] = useState<boolean>(false);
  const handleCommitSimulationToTasks = () => {
    const formattedAction = plannerAction === "hire" ? "Recruit" : "Restructure";
    const taskName = `💼 Plan: ${formattedAction} ${plannerCount} FTEs in ${plannerDept} (Est: ${((plannerCount * plannerSalary) / 1000000).toFixed(2)}M MMK/mo)`;
    
    if (!customTasks.includes(taskName)) {
      setCustomTasks(prev => [...prev, taskName]);
      const newLog = {
        dept: plannerDept,
        count: plannerCount,
        action: plannerAction,
        cost: plannerCount * plannerSalary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHiringSimulationLog(prev => [newLog, ...prev]);
      setShowPlannerFeedback(true);
      setTimeout(() => setShowPlannerFeedback(false), 3000);
    }
  };

  const handleResolveCase = (caseId: string, resolutionSummary: string) => {
    setErCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: "Resolved" as const,
          timeline: [...c.timeline, resolutionSummary]
        };
      }
      return c;
    }));
    
    const taskName = `⚖️ Resolve ER Case #${caseId} (Resolution pipeline certified)`;
    if (!customTasks.includes(taskName)) {
      setCustomTasks(prev => [...prev, taskName]);
    }
  };

  const handlePushTimeline = (caseId: string, auditText: string) => {
    setErCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          timeline: [...c.timeline, auditText]
        };
      }
      return c;
    }));
  };

  const handleTriggerFileCompliance = (filingName: string) => {
    setCompletedFilings(prev => ({ ...prev, [filingName]: true }));
    
    const taskName = `📜 Labor Law: File & Certify "${filingName}" with regulatory board`;
    if (!customTasks.includes(taskName)) {
      setCustomTasks(prev => [...prev, taskName]);
    }
  };

  const handleCreateNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseSummary.trim()) return;

    const newId = `ER-2026-0${Math.floor(10 + Math.random() * 90)}`;
    const newCase = {
      id: newId,
      category: newCaseCategory,
      severity: newCaseSeverity,
      daysActive: 1,
      status: "Under Review" as const,
      filingDate: new Date().toISOString().split('T')[0],
      summary: newCaseSummary,
      timeline: ["Case Registered", "System auto-routing triggered"]
    };

    setErCases(prev => [newCase, ...prev]);
    setNewCaseSummary("");
    setShowNewCaseModal(false);

    const taskName = `🚨 Investigate filed ER Case #${newId} (${newCaseCategory})`;
    if (!customTasks.includes(taskName)) {
      setCustomTasks(prev => [...prev, taskName]);
    }
  };

  const getDynamicHeatmap = (branch: string, dept: string, empType: string, period: string) => {
    // Base attendance seeds for Mon-Fri
    const baseHeatmap = [
      { day: "Mon", "08:00": 30, "10:00": 85, "12:00": 95, "14:00": 90, "16:00": 60, "18:00": 20 },
      { day: "Tue", "08:00": 40, "10:00": 90, "12:00": 98, "14:00": 92, "16:00": 65, "18:00": 25 },
      { day: "Wed", "08:00": 35, "10:00": 88, "12:00": 97, "14:00": 95, "16:00": 70, "18:00": 30 },
      { day: "Thu", "08:00": 38, "10:00": 85, "12:00": 92, "14:00": 88, "16:00": 60, "18:00": 20 },
      { day: "Fri", "08:00": 30, "10:00": 80, "12:00": 85, "14:00": 80, "16:00": 40, "18:00": 10 },
    ];

    let branchMod = 0;
    if (branch.includes("Yangon")) branchMod = 4;
    else if (branch.includes("Mandalay")) branchMod = -2;
    else if (branch.includes("Naypyidaw")) branchMod = 2;
    else if (branch.includes("Taunggyi")) branchMod = -5;
    else if (branch.includes("Bago")) branchMod = -8;
    else if (branch.includes("International")) branchMod = 5;

    let deptMod = 0;
    if (dept.includes("Engineering")) deptMod = 5;
    else if (dept.includes("Executive")) deptMod = 2;
    else if (dept.includes("Sales")) deptMod = -2;
    else if (dept.includes("Operations")) deptMod = 8;
    else if (dept.includes("Human")) deptMod = 3;
    else if (dept.includes("Finance")) deptMod = 1;

    let empMod = 0;
    if (empType.includes("Full-Time")) empMod = 6;
    else if (empType.includes("Part-Time")) empMod = -10;
    else if (empType.includes("Contractors")) empMod = -4;
    else if (empType.includes("Temporary")) empMod = -15;
    else if (empType.includes("Interns")) empMod = -12;

    let periodMod = 0;
    if (period === "Today") periodMod = 2;
    else if (period === "This Week") periodMod = 4;
    else if (period === "This Month") periodMod = 1;
    else if (period === "Last Month") periodMod = -2;
    else if (period === "Q1 2026") periodMod = -1;
    else if (period === "Q2 2026") periodMod = 3;

    const totalShift = branchMod + deptMod + empMod + periodMod;

    return baseHeatmap.map(row => {
      const newRow = { ...row };
      (["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"] as const).forEach(time => {
        let baseVal = row[time];
        if (dept.includes("Engineering") && (time === "08:00" || time === "10:00")) {
          baseVal -= 5;
        }
        if (dept.includes("Operations") && (time === "08:00" || time === "18:00")) {
          baseVal += 12;
        }
        if (empType.includes("Part-Time") && time === "16:00") {
          baseVal += 8;
        }
        
        let finalVal = baseVal + totalShift;
        finalVal = Math.max(5, Math.min(100, finalVal));
        newRow[time] = finalVal;
      });
      return newRow;
    });
  };

  // Compile Heatmap Statistics at Root level for Board Briefing & Anomaly Header use
  const heatmapStats = useMemo(() => {
    const heatmapTimes = heatmapTimeFilter === "Morning" 
      ? ["08:00", "10:00", "12:00"] 
      : heatmapTimeFilter === "Afternoon" 
        ? ["14:00", "16:00", "18:00"] 
        : ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

    const generatedHeatmap = getDynamicHeatmap(
      heatmapBranchFilter,
      heatmapDeptFilter,
      heatmapEmploymentFilter,
      heatmapPeriodFilter
    );

    const heatmapRows = heatmapDayFilter === "All" 
      ? (generatedHeatmap || []) 
      : (generatedHeatmap || []).filter(row => row.day === heatmapDayFilter);

    const allHeatmapValues = (heatmapRows || []).flatMap(row => 
      heatmapTimes.map(time => row[time as keyof typeof row] as number).filter(v => typeof v === 'number')
    );

    const averageIntensity = allHeatmapValues.length > 0 
      ? Math.round(allHeatmapValues.reduce((sum, v) => sum + v, 0) / allHeatmapValues.length)
      : 60;

    const anomaliesList = (heatmapRows || []).flatMap(row => 
      heatmapTimes.map(time => {
        const val = row[time as keyof typeof row] as number;
        if (typeof val !== 'number') return null;
        const dev = val - averageIntensity;
        if (dev >= 20) return { day: row.day, time, val, type: 'high', dev };
        if (dev <= -20) return { day: row.day, time, val, type: 'low', dev };
        return null;
      }).filter(Boolean)
    );

    const highAnomaliesCount = anomaliesList.filter(a => a?.type === 'high').length;
    const lowAnomaliesCount = anomaliesList.filter(a => a?.type === 'low').length;
    const totalAnomaliesCount = anomaliesList.length;

    return {
      averageIntensity,
      highAnomaliesCount,
      lowAnomaliesCount,
      totalAnomaliesCount,
      anomaliesList,
      heatmapTimes,
      heatmapRows
    };
  }, [heatmapDayFilter, heatmapTimeFilter, heatmapBranchFilter, heatmapDeptFilter, heatmapEmploymentFilter, heatmapPeriodFilter]);

  const { averageIntensity, totalAnomaliesCount, highAnomaliesCount, lowAnomaliesCount, anomaliesList } = heatmapStats;

  // Dynamic Data Generator based on Filters
  const {
    complianceData, payrollData, separationsData, newHiresData, sentimentData,
    successionData, capitalRoiData, retentionRiskData, capacityData, attendanceData, summaryMetrics
  } = useMemo(() => {
    // Generate a pseudo-random modifier to simulate data changing based on filter selections
    const filterHash = selectedBranch.length + selectedDepartment.length + selectedDateRange.length + selectedEmploymentType.length;
    const isDefault = selectedBranch === "All Branches" && selectedDepartment === "All Departments" && selectedDateRange === "YTD" && selectedEmploymentType === "All Employment Types";
    
    // Modifier ranges from 0.8 to 1.2
    const modifier = isDefault ? 1 : 0.8 + ((filterHash % 5) * 0.1);
    
    // Simulate alerts turning on/off based on filters
    const showRisks = modifier < 1.0;
    const showSpikes = modifier > 1.1;

    return {
      complianceData: {
        overallRate: Math.min(100, (98.4 * modifier)).toFixed(1),
        previousRate: 91.0,
        alerts: isDefault ? [
          { id: 1, type: "High Risk", text: "Outdated mandatory labor law certifications for 14 regional branch managers." },
          { id: 2, type: "Medium Risk", text: "Pending renewal of work permits for 3 foreign technical advisors expiring in 15 days." }
        ] : showRisks ? [
          { id: 1, type: "Medium Risk", text: "Filtered segment shows pending certifications." }
        ] : [],
        trends: [
          { month: "Jan", rate: Math.min(100, 91.0 * modifier) }, { month: "Feb", rate: Math.min(100, 92.5 * modifier) }, { month: "Mar", rate: Math.min(100, 94.2 * modifier) },
          { month: "Apr", rate: Math.min(100, 95.8 * modifier) }, { month: "May", rate: Math.min(100, 97.1 * modifier) }, { month: "Jun", rate: Math.min(100, 98.4 * modifier) }
        ],
        auditProgress: [
          { name: "Yangon HQ", completed: Math.min(100, 100 * modifier), pending: 0, status: "Fully Compliant" },
          { name: "Mandalay Branch", completed: Math.min(100, 96 * modifier), pending: Math.max(0, 4 * (2 - modifier)), status: "Minor Warning" },
          { name: "Naypyidaw Branch", completed: Math.min(100, 98 * modifier), pending: Math.max(0, 2 * (2 - modifier)), status: "Fully Compliant" },
          { name: "Taunggyi Branch", completed: Math.min(100, 88 * modifier), pending: Math.max(0, 12 * (2 - modifier)), status: "Pending Audit" }
        ]
      },
      payrollData: {
        monthlySpend: `MMK ${(2450000 * modifier).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        overtimeSpend: `MMK ${(145000 * modifier).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        alerts: isDefault ? [
          { id: 1, type: "Anomalous Spending", text: "Mandalay & Taunggyi branches reporting overtime hours 140% above baseline average." }
        ] : showSpikes ? [
          { id: 1, type: "Anomalous Spending", text: "Segment shows overtime spending above average." }
        ] : [],
        benefitsCostDistribution: [
          { name: "Healthcare", value: 45 }, { name: "Retirement Match", value: 25 },
          { name: "Wellness Stipends", value: 15 }, { name: "Housing/Transport Allowances", value: 15 }
        ],
        overtimeTrends: [
          { week: "Wk 1", base: 12000, actual: 12500 * modifier }, { week: "Wk 2", base: 12000, actual: 18200 * modifier },
          { week: "Wk 3", base: 12000, actual: 21500 * modifier }, { week: "Wk 4", base: 12000, actual: 14300 * modifier }
        ]
      },
      separationsData: {
        annualTurnoverRate: (5.2 * modifier).toFixed(1),
        alerts: isDefault ? [
          { id: 1, type: "Regrettable Loss", text: "Resignation spike (3 senior engineers) in Tech/Product departments within past 30 days." }
        ] : showRisks ? [
          { id: 1, type: "Regrettable Loss", text: "Elevated turnover detected in selected segment." }
        ] : [],
        exitReasons: [
          { reason: "Career Growth", percentage: 48 }, { reason: "Comp & Benefits", percentage: 24 },
          { reason: "Personal/Family", percentage: 16 }, { reason: "Burnout/Overwork", percentage: 12 }
        ],
        turnoverTrend: [
          { quarter: "Q1-25", voluntary: 1.8 * modifier, involuntary: 0.5 * modifier }, { quarter: "Q2-25", voluntary: 1.5 * modifier, involuntary: 0.4 * modifier },
          { quarter: "Q3-25", voluntary: 2.1 * modifier, involuntary: 0.6 * modifier }, { quarter: "Q4-25", voluntary: 1.2 * modifier, involuntary: 0.3 * modifier },
          { quarter: "Q1-26", voluntary: 1.6 * modifier, involuntary: 0.4 * modifier }, { quarter: "Q2-26", voluntary: 1.4 * modifier, involuntary: 0.3 * modifier }
        ]
      },
      newHiresData: {
        totalOnboarded: Math.round(114 * modifier),
        avgRampUpTime: `${Math.round(34 * modifier)} Days`,
        alerts: isDefault ? [
          { id: 1, type: "Retention Hazard", text: "Day-1 to Day-90 survival rate dropped in Sales department (currently at 82%)." }
        ] : showRisks ? [
          { id: 1, type: "Retention Hazard", text: "Survival rate concerns in the current segment." }
        ] : [],
        rampUpProgress: [
          { year: "2024 (Manual Onboarding)", days: 48 }, { year: "2025 (Intro System)", days: 41 }, { year: "2026 (Automated Workflows)", days: 34 }
        ],
        channelCost: [
          { channel: "LinkedIn Pro", hires: 52, cost: 800 }, { channel: "Internal Referrals", hires: 41, cost: 350 },
          { channel: "Agencies", hires: 12, cost: 4200 }, { channel: "Direct Careers Portal", hires: 9, cost: 150 }
        ]
      },
      sentimentData: {
        pulseScore: Math.min(10, (8.2 * modifier)).toFixed(1),
        eNPS: `+${Math.round(42 * modifier)}`,
        alerts: isDefault ? [
          { id: 1, type: "Burnout Risk", text: "Operations team showing elevated burnout index (7.8/10) with higher average slack hours." }
        ] : showRisks ? [
          { id: 1, type: "Burnout Risk", text: "Elevated burnout risk in the selected group." }
        ] : [],
        sentimentTrends: [
          { date: "Jan", satisfaction: Math.min(10, 7.4 * modifier), stress: Math.max(0, 5.8 * (2 - modifier)) }, { date: "Feb", satisfaction: Math.min(10, 7.6 * modifier), stress: Math.max(0, 5.5 * (2 - modifier)) },
          { date: "Mar", satisfaction: Math.min(10, 7.9 * modifier), stress: Math.max(0, 5.1 * (2 - modifier)) }, { date: "Apr", satisfaction: Math.min(10, 8.1 * modifier), stress: Math.max(0, 4.6 * (2 - modifier)) },
          { date: "May", satisfaction: Math.min(10, 8.2 * modifier), stress: Math.max(0, 4.2 * (2 - modifier)) }
        ],
        eNpsByBranch: [
          { name: "Yangon HQ", score: Math.round(51 * modifier) }, { name: "Mandalay", score: Math.round(28 * modifier) }, { name: "Naypyidaw", score: Math.round(45 * modifier) }, { name: "Taunggyi", score: Math.round(32 * modifier) }
        ]
      },
      successionData: {
        successionReadyPercent: Math.min(100, Math.round(84 * modifier)),
        alerts: isDefault ? [
          { id: 1, type: "Succession Gap", text: "Critical succession gap: 3 key leadership roles (Head of Treasury, Regional Director North) have no 'Ready-Now' designated successors." }
        ] : showRisks ? [
          { id: 1, type: "Succession Gap", text: "Succession gap identified for selected filter." }
        ] : [],
        nineBoxGrid: [
          { name: "Star / Future Leader", count: Math.round(18 * modifier), pct: 12 }, { name: "High Performer", count: Math.round(42 * modifier), pct: 28 },
          { name: "Solid Professional", count: Math.round(68 * modifier), pct: 45 }, { name: "Needs Improvement / Coaching", count: Math.round(22 * (2 - modifier)), pct: 15 }
        ],
        upskillingAdoption: [
          { category: "Compliance Training", rate: Math.min(100, 98 * modifier) }, { category: "Cybersecurity Basics", rate: Math.min(100, 94 * modifier) },
          { category: "Leadership Foundations", rate: Math.min(100, 76 * modifier) }, { category: "AI & Digital Skills", rate: Math.min(100, 64 * modifier) }
        ]
      },
      capitalRoiData: {
        revenuePerFte: `MMK ${(240000 * modifier).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        laborCostRoi: `${(2.4 * modifier).toFixed(1)}x`,
        alerts: isDefault ? [
          { id: 1, type: "Efficiency Warning", text: "Yangon branch revenue per FTE has dropped 4.2% due to temporary overhead capacity excess." }
        ] : showRisks ? [
          { id: 1, type: "Efficiency Warning", text: "Lower ROI efficiency detected in the selected segment." }
        ] : [],
        costDistribution: [
          { name: "Direct Salaries", spend: 1800000 * modifier }, { name: "Social Benefits", spend: 350000 * modifier },
          { name: "Sourcing & Recruiters", spend: 120000 * modifier }, { name: "Office / Hybrid Infrastructure", spend: 180000 * modifier }
        ],
        revenueToLaborTrend: [
          { quarter: "Q1-25", ratio: 2.1 * modifier }, { quarter: "Q2-25", ratio: 2.3 * modifier }, { quarter: "Q3-25", ratio: 2.4 * modifier },
          { quarter: "Q4-25", ratio: 2.2 * modifier }, { quarter: "Q1-26", ratio: 2.4 * modifier }
        ]
      },
      retentionRiskData: {
        highPerformersCount: Math.round(78 * modifier),
        identifiedRiskPercent: (12.8 * (2 - modifier)).toFixed(1), // Inverse logic - higher modifier means lower risk
        alerts: isDefault ? [
          { id: 1, type: "Flight Risk", text: "12 high-performing technical staff flagged with 'Severe Attrition Risk' due to market compensation disparities." }
        ] : showRisks ? [
          { id: 1, type: "Flight Risk", text: "Attrition risk elevated in selected group." }
        ] : [],
        retentionFactors: [
          { subject: "Base Pay", A: Math.min(100, 85 * modifier), B: 70, fullMark: 100 }, { subject: "Role Clarity", A: Math.min(100, 90 * modifier), B: 85, fullMark: 100 },
          { subject: "Connection", A: Math.min(100, 78 * modifier), B: 80, fullMark: 100 }, { subject: "Feedback", A: Math.min(100, 95 * modifier), B: 75, fullMark: 100 },
          { subject: "Growth", A: Math.min(100, 82 * modifier), B: 60, fullMark: 100 }, { subject: "Work-life", A: Math.min(100, 70 * modifier), B: 80, fullMark: 100 }
        ]
      },
      capacityData: {
        staffingLevelPercent: Math.min(100, (94.2 * modifier)).toFixed(1),
        alerts: isDefault ? [
          { id: 1, type: "Staffing Deficit", text: "Yangon Retail Branch currently operating understaffed by 15% due to high seasonal demand and unexpected sick leaves." }
        ] : showRisks ? [
          { id: 1, type: "Staffing Deficit", text: "Operating understaffed in the filtered segment." }
        ] : [],
        branchCapacityScores: [
          { branch: "Yangon Central", staffing: Math.min(100, 85 * modifier), compliance: 100, hardware: 95, safety: 98 },
          { branch: "Mandalay Main", staffing: Math.min(100, 94 * modifier), compliance: 96, hardware: 88, safety: 92 },
          { branch: "Naypyidaw Office", staffing: Math.min(100, 100 * modifier), compliance: 98, hardware: 90, safety: 100 },
          { branch: "Taunggyi Agency", staffing: Math.min(100, 98 * modifier), compliance: 88, hardware: 85, safety: 94 }
        ]
      },
      attendanceData: {
        averageRate: Math.min(100, (95.2 * modifier)).toFixed(1),
        alerts: isDefault ? [
          { id: 1, type: "Attendance Drop", text: "Unscheduled absences increased by 4% in Customer Support over the last 3 days." }
        ] : showRisks ? [
          { id: 1, type: "Attendance Drop", text: "Unscheduled absences detected in selected group." }
        ] : [],
        sevenDayTrend: [
          { day: "Mon", rate: Math.min(100, 96 * modifier) }, { day: "Tue", rate: Math.min(100, 95.5 * modifier) }, { day: "Wed", rate: Math.min(100, 97 * modifier) },
          { day: "Thu", rate: Math.min(100, 94 * modifier) }, { day: "Fri", rate: Math.min(100, 92 * modifier) }, { day: "Sat", rate: Math.min(100, 98 * modifier) }, { day: "Sun", rate: Math.min(100, 99 * modifier) }
        ],
        weeklyHeatmap: [
          // Mon
          { day: "Mon", "08:00": 30, "10:00": 85, "12:00": 95, "14:00": 90, "16:00": 60, "18:00": 20 },
          // Tue
          { day: "Tue", "08:00": 40, "10:00": 90, "12:00": 98, "14:00": 92, "16:00": 65, "18:00": 25 },
          // Wed
          { day: "Wed", "08:00": 35, "10:00": 88, "12:00": 97, "14:00": 95, "16:00": 70, "18:00": 30 },
          // Thu
          { day: "Thu", "08:00": 38, "10:00": 85, "12:00": 92, "14:00": 88, "16:00": 60, "18:00": 20 },
          // Fri
          { day: "Fri", "08:00": 30, "10:00": 80, "12:00": 85, "14:00": 80, "16:00": 40, "18:00": 10 },
        ]
      },
      summaryMetrics: {
        globalHeadcount: Math.round(1482 * modifier),
        upskillingAdoption: Math.min(100, (83.5 * modifier)).toFixed(1)
      }
    };
  }, [selectedBranch, selectedDepartment, selectedDateRange, selectedEmploymentType]);

  const colors = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

  // Aggregate list of modules and filter based on searches/filter keys
  const modules = useMemo(() => {
    return [
      {
        id: "compliance",
        title: "Compliance & Legal Add-ons",
        icon: <Scale className="w-5 h-5 text-indigo-500" />,
        stat: `${complianceData.overallRate}%`,
        statLabel: "Regulatory Compliance",
        trend: "+7.4% improvement",
        trendIsPositive: true,
        alerts: complianceData.alerts,
        hasRedFlags: complianceData.alerts.length > 0,
        info: {
          explanation: "Tracks the company's adherence to local labor laws, safety standards, and mandatory certifications.",
          calculation: "(Total Compliant Branches / Total Branches) * 100 with weighted risk deductions.",
          howToDo: "Regularly audit branch certifications, renew work permits, and schedule safety compliance checks.",
          targetFor: "Legal, HR Compliance Teams, and Branch Managers.",
          purpose: "Ensure the organization operates within legal frameworks, avoiding penalties or operational halts."
        },
        trendsNode: (
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={complianceData.trends} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis domain={[85, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ),
        deepDiveNode: (
          <div className="space-y-2 mt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Branch Audit Matrix</span>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                    <th className="py-1.5 font-semibold">Location</th>
                    <th className="py-1.5 font-semibold text-right">Audit Progress</th>
                    <th className="py-1.5 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceData.auditProgress.map((p, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-900/40 text-slate-700 dark:text-slate-300">
                      <td className="py-1 text-slate-600 dark:text-slate-400 font-medium">{p.name}</td>
                      <td className="py-1 text-right font-mono">{p.completed}%</td>
                      <td className="py-1 text-right">
                        <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-medium ${
                          p.status === "Fully Compliant" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                        }`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      },
      {
        id: "payroll",
        title: "Payroll & Benefits Analytics",
        icon: <Banknote className="w-5 h-5 text-emerald-500" />,
        stat: payrollData.monthlySpend,
        statLabel: "Monthly Spend",
        trend: "Overtime spikes detected",
        trendIsPositive: false,
        alerts: payrollData.alerts,
        hasRedFlags: payrollData.alerts.length > 0,
        info: {
          explanation: "Analyzes total compensation costs, overtime anomalies, and benefits utilization.",
          calculation: "Sum of Base Salary + Overtime + Benefits Allowances per month.",
          howToDo: "Monitor overtime spikes in real-time, adjust shift schedules, and re-allocate benefits spend.",
          targetFor: "CPO, Finance, and Compensation & Benefits (C&B) Managers.",
          purpose: "Optimize human capital costs and prevent unnecessary overtime budget overruns."
        },
        trendsNode: (
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollData.overtimeTrends} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="base" fill="#e2e8f0" radius={[4, 4, 0, 0]} className="dark:fill-slate-800" />
                <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ),
        deepDiveNode: (
          <div className="space-y-2 mt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Benefit Resource Share</span>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {payrollData.benefitsCostDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                  <span>{item.name}: <b>{item.value}%</b></span>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        id: "separations",
        title: "Separations & Exit Insights",
        icon: <LogOut className="w-5 h-5 text-rose-500" />,
        stat: `${separationsData.annualTurnoverRate}%`,
        statLabel: "Annual Attrition Rate",
        trend: "Well below market 12%",
        trendIsPositive: true,
        alerts: separationsData.alerts,
        hasRedFlags: separationsData.alerts.length > 0,
        info: {
          explanation: "Monitors employee turnover rates and categorizes exit reasons.",
          calculation: "(Number of Separations / Average Active Headcount) * 100 annualized.",
          howToDo: "Conduct robust exit interviews, analyze exit reasons, and address root causes.",
          targetFor: "CPO, Employee Relations, and Department Heads.",
          purpose: "Identify why employees leave and implement strategies to retain top talent."
        },
        trendsNode: (
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={separationsData.turnoverTrend} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="quarter" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="voluntary" stroke="#ec4899" fill="#fbcfe8" fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="involuntary" stroke="#f43f5e" fill="#ffe4e6" fillOpacity={0.05} strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ),
        deepDiveNode: (
          <div className="space-y-2 mt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Exit Reasons</span>
            <div className="space-y-1.5">
              {separationsData.exitReasons.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400">
                    <span>{item.reason}</span>
                    <span className="font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        id: "newhires",
        title: "New Hires Analytics",
        icon: <UserPlus className="w-5 h-5 text-teal-500" />,
        stat: `+${newHiresData.totalOnboarded}`,
        statLabel: "Total Headcount Added",
        trend: "Ramp speed improved 30%",
        trendIsPositive: true,
        alerts: newHiresData.alerts,
        hasRedFlags: newHiresData.alerts.length > 0,
        info: {
          explanation: "Evaluates the efficiency, cost, and speed of recruiting and onboarding new employees.",
          calculation: "Time-to-productivity measured against historical onboarding milestones.",
          howToDo: "Streamline onboarding workflows, track 30-60-90 day survival rates, and optimize sourcing channels.",
          targetFor: "Talent Acquisition and Learning & Development (L&D).",
          purpose: "Ensure new hires become productive quickly and sourcing budgets yield high ROI."
        },
        trendsNode: (
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={newHiresData.rampUpProgress} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="year" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis label={{ value: "Days", angle: -90, position: "insideLeft", fontSize: 9 }} tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="days" fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ),
        deepDiveNode: (
          <div className="space-y-2 mt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cost-per-Hire Sourcing ROI</span>
            <div className="overflow-x-auto text-[10px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                    <th>Channel</th>
                    <th className="text-right">Volume</th>
                    <th className="text-right">Cost/Hire</th>
                  </tr>
                </thead>
                <tbody>
                  {newHiresData.channelCost.map((item, index) => (
                    <tr key={index} className="text-slate-600 dark:text-slate-400">
                      <td className="py-1">{item.channel}</td>
                      <td className="text-right font-semibold">{item.hires}</td>
                      <td className="text-right font-mono text-emerald-600 dark:text-emerald-400">MMK {item.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      },
      {
        id: "sentiment",
        title: "Employee Sentiment & Wellness",
        icon: <Heart className="w-5 h-5 text-pink-500" />,
        stat: `${sentimentData.pulseScore}/10`,
        statLabel: "Wellness Score Index",
        trend: `eNPS of ${sentimentData.eNPS}`,
        trendIsPositive: true,
        alerts: sentimentData.alerts,
        hasRedFlags: sentimentData.alerts.length > 0,
        info: {
          explanation: "Measures overall employee morale, engagement (eNPS), and burnout risks.",
          calculation: "Weighted average of monthly pulse surveys and workload tracking.",
          howToDo: "Deploy anonymous pulse surveys, monitor overtime patterns, and introduce wellness initiatives.",
          targetFor: "CPO and Employee Engagement Teams.",
          purpose: "Proactively prevent burnout and maintain a healthy, motivated workforce culture."
        },
        trendsNode: (
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentData.sentimentTrends} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="satisfaction" stroke="#ec4899" fill="#fbcfe8" fillOpacity={0.2} strokeWidth={2.5} />
                <Area type="monotone" dataKey="stress" stroke="#94a3b8" fill="#e2e8f0" fillOpacity={0.05} strokeWidth={1} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ),
        deepDiveNode: (
          <div className="space-y-1.5 mt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">eNPS Support By Region</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {sentimentData.eNpsByBranch.map((branch, i) => (
                <div key={i} className="flex justify-between p-1 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 truncate">{branch.name}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">+{branch.score}</span>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        id: "succession",
        title: "Performance & Succession Readiness",
        icon: <GraduationCap className="w-5 h-5 text-amber-500" />,
        stat: `${successionData.successionReadyPercent}%`,
        statLabel: "Leadership Coverage",
        trend: "AI training rate up 14%",
        trendIsPositive: true,
        alerts: successionData.alerts,
        hasRedFlags: successionData.alerts.length > 0,
        info: {
          explanation: "Assesses workforce upskilling and the readiness of internal candidates to fill critical roles.",
          calculation: "Percentage of critical roles with at least one 'Ready-Now' designated successor.",
          howToDo: "Maintain the 9-Box talent matrix, execute upskilling programs, and mentor high-potentials.",
          targetFor: "L&D, Executives, and Department Managers.",
          purpose: "De-risk the business by ensuring leadership continuity and continuous skill growth."
        },
        trendsNode: (
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={successionData.upskillingAdoption} layout="vertical" margin={{ top: 5, right: 5, left: -5, bottom: 5 }}>
                <CartesianGrid stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} stroke="#94a3b8" />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 8 }} stroke="#94a3b8" width={75} />
                <Tooltip />
                <Bar dataKey="rate" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ),
        deepDiveNode: (
          <div className="space-y-1.5 mt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Talent Matrix 9-Box Share</span>
            <div className="grid grid-cols-2 gap-1 text-[9px]">
              {successionData.nineBoxGrid.map((cell, i) => (
                <div key={i} className="p-1 rounded bg-amber-500/5 border border-amber-500/10 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium truncate">{cell.name}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">{cell.count} ({cell.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        id: "capital",
        title: "Human Capital Cost & ROI Efficiency",
        icon: <Coins className="w-5 h-5 text-violet-500" />,
        stat: capitalRoiData.laborCostRoi,
        statLabel: "Revenue to Labor Comp Ratio",
        trend: `${capitalRoiData.revenuePerFte} revenue/FTE`,
        trendIsPositive: true,
        alerts: capitalRoiData.alerts,
        hasRedFlags: capitalRoiData.alerts.length > 0,
        info: {
          explanation: "Measures the return on investment for human capital spend compared to generated revenue.",
          calculation: "Total Gross Revenue / Total Workforce Compensation & Benefits Cost.",
          howToDo: "Analyze revenue per FTE, restructure overhead allocations, and optimize headcount capacity.",
          targetFor: "CPO, CEO, and Finance Leaders.",
          purpose: "Ensure workforce expansion scales efficiently with business growth without diluting margins."
        },
        trendsNode: (
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={capitalRoiData.revenueToLaborTrend} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="quarter" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis domain={[1.5, 3.0]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="ratio" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ),
        deepDiveNode: (
          <div className="space-y-1.5 mt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overhead Cost Allocations</span>
            <div className="space-y-1">
              {capitalRoiData.costDistribution.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[10px]">
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">MMK {(item.spend / 1000).toLocaleString()}k</span>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        id: "retention",
        title: "Talent Retention & Attrition Risk",
        icon: <ShieldAlert className="w-5 h-5 text-purple-500" />,
        stat: `${retentionRiskData.identifiedRiskPercent}%`,
        statLabel: "High Attrition Risk Share",
        trend: `${retentionRiskData.highPerformersCount} Star performers monitored`,
        trendIsPositive: false,
        alerts: retentionRiskData.alerts,
        hasRedFlags: retentionRiskData.alerts.length > 0,
        info: {
          explanation: "Identifies top-performing employees who are at high risk of resigning.",
          calculation: "Predictive model scoring based on pay parity, tenure, manager changes, and engagement.",
          howToDo: "Trigger targeted retention plans, initiate stay interviews, and adjust compensation parity.",
          targetFor: "HR Business Partners and Direct Managers.",
          purpose: "Prevent the costly loss of critical intellectual property and top talent."
        },
        trendsNode: (
          <div className="h-36 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={retentionRiskData.retentionFactors}>
                <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: "#94a3b8" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 6 }} />
                <Radar name="Market Baseline" dataKey="B" stroke="#cbd5e1" fill="#f1f5f9" fillOpacity={0.4} />
                <Radar name="Active Staff Score" dataKey="A" stroke="#a855f7" fill="#c084fc" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ),
        deepDiveNode: (
          <div className="space-y-1.5 mt-2 bg-purple-500/5 p-2 rounded-lg border border-purple-500/10 text-[10px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-1 font-bold text-purple-700 dark:text-purple-300 mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Retention Mitigation Action Plan</span>
            </div>
            <span>Triggering market pay parity adjustment alerts automatically for core product engineering cohorts on Q3 salary review cycles.</span>
          </div>
        )
      },
      {
        id: "capacity",
        title: "Workforce Capacity & Branch Readiness",
        icon: <Building2 className="w-5 h-5 text-sky-500" />,
        stat: `${capacityData.staffingLevelPercent}%`,
        statLabel: "Average Staffing Level",
        trend: "Yangon Retail Deficit detected",
        trendIsPositive: false,
        alerts: capacityData.alerts,
        hasRedFlags: capacityData.alerts.length > 0,
        info: {
          explanation: "Tracks operational readiness, staffing levels, and hardware compliance across physical locations.",
          calculation: "Weighted average of Staffing Quota, Regulatory Checks, Hardware, and Safety scores per branch.",
          howToDo: "Rebalance staffing across branches, expedite local hiring, and address hardware deficits.",
          targetFor: "Operations Directors and Regional Branch Managers.",
          purpose: "Ensure all physical locations are fully equipped and staffed to meet customer demand securely."
        },
        trendsNode: (
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityData.branchCapacityScores} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="branch" tick={{ fontSize: 8 }} stroke="#94a3b8" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="staffing" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="compliance" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ),
        deepDiveNode: (
          <div className="space-y-1.5 mt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sub-Readiness Index Score</span>
            <div className="grid grid-cols-4 gap-1 text-[8.5px] text-center font-mono">
              {capacityData.branchCapacityScores.map((b, idx) => (
                <div key={idx} className="p-1 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-700 dark:text-slate-300 truncate">{b.branch.split(" ")[0]}</div>
                  <div className="text-sky-500 font-semibold">Stf: {b.staffing}%</div>
                  <div className="text-indigo-500 font-semibold">Com: {b.compliance}%</div>
                  <div className="text-slate-400">Hdw: {b.hardware}%</div>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        id: "attendance",
        title: "Attendance Trends",
        icon: <Activity className="w-5 h-5 text-emerald-500" />,
        stat: `${attendanceData.averageRate}%`,
        statLabel: "Weekly Attendance Rate",
        trend: "Recent 4% drop in Support",
        trendIsPositive: false,
        alerts: attendanceData.alerts,
        hasRedFlags: attendanceData.alerts.length > 0,
        info: {
          explanation: "Monitors daily attendance and unscheduled absences across the organization.",
          calculation: "(Total scheduled hours - Absent hours) / Total scheduled hours * 100",
          howToDo: "Investigate localized absence spikes, address potential burnout or health issues in affected teams.",
          targetFor: "HR Managers and Team Leads.",
          purpose: "Ensure sufficient daily coverage and identify early signs of employee disengagement or burnout."
        },
        trendsNode: (
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData.sevenDayTrend} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <defs>
                  <linearGradient id="attendanceColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis domain={[90, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="rate" stroke="#10b981" fillOpacity={1} fill="url(#attendanceColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ),
        deepDiveNode: (
          <div className="space-y-1.5 mt-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10 text-[10px] text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between font-bold text-emerald-700 dark:text-emerald-300 mb-1">
              <span>Day</span>
              <span>Attendance Rate</span>
            </div>
            {attendanceData.sevenDayTrend.slice(-3).map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <span>{d.day}</span>
                <span className="font-mono">{d.rate}%</span>
              </div>
            ))}
          </div>
        )
      }
    ];
  }, [colors, complianceData, payrollData, separationsData, newHiresData, sentimentData, successionData, capitalRoiData, retentionRiskData, capacityData, attendanceData]);

  // Aggregate global counts
  const totalAlertsCount = useMemo(() => {
    return modules.reduce((acc, m) => acc + m.alerts.length, 0);
  }, [modules]);

  // Filters modules based on search terms and high level categories
  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      // Search matching
      const matchesSearch = 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.statLabel.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Tab filtering
      if (activeFilter === "Red Flags") return m.hasRedFlags;
      return true; // Trends, Deep Dive, All can be viewed inside individual modules
    });
  }, [modules, activeFilter, searchQuery]);

  // Remediation Helper functions
  const getRemediationTasks = (alertId: string, alertText: string) => {
    if (alertText.toLowerCase().includes("non-compliance") || alertText.toLowerCase().includes("compliance") || alertText.toLowerCase().includes("audit")) {
      return [
        "Review regulatory filing deadlines and identify compliance gap",
        "Draft compliance waiver and schedule direct corrective training sync"
      ];
    }
    if (alertText.toLowerCase().includes("payroll") || alertText.toLowerCase().includes("budget") || alertText.toLowerCase().includes("mismatch")) {
      return [
        "Cross-verify payroll disbursement ledger with accounting logs",
        "Draft budget adjustment proposal for direct executive sign-off"
      ];
    }
    if (alertText.toLowerCase().includes("retention") || alertText.toLowerCase().includes("turnover") || alertText.toLowerCase().includes("attrition")) {
      return [
        "Execute direct exit interview analysis & schedule team alignment check-in",
        "Propose targeted retention bonus or schedule workspace flexible tier review"
      ];
    }
    return [
      "Log internal ticket & investigate root factors in active segment",
      "Draft resolution plan and coordinate corrective action with department heads"
    ];
  };

  const handleToggleSubtask = (alertId: string, alertText: string, subtask: string) => {
    setRemediationSubtasks(prev => {
      const current = prev[alertId] || {};
      const updated = { ...current, [subtask]: !current[subtask] };
      
      // Check if all subtasks are complete
      const requiredTasks = getRemediationTasks(alertId, alertText);
      const allCompleted = requiredTasks.every(t => updated[t]);
      if (allCompleted) {
        setResolvedAlertIds(resPrev => ({ ...resPrev, [alertId]: true }));
      } else {
        setResolvedAlertIds(resPrev => ({ ...resPrev, [alertId]: false }));
      }
      
      return { ...prev, [alertId]: updated };
    });
  };

  return (
    <div className="w-full max-w-none px-0 mb-12" id="cpo-dashboard-main">
      
      {/* 1. Dashboard Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-block px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              CPO CONTROL SYSTEM v2.4
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight mt-1.5 flex items-center space-x-2">
            <span>Chief People Officer Insights</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time human capital compliance, performance tracking, cost efficiency indicators, and branch readiness.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2 pl-3 pr-8 rounded-lg font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-no-repeat bg-[position:right_10px_center]"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Last Month</option>
            <option>Q1 2026</option>
            <option>Q2 2026</option>
            <option>YTD</option>
            <option>Custom Range...</option>
          </select>

          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2 pl-3 pr-8 rounded-lg font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-no-repeat bg-[position:right_10px_center]"
          >
            <option>All Branches</option>
            <option>Yangon HQ</option>
            <option>Mandalay Main</option>
            <option>Naypyidaw Office</option>
            <option>Taunggyi Agency</option>
            <option>Bago Region</option>
            <option>International HQ</option>
          </select>

          <select 
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2 pl-3 pr-8 rounded-lg font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-no-repeat bg-[position:right_10px_center]"
          >
            <option>All Departments</option>
            <option>Executive Management</option>
            <option>Engineering & Product</option>
            <option>Sales & Revenue</option>
            <option>Human Resources</option>
            <option>Finance & Legal</option>
            <option>Operations & Support</option>
          </select>

          <select 
            value={selectedEmploymentType}
            onChange={(e) => setSelectedEmploymentType(e.target.value)}
            className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2 pl-3 pr-8 rounded-lg font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-no-repeat bg-[position:right_10px_center]"
          >
            <option>All Employment Types</option>
            <option>Full-Time (FTE)</option>
            <option>Part-Time</option>
            <option>Contractors (C2C)</option>
            <option>Temporary / Seasonal</option>
            <option>Interns</option>
          </select>

          <button
            onClick={() => setIsTargetPanelOpen(!isTargetPanelOpen)}
            className={`text-xs font-black px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 border shadow-sm cursor-pointer ${
              isTargetPanelOpen 
                ? "bg-amber-500/15 border-amber-400 text-amber-700 dark:bg-amber-500/10 dark:border-amber-900 dark:text-amber-300" 
                : "bg-indigo-600 border-indigo-500 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-800"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Target Settings</span>
          </button>

        </div>
      </div>

      {/* Target KPI Settings Panel */}
      <AnimatePresence>
        {isTargetPanelOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 mb-8 shadow-md"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Target className="w-4.5 h-4.5 text-indigo-500" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                    Corporate Target KPI Settings Panel
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Set organizational target benchmarks. Dashboard alert levels and comparison modules will update dynamically.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsTargetPanelOpen(false)}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2 py-1 rounded font-bold transition cursor-pointer"
              >
                Done
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Attrition target */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600 dark:text-slate-300">Target Attrition Limit</span>
                  <span className="text-rose-600 dark:text-rose-400 font-mono">{targetAttrition}%</span>
                </div>
                <input 
                  type="range" 
                  min="2.0" 
                  max="12.0" 
                  step="0.5"
                  value={targetAttrition}
                  onChange={(e) => setTargetAttrition(Number(e.target.value))}
                  className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <span className="text-[9px] text-slate-400 block">Maximum acceptable employee separations rate.</span>
              </div>

              {/* Compliance target */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600 dark:text-slate-300">Target Compliance Rate</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">{targetCompliance}%</span>
                </div>
                <input 
                  type="range" 
                  min="85.0" 
                  max="100.0" 
                  step="0.5"
                  value={targetCompliance}
                  onChange={(e) => setTargetCompliance(Number(e.target.value))}
                  className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[9px] text-slate-400 block">Required certification and labor law compliance level.</span>
              </div>

              {/* Upskilling target */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600 dark:text-slate-300">Upskilling Adoption Goal</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">{targetUpskilling}%</span>
                </div>
                <input 
                  type="range" 
                  min="50.0" 
                  max="100.0" 
                  step="1.0"
                  value={targetUpskilling}
                  onChange={(e) => setTargetUpskilling(Number(e.target.value))}
                  className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-[9px] text-slate-400 block">Desired workforce upskilling program enrollment.</span>
              </div>

              {/* Morale target */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600 dark:text-slate-300">Minimum Pulse Morale</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono">{targetMorale}/10</span>
                </div>
                <input 
                  type="range" 
                  min="6.0" 
                  max="9.5" 
                  step="0.1"
                  value={targetMorale}
                  onChange={(e) => setTargetMorale(Number(e.target.value))}
                  className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className="text-[9px] text-slate-400 block">Expected minimum team sentiment index score.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CPO Board-Ready Executive Briefing Panel */}
      <motion.div 
        layout
        className="bg-gradient-to-r from-indigo-50/70 via-white to-slate-50/50 dark:from-indigo-950/20 dark:via-slate-900/60 dark:to-slate-950/20 rounded-2xl border border-indigo-100/80 dark:border-indigo-950/60 p-4 md:p-5 mb-8 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0 mt-0.5 sm:mt-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex flex-wrap items-center gap-1.5">
                <span>Executive Board Briefing Generator</span>
                <span className="text-[9px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-bold font-mono whitespace-nowrap">
                  LIVE COMPILATION
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Dynamic executive narrative for <span className="font-semibold text-slate-600 dark:text-slate-300">{selectedBranch}</span> • <span className="font-semibold text-slate-600 dark:text-slate-300">{selectedDepartment}</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-2 pt-3 lg:pt-0 border-t border-indigo-100/40 lg:border-t-0">
            <button
              onClick={() => setIsBriefingCollapsed(!isBriefingCollapsed)}
              className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition"
            >
              {isBriefingCollapsed ? "Expand Briefing" : "Collapse"}
            </button>
            <button
              onClick={copyBriefingToClipboard}
              className={`text-[10px] font-extrabold px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 shadow-sm ${
                copiedBriefing 
                  ? "bg-emerald-500 text-white" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {copiedBriefing ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied Briefing!</span>
                </>
              ) : (
                <>
                  <Clipboard className="w-3 h-3" />
                  <span>Copy Board-Ready Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!isBriefingCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-4 pt-4 border-t border-dashed border-indigo-100/60 dark:border-indigo-950/40"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="space-y-1.5 p-3 rounded-xl bg-white/60 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">
                    Engagement & Morale
                  </span>
                  <p className="leading-relaxed">
                    Active footprint: <strong className="text-slate-800 dark:text-white font-mono">{summaryMetrics.globalHeadcount}</strong> FTEs. 
                    Morale index is solid at <strong className="text-slate-800 dark:text-white font-mono">{sentimentData.pulseScore}/10</strong> with a segment eNPS score of <strong className="text-slate-800 dark:text-white font-mono">{sentimentData.eNPS}</strong>. 
                    Employee upskilling program enrollment stands at <strong className="text-slate-800 dark:text-white font-mono">{summaryMetrics.upskillingAdoption}%</strong>.
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-white/60 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">
                    Operations & Compliance
                  </span>
                  <p className="leading-relaxed">
                    Average weekly attendance rate is <strong className="text-slate-800 dark:text-white font-mono">{attendanceData.averageRate}%</strong>, with a weekly attendance intensity of <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{averageIntensity}%</strong>. 
                    The segment regulatory compliance score tracks at <strong className="text-slate-800 dark:text-white font-mono">{complianceData.overallRate}%</strong> with a baseline annual attrition risk of <strong className="text-slate-800 dark:text-white font-mono">{separationsData.annualTurnoverRate}%</strong>.
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-white/60 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block">
                    Executive Focus Actions
                  </span>
                  <div className="space-y-1 font-semibold text-[10px] text-slate-700 dark:text-slate-300">
                    {currentRecommendations.slice(0, 3).map((rec, i) => (
                      <div key={i} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                        <span className="truncate">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 2. Key High-level Performance Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-5 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex items-center space-x-4 shadow-sm hover:shadow-md transition duration-300 group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition duration-500"></div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-500 shadow-inner">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] font-black text-rose-500/80 dark:text-rose-400/80 uppercase tracking-widest block mb-0.5">Critical Risks</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100">{totalAlertsCount} Alerts</span>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-4 shadow-sm hover:shadow-md transition duration-300 group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition duration-500"></div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-500 shadow-inner">
            <Users className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">Global Headcount</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100">{summaryMetrics.globalHeadcount.toLocaleString()} <span className="text-sm font-semibold text-slate-400">FTEs</span></span>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-4 shadow-sm hover:shadow-md transition duration-300 group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition duration-500"></div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-500 shadow-inner">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="relative z-10 w-full">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">Upskilling Adoption</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100">{summaryMetrics.upskillingAdoption}% <span className="text-sm font-semibold text-slate-400">Enrolled</span></span>
            <span className={`text-[8.5px] font-extrabold uppercase tracking-wide block mt-1.5 ${
              summaryMetrics.upskillingAdoption >= targetUpskilling 
                ? "text-emerald-500 dark:text-emerald-400" 
                : "text-rose-500 dark:text-rose-400"
            }`}>
              Goal: {targetUpskilling}% ({summaryMetrics.upskillingAdoption >= targetUpskilling ? `Exceeded +${(summaryMetrics.upskillingAdoption - targetUpskilling).toFixed(1)}%` : `Behind ${(summaryMetrics.upskillingAdoption - targetUpskilling).toFixed(1)}%`})
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-4 shadow-sm hover:shadow-md transition duration-300 group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition duration-500"></div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-500 shadow-inner">
            <Target className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">Leader Succession</span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100">{successionData.successionReadyPercent}% <span className="text-sm font-semibold text-slate-400">Ready</span></span>
          </div>
        </div>
      </div>

      {/* Export Feedback Toast */}
      <AnimatePresence>
        {showExportToast && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-semibold"
          >
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Excel / PDF Export compiled and downloaded successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Filter Navigation Hub */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-100 dark:border-slate-800 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: "All", label: "📋 Full Overview", count: modules.length },
            { id: "Red Flags", label: "🔴 Red Flags", count: totalAlertsCount, isBadgeRed: true },
            { id: "Trends", label: "📈 Trend Analysis", isTab: true },
            { id: "Deep Dive", label: "🔍 Deep Dive Matrices", isTab: true }
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id as any);
                  if (tab.id === "Trends" || tab.id === "Deep Dive") {
                    // Help user highlight trend graphs or sub-sections
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  isSelected 
                    ? "bg-indigo-600 text-white shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected 
                      ? "bg-white/20 text-white" 
                      : tab.isBadgeRed 
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 animate-pulse" 
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live module search query */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search HR metrics or modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-56 text-xs pl-8.5 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 4. Active Main Content Modules Grid */}
      <div className="grid grid-cols-12 gap-6 auto-rows-max">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => {
              const cardStyle = activeFilter === "All" ? [
                "col-span-12 lg:col-span-8", // 0 wide
                "col-span-12 lg:col-span-4", // 1
                "col-span-12 md:col-span-6 lg:col-span-4", // 2
                "col-span-12 md:col-span-6 lg:col-span-4", // 3
                "col-span-12 md:col-span-6 lg:col-span-4", // 4
                "col-span-12 lg:col-span-4", // 5
                "col-span-12 lg:col-span-8", // 6 wide
                "col-span-12 md:col-span-6 lg:col-span-4", // 7
              ][index % 8] : "col-span-12 md:col-span-6 lg:col-span-4";

              return (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className={`relative ${cardStyle} h-80 bg-white/90 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl animate-pulse shadow-sm p-6 flex flex-col justify-between`}
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                      <div className="w-20 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </div>
                    <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800 rounded mt-4" />
                    <div className="w-1/2 h-8 bg-slate-200 dark:bg-slate-800 rounded mt-2" />
                  </div>
                  <div className="flex-1 mt-6 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-4" />
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                    <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="w-20 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                </motion.div>
              );
            })
          ) : 
            filteredModules.map((m, index) => {
            const showRedFlagsOnly = activeFilter === "Red Flags";
            const highlightTrends = activeFilter === "Trends" || activeFilter === "All";
            const highlightDeepDive = activeFilter === "Deep Dive"; // Removed || activeFilter === "All" so Quick Drill toggle actually works on the default view

            const isFlipped = flippedCards[m.id] || false;

            const cardStyle = activeFilter === "All" ? [
              "col-span-12 lg:col-span-8", // 0 wide
              "col-span-12 lg:col-span-4", // 1
              "col-span-12 md:col-span-6 lg:col-span-4", // 2
              "col-span-12 md:col-span-6 lg:col-span-4", // 3
              "col-span-12 md:col-span-6 lg:col-span-4", // 4
              "col-span-12 lg:col-span-4", // 5
              "col-span-12 lg:col-span-8", // 6 wide
              "col-span-12 md:col-span-6 lg:col-span-4", // 7
              "col-span-12 md:col-span-6 lg:col-span-4", // 8
              "col-span-12 md:col-span-6 lg:col-span-4", // 9
            ][index % 10] : "col-span-12 md:col-span-6 lg:col-span-4";

            const gradientStyles = [
              "from-blue-500/20 via-indigo-500/5 to-transparent",
              "from-emerald-500/20 via-teal-500/5 to-transparent",
              "from-rose-500/20 via-orange-500/5 to-transparent",
              "from-purple-500/20 via-pink-500/5 to-transparent",
              "from-amber-500/20 via-orange-500/5 to-transparent",
              "from-cyan-500/20 via-blue-500/5 to-transparent",
              "from-fuchsia-500/20 via-purple-500/5 to-transparent",
              "from-red-500/20 via-rose-500/5 to-transparent",
              "from-teal-500/20 via-emerald-500/5 to-transparent",
              "from-indigo-500/20 via-blue-500/5 to-transparent",
            ][index % 10];

            return (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className={`relative ${cardStyle}`}
                style={{ perspective: 1000 }}
              >
                <FlipCard
                  id={m.id}
                  isFlipped={isFlipped}
                  onFlip={(id, flipped) => setFlippedCards(prev => ({ ...prev, [id]: flipped }))}
                  title={m.title}
                  info={m.info}
                  frontClassName={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 border flex flex-col justify-between h-full group ${
                    m.hasRedFlags && activeFilter === "Red Flags"
                      ? "border-rose-400 dark:border-rose-800 ring-2 ring-rose-400/20 dark:ring-rose-800/20 shadow-rose-500/10 hover:shadow-rose-500/20"
                      : "border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-2xl hover:shadow-indigo-500/15 dark:hover:shadow-indigo-500/10 hover:border-slate-300 dark:hover:border-slate-600"
                  } hover:-translate-y-1 transition-all duration-300 ease-out`}
                  frontContent={
                    <>
                      {/* Decorative background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradientStyles} opacity-30 dark:opacity-20 rounded-3xl pointer-events-none group-hover:opacity-40 dark:group-hover:opacity-30 transition-opacity duration-300`}></div>
                      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/40 dark:bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

                      <div className="relative z-10">
                        {/* Title & Icon Header */}
                        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/80 mb-4">
                          <div className="flex items-center space-x-2.5">
                            <div className="p-2 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                              {m.icon}
                            </div>
                            <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 tracking-tight leading-snug">
                              {m.title}
                            </h3>
                          </div>
                          
                          {/* Interactive toggles */}
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => setFlippedCards(prev => ({ ...prev, [m.id]: true }))}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors cursor-pointer"
                              title="Module Information"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setDeepDiveModule(deepDiveModule === m.id ? null : m.id)}
                              className="text-[10px] text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-semibold bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              {deepDiveModule === m.id ? "Hide Details" : "Quick Drill"}
                            </button>
                          </div>
                        </div>

                        {/* Primary stat value */}
                        <div className="flex items-baseline justify-between mb-3.5">
                          <div>
                            <span className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 block">
                              {m.stat}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              {m.statLabel}
                            </span>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-0.5 ${
                            m.trendIsPositive 
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" 
                              : "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                          }`}>
                            {m.trendIsPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            <span>{m.trend}</span>
                          </span>
                        </div>

                        {/* Custom KPI target indicator */}
                        {m.id === "compliance" && (() => {
                          const actual = parseFloat(m.stat.replace("%", ""));
                          const diff = actual - targetCompliance;
                          const isMet = diff >= 0;
                          return (
                            <div className="mt-1 mb-3.5 p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-xl flex items-center justify-between text-[10px]">
                              <span className="font-semibold text-slate-400">Target: {targetCompliance}%</span>
                              <span className={`font-black uppercase tracking-wider px-1.5 py-0.5 rounded text-[8px] ${
                                isMet 
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              }`}>
                                {isMet ? `Met (+${diff.toFixed(1)}%)` : `Below (${diff.toFixed(1)}%)`}
                              </span>
                            </div>
                          );
                        })()}

                        {m.id === "separations" && (() => {
                          const actual = parseFloat(m.stat.replace("%", ""));
                          const diff = targetAttrition - actual;
                          const isMet = diff >= 0;
                          return (
                            <div className="mt-1 mb-3.5 p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-xl flex items-center justify-between text-[10px]">
                              <span className="font-semibold text-slate-400">Target Limit: {targetAttrition}%</span>
                              <span className={`font-black uppercase tracking-wider px-1.5 py-0.5 rounded text-[8px] ${
                                isMet 
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              }`}>
                                {isMet ? `Met (-${diff.toFixed(1)}%)` : `Exceeded (+${(-diff).toFixed(1)}%)`}
                              </span>
                            </div>
                          );
                        })()}

                        {m.id === "sentiment" && (() => {
                          const actual = parseFloat(m.stat.split("/")[0]);
                          const diff = actual - targetMorale;
                          const isMet = diff >= 0;
                          return (
                            <div className="mt-1 mb-3.5 p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-xl flex items-center justify-between text-[10px]">
                              <span className="font-semibold text-slate-400">Target Morale: {targetMorale}/10</span>
                              <span className={`font-black uppercase tracking-wider px-1.5 py-0.5 rounded text-[8px] ${
                                isMet 
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              }`}>
                                {isMet ? `Met (+${diff.toFixed(1)})` : `Below (${diff.toFixed(1)})`}
                              </span>
                            </div>
                          );
                        })()}

                        {/* RED FLAGS ALERTS CONTAINER */}
                        {m.alerts.length > 0 && (
                          <div className="space-y-2 mb-4">
                            {m.alerts.map((alt) => {
                              const alertKey = `${m.id}-${alt.id}`;
                              const isResolved = !!resolvedAlertIds[alertKey];
                              const isRemediating = remediatingAlertId === alertKey;
                              const tasks = getRemediationTasks(alertKey, alt.text);
                              const completedSubtasks = remediationSubtasks[alertKey] || {};

                              return (
                                <div 
                                  key={alt.id} 
                                  className={`p-2.5 rounded-lg border transition-all duration-300 flex flex-col space-y-2 text-[11px] ${
                                    isResolved
                                      ? "bg-emerald-500/5 border-emerald-500/30 text-slate-500 dark:text-slate-400"
                                      : "bg-rose-50/70 dark:bg-rose-950/15 border-rose-100 dark:border-rose-900/30 text-slate-700 dark:text-slate-300"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start space-x-2">
                                      {isResolved ? (
                                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                      ) : (
                                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                                      )}
                                      <div className="space-y-0.5">
                                        <div className="flex items-center space-x-1.5 flex-wrap">
                                          <span className={`font-extrabold text-[10px] tracking-wider uppercase block ${isResolved ? "text-emerald-600 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>
                                            {alt.type}
                                          </span>
                                          {isResolved && (
                                            <span className="text-[8px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold px-1 py-0.2 rounded">
                                              ACTIONED & RESOLVED
                                            </span>
                                          )}
                                        </div>
                                        <span className={`leading-normal font-medium block ${isResolved ? "line-through opacity-60" : ""}`}>
                                          {alt.text}
                                        </span>
                                      </div>
                                    </div>

                                    {!isResolved && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setRemediatingAlertId(isRemediating ? null : alertKey);
                                        }}
                                        className={`px-2 py-1 text-[9px] font-extrabold rounded-md shadow-sm transition-all shrink-0 uppercase tracking-wider ${
                                          isRemediating 
                                            ? "bg-rose-200 dark:bg-rose-900 text-rose-700 dark:text-rose-300" 
                                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                        }`}
                                      >
                                        {isRemediating ? "Cancel" : "⚡ Remediate"}
                                      </button>
                                    )}
                                  </div>

                                  {/* Sliding Remediation Subtasks checklist */}
                                  <AnimatePresence>
                                    {isRemediating && !isResolved && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-white/40 dark:bg-slate-950/20 p-2.5 rounded-lg border border-dashed border-rose-200 dark:border-rose-900/40 mt-1.5 space-y-1.5"
                                      >
                                        <span className="text-[8px] font-bold text-rose-600/80 dark:text-rose-400/80 uppercase tracking-widest block">
                                          🎯 ACTIVE POLICY CORRECTION STEPS
                                        </span>
                                        <div className="space-y-1">
                                          {tasks.map((task, idx) => {
                                            const subChecked = !!completedSubtasks[task];
                                            return (
                                              <div 
                                                key={idx}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleToggleSubtask(alertKey, alt.text, task);
                                                }}
                                                className="flex items-start space-x-2 p-1.5 rounded hover:bg-white/60 dark:hover:bg-slate-950/20 cursor-pointer select-none"
                                              >
                                                <div className="mt-0.5">
                                                  {subChecked ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />
                                                  ) : (
                                                    <div className="w-3.5 h-3.5 rounded border border-rose-300 dark:border-rose-800" />
                                                  )}
                                                </div>
                                                <span className={`text-[10px] leading-snug font-medium ${subChecked ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-300"}`}>
                                                  {task}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* TRENDS CHART ELEMENT */}
                        {highlightTrends && !showRedFlagsOnly && (
                          <div className="mt-2 mb-4 bg-slate-50/50 dark:bg-slate-950/20 p-2 rounded-xl border border-slate-50 dark:border-slate-900/40">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>Historical Trendline</span>
                              </span>
                            </div>
                            {m.trendsNode}
                          </div>
                        )}

                        {/* DEEP DIVE DRILLDOWN DATA */}
                        {(highlightDeepDive || deepDiveModule === m.id) && !showRedFlagsOnly && (
                          <div className="border-t border-dashed border-slate-100 dark:border-slate-800 pt-3 mt-3.5">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                              🔍 Drilldown Detail Matrix
                            </span>
                            {m.deepDiveNode}
                          </div>
                        )}
                      </div>

                      {/* Micro Action Button Bar */}
                      <div className="border-t border-slate-50 dark:border-slate-900/60 pt-3 mt-4 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Auto Audited: 1h ago</span>
                        <button 
                          onClick={() => triggerExport()}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center space-x-0.5 cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Report PDF</span>
                        </button>
                      </div>
                    </>
                  }
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredModules.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-3xl">🔍</span>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-2">No matching HR modules found</h4>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search keywords or toggle back to "Full Overview".</p>
          </div>
        )}
      </div>

      {/* Strategic Policy "What-If" Scenario Simulator */}
      {activeFilter !== "Red Flags" && (
        <motion.div 
          layout
          className="mt-10 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm"
          id="cpo-what-if-simulator"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Sliders className="w-4 h-4 text-indigo-500" />
                <span>Strategic Policy "What-If" Scenario Simulator</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Simulate organizational policy changes and immediately evaluate projected impacts on retention, burnout, morale, and financial constraints.
              </p>
            </div>
            <span className="text-[9px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2 py-1 rounded font-bold uppercase tracking-wider leading-none">
              Decision Support Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls Column */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                ⚙️ Adjust Simulation Parameters
              </span>

              {/* Sliders */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">Required In-Office Days</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{requiredOfficeDays} Days/Wk</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={requiredOfficeDays}
                  onChange={(e) => setRequiredOfficeDays(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>1 (Highly Flexible)</span>
                  <span>5 (Fully On-Site)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">Compensation Parity Budget</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">+{compBudgetIncrease}% Increase</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="25" 
                  value={compBudgetIncrease}
                  onChange={(e) => setCompBudgetIncrease(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>0% (No Change)</span>
                  <span>+25% (Premium Parity)</span>
                </div>
              </div>

              {/* Segment Toggle */}
              <div className="space-y-2">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold block">Employee Wellness Program Support</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["none", "standard", "premium"] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setWellnessProgramTier(tier)}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                        wellnessProgramTier === tier
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {tier === "none" ? "None" : tier === "standard" ? "Standard" : "Premium Tier"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Projected Results Column */}
            <div className="lg:col-span-7 bg-slate-50/50 dark:bg-slate-950/10 p-5 rounded-2xl border border-slate-100 dark:border-slate-900/60 grid grid-cols-1 sm:grid-cols-12 gap-6">
              {/* Score circular indicators */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-200/50 dark:border-slate-800/60 pb-6 sm:pb-0 pr-0 sm:pr-6">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* SVG background circle and dynamic circle progress */}
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="8" fill="transparent" />
                    <circle cx="56" cy="56" r="48" 
                      className="stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-500 ease-out" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray="301.6" 
                      strokeDashoffset={301.6 - (301.6 * simulatedMetrics.impactScore) / 100} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="text-center z-10">
                    <span className="text-3xl font-black text-slate-800 dark:text-white font-mono leading-none">{simulatedMetrics.impactScore}</span>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mt-1">Impact Score</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium text-center mt-3 leading-relaxed max-w-[130px]">
                  Composite projection of workforce performance
                </span>
              </div>

              {/* Individual sub metrics */}
              <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projected Attrion</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-xl font-black font-mono text-slate-800 dark:text-slate-100">{simulatedMetrics.attritionRate}%</span>
                      <span className={`text-[9px] font-bold ${simulatedMetrics.attritionRate <= 5.2 ? "text-emerald-500" : "text-rose-500"}`}>
                        {simulatedMetrics.attritionRate <= 5.2 ? "↓ Low Risk" : "↑ Elevated"}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(simulatedMetrics.attritionRate / 20) * 100}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Burnout Index</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-xl font-black font-mono text-slate-800 dark:text-slate-100">{simulatedMetrics.burnoutIndex}/10</span>
                      <span className={`text-[9px] font-bold ${simulatedMetrics.burnoutIndex <= 4.0 ? "text-emerald-500" : "text-amber-500"}`}>
                        {simulatedMetrics.burnoutIndex <= 4.0 ? "Healthy" : "Overworked"}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(simulatedMetrics.burnoutIndex / 10) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${simulatedMetrics.colorClass} space-y-1`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold tracking-wider uppercase">Projected Cost Feasibility</span>
                    <span className="text-[10px] font-black underline uppercase">{simulatedMetrics.feasibility}</span>
                  </div>
                  <p className="text-[10.5px] leading-relaxed font-medium">
                    {simulatedMetrics.feasibilityText} Adjusting wellness support or target parity yields different financial constraints.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dynamic Departmental Headcount & Compensation Budget Planner */}
      {activeFilter !== "Red Flags" && (
        <motion.div 
          layout
          className="mt-10 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm"
          id="cpo-headcount-planner"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Coins className="w-4 h-4 text-emerald-500" />
                <span>Workforce Headcount & Budget Planning Board</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Model departmental hiring growth or strategic restructuring and immediately project salary budget shifts in Myanmar Kyats (MMK).
              </p>
            </div>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded font-bold uppercase tracking-wider leading-none">
              Budget Modeling Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Column 1: Parameters */}
            <div className="lg:col-span-4 space-y-5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                👥 Target Department & Scope
              </span>

              {/* Department Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Target Department</label>
                <select 
                  value={plannerDept}
                  onChange={(e) => setPlannerDept(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 py-2.5 px-3 rounded-lg font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option>Executive Management</option>
                  <option>Engineering & Product</option>
                  <option>Sales & Revenue</option>
                  <option>Human Resources</option>
                  <option>Finance & Legal</option>
                  <option>Operations & Support</option>
                </select>
              </div>

              {/* Action Toggle (Recruit vs Restructure) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Action Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlannerAction("hire")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      plannerAction === "hire"
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    ➕ Recruit (Growth)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlannerAction("downsize")}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      plannerAction === "downsize"
                        ? "bg-rose-600 border-rose-600 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    ➖ Restructure
                  </button>
                </div>
              </div>

              {/* FTE Count Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">FTE Shift Size</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{plannerCount} FTEs</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  value={plannerCount}
                  onChange={(e) => setPlannerCount(Number(e.target.value))}
                  className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>1 FTE</span>
                  <span>30 FTEs</span>
                </div>
              </div>
            </div>

            {/* Column 2: Cost Calculation */}
            <div className="lg:col-span-4 space-y-5 border-t lg:border-t-0 lg:border-l lg:border-r border-slate-100 dark:border-slate-800/80 pt-5 lg:pt-0 lg:px-6">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                💰 Salary Budget Parameters
              </span>

              {/* Monthly Average Salary Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">Avg Monthly Base Salary</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{(plannerSalary).toLocaleString()} MMK</span>
                </div>
                <input 
                  type="range" 
                  min="300000" 
                  max="5000000" 
                  step="50000"
                  value={plannerSalary}
                  onChange={(e) => setPlannerSalary(Number(e.target.value))}
                  className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>300K MMK</span>
                  <span>5.0M MMK</span>
                </div>
              </div>

              {/* Visualized Cost Projections */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Monthly Cost Impact:</span>
                  <span className={`font-mono font-black ${plannerAction === "hire" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {plannerAction === "hire" ? "+" : "-"}{(plannerCount * plannerSalary).toLocaleString()} MMK
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-200/50 dark:border-slate-800/50 pt-2.5">
                  <span className="text-slate-400 font-medium">Annualized Shift:</span>
                  <span className={`font-mono font-black ${plannerAction === "hire" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {plannerAction === "hire" ? "+" : "-"}{(plannerCount * plannerSalary * 12).toLocaleString()} MMK
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] border-t border-slate-200/50 dark:border-slate-800/50 pt-2.5 text-slate-500">
                  <span className="font-semibold">New Projected Headcount:</span>
                  <span className="font-mono font-bold">
                    {(summaryMetrics.globalHeadcount + (plannerAction === "hire" ? plannerCount : -plannerCount)).toLocaleString()} FTEs
                  </span>
                </div>
              </div>
            </div>

            {/* Column 3: Simulated Scenario Actions & Log */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                📑 Simulated Goals Log & Commit
              </span>

              <button
                type="button"
                onClick={handleCommitSimulationToTasks}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Add Goal to CPO Action Plan</span>
              </button>

              {/* Toast/Feedback Indicator */}
              <AnimatePresence>
                {showPlannerFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] rounded-lg text-center font-bold"
                  >
                    🎉 Goal successfully committed to CPO Action Plan checklist below!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Simulation Log List */}
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Simulation History:</span>
                {hiringSimulationLog.length === 0 ? (
                  <div className="text-center py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-[10px] text-slate-400">
                    No simulations logged yet. Model parameters and click add above.
                  </div>
                ) : (
                  hiringSimulationLog.map((log, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 text-[10px]">
                      <div>
                        <span className="font-extrabold text-slate-700 dark:text-slate-300 block">{log.dept}</span>
                        <span className="text-slate-400 text-[9px]">{log.timestamp} • {log.count} FTEs ({log.action === 'hire' ? 'Recruit' : 'Restructure'})</span>
                      </div>
                      <span className={`font-mono font-bold ${log.action === "hire" ? "text-emerald-600" : "text-rose-600"}`}>
                        {log.action === "hire" ? "+" : "-"}{(log.cost / 1000000).toFixed(2)}M MMK
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4.5 Legal, Compliance, & ER (Employee Relations) Risk Command Center */}
      {activeFilter !== "Red Flags" && (
        <motion.div
          layout
          className="mt-10 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm"
          id="cpo-legal-compliance-er-center"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Scale className="w-4 h-4 text-rose-500" />
                <span>Legal, Compliance & Employee Relations (ER) Risk Command Center</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Protect organizational brand, mitigate compliance liabilities, monitor pay parity ratios, and track anonymous resolution pipelines.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowNewCaseModal(true)}
                className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-sm cursor-pointer transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>File anonymous report</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Box: Pay Equity Gap Tracker (Demographics & Salaries) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  ⚖️ Pay Equity Gap Tracker
                </span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-extrabold px-1.5 py-0.5 rounded uppercase">
                  Demographics active
                </span>
              </div>

              {/* Parity Adjustment Slider */}
              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Equity Parity Fund</label>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {payEquityAdjustmentPool.toLocaleString()} MMK/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="45000000"
                  step="1000000"
                  value={payEquityAdjustmentPool}
                  onChange={(e) => setPayEquityAdjustmentPool(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-[9px] text-slate-400 leading-relaxed">
                  Drag slider to allocate capital adjustment pool. Real-time parity alignment will occur dynamically across all departmental pay buckets.
                </p>
              </div>

              {/* Recharts Bar Chart */}
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={payEquityData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="dept" 
                      tick={{ fontSize: 9, fontWeight: 700 }} 
                      stroke="#94a3b8" 
                    />
                    <YAxis 
                      tick={{ fontSize: 8, fontWeight: 500 }} 
                      stroke="#94a3b8" 
                      tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", borderRadius: "12px", border: "none", color: "#fff" }}
                      itemStyle={{ fontSize: "10px" }}
                      labelStyle={{ fontSize: "11px", fontWeight: "bold" }}
                      formatter={(value: any) => [`${Number(value).toLocaleString()} MMK`, ""]}
                    />
                    <Bar dataKey="Male" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Male Avg" />
                    <Bar dataKey="Female" fill="#ec4899" radius={[4, 4, 0, 0]} name="Female Avg" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Parity Status summary info */}
              <div className="flex justify-between items-center text-[10px] p-2 bg-rose-500/5 border border-rose-500/10 rounded-lg">
                <span className="font-semibold text-slate-500">Global Average Gap:</span>
                <span className={`font-mono font-black ${
                  payEquityAdjustmentPool >= 35000000 ? "text-emerald-500" : "text-rose-500"
                }`}>
                  {payEquityAdjustmentPool >= 42000000 ? "0.2% (Perfect Parity)" : `${(8.4 - (payEquityAdjustmentPool / 5000000)).toFixed(1)}% Disparity`}
                </span>
              </div>
            </div>

            {/* Middle Box: Harassment & Dispute Cases */}
            <div className="lg:col-span-5 space-y-4 border-t lg:border-t-0 lg:border-l lg:border-r border-slate-100 dark:border-slate-800/80 pt-5 lg:pt-0 lg:px-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  🚨 Anonymous Harassment & ER Disputes
                </span>
                <span className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 font-extrabold px-1.5 py-0.5 rounded uppercase">
                  {erCases.filter(c => c.status !== "Resolved").length} Unresolved
                </span>
              </div>

              {/* Dispute Cases Listing */}
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                {erCases.map((c) => {
                  const isSelected = selectedErCaseId === c.id;
                  return (
                    <div 
                      key={c.id} 
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-slate-50 dark:bg-slate-950/60 border-indigo-500/50 shadow-sm" 
                          : "bg-white dark:bg-slate-950/20 border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50"
                      }`}
                      onClick={() => setSelectedErCaseId(isSelected ? null : c.id)}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono text-[10px] font-extrabold text-slate-800 dark:text-slate-200">#{c.id}</span>
                          <span className={`text-[8.5px] font-black uppercase px-1.5 py-0.2 rounded ${
                            c.severity === "Critical" || c.severity === "High"
                              ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                              : c.severity === "Medium"
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          }`}>
                            {c.severity} Severity
                          </span>
                        </div>
                        <span className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                          c.status === "Resolved"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : c.status === "Action Pending"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-indigo-500/10 text-indigo-500"
                        }`}>
                          {c.status}
                        </span>
                      </div>

                      <p className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1">{c.category}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{c.summary}</p>
                      <span className="text-[9px] text-slate-400/80 block mt-2 font-mono">Date filed: {c.filingDate} • Active: {c.daysActive} days</span>

                      {/* Detail Drawer (Expanded mode) */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 space-y-3 overflow-hidden text-[10px]"
                          >
                            <div>
                              <span className="font-bold text-slate-400 uppercase tracking-widest text-[8px] block mb-1">Case Investigation Milestone Pipeline:</span>
                              <div className="flex flex-col space-y-1 pl-1.5 border-l-2 border-indigo-500/30">
                                {c.timeline.map((step, idx) => (
                                  <div key={idx} className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                                    <span className="text-indigo-500">●</span>
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {c.status !== "Resolved" ? (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResolveCase(c.id, "Facilitated mediation completed and resolution pact signed.");
                                  }}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded cursor-pointer transition text-[9px]"
                                >
                                  ✔ Facilitate Resolution
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePushTimeline(c.id, "External counsel audit initiated");
                                  }}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded cursor-pointer transition text-[9px]"
                                >
                                  ➕ Push Audit Step
                                </button>
                              </div>
                            ) : (
                              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold rounded text-center">
                                🎉 Case officially resolved, documented, and closed.
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Box: Labor Law Compliance Clock */}
            <div className="lg:col-span-3 space-y-4">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                ⏳ Labor Law Compliance Clock
              </span>

              <div className="space-y-3">
                {/* Clock Deadlines */}
                {[
                  { name: "Union Labor Standard Disclosure", days: 11, desc: "Global union transparency reporting & workforce split filing." },
                  { name: "Annual Workplace Safety Certification", days: 0, desc: "Mandatory regional branch physical safety audits & logs." },
                  { name: "Anti-Harassment Training Audit", days: 34, desc: "98% certification tracking audit for Taunggyi & Bago branches." },
                  { name: "Equal Pay Act Declaration", days: 57, desc: "Audit and disclosure files submission to standard federal board." },
                ].map((item) => {
                  const isFiled = completedFilings[item.name];
                  return (
                    <div 
                      key={item.name} 
                      className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[10.5px] text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{item.name}</span>
                        {isFiled ? (
                          <span className="text-[8.5px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded flex items-center space-x-1">
                            <Check className="w-2.5 h-2.5" />
                            <span>FILED & CERTIFIED</span>
                          </span>
                        ) : (
                          <span className="text-[8.5px] font-black bg-rose-500/15 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded font-mono">
                            {item.days} DAYS LEFT
                          </span>
                        )}
                      </div>
                      <p className="text-[9.5px] text-slate-400">{item.desc}</p>
                      
                      {!isFiled && (
                        <button
                          type="button"
                          onClick={() => handleTriggerFileCompliance(item.name)}
                          className="w-full mt-1.5 py-1 px-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[9px] rounded-lg cursor-pointer transition flex items-center justify-center space-x-1"
                        >
                          <FileText className="w-2.5 h-2.5" />
                          <span>Complete & Upload Certification Filing</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 5. Workforce Branch Readiness Matrix Grid Panel */}
      {activeFilter !== "Red Flags" && (
        <div className="mt-10 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm" id="cpo-readiness-panel">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-50 dark:border-slate-900/60">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>Workforce Capacity & Branch Readiness Ledger</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Real-time mapping of branch deployment levels, mandatory licensing, technical audits, and safety clearances.
              </p>
            </div>
            <button 
              onClick={triggerExport}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Branch Ledger</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={`skeleton-branch-${i}`} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 animate-pulse bg-slate-50 dark:bg-slate-800/20 h-[220px] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between mb-4">
                      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-4 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1"><div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div><div className="h-2 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div></div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1"><div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div><div className="h-2 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div></div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1"><div className="h-2 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div><div className="h-2 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div></div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3 flex justify-between">
                    <div className="h-2 w-1/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              ))
            ) : 
              capacityData.branchCapacityScores.map((b, i) => {
              const isYangonUnderstaffed = b.branch.includes("Yangon");
              return (
                <div 
                  key={i} 
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isYangonUnderstaffed
                      ? "border-rose-200 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/5"
                      : "border-slate-100 dark:border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-extrabold text-xs text-slate-700 dark:text-slate-300 truncate">{b.branch}</span>
                      {isYangonUnderstaffed && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 text-[8px] font-extrabold animate-pulse uppercase">
                          DEFICIT ALERT
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400 font-medium">Staffing Capacity</span>
                          <span className={`font-mono font-bold ${isYangonUnderstaffed ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>{b.staffing}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isYangonUnderstaffed ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: `${b.staffing}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400 font-medium">Regulatory Audits</span>
                          <span className="text-slate-700 dark:text-slate-300 font-mono font-bold">{b.compliance}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${b.compliance}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400 font-medium">Safety Clearance</span>
                          <span className="text-slate-700 dark:text-slate-300 font-mono font-bold">{b.safety}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-500 rounded-full" style={{ width: `${b.safety}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/60 pt-2.5 mt-4 flex items-center justify-between text-[9px]">
                    <span className="text-slate-400">System Checklist</span>
                    <span className={`font-bold px-1 py-0.2 rounded ${
                      b.compliance > 95 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20" : "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                    }`}>
                      {b.compliance > 95 ? "Passed Audit" : "Requires Review"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Weekly Attendance Intensity Heatmap */}
      {activeFilter !== "Red Flags" && (() => {
        const {
          averageIntensity,
          highAnomaliesCount,
          lowAnomaliesCount,
          totalAnomaliesCount,
          heatmapTimes,
          heatmapRows
        } = heatmapStats;

        const gridColsClass = heatmapTimes.length === 6 ? "grid-cols-7" : "grid-cols-4";

        const totalTasksCount = currentRecommendations.length + customTasks.length;
        const completedCount = [...currentRecommendations, ...customTasks].filter(t => !!completedTasks[t]).length;
        const plannerProgressPercent = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;

        const toggleTask = (taskName: string) => {
          setCompletedTasks(prev => ({
            ...prev,
            [taskName]: !prev[taskName]
          }));
        };

        const addCustomTask = (e: FormEvent) => {
          e.preventDefault();
          if (!newCustomTaskText.trim()) return;
          const taskName = newCustomTaskText.trim();
          if (!customTasks.includes(taskName)) {
            setCustomTasks(prev => [...prev, taskName]);
          }
          setNewCustomTaskText("");
        };

        const removeCustomTask = (indexToRemove: number) => {
          const taskToRemove = customTasks[indexToRemove];
          setCustomTasks(prev => prev.filter((_, idx) => idx !== indexToRemove));
          setCompletedTasks(prev => {
            const copy = { ...prev };
            delete copy[taskToRemove];
            return copy;
          });
        };

        const themeColorClass = heatmapThemeFilter === "Emerald" 
          ? "bg-emerald-500 dark:bg-emerald-600" 
          : heatmapThemeFilter === "Rose" 
            ? "bg-rose-500 dark:bg-rose-600" 
            : heatmapThemeFilter === "Amber" 
              ? "bg-amber-500 dark:bg-amber-600" 
              : "bg-indigo-500 dark:bg-indigo-600";

        const themeGradientClass = heatmapThemeFilter === "Emerald" 
          ? "from-emerald-500/10 to-emerald-500" 
          : heatmapThemeFilter === "Rose" 
            ? "from-rose-500/10 to-rose-500" 
            : heatmapThemeFilter === "Amber" 
              ? "from-amber-500/10 to-amber-500" 
              : "from-indigo-500/10 to-indigo-500";

        const isIntensityMatched = (val: number) => {
          if (heatmapIntensityFilter === "All") return true;
          if (heatmapIntensityFilter === "High") return val >= 80;
          if (heatmapIntensityFilter === "Medium") return val >= 50 && val < 80;
          if (heatmapIntensityFilter === "Low") return val < 50;
          return true;
        };

        const isAnyFilterActive = heatmapDayFilter !== "All" || 
                                 heatmapTimeFilter !== "All" || 
                                 heatmapIntensityFilter !== "All" || 
                                 heatmapThemeFilter !== "Indigo" ||
                                 heatmapBranchFilter !== selectedBranch ||
                                 heatmapDeptFilter !== selectedDepartment ||
                                 heatmapEmploymentFilter !== selectedEmploymentType ||
                                 heatmapPeriodFilter !== selectedDateRange;

        const handleResetFilters = () => {
          setHeatmapDayFilter("All");
          setHeatmapTimeFilter("All");
          setHeatmapIntensityFilter("All");
          setHeatmapThemeFilter("Indigo");
          setHeatmapBranchFilter(selectedBranch);
          setHeatmapDeptFilter(selectedDepartment);
          setHeatmapEmploymentFilter(selectedEmploymentType);
          setHeatmapPeriodFilter(selectedDateRange);
        };

        return (
          <div className="mt-10 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300" id="cpo-heatmap-panel">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6 pb-5 border-b border-slate-50 dark:border-slate-900/60">
              <div className="w-full">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <span>Weekly Attendance Intensity Heatmap</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 max-w-md">
                  Visualizing peak attendance times across the company. Adjust demographic segments or filter specific hours and intensity thresholds.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-[10px] bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/40 px-2.5 py-1 rounded-md font-semibold text-slate-600 dark:text-slate-400 flex items-center space-x-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                    <span>Weekly Average:</span>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{averageIntensity}%</span>
                  </span>
                  
                  {totalAnomaliesCount > 0 ? (
                    <span className="text-[10px] bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 dark:border-amber-500/10 px-2.5 py-1 rounded-md font-semibold text-amber-700 dark:text-amber-400 flex items-center space-x-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      <span>{totalAnomaliesCount} Anomalies</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal">({highAnomaliesCount} peaks, {lowAnomaliesCount} slumps)</span>
                    </span>
                  ) : (
                    <span className="text-[10px] bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 dark:border-emerald-500/10 px-2.5 py-1 rounded-md font-semibold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Stable Attendance</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Heatmap Filters Controller Bar */}
              <div className="flex flex-col gap-5 bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40 w-full lg:w-auto shrink-0">
                
                {/* Section 1: Demographics Group */}
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block">
                    👥 Demographic Segments
                  </span>
                  <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3">
                    {/* Branch Filter */}
                    <div className="flex flex-col min-w-0 w-full md:w-auto">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Branch</label>
                      <select 
                        value={heatmapBranchFilter}
                        onChange={(e) => {
                          setHeatmapBranchFilter(e.target.value);
                          setIsTourPlaying(false);
                        }}
                        className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:min-w-[120px]"
                      >
                        <option value="All Branches">All Branches</option>
                        <option value="Yangon HQ">Yangon HQ</option>
                        <option value="Mandalay Main">Mandalay Main</option>
                        <option value="Naypyidaw Office">Naypyidaw Office</option>
                        <option value="Taunggyi Agency">Taunggyi Agency</option>
                        <option value="Bago Region">Bago Region</option>
                        <option value="International HQ">International HQ</option>
                      </select>
                    </div>

                    {/* Department Filter */}
                    <div className="flex flex-col min-w-0 w-full md:w-auto">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Department</label>
                      <select 
                        value={heatmapDeptFilter}
                        onChange={(e) => {
                          setHeatmapDeptFilter(e.target.value);
                          setIsTourPlaying(false);
                        }}
                        className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:min-w-[120px]"
                      >
                        <option value="All Departments">All Departments</option>
                        <option value="Executive Management">Executive Management</option>
                        <option value="Engineering & Product">Engineering & Product</option>
                        <option value="Sales & Revenue">Sales & Revenue</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Finance & Legal">Finance & Legal</option>
                        <option value="Operations & Support">Operations & Support</option>
                      </select>
                    </div>

                    {/* Employment Type Filter */}
                    <div className="flex flex-col min-w-0 w-full md:w-auto">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Staff Type</label>
                      <select 
                        value={heatmapEmploymentFilter}
                        onChange={(e) => {
                          setHeatmapEmploymentFilter(e.target.value);
                          setIsTourPlaying(false);
                        }}
                        className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:min-w-[120px]"
                      >
                        <option value="All Employment Types">All Employment Types</option>
                        <option value="Full-Time (FTE)">Full-Time (FTE)</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contractors (C2C)">Contractors (C2C)</option>
                        <option value="Temporary / Seasonal">Temporary / Seasonal</option>
                        <option value="Interns">Interns</option>
                      </select>
                    </div>

                    {/* Calendar Period Filter */}
                    <div className="flex flex-col min-w-0 w-full md:w-auto">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Calendar Period</label>
                      <select 
                        value={heatmapPeriodFilter}
                        onChange={(e) => {
                          setHeatmapPeriodFilter(e.target.value);
                          setIsTourPlaying(false);
                        }}
                        className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:min-w-[120px]"
                      >
                        <option value="Today">Today</option>
                        <option value="This Week">This Week</option>
                        <option value="This Month">This Month</option>
                        <option value="Last Month">Last Month</option>
                        <option value="Q1 2026">Q1 2026</option>
                        <option value="Q2 2026">Q2 2026</option>
                        <option value="YTD">YTD</option>
                        <option value="Custom Range...">Custom Range</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Visual Filters & Themes */}
                <div className="space-y-2 pt-3.5 border-t border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block">
                    🎨 Visual Focus & Themes
                  </span>
                  <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 items-end">
                    {/* Day Filter */}
                    <div className="flex flex-col min-w-0 w-full md:w-auto">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Day Filter</label>
                      <select 
                        value={heatmapDayFilter}
                        onChange={(e) => setHeatmapDayFilter(e.target.value)}
                        className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:min-w-[120px]"
                      >
                        <option value="All">All Days</option>
                        <option value="Mon">Monday</option>
                        <option value="Tue">Tuesday</option>
                        <option value="Wed">Wednesday</option>
                        <option value="Thu">Thursday</option>
                        <option value="Fri">Friday</option>
                      </select>
                    </div>

                    {/* Time Slot Filter */}
                    <div className="flex flex-col min-w-0 w-full md:w-auto">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Hour Window</label>
                      <select 
                        value={heatmapTimeFilter}
                        onChange={(e) => setHeatmapTimeFilter(e.target.value)}
                        className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:min-w-[120px]"
                      >
                        <option value="All">All Hours</option>
                        <option value="Morning">Morning (08:00 - 12:00)</option>
                        <option value="Afternoon">Afternoon (14:00 - 18:00)</option>
                      </select>
                    </div>

                    {/* Intensity Filter */}
                    <div className="flex flex-col min-w-0 w-full md:w-auto">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Intensity</label>
                      <select 
                        value={heatmapIntensityFilter}
                        onChange={(e) => setHeatmapIntensityFilter(e.target.value)}
                        className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:min-w-[120px]"
                      >
                        <option value="All">All Levels</option>
                        <option value="High">High Peak (≥ 80%)</option>
                        <option value="Medium">Medium (50% - 79%)</option>
                        <option value="Low">Low (&lt; 50%)</option>
                      </select>
                    </div>

                    {/* Theme Color Picker */}
                    <div className="flex flex-col min-w-0 w-full md:w-auto">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Color Theme</label>
                      <select 
                        value={heatmapThemeFilter}
                        onChange={(e) => setHeatmapThemeFilter(e.target.value)}
                        className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:min-w-[120px]"
                      >
                        <option value="Indigo">Indigo Glow</option>
                        <option value="Emerald">Emerald Forest</option>
                        <option value="Rose">Rose Sunset</option>
                        <option value="Amber">Amber Flame</option>
                      </select>
                    </div>

                    {/* Reset button */}
                    {isAnyFilterActive && (
                      <div className="flex flex-col min-w-0 w-full md:w-auto">
                        <button 
                          onClick={() => {
                            handleResetFilters();
                            setIsTourPlaying(false);
                          }}
                          className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 transition active:scale-95 flex items-center justify-center space-x-1 h-[34px] w-full cursor-pointer"
                        >
                          <span>Reset Controls</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Scroll Assist Hint */}
            <div className="block lg:hidden text-center text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-3 bg-slate-50 dark:bg-slate-950/40 py-1.5 px-3 rounded-lg border border-dashed border-slate-200/60 dark:border-slate-800/60">
              👋 Drag or swipe the grid horizontally to view all daily hours
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Column Headers */}
                <div className={`grid ${gridColsClass} gap-2 mb-2`}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right pr-2 self-center">Day</div>
                  {heatmapTimes.map((time, idx) => (
                    <div key={idx} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center py-1 bg-slate-50 dark:bg-slate-900/40 rounded">{time}</div>
                  ))}
                </div>

                {/* Grid Rows */}
                <div className="space-y-2">
                  {isLoading ? (
                    Array.from({ length: heatmapDayFilter === "All" ? 5 : 1 }).map((_, rowIdx) => (
                      <div key={`skeleton-heatmap-${rowIdx}`} className={`grid ${gridColsClass} gap-2 items-center animate-pulse`}>
                        <div className="h-4 w-8 ml-auto bg-slate-200 dark:bg-slate-700 rounded pr-2"></div>
                        {Array.from({ length: heatmapTimes.length }).map((_, colIdx) => (
                          <div key={colIdx} className="h-10 rounded-md bg-slate-100 dark:bg-slate-800/50"></div>
                        ))}
                      </div>
                    ))
                  ) : heatmapRows.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                      No matching records found.
                    </div>
                  ) : (
                    heatmapRows.map((row, rowIdx) => (
                      <div key={rowIdx} className={`grid ${gridColsClass} gap-2 items-center`}>
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-300 text-right pr-2">{row.day}</div>
                        {heatmapTimes.map((time, colIdx) => {
                          const value = row[time as keyof typeof row] as number;
                          const isMatched = isIntensityMatched(value);
                          // Generate background opacity based on value
                          const opacity = Math.max(0.1, value / 100);
                          
                          // Anomaly calculation
                          const isAnomaly = Math.abs(value - averageIntensity) >= 20;
                          const isHighAnomaly = value - averageIntensity >= 20;
                          const isLowAnomaly = averageIntensity - value >= 20;
                          const deviationPercent = value - averageIntensity;
                          
                          return (
                            <motion.div 
                              key={colIdx} 
                              initial={{ opacity: 0, scale: 0.6, y: 12 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              viewport={{ once: true, margin: "-40px" }}
                              transition={{ 
                                type: "spring",
                                stiffness: 80,
                                damping: 15,
                                delay: (rowIdx * heatmapTimes.length + colIdx) * 0.025 
                              }}
                              className={`h-10 rounded-md relative flex items-center justify-center overflow-hidden group transition-all duration-300 border ${
                                isMatched 
                                  ? "border-transparent scale-100 shadow-sm" 
                                  : "border-slate-100 dark:border-slate-800/40 opacity-25 scale-[0.97]"
                              }`}
                            >
                              <div 
                                className={`absolute inset-0 transition-colors duration-300 ${
                                  isMatched ? themeColorClass : "bg-slate-200 dark:bg-slate-800"
                                }`} 
                                style={{ opacity: isMatched ? opacity : 0.05 }} 
                              />
                              
                              {/* Subtle anomaly dot in top-right corner */}
                              {isAnomaly && isMatched && (
                                <div 
                                  className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full z-25 ${
                                    isHighAnomaly 
                                      ? "bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.6)] animate-pulse" 
                                      : "bg-sky-400 shadow-[0_0_4px_rgba(56,189,248,0.6)]"
                                  }`}
                                  title={isHighAnomaly ? `High Attendance Peak (+${deviationPercent}% dev)` : `Low Attendance Slump (${deviationPercent}% dev)`}
                                />
                              )}

                              <span className={`relative z-10 text-[10px] font-black transition-opacity duration-200 ${
                                isMatched 
                                  ? "text-slate-800 dark:text-white group-hover:opacity-100" 
                                  : "text-slate-400 opacity-30 group-hover:opacity-100"
                              } ${isMatched && value > 60 ? "text-white dark:text-white opacity-90" : "opacity-80 md:opacity-40"}`}>
                                {value}%
                              </span>
                              
                              {/* Custom Hover Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                                <div className="bg-slate-950 text-white text-[9px] font-bold rounded px-2.5 py-1.5 shadow-lg whitespace-nowrap flex flex-col items-center gap-1">
                                  <span>{row.day} @ {time} — {value}% Intensity</span>
                                  {isAnomaly && (
                                    <span className={`text-[8px] font-semibold flex items-center gap-1 ${
                                      isHighAnomaly ? "text-amber-400" : "text-sky-400"
                                    }`}>
                                      <AlertTriangle className="w-2.5 h-2.5" />
                                      <span>Anomaly: {isHighAnomaly ? "+" : ""}{deviationPercent}% from avg ({averageIntensity}%)</span>
                                    </span>
                                  )}
                                </div>
                                <div className="w-1.5 h-1.5 bg-slate-950 transform rotate-45 -mt-0.5" />
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Heatmap Legend */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-50 dark:border-slate-900/60 text-[10px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                  <span className="font-semibold text-slate-400">Active Segment:</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-bold text-[9px]">
                    {heatmapBranchFilter}
                  </span>
                  <span>•</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-bold text-[9px]">
                    {heatmapDeptFilter}
                  </span>
                  <span>•</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-bold text-[9px]">
                    {heatmapEmploymentFilter}
                  </span>
                  <span>•</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-bold text-[9px]">
                    {heatmapPeriodFilter}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Low Attendance</span>
                  <div className={`w-28 h-2.5 rounded bg-gradient-to-r ${themeGradientClass}`} />
                  <span>High Peak Attendance</span>
                </div>
              </div>

              {/* CPO Strategic Action Planner */}
              <div className="border-t border-slate-100 dark:border-slate-800/60 mt-8 pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>CPO Strategic Action Planner</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Actionable strategic checkpoints automatically customized to your active segments.
                    </p>
                  </div>

                  {/* Task completion rate badge & progress */}
                  <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800/60 self-start md:self-auto">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      Completed:
                    </span>
                    <div className="w-20 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                        style={{ width: `${plannerProgressPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                      {completedCount}/{totalTasksCount} ({plannerProgressPercent}%)
                    </span>
                  </div>
                </div>

                {/* Checklist Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Recommended list */}
                  <div className="lg:col-span-7 space-y-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      📋 Automated Recommendations
                    </span>
                    
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                      {currentRecommendations.map((task, idx) => {
                        const isCompleted = !!completedTasks[task];
                        return (
                          <div 
                            key={`rec-${idx}`}
                            onClick={() => toggleTask(task)}
                            className={`flex items-start space-x-3 p-2.5 rounded-lg border transition-all duration-200 cursor-pointer select-none ${
                              isCompleted 
                                ? "bg-emerald-500/5 border-emerald-500/10 dark:bg-emerald-500/2" 
                                : "bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-950/40"
                            }`}
                          >
                            <div className="mt-0.5">
                              {isCompleted ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded border border-slate-300 dark:border-slate-700 hover:border-indigo-500 transition-colors" />
                              )}
                            </div>
                            <span className={`text-[11px] font-semibold leading-tight ${
                              isCompleted 
                                ? "text-slate-400 line-through" 
                                : "text-slate-700 dark:text-slate-300"
                            }`}>
                              {task}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom planner tasks column */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                        ✍️ Custom CPO Action Items
                      </span>

                      {customTasks.length === 0 ? (
                        <div className="py-6 text-center text-[10px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/20 dark:bg-slate-950/10 mb-3">
                          No custom actions. Use the input below to add localized goals.
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 mb-3">
                          {customTasks.map((task, idx) => {
                            const isCompleted = !!completedTasks[task];
                            return (
                              <div 
                                key={`custom-${idx}`}
                                className="flex items-center justify-between p-2 rounded-lg bg-slate-50/60 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40"
                              >
                                <div 
                                  onClick={() => toggleTask(task)}
                                  className="flex items-center space-x-2.5 cursor-pointer select-none flex-1 pr-2"
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded border border-slate-300 dark:border-slate-700" />
                                  )}
                                  <span className={`text-[10px] font-semibold break-all leading-snug ${
                                    isCompleted ? "text-slate-400 line-through" : "text-slate-600 dark:text-slate-400"
                                  }`}>
                                    {task}
                                  </span>
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeCustomTask(idx);
                                  }}
                                  className="text-slate-400 hover:text-rose-500 p-0.5 transition"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Add Custom Task Form */}
                    <form 
                      onSubmit={addCustomTask}
                      className="flex items-center space-x-1.5 mt-auto pt-2"
                    >
                      <input 
                        type="text"
                        value={newCustomTaskText}
                        onChange={(e) => setNewCustomTaskText(e.target.value)}
                        placeholder="Add custom action plan..."
                        className="flex-1 text-[10px] px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button 
                        type="submit"
                        disabled={!newCustomTaskText.trim()}
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded font-bold text-[10px] transition flex items-center space-x-1 h-[28px]"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* File Anonymous Report Modal Dialog */}
      <AnimatePresence>
        {showNewCaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                    Submit Anonymous ER Dispute Case
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNewCase} className="space-y-4">
                {/* Case Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Incident Category</label>
                  <select
                    value={newCaseCategory}
                    onChange={(e) => setNewCaseCategory(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 py-2.5 px-3 rounded-lg font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 animate-none"
                  >
                    <option>Inappropriate Communication</option>
                    <option>Shift Scheduling Discrepancy</option>
                    <option>Interpersonal Operational Friction</option>
                    <option>Wage Transparency Inquiry</option>
                    <option>Policy Interpretation Concern</option>
                  </select>
                </div>

                {/* Case Severity */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Assigned Severity level</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["Low", "Medium", "High", "Critical"] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setNewCaseSeverity(sev)}
                        className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                          newCaseSeverity === sev
                            ? "bg-rose-600 border-rose-600 text-white shadow-sm"
                            : "bg-slate-50 dark:bg-slate-950/40 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Case Summary Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Incident Narrative Summary</label>
                  <textarea
                    rows={4}
                    value={newCaseSummary}
                    onChange={(e) => setNewCaseSummary(e.target.value)}
                    placeholder="Enter anonymous details regarding dispute, branch location details, or behavioral incident timeline..."
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-lg font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <span className="text-[9px] text-slate-400 block leading-tight">
                    *ER filing is stored strictly anonymously. System metadata and user identity is decoupled prior to storage.
                  </span>
                </div>

                {/* Form Buttons */}
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewCaseModal(false)}
                    className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-xl cursor-pointer transition text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl cursor-pointer transition shadow-md"
                  >
                    Transmit Securely
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
