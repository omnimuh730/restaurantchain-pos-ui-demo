import { useState, useMemo, useEffect } from "react";
import { UtensilsCrossed, Plus, X, Search, AlertTriangle, Check, Eye, EyeOff, Trash2 } from "lucide-react";
import { useThemeClasses } from "../theme-context";
import { InlineModal } from "./ui-helpers";
import { INITIAL_MENU_CATEGORIES } from "./data";
import type { MenuCategory, MenuItem } from "./types";

type CatalogItem = { id: string; name: string; price: number };

const FOOD_CATALOG: CatalogItem[] = [
 { id: "wagyu-burger", name: "Wagyu Burger", price: 32 },
 { id: "grilled-salmon", name: "Grilled Salmon", price: 28 },
 { id: "ribeye-steak", name: "Ribeye Steak", price: 45 },
 { id: "truffle-fries", name: "Truffle Fries", price: 12 },
 { id: "caesar-salad", name: "Caesar Salad", price: 14 },
 { id: "garlic-bread", name: "Garlic Bread", price: 7 },
 { id: "sparkling-water", name: "Sparkling Water", price: 4 },
 { id: "fresh-juice", name: "Fresh Juice", price: 7 },
 { id: "craft-beer", name: "Craft Beer", price: 10 },
 { id: "tiramisu", name: "Tiramisu", price: 13 },
 { id: "margherita-pizza", name: "Margherita Pizza", price: 18 },
 { id: "spaghetti-carbonara", name: "Spaghetti Carbonara", price: 22 },
 { id: "lobster-roll", name: "Lobster Roll", price: 34 },
 { id: "chicken-tikka", name: "Chicken Tikka", price: 19 },
 { id: "pad-thai", name: "Pad Thai", price: 17 },
 { id: "miso-soup", name: "Miso Soup", price: 6 },
 { id: "edamame", name: "Edamame", price: 8 },
 { id: "california-roll", name: "California Roll", price: 14 },
 { id: "espresso", name: "Espresso", price: 4 },
 { id: "cappuccino", name: "Cappuccino", price: 5 },
 { id: "iced-latte", name: "Iced Latte", price: 6 },
 { id: "red-wine-glass", name: "Red Wine (Glass)", price: 12 },
 { id: "white-wine-glass", name: "White Wine (Glass)", price: 11 },
 { id: "cheesecake", name: "Cheesecake", price: 11 },
 { id: "chocolate-lava", name: "Chocolate Lava Cake", price: 12 },
 { id: "fruit-platter", name: "Fruit Platter", price: 10 },
];

