"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  Check,
  Plus, 
  Minus,
  X,
  ClipboardList,
  Calendar,
  Clock,
  HelpCircle,
  MessageSquare,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCanvasStore } from "@/store/canvas";
import { mockProject, mockCountHistory } from "@/lib/mockData";
import { cn, formatNumber } from "@/lib/utils";

// --- Helper to format timer ---
const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const getFormattedDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export default function FloorCountPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const floorId = params.floorId as string;

  const { floors, addCountEntry } = useCanvasStore();
  
  const floor = floors.find(f => f.id === floorId) || floors[0];
  const rooms = floor?.rooms || [];
  const zones = floor?.zones || [];

  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [startDate, setStartDate] = useState(getFormattedDate(new Date()));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return getFormattedDate(d);
  });
  
  const [currentDay] = useState(1);
  const [currentRound] = useState(1);
  const [activeSection, setActiveSection] = useState<"left" | "right">("left");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  
  const [sessionCounts, setSessionCounts] = useState<Record<string, number>>({});
  const [verifiedSeats, setVerifiedSeats] = useState<Record<string, boolean>>({});
  const [roomSeats, setRoomSeats] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    rooms.forEach(r => {
      const hash = r.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      initial[r.id] = 4 + (hash % 8);
    });
    return initial;
  });
  const [comments, setComments] = useState("");
  const [showStopModal, setShowStopModal] = useState(false);
  const [isSessionSaved, setIsSessionSaved] = useState(false);
  const [pendingNav, setPendingNav] = useState<string | null>(null);

  const [selectedProject, setSelectedProject] = useState(mockProject.name);
  const [selectedFloorName, setSelectedFloorName] = useState(floor?.name || "Ground Floor");
  const [showNextFloorModal, setShowNextFloorModal] = useState(false);
  const [showSeatVerifyModal, setShowSeatVerifyModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [selectedPredefined, setSelectedPredefined] = useState<string[]>([]);

  const predefinedQuestions = [
    "How do I count people in temporary desks?",
    "What should I do if a room is locked?",
    "Are children included in the count?",
    "How to handle multi-purpose zones?",
    "Guidance on counting people in transition"
  ];

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  const selectedZone = zones.find(z => z.id === selectedRoom?.zoneId);

  const handleStartSession = () => setIsRecording(true);
  const handleStopSession = () => {
    const countedAny = Object.keys(sessionCounts).length > 0;
    if (!countedAny) {
      alert("Please count at least one room before stopping the session.");
      return;
    }
    setIsRecording(false);
    setTimer(0);
  };

  const handleStartCounting = (roomId: string) => {
    setSelectedRoomId(roomId);
    if (!verifiedSeats[roomId]) {
      setShowSeatVerifyModal(true);
    }
    setActiveSection("right");
    if (sessionCounts[roomId] === undefined) {
      setSessionCounts(prev => ({ ...prev, [roomId]: 0 }));
    }
  };

  const adjustCount = (delta: number) => {
    if (!selectedRoomId) return;
    setSessionCounts(prev => ({ ...prev, [selectedRoomId]: Math.max(0, (prev[selectedRoomId] || 0) + delta) }));
  };

  const handleRecordCount = () => {
    if (!selectedRoomId || !floor) return;
    const count = sessionCounts[selectedRoomId] || 0;
    
    // Save count
    addCountEntry(floor.id, selectedRoomId, {
      count, 
      by: "You", 
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), 
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    });

    // Sequential counting logic
    const currentIndex = rooms.findIndex(r => r.id === selectedRoomId);
    if (currentIndex < rooms.length - 1) {
      // Go to next room
      const nextRoomId = rooms[currentIndex + 1].id;
      setSelectedRoomId(nextRoomId);
      if (!verifiedSeats[nextRoomId]) {
        setShowSeatVerifyModal(true);
      }
    } else {
      // Done with all rooms
      setActiveSection("left");
      setShowNextFloorModal(true);
    }
  };

  const isLastRoom = rooms.findIndex(r => r.id === selectedRoomId) === rooms.length - 1;

  const handleBackToCanvas = () => {
    if (isRecording) {
      setPendingNav(`/project/${projectId}/floor/${floorId}`);
      setShowStopModal(true);
    } else {
      router.push(`/project/${projectId}/floor/${floorId}`);
    }
  };

  const handleStopSessionClick = () => {
    setShowStopModal(true);
  };

  const confirmStopSession = () => {
    setIsRecording(false);
    setTimer(0);
    setIsSessionSaved(true);
    setShowStopModal(false);
    if (pendingNav) {
      router.push(pendingNav);
    }
  };

  const toggleVerify = (roomId: string) => setVerifiedSeats(prev => ({ ...prev, [roomId]: !prev[roomId] }));
  const updateSeats = (roomId: string, val: number) => { if (!verifiedSeats[roomId]) setRoomSeats(prev => ({ ...prev, [roomId]: Math.max(1, val) })); };

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col font-body overflow-hidden">
      {/* --- Refined Header --- */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-3 shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleBackToCanvas} 
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
            >
              <ArrowLeft size={14} /> Back to canvas
            </button>
            <div className="w-px h-6 bg-[#E2E8F0]" />
            <h1 className="text-lg font-800 text-text leading-none" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>Room counting</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              size="sm" 
              className="border-primary text-primary h-11 rounded-2xl px-6 gap-2"
              onClick={() => setShowQuestionsModal(true)}
              icon={<HelpCircle size={16} />}
            >
              Got questions?
            </Button>

            <Button 
              variant="secondary" 
              size="sm" 
              disabled={activeSection === "right"}
              className="border-primary text-primary h-11 rounded-2xl px-6"
              onClick={() => router.push(`/project/${projectId}/floor/${floorId}/history`)}
            >
              View history
            </Button>

            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }} 
                  className="flex items-center gap-4 bg-white border border-primary rounded-2xl px-4 h-11 shadow-sm"
                >
                  <span className="text-lg font-bold text-primary tabular-nums" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{formatTime(timer)}</span>
                  <button onClick={handleStopSessionClick} className="w-8 h-8 rounded-full bg-[#EF4444] flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-200">
                    <div className="w-3 h-3 rounded-sm bg-white" />
                  </button>
                </motion.div>
              ) : (
                <Button onClick={handleStartSession} className="gap-2 rounded-2xl h-11 px-6 shadow-lg shadow-primary/20" icon={<Play size={16} fill="currentColor" />}>
                  Start session
                </Button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* --- Refined Sub Header --- */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-4 shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Project:</span>
            <span className="text-sm font-bold text-text">{selectedProject}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Floor:</span>
            <div className="relative min-w-[160px]">
              <select 
                value={selectedFloorName} 
                onChange={(e) => setSelectedFloorName(e.target.value)}
                className="appearance-none block w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-4 pr-10 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-primary transition-all"
              >
                <option>Ground Floor</option>
                <option>1st Floor</option>
                <option>2nd Floor</option>
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-hidden flex relative p-6 gap-6 max-w-[1600px] mx-auto w-full">
        {/* --- Left Section (Collapsible) --- */}
        <motion.div 
          layout
          animate={{ 
            width: activeSection === "left" ? "100%" : "56px",
            opacity: 1 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
          className={cn(
            "flex flex-col h-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden",
            activeSection === "right" && "items-center"
          )}
        >
          {activeSection === "right" ? (
            <div className="flex flex-col items-center h-full pt-6 bg-white w-full">
               <button onClick={() => setActiveSection("left")} className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-text-muted hover:text-primary transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <>
              <div className="px-6 py-5 border-b border-[#F1F5F9] flex flex-col gap-1">
                <h3 className="text-lg font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Session details</h3>
                <p className="text-xs text-text-muted">Please click on the Start button to start this session.</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="flex items-center gap-8 py-2">
                  <div className="flex items-center gap-4">
                    <label className="text-[10px] font-bold text-text-muted tracking-wider uppercase whitespace-nowrap">Start date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="block w-40 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs font-bold text-text focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-[10px] font-bold text-text-muted tracking-wider uppercase whitespace-nowrap">End date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="block w-40 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2 text-xs font-bold text-text focus:outline-none focus:border-primary transition-all" />
                  </div>
                  
                  <div className="ml-auto text-right">
                    <p className="text-sm font-bold text-primary" style={{ fontFamily: "var(--font-manrope)" }}>Round 1 of 5 today · Day 1 of 14</p>
                  </div>
                </div>

                {/* --- Consolidated Summary Stats --- */}
                <div className="flex bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl overflow-hidden divide-x divide-[#E2E8F0] shadow-sm">
                  <div className="flex-1 p-5 flex flex-col gap-1 hover:bg-white/50 transition-colors">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total seats in floor</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-800 text-primary" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                        {formatNumber(rooms.reduce((acc, r) => acc + (roomSeats[r.id] || 0), 0))}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted uppercase">Seats total</span>
                    </div>
                  </div>
                  <div className="flex-1 p-5 flex flex-col gap-1 hover:bg-white/50 transition-colors">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Seats used today (Avg)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-800 text-primary" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                        {formatNumber(Math.round(rooms.reduce((acc, r) => acc + (sessionCounts[r.id] || 0), 0) / (rooms.length || 1)))}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted uppercase">Occupants avg</span>
                    </div>
                  </div>
                  <div className="flex-1 p-5 flex flex-col gap-1 hover:bg-white/50 transition-colors">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total floor area</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-800 text-primary" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                        {formatNumber(rooms.reduce((acc, r) => acc + (r.sqm || 25), 0))}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted uppercase">m² total</span>
                    </div>
                  </div>
                </div>

                <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <tr className="text-[11px] font-bold text-text-muted">
                        <th className="px-4 py-3 border-r border-[#E2E8F0]">Room</th>
                        <th className="px-4 py-3 border-r border-[#E2E8F0]">Category</th>
                        <th className="px-4 py-3 border-r border-[#E2E8F0]">Square Meters</th>
                        <th className="px-4 py-3 border-r border-[#E2E8F0]">No of seats</th>
                        <th className="px-4 py-3">Counting</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {rooms.map((room) => {
                        const isVerified = verifiedSeats[room.id];
                        const count = sessionCounts[room.id];
                        return (
                          <tr key={room.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-4 py-4 text-sm font-bold text-text border-r border-[#F1F5F9]">{room.name}</td>
                            <td className="px-4 py-4 text-sm text-text-muted border-r border-[#F1F5F9]">
                              <span className="px-2 py-1 rounded-md bg-[#F1F5F9] text-[10px] font-bold">Meeting</span>
                            </td>
                            <td className="px-4 py-4 text-sm text-text-muted border-r border-[#F1F5F9]">
                              <span className="font-mono font-bold text-primary">{formatNumber(room.sqm || 25)} m²</span>
                            </td>
                             <td className="px-4 py-4 text-sm border-r border-[#F1F5F9]">
                               <div className="flex items-center gap-3">
                                 <input 
                                   type="number" 
                                   value={roomSeats[room.id]} 
                                   disabled={isVerified} 
                                   onChange={(e) => updateSeats(room.id, parseInt(e.target.value))} 
                                   className={cn(
                                     "w-16 rounded-lg border px-2 py-1.5 text-center font-bold focus:outline-none transition-all", 
                                     isVerified ? "bg-[#F1F5F9] border-transparent text-text-muted" : "bg-white border-[#E2E8F0] text-primary"
                                   )} 
                                 />
                                 <Button 
                                   variant="secondary" 
                                   size="sm" 
                                   disabled={!isRecording || isVerified} 
                                   onClick={() => toggleVerify(room.id)}
                                   className={cn(
                                     "w-auto px-4 h-9 border-primary text-primary transition-all text-sm font-bold", 
                                     isVerified && "bg-transparent text-primary border-transparent opacity-100 cursor-default"
                                   )}
                                 >
                                   {isVerified ? (
                                     <div className="flex items-center gap-1.5">
                                       <Check size={14} strokeWidth={3} />
                                       <span>Verified</span>
                                     </div>
                                   ) : "Verify"}
                                 </Button>
                               </div>
                            </td>
                            <td className="px-4 py-4">
                              {count !== undefined ? (
                                <div className="flex items-center justify-between px-2">
                                  <span className="text-lg font-900 text-primary" style={{ fontFamily: "var(--font-manrope)" }}>{count}</span>
                                  <button onClick={() => handleStartCounting(room.id)} className="text-xs font-semibold text-text-muted hover:text-primary underline underline-offset-4">Edit</button>
                                </div>
                              ) : (
                                <Button 
                                  variant="secondary" 
                                  size="sm" 
                                  disabled={!isRecording} 
                                  onClick={() => handleStartCounting(room.id)} 
                                  className="w-auto px-4 border-primary text-primary"
                                >
                                  Start counting
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* --- Right Section (Counter) --- */}
        <AnimatePresence>
          {activeSection === "right" && (
            <motion.div 
              layout
              initial={{ x: 400, opacity: 0 }} 
              animate={{ x: 0, opacity: 1, flex: 1 }} 
              exit={{ x: 400, opacity: 0 }} 
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="flex flex-col h-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-text leading-none mb-1" style={{ fontFamily: "var(--font-manrope)" }}>{selectedRoom?.name}</h3>
                  <p className="text-xs text-text-muted">{selectedZone ? selectedZone.name : "Unzoned room"}</p>
                </div>
                <button onClick={() => setActiveSection("left")} className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-text-muted hover:text-primary transition-all"><ChevronLeft size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                 <div className="text-center space-y-8">
                    <p className="text-sm font-bold text-primary" style={{ fontFamily: "var(--font-manrope)" }}>Round 1 of 5 today · Day 1 of 14</p>
                   <div className="space-y-4">
                     <p className="text-[11px] font-bold text-text-muted tracking-widest">Current occupancy count</p>
                     <div className="flex items-center justify-center gap-10">
                       <button onClick={() => adjustCount(-1)} className="w-20 h-20 rounded-2xl border-2 border-[#E2E8F0] flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-all"><Minus size={28} strokeWidth={3} /></button>
                       <span className="text-8xl font-900 text-text tabular-nums" style={{ fontFamily: "var(--font-manrope)", fontWeight: 900 }}>{formatNumber(sessionCounts[selectedRoomId!] || 0)}</span>
                       <button onClick={() => adjustCount(1)} className="w-20 h-20 rounded-2xl border-2 border-primary bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-all"><Plus size={28} strokeWidth={3} /></button>
                     </div>
                   </div>
                   <div className="flex justify-center">
                    <Button 
                      size="lg" 
                      className="w-auto px-10 h-12 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 gap-2" 
                      onClick={handleRecordCount}
                      icon={!isLastRoom ? <ArrowRight size={18} /> : undefined}
                      iconPosition="right"
                    >
                      {isLastRoom ? "Done" : "Save count & continue"}
                    </Button>
                   </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Room history</h4>
                      <button className="text-xs font-semibold text-primary" onClick={() => router.push(`/project/${projectId}/floor/${floorId}/history`)}>View all</button>
                    </div>
                    
                    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                          <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                            <th className="px-3 py-2">Date</th>
                            <th className="px-3 py-2">Time</th>
                            <th className="px-3 py-2">Round</th>
                            <th className="px-3 py-2">No. of seats</th>
                            <th className="px-3 py-2">Count</th>
                            <th className="px-3 py-2 text-right">By</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9]">
                          {(selectedRoom?.countHistory.length ? selectedRoom.countHistory : mockCountHistory).slice(0, 5).map((entry, i) => (
                            <tr key={i} className="text-[12px] text-text hover:bg-[#F8FAFC] transition-colors">
                              <td className="px-3 py-3 font-medium">
                                <div className="flex items-center gap-1.5">
                                  <Calendar size={12} className="text-text-muted" />
                                  {entry.date}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-text-muted">
                                <div className="flex items-center gap-1.5">
                                  <Clock size={12} />
                                  {entry.time}
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <span className="text-primary font-bold">Round {i + 1}</span>
                              </td>
                              <td className="px-3 py-3 text-text-muted">
                                {roomSeats[selectedRoomId!] || 0}
                              </td>
                              <td className="px-3 py-3 font-bold text-lg tabular-nums">
                                {formatNumber(entry.count)}
                              </td>
                              <td className="px-3 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <span className="text-text-muted">{entry.by}</span>
                                  <div className="w-5 h-5 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[8px] font-bold text-primary border border-white shrink-0">
                                    {entry.by.split(" ").map(n => n[0]).join("")}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-[#E2E8F0] px-6 py-3 shrink-0 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-text-muted tracking-wider">System ready</span>
            </div>
            <div className="text-[10px] text-text-muted font-bold">Round 1 of 5 today · Day 1 of 14</div>
         </div>
         <div className="text-[10px] text-text-muted font-mono">Areasim workspace intelligence</div>
      </footer>

      {/* --- Seat Verification Modal --- */}
      <AnimatePresence>
        {showSeatVerifyModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full"
            >
              <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Verification required</h3>
                </div>
                <button onClick={() => setShowSeatVerifyModal(false)} className="text-text-muted hover:text-text transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 text-center space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xl font-800 text-text" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>Verify no. of seats</h4>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Number of seats for <span className="font-bold text-text">{selectedRoom?.name}</span> is not verified yet. Please verify it before counting.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                  <div className="flex-1 text-left">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Seats capacity</label>
                    <input 
                      type="number" 
                      value={roomSeats[selectedRoomId!] || ""} 
                      onChange={(e) => updateSeats(selectedRoomId!, parseInt(e.target.value))}
                      className="bg-transparent border-none p-0 text-xl font-bold text-primary focus:ring-0 w-full"
                      placeholder="Enter seats"
                    />
                  </div>
                  <Button 
                    className="h-11 px-6 rounded-xl shadow-lg shadow-primary/20" 
                    onClick={() => {
                      if (selectedRoomId) {
                        setVerifiedSeats(prev => ({ ...prev, [selectedRoomId]: true }));
                        setShowSeatVerifyModal(false);
                      }
                    }}
                  >
                    Verify
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Confirmation Modal --- */}
      <AnimatePresence>
        {showStopModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ClipboardList size={18} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Finish session</h3>
                </div>
                <button onClick={() => { setShowStopModal(false); setPendingNav(null); }} className="text-text-muted hover:text-text transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 text-center space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xl font-800 text-text" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>Stop this session?</h4>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Are you sure you want to stop this session? Once stopped, the data will be locked and saved to the history.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="secondary" 
                    className="flex-1 h-12 rounded-xl border-[#E2E8F0]" 
                    onClick={() => { setShowStopModal(false); setPendingNav(null); }}
                  >
                    Not now
                  </Button>
                  <Button 
                    className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20" 
                    onClick={confirmStopSession}
                  >
                    Yes, stop session
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* --- Got Questions Modal --- */}
      <AnimatePresence>
        {showQuestionsModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-lg w-full"
            >
              <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare size={18} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Got questions?</h3>
                </div>
                <button onClick={() => setShowQuestionsModal(false)} className="text-text-muted hover:text-text transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Common Questions</p>
                  <div className="grid gap-2">
                    {predefinedQuestions.map((q, i) => {
                      const isSelected = selectedPredefined.includes(q);
                      return (
                        <button 
                          key={i} 
                          onClick={() => {
                            if (isSelected) setSelectedPredefined(prev => prev.filter(item => item !== q));
                            else setSelectedPredefined(prev => [...prev, q]);
                          }}
                          className={cn(
                            "text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center justify-between group",
                            isSelected 
                              ? "bg-primary border-primary text-white" 
                              : "bg-[#F8FAFC] border-[#E2E8F0] text-text hover:border-primary/50"
                          )}
                        >
                          {q}
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            isSelected ? "bg-white border-white text-primary" : "border-[#E2E8F0] group-hover:border-primary/50"
                          )}>
                            {isSelected && <Check size={10} strokeWidth={4} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Something else?</p>
                  <textarea 
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Type your question here..."
                    className="w-full h-24 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                <Button 
                  className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 gap-2" 
                  onClick={() => {
                    alert("Your questions have been sent to our consultants. They will get back to you shortly.");
                    setShowQuestionsModal(false);
                    setSelectedPredefined([]);
                    setCustomQuestion("");
                  }}
                  icon={<Send size={16} />}
                >
                  Send to consultants
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* --- Next Floor Modal --- */}
      <AnimatePresence>
        {showNextFloorModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0A1929]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden max-w-md w-full"
            >
              <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Check size={18} className="text-emerald-600" strokeWidth={3} />
                  </div>
                  <h3 className="font-bold text-text" style={{ fontFamily: "var(--font-manrope)" }}>Floor completed</h3>
                </div>
                <button onClick={() => setShowNextFloorModal(false)} className="text-text-muted hover:text-text transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 text-center space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xl font-800 text-text" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>Select next floor</h4>
                  <p className="text-sm text-text-muted leading-relaxed">
                    You have finished counting all rooms on the current floor. Please select the next floor to count the rooms in that floor also during this session.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <select 
                      className="appearance-none block w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-4 pr-10 py-3 text-sm font-bold text-text focus:outline-none focus:border-primary transition-all"
                      onChange={(e) => {
                        setSelectedFloorName(e.target.value);
                        setShowNextFloorModal(false);
                      }}
                    >
                      <option value="">Select floor...</option>
                      <option>1st Floor</option>
                      <option>2nd Floor</option>
                      <option>3rd Floor</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                  <Button 
                    variant="secondary"
                    className="w-full h-12 rounded-xl border-[#E2E8F0]" 
                    onClick={() => setShowNextFloorModal(false)}
                  >
                    Close for now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
