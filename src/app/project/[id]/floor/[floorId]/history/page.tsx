"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User as UserIcon,
  ChevronDown,
  LayoutGrid
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { useCanvasStore } from "@/store/canvas";
import { Button } from "@/components/ui/Button";
import { cn, formatNumber } from "@/lib/utils";

// --- Mock History Generation ---
const generateRoomHistory = (roomName: string) => {
  const hash = roomName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rounds = ["Round 1", "Round 2", "Round 3", "Round 4", "Round 5"];
  
  return rounds.map((round, i) => {
    // Generate a semi-realistic occupancy pattern
    const base = 5 + (hash % 15);
    const fluctuation = Math.sin((i + hash) * 0.8) * 5;
    const count = Math.max(0, Math.round(base + fluctuation));
    
    return {
      round,
      count,
      time: `${9 + i * 2}:00 ${9 + i * 2 >= 12 ? "PM" : "AM"}`,
      date: "Apr 22, 2024",
      by: i % 2 === 0 ? "John K." : "Sarah L."
    };
  });
};

export default function RoomHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const floorId = params.floorId as string;

  const { floors } = useCanvasStore();
  const floor = floors.find(f => f.id === floorId) || floors[0];
  const rooms = floor?.rooms || [];

  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || "");
  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  const historyData = useMemo(() => {
    if (!selectedRoom) return [];
    return generateRoomHistory(selectedRoom.name);
  }, [selectedRoom]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col font-body overflow-hidden">
      {/* --- Header --- */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push(`/project/${projectId}/floor/${floorId}/count`)} 
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
            >
              <ArrowLeft size={14} /> Back to counting
            </button>
            <div className="w-px h-6 bg-[#E2E8F0]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase mb-0.5">Analytics</span>
              <h1 className="text-xl font-800 text-text leading-none" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>
                Room history
              </h1>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl shadow-sm hover:border-primary transition-all min-w-[220px]"
            >
              <LayoutGrid size={16} className="text-primary" />
              <div className="flex-1 text-left">
                <p className="text-[10px] text-text-muted font-bold uppercase leading-none mb-1">Selected room</p>
                <p className="text-sm font-bold text-text leading-none">{selectedRoom?.name || "Select room"}</p>
              </div>
              <ChevronDown size={14} className={cn("text-text-muted transition-transform", isDropdownOpen && "rotate-180")} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 py-2 max-h-[300px] overflow-y-auto">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm transition-colors",
                      selectedRoomId === room.id ? "bg-primary/5 text-primary font-bold" : "text-text hover:bg-[#F8FAFC]"
                    )}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* --- Chart Section --- */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col h-[40vh] min-h-[300px]">
            <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]/50">
              <div>
                <h3 className="text-lg font-bold text-text leading-none mb-1" style={{ fontFamily: "var(--font-manrope)" }}>Occupancy trends</h3>
                <p className="text-xs text-text-muted">Tracking count variation across different rounds</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-[11px] font-bold text-text-muted">Actual count</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-6 pr-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="round" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 600, fill: "#8CA3B0" }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 600, fill: "#8CA3B0" }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                    labelStyle={{ fontWeight: "bold", color: "#0D1B2A", marginBottom: "4px" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#6366F1" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* --- History Table Section --- */}
          <section className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-[#F1F5F9] bg-[#F8FAFC]/50">
              <h3 className="text-lg font-bold text-text leading-none" style={{ fontFamily: "var(--font-manrope)" }}>Session records</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Round</th>
                    <th className="px-6 py-4">No. of seats</th>
                    <th className="px-6 py-4">Count</th>
                    <th className="px-6 py-4 text-right">Conducted by</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {historyData.map((row, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={idx} 
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-text">
                          <Calendar size={14} className="text-text-muted" strokeWidth={2.5} />
                          {row.date}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-text-muted font-medium">
                          <Clock size={14} className="text-text-muted" strokeWidth={2.5} />
                          {row.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-primary font-bold text-sm">
                          {row.round}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-text-muted font-medium">12</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xl font-800 text-text tabular-nums" style={{ fontFamily: "var(--font-manrope)", fontWeight: 800 }}>{formatNumber(row.count)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-sm text-text-muted font-medium">{row.by}</span>
                          <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-bold text-primary border border-white shrink-0">
                            {row.by.split(" ").map(n => n[0]).join("")}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {historyData.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-sm text-text-muted">No history records found for this room.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-[#E2E8F0] px-6 py-4 shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-[11px] text-[#8CA3B0] font-bold tracking-wider uppercase">
          <span>Areasim analytics engine</span>
          <span className="font-mono">Export CSV • Export PDF</span>
        </div>
      </footer>
    </div>
  );
}
