import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { settingsEn, settingsKo } from "./settings-locale-data.mjs";
import { patchEn, patchKo } from "./remaining-ui-locale-data.mjs";

function deepMerge(target, source) {
  if (!source) return target;
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (sv && typeof sv === "object" && !Array.isArray(sv) && tv && typeof tv === "object" && !Array.isArray(tv)) {
      deepMerge(tv, sv);
    } else {
      target[key] = sv;
    }
  }
  return target;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const categoriesMain = {
  "hot-foods": { en: "Hot Foods", ko: "뜨거운 음식" },
  "cold-foods": { en: "Cold Foods", ko: "차가운 음식" },
  "main-meal": { en: "Main Meal", ko: "메인 요리" },
  drinks: { en: "Drinks", ko: "음료" },
};

const categoriesSub = {
  dumplings: { en: "Dumplings", ko: "만두" },
  "spring-rolls": { en: "Spring Rolls", ko: "춘권" },
  "bao-buns": { en: "Bao Buns", ko: "바오번" },
  "hot-soups": { en: "Hot Soups", ko: "뜨거운 스프" },
  "hot-appetizers": { en: "Hot Appetizers", ko: "뜨거운 전채" },
  "sushi-sashimi": { en: "Sushi & Sashimi", ko: "스시·사시미" },
  "cold-appetizers": { en: "Cold Appetizers", ko: "차가운 전채" },
  salads: { en: "Salads", ko: "샐러드" },
  "cold-noodles": { en: "Cold Noodles", ko: "냉면" },
  "rice-dishes": { en: "Rice Dishes", ko: "밥 요리" },
  "noodle-dishes": { en: "Noodle Dishes", ko: "면 요리" },
  "stir-fry": { en: "Stir Fry", ko: "볶음" },
  curry: { en: "Curry", ko: "커리" },
  "grilled-bbq": { en: "Grilled & BBQ", ko: "그릴·바비큐" },
  tea: { en: "Tea", ko: "차" },
  "soft-drinks": { en: "Soft Drinks", ko: "청량음료" },
  juice: { en: "Juice", ko: "주스" },
  beer: { en: "Beer", ko: "맥주" },
  wine: { en: "Wine", ko: "와인" },
  "sake-soju": { en: "Sake & Soju", ko: "사케·소주" },
  cocktails: { en: "Cocktails", ko: "칵테일" },
  appetizers: { en: "Appetizers", ko: "전채" },
  "soups-salads": { en: "Soups & Salads", ko: "수프·샐러드" },
  entrees: { en: "Entrees", ko: "메인 요리" },
  sides: { en: "Sides", ko: "사이드" },
  desserts: { en: "Desserts", ko: "디저트" },
  unknown: { en: "Other", ko: "기타" },
};

const tables = {};
for (let i = 1; i <= 12; i++) {
  const id = `T${i}`;
  tables[id] = { en: `Table ${i}`, ko: `테이블 ${i}` };
}
for (let i = 1; i <= 3; i++) {
  const id = `BAR${i}`;
  tables[id] = { en: `Bar ${i}`, ko: `바 ${i}` };
}
for (let i = 13; i <= 20; i++) {
  const id = `T${i}`;
  tables[id] = { en: `Table ${i}`, ko: `테이블 ${i}` };
}

const floorsOrders = {
  "1F": { en: "1st Floor", ko: "1층" },
  "2F": { en: "2nd Floor", ko: "2층" },
  bar: { en: "Bar", ko: "바" },
};

function pick(lang, obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = typeof v === "object" && v.en ? v[lang] : v;
  }
  return out;
}

