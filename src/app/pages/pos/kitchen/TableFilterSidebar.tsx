import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeClasses } from "../theme-context";
import { useState } from "react";

export const KITCHEN_FLOORS = [
  {
    id: "1F",
    labelKey: "tables.floor_1f",
    tables: ["T1", "T2", "T3", "T4", "T5"],
  },
  {
    id: "2F",
    labelKey: "tables.floor_2f",
    tables: [
      "T6", "T7", "T8", "T9", "T10",
      "T11", "T12", "T13", "T14", "T15",
      "T16", "T17", "T18", "T19", "T20",
    ],
  },
  {
    id: "bar",
    labelKey: "tables.floor_bar",
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
  const tc = useThemeClasses();
  const { t } = useTranslation("kitchen");
  const { t: tOrders } = useTranslation("orders");
  const [expandedFloors, setExpandedFloors] = useState<Set<string>>(
    new Set(KITCHEN_FLOORS.map((f) => f.id)),
  );

  const tableLabel = (tableId: string) => {
    const tm = /^T(\d+)$/.exec(tableId);
    if (tm) return tOrders("ui.tableNumbered", { n: Number(tm[1]) });
    const bm = /^BAR(\d+)$/.exec(tableId);
    if (bm) return tOrders("ui.barNumbered", { n: Number(bm[1]) });
    return tableId;
  };

  const allSelected = ALL_TABLES.every((tid) => selectedTables.has(tid));

  const toggleAll = () => {
    setSelectedTables(allSelected ? new Set() : new Set(ALL_TABLES));
  };

  const toggleFloor = (floorId: string) => {
    const floor = KITCHEN_FLOORS.find((f) => f.id === floorId)!;
    const allFloorSelected = floor.tables.every((tid) => selectedTables.has(tid));
    const next = new Set(selectedTables);
    if (allFloorSelected) {
      floor.tables.forEach((tid) => next.delete(tid));
    } else {
      floor.tables.forEach((tid) => next.add(tid));
    }
    setSelectedTables(next);
  };

  const toggleTable = (tableId: string) => {
    const next = new Set(selectedTables);
    if (next.has(tableId)) next.delete(tableId);
    else next.add(tableId);
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
    const count = floor.tables.filter((tid) => selectedTables.has(tid)).length;
    if (count === 0) return "none";
    if (count === floor.tables.length) return "all";
    return "partial";
  };

  const selectedCount = selectedTables.size;

  return (
    <>
      <button
        onClick={toggleAll}
        className={`w-full text-left px-4 py-3 text-[0.8125rem] cursor-pointer transition-colors border-b ${tc.border} flex items-center justify-between ${
          allSelected ? "bg-blue-600 text-white" : `${tc.text1} ${tc.hover}`
        }`}
      >
        <span>{t("tables.all_floors")}</span>
        <span className={`text-[0.6875rem] ${allSelected ? "text-blue-100" : tc.muted}`}>
          {selectedCount}/{ALL_TABLES.length}
        </span>
      </button>

      <div className="flex-1 overflow-y-auto">
        {KITCHEN_FLOORS.map((floor) => {
          const state = floorState(floor.id);
          const expanded = expandedFloors.has(floor.id);
          const floorSelectedCount = floor.tables.filter((tid) => selectedTables.has(tid)).length;
          return (
            <div key={floor.id} className={`border-b ${tc.borderHalf}`}>
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
                      ? tc.isDark
                        ? "text-blue-400"
                        : "text-blue-600"
                      : state === "partial"
                        ? tc.isDark
                          ? "text-blue-400/70"
                          : "text-blue-500/70"
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
                              : tc.isDark
                                ? "border-slate-500"
                                : "border-slate-400"
                        }`}
                      >
                        {state === "all" && (
                          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {state === "partial" && <span className="w-1.5 h-0.5 bg-blue-500 rounded" />}
                      </span>
                      {t(floor.labelKey)}
                    </span>
                    <span className={`text-[0.6875rem] ${tc.muted}`}>
                      {floorSelectedCount}/{floor.tables.length}
                    </span>
                  </span>
                </button>
              </div>

              {expanded && (
                <div className="flex flex-col pb-1">
                  {floor.tables.map((tableId) => {
                    const active = selectedTables.has(tableId);
                    return (
                      <button
                        key={tableId}
                        onClick={() => toggleTable(tableId)}
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
                              active ? "bg-blue-500 border-blue-500" : tc.isDark ? "border-slate-500" : "border-slate-400"
                            }`}
                          />
                          {tableLabel(tableId)}
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
  const { t } = useTranslation("kitchen");

  return (
    <>
      <div className={`hidden md:flex w-52 shrink-0 border-r ${tc.border} ${tc.raised} flex-col overflow-hidden`}>
        <div className={`px-4 py-3 border-b ${tc.border}`}>
          <span className={`text-[0.8125rem] ${tc.heading}`}>{t("tables.my_tables")}</span>
        </div>
        <FilterContent selectedTables={selectedTables} setSelectedTables={setSelectedTables} />
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className={`relative w-72 max-w-[80vw] ${tc.raised} flex flex-col h-full shadow-xl animate-slide-in-left`}>
            <div className={`px-4 py-3 border-b ${tc.border} flex items-center justify-between`}>
              <span className={`text-[0.8125rem] ${tc.heading}`}>{t("tables.my_tables")}</span>
              <button onClick={onClose} className={`p-1.5 rounded-lg cursor-pointer ${tc.hover} ${tc.subtext}`}>
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
