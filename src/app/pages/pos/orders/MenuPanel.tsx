import { Search } from "lucide-react";
import { useThemeClasses } from "../theme-context";
import { MAIN_CATEGORIES, SUB_CATEGORIES, MENU_ITEMS } from "./data";

interface MenuPanelProps {
  selectedMainCategory: string;
  setSelectedMainCategory: (id: string) => void;
  selectedSubCategory: string | null;
  setSelectedSubCategory: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  addItemToOrder: (item: { id: string; name: string; price: number; currency?: "foreign" | "domestic" }) => void;
}

export function MenuPanel(props: MenuPanelProps) {
  const {
    selectedMainCategory, setSelectedMainCategory,
    selectedSubCategory, setSelectedSubCategory,
    searchQuery, setSearchQuery, addItemToOrder,
  } = props;
  const tc = useThemeClasses();

  const subCategories = SUB_CATEGORIES[selectedMainCategory] || [];
  const allItemsForMain = subCategories.flatMap((sub) => MENU_ITEMS[sub.id] || []);
  const items = selectedSubCategory ? (MENU_ITEMS[selectedSubCategory] || []) : allItemsForMain;
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMainCategoryChange = (categoryId: string) => {
    setSelectedMainCategory(categoryId);
    setSelectedSubCategory(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Search Bar */}
      <div className={`px-3 py-1.5 border-b ${tc.border}`}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${tc.subtext}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className={`w-full pl-10 pr-4 py-2 rounded-lg text-[11px] md:text[13px] ${tc.searchInput}`}
          />
        </div>
      </div>

      {/* Main Categories */}
      <div className={`px-3 py-1.5 border-b ${tc.border}`}>
        <div className="grid grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-1.5">
          {MAIN_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleMainCategoryChange(cat.id)}
              className={`
                h-10 sm:h-14 rounded transition-all text-[0.6875rem] sm:text-[0.8125rem]
                flex items-end justify-start px-1.5 sm:px-2.5 pb-1 sm:pb-1.5 cursor-pointer
                ${selectedMainCategory === cat.id
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400"
                  : tc.isDark
                    ? "bg-slate-700/80 hover:bg-slate-600 text-slate-200 border-2 border-transparent"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-700 border-2 border-transparent"}
              `}
            >
              <span className="leading-tight text-left text-[11px] md:text-[13px]">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub Categories */}
      {subCategories.length > 0 && (
        <div className={`px-3 py-1.5 border-b ${tc.border}`}>
          <div className="grid grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-1.5">
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubCategory(selectedSubCategory === sub.id ? null : sub.id)}
                className={`
                  h-10 sm:h-14 rounded transition-all text-[0.6875rem] sm:text-[0.8125rem]
                  flex items-end justify-start px-1.5 sm:px-2.5 pb-1 sm:pb-1.5 cursor-pointer
                  ${selectedSubCategory === sub.id
                    ? "bg-blue-500/90 hover:bg-blue-500 text-white border-2 border-blue-300"
                    : tc.isDark
                      ? "bg-slate-700/50 hover:bg-slate-600/70 text-slate-300 border-2 border-transparent"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-2 border-transparent"}
                `}
              >
                <span className="leading-tight text-left text-[11px] md:text-[13px]">{sub.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="flex-1 overflow-y-auto px-3 py-1.5 min-h-[5.5rem]">
        <div className="grid grid-cols-4 xl:grid-cols-5 gap-1 sm:gap-1.5">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addItemToOrder(item)}
              className={`
                h-10 sm:h-14 rounded transition-all text-[0.6875rem] sm:text-[0.8125rem]
                flex items-end justify-start px-1.5 sm:px-2.5 pb-1 sm:pb-1.5 cursor-pointer
                ${tc.isDark
                  ? "bg-slate-600/70 hover:bg-slate-500/80 text-slate-100 border-2 border-transparent hover:border-blue-400"
                  : "bg-slate-200/80 hover:bg-slate-300 text-slate-800 border-2 border-transparent hover:border-blue-400"}
              `}
            >
              <span className="leading-tight text-left text-[11px] md:text-[13px]">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}