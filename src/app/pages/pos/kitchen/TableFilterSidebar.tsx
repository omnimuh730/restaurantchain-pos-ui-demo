import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useThemeClasses } from "../theme-context";
import { useState } from "react";

// Kitchen tables mapped to floors
export const KITCHEN_FLOORS = [
  {
    id: "1F",
    label: "1st Floor",
    tables: ["Table 1", "Table 2", "Table 3", "Table 4", "Table 5"],
  },
  {
    id: "2F",
    label: "2nd Floor",
    tables: [
      "Table 6", "Table 7", "Table 8", "Table 9", "Table 10",
      "Table 11", "Table 12", "Table 13", "Table 14", "Table 15",
      "Table 16", "Table 17", "Table 18", "Table 19", "Table 20",
    ],
  },
  {
    id: "bar",
    label: "Bar",
    tables: ["Bar 1", "Bar 2", "Bar 3"],
  },
];

const ALL_TABLES = KITCHEN_FLOORS.flatMap((f) => f.tables);

interface TableFilterSidebarProps {
  selectedTables: Set<string>;
  setSelectedTables: (tables: Set<string>) => void;
  open: boolean;
  onClose: () => void;
}

function FilterContent({ selectedTables, setSelectedTables }: Pick<TableFilterSidebarProps, "selectedTables" | "setSelectedTables">) {
  const tc = useThemeClasses();
  const [expandedFloors, setExpandedFloors] = useState<Set<string>>(
    new Set(KITCHEN_FLOORS.map((f) => f.id))
  );

  const allSelected = ALL_TABLES.every((t) => selectedTables.has(t));

  const toggleAll = () => {
    setSelectedTables(allSelected ? new Set() : new Set(ALL_TABLES));
  };

  const toggleFloor = (floorId: string) => {
    const floor = KITCHEN_FLOORS.find((f) => f.id === floorId)!;
    const allFloorSelected = floor.tables.every((t) => selectedTables.has(t));
    const next = new Set(selectedTables);
    if (allFloorSelected) {
      floor.tables.forEach((t) => next.delete(t));
    } else {
      floor.tables.forEach((t) => next.add(t));
    }
    setSelectedTables(next);
  };

  const toggleTable = (table: string) => {
    const next = new Set(selectedTables);
    if (next.has(table)) next.delete(table);
    else next.add(table);
    setSelectedTables(next);
  };

  const toggleExpand = (floorId: string) => {
    const next = new Set(expandedFloors);
    if (next.has(floorId)) next.delete(floorId);
    else next.add(floorId);
    setExpandedFloors(next);
  };

  const floorState = (floorId: string) => {
    const floor = KITCHEN_FLOORS.find((f) => f.id === floorId)!;
    const count = floor.tables.filter((t) => selectedTables.has(t)).length;
    if (count === 0) return "none";
    if (count === floor.tables.length) return "all";
    return "partial";
  };

  const selectedCount = selectedTables.size;

  return (
    <>
      {/* All Floors toggle */}
      <button
        onClick={toggleAll}
        className={`w-full text-left px-4 py-3 text-[0.8125rem] cursor-pointer transition-colors border-b ${tc.border} flex items-center justify-between ${
          allSelected
            ? "bg-blue-600 text-white"
            : `${tc.text1} ${tc.hover}`
        }`}
      >
        <span>All Floors</span>
        <span className={`text-[0.6875rem] ${allSelected ? "text-blue-100" : tc.muted}`}>
          {selectedCount}/{ALL_TABLES.length}
        </span>
      </button>

      {/* Floor groups */}
      <div className="flex-1 overflow-y-auto">
        {KITCHEN_FLOORS.map((floor) => {
          const state = floorState(floor.id);
          const expanded = expandedFloors.has(floor.id);
          const floorSelectedCount = floor.tables.filter((t) => selectedTables.has(t)).length;
          return (
            <div key={floor.id} className={`border-b ${tc.borderHalf}`}>
              {/* Floor header */}
              <div className="flex items-center">
                <button
                  onClick={() => toggleExpand(floor.id)}
                  className={`px-2 py-2.5 ${tc.subtext} cursor-pointer`}
                >
                  {expanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => toggleFloor(floor.id)}
                  className={`flex-1 text-left py-2.5 pr-4 text-[0.8125rem] cursor-pointer transition-colors ${
                    state === "all"
                      ? tc.isDark ? "text-blue-400" : "text-blue-600"
                      : state === "partial"
                      ? tc.isDark ? "text-blue-400/70" : "text-blue-500/70"
                      : tc.text1
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded flex items-center justify-center border ${
                          state === "all"
                            ? "bg-blue-500 border-blue-500"
                            : state === "partial"
                            ? "bg-blue-500/30 border-blue-500"
                            : tc.isDark ? "border-slate-500" : "border-slate-400"
                        }`}
                      >
                        {state === "all" && (
                          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {state === "partial" && (
                          <span className="w-1.5 h-0.5 bg-blue-500 rounded" />
                        )}
                      </span>
                      {floor.label}
                    </span>
                    <span className={`text-[0.6875rem] ${tc.muted}`}>
                      {floorSelectedCount}/{floor.tables.length}
                    </span>
                  </span>
                </button>
              </div>

              {/* Tables */}
              {expanded && (
                <div className="flex flex-col pb-1">
                  {floor.tables.map((table) => {
                    const active = selectedTables.has(table);
                    return (
                      <button
                        key={table}
                        onClick={() => toggleTable(table)}
                        className={`w-full text-left pl-10 pr-4 py-2 text-[0.8125rem] cursor-pointer transition-colors ${
                          active
                            ? tc.isDark
                              ? "text-blue-300 bg-blue-600/15"
                              : "text-blue-700 bg-blue-50"
                            : `${tc.muted} ${tc.hover}`
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full border-2 ${
                              active
                                ? "bg-blue-500 border-blue-500"
                                : tc.isDark ? "border-slate-500" : "border-slate-400"
                            }`}
                          />
                          {table}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export function TableFilterSidebar({ selectedTables, setSelectedTables, open, onClose }: TableFilterSidebarProps) {
  const tc = useThemeClasses();

  return (
    <>
      {/* Desktop: static sidebar */}
      <div
        className={`hidden md:flex w-52 shrink-0 border-r ${tc.border} ${tc.raised} flex-col overflow-hidden`}
      >
        <div className={`px-4 py-3 border-b ${tc.border}`}>
          <span className={`text-[0.8125rem] ${tc.heading}`}>My Tables</span>
        </div>
        <FilterContent selectedTables={selectedTables} setSelectedTables={setSelectedTables} />
      </div>

      {/* Mobile: drawer overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          {/* Drawer */}
          <div
            className={`relative w-72 max-w-[80vw] ${tc.raised} flex flex-col h-full shadow-xl animate-slide-in-left`}
          >
            <div className={`px-4 py-3 border-b ${tc.border} flex items-center justify-between`}>
              <span className={`text-[0.8125rem] ${tc.heading}`}>My Tables</span>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg cursor-pointer ${tc.hover} ${tc.subtext}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <FilterContent selectedTables={selectedTables} setSelectedTables={setSelectedTables} />
          </div>
        </div>
      )}
    </>
  );
}