export function MenuManagement() {
 const tc = useThemeClasses();
 const [categories, setCategories] = useState<MenuCategory[]>(INITIAL_MENU_CATEGORIES);
 const [selectedCat, setSelectedCat] = useState<string>(categories[0]?.id || "");
 const [selectedSub, setSelectedSub] = useState<string | null>(null);
 const [search, setSearch] = useState("");

 const [showAddItem, setShowAddItem] = useState(false);
 const [addItemSearch, setAddItemSearch] = useState("");
 const [addItemSelection, setAddItemSelection] = useState<Set<string>>(new Set());

 const [editItem, setEditItem] = useState<MenuItem | null>(null);
 const [formName, setFormName] = useState("");
 const [formPrice, setFormPrice] = useState("");

 type Currency = "foreign" | "domestic";
 // Per-edit-session currency mode (default foreign)
 const [editCurrency, setEditCurrency] = useState<Currency>("foreign");

 const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

 const currentCat = categories.find((c) => c.id === selectedCat);
 const currentSub = selectedSub ? currentCat?.subCategories.find((s) => s.id === selectedSub) : null;
 const displayItems = currentSub
 ? currentSub.items
 : currentCat?.subCategories.flatMap((s) => s.items) || [];
 const filteredItems = displayItems.filter((item) =>
 item.name.toLowerCase().includes(search.toLowerCase())
 );
 const totalItems = categories.reduce((sum, c) => sum + c.subCategories.reduce((s2, sc) => s2 + sc.items.length, 0), 0);

 const existingSubIds = useMemo(
 () => new Set((currentSub?.items ?? []).map((it) => it.id)),
 [currentSub],
 );

 const filteredCatalog = useMemo(
 () => FOOD_CATALOG.filter((f) => f.name.toLowerCase().includes(addItemSearch.toLowerCase())),
 [addItemSearch],
 );

 const resetForm = () => { setFormName(""); setFormPrice(""); };

 const openAddItem = () => {
 setAddItemSearch("");
 setAddItemSelection(new Set());
 setShowAddItem(true);
 };

 const toggleCatalogItem = (id: string) => {
 setAddItemSelection((prev) => {
 const next = new Set(prev);
 if (next.has(id)) next.delete(id); else next.add(id);
 return next;
 });
 };

 const confirmAddItems = () => {
 if (!selectedCat || !selectedSub || addItemSelection.size === 0) { setShowAddItem(false); return; }
 const toAdd = FOOD_CATALOG.filter((f) => addItemSelection.has(f.id) && !existingSubIds.has(f.id));
 if (toAdd.length === 0) { setShowAddItem(false); return; }
 setCategories((prev) => prev.map((c) =>
 c.id === selectedCat
 ? { ...c, subCategories: c.subCategories.map((s) => s.id === selectedSub
 ? { ...s, items: [...s.items, ...toAdd.map((f) => ({ id: f.id, name: f.name, price: f.price, color: "bg-blue-600" }))] }
 : s) }
 : c
 ));
 setShowAddItem(false);
 setAddItemSelection(new Set());
 };

 const updateItem = () => {
 if (!editItem || !formName.trim()) return;
 const price = parseFloat(formPrice) || 0;
 setCategories((prev) => prev.map((c) => ({
 ...c, subCategories: c.subCategories.map((s) => ({
 ...s, items: s.items.map((item) => item.id === editItem.id ? { ...item, name: formName, price, currency: editCurrency } : item),
 })),
 })));
 setEditItem(null); resetForm();
 };

 const confirmDelete = () => {
 if (!deleteConfirm) return;
 const { id } = deleteConfirm;
 setCategories((prev) => prev.map((c) => ({ ...c, subCategories: c.subCategories.map((s) => ({ ...s, items: s.items.filter((item) => item.id !== id) })) })));
 if (editItem?.id === id) {
 setEditItem(null);
 resetForm();
 }
 setDeleteConfirm(null);
 };

 const toggleItemActive = (id: string) => {
 setCategories((prev) => prev.map((c) => ({
 ...c, subCategories: c.subCategories.map((s) => ({
 ...s, items: s.items.map((item) => item.id === id ? { ...item, active: item.active === false ? true : false } : item),
 })),
 })));
 };

 const openEditItem = (item: MenuItem) => {
 setFormName(item.name);
 const cur: Currency = item.currency ?? "foreign";
 setEditCurrency(cur);
 setFormPrice(cur === "domestic" ? Math.round(item.price).toString() : item.price.toFixed(2));
 setEditItem(item);
 };

 const catBtnCls = (selected: boolean) =>
 `w-full h-12 rounded-lg transition-all text-[0.8125rem] flex items-end justify-start px-2.5 pb-1.5 cursor-pointer border-2 ${
 selected
 ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-400 shadow-lg"
 : tc.isDark
 ? "bg-slate-700/80 hover:bg-slate-600 text-slate-200 border-transparent"
 : "bg-slate-200 hover:bg-slate-300 text-slate-700 border-transparent"
 }`;

 const subCatBtnCls = (selected: boolean) =>
 `w-full h-12 rounded-lg transition-all text-[0.8125rem] flex items-end justify-start px-2.5 pb-1.5 cursor-pointer border-2 ${
 selected
 ? "bg-blue-500/90 hover:bg-blue-500 text-white border-blue-300"
 : tc.isDark
 ? "bg-slate-700/50 hover:bg-slate-600/70 text-slate-300 border-transparent"
 : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent"
 }`;

 const itemTileCls = `rounded-lg text-[0.8125rem] flex flex-col justify-end px-2.5 pb-2 pt-3 border-2 min-h-[3.5rem] w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
 tc.isDark
 ? "bg-slate-600/70 text-slate-100 border-transparent"
 : "bg-slate-200/80 text-slate-800 border-transparent"
 }`;

 const liveEditItem = useMemo(() => {
 if (!editItem) return null;
 for (const c of categories) {
 for (const s of c.subCategories) {
 const found = s.items.find((i) => i.id === editItem.id);
 if (found) return found;
 }
 }
 return null;
 }, [categories, editItem]);

 useEffect(() => {
 if (editItem && liveEditItem === null) {
 setEditItem(null);
 setFormName("");
 setFormPrice("");
 }
 }, [editItem, liveEditItem]);

 const modalBtnRow = (onCancel: () => void, onConfirm: () => void, label: string, disabled = false) => (
 <div className={`p-5 border-t ${tc.cardBorder} flex justify-end gap-2`}>
 <button onClick={onCancel} className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}>Cancel</button>
 <button onClick={onConfirm} disabled={disabled} className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg text-white transition-colors ${disabled ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}>{label}</button>
 </div>
 );

 return (
 <div className="space-y-4">
 {/* Header */}
 <div className={`${tc.card} rounded-lg p-4 sm:p-5`}>
 <div className="flex items-center justify-between gap-2">
 <div className="min-w-0">
 <h3 className={`text-[0.9375rem] ${tc.heading} flex items-center gap-2`}>
 <UtensilsCrossed className="w-4 h-4 text-blue-400 shrink-0" /> Menu Management
 </h3>
 <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>Select a sub-category and add items from the catalog</p>
 </div>
 <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 text-[0.6875rem] shrink-0">{totalItems} items</span>
 </div>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-3 gap-2">
 {[
 { label: "Categories", value: categories.length },
 { label: "Sub-Categories", value: categories.reduce((s, c) => s + c.subCategories.length, 0) },
 { label: "Total Items", value: totalItems },
 ].map((s) => (
 <div key={s.label} className={`${tc.card} rounded-lg p-3`}>
 <p className={`text-[0.6875rem] ${tc.subtext}`}>{s.label}</p>
 <p className={`text-[1.25rem] ${tc.heading}`}>{s.value}</p>
 </div>
 ))}
 </div>

 {/* Main Categories */}
 <div className={`${tc.card} rounded-lg p-4`}>
 <h4 className={`text-[0.8125rem] ${tc.subtext} mb-3`}>Main Categories</h4>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
 {categories.map((cat) => (
 <button key={cat.id} onClick={() => { setSelectedCat(cat.id); setSelectedSub(null); }} className={catBtnCls(selectedCat === cat.id)}>{cat.label}</button>
 ))}
 </div>
 </div>

 {/* Sub Categories */}
 {currentCat && (
 <div className={`${tc.card} rounded-lg p-4`}>
 <h4 className={`text-[0.8125rem] ${tc.subtext} mb-3`}>{currentCat.label} - Sub-Categories</h4>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
 {currentCat.subCategories.map((sub) => (
 <button key={sub.id} onClick={() => setSelectedSub(selectedSub === sub.id ? null : sub.id)} className={subCatBtnCls(selectedSub === sub.id)}>
 {sub.label}<span className={`ml-auto text-[0.625rem] self-end ${selectedSub === sub.id ? "text-white/60" : tc.isDark ? "text-slate-500" : "text-slate-400"}`}>{sub.items.length}</span>
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Items Grid */}
 <div className={`${tc.card} rounded-lg p-4`}>
 <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between mb-3">
 <h4 className={`text-[0.8125rem] ${tc.subtext}`}>{currentSub ? `${currentSub.label} Items` : currentCat ? `All ${currentCat.label} Items` : "Items"}</h4>
 <div className="flex items-center gap-2">
 <div className="relative flex-1 sm:flex-none">
 <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${tc.muted}`} />
 <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." className={`pl-8 pr-3 py-1.5 rounded-lg border-0 text-[0.75rem] focus:outline-none w-full sm:w-40 ${tc.isDark ? "bg-[#3a3f4d] text-gray-100 placeholder:text-gray-500 gray-600" : "bg-gray-100 text-gray-900 placeholder:text-gray-400 gray-300"}`} />
 </div>
 {selectedSub && (
 <button onClick={openAddItem} className="flex items-center gap-1 px-2.5 py-1 text-[0.6875rem] rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors shrink-0"><Plus className="w-3 h-3" /> Add Item</button>
 )}
 </div>
 </div>
 {!selectedSub && <p className={`text-[0.75rem] ${tc.muted} mb-3`}>Select a sub-category above to add items</p>}
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
 {filteredItems.map((item) => {
 const isInactive = item.active === false;
 return (
 <button
 key={item.id}
 type="button"
 onClick={() => openEditItem(item)}
 className={`relative ${itemTileCls} ${isInactive ? "opacity-50 grayscale" : ""}`}
 >
 <p className="leading-tight">{item.name}</p>
 <p className={`text-[0.75rem] mt-0.5 ${tc.isDark ? "text-slate-400" : "text-slate-500"}`}>{item.currency === "domestic" ? `₩${Math.round(item.price).toLocaleString()}` : `$${item.price.toFixed(2)}`}</p>
 {isInactive && (
 <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-slate-600 text-white text-[0.5625rem]">Inactive</span>
 )}
 </button>
 );
 })}
 </div>
 {filteredItems.length === 0 && (
 <div className={`text-center py-8 ${tc.muted}`}>
 <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-40" />
 <p className="text-[0.8125rem]">{search ? "No items match your search" : "No items in this category"}</p>
 </div>
 )}
 </div>

 {/* Add Item Modal — multi-select catalog */}
 <InlineModal open={showAddItem} onClose={() => setShowAddItem(false)} size="md">
 <div className={`p-5 border-b ${tc.cardBorder}`}>
 <h3 className={`text-[1rem] ${tc.heading}`}>Add items to {currentSub?.label}</h3>
 <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>Select one or more items from the catalog</p>
 </div>
 <div className="p-5 space-y-3">
 <div className="relative">
 <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${tc.muted}`} />
 <input
 autoFocus
 value={addItemSearch}
 onChange={(e) => setAddItemSearch(e.target.value)}
 placeholder="Search food items..."
 className={`${tc.input} pl-10`}
 />
 </div>

 <div className="max-h-[360px] overflow-y-auto pr-1">
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
 {filteredCatalog.map((f) => {
 const already = existingSubIds.has(f.id);
 const selected = addItemSelection.has(f.id);
 return (
 <button
 key={f.id}
 disabled={already}
 onClick={() => !already && toggleCatalogItem(f.id)}
 className={`relative text-left rounded-lg px-3 py-2.5 border-2 transition-all ${
 already
 ? tc.isDark
 ? "bg-slate-800/40 border-transparent opacity-40 cursor-not-allowed"
 : "bg-slate-100 border-transparent opacity-50 cursor-not-allowed"
 : selected
 ? "bg-blue-600/15 border-blue-500 cursor-pointer"
 : tc.isDark
 ? "bg-slate-700/60 border-transparent hover:border-blue-400 cursor-pointer"
 : "bg-slate-100 border-transparent hover:border-blue-400 cursor-pointer"
 }`}
 >
 <div className="flex items-start justify-between gap-2">
 <div className="min-w-0">
 <p className={`text-[0.8125rem] leading-tight ${tc.heading}`}>{f.name}</p>
 <p className={`text-[0.75rem] mt-0.5 ${tc.subtext}`}>${f.price.toFixed(2)}</p>
 </div>
 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
 selected ? "bg-blue-600 border-blue-600" : tc.isDark ? "border-slate-500" : "border-slate-400"
 }`}>
 {selected && <Check className="w-3 h-3 text-white" />}
 </div>
 </div>
 {already && <span className={`mt-1 inline-block text-[0.625rem] ${tc.muted}`}>Already added</span>}
 </button>
 );
 })}
 </div>
 {filteredCatalog.length === 0 && (
 <div className={`text-center py-6 ${tc.muted}`}>
 <p className="text-[0.8125rem]">No items match your search</p>
 </div>
 )}
 </div>

 <p className={`text-[0.75rem] ${tc.muted}`}>
 {addItemSelection.size} selected
 </p>
 </div>
 {modalBtnRow(() => setShowAddItem(false), confirmAddItems, `Add ${addItemSelection.size || ""} item${addItemSelection.size === 1 ? "" : "s"}`.trim(), addItemSelection.size === 0)}
 </InlineModal>

 {/* Edit Item Modal */}
 <InlineModal open={!!editItem} onClose={() => { setEditItem(null); resetForm(); }} size="sm">
 <div className={`p-5 border-b ${tc.cardBorder}`}><h3 className={`text-[1rem] ${tc.heading}`}>Edit Item</h3></div>
 <div className="p-5 space-y-4">
 <div>
 <label className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}>Item Name</label>
 <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Shrimp Tempura" className={tc.input} disabled/>
 </div>
 <div>
 <label className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}>
 Price ({editCurrency === "domestic" ? "₩ Domestic" : "$ Foreign"})
 </label>
 <div className={`grid grid-cols-2 gap-1 p-1 rounded-lg mb-2 ${tc.isDark ? "bg-slate-800/60" : "bg-slate-100"}`}>
 {([
 { id: "foreign", label: "Foreign $", sub: "Externalization" },
 { id: "domestic", label: "Domestic ₩", sub: "Internalization" },
 ] as { id: Currency; label: string; sub: string }[]).map(({ id, label, sub }) => {
 const active = editCurrency === id;
 return (
 <button
 key={id}
 type="button"
 onClick={() => setEditCurrency(id)}
 className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-md text-[0.75rem] cursor-pointer transition-all ${
 active
 ? "bg-blue-600 text-white shadow-sm"
 : tc.isDark ? "text-slate-300 hover:bg-slate-700/50" : "text-slate-600 hover:bg-white"
 }`}
 >
 <span>{label}</span>
 <span className={`text-[0.5625rem] ${active ? "text-white/80" : tc.subtext}`}>{sub}</span>
 </button>
 );
 })}
 </div>
 <div className="relative">
 <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[0.875rem] ${tc.subtext}`}>
 {editCurrency === "domestic" ? "₩" : "$"}
 </span>
 <input
 value={formPrice}
 onChange={(e) => setFormPrice(e.target.value)}
 placeholder={editCurrency === "domestic" ? "0" : "0.00"}
 type="number"
 step={editCurrency === "domestic" ? "100" : "0.01"}
 className={`${tc.input} pl-7`}
 />
 </div>
 </div>
 {liveEditItem && (
 <div className={`pt-4 border-t ${tc.cardBorder} space-y-2`}>
 <button
 type="button"
 onClick={() => editItem && toggleItemActive(editItem.id)}
 className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[0.8125rem] cursor-pointer transition-colors ${tc.btnSecondary}`}
 >
 {liveEditItem.active === false ? (
 <>
 <Eye className="w-4 h-4 shrink-0" />
 Show on menu
 </>
 ) : (
 <>
 <EyeOff className="w-4 h-4 shrink-0" />
 Hide from menu
 </>
 )}
 </button>
 <button
 type="button"
 onClick={() => {
 if (!editItem) return;
 setDeleteConfirm({ id: editItem.id, name: formName.trim() || editItem.name });
 setEditItem(null);
 resetForm();
 }}
 className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[0.8125rem] cursor-pointer transition-colors ${
 tc.isDark ? "bg-red-500/15 text-red-400 hover:bg-red-500/25" : "bg-red-50 text-red-600 hover:bg-red-100"
 }`}
 >
 <Trash2 className="w-4 h-4 shrink-0" />
 Delete item
 </button>
 </div>
 )}
 </div>
 {modalBtnRow(() => { setEditItem(null); resetForm(); }, updateItem, "Save Changes")}
 </InlineModal>

 {/* Delete Confirmation Modal */}
 <InlineModal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} size="sm">
 {deleteConfirm && (
 <>
 <div className={`p-5 border-b ${tc.cardBorder}`}>
 <div className="flex items-center gap-2">
 <AlertTriangle className="w-5 h-5 text-red-400" />
 <h3 className={`text-[1rem] ${tc.heading}`}>Confirm Delete</h3>
 </div>
 </div>
 <div className="p-5">
 <p className={`text-[0.8125rem] ${tc.subtext}`}>
 Are you sure you want to delete <strong className={tc.heading}>{deleteConfirm.name}</strong>?
 </p>
 <p className={`text-[0.75rem] ${tc.muted} mt-2`}>This action cannot be undone.</p>
 </div>
 <div className={`p-5 border-t ${tc.cardBorder} flex justify-end gap-2`}>
 <button onClick={() => setDeleteConfirm(null)} className={`px-3.5 py-1.5 text-[0.75rem] rounded-lg cursor-pointer transition-colors ${tc.btnSecondary}`}>Cancel</button>
 <button onClick={confirmDelete} className="px-3.5 py-1.5 text-[0.75rem] rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors">Delete</button>
 </div>
 </>
 )}
 </InlineModal>
 </div>
 );
}
