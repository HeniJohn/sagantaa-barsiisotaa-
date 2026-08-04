import React, { useState, useEffect, useCallback, useRef } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import {
  Plus,
  Trash2,
  Users,
  BookOpen,
  Building2,
  CalendarDays,
  RefreshCw,
  AlertTriangle,
  GraduationCap,
  ClipboardList,
  Loader2,
  MoreVertical,
  Sun,
  Moon,
  Languages,
  FileDown,
  ImageDown,
  X,
  Menu,
  Info,
  Pencil,
  Check,
  LogOut,
  WifiOff,
  Eye,
  EyeOff,
  HelpCircle,
  LogIn,
  Video,
  Youtube,
} from "lucide-react";

const STORAGE_KEY = "school-schedule-data-v2";
const scheduleDocRef = doc(db, "schedules", STORAGE_KEY);

const TEACHER_COLORS = [
  { bg: "#8B7CF6", text: "#1B1440" },
  { bg: "#2DD4BF", text: "#062B27" },
  { bg: "#FB923C", text: "#3A1B04" },
  { bg: "#F472B6", text: "#3A0F27" },
  { bg: "#60A5FA", text: "#0B2447" },
  { bg: "#A3E635", text: "#1D2B04" },
  { bg: "#FBBF24", text: "#3A2504" },
  { bg: "#F87171", text: "#3A0B0B" },
];