const en = {
  nav: {
    analytics: "Analytics",
    "floor-plan": "Floor Plan",
    orders: "Orders",
    kitchen: "Kitchen",
    settings: "Settings",
    payment: "Payment",
  },
  brand: { name: "Glass Onion", subtitle: "POS System" },
  header: {
    lockTitle: "Lock screen",
    themeLight: "Switch to light mode",
    themeDark: "Switch to dark mode",
    switchRole: "Switch Role",
    pagesCount: "{{count}} page",
    pagesCount_plural: "{{count}} pages",
  },
  toast: { clearAll: "Clear All", clearAllAria: "Clear all notifications" },
  roles: {
    Admin: "Admin",
    Cashier: "Cashier",
    Chef: "Chef",
    Waiter: "Waiter",
  },
  categories: { main: pick("en", categoriesMain), sub: pick("en", categoriesSub) },
  floors: pick("en", floorsOrders),
  tables: pick("en", tables),
  floorPlan: {
    floorNames: { f1: "Hall", f2: "Lounge" },
    status: {
      available: "Available",
      occupied: "Occupied",
      reserved: "Reserved",
    },
    renameHint: "Click to rename",
  },
  modifiers: {
    "medium-rare": "Medium Rare",
    "well-done": "Well Done",
    "extra-spicy": "Extra Spicy",
    "no-garlic": "NO Garlic",
    "side-asparagus": "Side Asparagus",
  },
  kitchen: {
    tableWithLabel: "{{label}}",
    filterTitle: "Filter by table",
    selectAll: "Select all",
    deselectAll: "Clear all",
    tablesSelected: "{{count}} tables",
    cardOrderTime: "Order {{time}}",
    actions: {
      accept: "Accept",
      complete: "Complete",
      recall: "Recall",
      orderDetails: "Order Details",
      completeWithCount: "Complete ({{count}})",
      recallWithCount: "Recall ({{count}})",
    },
    urgencyJustNow: "Just now",
    urgencyMins: "{{mins}}m",
    urgencyMinsElapsed: "{{mins}}m elapsed",
    confirm: {
      complete: { title: "Complete Items?", desc: "The following items will be marked as completed:", btn: "Complete" },
      recall: { title: "Recall Items?", desc: "The following items will be sent back to kitchen:", btn: "Recall" },
      accept: { title: "Accept Order?", desc: "The following items will be moved to In Progress:", btn: "Accept" },
    },
    itemCountModal: {
      completeTitle: "Complete Items",
      recallTitle: "Recall Items",
      ofQty: "of {{qty}}",
      select: "Select",
    },
    tabs: {
      received: "Received",
      inProgress: "In Progress",
      completed: "Completed",
    },
    emptyNoOrders: "No orders in this category",
    byItem: {
      emptyCategory: "No items in this category",
      colItem: "Item",
      colQty: "Qty",
      colDone: "Done",
      colTables: "Tables",
      summary: "{{items}} unique items across {{orders}} orders",
      totalQtyLabel: "{{qty}} total qty",
    },
    mobileTables: "Tables",
    sort: {
      oldest: "Oldest",
      newest: "Newest",
      oldestFirst: "Oldest First",
      newestFirst: "Newest First",
    },
    orderDetail: {
      orderedAt: "Ordered at {{time}}",
      completedAt: "Completed at {{time}}",
      metaJoin: " · ",
      badgeReceived: "Received {{count}}",
      badgeInProgress: "In Progress {{count}}",
      badgeCompleted: "Completed {{count}}",
    },
  },
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    search: "Search",
    loading: "Loading…",
    unknown: "Unknown",
  },
  orders: {
    searchPlaceholder: "Search",
    checkCounter: "Ch. #{{num}}",
    checkCounterUnknown: "Ch. #--",
    colName: "Name",
    colQty: "Qty",
    colEach: "Each",
    colTotal: "Total",
    newItems: "New Items",
    paymentLoading: "Loading…",
    orderPanel: {
      allFloors: "All Floors",
      selectTable: "Select Table",
      seats: "{{count}} seats",
      historyTooltip: "View today's bill history",
      history: "History",
      ordered: "Ordered",
      order: "Order",
      pay: "Pay",
      payLockedHint: "Only Admin or Cashier can take payment",
      emptyTitle: "No items yet",
      emptyHint: "Select items to add to order",
      domesticLabel: "Domestic (₩):",
      foreignLabel: "Foreign ($):",
      removeItemTitle: "Remove Item",
      updateQtyTitle: "Update Quantity",
      removeItemBody: "Remove {{name}} (×{{qty}}) from this order?",
      updateQtyBody: "{{name}}: ×{{from}} → ×{{to}}",
      historyTitle: "Today's Bill History",
      historySummary: "{{count}} bills · ₩{{krw}} · ${{usd}}",
      closeAria: "Close",
      colNo: "No.",
      colTable: "Table",
      colTime: "Time",
      colMethod: "Method",
      colAmount: "Amount",
      colItem: "Item",
      colPrice: "Price",
      colSubtotal: "Subtotal",
      confirmOrderTitle: "Confirm Order",
      confirmOrderBody: "{{count}} new {{items}} for {{table}}",
      itemSingular: "item",
      itemPlural: "items",
      tagRemove: "Remove",
      tagNew: "New",
      tagQty: "Qty {{from}} → {{to}}",
    },
  },
  auth: {
    signIn: {
      welcome: "Welcome Back",
      subtitle: "Sign in to your POS account",
      username: "Username",
      password: "Password",
      usernamePlaceholder: "Enter your username",
      passwordPlaceholder: "Enter your password",
      submit: "Sign In",
      signingIn: "Signing in...",
      errorUserRequired: "Please enter your username.",
      errorPassword: "Please enter your password (min 6 characters).",
      errorInvalid: "Invalid username or password.",
      noAccount: "Don't have an account?",
      signUpLink: "Sign Up",
    },
    lock: {
      password: "Password",
      passwordPlaceholder: "Enter your password",
      errorPassword: "Please enter your password (min 6 characters).",
      unlock: "Unlock",
      unlocking: "Unlocking...",
      switchAccount: "Switch Account",
    },
  },
  analytics: {
    sidebarTitle: "Analytics",
    sections: {
      dashboard: "Sales Dashboard",
      menuAnalysis: "Menu Analysis",
      customerAnalysis: "Customer Analysis",
      history: "History",
    },
    dateFilter: {
      today: "Today",
    },
    customRange: {
      title: "Select date range",
      last1Week: "Last 1 Week",
      last2Weeks: "Last 2 weeks",
      thisMonth: "This Month",
      lastMonth: "Last Month",
      apply: "Apply",
      cancel: "Cancel",
    },
    dashboard: {
      totalRevenue: "Total Revenue",
      kpi: {
        totalOrders: "Total Orders",
        avgTicket: "Avg Ticket Size",
        cancellations: "Cancellations",
      },
      salesTrend: "Sales Trend",
      salesTrendHint: "Tap on the chart to view revenue and order count",
      peakRevenueAt: "Peak revenue at {{hour}}",
      revenueOverTime: "Revenue over time",
    },
  },
  payment: {
    cash: "Cash",
    credit: "Credit",
    mix: "Mix",
  },
};

