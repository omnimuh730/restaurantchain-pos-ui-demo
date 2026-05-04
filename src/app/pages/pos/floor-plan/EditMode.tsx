import React, { useState, useEffect } from "react";
import { Plus, Minus, X, Undo2, Redo2 } from "lucide-react";
import { useColors } from "./useColors";
import { SizeMatrixPicker } from "./SizeMatrixPicker";
import { FloorCanvas } from "./FloorCanvas";
import type { Table, Floor } from "./types";
import { BASE_W, BASE_H } from "./types";

interface EditModeProps {
  activeFloor: Floor;
  tables: Table[];
  selectedTable: string | null;
  setSelectedTable: (id: string | null) => void;
  showSeats: boolean;
  setShowSeats: (v: boolean) => void;
  editingFloorName: boolean;
  setEditingFloorName: (v: boolean) => void;
  updateFloorName: (name: string) => void;
  setEditMode: (v: boolean) => void;
  undo: () => void;
  redo: () => void;
  historyIdx: number;
  historyLength: number;
  addTable: () => void;
  deleteTable: (id: string) => void;
  duplicateTable: (id: string) => void;
  updateSelectedProp: <K extends keyof Table>(key: K, val: Table[K]) => void;
  updateTables: (tables: Table[], skipHistory?: boolean) => void;
  handleMouseDown: (e: React.MouseEvent, tableId: string) => void;
  guides: { x: number | null; y: number | null };
  zoom: number;
  setZoom: (fn: (prev: number) => number) => void;
  isMobile: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function EditMode(props: EditModeProps) {
  const {
    activeFloor, tables, selectedTable, setSelectedTable, showSeats, setShowSeats,
    editingFloorName, setEditingFloorName, updateFloorName, setEditMode,
    undo, redo, historyIdx, historyLength,
    addTable, deleteTable, duplicateTable, updateSelectedProp, updateTables,
    handleMouseDown, guides, zoom, setZoom, isMobile, scrollRef,
  } = props;
  const C = useColors();
  const sel = selectedTable ? tables.find((t) => t.id === selectedTable) : null;
  const getSizeCols = (t: Table) => Math.round(t.width / BASE_W) || 1;
  const getSizeRows = (t: Table) => Math.round(t.height / BASE_H) || 1;

  const [mobileEditDrawerOpen, setMobileEditDrawerOpen] = useState(false);

  useEffect(() => {
    if (isMobile && selectedTable) setMobileEditDrawerOpen(true);
  }, [isMobile, selectedTable]);

  const renderEditSidebar = () => (
    <div className="w-56 flex-shrink-0 flex flex-col border-r overflow-y-auto" style={{ borderColor: C.editBorder, background: C.editCanvas }}>
      <button onClick={addTable} className="m-4 p-4 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors" style={{ borderColor: C.editBorder, color: C.editText2 }}>
        <Plus size={24} />
      </button>
      {sel && (
        <div className="px-4 pb-4 space-y-5">
          <input value={sel.label} onChange={(e) => updateSelectedProp("label", e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-blue-400" style={{ borderColor: C.editBorder, color: C.editText1, background: C.editCanvas }} />
          <div>
            <div className="text-xs mb-2" style={{ color: C.editText2 }}>Seats</div>
            <div className="flex items-center gap-3 justify-center">
              <button onClick={() => updateSelectedProp("seats", Math.max(1, sel.seats - 1))} className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer" style={{ borderColor: C.editBorder, color: C.editText2 }}><Minus size={14} /></button>
              <span className="text-2xl font-bold" style={{ color: C.editText1 }}>{sel.seats}</span>
              <button onClick={() => updateSelectedProp("seats", sel.seats + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer" style={{ borderColor: C.editBorder, color: C.editText2 }}><Plus size={14} /></button>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xs mb-2" style={{ color: C.editText2 }}>Shape</div>
            <div className="flex gap-3 justify-center">
              {(["rect", "circle"] as const).map((s) => (
                <button key={s} onClick={() => updateSelectedProp("shape", s)} className="w-10 h-10 rounded-lg border-2 flex items-center justify-center cursor-pointer" style={{ borderColor: sel.shape === s ? C.editSelected : C.editBorder, background: sel.shape === s ? "rgba(75,131,255,0.08)" : "transparent" }}>
                  <div style={{ width: 22, height: s === "rect" ? 16 : 22, borderRadius: s === "circle" ? "50%" : 3, background: sel.shape === s ? C.editSelected : C.editTableDefault }} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xs mb-2" style={{ color: C.editText2 }}>Size</div>
            <SizeMatrixPicker cols={getSizeCols(sel)} rows={getSizeRows(sel)} onChange={(c, r) => updateTables(tables.map((t) => t.id === selectedTable ? { ...t, width: c * BASE_W, height: r * BASE_H } : t))} />
          </div>
          <div className="flex gap-2 pt-2 border-t" style={{ borderColor: C.editBorder }}>
            <button onClick={() => duplicateTable(sel.id)} className="flex-1 py-2 text-sm rounded-lg border cursor-pointer hover:opacity-80" style={{ borderColor: C.editBorder, color: C.editText1, background: C.editCanvas }}>Copy</button>
            <button onClick={() => deleteTable(sel.id)} className="flex-1 py-2 text-sm rounded-lg cursor-pointer" style={{ color: "#EF4444", background: "rgba(239,68,68,0.06)" }}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );

  const renderMobileEditDrawer = () => {
    const isOpen = mobileEditDrawerOpen;
    return (
      <div
        className="absolute left-0 right-0 bottom-0 z-30 rounded-t-2xl transition-transform duration-300 ease-out"
        style={{ background: C.editCanvas, boxShadow: "0 -4px 24px rgba(0,0,0,0.12)", transform: isOpen ? "translateY(0)" : "translateY(100%)", maxHeight: "55vh" }}
      >
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 rounded-full cursor-pointer" style={{ background: C.editText3 }} onClick={() => setMobileEditDrawerOpen(!mobileEditDrawerOpen)} />
        </div>
        <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: "calc(55vh - 24px)" }}>
          <button onClick={addTable} className="w-full py-3 mb-3 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer hover:border-blue-400 transition-colors text-sm" style={{ borderColor: C.editBorder, color: C.editText2 }}>
            <Plus size={18} /> Add Table
          </button>
          {sel ? (
            <div className="space-y-4">
              <input value={sel.label} onChange={(e) => updateSelectedProp("label", e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-blue-400" style={{ borderColor: C.editBorder, color: C.editText1, background: C.editCanvas }} />
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <div className="text-xs mb-1.5" style={{ color: C.editText2 }}>Seats</div>
                  <div className="flex items-center gap-2 justify-center">
                    <button onClick={() => updateSelectedProp("seats", Math.max(1, sel.seats - 1))} className="w-7 h-7 rounded-full border flex items-center justify-center cursor-pointer" style={{ borderColor: C.editBorder, color: C.editText2 }}><Minus size={12} /></button>
                    <span className="text-lg font-bold" style={{ color: C.editText1 }}>{sel.seats}</span>
                    <button onClick={() => updateSelectedProp("seats", sel.seats + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center cursor-pointer" style={{ borderColor: C.editBorder, color: C.editText2 }}><Plus size={12} /></button>
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1.5" style={{ color: C.editText2 }}>Shape</div>
                  <div className="flex gap-2">
                    {(["rect", "circle"] as const).map((s) => (
                      <button key={s} onClick={() => updateSelectedProp("shape", s)} className="w-9 h-9 rounded-lg border-2 flex items-center justify-center cursor-pointer" style={{ borderColor: sel.shape === s ? C.editSelected : C.editBorder, background: sel.shape === s ? "rgba(75,131,255,0.08)" : "transparent" }}>
                        <div style={{ width: 18, height: s === "rect" ? 13 : 18, borderRadius: s === "circle" ? "50%" : 3, background: sel.shape === s ? C.editSelected : C.editTableDefault }} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1.5" style={{ color: C.editText2 }}>Size</div>
                  <SizeMatrixPicker cols={getSizeCols(sel)} rows={getSizeRows(sel)} onChange={(c, r) => updateTables(tables.map((t) => t.id === selectedTable ? { ...t, width: c * BASE_W, height: r * BASE_H } : t))} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => duplicateTable(sel.id)} className="flex-1 py-2 text-sm rounded-lg border cursor-pointer" style={{ borderColor: C.editBorder, color: C.editText1 }}>Copy</button>
                <button onClick={() => { deleteTable(sel.id); setMobileEditDrawerOpen(false); }} className="flex-1 py-2 text-sm rounded-lg cursor-pointer" style={{ color: "#EF4444", background: "rgba(239,68,68,0.06)" }}>Delete</button>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-sm" style={{ color: C.editText3 }}>
              Tap a table to edit its properties
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col" style={{ background: C.editBg }}>
      <div className="h-14 flex items-center justify-between px-4 md:px-6 border-b" style={{ borderColor: C.editBorder, background: C.editCanvas }}>
        <div className="flex items-center gap-3 md:gap-4">
          <button onClick={() => { setEditMode(false); setSelectedTable(null); }} className="cursor-pointer" style={{ color: C.editText1 }}><X size={18} /></button>
          {editingFloorName ? (
            <input autoFocus value={activeFloor.name} onChange={(e) => updateFloorName(e.target.value)} onBlur={() => setEditingFloorName(false)} onKeyDown={(e) => e.key === "Enter" && setEditingFloorName(false)} className="font-bold text-sm px-2 py-1 border rounded outline-none focus:border-blue-400" style={{ color: C.editText1, borderColor: C.editBorder, background: C.editCanvas }} />
          ) : (
            <span className="font-bold text-sm cursor-pointer hover:underline" style={{ color: C.editText1 }} onClick={() => setEditingFloorName(true)} title="Click to rename">{activeFloor.name}</span>
          )}
          <span style={{ color: C.editText3 }}>|</span>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none" style={{ color: C.editText2 }}>
            <span className="hidden sm:inline">Show seats</span>
            <div onClick={() => setShowSeats(!showSeats)} className="relative w-10 h-5 rounded-full transition-colors" style={{ background: showSeats ? C.editSelected : C.editText3 }}>
              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform" style={{ left: showSeats ? 22 : 2 }} />
            </div>
          </label>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button onClick={undo} className="flex items-center gap-1 text-sm cursor-pointer" style={{ color: historyIdx > 0 ? C.editText1 : C.editText3 }}><Undo2 size={14} /> <span className="hidden sm:inline">Undo</span></button>
          <button onClick={redo} className="flex items-center gap-1 text-sm cursor-pointer" style={{ color: historyIdx < historyLength - 1 ? C.editText1 : C.editText3 }}><Redo2 size={14} /> <span className="hidden sm:inline">Redo</span></button>
          <button onClick={() => { setEditMode(false); setSelectedTable(null); }} className="px-4 md:px-5 py-1.5 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: C.editSelected, color: "#fff" }}>Save</button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden relative">
        {!isMobile && renderEditSidebar()}
        <div className="flex-1 overflow-hidden">
          <FloorCanvas
            tables={tables} editMode={true} selectedTable={selectedTable} setSelectedTable={setSelectedTable}
            showSeats={showSeats} zoom={zoom} setZoom={setZoom} onMouseDown={handleMouseDown}
            guides={guides} addTable={addTable} isMobile={isMobile} setMobileEditDrawerOpen={setMobileEditDrawerOpen}
            scrollRef={scrollRef}
          />
        </div>
        {isMobile && renderMobileEditDrawer()}
      </div>
    </div>
  );
}
