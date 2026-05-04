import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeClasses } from "../theme-context";
import { useState } from "react";
import { floorLabel, tableLabel } from "../../../../i18n/utils";

export const KITCHEN_FLOORS = [
  {
    id: "1F",
    tables: ["T1", "T2", "T3", "T4", "T5"],
  },
  {
    id: "2F",
    tables: [
      "T6", "T7", "T8", "T9", "T10",
      "T11", "T12", "T13", "T14", "T15",
      "T16", "T17", "T18", "T19", "T20",
    ],
  },
  {
    id: "bar",
    tables: ["BAR1", "BAR2", "BAR3"],
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
  const { t } = useTranslation();
  const tc = useThemeClasses();
  const [expandedFloors, setExpandedFloors] = useState<Set<string>>(
    new Set(KITCHEN_FLOORS.map((f) => f.id)),
  );

  const allSelected = ALL_TABLES.every((tb) => selectedTables.has(tb));

  const toggleAll = () => {
    setSelectedTables(allSelected ? new Set() : new Set(ALL_TABLES));
  };

  const toggleFloor = (floorId: string) => {
    const floor = KITCHEN_FLOORS.find((f) => f.id === floorId)!;
    const allFloorSelected = floor.tables.every((tb) => selectedTables.has(tb));
    const next = new Set(selectedTables);
    if (allFloorSelected) {
      floor.tables.forEach((tb) => next.delete(tb));
    } else {
      floor.tables.forEach((tb) => next.add(tb));
    }
    setSelectedTables(next);
  };

  const toggleTable = (tableId: string) => {
    const next = new Set(selectedTables);
    if (next.has(tableId)) next.delete(tableId);
    else next.add(tableId);
    setSelectedTables(next);
  };

  const floorState = (floorId: string) => {
    const floor = KITCHEN_FLOORS.find((f) => f.id === floorId)!;
    const count = floor.tables.filter((tb) => selectedTables.has(tb)).length;
    if (count === 0) return "none";
    if (count === floor.tables.length) return "all";
    return "partial";
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`p-4 border-b ${tc.border}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-[1rem] ${tc.heading}`}>{t("kitchen.filterTitle")}</h3>
          <button
            onClick={toggleAll}
            className={`text-[0.75rem] px-2 py-1 rounded cursor-pointer ${tc.isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
          >
            {allSelected ? t("kitchen.deselectAll") : t("kitchen.selectAll")}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {KITCHEN_FLOORS.map((floor) => {
          const expanded = expandedFloors.has(floor.id);
          const state = floorState(floor.id);
          const floorSelectedCount = floor.tables.filter((tb) => selectedTables.has(tb)).length;
          return (
            <div key={floor.id} className="mb-1">
              <button
                onClick={() => {
                  const next = new Set(expandedFloors);
                  if (expanded) next.delete(floor.id);
                  else next.add(floor.id);
                  setExpandedFloors(next);
                }}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer ${tc.isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
              >
                {expanded ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                <span className={`flex-1 text-left text-[0.875rem] ${tc.heading}`}>{floorLabel(t, floor.id)}</span>
                <span className={`text-[0.6875rem] ${tc.subtext}`}>
                  {floorSelectedCount}/{floor.tables.length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFloor(floor.id);
                  }}
                  className={`text-[0.625rem] px-1.5 py-0.5 rounded ${
                    state === "all"
                      ? "bg-blue-600 text-white"
                      : state === "partial"
                        ? "bg-blue-600/50 text-white"
                        : tc.isDark
                          ? "bg-slate-700"
                          : "bg-slate-200"
                  }`}
                >
                  {state === "all" ? "✓" : state === "partial" ? "−" : ""}
                </button>
              </button>
              {expanded && (
                <div className="ml-6 mt-1 space-y-0.5">
                  {floor.tables.map((tableId) => {
                    const sel = selectedTables.has(tableId);
                    return (
                      <button
                        key={tableId}
                        onClick={() => toggleTable(tableId)}
                        className={`w-full text-left px-2 py-1.5 rounded text-[0.8125rem] cursor-pointer ${
                          sel
                            ? "bg-blue-600 text-white"
                            : tc.isDark
                              ? "hover:bg-slate-800 text-slate-300"
                              : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        {tableLabel(t, tableId)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TableFilterSidebar({ selectedTables, setSelectedTables, open, onClose }: TableFilterSidebarProps) {
  const { t } = useTranslation();
  const tc = useThemeClasses();
  const selectedCount = selectedTables.size;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] shadow-xl flex flex-col ${tc.isDark ? "bg-[#1e2330]" : "bg-white"}`}
      >
        <div className={`flex items-center justify-between p-3 border-b ${tc.border}`}>
          <span className={`text-[0.875rem] ${tc.heading}`}>
            {t("kitchen.tablesSelected", { count: selectedCount })}
          </span>
          <button onClick={onClose} className="p-1 rounded cursor-pointer hover:bg-slate-700/20">
            <X className="w-5 h-5" />
          </button>
        </div>
        <FilterContent selectedTables={selectedTables} setSelectedTables={setSelectedTables} />
      </div>
    </>
  );
}

export { ALL_TABLES };