const ko = {
  nav: {
    analytics: "분석",
    "floor-plan": "플로어",
    orders: "주문",
    kitchen: "주방",
    settings: "설정",
    payment: "결제",
  },
  brand: { name: "글래스 어니언", subtitle: "POS 시스템" },
  header: {
    lockTitle: "잠금 화면",
    themeLight: "라이트 모드",
    themeDark: "다크 모드",
    switchRole: "역할 변경",
    pagesCount: "페이지 {{count}}개",
    pagesCount_plural: "페이지 {{count}}개",
  },
  toast: { clearAll: "모두 지우기", clearAllAria: "알림 모두 닫기" },
  roles: {
    Admin: "관리자",
    Cashier: "캐셔",
    Chef: "셰프",
    Waiter: "웨이터",
  },
  categories: { main: pick("ko", categoriesMain), sub: pick("ko", categoriesSub) },
  floors: pick("ko", floorsOrders),
  tables: pick("ko", tables),
  floorPlan: {
    floorNames: { f1: "홀", f2: "라운지" },
    status: { available: "빈 테이블", occupied: "사용 중", reserved: "예약" },
    renameHint: "클릭하여 이름 변경",
  },
  modifiers: {
    "medium-rare": "미디엄 레어",
    "well-done": "웰던",
    "extra-spicy": "아주 매운맛",
    "no-garlic": "마늘 빼주세요",
    "side-asparagus": "아스파라거스 사이드",
  },
  kitchen: {
    tableWithLabel: "{{label}}",
    filterTitle: "테이블 필터",
    selectAll: "전체 선택",
    deselectAll: "전체 해제",
    tablesSelected: "테이블 {{count}}개",
    cardOrderTime: "주문 {{time}}",
    actions: {
      accept: "수락",
      complete: "완료",
      recall: "되돌리기",
      orderDetails: "주문 상세",
      completeWithCount: "완료 ({{count}})",
      recallWithCount: "되돌리기 ({{count}})",
    },
    urgencyJustNow: "방금",
    urgencyMins: "{{mins}}분",
    urgencyMinsElapsed: "{{mins}}분 경과",
    confirm: {
      complete: { title: "완료 처리할까요?", desc: "다음 항목이 완료로 표시됩니다:", btn: "완료" },
      recall: { title: "다시 보낼까요?", desc: "다음 항목이 주방으로 되돌아갑니다:", btn: "되돌리기" },
      accept: { title: "주문을 수락할까요?", desc: "다음 항목이 진행 중으로 이동합니다:", btn: "수락" },
    },
    itemCountModal: {
      completeTitle: "완료 수량",
      recallTitle: "되돌리기 수량",
      ofQty: "/ {{qty}}",
      select: "선택",
    },
    tabs: {
      received: "접수",
      inProgress: "조리 중",
      completed: "완료",
    },
    emptyNoOrders: "이 상태의 주문이 없습니다",
    byItem: {
      emptyCategory: "항목이 없습니다",
      colItem: "메뉴",
      colQty: "수량",
      colDone: "완료",
      colTables: "테이블",
      summary: "주문 {{orders}}건 · 메뉴 종류 {{items}}개",
      totalQtyLabel: "총 수량 {{qty}}",
    },
    mobileTables: "테이블",
    sort: {
      oldest: "오래된 순",
      newest: "최신 순",
      oldestFirst: "오래된 순",
      newestFirst: "최신 순",
    },
    orderDetail: {
      orderedAt: "{{time}} 주문",
      completedAt: "{{time}} 완료",
      metaJoin: " · ",
      badgeReceived: "접수 {{count}}",
      badgeInProgress: "조리 중 {{count}}",
      badgeCompleted: "완료 {{count}}",
    },
  },
  common: {
    save: "저장",
    cancel: "취소",
    delete: "삭제",
    edit: "편집",
    close: "닫기",
    confirm: "확인",
    back: "뒤로",
    next: "다음",
    search: "검색",
    loading: "불러오는 중…",
    unknown: "알 수 없음",
  },
  orders: {
    searchPlaceholder: "검색",
    checkCounter: "체크 #{{num}}",
    checkCounterUnknown: "체크 #--",
    colName: "품목",
    colQty: "수량",
    colEach: "단가",
    colTotal: "합계",
    newItems: "신규 항목",
    paymentLoading: "불러오는 중…",
    orderPanel: {
      allFloors: "전체 층",
      selectTable: "테이블 선택",
      seats: "{{count}}인석",
      historyTooltip: "오늘 결제 내역",
      history: "내역",
      ordered: "주문 완료",
      order: "주문",
      pay: "결제",
      payLockedHint: "관리자 또는 캐셔만 결제할 수 있습니다",
      emptyTitle: "주문 항목이 없습니다",
      emptyHint: "메뉴에서 항목을 추가하세요",
      domesticLabel: "국내 (₩):",
      foreignLabel: "해외 ($):",
      removeItemTitle: "항목 삭제",
      updateQtyTitle: "수량 변경",
      removeItemBody: "{{name}} (×{{qty}})을(를) 주문에서 삭제할까요?",
      updateQtyBody: "{{name}}: ×{{from}} → ×{{to}}",
      historyTitle: "오늘 결제 내역",
      historySummary: "영수증 {{count}}건 · ₩{{krw}} · ${{usd}}",
      closeAria: "닫기",
      colNo: "번호",
      colTable: "테이블",
      colTime: "시간",
      colMethod: "결제",
      colAmount: "금액",
      colItem: "품목",
      colPrice: "단가",
      colSubtotal: "소계",
      confirmOrderTitle: "주문 확인",
      confirmOrderBody: "{{table}}에 신규 {{count}}개 {{items}}",
      itemSingular: "항목",
      itemPlural: "항목",
      tagRemove: "삭제",
      tagNew: "신규",
      tagQty: "수량 {{from}} → {{to}}",
    },
  },
  auth: {
    signIn: {
      welcome: "다시 오신 것을 환영합니다",
      subtitle: "POS 계정으로 로그인하세요",
      username: "아이디",
      password: "비밀번호",
      usernamePlaceholder: "아이디를 입력하세요",
      passwordPlaceholder: "비밀번호를 입력하세요",
      submit: "로그인",
      signingIn: "로그인 중…",
      errorUserRequired: "아이디를 입력해 주세요.",
      errorPassword: "비밀번호를 입력해 주세요(6자 이상).",
      errorInvalid: "아이디 또는 비밀번호가 올바르지 않습니다.",
      noAccount: "계정이 없으신가요?",
      signUpLink: "회원가입",
    },
    lock: {
      password: "비밀번호",
      passwordPlaceholder: "비밀번호를 입력하세요",
      errorPassword: "비밀번호를 입력해 주세요(6자 이상).",
      unlock: "잠금 해제",
      unlocking: "확인 중…",
      switchAccount: "다른 계정으로",
    },
  },
  analytics: {
    sidebarTitle: "분석",
    sections: {
      dashboard: "매출 대시보드",
      menuAnalysis: "메뉴 분석",
      customerAnalysis: "고객 분석",
      history: "히스토리",
    },
    dateFilter: {
      today: "오늘",
    },
    customRange: {
      title: "기간 선택",
      last1Week: "지난 1주",
      last2Weeks: "지난 2주",
      thisMonth: "이번 달",
      lastMonth: "지난 달",
      apply: "적용",
      cancel: "취소",
    },
    dashboard: {
      totalRevenue: "총 매출",
      kpi: {
        totalOrders: "총 주문",
        avgTicket: "객단가",
        cancellations: "취소 건수",
      },
      salesTrend: "매출 추이",
      salesTrendHint: "차트를 눌러 매출과 주문 수를 확인하세요",
      peakRevenueAt: "{{hour}}시 매출 최고",
      revenueOverTime: "시간대별 매출",
    },
  },
  payment: {
    cash: "현금",
    credit: "카드",
    mix: "혼합",
  },
};

