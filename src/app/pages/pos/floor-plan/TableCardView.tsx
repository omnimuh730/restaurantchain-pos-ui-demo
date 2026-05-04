import { useColors, useIsMobile } from "./useColors";
import { FloorTabsRow } from "./FloorTabsRow";
import type { Floor, Table } from "./types";

interface TableCardViewProps {
  floors: Floor[];
  activeFloorId: string;
  setActiveFloorId: (id: string) => void;
  tables: Table[];
  addFloor: () => void;
  setEditMode: (v: boolean) => void;
  renameFloorById: (id: string, name: string) => void;
  showSeats: boolean;
  setShowSeats: (v: boolean) => void;
  setSelectedTable: (id: string) => void;
}

export function TableCardView(props: TableCardViewProps) {
  const {
    floors, activeFloorId, setActiveFloorId, tables,
    addFloor, setEditMode, renameFloorById, showSeats, setShowSeats,
    setSelectedTable,
  } = props;
  const C = useColors();
  const isMobile = useIsMobile();

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: C.bg }}>
      <FloorTabsRow floors={floors} activeFloorId={activeFloorId} setActiveFloorId={setActiveFloorId} addFloor={addFloor} setEditMode={setEditMode} onRenameFloor={renameFloorById} showSeats={showSeats} setShowSeats={setShowSeats} />
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {tables.map((t) => {
            const isOcc = t.status === "occupied";
            const isRes = t.status === "reserved";
            return (
              <div
                key={t.id}
                className="rounded-lg p-3 md:p-3.5 flex flex-col cursor-pointer transition-all hover:brightness-110"
                style={{
                  background: isOcc ? C.editSelected : C.editTableDefault,
                  border: isOcc ? "2px solid #3370E8" : `1px solid ${isRes ? C.reserved.border : C.border}`,
                  minHeight: isMobile ? 110 : 140,
                  boxShadow: isOcc ? "0 4px 20px rgba(75,131,255,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
                }}
                onClick={() => setSelectedTable(t.id)}
              >
                <div className="flex items-center gap-1.5" style={{ color: isOcc ? "#fff" : C.editText1 }}>
                  <span className="font-normal text-[14px] md:text-base">{t.label}</span>
                </div>
                <div className="mt-1 text-xs md:text-sm" style={{ color: isOcc ? "rgba(255,255,255,0.85)" : C.editText2 }}>
                  {isOcc ? `${t.occupiedSeats ?? t.seats}/${t.seats} seats` : `${t.seats} seats`}
                </div>
                <div className="flex-1" />
                {isRes && (
                  <div className="text-xs md:text-sm mt-1" style={{ color: C.editText2 }}>Reserved · {t.reservationTime}</div>
                )}
                {isOcc && t.revenue && (
                  <div className="text-right mt-2 text-[13px] md:text-sm" style={{ color: "#fff" }}>
                    {t.revenue.toLocaleString()} {"\u20A9"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
