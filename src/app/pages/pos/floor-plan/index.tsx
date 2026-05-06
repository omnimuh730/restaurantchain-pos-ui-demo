import { useCallback, useEffect, useRef, useState, lazy, Suspense, startTransition } from "react";
import { CalendarRange, LayoutGrid, TableProperties } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useColors, useIsMobile } from "./useColors";
import { useTheme } from "../theme-context";
import { INITIAL_FLOORS, SAMPLE_RESERVATIONS } from "./data";
import { SNAP_GRID, BASE_W, BASE_H } from "./types";
import type { Table, Floor, Reservation, ViewMode } from "./types";
import { FloorTabsRow } from "./FloorTabsRow";
import { FloorCanvas } from "./FloorCanvas";
import { EditMode } from "./EditMode";
import { TableCardView } from "./TableCardView";
import { TableDrawer, type FloorPlanPayRequest } from "./TableDrawer";
import { useThemeClasses } from "../theme-context";
import { POS_OVERLAY_BACKDROP } from "../posOverlayLayers";

const PaymentPage = lazy(() => import("../payment"));
import { CalendarView } from "./CalendarView";
import { useNavBadges } from "../NavBadgeContext";

export default function FloorPlan() {
  const { t: tf } = useTranslation("floor");
  const C = useColors();
  const { isDark, role } = useTheme();
  const isMobile = useIsMobile();
  const tc = useThemeClasses();
  const [payDetails, setPayDetails] = useState<FloorPlanPayRequest | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [payMounted, setPayMounted] = useState(false);
  const [payAnim, setPayAnim] = useState(false);

  useEffect(() => {
    if (payOpen) {
      setPayMounted(true);
      const id = requestAnimationFrame(() => setPayAnim(true));
      return () => cancelAnimationFrame(id);
    }
    setPayAnim(false);
    const t = setTimeout(() => setPayMounted(false), 300);
    return () => clearTimeout(t);
  }, [payOpen]);
  const [viewMode, setViewMode] = useState<ViewMode>("floor");
  const [floors, setFloors] = useState<Floor[]>(INITIAL_FLOORS);
  const [activeFloorId, setActiveFloorId] = useState("f1");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showSeats, setShowSeats] = useState(true);
  const [history, setHistory] = useState<Floor[][]>([INITIAL_FLOORS]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [dragging, setDragging] = useState<string | null>(null);
  const [editingFloorName, setEditingFloorName] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [guides, setGuides] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [zoom, setZoom] = useState(1);
  const [reservations, setReservations] = useState<Reservation[]>(SAMPLE_RESERVATIONS);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { setBadge } = useNavBadges();
  useEffect(() => {
    const pending = reservations.filter((r) => r.type === "request").length;
    setBadge("", pending);
  }, [reservations, setBadge]);

  const activeFloor = floors.find((f) => f.id === activeFloorId)!;
  const tables = activeFloor?.tables ?? [];

  const pushHistory = useCallback((newFloors: Floor[]) => {
    const h = history.slice(0, historyIdx + 1);
    h.push(newFloors);
    setHistory(h);
    setHistoryIdx(h.length - 1);
  }, [history, historyIdx]);

  const undo = () => { if (historyIdx > 0) { setHistoryIdx(historyIdx - 1); setFloors(history[historyIdx - 1]); } };
  const redo = () => { if (historyIdx < history.length - 1) { setHistoryIdx(historyIdx + 1); setFloors(history[historyIdx + 1]); } };

  const updateTables = useCallback((newTables: Table[], skipHistory = false) => {
    const nf = floors.map((f) => f.id === activeFloorId ? { ...f, tables: newTables } : f);
    setFloors(nf);
    if (!skipHistory) pushHistory(nf);
  }, [floors, activeFloorId, pushHistory]);

  const updateFloorName = (name: string) => {
    const nf = floors.map((f) => f.id === activeFloorId ? { ...f, name } : f);
    setFloors(nf);
    pushHistory(nf);
  };

  const renameFloorById = (id: string, name: string) => {
    const nf = floors.map((f) => f.id === id ? { ...f, name } : f);
    setFloors(nf);
    pushHistory(nf);
  };

  const addFloor = (name?: string) => {
    const num = floors.length + 1;
    const finalName = (name && name.trim()) || `${num}F`;
    const nf: Floor = { id: `f${Date.now()}`, name: finalName, tables: [] };
    const newFloors = [...floors, nf];
    setFloors(newFloors);
    setActiveFloorId(nf.id);
    pushHistory(newFloors);
  };

  const removeFloor = (id: string) => {
    if (floors.length <= 1) return;
    const idx = floors.findIndex((f) => f.id === id);
    const newFloors = floors.filter((f) => f.id !== id);
    setFloors(newFloors);
    if (activeFloorId === id) {
      const next = newFloors[Math.max(0, idx - 1)] ?? newFloors[0];
      setActiveFloorId(next.id);
    }
    pushHistory(newFloors);
  };

  const addTable = () => {
    const num = tables.length + 1;
    const sx = Math.round((80 + Math.random() * 200) / SNAP_GRID) * SNAP_GRID;
    const sy = Math.round((80 + Math.random() * 200) / SNAP_GRID) * SNAP_GRID;
    const t: Table = { id: `T${Date.now()}`, label: tf("mock.tableLabel", { n: String(num) }), seats: 4, shape: "rect", x: sx, y: sy, width: BASE_W, height: BASE_H, status: "available" };
    updateTables([...tables, t]);
    setSelectedTable(t.id);
  };

  const deleteTable = (id: string) => { updateTables(tables.filter((t) => t.id !== id)); if (selectedTable === id) setSelectedTable(null); };

  const duplicateTable = (id: string) => {
    const src = tables.find((t) => t.id === id);
    if (!src) return;
    const dup: Table = { ...src, id: `T${Date.now()}`, label: `${src.label} copy`, x: src.x + 30, y: src.y + 30 };
    updateTables([...tables, dup]);
    setSelectedTable(dup.id);
  };

  const updateSelectedProp = <K extends keyof Table>(key: K, val: Table[K]) => {
    if (!selectedTable) return;
    updateTables(tables.map((t) => t.id === selectedTable ? { ...t, [key]: val } : t));
  };

  // Drag table in edit mode
  const handleMouseDown = (e: React.MouseEvent, tableId: string) => {
    if (!editMode) return;
    const t = tables.find((t) => t.id === tableId);
    const scrollEl = scrollRef.current;
    if (!t || !scrollEl) return;
    const rect = scrollEl.getBoundingClientRect();
    const scrollX = scrollEl.scrollLeft;
    const scrollY = scrollEl.scrollTop;
    setDragging(tableId);
    setSelectedTable(tableId);
    setDragOffset({ x: (e.clientX - rect.left + scrollX) / zoom - t.x, y: (e.clientY - rect.top + scrollY) / zoom - t.y });
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;
      const rect = scrollEl.getBoundingClientRect();
      const scrollX = scrollEl.scrollLeft;
      const scrollY = scrollEl.scrollTop;
      let nx = (e.clientX - rect.left + scrollX) / zoom - dragOffset.x;
      let ny = (e.clientY - rect.top + scrollY) / zoom - dragOffset.y;
      nx = Math.round(nx / SNAP_GRID) * SNAP_GRID;
      ny = Math.round(ny / SNAP_GRID) * SNAP_GRID;
      nx = Math.max(0, Math.min(nx, 2400 - 60));
      ny = Math.max(0, Math.min(ny, 1800 - 60));
      const dt = tables.find((t) => t.id === dragging)!;
      const cx = nx + dt.width / 2, cy = ny + dt.height / 2;
      let sx: number | null = null, sy: number | null = null;
      for (const ot of tables) {
        if (ot.id === dragging) continue;
        const ocx = ot.x + ot.width / 2, ocy = ot.y + ot.height / 2;
        if (Math.abs(cx - ocx) < 12) { sx = ocx; nx = ocx - dt.width / 2; }
        if (Math.abs(cy - ocy) < 12) { sy = ocy; ny = ocy - dt.height / 2; }
      }
      setGuides({ x: sx, y: sy });
      const nf = floors.map((f) => f.id === activeFloorId ? { ...f, tables: tables.map((t) => t.id === dragging ? { ...t, x: nx, y: ny } : t) } : f);
      setFloors(nf);
    };
    const up = () => { pushHistory(floors); setDragging(null); setGuides({ x: null, y: null }); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [dragging, dragOffset, tables, floors, activeFloorId, pushHistory]);

  const sel = selectedTable ? tables.find((t) => t.id === selectedTable) : null;

  if (editMode) {
    return (
      <EditMode
        activeFloor={activeFloor} tables={tables} selectedTable={selectedTable} setSelectedTable={setSelectedTable}
        showSeats={showSeats} setShowSeats={setShowSeats}
        editingFloorName={editingFloorName} setEditingFloorName={setEditingFloorName}
        updateFloorName={updateFloorName} setEditMode={setEditMode}
        undo={undo} redo={redo} historyIdx={historyIdx} historyLength={history.length}
        addTable={addTable} deleteTable={deleteTable} duplicateTable={duplicateTable}
        updateSelectedProp={updateSelectedProp} updateTables={updateTables}
        handleMouseDown={handleMouseDown} guides={guides}
        zoom={zoom} setZoom={setZoom} isMobile={isMobile} scrollRef={scrollRef}
      />
    );
  }

  return (
    <div className="h-full flex flex-col relative" style={{ background: C.bg }}>
      {/* Header: view mode tabs + edit layout */}
      <div className={`grid grid-cols-3 items-center gap-2 px-4 py-3 border-b ${isDark ? "border-gray-700 bg-[#1e2330]" : "border-slate-300 bg-white"}`}>
        <div />
        <div className="flex gap-1 rounded-lg justify-self-center" style={{ background: C.raised }}>
          <button onClick={() => setViewMode("floor")} className="flex items-center gap-2 px-4 py-2 rounded transition-all cursor-pointer text-sm whitespace-nowrap" style={{ background: viewMode === "floor" ? C.primary : "transparent", color: viewMode === "floor" ? "#ffffff" : C.text2 }}>
            <LayoutGrid size={20} /><span className="hidden sm:inline">{tf("views.floor")}</span>
          </button>
          <button onClick={() => setViewMode("table")} className="flex items-center gap-2 px-4 py-2 rounded transition-all cursor-pointer text-sm whitespace-nowrap" style={{ background: viewMode === "table" ? C.primary : "transparent", color: viewMode === "table" ? "#ffffff" : C.text2 }}>
            <TableProperties size={20} /><span className="hidden sm:inline">{tf("views.table")}</span>
          </button>
          <button onClick={() => setViewMode("calendar")} className="flex items-center gap-2 px-4 py-2 rounded transition-all cursor-pointer text-sm whitespace-nowrap" style={{ background: viewMode === "calendar" ? C.primary : "transparent", color: viewMode === "calendar" ? "#ffffff" : C.text2 }}>
            <CalendarRange size={20} /><span className="hidden sm:inline">{tf("views.calendar")}</span>
          </button>
        </div>
        <div />
      </div>

      {viewMode === "floor" ? (
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: C.bg }}>
          <FloorTabsRow floors={floors} activeFloorId={activeFloorId} setActiveFloorId={setActiveFloorId} addFloor={addFloor} removeFloor={removeFloor} setEditMode={setEditMode} onRenameFloor={renameFloorById} showSeats={showSeats} setShowSeats={setShowSeats} />
          <div className="flex-1 overflow-hidden">
            <FloorCanvas
              tables={tables} editMode={false} selectedTable={selectedTable} setSelectedTable={setSelectedTable}
              showSeats={showSeats} zoom={zoom} setZoom={setZoom} onMouseDown={handleMouseDown}
              guides={guides} addTable={addTable} isMobile={isMobile} setMobileEditDrawerOpen={() => {}}
              scrollRef={scrollRef}
            />
          </div>
        </div>
      ) : viewMode === "table" ? (
        <TableCardView
          floors={floors} activeFloorId={activeFloorId} setActiveFloorId={setActiveFloorId}
          tables={tables} addFloor={addFloor} setEditMode={setEditMode}
          renameFloorById={renameFloorById} showSeats={showSeats} setShowSeats={setShowSeats}
          setSelectedTable={setSelectedTable}
        />
      ) : (
        <CalendarView floors={floors} reservations={reservations} setReservations={setReservations} />
      )}

      {/* Shared animated drawer for floor & table view */}
      {!editMode && (viewMode === "floor" || viewMode === "table") && (
        <TableDrawer
          table={sel ?? null}
          onClose={() => setSelectedTable(null)}
          isMobile={isMobile}
          onRequestPay={(d) => {
            setPayDetails(d);
            startTransition(() => setPayOpen(true));
          }}
        />
      )}

      {payMounted && (
        <div
          aria-hidden="true"
          onClick={() => startTransition(() => setPayOpen(false))}
          className={`${POS_OVERLAY_BACKDROP} bg-black/40 sm:absolute sm:inset-0 sm:top-0 sm:z-20 sm:transition-opacity ${
            payAnim ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {payMounted && payDetails && (
        <div
          className={`fixed top-16 left-0 right-0 bottom-0 z-[45] sm:absolute sm:top-0 sm:bottom-0 sm:left-1/2 md:left-96 xl:left-[28rem] sm:right-0 sm:z-30 transform transition-transform duration-300 ease-out ${
            payAnim ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full"
          } ${tc.isDark ? "bg-[#1e2330]" : "bg-white"} shadow-2xl pb-20 sm:pb-0`}
        >
          <Suspense fallback={<div className="p-6 text-sm">Loading…</div>}>
            <PaymentPage
              embedded
              totalUsd={payDetails.totalUsd}
              totalKrw={payDetails.totalKrw}
              checkNumber={payDetails.checkNumber}
              tableLabel={payDetails.tableLabel}
              onClose={() => startTransition(() => setPayOpen(false))}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
