import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import {
  Store,
  Clock,
  Phone,
  Timer,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type DepositCurrency = "foreign" | "domestic";
import { useThemeClasses } from "../theme-context";
import { InlineToggle } from "./ui-helpers";

const THUMBNAIL_URLS = [
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80",
];

const HOUR_DAY_KEY: Record<string, "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"> = {
  Monday: "mon",
  Tuesday: "tue",
  Wednesday: "wed",
  Thursday: "thu",
  Friday: "fri",
  Saturday: "sat",
  Sunday: "sun",
};

const CAL_HEADER_KEYS: ("sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat")[] = [
  "sun", "mon", "tue", "wed", "thu", "fri", "sat",
];

export function GeneralSettings() {
  const { t, i18n } = useTranslation("settings");
  const tc = useThemeClasses();
  const calendarLocale = useMemo(
    () => ((i18n.resolvedLanguage ?? i18n.language).startsWith("ko") ? "ko-KR" : "en-US"),
    [i18n.resolvedLanguage, i18n.language],
  );
  const [mainPhone, setMainPhone] = useState("(555) 000-1234");
  const [altPhone, setAltPhone] = useState("(555) 000-5678");
  const [deposit, setDeposit] = useState("500");
  const [depositCurrency, setDepositCurrency] =
    useState<DepositCurrency>("foreign");
  const [gracePeriod, setGracePeriod] = useState("20");
  const [daysOff, setDaysOff] = useState<string[]>([
    "2026-05-15",
    "2026-05-20",
  ]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    new Date().getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    new Date().getMonth(),
  );
  const [tempDaysOff, setTempDaysOff] = useState<string[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] =
    useState(false);
  const [dateToDelete, setDateToDelete] = useState<
    string | null
  >(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currencySwitchStartX, setCurrencySwitchStartX] = useState<number | null>(null);
  const [currencyDragOffset, setCurrencyDragOffset] = useState(0);
  const [isDraggingCurrency, setIsDraggingCurrency] = useState(false);
  const [imageSwipeStartX, setImageSwipeStartX] = useState<number | null>(null);
  const [imageDragOffset, setImageDragOffset] = useState(0);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [gallerySwipeStartX, setGallerySwipeStartX] = useState<number | null>(null);
  const [galleryDragOffset, setGalleryDragOffset] = useState(0);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const [hours, setHours] = useState([
    {
      day: "Monday",
      open: "10:00",
      close: "22:00",
      closed: false,
    },
    {
      day: "Tuesday",
      open: "10:00",
      close: "22:00",
      closed: false,
    },
    {
      day: "Wednesday",
      open: "10:00",
      close: "22:00",
      closed: false,
    },
    {
      day: "Thursday",
      open: "10:00",
      close: "23:00",
      closed: false,
    },
    {
      day: "Friday",
      open: "10:00",
      close: "23:00",
      closed: false,
    },
    {
      day: "Saturday",
      open: "11:00",
      close: "23:00",
      closed: false,
    },
    {
      day: "Sunday",
      open: "11:00",
      close: "21:00",
      closed: false,
    },
  ]);

  const updateHour = (
    idx: number,
    field: "open" | "close",
    value: string,
  ) => {
    setHours((prev) =>
      prev.map((h, i) =>
        i === idx ? { ...h, [field]: value } : h,
      ),
    );
  };
  const toggleClosed = (idx: number) => {
    setHours((prev) =>
      prev.map((h, i) =>
        i === idx ? { ...h, closed: !h.closed } : h,
      ),
    );
  };

  const timeInputCls = `px-2.5 py-1.5 rounded-lg border text-[0.8125rem] outline-none focus:border-blue-500 ${
    tc.isDark
      ? "border-gray-700 bg-[#3a3f4d] text-gray-100"
      : "border-gray-300 bg-white text-gray-900"
  }`;
  const timeInputStyle: React.CSSProperties = tc.isDark
    ? { colorScheme: "dark" }
    : {};

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(
      viewYear,
      viewMonth + 1,
      0,
    ).getDate();
    const result: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++)
      result.push(new Date(viewYear, viewMonth, d));
    return result;
  }, [viewYear, viewMonth]);

  const navigateMonth = (dir: -1 | 1) => {
    let m = viewMonth + dir,
      y = viewYear;
    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }
    setViewMonth(m);
    setViewYear(y);
  };

  const handleDateSelect = (d: Date) => {
    const dateStr = d.toISOString().split("T")[0];
    if (tempDaysOff.includes(dateStr)) {
      setTempDaysOff(
        tempDaysOff.filter((day) => day !== dateStr),
      );
    } else {
      setTempDaysOff([...tempDaysOff, dateStr].sort());
    }
  };

  const hasChanges =
    JSON.stringify(tempDaysOff) !== JSON.stringify(daysOff);

  const handleSave = () => {
    setDaysOff(tempDaysOff);
    setCalendarOpen(false);
  };

  const handleDeleteClick = (date: string) => {
    setDateToDelete(date);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (dateToDelete) {
      setDaysOff(daysOff.filter((d) => d !== dateToDelete));
    }
    setConfirmDeleteOpen(false);
    setDateToDelete(null);
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prev) => (prev + 1) % THUMBNAIL_URLS.length,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + THUMBNAIL_URLS.length) %
        THUMBNAIL_URLS.length,
    );
  };

  const handleImageSwipeStart = (clientX: number) => {
    setImageSwipeStartX(clientX);
    setIsDraggingImage(true);
    setImageDragOffset(0);
  };

  const handleImageSwipeMove = (clientX: number) => {
    if (imageSwipeStartX === null || !isDraggingImage) return;
    const dx = clientX - imageSwipeStartX;
    setImageDragOffset(dx);
  };

  const handleImageSwipeEnd = (clientX: number) => {
    if (imageSwipeStartX === null) return;
    const dx = clientX - imageSwipeStartX;
    const threshold = 80;

    if (dx > threshold) {
      prevImage();
    } else if (dx < -threshold) {
      nextImage();
    }

    setImageSwipeStartX(null);
    setIsDraggingImage(false);
    setImageDragOffset(0);
  };

  const handleGallerySwipeStart = (clientX: number) => {
    setGallerySwipeStartX(clientX);
    setIsDraggingGallery(true);
    setGalleryDragOffset(0);
  };

  const handleGallerySwipeMove = (clientX: number) => {
    if (gallerySwipeStartX === null || !isDraggingGallery) return;
    const dx = clientX - gallerySwipeStartX;
    setGalleryDragOffset(dx);
  };

  const handleGallerySwipeEnd = (clientX: number) => {
    if (gallerySwipeStartX === null) return;
    const dx = clientX - gallerySwipeStartX;
    const threshold = 80;

    if (dx > threshold) {
      prevImage();
    } else if (dx < -threshold) {
      nextImage();
    }

    setGallerySwipeStartX(null);
    setIsDraggingGallery(false);
    setGalleryDragOffset(0);
  };

  const handleCurrencySwitchStart = (clientX: number) => {
    setCurrencySwitchStartX(clientX);
    setIsDraggingCurrency(true);
    setCurrencyDragOffset(0);
  };

  const handleCurrencySwitchMove = (clientX: number) => {
    if (currencySwitchStartX === null || !isDraggingCurrency) return;
    const dx = clientX - currencySwitchStartX;

    // Limit drag range
    const maxDrag = 90; // Width of container minus button width
    if (depositCurrency === "foreign") {
      // Can drag left (negative)
      setCurrencyDragOffset(Math.max(-maxDrag, Math.min(0, dx)));
    } else {
      // Can drag right (positive)
      setCurrencyDragOffset(Math.min(maxDrag, Math.max(0, dx)));
    }
  };

  const handleCurrencySwitchEnd = (clientX: number) => {
    if (currencySwitchStartX === null) return;
    const dx = clientX - currencySwitchStartX;

    // Switch if dragged past threshold (50% of the available space)
    const threshold = 45;
    if (depositCurrency === "foreign" && dx < -threshold) {
      setDepositCurrency("domestic");
    } else if (depositCurrency === "domestic" && dx > threshold) {
      setDepositCurrency("foreign");
    }

    setCurrencySwitchStartX(null);
    setIsDraggingCurrency(false);
    setCurrencyDragOffset(0);
  };

  const sameDay = (a: Date, b: Date) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const monthLabel = useMemo(
    () =>
      new Date(viewYear, viewMonth).toLocaleDateString(calendarLocale, {
        month: "long",
        year: "numeric",
      }),
    [viewYear, viewMonth, calendarLocale],
  );

  const fmtListDate = (dateStr: string) =>
    new Date(`${dateStr}T00:00:00`).toLocaleDateString(calendarLocale, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="space-y-4">
      <div className={`${tc.card} rounded-lg`}>
        <div className={`p-4 sm:p-5 border-b ${tc.cardBorder}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h3 className={`text-[0.9375rem] ${tc.heading}`}>
                {t("general.restaurantInfo")}
              </h3>
              <p
                className={`text-[0.75rem] ${tc.subtext} mt-0.5`}
              >
                {t("general.restaurantInfoSubtitle")}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.6875rem] shrink-0 ${tc.badge}`}
            >
              <Store className="w-3 h-3" /> {t("general.freeTier")}
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4 sm:gap-6">
          <div className="space-y-4 min-w-0">
            <div>
              <label
                className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
              >
                {t("general.restaurantName")}
              </label>
              <p className={`text-[0.875rem] ${tc.heading}`}>
                {t("general.mockRestaurantName")}
              </p>
            </div>
            <div>
              <label
                className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
              >
                {t("general.description")}
              </label>
              <p
                className={`text-[0.8125rem] ${tc.subtext} leading-relaxed`}
              >
                {t("general.mockRestaurantDescription")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
                >
                  {t("general.depositMoney")}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span
                      className={`absolute left-3 top-1/2 -translate-y-1/2 text-[0.9375rem] w-4 text-center ${
                        depositCurrency === "domestic" ? "text-blue-600" : "text-red-600"
                      }`}
                    >
                      {depositCurrency === "domestic"
                        ? t("general.wonSuffix")
                        : "$"}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={deposit}
                      onChange={(e) =>
                        setDeposit(e.target.value)
                      }
                      className={`${tc.input} pl-10`}
                    />
                  </div>
                  <div
                    className={`relative flex items-center rounded-lg p-1 shrink-0 cursor-grab active:cursor-grabbing bg-blue-600 select-none`}
                    style={{
                      width: '140px',
                    }}
                    onTouchStart={(e) => handleCurrencySwitchStart(e.touches[0].clientX)}
                    onTouchMove={(e) => handleCurrencySwitchMove(e.touches[0].clientX)}
                    onTouchEnd={(e) => handleCurrencySwitchEnd(e.changedTouches[0].clientX)}
                    onPointerDown={(e) => {
                      if (e.pointerType !== "touch") {
                        handleCurrencySwitchStart(e.clientX);
                        e.currentTarget.setPointerCapture(e.pointerId);
                      }
                    }}
                    onPointerMove={(e) => {
                      if (e.pointerType !== "touch") handleCurrencySwitchMove(e.clientX);
                    }}
                    onPointerUp={(e) => {
                      if (e.pointerType !== "touch") {
                        handleCurrencySwitchEnd(e.clientX);
                        e.currentTarget.releasePointerCapture(e.pointerId);
                      }
                    }}
                  >
                    {/* Active text on blue background - positioned to avoid inactive button */}
                    <span
                      className="absolute top-0 bottom-0 flex items-center justify-center text-white text-[0.875rem] pointer-events-none transition-all duration-200"
                      style={{
                        left: depositCurrency === "foreign" ? "4px" : "48px",
                        right: depositCurrency === "foreign" ? "48px" : "4px",
                      }}
                    >
                      {depositCurrency === "foreign" ? t("general.foreign") : t("general.domestic")}
                    </span>

                    {/* Inactive button that slides */}
                    <div
                      className={`relative z-10 w-10 h-8 rounded-md text-[0.875rem] flex items-center justify-center ${
                        tc.isDark ? "bg-slate-800 text-slate-400" : "bg-white text-slate-600"
                      }`}
                      style={{
                        marginLeft: depositCurrency === "foreign" ? "auto" : "0",
                        transform: `translateX(${currencyDragOffset}px)`,
                        transition: isDraggingCurrency ? "none" : "transform 200ms, margin 200ms",
                      }}
                    >
                      {depositCurrency === "foreign" ? t("general.wonSuffix") : "$"}
                    </div>
                  </div>
                </div>
                <p
                  className={`text-[0.6875rem] ${tc.muted} mt-1`}
                >
                  {t("general.depositHint")}
                </p>
              </div>
              <div>
                <label
                  className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
                >
                  {t("general.gracePeriod")}
                </label>
                <div className="relative">
                  <Timer
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${tc.muted}`}
                  />
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={gracePeriod}
                    onChange={(e) =>
                      setGracePeriod(e.target.value)
                    }
                    className={`${tc.input} pl-10 pr-12`}
                  />
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-[0.75rem] ${tc.muted}`}
                  >
                    {t("general.graceUnitMin")}
                  </span>
                </div>
                <p
                  className={`text-[0.6875rem] ${tc.muted} mt-1`}
                >
                  {t("general.graceHint")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-1.5">
              <label
                className={`text-[0.8125rem] ${tc.subtext}`}
              >
                {t("general.restaurantImages", { current: currentImageIndex + 1, total: THUMBNAIL_URLS.length })}
              </label>
              <button
                onClick={() => setShowAllImages(!showAllImages)}
                className={`text-[0.75rem] px-2.5 py-1 rounded-md cursor-pointer transition-colors ${
                  tc.isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {showAllImages ? t("general.hide") : t("general.showAll")}
              </button>
            </div>
            <div
              className={`rounded-lg overflow-hidden border ${tc.cardBorder} w-full h-[200px] relative group cursor-grab active:cursor-grabbing select-none`}
              onTouchStart={(e) => handleImageSwipeStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleImageSwipeMove(e.touches[0].clientX)}
              onTouchEnd={(e) => handleImageSwipeEnd(e.changedTouches[0].clientX)}
              onPointerDown={(e) => {
                if (e.pointerType !== "touch") {
                  handleImageSwipeStart(e.clientX);
                  e.currentTarget.setPointerCapture(e.pointerId);
                }
              }}
              onPointerMove={(e) => {
                if (e.pointerType !== "touch") handleImageSwipeMove(e.clientX);
              }}
              onPointerUp={(e) => {
                if (e.pointerType !== "touch") {
                  handleImageSwipeEnd(e.clientX);
                  if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                  }
                }
              }}
            >
              <div
                className="flex h-full transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(calc(-${currentImageIndex * 100}% + ${imageDragOffset}px))`,
                  transition: isDraggingImage ? "none" : "transform 300ms ease-out",
                }}
              >
                {THUMBNAIL_URLS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={t("general.imageAlt", { name: t("general.mockRestaurantName"), n: idx + 1 })}
                    className="w-full h-full object-cover flex-shrink-0 pointer-events-none"
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              {THUMBNAIL_URLS.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100 ${
                      tc.isDark
                        ? "bg-black/50 hover:bg-black/70 text-white"
                        : "bg-white/80 hover:bg-white text-slate-900"
                    }`}
                    aria-label={t("general.prevImage")}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all opacity-0 group-hover:opacity-100 ${
                      tc.isDark
                        ? "bg-black/50 hover:bg-black/70 text-white"
                        : "bg-white/80 hover:bg-white text-slate-900"
                    }`}
                    aria-label={t("general.nextImage")}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Indicators */}
            {THUMBNAIL_URLS.length > 1 && !showAllImages && (
              <div className="flex gap-1.5 justify-center mt-2">
                {THUMBNAIL_URLS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                      idx === currentImageIndex
                        ? "bg-blue-600 w-4"
                        : tc.isDark
                          ? "bg-slate-600 hover:bg-slate-500"
                          : "bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={t("general.goToImage", { n: idx + 1 })}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      <div className={`${tc.card} rounded-lg`}>
        <div className={`p-4 sm:p-5 border-b ${tc.cardBorder}`}>
          <h3
            className={`text-[0.9375rem] ${tc.heading} flex items-center gap-2`}
          >
            <Calendar className="w-4 h-4 text-blue-400" /> {t("general.daysOff")}
          </h3>
          <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>
            {t("general.daysOffSubtitle")}
          </p>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <label
              className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
            >
              {t("general.addDayOff")}
            </label>
            <button
              type="button"
              onClick={() => {
                setTempDaysOff([...daysOff]);
                setCalendarOpen(true);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                tc.isDark
                  ? "border-gray-700 bg-[#3a3f4d] text-gray-100 hover:border-gray-600"
                  : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
              }`}
            >
              <Calendar
                className={`w-4 h-4 ${tc.muted} shrink-0`}
              />
              <span
                className={`text-[0.8125rem] ${tc.subtext}`}
              >
                {t("general.selectDate")}
              </span>
            </button>
            <p className={`text-[0.6875rem] ${tc.muted} mt-1`}>
              {t("general.addDayHint")}
            </p>
          </div>

          {daysOff.length > 0 && (
            <div>
              <label
                className={`text-[0.8125rem] ${tc.subtext} mb-2 block`}
              >
                {t("general.scheduledDaysOff", { count: daysOff.length })}
              </label>
              <div className="space-y-2">
                {daysOff.map((date) => {
                  const formatted = fmtListDate(date);
                  return (
                    <div
                      key={date}
                      className={`flex items-center justify-between py-2 px-3 rounded-lg ${tc.isDark ? "bg-gray-800/50" : "bg-gray-100/50"}`}
                    >
                      <span
                        className={`text-[0.8125rem] ${tc.heading}`}
                      >
                        {formatted}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(date)}
                        className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                          tc.isDark
                            ? "hover:bg-red-900/30 text-red-400"
                            : "hover:bg-red-100 text-red-600"
                        }`}
                        aria-label={t("general.removeDayOffAria")}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`${tc.card} rounded-lg`}>
        <div className={`p-4 sm:p-5 border-b ${tc.cardBorder}`}>
          <h3
            className={`text-[0.9375rem] ${tc.heading} flex items-center gap-2`}
          >
            <Clock className="w-4 h-4 text-blue-400" /> {t("general.openingHours")}
          </h3>
          <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>
            {t("general.openingHoursSubtitle")}
          </p>
        </div>
        <div className="p-3 sm:p-5 space-y-2">
          {hours.map((h, idx) => (
            <div
              key={h.day}
              className={`flex items-center gap-2 sm:gap-3 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg transition-colors ${
                h.closed
                  ? tc.isDark
                    ? "bg-gray-800/50 opacity-60"
                    : "bg-gray-100/50 opacity-60"
                  : tc.hover
              }`}
            >
              <span
                className={`text-[0.75rem] sm:text-[0.8125rem] ${tc.subtext} w-8 sm:w-24 shrink-0`}
              >
                {(() => {
                  const dk = HOUR_DAY_KEY[h.day];
                  if (!dk) return h.day;
                  return (
                    <>
                      <span className="sm:hidden">{t(`general.weekdaysAbbr.${dk}`)}</span>
                      <span className="hidden sm:inline">{t(`general.weekdays.${dk}`)}</span>
                    </>
                  );
                })()}
              </span>
              <InlineToggle
                checked={!h.closed}
                onChange={() => toggleClosed(idx)}
                size="sm"
              />
              {!h.closed ? (
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  <input
                    type="time"
                    value={h.open}
                    onChange={(e) =>
                      updateHour(idx, "open", e.target.value)
                    }
                    className={`${timeInputCls} flex-1 min-w-0 text-[0.75rem] sm:text-[0.8125rem]`}
                    style={timeInputStyle}
                  />
                  <span
                    className={`text-[0.6875rem] sm:text-[0.75rem] ${tc.muted} shrink-0`}
                  >
                    {t("general.to")}
                  </span>
                  <input
                    type="time"
                    value={h.close}
                    onChange={(e) =>
                      updateHour(idx, "close", e.target.value)
                    }
                    className={`${timeInputCls} flex-1 min-w-0 text-[0.75rem] sm:text-[0.8125rem]`}
                    style={timeInputStyle}
                  />
                </div>
              ) : (
                <span
                  className={`text-[0.75rem] ${tc.muted} italic`}
                >
                  {t("general.closed")}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={`${tc.card} rounded-lg`}>
        <div className={`p-4 sm:p-5 border-b ${tc.cardBorder}`}>
          <h3
            className={`text-[0.9375rem] ${tc.heading} flex items-center gap-2`}
          >
            <Phone className="w-4 h-4 text-blue-400" /> {t("general.phoneNumbers")}
          </h3>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          <div>
            <label
              className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
            >
              {t("general.mainPhone")}
            </label>
            <div className="relative">
              <Phone
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${tc.muted}`}
              />
              <input
                type="text"
                value={mainPhone}
                onChange={(e) => setMainPhone(e.target.value)}
                className={`${tc.input} pl-10`}
              />
            </div>
          </div>
          <div>
            <label
              className={`text-[0.8125rem] ${tc.subtext} mb-1.5 block`}
            >
              {t("general.altPhone")}
            </label>
            <div className="relative">
              <Phone
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${tc.muted}`}
              />
              <input
                type="text"
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
                className={`${tc.input} pl-10`}
              />
            </div>
            <p className={`text-[0.6875rem] ${tc.muted} mt-1`}>
              {t("general.altPhoneHint")}
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Dialog */}
      <AnimatePresence>
        {calendarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setCalendarOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.18 }}
              className={`${tc.card} rounded-2xl w-full max-w-[420px] overflow-hidden shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`flex items-center justify-between px-5 py-4 border-b ${tc.border}`}
              >
                <div>
                  <h3 className={`text-[1rem] ${tc.heading}`}>
                    {t("general.calendarModalTitle")}
                  </h3>
                  <p
                    className={`text-[0.875rem] ${tc.subtext} mt-0.5`}
                  >
                    {t("general.calendarModalSubtitle")}
                  </p>
                </div>
                <button
                  onClick={() => setCalendarOpen(false)}
                  className={`p-1.5 rounded-full cursor-pointer transition-colors ${tc.hover}`}
                >
                  <X className={`w-4 h-4 ${tc.subtext}`} />
                </button>
              </div>

              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className={`p-1.5 rounded-full cursor-pointer transition-colors ${tc.hover}`}
                  >
                    <ChevronLeft
                      className={`w-4 h-4 ${tc.subtext}`}
                    />
                  </button>
                  <span
                    className={`text-[0.9375rem] ${tc.heading}`}
                  >
                    {monthLabel}
                  </span>
                  <button
                    onClick={() => navigateMonth(1)}
                    className={`p-1.5 rounded-full cursor-pointer transition-colors ${tc.hover}`}
                  >
                    <ChevronRight
                      className={`w-4 h-4 ${tc.subtext}`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-1">
                  {CAL_HEADER_KEYS.map((k) => (
                    <div
                      key={`wh-${k}`}
                      className={`text-center text-[0.75rem] ${tc.subtext} py-1`}
                    >
                      {t(`general.calendarWeek.${k}`)}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((d, i) => {
                    if (!d)
                      return (
                        <div
                          key={`e-${i}`}
                          className="aspect-square"
                        />
                      );
                    const dateStr = d
                      .toISOString()
                      .split("T")[0];
                    const isSelected =
                      tempDaysOff.includes(dateStr);
                    const isToday = sameDay(d, new Date());
                    return (
                      <button
                        key={`d-${d.getTime()}`}
                        onClick={() => handleDateSelect(d)}
                        className={`aspect-square rounded-lg text-[0.875rem] cursor-pointer transition-colors border-2 ${
                          isToday
                            ? tc.isDark
                              ? "border-white"
                              : "border-slate-900"
                            : "border-transparent"
                        } ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : `${tc.subtext} ${tc.hover}`
                        }`}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className={`flex items-center justify-end gap-2 px-5 py-3 border-t ${tc.border}`}
              >
                <button
                  onClick={() => setCalendarOpen(false)}
                  className={`px-3 py-1.5 rounded-full text-[0.875rem] cursor-pointer transition-colors ${tc.subtext} ${tc.hover}`}
                >
                  {t("general.cancel")}
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className={`px-4 py-1.5 rounded-full text-[0.875rem] cursor-pointer transition-colors ${
                    hasChanges
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : `${tc.isDark ? "bg-slate-700" : "bg-slate-200"} ${tc.subtext} cursor-not-allowed`
                  }`}
                >
                  {t("general.save")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDeleteOpen && dateToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setConfirmDeleteOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.18 }}
              className={`${tc.card} rounded-2xl w-full max-w-[400px] overflow-hidden shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`px-5 py-4 border-b ${tc.border}`}
              >
                <h3 className={`text-[1rem] ${tc.heading}`}>
                  {t("general.removeDayOffTitle")}
                </h3>
                <p
                  className={`text-[0.875rem] ${tc.subtext} mt-2`}
                >
                  {t("general.removeDayOffBody", { date: fmtListDate(dateToDelete) })}
                </p>
              </div>

              <div
                className={`flex items-center justify-end gap-2 px-5 py-3`}
              >
                <button
                  onClick={() => setConfirmDeleteOpen(false)}
                  className={`px-3 py-1.5 rounded-full text-[0.875rem] cursor-pointer transition-colors ${tc.subtext} ${tc.hover}`}
                >
                  {t("general.cancel")}
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-1.5 rounded-full text-[0.875rem] cursor-pointer transition-colors bg-red-600 text-white hover:bg-red-700"
                >
                  {t("general.remove")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {showAllImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Close button */}
            <button
              onClick={() => setShowAllImages(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
              aria-label={t("general.closeGallery")}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
              {currentImageIndex + 1} / {THUMBNAIL_URLS.length}
            </div>

            {/* Swipeable image container */}
            <div
              className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
              onTouchStart={(e) => handleGallerySwipeStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleGallerySwipeMove(e.touches[0].clientX)}
              onTouchEnd={(e) => handleGallerySwipeEnd(e.changedTouches[0].clientX)}
              onPointerDown={(e) => {
                if (e.pointerType !== "touch") {
                  handleGallerySwipeStart(e.clientX);
                  e.currentTarget.setPointerCapture(e.pointerId);
                }
              }}
              onPointerMove={(e) => {
                if (e.pointerType !== "touch") handleGallerySwipeMove(e.clientX);
              }}
              onPointerUp={(e) => {
                if (e.pointerType !== "touch") {
                  handleGallerySwipeEnd(e.clientX);
                  if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                  }
                }
              }}
            >
              <div
                className="flex h-full w-full items-center transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(calc(-${currentImageIndex * 100}% + ${galleryDragOffset}px))`,
                  transition: isDraggingGallery ? "none" : "transform 300ms ease-out",
                }}
              >
                {THUMBNAIL_URLS.map((url, idx) => (
                  <div
                    key={idx}
                    className="w-full h-full flex items-center justify-center flex-shrink-0 px-4"
                  >
                    <img
                      src={url}
                      alt={t("general.imageAlt", { name: t("general.mockRestaurantName"), n: idx + 1 })}
                      className="max-w-full max-h-full object-contain pointer-events-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            {THUMBNAIL_URLS.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
                  aria-label={t("general.prevImage")}
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
                  aria-label={t("general.nextImage")}
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {THUMBNAIL_URLS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-1.5 rounded-full cursor-pointer transition-all ${
                    idx === currentImageIndex
                      ? "bg-white w-8"
                      : "bg-white/40 hover:bg-white/60 w-1.5"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}