const GUESTS = {
  kimM: { en: "Kim M.", ko: "김 M." },
  parkS: { en: "Park S.", ko: "박 S." },
  leeJ: { en: "Lee J.", ko: "이 J." },
  choiK: { en: "Choi K.", ko: "최 K." },
  jungH: { en: "Jung H.", ko: "정 H." },
  yoonA: { en: "Yoon A.", ko: "윤 A." },
  yooN: { en: "Yoo N.", ko: "유 N." },
  hanD: { en: "Han D.", ko: "한 D." },
  kangN: { en: "Kang N.", ko: "강 N." },
  shinB: { en: "Shin B.", ko: "신 B." },
  songY: { en: "Song Y.", ko: "송 Y." },
  imW: { en: "Im W.", ko: "임 W." },
  ohS: { en: "Oh S.", ko: "오 S." },
  baekJ: { en: "Baek J.", ko: "백 J." },
  seoH: { en: "Seo H.", ko: "서 H." },
  hwangD: { en: "Hwang D.", ko: "황 D." },
  moonY: { en: "Moon Y.", ko: "문 Y." },
  ryuK: { en: "Ryu K.", ko: "류 K." },
  jangM: { en: "Jang M.", ko: "장 M." },
  kwonT: { en: "Kwon T.", ko: "권 T." },
  naE: { en: "Na E.", ko: "나 E." },
  ahnS: { en: "Ahn S.", ko: "안 S." },
  choW: { en: "Cho W.", ko: "조 W." },
  baeR: { en: "Bae R.", ko: "배 R." },
  kimE: { en: "Kim E.", ko: "김 E." },
  limS: { en: "Lim S.", ko: "임 S." },
  parkJ: { en: "Park J.", ko: "박 J." },
  goH: { en: "Go H.", ko: "고 H." },
  walkIn: { en: "Walk-in", ko: "워크인" },
  seongL: { en: "Seong L.", ko: "성 L." },
  jeonY: { en: "Jeon Y.", ko: "전 Y." },
  nohK: { en: "Noh K.", ko: "노 K." },
  haD: { en: "Ha D.", ko: "하 D." },
  minC: { en: "Min C.", ko: "민 C." },
  kooB: { en: "Koo B.", ko: "구 B." },
  yooM: { en: "Yoo M.", ko: "유 M." },
  sunR: { en: "Sun R.", ko: "선 R." },
  ohD: { en: "Oh D.", ko: "오 D." },
  parkK: { en: "Park K.", ko: "박 K." },
  leeS: { en: "Lee S.", ko: "이 S." },
  choiM: { en: "Choi M.", ko: "최 M." },
  jiN: { en: "Ji N.", ko: "지 N." },
};

