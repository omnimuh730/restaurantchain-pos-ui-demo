/**
 * POS chrome: top header and bottom tab bar use z-50 (see POSLayout).
 * On phone, sheets and dimmers use z-40 / z-[45] so they render *behind* that chrome;
 * panels slide up from the bottom (or in from the side) with translate + transition.
 */
export const POS_OVERLAY_BACKDROP =
  "fixed inset-0 z-40 transition-opacity duration-300 ease-out";

export const POS_OVERLAY_SHEET_BOTTOM =
  "fixed left-0 right-0 bottom-0 z-[45] transition-transform duration-300 ease-out";

export const POS_OVERLAY_SHEET_RIGHT =
  "fixed top-16 right-0 bottom-0 z-[45] transition-transform duration-300 ease-out";

export const POS_OVERLAY_SHEET_LEFT =
  "fixed top-16 left-0 bottom-0 z-[45] transition-transform duration-300 ease-out";