const STRINGS = {
  om: {
    siteTitle: "Sagantaa Barsiisota Baaroo Tumsaa",
    siteSubtitle: "Wayii Torbanii",
    admin: "Bulchaa",
    teacherRole: "Barsiisaa",
    tabTeachers: "Barsiisota",
    tabClasses: "Kutaalee",
    tabSubjects: "Barnoota",
    tabAssignments: "Ramaddii",
    tabSchedule: "Sagantaa",
    add: "Dabali",
    edit: "Gulaali",
    save: "Olkaa'i",
    cancel: "Dhiisi",
    delete: "Haqi",
    teacherNamePlaceholder: "Maqaa barsiisaa galchi",
    classNamePlaceholder: "fkn. Kutaa 9A",
    subjectNamePlaceholder: "fkn. Herrega",
    noItems: "Hamma ammaatti waan galfame hin jiru",
    assignmentsTitle: "Ramaddii Barnootaa",
    assignmentsDesc:
      "Barsiisaa, barnoota, kutaa fi lakkoofsa sa'aatii torbanitti barbaachisu walitti fidi. Sagantichi ofumaan yeroo isaanii walitti hin galfamneen ni qindeessa.",
    assignmentsNeedSetup:
      'Jalqaba "Barsiisota", "Kutaalee" fi "Barnoota" galchi, ergasii ramaddii uumuu dandeessa',
    selectTeacher: "Barsiisaa",
    selectSubject: "Barnoota",
    selectClass: "Kutaa",
    periodsPerWeek: "Sa'aatii/torban",
    tableTeacher: "Barsiisaa",
    tableSubject: "Barnoota",
    tableClass: "Kutaa",
    tablePeriods: "Sa'aatii/torban",
    noAssignments: "Ramaddiin hin jiru",
    scheduleTitle: "Sagantaa",
    periodsPerDayLabel: "Sa'aatii guyyaa tokkotti",
    generateSchedule: "Sagantaa Uumi",
    generateHint: 'Jalqaba ramaddii "Ramaddii Barnootaa" jedhu keessatti galchi',
    conflictWarning: (n) =>
      `Sa'aatii ${n} bakka hin arganne — sa'aatii guyyaa tokkotti dabali ykn lakkoofsa sa'aatii ramaddii xiqqeessi.`,
    viewByClass: "Kutaan ilaali",
    viewByTeacher: "Barsiisaa ilaali",
    noScheduleYet: 'Sagantaan amma hin uumamne — "Sagantaa Uumi" tuqi',
    pickOne: "Kutaa ykn barsiisaa filadhu",
    myScheduleTitle: "Sagantaa Kootii",
    noTeachersYet: "Hamma ammaatti barsiisaan hin galfamne",
    waitForAdmin: "Bulchaan (admin) sagantaa hin uumne, mee xinnoo eegi",
    free: "Bilisa",
    period: "Sa'aatii",
    adminLockTitle: "Iyyuu Bulchaa (Admin)",
    adminLockDesc: "Jijjiiruuf jecha iyyuu (password) bulchaa galchi",
    adminLockPlaceholder: "Iyyuu (password)",
    adminLockWrong: "Iyyuun sirrii miti, irra deebi'ii yaali",
    adminLockButton: "Bani",
    loginTitle: "Seensa (Login)",
    loginDesc: "Gahee kee filadhuutii iyyuu (password) galchi",
    loginUsernamePlaceholder: "Maqaa fayyadamaa (username)",
    loginButton: "Seeni",
    loginWrong: "Maqaan fayyadamaa ykn iyyuun sirrii miti",
    logout: "Bahi (Logout)",
    offlineBanner: "Intarneetiin hin jiru — jijjiiramni kee lokaalitti olkaa'amaa jira, yeroo intarneetiin deebi'u ofumaan erga",
    onlineSyncing: "Wal-simsiisaa jira...",
    menuLanguage: "Afaan",
    menuTheme: "Bifa Fuula",
    dark: "Dukkanaa'aa",
    light: "Ifaa",
    menuSave: "Sagantaa Olkaa'i",
    savePdf: "PDF",
    saveImage: "Suura (PNG)",
    footerCredit: "Kan qophaa'e: Henok Yonata Berhanu, Barataa Mana Barumsaa Baaroo Tumsaa, Kutaa 12ffaa",
    days: ["Wiixata", "Kibxata", "Roobii", "Kamiisa", "Jimaata"],
    menuClose: "Cufi",
    usageTitle: "Akkaataa Itti Fayyadamaa",
    usageText:
      "1) \"Barsiisota\", \"Kutaalee\" fi \"Barnoota\" galchi. 2) \"Ramaddii\" jalatti barsiisaa, barnoota, kutaa fi sa'aatii/torban walitti fidi. 3) \"Sagantaa\" jalatti \"Sagantaa Uumi\" tuqi. Barsiisonni immo \"Barsiisaa\" jedhu filatanii maqaa isaanii filachuun sagantaa mataa isaanii ilaaluu danda'u.",
    menuTutorial: "Tutorial (Akkaataa Fayyadamaa)",
    tutorialTitle: "Akkaataa Website Kanaa Itti Fayyadamaa",
    tutorialSubtitle: "Tarkaanfii tokko tokkoon, sagantaa uumuu hanga qooduutti",
    tutorialVideoLabel: "Viidiyoo Ibsaa",
    tutorialVideoPlaceholder: "Link YouTube kaa'i (fkn. https://youtube.com/watch?v=XXXXXXX)",
    tutorialVideoHint:
      "Bulchaan (Admin) viidiyoo ibsaa YouTube irratti kaa'e link isaa asitti maxxansuu danda'a — hunda keessatti ni mul'ata.",
    tutorialVideoEmpty: "Hamma ammaatti viidiyoon hin kaa'amne.",
    tutorialVideoSave: "Viidiyoo Olkaa'i",
    tutorialVideoInvalid: "Link YouTube sirrii galchi",
    tutorialStepsHeading: "Tarkaanfiiwwan",
    tutorialStep1Title: "1. Seensa (Login)",
    tutorialStep1Desc: "Gahee kee (Bulchaa/Admin ykn Barsiisaa/Teacher) filadhuutii maqaa fayyadamaa fi iyyuu (password) galchi.",
    tutorialStep2Title: "2. Barsiisota Galchi",
    tutorialStep2Desc: "\"Barsiisota\" jala deemi, maqaa barsiisaa tokko tokkoon galchi (fkn. Barsiisaa Kadir).",
    tutorialStep3Title: "3. Kutaalee Galchi",
    tutorialStep3Desc: "\"Kutaalee\" jala deemi, kutaalee mana barumsichaa galchi (fkn. Kutaa 9A, 9B).",
    tutorialStep4Title: "4. Barnoota Galchi",
    tutorialStep4Desc: "\"Barnoota\" jala deemi, maqaa barnootaa galchi (fkn. Herrega, Fiiziksii, Afaan Oromoo).",
    tutorialStep5Title: "5. Ramaddii Uumi",
    tutorialStep5Desc: "\"Ramaddii\" jala, barsiisaa + barnoota + kutaa + sa'aatii/torban walitti fidii \"Dabali\" tuqi. Tokkoon tokkoon walitti fidiinsaa galchuu qabda.",
    tutorialStep6Title: "6. Sagantaa Uumi (Generate)",
    tutorialStep6Desc: "\"Sagantaa\" jala, sa'aatii guyyaa tokkotti murteessitee \"Sagantaa Uumi\" tuqi — sirni ofumaan sagantaa walitti hin dhahamne siif qindeessa.",
    tutorialStep7Title: "7. Olkaa'i ykn Qoodi",
    tutorialStep7Desc: "Menu (⋮) jalatti \"Sagantaa Olkaa'i\" filadhu — PDF (maxxansuuf) ykn Suura/PNG (WhatsApp/Telegram irratti qooduuf) godhuu dandeessa.",
    tutorialStep8Title: "8. Barsiisaan Sagantaa Ofii Ilaaluu",
    tutorialStep8Desc: "Barsiisaan gahee \"Barsiisaa\" filatee seenee, maqaa isaa filachuudhaan qofa sagantaa isaa arga — gulaaluu hin danda'u.",
  },
  en: {
    siteTitle: "Baaroo Tumsaa Teachers' Schedule",
    siteSubtitle: "Weekly Timetable",
    admin: "Admin",
    teacherRole: "Teacher",
    tabTeachers: "Teachers",
    tabClasses: "Classes",
    tabSubjects: "Subjects",
    tabAssignments: "Assignments",
    tabSchedule: "Schedule",
    add: "Add",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    teacherNamePlaceholder: "Enter teacher name",
    classNamePlaceholder: "e.g. Grade 9A",
    subjectNamePlaceholder: "e.g. Mathematics",
    noItems: "Nothing added yet",
    assignmentsTitle: "Subject Assignments",
    assignmentsDesc:
      "Combine a teacher, subject, class, and how many periods per week are needed. The schedule will automatically arrange them without time conflicts.",
    assignmentsNeedSetup:
      'First add "Teachers", "Classes" and "Subjects", then you can create assignments',
    selectTeacher: "Teacher",
    selectSubject: "Subject",
    selectClass: "Class",
    periodsPerWeek: "Periods/week",
    tableTeacher: "Teacher",
    tableSubject: "Subject",
    tableClass: "Class",
    tablePeriods: "Periods/week",
    noAssignments: "No assignments yet",
    scheduleTitle: "Schedule",
    periodsPerDayLabel: "Periods per day",
    generateSchedule: "Generate Schedule",
    generateHint: 'First add assignments under "Assignments"',
    conflictWarning: (n) =>
      `${n} period(s) could not be placed — add more periods per day, or reduce the assignment load.`,
    viewByClass: "View by Class",
    viewByTeacher: "View by Teacher",
    noScheduleYet: 'No schedule generated yet — tap "Generate Schedule"',
    pickOne: "Pick a class or teacher",
    myScheduleTitle: "My Schedule",
    noTeachersYet: "No teachers added yet",
    waitForAdmin: "The admin hasn't generated a schedule yet — please check back soon",
    free: "Free",
    period: "Period",
    adminLockTitle: "Admin Lock",
    adminLockDesc: "Enter the admin password to make changes",
    adminLockPlaceholder: "Password",
    adminLockWrong: "Incorrect password, try again",
    adminLockButton: "Unlock",
    loginTitle: "Login",
    loginDesc: "Choose your role and enter the password",
    loginUsernamePlaceholder: "Username",
    loginButton: "Log in",
    loginWrong: "Incorrect username or password",
    logout: "Log out",
    offlineBanner: "You're offline — your changes are saved locally and will sync automatically when the connection returns",
    onlineSyncing: "Syncing...",
    menuLanguage: "Language",
    menuTheme: "Theme",
    dark: "Dark",
    light: "Light",
    menuSave: "Save Schedule",
    savePdf: "PDF",
    saveImage: "Image (PNG)",
    footerCredit: "Prepared by Henok Yonata Berhanu, a Grade 12 student of Baaroo Tumsaa School",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    menuClose: "Close",
    usageTitle: "How to Use",
    usageText:
      "1) Add \"Teachers\", \"Classes\" and \"Subjects\". 2) Under \"Assignments\", combine a teacher, subject, class, and periods/week. 3) Under \"Schedule\", tap \"Generate Schedule\". Teachers can switch to \"Teacher\" mode and pick their name to view their own schedule.",
    menuTutorial: "Tutorial (How to Use)",
    tutorialTitle: "How to Use This Website",
    tutorialSubtitle: "Step by step, from setup to sharing",
    tutorialVideoLabel: "Explainer Video",
    tutorialVideoPlaceholder: "Paste a YouTube link (e.g. https://youtube.com/watch?v=XXXXXXX)",
    tutorialVideoHint:
      "The Admin can paste the link of a YouTube explainer video here — it will show for everyone.",
    tutorialVideoEmpty: "No video has been added yet.",
    tutorialVideoSave: "Save Video",
    tutorialVideoInvalid: "Please enter a valid YouTube link",
    tutorialStepsHeading: "Steps",
    tutorialStep1Title: "1. Login",
    tutorialStep1Desc: "Choose your role (Admin or Teacher) and enter your username and password.",
    tutorialStep2Title: "2. Add Teachers",
    tutorialStep2Desc: "Go to \"Teachers\" and add each teacher's name one by one (e.g. Teacher Kadir).",
    tutorialStep3Title: "3. Add Classes",
    tutorialStep3Desc: "Go to \"Classes\" and add the school's classes (e.g. Grade 9A, 9B).",
    tutorialStep4Title: "4. Add Subjects",
    tutorialStep4Desc: "Go to \"Subjects\" and add subject names (e.g. Mathematics, Physics, Afaan Oromoo).",
    tutorialStep5Title: "5. Create Assignments",
    tutorialStep5Desc: "Under \"Assignments\", combine a teacher + subject + class + periods/week, then tap \"Add\". Do this for every combination.",
    tutorialStep6Title: "6. Generate the Schedule",
    tutorialStep6Desc: "Under \"Schedule\", set periods per day and tap \"Generate Schedule\" — the system automatically arranges everything without conflicts.",
    tutorialStep7Title: "7. Save or Share",
    tutorialStep7Desc: "From the menu (⋮), choose \"Save Schedule\" — export as PDF (to print) or Image/PNG (to share on WhatsApp/Telegram).",
    tutorialStep8Title: "8. Teachers View Their Own Schedule",
    tutorialStep8Desc: "A teacher logs in with the \"Teacher\" role, picks their name, and sees only their own schedule — they cannot edit it.",
  },
};

const uid = () => Math.random().toString(36).slice(2, 10);

const defaultData = () => ({
  teachers: [],
  classes: [],
  subjects: [],
  assignments: [],
  config: { periodsPerDay: 6, tutorialVideoUrl: "" },
  schedule: null,
});

// Accepts full YouTube URLs (watch?v=, youtu.be/, shorts/) and returns an
// embeddable player URL, or null if the link isn't a recognizable YouTube URL.
function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    let id = "";
    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.slice(1);
    } else if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/shorts/")) id = u.pathname.split("/")[2];
      else id = u.searchParams.get("v");
    }
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
  } catch (e) {
    return null;
  }
}

function useOnlineStatus() {
  const [online, setOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);
  return online;
}