en.guests = pick("en", GUESTS);
ko.guests = pick("ko", GUESTS);

en.floorPlan.newTable = "Table {{num}}";
ko.floorPlan.newTable = "테이블 {{num}}";
en.floorPlan.copySuffix = " copy";
ko.floorPlan.copySuffix = " 복사";
en.floorPlan.tableDrawer = {
  seats: "{{count}} seats",
  minutes: "{{count}} min",
  noOrders: "No active orders",
  guest: "Guest",
  time: "Time",
  partySize: "Party size",
  reservationQr: "Reservation QR",
  qrHint: "Scan to check in",
  occupied: "Occupied",
  reserved: "Reserved",
  orderTotal: "Order total ({{count}} items)",
  paymentTotal: "Payment total",
  payment: "Payment",
  seatGuest: "Seat Guest",
  checkIn: "Check In",
  cancel: "Cancel",
};
ko.floorPlan.tableDrawer = {
  seats: "{{count}}인석",
  minutes: "{{count}}분",
  noOrders: "진행 중인 주문 없음",
  guest: "고객",
  time: "시간",
  partySize: "인원",
  reservationQr: "예약 QR",
  qrHint: "체크인을 위해 스캔하세요",
  occupied: "사용 중",
  reserved: "예약",
  orderTotal: "주문 합계 ({{count}}개)",
  paymentTotal: "결제 금액",
  payment: "결제",
  seatGuest: "고객 착석",
  checkIn: "체크인",
  cancel: "취소",
};

en.settings = settingsEn;
ko.settings = settingsKo;
deepMerge(en, patchEn);
deepMerge(ko, patchKo);

fs.writeFileSync(path.join(root, "src/locales/en.json"), JSON.stringify(en, null, 2));
fs.writeFileSync(path.join(root, "src/locales/ko.json"), JSON.stringify(ko, null, 2));
console.log("Wrote en.json, ko.json");
