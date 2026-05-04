import { useState } from "react";
import { useColors } from "./useColors";

export function SizeMatrixPicker({ cols, rows, onChange }: { cols: number; rows: number; onChange: (c: number, r: number) => void }) {
  const C = useColors();
  const [hover, setHover] = useState<{ c: number; r: number } | null>(null);
  const display = hover || { c: cols, r: rows };
  return (
    <div className="inline-grid grid-cols-3 gap-1" onMouseLeave={() => setHover(null)}>
      {[1, 2, 3].map((r) =>
        [1, 2, 3].map((c) => {
          const active = c <= display.c && r <= display.r;
          return (
            <div
              key={`${r}-${c}`}
              className="w-7 h-7 rounded cursor-pointer transition-colors"
              style={{ background: active ? C.editSelected : C.editTableDefault, border: `1.5px solid ${active ? "#3370E8" : C.editBorder}` }}
              onMouseEnter={() => setHover({ c, r })}
              onClick={() => onChange(c, r)}
            />
          );
        })
      )}
    </div>
  );
}