function useSchoolData() {
  const [data, setDataState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingWrites, setPendingWrites] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(
      scheduleDocRef,
      { includeMetadataChanges: true },
      (snap) => {
        setDataState(snap.exists() ? { ...defaultData(), ...snap.data() } : defaultData());
        setLoading(false);
        // hasPendingWrites is true while this device has local changes
        // that Firestore hasn't confirmed with the server yet (e.g. offline).
        // Nothing is lost in this state — it's queued and will sync automatically.
        setPendingWrites(snap.metadata.hasPendingWrites ? 1 : 0);
      },
      (e) => {
        console.error("Kuusaa dubbisuun hin milkoofne", e);
        setDataState(defaultData());
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const persist = useCallback(async (next) => {
    // Update local state immediately so the UI never appears to "lose" the change,
    // even if the network is down. Firestore's offline cache queues the write
    // and retries automatically once connectivity returns.
    setDataState(next);
    try {
      await setDoc(scheduleDocRef, next);
    } catch (e) {
      console.error("Kuusaa keessa galchuun hin milkoofne", e);
    }
  }, []);

  return { data, setData: persist, loading, pendingWrites };
}

function generateSchedule(data) {
  const { assignments, config } = data;
  const periodsPerDay = config.periodsPerDay;
  const numDays = 5;

  const queues = assignments.map((a) => {
    const arr = [];
    for (let i = 0; i < a.periodsPerWeek; i++) arr.push(a);
    return arr;
  });

  const sessions = [];
  let remaining = true;
  while (remaining) {
    remaining = false;
    for (const q of queues) {
      if (q.length) {
        sessions.push(q.shift());
        remaining = true;
      }
    }
  }

  const byClass = {};
  data.classes.forEach((c) => {
    byClass[c.id] = {};
    for (let di = 0; di < numDays; di++) byClass[c.id][di] = {};
  });

  const teacherBusy = {};
  for (let di = 0; di < numDays; di++) {
    teacherBusy[di] = {};
    for (let p = 0; p < periodsPerDay; p++) teacherBusy[di][p] = new Set();
  }

  // Tracks how many sessions of each assignment have already landed on each day,
  // so later sessions of the same subject prefer a fresh day instead of piling
  // onto a day that already has that subject (spreads a subject across the week).
  const assignmentDayCount = {};
  assignments.forEach((a) => {
    assignmentDayCount[a.id] = Array(numDays).fill(0);
  });

  // Penalty for a candidate slot putting a teacher's own periods back-to-back (or
  // one period apart) on the same day, so a teacher's timetable comes out spread
  // through the day instead of clumped together.
  const teacherAdjacencyPenalty = (teacherId, di, p) => {
    let penalty = 0;
    if (p > 0 && teacherBusy[di][p - 1].has(teacherId)) penalty += 2;
    if (p < periodsPerDay - 1 && teacherBusy[di][p + 1].has(teacherId)) penalty += 2;
    if (p > 1 && teacherBusy[di][p - 2].has(teacherId)) penalty += 1;
    if (p < periodsPerDay - 2 && teacherBusy[di][p + 2].has(teacherId)) penalty += 1;
    return penalty;
  };

  // Penalty for a candidate slot putting the same subject twice in a row for the
  // same class on the same day.
  const classSubjectAdjacencyPenalty = (classId, subjectId, di, p) => {
    let penalty = 0;
    const prev = byClass[classId][di][p - 1];
    const next = byClass[classId][di][p + 1];
    if (prev && prev.subjectId === subjectId) penalty += 1;
    if (next && next.subjectId === subjectId) penalty += 1;
    return penalty;
  };

  const unplaced = [];

  for (const s of sessions) {
    const dayOrder = Array.from({ length: numDays }, (_, di) => di).sort(
      (a, b) => assignmentDayCount[s.id][a] - assignmentDayCount[s.id][b]
    );

    // Instead of grabbing the very first free slot, scan every free slot on the
    // least-used day(s) and score each one; the slot with the lowest "clumping"
    // penalty wins. This is what keeps a teacher's or a class's periods from
    // landing back-to-back or one period apart.
    let best = null; // { di, p, penalty }
    for (const di of dayOrder) {
      for (let p = 0; p < periodsPerDay; p++) {
        const classSlotFree = !byClass[s.classId][di][p];
        const teacherFree = !teacherBusy[di][p].has(s.teacherId);
        if (!classSlotFree || !teacherFree) continue;
        const penalty =
          teacherAdjacencyPenalty(s.teacherId, di, p) +
          classSubjectAdjacencyPenalty(s.classId, s.subjectId, di, p);
        if (!best || penalty < best.penalty) best = { di, p, penalty };
        if (best.penalty === 0) break;
      }
      if (best && best.penalty === 0) break;
    }

    if (best) {
      const { di, p } = best;
      byClass[s.classId][di][p] = { teacherId: s.teacherId, subjectId: s.subjectId, assignmentId: s.id };
      teacherBusy[di][p].add(s.teacherId);
      assignmentDayCount[s.id][di] += 1;
    } else {
      unplaced.push(s);
    }
  }

  return { byClass, unplaced, periodsPerDay, numDays, generatedAt: new Date().toISOString() };
}

function getTeacherGrid(schedule, teacherId) {
  const grid = {};
  for (let di = 0; di < schedule.numDays; di++) grid[di] = {};
  Object.entries(schedule.byClass).forEach(([classId, days]) => {
    Object.entries(days).forEach(([di, periods]) => {
      Object.entries(periods).forEach(([p, cell]) => {
        if (cell && cell.teacherId === teacherId) {
          grid[di][p] = { classId, subjectId: cell.subjectId };
        }
      });
    });
  });
  return grid;
}

function teacherColor(teachers, teacherId) {
  const idx = teachers.findIndex((t) => t.id === teacherId);
  return TEACHER_COLORS[idx >= 0 ? idx % TEACHER_COLORS.length : 0];
}

// ---------- Canvas export (no external libs) ----------
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function downloadScheduleImage({ title, dayLabels, periodsPerDay, periodLabel, freeLabel, cellFor, fileName }) {
  const labelW = 92;
  const cellW = 158;
  const cellH = 68;
  const headerH = 46;
  const titleH = 56;
  const pad = 20;
  const width = pad * 2 + labelW + cellW * dayLabels.length;
  const height = pad * 2 + titleH + headerH + cellH * periodsPerDay;

  const canvas = document.createElement("canvas");
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#1B1440";
  ctx.font = "700 22px 'Sora', 'Inter', sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText(title, pad, pad);

  const gridTop = pad + titleH;
  const gridLeft = pad;

  ctx.fillStyle = "#F3F1FD";
  roundRectPath(ctx, gridLeft, gridTop, labelW + cellW * dayLabels.length, headerH, 8);
  ctx.fill();

  ctx.fillStyle = "#5B4FCF";
  ctx.font = "700 13px 'Inter', sans-serif";
  ctx.textAlign = "center";
  dayLabels.forEach((d, i) => {
    const cx = gridLeft + labelW + cellW * i + cellW / 2;
    ctx.fillText(d, cx, gridTop + headerH / 2 - 7);
  });

  for (let p = 0; p < periodsPerDay; p++) {
    const rowY = gridTop + headerH + cellH * p;
    ctx.fillStyle = "#8A83A8";
    ctx.font = "600 11px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${periodLabel} ${p + 1}`, gridLeft + labelW / 2, rowY + cellH / 2 - 6);

    for (let di = 0; di < dayLabels.length; di++) {
      const cellX = gridLeft + labelW + cellW * di;
      const cell = cellFor(di, p);
      const innerPad = 4;
      if (cell) {
        ctx.fillStyle = cell.color.bg;
        roundRectPath(ctx, cellX + innerPad, rowY + innerPad, cellW - innerPad * 2, cellH - innerPad * 2, 6);
        ctx.fill();
        ctx.fillStyle = cell.color.text;
        ctx.textAlign = "left";
        ctx.font = "700 13px 'Inter', sans-serif";
        ctx.fillText(cell.line1, cellX + 12, rowY + 16, cellW - 24);
        ctx.font = "500 11px 'Inter', sans-serif";
        ctx.globalAlpha = 0.85;
        ctx.fillText(cell.line2, cellX + 12, rowY + 36, cellW - 24);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = "#F7F7FB";
        roundRectPath(ctx, cellX + innerPad, rowY + innerPad, cellW - innerPad * 2, cellH - innerPad * 2, 6);
        ctx.fill();
        ctx.fillStyle = "#C7C3DD";
        ctx.textAlign = "center";
        ctx.font = "500 11px 'Inter', sans-serif";
        ctx.fillText(freeLabel, cellX + cellW / 2, rowY + cellH / 2 - 6);
      }
      ctx.strokeStyle = "#EDEBF7";
      ctx.lineWidth = 1;
      ctx.strokeRect(cellX, rowY, cellW, cellH);
    }
  }

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
}

// ---------- UI atoms ----------
function Btn({ onClick, children, variant = "primary", disabled, type = "button", className = "" }) {
  const base =
    "inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 border disabled:opacity-40 disabled:cursor-not-allowed";
  const styles = {
    primary: "text-white border-transparent hover:brightness-110 active-scale-98",
    ghost: "bg-transparent text-text border-border-strong hover-bg-panel-soft",
    danger: "bg-transparent text-danger border-danger-30 hover-bg-danger-10",
  };
  const primaryStyle =
    variant === "primary"
      ? { background: "linear-gradient(135deg,#8B7CF6,#6C5CE0)", boxShadow: "0 4px 14px -4px #8B7CF680" }
      : undefined;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
      style={primaryStyle}
    >
      {children}
    </button>
  );
}

function Empty({ children }) {
  return (
    <div className="py-7 text-center text-sm text-text-faint border border-dashed border-border-strong rounded-xl bg-panel-soft-40">
      {children}
    </div>
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={
        "bg-panel-soft border border-border-strong rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus-border-accent transition-colors " +
        (props.className || "")
      }
    />
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={
        "bg-panel-soft border border-border-strong rounded-lg px-3 py-2 text-text placeholder-text-faint focus:outline-none focus-border-accent text-sm transition-colors " +
        (props.className || "")
      }
    />
  );
}

function SectionHeading({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg,#8B7CF6,#2DD4BF)" }}
      >
        <Icon size={16} className="text-white" />
      </div>
      <h2 className="font-display text-2xl text-text">{title}</h2>
    </div>
  );
}

function ManageList({ title, icon, items, onAdd, onRemove, onEdit, placeholder, usageCheck, t }) {
  const [value, setValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const submit = () => {
    const v = value.trim();
    if (!v) return;
    onAdd(v);
    setValue("");
  };

  const startEdit = (it) => {
    setEditingId(it.id);
    setEditValue(it.name);
  };

  const saveEdit = () => {
    const v = editValue.trim();
    if (!v) return;
    onEdit(editingId, v);
    setEditingId(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  return (
    <div>
      <SectionHeading icon={icon} title={title} />
      <div className="flex gap-2 mb-4">
        <TextInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder={placeholder}
          className="flex-1"
        />
        <Btn type="button" onClick={submit}>
          <Plus size={16} /> {t.add}
        </Btn>
      </div>
      {items.length === 0 ? (
        <Empty>{t.noItems}</Empty>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it, i) => (
            <li
              key={it.id}
              className="flex items-center justify-between bg-panel border border-border rounded-lg px-3.5 py-2.5 gap-2"
            >
              {editingId === it.id ? (
                <>
                  <TextInput
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    autoFocus
                    className="flex-1"
                  />
                  <button
                    onClick={saveEdit}
                    className="text-accent hover-text-text transition-colors shrink-0"
                    title={t.save}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-text-faint hover-text-text transition-colors shrink-0"
                    title={t.cancel}
                  >
                    <X size={15} />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-text text-sm flex items-center gap-2.5 min-w-0">
                    {usageCheck && usageCheck(it) ? (
                      <span
                        className="w-2 h-2 rounded-full inline-block shrink-0"
                        style={{ background: TEACHER_COLORS[i % TEACHER_COLORS.length].bg }}
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full inline-block bg-border-strong shrink-0" />
                    )}
                    <span className="truncate">{it.name}</span>
                  </span>
                  <span className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => startEdit(it)}
                      className="text-text-faint hover-text-text transition-colors"
                      title={t.edit}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onRemove(it.id)}
                      className="text-text-faint hover-text-danger transition-colors"
                      title={t.delete}
                    >
                      <Trash2 size={15} />
                    </button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AssignmentsTab({ data, setData, t }) {
  const { teachers, classes, subjects, assignments } = data;
  const [teacherId, setTeacherId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");
  const [periodsPerWeek, setPeriodsPerWeek] = useState(3);

  const ready = teachers.length && classes.length && subjects.length;

  const add = () => {
    if (!teacherId || !subjectId || !classId || periodsPerWeek < 1) return;
    const a = { id: uid(), teacherId, subjectId, classId, periodsPerWeek: Number(periodsPerWeek) };
    setData({ ...data, assignments: [...assignments, a], schedule: null });
    setTeacherId("");
    setSubjectId("");
    setClassId("");
    setPeriodsPerWeek(3);
  };

  const remove = (id) => setData({ ...data, assignments: assignments.filter((a) => a.id !== id), schedule: null });
  const nameOf = (arr, id) => arr.find((x) => x.id === id)?.name || "—";

  return (
    <div>
      <SectionHeading icon={ClipboardList} title={t.assignmentsTitle} />
      <p className="text-text-dim text-xs mb-4 leading-relaxed">{t.assignmentsDesc}</p>
      {!ready ? (
        <Empty>{t.assignmentsNeedSetup}</Empty>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-5">
          <Select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
            <option value="">{t.selectTeacher}</option>
            {teachers.map((tc) => (
              <option key={tc.id} value={tc.id}>
                {tc.name}
              </option>
            ))}
          </Select>
          <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="">{t.selectSubject}</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Select value={classId} onChange={(e) => setClassId(e.target.value)}>
            <option value="">{t.selectClass}</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <TextInput
            type="number"
            min={1}
            max={20}
            value={periodsPerWeek}
            onChange={(e) => setPeriodsPerWeek(e.target.value)}
            placeholder={t.periodsPerWeek}
          />
          <Btn type="button" onClick={add}>
            <Plus size={16} /> {t.add}
          </Btn>
        </div>
      )}

      {assignments.length === 0 ? (
        <Empty>{t.noAssignments}</Empty>
      ) : (
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-faint border-b border-border bg-panel-soft">
                <th className="py-2.5 px-3.5 font-medium">{t.tableTeacher}</th>
                <th className="py-2.5 px-3.5 font-medium">{t.tableSubject}</th>
                <th className="py-2.5 px-3.5 font-medium">{t.tableClass}</th>
                <th className="py-2.5 px-3.5 font-medium">{t.tablePeriods}</th>
                <th className="py-2.5 px-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 bg-panel">
                  <td className="py-2.5 px-3.5 text-text">{nameOf(teachers, a.teacherId)}</td>
                  <td className="py-2.5 px-3.5 text-text-dim">{nameOf(subjects, a.subjectId)}</td>
                  <td className="py-2.5 px-3.5 text-text-dim">{nameOf(classes, a.classId)}</td>
                  <td className="py-2.5 px-3.5 text-text-dim">{a.periodsPerWeek}</td>
                  <td className="py-2.5 px-3.5 text-right">
                    <button onClick={() => remove(a.id)} className="text-text-faint hover-text-danger transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ScheduleGrid({ dayLabels, periodsPerDay, periodLabel, freeLabel, cellFor, printableId }) {
  return (
    <div id={printableId} className="overflow-x-auto">
      <div
        className="grid border border-border rounded-xl overflow-hidden min-w-640"
        style={{ gridTemplateColumns: `76px repeat(${dayLabels.length}, 1fr)` }}
      >
        <div className="bg-panel-soft border-b border-r border-border" />
        {dayLabels.map((d) => (
          <div
            key={d}
            className="bg-panel-soft border-b border-r border-border last:border-r-0 text-center py-2.5 text-accent font-display text-lg"
          >
            {d}
          </div>
        ))}
        {Array.from({ length: periodsPerDay }).map((_, p) => (
          <React.Fragment key={p}>
            <div className="border-b border-r border-border flex items-center justify-center text-text-faint text-11 py-3 text-center px-1">
              {periodLabel} {p + 1}
            </div>
            {dayLabels.map((_, di) => {
              const cell = cellFor(di, p);
              return (
                <div key={di} className="border-b border-r border-border last:border-r-0 p-1.5 min-h-58">
                  {cell ? (
                    <div
                      className="h-full rounded-lg px-2.5 py-1.5 flex flex-col justify-center shadow-sm"
                      style={{ background: cell.color.bg, color: cell.color.text }}
                    >
                      <div className="text-11 font-semibold leading-tight truncate">{cell.line1}</div>
                      <div className="text-10 opacity-80 truncate leading-tight">{cell.line2}</div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-text-faint text-11">
                      {freeLabel}
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ScheduleTab({ data, setData, t, registerExport }) {
  const { classes, teachers, subjects, assignments, config, schedule } = data;
  const [viewMode, setViewMode] = useState("class");
  const [selectedId, setSelectedId] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const list = viewMode === "class" ? classes : teachers;
    if (list.length && !list.find((x) => x.id === selectedId)) setSelectedId(list[0].id);
    if (!list.length) setSelectedId("");
  }, [viewMode, classes, teachers]); // eslint-disable-line

  const nameOf = (arr, id) => arr.find((x) => x.id === id)?.name || "—";

  const runGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 300));
    const result = generateSchedule(data);
    await setData({ ...data, schedule: result });
    setGenerating(false);
  };

  const updatePeriods = (val) => {
    const n = Math.max(4, Math.min(10, Number(val) || 6));
    setData({ ...data, config: { ...config, periodsPerDay: n }, schedule: null });
  };

  let cellFor = () => null;
  let exportTitle = "";
  if (schedule && selectedId) {
    if (viewMode === "class") {
      exportTitle = nameOf(classes, selectedId);
      cellFor = (di, p) => {
        const raw = schedule.byClass[selectedId]?.[di]?.[p];
        if (!raw) return null;
        return { color: teacherColor(teachers, raw.teacherId), line1: nameOf(subjects, raw.subjectId), line2: nameOf(teachers, raw.teacherId) };
      };
    } else {
      exportTitle = nameOf(teachers, selectedId);
      const grid = getTeacherGrid(schedule, selectedId);
      cellFor = (di, p) => {
        const raw = grid[di]?.[p];
        if (!raw) return null;
        return { color: teacherColor(teachers, selectedId), line1: nameOf(subjects, raw.subjectId), line2: nameOf(classes, raw.classId) };
      };
    }
  }

  useEffect(() => {
    if (!schedule || !selectedId) {
      registerExport(null);
      return;
    }
    registerExport(() => () =>
      downloadScheduleImage({
        title: exportTitle,
        dayLabels: t.days,
        periodsPerDay: schedule.periodsPerDay,
        periodLabel: t.period,
        freeLabel: t.free,
        cellFor,
        fileName: `${exportTitle.replace(/\s+/g, "-")}-sagantaa.png`,
      })
    );
  }); // eslint-disable-line

  return (
    <div>
      <SectionHeading icon={CalendarDays} title={t.scheduleTitle} />

      <div className="flex flex-wrap items-end gap-3 mb-5">
        <div>
          <label className="block text-text-faint text-xs mb-1">{t.periodsPerDayLabel}</label>
          <TextInput
            type="number"
            min={4}
            max={10}
            value={config.periodsPerDay}
            onChange={(e) => updatePeriods(e.target.value)}
            className="w-24"
          />
        </div>
        <Btn onClick={runGenerate} disabled={!assignments.length || generating}>
          {generating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {t.generateSchedule}
        </Btn>
        {!assignments.length && <span className="text-text-faint text-xs">{t.generateHint}</span>}
      </div>

      {schedule && schedule.unplaced.length > 0 && (
        <div className="flex items-start gap-2 bg-danger-10 border border-danger-30 rounded-xl px-3.5 py-3 mb-5 text-sm text-danger">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <span>{t.conflictWarning(schedule.unplaced.length)}</span>
        </div>
      )}

      {schedule && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex bg-panel-soft border border-border-strong rounded-lg p-0.5 text-sm">
            <button
              onClick={() => setViewMode("class")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === "class" ? "text-white font-semibold" : "text-text-dim"
              }`}
              style={viewMode === "class" ? { background: "linear-gradient(135deg,#8B7CF6,#6C5CE0)" } : undefined}
            >
              {t.viewByClass}
            </button>
            <button
              onClick={() => setViewMode("teacher")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === "teacher" ? "text-white font-semibold" : "text-text-dim"
              }`}
              style={viewMode === "teacher" ? { background: "linear-gradient(135deg,#8B7CF6,#6C5CE0)" } : undefined}
            >
              {t.viewByTeacher}
            </button>
          </div>
          <Select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {(viewMode === "class" ? classes : teachers).map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      {!schedule ? (
        <Empty>{t.noScheduleYet}</Empty>
      ) : !selectedId ? (
        <Empty>{t.pickOne}</Empty>
      ) : (
        <ScheduleGrid
          dayLabels={t.days}
          periodsPerDay={schedule.periodsPerDay}
          periodLabel={t.period}
          freeLabel={t.free}
          cellFor={cellFor}
          printableId="printable-schedule"
        />
      )}
    </div>
  );
}

function TeacherView({ data, t, registerExport }) {
  const { teachers, subjects, classes, schedule } = data;
  const [teacherId, setTeacherId] = useState("");

  useEffect(() => {
    if (teachers.length && !teacherId) setTeacherId(teachers[0].id);
    if (teachers.length && teacherId && !teachers.find((x) => x.id === teacherId)) setTeacherId(teachers[0].id);
  }, [teachers]); // eslint-disable-line

  const nameOf = (arr, id) => arr.find((x) => x.id === id)?.name || "—";
  const color = teacherColor(teachers, teacherId);
  const grid = schedule ? getTeacherGrid(schedule, teacherId) : {};
  const cellFor = (di, p) => {
    const raw = grid[di]?.[p];
    if (!raw) return null;
    return { color, line1: nameOf(subjects, raw.subjectId), line2: nameOf(classes, raw.classId) };
  };
  const teacherName = nameOf(teachers, teacherId);

  useEffect(() => {
    if (!schedule || !teacherId) {
      registerExport(null);
      return;
    }
    registerExport(() => () =>
      downloadScheduleImage({
        title: teacherName,
        dayLabels: t.days,
        periodsPerDay: schedule.periodsPerDay,
        periodLabel: t.period,
        freeLabel: t.free,
        cellFor,
        fileName: `${teacherName.replace(/\s+/g, "-")}-sagantaa.png`,
      })
    );
  }); // eslint-disable-line

  if (!teachers.length) return <Empty>{t.noTeachersYet}</Empty>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <SectionHeading icon={GraduationCap} title={t.myScheduleTitle} />
        <Select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
          {teachers.map((tc) => (
            <option key={tc.id} value={tc.id}>
              {tc.name}
            </option>
          ))}
        </Select>
      </div>

      {!schedule ? (
        <Empty>{t.waitForAdmin}</Empty>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4 text-sm text-text-dim">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color.bg }} />
            {teacherName}
          </div>
          <ScheduleGrid
            dayLabels={t.days}
            periodsPerDay={schedule.periodsPerDay}
            periodLabel={t.period}
            freeLabel={t.free}
            cellFor={cellFor}
            printableId="printable-schedule"
          />
        </>
      )}
    </div>
  );
}

function TutorialModal({ t, data, setData, role, onClose }) {
  const [videoInput, setVideoInput] = useState(data.config.tutorialVideoUrl || "");
  const [videoError, setVideoError] = useState(false);

  const steps = [
    { icon: LogIn, title: t.tutorialStep1Title, desc: t.tutorialStep1Desc },
    { icon: Users, title: t.tutorialStep2Title, desc: t.tutorialStep2Desc },
    { icon: Building2, title: t.tutorialStep3Title, desc: t.tutorialStep3Desc },
    { icon: BookOpen, title: t.tutorialStep4Title, desc: t.tutorialStep4Desc },
    { icon: ClipboardList, title: t.tutorialStep5Title, desc: t.tutorialStep5Desc },
    { icon: CalendarDays, title: t.tutorialStep6Title, desc: t.tutorialStep6Desc },
    { icon: FileDown, title: t.tutorialStep7Title, desc: t.tutorialStep7Desc },
    { icon: GraduationCap, title: t.tutorialStep8Title, desc: t.tutorialStep8Desc },
  ];

  const embedUrl = getYouTubeEmbedUrl(data.config.tutorialVideoUrl);

  const saveVideo = () => {
    const trimmed = videoInput.trim();
    if (trimmed && !getYouTubeEmbedUrl(trimmed)) {
      setVideoError(true);
      return;
    }
    setVideoError(false);
    setData({ ...data, config: { ...data.config, tutorialVideoUrl: trimmed } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose} />
      <div className="relative bg-panel border border-border-strong rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#8B7CF6,#2DD4BF)" }}
            >
              <HelpCircle size={17} className="text-white" />
            </div>
            <div>
              <h2 className="font-display text-base text-text leading-tight">{t.tutorialTitle}</h2>
              <p className="text-11 text-text-faint mt-0.5">{t.tutorialSubtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-faint hover-text-text shrink-0" aria-label={t.menuClose}>
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-faint uppercase tracking-wide mb-2">
            <Video size={13} /> {t.tutorialVideoLabel}
          </div>

          {embedUrl ? (
            <div className="rounded-xl overflow-hidden border border-border-strong mb-2" style={{ aspectRatio: "16/9" }}>
              <iframe
                src={embedUrl}
                title={t.tutorialVideoLabel}
                className="w-full h-full"
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-text-faint bg-panel-soft border border-border rounded-lg px-3 py-3 mb-2">
              <Youtube size={14} className="shrink-0" />
              {t.tutorialVideoEmpty}
            </div>
          )}

          {role === "admin" && (
            <div className="mb-5">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={videoInput}
                  onChange={(e) => {
                    setVideoInput(e.target.value);
                    setVideoError(false);
                  }}
                  placeholder={t.tutorialVideoPlaceholder}
                  className={`flex-1 bg-panel-soft border rounded-lg px-3 py-2 text-sm text-text placeholder-text-faint focus-border-accent ${
                    videoError ? "border-danger-30" : "border-border-strong"
                  }`}
                />
                <Btn onClick={saveVideo} variant="primary">
                  {t.tutorialVideoSave}
                </Btn>
              </div>
              {videoError && <p className="text-11 text-danger mt-1.5">{t.tutorialVideoInvalid}</p>}
              <p className="text-11 text-text-faint mt-1.5">{t.tutorialVideoHint}</p>
            </div>
          )}

          <div className="text-xs font-semibold text-text-faint uppercase tracking-wide mb-2.5 mt-1">
            {t.tutorialStepsHeading}
          </div>
          <div className="flex flex-col gap-2.5">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const color = TEACHER_COLORS[i % TEACHER_COLORS.length];
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-panel-soft border border-border rounded-xl px-3.5 py-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: color.bg }}
                  >
                    <Icon size={15} style={{ color: color.text }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text leading-tight">{s.title}</p>
                    <p className="text-xs text-text-dim leading-relaxed mt-1">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopMenu({ theme, setTheme, lang, setLang, t, onSavePdf, onSaveImage, canExport, onOpenTutorial }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 rounded-lg border border-border-strong bg-panel-soft flex items-center justify-center text-text hover-border-accent transition-colors"
        aria-label="menu"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-panel border border-border-strong rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-xs font-semibold text-text-faint uppercase tracking-wide">Menu</span>
            <button onClick={() => setOpen(false)} className="text-text-faint hover-text-text">
              <X size={14} />
            </button>
          </div>

          <div className="px-4 py-3 border-b border-border">
            <button
              onClick={() => {
                setOpen(false);
                onOpenTutorial();
              }}
              className="flex items-center gap-2 text-sm text-text hover-text-accent w-full"
            >
              <HelpCircle size={15} className="text-accent" /> {t.menuTutorial}
            </button>
          </div>

          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2 text-xs text-text-faint mb-2">
              <Languages size={13} /> {t.menuLanguage}
            </div>
            <div className="flex bg-panel-soft border border-border-strong rounded-lg p-0.5 text-sm">
              <button
                onClick={() => setLang("om")}
                className={`flex-1 px-2 py-1.5 rounded-md transition-colors ${
                  lang === "om" ? "text-white font-semibold" : "text-text-dim"
                }`}
                style={lang === "om" ? { background: "linear-gradient(135deg,#8B7CF6,#6C5CE0)" } : undefined}
              >
                Afaan Oromoo
              </button>
              <button
                onClick={() => setLang("en")}
                className={`flex-1 px-2 py-1.5 rounded-md transition-colors ${
                  lang === "en" ? "text-white font-semibold" : "text-text-dim"
                }`}
                style={lang === "en" ? { background: "linear-gradient(135deg,#8B7CF6,#6C5CE0)" } : undefined}
              >
                English
              </button>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2 text-xs text-text-faint mb-2">
              {theme === "dark" ? <Moon size={13} /> : <Sun size={13} />} {t.menuTheme}
            </div>
            <div className="flex bg-panel-soft border border-border-strong rounded-lg p-0.5 text-sm">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md transition-colors ${
                  theme === "light" ? "text-white font-semibold" : "text-text-dim"
                }`}
                style={theme === "light" ? { background: "linear-gradient(135deg,#8B7CF6,#6C5CE0)" } : undefined}
              >
                <Sun size={13} /> {t.light}
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md transition-colors ${
                  theme === "dark" ? "text-white font-semibold" : "text-text-dim"
                }`}
                style={theme === "dark" ? { background: "linear-gradient(135deg,#8B7CF6,#6C5CE0)" } : undefined}
              >
                <Moon size={13} /> {t.dark}
              </button>
            </div>
          </div>

          <div className="px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-text-faint mb-2">
              <FileDown size={13} /> {t.menuSave}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onSavePdf}
                disabled={!canExport}
                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border border-border-strong text-text text-xs font-semibold hover-bg-panel-soft disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <FileDown size={14} /> {t.savePdf}
              </button>
              <button
                onClick={onSaveImage}
                disabled={!canExport}
                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border border-border-strong text-text text-xs font-semibold hover-bg-panel-soft disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ImageDown size={14} /> {t.saveImage}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Accounts: set these in your .env file (see .env.example), never hard-code real
// passwords in source you share publicly. Defaults below are only for local testing.
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
const TEACHER_USERNAME = import.meta.env.VITE_TEACHER_USERNAME || "teacher";
const TEACHER_PASSWORD = import.meta.env.VITE_TEACHER_PASSWORD || "teacher123";
const SESSION_KEY = "school-schedule-session-role";

function GlobalStyle() {
  return (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Sora', 'Inter', sans-serif; font-weight: 700; }

        [data-theme="dark"] {
          --bg-grad: radial-gradient(1100px 600px at 15% -10%, #241B54 0%, transparent 55%),
                     radial-gradient(900px 500px at 100% 0%, #0D3B36 0%, transparent 45%),
                     #0E1023;
          --panel: #171A33;
          --panel-soft: #1D2140;
          --border: rgba(237,237,247,0.08);
          --border-strong: rgba(237,237,247,0.16);
          --text: #EDEDF7;
          --text-dim: rgba(237,237,247,0.58);
          --text-faint: rgba(237,237,247,0.34);
          --accent: #A594FF;
          --danger: #FB7185;
        }
        [data-theme="light"] {
          --bg-grad: radial-gradient(1100px 600px at 15% -10%, #EDE9FE 0%, transparent 55%),
                     radial-gradient(900px 500px at 100% 0%, #DCFAF4 0%, transparent 45%),
                     #F6F5FC;
          --panel: #FFFFFF;
          --panel-soft: #F3F2FA;
          --border: rgba(27,20,64,0.08);
          --border-strong: rgba(27,20,64,0.14);
          --text: #1B1440;
          --text-dim: rgba(27,20,64,0.60);
          --text-faint: rgba(27,20,64,0.38);
          --accent: #6C5CE0;
          --danger: #E11D48;
        }
        body { background: var(--bg-grad); }
        ::selection { background: #8B7CF6; color: #fff; }

        /* Design-token utility classes (Tailwind's JIT compiler isn't available here,
           so arbitrary bracket values like bg-[var(--panel)] don't render — these
           plain classes replace them and are the fix for the missing colors). */
        .bg-panel { background: var(--panel); }
        .bg-panel-soft { background: var(--panel-soft); }
        .bg-panel-soft-40 { background: color-mix(in srgb, var(--panel-soft) 40%, transparent); }
        .bg-border-strong { background: var(--border-strong); }
        .bg-danger-10 { background: color-mix(in srgb, var(--danger) 10%, transparent); }

        .border-border { border-color: var(--border); }
        .border-border-strong { border-color: var(--border-strong); }
        .border-accent { border-color: var(--accent); }
        .border-accent-40 { border-color: color-mix(in srgb, var(--accent) 40%, transparent); }
        .border-danger-30 { border-color: color-mix(in srgb, var(--danger) 30%, transparent); }

        .text-text { color: var(--text); }
        .text-text-dim { color: var(--text-dim); }
        .text-text-faint { color: var(--text-faint); }
        .text-accent { color: var(--accent); }
        .text-danger { color: var(--danger); }
        .text-purple-brand { color: #8B7CF6; }
        .text-10 { font-size: 10px; line-height: 1.3; }
        .text-11 { font-size: 11px; line-height: 1.4; }

        .placeholder-text-faint::placeholder { color: var(--text-faint); }
        .min-h-58 { min-height: 58px; }
        .min-w-640 { min-width: 640px; }
        .active-scale-98:active { transform: scale(0.98); }

        .hover-bg-danger-10:hover { background: color-mix(in srgb, var(--danger) 10%, transparent); }
        .hover-bg-panel-soft:hover { background: var(--panel-soft); }
        .hover-border-accent:hover { border-color: var(--accent); }
        .hover-text-danger:hover { color: var(--danger); }
        .hover-text-text:hover { color: var(--text); }
        .hover-text-accent:hover { color: var(--accent); }
        .focus-border-accent:focus { border-color: var(--accent); outline: none; }

        @media print {
          body * { visibility: hidden; }
          #printable-schedule, #printable-schedule * { visibility: visible; }
          #printable-schedule { position: absolute; top: 0; left: 0; width: 100%; }
        }
      `}</style>
  );
}

function LoginScreen({ t, lang, setLang, onLogin }) {
  const [roleChoice, setRoleChoice] = useState("teacher");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const submit = () => {
    const ok =
      roleChoice === "admin"
        ? username === ADMIN_USERNAME && password === ADMIN_PASSWORD
        : username === TEACHER_USERNAME && password === TEACHER_PASSWORD;
    if (ok) {
      try {
        sessionStorage.setItem(SESSION_KEY, roleChoice);
      } catch (e) {}
      onLogin(roleChoice);
    } else {
      setError(true);
    }
  };

  return (
    <div
      data-theme="dark"
      className="min-h-screen flex items-center justify-center px-5"
      style={{ fontFamily: "'Inter', sans-serif", background: "var(--bg-grad)" }}
    >
      <GlobalStyle />
      <div className="w-full max-w-sm bg-panel border border-border-strong rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#8B7CF6,#2DD4BF)" }}
            >
              <CalendarDays size={17} className="text-white" />
            </div>
            <span className="font-display text-base text-text">{t.siteTitle}</span>
          </div>
          <button
            onClick={() => setLang(lang === "om" ? "en" : "om")}
            className="w-8 h-8 rounded-lg border border-border-strong bg-panel-soft flex items-center justify-center text-text-dim"
            aria-label="language"
          >
            <Languages size={14} />
          </button>
        </div>
        <p className="font-display text-lg text-text mb-1">{t.loginTitle}</p>
        <p className="text-xs text-text-dim mb-4">{t.loginDesc}</p>

        <div className="flex bg-panel-soft border border-border-strong rounded-lg p-0.5 text-sm mb-3">
          <button
            type="button"
            onClick={() => {
              setRoleChoice("admin");
              setError(false);
            }}
            className={`flex-1 px-3.5 py-1.5 rounded-md transition-colors ${
              roleChoice === "admin" ? "text-white font-semibold" : "text-text-dim"
            }`}
            style={roleChoice === "admin" ? { background: "linear-gradient(135deg,#8B7CF6,#6C5CE0)" } : undefined}
          >
            {t.admin}
          </button>
          <button
            type="button"
            onClick={() => {
              setRoleChoice("teacher");
              setError(false);
            }}
            className={`flex-1 px-3.5 py-1.5 rounded-md transition-colors ${
              roleChoice === "teacher" ? "text-white font-semibold" : "text-text-dim"
            }`}
            style={roleChoice === "teacher" ? { background: "linear-gradient(135deg,#8B7CF6,#6C5CE0)" } : undefined}
          >
            {t.teacherRole}
          </button>
        </div>

        <TextInput
          autoFocus
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError(false);
          }}
          placeholder={t.loginUsernamePlaceholder}
          className="w-full mb-2"
        />
        <div className="relative mb-2">
          <TextInput
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder={t.adminLockPlaceholder}
            className="w-full pr-9"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-faint hover-text-text"
            aria-label={showPassword ? "hide password" : "show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {error && <p className="text-xs text-danger mb-2">{t.loginWrong}</p>}
        <Btn type="button" onClick={submit} className="w-full mt-2">
          {t.loginButton}
        </Btn>
      </div>
    </div>
  );
}

export default function App() {
  const { data, setData, loading, pendingWrites } = useSchoolData();
  const online = useOnlineStatus();
  const [session, setSession] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) || null;
    } catch (e) {
      return null;
    }
  });
  const [role, setRole] = useState(session || "teacher");
  const [tab, setTab] = useState("teachers");
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("om");
  const [exportImageFn, setExportImageFn] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [showUsage, setShowUsage] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  const t = STRINGS[lang];

  const handleLogin = (loggedInRole) => {
    setSession(loggedInRole);
    setRole(loggedInRole);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
    setSession(null);
    setRole("teacher");
  };

  if (!session) {
    return <LoginScreen t={t} lang={lang} setLang={setLang} onLogin={handleLogin} />;
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0E1023" }}>
        <Loader2 size={28} className="text-purple-brand animate-spin" />
      </div>
    );
  }

  const usedTeacherIds = new Set(data.assignments.map((a) => a.teacherId));

  const adminTabs = [
    { id: "teachers", label: t.tabTeachers, icon: Users },
    { id: "classes", label: t.tabClasses, icon: Building2 },
    { id: "subjects", label: t.tabSubjects, icon: BookOpen },
    { id: "assignments", label: t.tabAssignments, icon: ClipboardList },
    { id: "schedule", label: t.tabSchedule, icon: CalendarDays },
  ];

  const registerExport = (fn) => setExportImageFn(() => fn);
  const canExport = !!(data.schedule && (role === "teacher" || tab === "schedule"));

  return (
    <div data-theme={theme} className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <GlobalStyle />
      <div style={{ background: "var(--bg-grad)", minHeight: "100vh" }}>
        <header className="border-b border-border px-5 py-4 md:px-8">
          <div className="max-w-5xl mx-auto flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                {role === "admin" && (
                  <button
                    onClick={() => setNavOpen(true)}
                    className="w-9 h-9 rounded-lg border border-border-strong bg-panel-soft flex items-center justify-center text-text hover-border-accent transition-colors md:hidden"
                    aria-label="menu"
                  >
                    <Menu size={18} />
                  </button>
                )}
              </div>
              <div className="flex-1 flex justify-center min-w-0">
                {session === "admin" && (
                  <div className="flex bg-panel-soft border border-border-strong rounded-lg p-0.5 text-sm">
                    <button
                      onClick={() => setRole("admin")}
                      className={`px-3.5 py-1.5 rounded-md transition-colors ${
                        role === "admin" ? "text-white font-semibold" : "text-text-dim"
                      }`}
                      style={role === "admin" ? { background: "linear-gradient(135deg,#8B7CF6,#6C5CE0)" } : undefined}
                    >
                      {t.admin}
                    </button>
                    <button
                      onClick={() => setRole("teacher")}
                      className={`px-3.5 py-1.5 rounded-md transition-colors ${
                        role === "teacher" ? "text-white font-semibold" : "text-text-dim"
                      }`}
                      style={role === "teacher" ? { background: "linear-gradient(135deg,#8B7CF6,#6C5CE0)" } : undefined}
                    >
                      {t.teacherRole}
                    </button>
                  </div>
                )}
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <TopMenu
                  theme={theme}
                  setTheme={setTheme}
                  lang={lang}
                  setLang={setLang}
                  t={t}
                  canExport={canExport}
                  onSavePdf={() => window.print()}
                  onSaveImage={() => exportImageFn && exportImageFn()}
                  onOpenTutorial={() => setShowTutorial(true)}
                />
                <button
                  onClick={handleLogout}
                  className="w-9 h-9 rounded-lg border border-border-strong bg-panel-soft flex items-center justify-center text-text-dim hover-border-accent transition-colors"
                  aria-label={t.logout}
                  title={t.logout}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg,#8B7CF6,#2DD4BF)", boxShadow: "0 6px 18px -6px #8B7CF680" }}
              >
                <CalendarDays size={19} className="text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl md:text-3xl leading-tight text-text">{t.siteTitle}</h1>
                <p className="text-10 tracking-wide text-text-faint uppercase mt-0.5">{t.siteSubtitle}</p>
              </div>
            </div>
          </div>
        </header>

        {navOpen && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setNavOpen(false)}
            />
            <div className="absolute top-0 left-0 bottom-0 w-64 bg-panel border-r border-border-strong shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                <span className="font-display text-lg text-text">{t.siteTitle}</span>
                <button onClick={() => setNavOpen(false)} className="text-text-faint hover-text-text">
                  <X size={16} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-3">
                {adminTabs.map((tb) => {
                  const Icon = tb.icon;
                  const active = tab === tb.id;
                  return (
                    <button
                      key={tb.id}
                      onClick={() => {
                        setTab(tb.id);
                        setNavOpen(false);
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors border ${
                        active
                          ? "border-accent-40 text-accent bg-panel-soft"
                          : "border-transparent text-text-dim hover-text-text hover-bg-panel-soft"
                      }`}
                    >
                      <Icon size={16} />
                      {tb.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {(!online || pendingWrites > 0) && (
          <div
            className="flex items-center gap-2 justify-center text-xs px-4 py-2"
            style={{ background: !online ? "rgba(251,113,133,0.15)" : "rgba(165,148,255,0.15)" }}
          >
            {!online ? (
              <>
                <WifiOff size={13} className="text-danger shrink-0" />
                <span className="text-text-dim">{t.offlineBanner}</span>
              </>
            ) : (
              <>
                <RefreshCw size={13} className="text-accent shrink-0 animate-spin" />
                <span className="text-text-dim">{t.onlineSyncing}</span>
              </>
            )}
          </div>
        )}

        <main className="max-w-5xl mx-auto px-5 md:px-8 py-7">
          {showUsage && (
            <div className="flex items-start gap-2.5 bg-panel-soft border border-border-strong rounded-xl px-4 py-3 mb-5">
              <Info size={16} className="text-accent shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text mb-0.5">{t.usageTitle}</p>
                <p className="text-xs text-text-dim leading-relaxed">{t.usageText}</p>
              </div>
              <button
                onClick={() => setShowUsage(false)}
                className="text-text-faint hover-text-text shrink-0"
                aria-label={t.menuClose}
              >
                <X size={14} />
              </button>
            </div>
          )}
          {role === "teacher" ? (
            <TeacherView data={data} t={t} registerExport={registerExport} />
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:w-48 shrink-0">
                {adminTabs.map((tb) => {
                  const Icon = tb.icon;
                  const active = tab === tb.id;
                  return (
                    <button
                      key={tb.id}
                      onClick={() => setTab(tb.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap text-left transition-colors border ${
                        active
                          ? "border-accent-40 text-accent bg-panel"
                          : "border-transparent text-text-dim hover-text-text hover-bg-panel-soft"
                      }`}
                    >
                      <Icon size={15} />
                      {tb.label}
                    </button>
                  );
                })}
              </nav>

              <div className="flex-1 min-w-0">
                {tab === "teachers" && (
                  <ManageList
                    title={t.tabTeachers}
                    icon={Users}
                    items={data.teachers}
                    placeholder={t.teacherNamePlaceholder}
                    usageCheck={(x) => usedTeacherIds.has(x.id)}
                    t={t}
                    onAdd={(name) => setData({ ...data, teachers: [...data.teachers, { id: uid(), name }] })}
                    onEdit={(id, name) =>
                      setData({
                        ...data,
                        teachers: data.teachers.map((x) => (x.id === id ? { ...x, name } : x)),
                      })
                    }
                    onRemove={(id) =>
                      setData({
                        ...data,
                        teachers: data.teachers.filter((x) => x.id !== id),
                        assignments: data.assignments.filter((a) => a.teacherId !== id),
                        schedule: null,
                      })
                    }
                  />
                )}
                {tab === "classes" && (
                  <ManageList
                    title={t.tabClasses}
                    icon={Building2}
                    items={data.classes}
                    placeholder={t.classNamePlaceholder}
                    t={t}
                    onAdd={(name) => setData({ ...data, classes: [...data.classes, { id: uid(), name }] })}
                    onEdit={(id, name) =>
                      setData({
                        ...data,
                        classes: data.classes.map((x) => (x.id === id ? { ...x, name } : x)),
                      })
                    }
                    onRemove={(id) =>
                      setData({
                        ...data,
                        classes: data.classes.filter((x) => x.id !== id),
                        assignments: data.assignments.filter((a) => a.classId !== id),
                        schedule: null,
                      })
                    }
                  />
                )}
                {tab === "subjects" && (
                  <ManageList
                    title={t.tabSubjects}
                    icon={BookOpen}
                    items={data.subjects}
                    placeholder={t.subjectNamePlaceholder}
                    t={t}
                    onAdd={(name) => setData({ ...data, subjects: [...data.subjects, { id: uid(), name }] })}
                    onEdit={(id, name) =>
                      setData({
                        ...data,
                        subjects: data.subjects.map((x) => (x.id === id ? { ...x, name } : x)),
                      })
                    }
                    onRemove={(id) =>
                      setData({
                        ...data,
                        subjects: data.subjects.filter((x) => x.id !== id),
                        assignments: data.assignments.filter((a) => a.subjectId !== id),
                        schedule: null,
                      })
                    }
                  />
                )}
                {tab === "assignments" && <AssignmentsTab data={data} setData={setData} t={t} />}
                {tab === "schedule" && <ScheduleTab data={data} setData={setData} t={t} registerExport={registerExport} />}
              </div>
            </div>
          )}
        </main>

        <footer className="max-w-5xl mx-auto px-5 md:px-8 py-6 text-center">
          <p className="text-11 text-text-faint">{t.footerCredit}</p>
        </footer>

        {showTutorial && (
          <TutorialModal t={t} data={data} setData={setData} role={role} onClose={() => setShowTutorial(false)} />
        )}
      </div>
    </div>
  );
}
