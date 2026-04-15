(function (global) {
  "use strict";

  const STORAGE_KEY = "shiftwise-au-v1";
  const DAY_MS = 86400000;
  const CURRENCY_FORMATTER = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD"
  });
  const DATE_FORMATTER = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const MONTH_FORMATTER = new Intl.DateTimeFormat("en-AU", {
    month: "long",
    year: "numeric"
  });
  const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short"
  });
  const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
  const TIME_FORMATTER = new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit"
  });
  const THEME_META_COLORS = {
    light: "#fbfbf7",
    dark: "#171b20"
  };
  const GOOGLE_LOGIN_SCOPE = "openid email profile";
  const GOOGLE_CALENDAR_SCOPE = `${GOOGLE_LOGIN_SCOPE} https://www.googleapis.com/auth/calendar`;
  const GOOGLE_OPENID_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration";
  const GOOGLE_CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";
  const GOOGLE_CLIENT_ID_STORAGE_KEY = "shiftwise-au-google-client-id";
  const PAY_MULTIPLIERS = {
    weekly: 52,
    fortnightly: 26,
    monthly: 12
  };
  const DAY_TYPE_LABELS = {
    weekday: "Weekday",
    saturday: "Saturday",
    sunday: "Sunday",
    publicHoliday: "Public holiday"
  };
  const BAND_LABELS = {
    day: "day",
    evening: "evening",
    overnight: "overnight"
  };
  const STATE_LABELS = {
    ACT: "Australian Capital Territory",
    NSW: "New South Wales",
    NT: "Northern Territory",
    QLD: "Queensland",
    SA: "South Australia",
    TAS: "Tasmania",
    VIC: "Victoria",
    WA: "Western Australia"
  };
  const WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const OFFICIAL_HOLIDAY_DATA = {
    ACT: [
      { date: "2026-01-01", label: "New Year's Day" },
      { date: "2026-01-26", label: "Australia Day" },
      { date: "2026-03-09", label: "Canberra Day" },
      { date: "2026-04-03", label: "Good Friday" },
      { date: "2026-04-04", label: "Easter Saturday" },
      { date: "2026-04-05", label: "Easter Sunday" },
      { date: "2026-04-06", label: "Easter Monday" },
      { date: "2026-04-25", label: "Anzac Day" },
      { date: "2026-04-27", label: "Additional public holiday for Anzac Day" },
      { date: "2026-06-01", label: "Reconciliation Day" },
      { date: "2026-06-08", label: "King's Birthday" },
      { date: "2026-10-05", label: "Labour Day" },
      { date: "2026-12-25", label: "Christmas Day" },
      { date: "2026-12-26", label: "Boxing Day" },
      { date: "2026-12-28", label: "Additional public holiday for Boxing Day" },
      { date: "2027-01-01", label: "New Year's Day" },
      { date: "2027-01-26", label: "Australia Day" },
      { date: "2027-03-08", label: "Canberra Day" },
      { date: "2027-03-26", label: "Good Friday" },
      { date: "2027-03-27", label: "Easter Saturday" },
      { date: "2027-03-28", label: "Easter Sunday" },
      { date: "2027-03-29", label: "Easter Monday" },
      { date: "2027-04-26", label: "Anzac Day" },
      { date: "2027-05-31", label: "Reconciliation Day" },
      { date: "2027-06-14", label: "King's Birthday" },
      { date: "2027-10-04", label: "Labour Day" },
      { date: "2027-12-25", label: "Christmas Day" },
      { date: "2027-12-26", label: "Boxing Day" },
      { date: "2027-12-27", label: "Additional public holiday for Christmas Day" },
      { date: "2027-12-28", label: "Additional public holiday for Boxing Day" }
    ],
    NSW: [
      { date: "2026-01-01", label: "New Year's Day" },
      { date: "2026-01-26", label: "Australia Day" },
      { date: "2026-04-03", label: "Good Friday" },
      { date: "2026-04-04", label: "Easter Saturday" },
      { date: "2026-04-05", label: "Easter Sunday" },
      { date: "2026-04-06", label: "Easter Monday" },
      { date: "2026-04-25", label: "Anzac Day" },
      { date: "2026-04-27", label: "Additional public holiday for Anzac Day" },
      { date: "2026-06-08", label: "King's Birthday" },
      { date: "2026-10-05", label: "Labour Day" },
      { date: "2026-12-25", label: "Christmas Day" },
      { date: "2026-12-26", label: "Boxing Day" },
      { date: "2026-12-28", label: "Additional public holiday for Boxing Day" },
      { date: "2027-01-01", label: "New Year's Day" },
      { date: "2027-01-26", label: "Australia Day" },
      { date: "2027-03-26", label: "Good Friday" },
      { date: "2027-03-27", label: "Easter Saturday" },
      { date: "2027-03-28", label: "Easter Sunday" },
      { date: "2027-03-29", label: "Easter Monday" },
      { date: "2027-04-25", label: "Anzac Day" },
      { date: "2027-04-26", label: "Additional public holiday for Anzac Day" },
      { date: "2027-06-14", label: "King's Birthday" },
      { date: "2027-10-04", label: "Labour Day" },
      { date: "2027-12-25", label: "Christmas Day" },
      { date: "2027-12-26", label: "Boxing Day" },
      { date: "2027-12-27", label: "Additional public holiday for Christmas Day" },
      { date: "2027-12-28", label: "Additional public holiday for Boxing Day" }
    ],
    NT: [
      { date: "2026-01-01", label: "New Year's Day" },
      { date: "2026-01-26", label: "Australia Day" },
      { date: "2026-04-03", label: "Good Friday" },
      { date: "2026-04-04", label: "Easter Saturday" },
      { date: "2026-04-05", label: "Easter Sunday" },
      { date: "2026-04-06", label: "Easter Monday" },
      { date: "2026-04-25", label: "Anzac Day" },
      { date: "2026-05-04", label: "May Day" },
      { date: "2026-06-08", label: "King's Birthday" },
      { date: "2026-08-03", label: "Picnic Day" },
      { date: "2026-12-24", label: "Christmas Eve", startMinute: 19 * 60, endMinute: 24 * 60 },
      { date: "2026-12-25", label: "Christmas Day" },
      { date: "2026-12-26", label: "Boxing Day" },
      { date: "2026-12-28", label: "Additional public holiday for Boxing Day" },
      { date: "2026-12-31", label: "New Year's Eve", startMinute: 19 * 60, endMinute: 24 * 60 },
      { date: "2027-01-01", label: "New Year's Day" },
      { date: "2027-01-26", label: "Australia Day" },
      { date: "2027-03-26", label: "Good Friday" },
      { date: "2027-03-27", label: "Easter Saturday" },
      { date: "2027-03-28", label: "Easter Sunday" },
      { date: "2027-03-29", label: "Easter Monday" },
      { date: "2027-04-26", label: "Anzac Day" },
      { date: "2027-05-03", label: "May Day" },
      { date: "2027-06-14", label: "King's Birthday" },
      { date: "2027-08-02", label: "Picnic Day" },
      { date: "2027-12-24", label: "Christmas Eve", startMinute: 19 * 60, endMinute: 24 * 60 },
      { date: "2027-12-25", label: "Christmas Day" },
      { date: "2027-12-26", label: "Boxing Day" },
      { date: "2027-12-27", label: "Additional public holiday for Christmas Day" },
      { date: "2027-12-28", label: "Additional public holiday for Boxing Day" },
      { date: "2027-12-31", label: "New Year's Eve", startMinute: 19 * 60, endMinute: 24 * 60 }
    ],
    QLD: [
      { date: "2026-01-01", label: "New Year's Day" },
      { date: "2026-01-26", label: "Australia Day" },
      { date: "2026-04-03", label: "Good Friday" },
      { date: "2026-04-04", label: "The day after Good Friday" },
      { date: "2026-04-05", label: "Easter Sunday" },
      { date: "2026-04-06", label: "Easter Monday" },
      { date: "2026-04-25", label: "Anzac Day" },
      { date: "2026-05-04", label: "Labour Day" },
      { date: "2026-10-05", label: "King's Birthday" },
      { date: "2026-12-24", label: "Christmas Eve", startMinute: 18 * 60, endMinute: 24 * 60 },
      { date: "2026-12-25", label: "Christmas Day" },
      { date: "2026-12-26", label: "Boxing Day" },
      { date: "2026-12-28", label: "Additional public holiday for Boxing Day" },
      { date: "2027-01-01", label: "New Year's Day" },
      { date: "2027-01-26", label: "Australia Day" },
      { date: "2027-03-26", label: "Good Friday" },
      { date: "2027-03-27", label: "The day after Good Friday" },
      { date: "2027-03-28", label: "Easter Sunday" },
      { date: "2027-03-29", label: "Easter Monday" },
      { date: "2027-04-26", label: "Anzac Day" },
      { date: "2027-05-03", label: "Labour Day" },
      { date: "2027-10-04", label: "King's Birthday" },
      { date: "2027-12-24", label: "Christmas Eve", startMinute: 18 * 60, endMinute: 24 * 60 },
      { date: "2027-12-25", label: "Christmas Day" },
      { date: "2027-12-26", label: "Boxing Day" },
      { date: "2027-12-27", label: "Additional public holiday for Christmas Day" },
      { date: "2027-12-28", label: "Additional public holiday for Boxing Day" }
    ],
    SA: [
      { date: "2026-01-01", label: "New Year's Day" },
      { date: "2026-01-26", label: "Australia Day" },
      { date: "2026-03-09", label: "Adelaide Cup Day" },
      { date: "2026-04-03", label: "Good Friday" },
      { date: "2026-04-04", label: "Easter Saturday" },
      { date: "2026-04-05", label: "Easter Sunday" },
      { date: "2026-04-06", label: "Easter Monday" },
      { date: "2026-04-25", label: "Anzac Day" },
      { date: "2026-06-08", label: "King's Birthday" },
      { date: "2026-10-05", label: "Labour Day" },
      { date: "2026-12-24", label: "Christmas Eve", startMinute: 19 * 60, endMinute: 24 * 60 },
      { date: "2026-12-25", label: "Christmas Day" },
      { date: "2026-12-26", label: "Proclamation Day holiday" },
      { date: "2026-12-28", label: "Additional public holiday for Proclamation Day holiday" },
      { date: "2026-12-31", label: "New Year's Eve", startMinute: 19 * 60, endMinute: 24 * 60 },
      { date: "2027-01-01", label: "New Year's Day" },
      { date: "2027-01-26", label: "Australia Day" },
      { date: "2027-03-08", label: "Adelaide Cup Day" },
      { date: "2027-03-26", label: "Good Friday" },
      { date: "2027-03-27", label: "Easter Saturday" },
      { date: "2027-03-28", label: "Easter Sunday" },
      { date: "2027-03-29", label: "Easter Monday" },
      { date: "2027-04-25", label: "Anzac Day" },
      { date: "2027-06-14", label: "King's Birthday" },
      { date: "2027-10-04", label: "Labour Day" },
      { date: "2027-12-24", label: "Christmas Eve", startMinute: 19 * 60, endMinute: 24 * 60 },
      { date: "2027-12-25", label: "Christmas Day" },
      { date: "2027-12-26", label: "Proclamation Day holiday" },
      { date: "2027-12-27", label: "Additional public holiday for Christmas Day" },
      { date: "2027-12-28", label: "Additional public holiday for Proclamation Day holiday" },
      { date: "2027-12-31", label: "New Year's Eve", startMinute: 19 * 60, endMinute: 24 * 60 }
    ],
    TAS: [
      { date: "2026-01-01", label: "New Year's Day" },
      { date: "2026-01-26", label: "Australia Day" },
      { date: "2026-03-09", label: "Eight Hours Day" },
      { date: "2026-04-03", label: "Good Friday" },
      { date: "2026-04-06", label: "Easter Monday" },
      { date: "2026-04-25", label: "Anzac Day" },
      { date: "2026-06-08", label: "King's Birthday" },
      { date: "2026-12-25", label: "Christmas Day" },
      { date: "2026-12-28", label: "Boxing Day" },
      { date: "2027-01-01", label: "New Year's Day" },
      { date: "2027-01-26", label: "Australia Day" },
      { date: "2027-03-08", label: "Eight Hours Day" },
      { date: "2027-03-26", label: "Good Friday" },
      { date: "2027-03-29", label: "Easter Monday" },
      { date: "2027-04-25", label: "Anzac Day" },
      { date: "2027-06-14", label: "King's Birthday" },
      { date: "2027-12-25", label: "Christmas Day" },
      { date: "2027-12-27", label: "Additional public holiday for Christmas Day" },
      { date: "2027-12-28", label: "Boxing Day" }
    ],
    VIC: [
      { date: "2026-01-01", label: "New Year's Day" },
      { date: "2026-01-26", label: "Australia Day" },
      { date: "2026-03-09", label: "Labour Day" },
      { date: "2026-04-03", label: "Good Friday" },
      { date: "2026-04-04", label: "Saturday before Easter Sunday" },
      { date: "2026-04-05", label: "Easter Sunday" },
      { date: "2026-04-06", label: "Easter Monday" },
      { date: "2026-04-25", label: "Anzac Day" },
      { date: "2026-06-08", label: "King's Birthday" },
      { date: "2026-11-03", label: "Melbourne Cup" },
      { date: "2026-12-25", label: "Christmas Day" },
      { date: "2026-12-26", label: "Boxing Day" },
      { date: "2026-12-28", label: "Additional public holiday for Boxing Day" },
      { date: "2027-01-01", label: "New Year's Day" },
      { date: "2027-01-26", label: "Australia Day" },
      { date: "2027-03-08", label: "Labour Day" },
      { date: "2027-03-26", label: "Good Friday" },
      { date: "2027-03-27", label: "Saturday before Easter Sunday" },
      { date: "2027-03-28", label: "Easter Sunday" },
      { date: "2027-03-29", label: "Easter Monday" },
      { date: "2027-04-25", label: "Anzac Day" },
      { date: "2027-06-14", label: "King's Birthday" },
      { date: "2027-11-02", label: "Melbourne Cup" },
      { date: "2027-12-25", label: "Christmas Day" },
      { date: "2027-12-26", label: "Boxing Day" },
      { date: "2027-12-27", label: "Additional public holiday for Christmas Day" },
      { date: "2027-12-28", label: "Additional public holiday for Boxing Day" }
    ],
    WA: [
      { date: "2026-01-01", label: "New Year's Day" },
      { date: "2026-01-26", label: "Australia Day" },
      { date: "2026-03-02", label: "Labour Day" },
      { date: "2026-04-03", label: "Good Friday" },
      { date: "2026-04-05", label: "Easter Sunday" },
      { date: "2026-04-06", label: "Easter Monday" },
      { date: "2026-04-25", label: "Anzac Day" },
      { date: "2026-04-27", label: "Additional public holiday for Anzac Day" },
      { date: "2026-06-01", label: "Western Australia Day" },
      { date: "2026-09-28", label: "King's Birthday" },
      { date: "2026-12-25", label: "Christmas Day" },
      { date: "2026-12-26", label: "Boxing Day" },
      { date: "2026-12-28", label: "Additional public holiday for Boxing Day" },
      { date: "2027-01-01", label: "New Year's Day" },
      { date: "2027-01-26", label: "Australia Day" },
      { date: "2027-03-01", label: "Labour Day" },
      { date: "2027-03-26", label: "Good Friday" },
      { date: "2027-03-28", label: "Easter Sunday" },
      { date: "2027-03-29", label: "Easter Monday" },
      { date: "2027-04-25", label: "Anzac Day" },
      { date: "2027-04-26", label: "Additional public holiday for Anzac Day" },
      { date: "2027-06-07", label: "Western Australia Day" },
      { date: "2027-09-27", label: "King's Birthday" },
      { date: "2027-12-25", label: "Christmas Day" },
      { date: "2027-12-26", label: "Boxing Day" },
      { date: "2027-12-27", label: "Additional public holiday for Christmas Day" },
      { date: "2027-12-28", label: "Additional public holiday for Boxing Day" }
    ]
  };
  const OFFICIAL_HOLIDAY_NOTES = {
    ACT: [],
    NSW: ["Regional public holidays still need to be added manually if they apply to your workplace."],
    NT: ["Part-day public holidays for Christmas Eve and New Year's Eve are loaded from 7:00 pm to midnight.", "Regional show days still need to be added manually if they apply."],
    QLD: ["Part-day public holiday for Christmas Eve is loaded from 6:00 pm to midnight.", "City and regional holidays like the Brisbane Ekka are not auto-loaded and can be added manually if needed."],
    SA: ["Part-day public holidays for Christmas Eve and New Year's Eve are loaded from 7:00 pm to midnight."],
    TAS: ["Only state-wide holidays are auto-loaded. Regional and public-service-only holidays can be added manually if needed."],
    VIC: ["The statewide Friday before the AFL Grand Final is not auto-loaded because Fair Work still lists the official date as TBC for 2026 and 2027.", "Regional substitute holidays can still be added manually if your workplace observes them."],
    WA: ["The King's Birthday date loaded here is the state-wide date from Fair Work. Some regional WA areas use a different date and can be added manually."]
  };

  function createDefaultSettings() {
    const today = getTodayKey();

    return {
      jobLabel: "My job",
      awardName: "",
      awardCode: "",
      classification: "",
      employmentType: "casual",
      workState: "NSW",
      rateDate: today,
      payFrequency: "fortnightly",
      cycleAnchor: today,
      taxResidency: "resident",
      includeMedicare: true,
      hasTFN: true,
      windows: {
        eveningStart: "19:00",
        overnightStart: "00:00",
        dayStart: "07:00"
      },
      rates: {
        weekday: { day: "", evening: "", overnight: "" },
        saturday: { day: "", evening: "", overnight: "" },
        sunday: { day: "", evening: "", overnight: "" },
        publicHoliday: { day: "", evening: "", overnight: "" }
      },
      awardNotes: ""
    };
  }

  function buildBaseUsername(value) {
    const cleaned = String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");

    return cleaned || "profile";
  }

  function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  function normalizePin(pin) {
    return String(pin || "").replace(/\D/g, "");
  }

  function loadSavedGoogleClientId() {
    try {
      return String(global.localStorage?.getItem(GOOGLE_CLIENT_ID_STORAGE_KEY) || "").trim();
    } catch (error) {
      return "";
    }
  }

  function saveGoogleClientId(value) {
    const normalized = String(value || "").trim();

    try {
      if (normalized) {
        global.localStorage?.setItem(GOOGLE_CLIENT_ID_STORAGE_KEY, normalized);
      } else {
        global.localStorage?.removeItem(GOOGLE_CLIENT_ID_STORAGE_KEY);
      }
    } catch (error) {
      // Ignore localStorage write issues and keep the in-memory flow working.
    }

    return normalized;
  }

  function getEmbeddedGoogleClientId() {
    if (typeof document === "undefined") {
      return "";
    }

    const fromMeta = document.querySelector('meta[name="google-oauth-client-id"]')?.getAttribute("content") || "";
    const fromGlobal = typeof global.SHIFTWISE_GOOGLE_CLIENT_ID === "string" ? global.SHIFTWISE_GOOGLE_CLIENT_ID : "";
    return String(fromGlobal || fromMeta).trim();
  }

  function getGoogleClientId() {
    return getEmbeddedGoogleClientId() || loadSavedGoogleClientId();
  }

  function createDefaultGoogleProfile() {
    return {
      email: "",
      syncEmail: "",
      displayName: "",
      sub: "",
      calendarId: "",
      calendarSummary: "",
      lastSyncedAt: ""
    };
  }

  function mergeGoogleProfile(rawGoogle) {
    const base = createDefaultGoogleProfile();

    return {
      ...base,
      ...(rawGoogle || {}),
      email: normalizeEmail(rawGoogle?.email || ""),
      syncEmail: normalizeEmail(rawGoogle?.syncEmail || rawGoogle?.email || ""),
      displayName: String(rawGoogle?.displayName || "").trim(),
      sub: String(rawGoogle?.sub || "").trim(),
      calendarId: String(rawGoogle?.calendarId || "").trim(),
      calendarSummary: String(rawGoogle?.calendarSummary || "").trim(),
      lastSyncedAt: String(rawGoogle?.lastSyncedAt || "").trim()
    };
  }

  function createDefaultLogin(name = "Primary profile") {
    const preferredName = name === "Primary profile" ? "primary" : name;

    return {
      email: "",
      username: buildBaseUsername(preferredName),
      pin: ""
    };
  }

  function createDefaultProfile(name = "Primary profile") {
    return {
      id: createId("profile"),
      name,
      login: createDefaultLogin(name),
      google: createDefaultGoogleProfile(),
      activeCalendarMonth: getTodayKey().slice(0, 7),
      settings: createDefaultSettings(),
      holidays: [],
      shifts: [],
      expenses: [],
      subscriptions: [],
      savingsGoals: [],
      debts: []
    };
  }

  function createDefaultState() {
    const profile = createDefaultProfile();

    return {
      activeTab: "dashboard",
      activeSalaryView: "overview",
      theme: "light",
      activeProfileId: profile.id,
      profiles: [profile],
      activeCalendarMonth: profile.activeCalendarMonth,
      settings: profile.settings,
      holidays: profile.holidays,
      shifts: profile.shifts,
      expenses: profile.expenses,
      subscriptions: profile.subscriptions,
      savingsGoals: profile.savingsGoals,
      debts: profile.debts
    };
  }

  function getTodayKey() {
    return toDateKey(new Date());
  }

  function createId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function roundCurrency(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  }

  function formatCurrency(value) {
    return CURRENCY_FORMATTER.format(Number.isFinite(value) ? value : 0);
  }

  function formatHours(hours) {
    return `${hours.toFixed(2)} hrs`;
  }

  function formatDate(dateKey) {
    return DATE_FORMATTER.format(parseDateKey(dateKey));
  }

  function formatDateTimeValue(value) {
    const date = value instanceof Date ? value : new Date(value);

    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return "";
    }

    return `${DATE_FORMATTER.format(date)} ${TIME_FORMATTER.format(date)}`;
  }

  function formatShortDate(dateKey) {
    return SHORT_DATE_FORMATTER.format(parseDateKey(dateKey));
  }

  function parseDateKey(dateKey) {
    const [year, month, day] = String(dateKey || "").split("-").map(Number);
    return new Date(year, (month || 1) - 1, day || 1, 12, 0, 0, 0);
  }

  function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function addDays(date, days) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  function getMonthKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  function parseMonthKey(monthKey) {
    const [year, month] = String(monthKey || "").split("-").map(Number);
    return new Date(year, (month || 1) - 1, 1, 12, 0, 0, 0);
  }

  function addMonths(date, months) {
    return new Date(date.getFullYear(), date.getMonth() + months, 1, 12, 0, 0, 0);
  }

  function compareDateKeys(left, right) {
    return parseDateKey(left).getTime() - parseDateKey(right).getTime();
  }

  function daysBetween(startKey, endKey) {
    const start = parseDateKey(startKey).getTime();
    const end = parseDateKey(endKey).getTime();
    return Math.round((end - start) / DAY_MS);
  }

  function parseTimeToMinutes(value) {
    if (value === "24:00") {
      return 24 * 60;
    }

    const [hours, minutes] = String(value || "00:00").split(":").map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  }

  function minutesToTimeValue(totalMinutes) {
    if (totalMinutes >= 24 * 60) {
      return "24:00";
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  function formatTimeMinutes(totalMinutes) {
    const safeMinutes = totalMinutes >= 24 * 60 ? 0 : totalMinutes;
    const hours = Math.floor(safeMinutes / 60);
    const minutes = safeMinutes % 60;

    return TIME_FORMATTER.format(new Date(2000, 0, 1, hours, minutes, 0, 0));
  }

  function toNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function normalizeHoliday(rawHoliday) {
    const startMinute = Number.isFinite(rawHoliday?.startMinute)
      ? rawHoliday.startMinute
      : (rawHoliday?.startTime ? parseTimeToMinutes(rawHoliday.startTime) : 0);
    const endMinute = Number.isFinite(rawHoliday?.endMinute)
      ? rawHoliday.endMinute
      : (rawHoliday?.endTime ? parseTimeToMinutes(rawHoliday.endTime) : 24 * 60);

    return {
      id: rawHoliday?.id || createId("holiday"),
      date: rawHoliday?.date || getTodayKey(),
      label: rawHoliday?.label || "Public holiday",
      startMinute,
      endMinute,
      source: rawHoliday?.source || "manual",
      state: rawHoliday?.state || "",
      notes: rawHoliday?.notes || "",
      isOfficial: rawHoliday?.isOfficial === true || rawHoliday?.source === "official"
    };
  }

  function normalizeHolidays(rawHolidays) {
    return Array.isArray(rawHolidays) ? rawHolidays.map((holiday) => normalizeHoliday(holiday)) : [];
  }

  function dedupeHolidays(holidays) {
    const seen = new Set();

    return holidays.filter((holiday) => {
      const key = [holiday.date, holiday.label, holiday.startMinute, holiday.endMinute].join("|");

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }

  function mergeSettings(rawSettings) {
    const base = createDefaultSettings();
    const mergedWindows = {
      ...base.windows,
      ...(rawSettings?.windows || {})
    };

    if (mergedWindows.eveningStart === "20:00") {
      mergedWindows.eveningStart = "19:00";
    }

    if (mergedWindows.dayStart === "06:00") {
      mergedWindows.dayStart = "07:00";
    }

    return {
      ...base,
      ...(rawSettings || {}),
      windows: mergedWindows,
      rates: mergeRates(rawSettings?.rates)
    };
  }

  function mergeProfile(rawProfile, fallbackName = "Profile") {
    const base = createDefaultProfile(fallbackName);

    return {
      id: rawProfile?.id || base.id,
      name: rawProfile?.name || fallbackName,
      login: mergeLogin(rawProfile?.login, rawProfile?.name || fallbackName),
      google: mergeGoogleProfile(rawProfile?.google),
      activeCalendarMonth: rawProfile?.activeCalendarMonth || base.activeCalendarMonth,
      settings: mergeSettings(rawProfile?.settings),
      holidays: dedupeHolidays(normalizeHolidays(rawProfile?.holidays)).sort((left, right) => {
        const byDate = compareDateKeys(left.date, right.date);
        return byDate || left.startMinute - right.startMinute;
      }),
      shifts: Array.isArray(rawProfile?.shifts) ? rawProfile.shifts : [],
      expenses: Array.isArray(rawProfile?.expenses) ? rawProfile.expenses : [],
      subscriptions: Array.isArray(rawProfile?.subscriptions) ? rawProfile.subscriptions : [],
      savingsGoals: Array.isArray(rawProfile?.savingsGoals) ? rawProfile.savingsGoals : [],
      debts: Array.isArray(rawProfile?.debts) ? rawProfile.debts : []
    };
  }

  function getActiveProfileRecord(state) {
    return state.profiles.find((profile) => profile.id === state.activeProfileId) || state.profiles[0] || null;
  }

  function hydrateStateFromProfile(state, profile) {
    const activeProfile = profile || getActiveProfileRecord(state) || createDefaultProfile();

    state.activeProfileId = activeProfile.id;
    state.activeCalendarMonth = activeProfile.activeCalendarMonth;
    state.settings = activeProfile.settings;
    state.holidays = activeProfile.holidays;
    state.shifts = activeProfile.shifts;
    state.expenses = activeProfile.expenses;
    state.subscriptions = activeProfile.subscriptions;
    state.savingsGoals = activeProfile.savingsGoals;
    state.debts = activeProfile.debts;

    return state;
  }

  function syncActiveProfileFromTopLevel(state) {
    const profile = getActiveProfileRecord(state);

    if (!profile) {
      return state;
    }

    profile.activeCalendarMonth = state.activeCalendarMonth;
    profile.settings = state.settings;
    profile.holidays = state.holidays;
    profile.shifts = state.shifts;
    profile.expenses = state.expenses;
    profile.subscriptions = state.subscriptions;
    profile.savingsGoals = state.savingsGoals;
    profile.debts = state.debts;

    return state;
  }

  function serializeState(state) {
    syncActiveProfileFromTopLevel(state);

    return {
      activeTab: state.activeTab,
      activeSalaryView: state.activeSalaryView,
      theme: normalizeTheme(state.theme),
      activeProfileId: state.activeProfileId,
      profiles: state.profiles
    };
  }

  function createUniqueProfileName(name, profiles) {
    const cleaned = String(name || "").trim().replace(/\s+/g, " ");

    if (!cleaned) {
      return "";
    }

    const existingNames = new Set(profiles.map((profile) => profile.name.toLowerCase()));

    if (!existingNames.has(cleaned.toLowerCase())) {
      return cleaned;
    }

    let counter = 2;

    while (existingNames.has(`${cleaned} ${counter}`.toLowerCase())) {
      counter += 1;
    }

    return `${cleaned} ${counter}`;
  }

  function createUniqueUsername(username, profiles, excludeProfileId = "") {
    const base = buildBaseUsername(username);
    const existing = new Set(
      profiles
        .filter((profile) => profile.id !== excludeProfileId)
        .map((profile) => buildBaseUsername(profile?.login?.username || profile?.name))
    );
    let candidate = base;
    let counter = 2;

    while (existing.has(candidate)) {
      candidate = `${base}${counter}`;
      counter += 1;
    }

    return candidate;
  }

  function mergeLogin(rawLogin, profileName) {
    const base = createDefaultLogin(profileName);

    return {
      email: normalizeEmail(rawLogin?.email || ""),
      username: buildBaseUsername(rawLogin?.username || base.username),
      pin: normalizePin(rawLogin?.pin || "")
    };
  }

  function ensureUniqueProfileLogins(profiles) {
    const usedEmails = new Set();
    const usedUsernames = new Set();
    const usedPins = new Set();

    profiles.forEach((profile, index) => {
      const login = mergeLogin(profile.login, profile.name || `Profile ${index + 1}`);
      const email = login.email && !usedEmails.has(login.email) ? login.email : "";
      const baseUsername = buildBaseUsername(login.username || profile.name || `profile${index + 1}`);
      let username = baseUsername;
      let counter = 2;

      if (email) {
        usedEmails.add(email);
      }

      while (usedUsernames.has(username)) {
        username = `${baseUsername}${counter}`;
        counter += 1;
      }

      usedUsernames.add(username);

      const pin = login.pin && !usedPins.has(login.pin) ? login.pin : "";

      if (pin) {
        usedPins.add(pin);
      }

      profile.login = {
        email,
        username,
        pin
      };
    });

    return profiles;
  }

  function findProfileByCredential(credential, profiles) {
    const trimmed = String(credential || "").trim();
    const email = normalizeEmail(trimmed);
    const username = buildBaseUsername(trimmed);
    const pin = normalizePin(trimmed);
    const allowedProfiles = profiles.filter((profile) => normalizeEmail(profile.login?.email || ""));
    const emailMatches = email ? allowedProfiles.filter((profile) => normalizeEmail(profile.login?.email || "") === email) : [];

    if (emailMatches.length === 1) {
      return { profile: emailMatches[0], error: "" };
    }

    if (emailMatches.length > 1) {
      return { profile: null, error: "That email matches more than one local account. Use a PIN instead." };
    }

    const usernameMatches = allowedProfiles.filter((profile) => profile.login?.username === username);

    if (usernameMatches.length === 1) {
      return { profile: usernameMatches[0], error: "" };
    }

    if (pin) {
      const pinMatches = allowedProfiles.filter((profile) => profile.login?.pin && profile.login.pin === pin);

      if (pinMatches.length === 1) {
        return { profile: pinMatches[0], error: "" };
      }

      if (pinMatches.length > 1) {
        return { profile: null, error: "That PIN matches more than one local account. Use a username instead." };
      }
    }

    if (allowedProfiles.length === 0) {
      return { profile: null, error: "No approved users have been added yet. Set up the first email in the separate admin panel." };
    }

    return { profile: null, error: "No approved account matched that email, username, or PIN." };
  }

  function findProfileByGoogleIdentity(identity, profiles) {
    const sub = String(identity?.sub || "").trim();
    const email = normalizeEmail(identity?.email || "");

    if (sub) {
      const bySub = profiles.find((profile) => String(profile?.google?.sub || "").trim() === sub);

      if (bySub) {
        return bySub;
      }
    }

    if (!email) {
      return null;
    }

    return profiles.find((profile) => {
      const googleEmail = normalizeEmail(profile?.google?.email || "");
      const syncEmail = normalizeEmail(profile?.google?.syncEmail || "");
      return googleEmail === email || syncEmail === email;
    }) || null;
  }

  function normalizeTheme(theme) {
    return theme === "dark" ? "dark" : "light";
  }

  function parseDateTime(dateKey, time) {
    const base = parseDateKey(dateKey);
    const [hours, minutes] = String(time || "00:00").split(":").map(Number);
    return new Date(base.getFullYear(), base.getMonth(), base.getDate(), hours || 0, minutes || 0, 0, 0);
  }

  function mergeRates(rawRates) {
    const base = createDefaultSettings().rates;
    const merged = {};

    Object.keys(base).forEach((dayType) => {
      merged[dayType] = {
        day: rawRates?.[dayType]?.day ?? "",
        evening: rawRates?.[dayType]?.evening ?? "",
        overnight: rawRates?.[dayType]?.overnight ?? ""
      };
    });

    return merged;
  }

  function mergeState(rawState) {
    const base = createDefaultState();
    const hasProfiles = Array.isArray(rawState?.profiles) && rawState.profiles.length > 0;
    const profiles = hasProfiles
      ? rawState.profiles.map((profile, index) => mergeProfile(profile, profile?.name || `Profile ${index + 1}`))
      : [mergeProfile({
          name: "Primary profile",
          activeCalendarMonth: rawState?.activeCalendarMonth,
          settings: rawState?.settings,
          holidays: rawState?.holidays,
          shifts: rawState?.shifts,
          expenses: rawState?.expenses,
          subscriptions: rawState?.subscriptions,
          savingsGoals: rawState?.savingsGoals,
          debts: rawState?.debts
        }, "Primary profile")];
    ensureUniqueProfileLogins(profiles);
    const activeProfileId = profiles.some((profile) => profile.id === rawState?.activeProfileId)
      ? rawState.activeProfileId
      : profiles[0].id;
    const activeTab = rawState?.activeSalaryView == null && rawState?.activeTab === "salary"
      ? base.activeTab
      : (rawState?.activeTab || base.activeTab);
    const merged = {
      ...base,
      activeTab,
      activeSalaryView: rawState?.activeSalaryView || base.activeSalaryView,
      theme: normalizeTheme(rawState?.theme || base.theme),
      activeProfileId,
      profiles
    };

    return hydrateStateFromProfile(merged, profiles.find((profile) => profile.id === activeProfileId) || profiles[0]);
  }

  function loadState() {
    try {
      const raw = global.localStorage?.getItem(STORAGE_KEY);
      return raw ? mergeState(JSON.parse(raw)) : createDefaultState();
    } catch (error) {
      return createDefaultState();
    }
  }

  function saveState(state) {
    global.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function isMinuteInRange(minute, start, end) {
    if (start === end) {
      return false;
    }

    if (start < end) {
      return minute >= start && minute < end;
    }

    return minute >= start || minute < end;
  }

  function getShiftBand(minuteOfDay, settings) {
    const eveningStart = parseTimeToMinutes(settings.windows.eveningStart);
    const overnightStart = parseTimeToMinutes(settings.windows.overnightStart);
    const dayStart = parseTimeToMinutes(settings.windows.dayStart);

    if (isMinuteInRange(minuteOfDay, overnightStart, dayStart)) {
      return "overnight";
    }

    if (isMinuteInRange(minuteOfDay, eveningStart, overnightStart)) {
      return "evening";
    }

    return "day";
  }

  function getHolidayMatch(date, holidays) {
    const dateKey = toDateKey(date);
    const minuteOfDay = date.getHours() * 60 + date.getMinutes();

    return holidays.find((holiday) => {
      return holiday.date === dateKey && minuteOfDay >= holiday.startMinute && minuteOfDay < holiday.endMinute;
    }) || null;
  }

  function getDayType(date, holidays) {
    if (getHolidayMatch(date, holidays)) {
      return "publicHoliday";
    }

    const weekday = date.getDay();

    if (weekday === 6) {
      return "saturday";
    }

    if (weekday === 0) {
      return "sunday";
    }

    return "weekday";
  }

  function getRate(settings, dayType, band) {
    const dayRates = settings.rates[dayType] || {};
    const directRate = toNumber(dayRates[band]);
    const fallbackRate = toNumber(dayRates.day);
    const weekdayFallback = toNumber(settings.rates.weekday.day);

    if (directRate > 0) {
      return directRate;
    }

    if (fallbackRate > 0) {
      return fallbackRate;
    }

    return weekdayFallback;
  }

  function getShiftEndDateTime(shift) {
    const start = parseDateTime(shift.date, shift.startTime);
    let end = parseDateTime(shift.date, shift.endTime);

    if (end <= start) {
      end = addDays(end, 1);
    }

    return end;
  }

  function calculateShift(shift, settings, holidays) {
    const start = parseDateTime(shift.date, shift.startTime);
    const end = getShiftEndDateTime(shift);
    const totalMinutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
    const breakMinutes = Math.min(Math.max(0, Math.round(toNumber(shift.breakMinutes))), totalMinutes);
    const paidRatio = totalMinutes > 0 ? (totalMinutes - breakMinutes) / totalMinutes : 0;
    const segmentsByKey = new Map();

    for (let minute = 0; minute < totalMinutes; minute += 1) {
      const currentTime = new Date(start.getTime() + minute * 60000);
      const dateKey = toDateKey(currentTime);
      const minuteOfDay = currentTime.getHours() * 60 + currentTime.getMinutes();
      const holidayMatch = getHolidayMatch(currentTime, holidays);
      const dayType = getDayType(currentTime, holidays);
      const band = getShiftBand(minuteOfDay, settings);
      const rate = getRate(settings, dayType, band);
      const segmentKey = `${dateKey}|${dayType}|${band}|${rate.toFixed(4)}`;
      let segment = segmentsByKey.get(segmentKey);

      if (!segment) {
        segment = {
          key: segmentKey,
          dateKey,
          dayType,
          band,
          rate,
          holidayLabel: holidayMatch?.label || "",
          rawMinutes: 0,
          startTime: currentTime.getTime(),
          endTime: currentTime.getTime() + 60000
        };
        segmentsByKey.set(segmentKey, segment);
      }

      segment.rawMinutes += 1;
      segment.endTime = currentTime.getTime() + 60000;
    }

    const segments = Array.from(segmentsByKey.values())
      .sort((left, right) => left.startTime - right.startTime)
      .map((segment) => {
        const paidMinutes = segment.rawMinutes * paidRatio;
        const pay = (paidMinutes / 60) * segment.rate;

        return {
          ...segment,
          paidMinutes,
          pay
        };
      });

    const grossPay = roundCurrency(segments.reduce((total, segment) => total + segment.pay, 0));
    const publicHolidayMinutes = segments
      .filter((segment) => segment.dayType === "publicHoliday")
      .reduce((total, segment) => total + segment.paidMinutes, 0);

    return {
      grossPay,
      breakMinutes,
      totalMinutes,
      paidMinutes: totalMinutes - breakMinutes,
      publicHolidayMinutes,
      isOvernight: toDateKey(end) !== shift.date,
      endDate: toDateKey(end),
      segments
    };
  }

  function buildMonthlyAnchor(year, monthIndex, anchorDay) {
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    const day = Math.min(anchorDay, lastDay);
    return new Date(year, monthIndex, day, 12, 0, 0, 0);
  }

  function getPayPeriod(dateKey, settings) {
    const frequency = settings.payFrequency || "fortnightly";
    const anchorKey = settings.cycleAnchor || getTodayKey();

    if (frequency === "monthly") {
      const anchor = parseDateKey(anchorKey);
      const target = parseDateKey(dateKey);
      let start = buildMonthlyAnchor(target.getFullYear(), target.getMonth(), anchor.getDate());

      if (start.getTime() > target.getTime()) {
        const previousMonth = target.getMonth() === 0
          ? { year: target.getFullYear() - 1, month: 11 }
          : { year: target.getFullYear(), month: target.getMonth() - 1 };

        start = buildMonthlyAnchor(previousMonth.year, previousMonth.month, anchor.getDate());
      }

      const nextMonth = start.getMonth() === 11
        ? { year: start.getFullYear() + 1, month: 0 }
        : { year: start.getFullYear(), month: start.getMonth() + 1 };
      const next = buildMonthlyAnchor(nextMonth.year, nextMonth.month, anchor.getDate());
      const end = addDays(next, -1);

      return {
        key: toDateKey(start),
        startKey: toDateKey(start),
        endKey: toDateKey(end),
        frequency
      };
    }

    const span = frequency === "weekly" ? 7 : 14;
    const difference = daysBetween(anchorKey, dateKey);
    const periodIndex = Math.floor(difference / span);
    const start = addDays(parseDateKey(anchorKey), periodIndex * span);
    const end = addDays(start, span - 1);

    return {
      key: toDateKey(start),
      startKey: toDateKey(start),
      endKey: toDateKey(end),
      frequency
    };
  }

  function calculateAnnualTax(annualIncome, settings) {
    if (annualIncome <= 0) {
      return 0;
    }

    if (!settings.hasTFN) {
      const noTFNRate = settings.taxResidency === "resident" ? 0.47 : 0.45;
      return annualIncome * noTFNRate;
    }

    let tax = 0;

    if (settings.taxResidency === "resident") {
      if (annualIncome <= 18200) {
        tax = 0;
      } else if (annualIncome <= 45000) {
        tax = (annualIncome - 18200) * 0.16;
      } else if (annualIncome <= 135000) {
        tax = 4288 + (annualIncome - 45000) * 0.3;
      } else if (annualIncome <= 190000) {
        tax = 31288 + (annualIncome - 135000) * 0.37;
      } else {
        tax = 51638 + (annualIncome - 190000) * 0.45;
      }

      if (settings.includeMedicare) {
        tax += annualIncome * 0.02;
      }
    } else if (settings.taxResidency === "foreignResident") {
      if (annualIncome <= 135000) {
        tax = annualIncome * 0.3;
      } else if (annualIncome <= 190000) {
        tax = 40500 + (annualIncome - 135000) * 0.37;
      } else {
        tax = 60850 + (annualIncome - 190000) * 0.45;
      }
    } else {
      if (annualIncome <= 45000) {
        tax = annualIncome * 0.15;
      } else if (annualIncome <= 135000) {
        tax = 6750 + (annualIncome - 45000) * 0.3;
      } else if (annualIncome <= 190000) {
        tax = 33750 + (annualIncome - 135000) * 0.37;
      } else {
        tax = 54100 + (annualIncome - 190000) * 0.45;
      }
    }

    return tax;
  }

  function estimatePay(grossPay, settings) {
    const multiplier = PAY_MULTIPLIERS[settings.payFrequency] || PAY_MULTIPLIERS.fortnightly;
    const annualisedIncome = grossPay * multiplier;
    const annualTax = calculateAnnualTax(annualisedIncome, settings);
    const periodTax = grossPay > 0 ? annualTax / multiplier : 0;

    return {
      annualisedIncome: roundCurrency(annualisedIncome),
      annualTax: roundCurrency(annualTax),
      periodTax: roundCurrency(periodTax),
      netPay: roundCurrency(grossPay - periodTax)
    };
  }

  function buildPayPeriods(shifts, settings, holidays) {
    const periods = new Map();

    shifts.forEach((shift) => {
      const period = getPayPeriod(shift.date, settings);
      const payData = calculateShift(shift, settings, holidays);
      let bucket = periods.get(period.key);

      if (!bucket) {
        bucket = {
          ...period,
          grossPay: 0,
          paidMinutes: 0,
          shiftCount: 0
        };
        periods.set(period.key, bucket);
      }

      bucket.grossPay += payData.grossPay;
      bucket.paidMinutes += payData.paidMinutes;
      bucket.shiftCount += 1;
    });

    return Array.from(periods.values())
      .map((period) => {
        const roundedGross = roundCurrency(period.grossPay);
        const estimate = estimatePay(roundedGross, settings);

        return {
          ...period,
          grossPay: roundedGross,
          paidHours: period.paidMinutes / 60,
          tax: estimate.periodTax,
          netPay: estimate.netPay,
          annualisedIncome: estimate.annualisedIncome
        };
      })
      .sort((left, right) => compareDateKeys(right.startKey, left.startKey));
  }

  function getMonthlyEquivalent(subscription) {
    const amount = toNumber(subscription.amount);
    const frequency = subscription.frequency;

    if (frequency === "weekly") {
      return (amount * 52) / 12;
    }

    if (frequency === "fortnightly") {
      return (amount * 26) / 12;
    }

    if (frequency === "monthly") {
      return amount;
    }

    if (frequency === "quarterly") {
      return amount / 3;
    }

    return amount / 12;
  }

  function getYearlyEquivalent(subscription) {
    return getMonthlyEquivalent(subscription) * 12;
  }

  function summarizeExpenses(expenses) {
    const today = parseDateKey(getTodayKey());
    const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    const thirtyDayCutoff = addDays(today, -30).getTime();
    const monthTotal = expenses.reduce((total, expense) => {
      return expense.date.startsWith(monthKey) ? total + toNumber(expense.amount) : total;
    }, 0);
    const lastThirtyDays = expenses.reduce((total, expense) => {
      return parseDateKey(expense.date).getTime() >= thirtyDayCutoff ? total + toNumber(expense.amount) : total;
    }, 0);
    const averageExpense = expenses.length > 0 ? expenses.reduce((total, expense) => total + toNumber(expense.amount), 0) / expenses.length : 0;

    return {
      monthTotal: roundCurrency(monthTotal),
      lastThirtyDays: roundCurrency(lastThirtyDays),
      averageExpense: roundCurrency(averageExpense),
      count: expenses.length
    };
  }

  function summarizeSubscriptions(subscriptions) {
    const today = parseDateKey(getTodayKey()).getTime();
    const thirtyDaysAhead = addDays(parseDateKey(getTodayKey()), 30).getTime();
    const monthly = subscriptions.reduce((total, item) => total + getMonthlyEquivalent(item), 0);
    const yearly = subscriptions.reduce((total, item) => total + getYearlyEquivalent(item), 0);
    const upcoming = subscriptions.reduce((total, item) => {
      const nextChargeTime = parseDateKey(item.nextCharge).getTime();
      return nextChargeTime >= today && nextChargeTime <= thirtyDaysAhead ? total + toNumber(item.amount) : total;
    }, 0);

    return {
      monthly: roundCurrency(monthly),
      yearly: roundCurrency(yearly),
      upcoming: roundCurrency(upcoming),
      count: subscriptions.length
    };
  }

  function summarizeSavings(goals) {
    const target = goals.reduce((total, goal) => total + toNumber(goal.targetAmount), 0);
    const saved = goals.reduce((total, goal) => total + toNumber(goal.currentAmount), 0);
    const monthly = goals.reduce((total, goal) => total + toNumber(goal.monthlyContribution), 0);

    return {
      target: roundCurrency(target),
      saved: roundCurrency(saved),
      remaining: roundCurrency(Math.max(target - saved, 0)),
      monthly: roundCurrency(monthly)
    };
  }

  function summarizeDebts(debts) {
    const today = parseDateKey(getTodayKey()).getTime();
    const thirtyDaysAhead = addDays(parseDateKey(getTodayKey()), 30).getTime();
    const totalBalance = debts.reduce((total, debt) => total + toNumber(debt.balance), 0);
    const monthlyRepayments = debts.reduce((total, debt) => total + toNumber(debt.monthlyPayment), 0);
    const debtsWithRate = debts.filter((debt) => toNumber(debt.interestRate) > 0);
    const averageInterestRate = debtsWithRate.length > 0
      ? debtsWithRate.reduce((total, debt) => total + toNumber(debt.interestRate), 0) / debtsWithRate.length
      : 0;
    const dueSoon = debts.reduce((total, debt) => {
      if (!debt.dueDate) {
        return total;
      }

      const dueTime = parseDateKey(debt.dueDate).getTime();
      return dueTime >= today && dueTime <= thirtyDaysAhead ? total + 1 : total;
    }, 0);

    return {
      totalBalance: roundCurrency(totalBalance),
      monthlyRepayments: roundCurrency(monthlyRepayments),
      averageInterestRate: roundCurrency(averageInterestRate),
      dueSoon,
      count: debts.length
    };
  }

  function getGoalProjection(goal) {
    const target = toNumber(goal.targetAmount);
    const current = toNumber(goal.currentAmount);
    const contribution = toNumber(goal.monthlyContribution);
    const remaining = Math.max(target - current, 0);
    const monthsAtCurrentPace = contribution > 0 ? remaining / contribution : Infinity;

    let targetDateMessage = "No target date saved.";

    if (goal.targetDate) {
      const monthsUntilTarget = Math.max(daysBetween(getTodayKey(), goal.targetDate) / 30.4375, 0);
      const neededPerMonth = monthsUntilTarget > 0 ? remaining / monthsUntilTarget : remaining;
      targetDateMessage = monthsUntilTarget > 0
        ? `Need about ${formatCurrency(neededPerMonth)} per month to hit ${formatDate(goal.targetDate)}.`
        : `Target date ${formatDate(goal.targetDate)} has arrived.`;
    }

    return {
      remaining,
      monthsAtCurrentPace,
      targetDateMessage
    };
  }

  function getCalendarShiftLabel(shift, dateKey, endDateKey) {
    const startsOnDate = dateKey === shift.date;
    const endsOnDate = dateKey === endDateKey;

    if (startsOnDate && endsOnDate) {
      return `${TIME_FORMATTER.format(parseDateTime(shift.date, shift.startTime))} - ${TIME_FORMATTER.format(parseDateTime(endDateKey, shift.endTime))}`;
    }

    if (startsOnDate) {
      return `${TIME_FORMATTER.format(parseDateTime(shift.date, shift.startTime))} - overnight`;
    }

    if (endsOnDate) {
      return `Overnight until ${TIME_FORMATTER.format(parseDateTime(endDateKey, shift.endTime))}`;
    }

    return "Overnight segment";
  }

  function buildCalendarShiftMap(shifts, settings, holidays) {
    const byDate = new Map();

    shifts.forEach((shift) => {
      const payData = calculateShift(shift, settings, holidays);
      const perDate = new Map();

      payData.segments.forEach((segment) => {
        const entry = perDate.get(segment.dateKey) || {
          shiftId: shift.id,
          dateKey: segment.dateKey,
          hours: 0,
          pay: 0,
          isHoliday: false
        };

        entry.hours += segment.paidMinutes / 60;
        entry.pay += segment.pay;
        entry.isHoliday = entry.isHoliday || segment.dayType === "publicHoliday";
        perDate.set(segment.dateKey, entry);
      });

      perDate.forEach((entry, dateKey) => {
        const dateEntries = byDate.get(dateKey) || [];

        dateEntries.push({
          ...entry,
          hours: roundCurrency(entry.hours),
          pay: roundCurrency(entry.pay),
          label: getCalendarShiftLabel(shift, dateKey, payData.endDate),
          notes: shift.notes || "",
          sortTime: dateKey === shift.date ? shift.startTime : "00:00"
        });

        byDate.set(dateKey, dateEntries);
      });
    });

    byDate.forEach((entries) => {
      entries.sort((left, right) => left.sortTime.localeCompare(right.sortTime));
    });

    return byDate;
  }

  function buildCalendarDays(monthKey, shifts, settings, holidays) {
    const monthDate = parseMonthKey(monthKey);
    const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1, 12, 0, 0, 0);
    const lastOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 12, 0, 0, 0);
    const weekdayOffsetStart = (firstOfMonth.getDay() + 6) % 7;
    const weekdayOffsetEnd = (lastOfMonth.getDay() + 6) % 7;
    const gridStart = addDays(firstOfMonth, -weekdayOffsetStart);
    const gridEnd = addDays(lastOfMonth, 6 - weekdayOffsetEnd);
    const holidayMap = holidays.reduce((map, holiday) => {
      const existing = map.get(holiday.date) || [];

      if (!existing.includes(holiday.label)) {
        existing.push(holiday.label);
      }

      map.set(holiday.date, existing);
      return map;
    }, new Map());
    const shiftMap = buildCalendarShiftMap(shifts, settings, holidays);
    const days = [];

    for (let cursor = new Date(gridStart); cursor <= gridEnd; cursor = addDays(cursor, 1)) {
      const dateKey = toDateKey(cursor);
      const entries = shiftMap.get(dateKey) || [];
      const totalHours = entries.reduce((total, entry) => total + entry.hours, 0);
      const totalPay = entries.reduce((total, entry) => total + entry.pay, 0);

      days.push({
        dateKey,
        dayNumber: cursor.getDate(),
        inMonth: getMonthKey(cursor) === monthKey,
        isToday: dateKey === getTodayKey(),
        holidayLabel: (holidayMap.get(dateKey) || []).join(", "),
        entries,
        shiftCount: entries.length,
        totalHours: roundCurrency(totalHours),
        totalPay: roundCurrency(totalPay)
      });
    }

    return days;
  }

  function formatHolidayRange(holiday) {
    if (holiday.startMinute <= 0 && holiday.endMinute >= 24 * 60) {
      return "All day";
    }

    if (holiday.startMinute > 0 && holiday.endMinute >= 24 * 60) {
      return `${formatTimeMinutes(holiday.startMinute)} onwards`;
    }

    if (holiday.startMinute <= 0) {
      return `Until ${formatTimeMinutes(holiday.endMinute)}`;
    }

    return `${formatTimeMinutes(holiday.startMinute)} - ${formatTimeMinutes(holiday.endMinute)}`;
  }

  function createOfficialHolidayEntries(stateCode) {
    return (OFFICIAL_HOLIDAY_DATA[stateCode] || []).map((holiday) => normalizeHoliday({
      id: createId("official-holiday"),
      date: holiday.date,
      label: holiday.label,
      startMinute: Number.isFinite(holiday.startMinute) ? holiday.startMinute : 0,
      endMinute: Number.isFinite(holiday.endMinute) ? holiday.endMinute : 24 * 60,
      source: "official",
      state: stateCode,
      notes: ""
    }));
  }

  function syncOfficialHolidays(existingHolidays, stateCode) {
    const manualHolidays = normalizeHolidays(existingHolidays).filter((holiday) => !holiday.isOfficial);
    const officialHolidays = createOfficialHolidayEntries(stateCode);
    return dedupeHolidays([...manualHolidays, ...officialHolidays]).sort((left, right) => {
      const byDate = compareDateKeys(left.date, right.date);
      return byDate || left.startMinute - right.startMinute;
    });
  }

  function isLocalInstallContext() {
    const hostname = String(global.location?.hostname || "");
    return hostname === "localhost" || hostname === "127.0.0.1";
  }

  function canUseServiceWorker() {
    return Boolean(global.navigator?.serviceWorker) && Boolean(global.isSecureContext || isLocalInstallContext());
  }

  function isIosDevice() {
    const userAgent = String(global.navigator?.userAgent || "");
    return /iPad|iPhone|iPod/.test(userAgent);
  }

  function isStandaloneMode() {
    return Boolean(global.matchMedia?.("(display-mode: standalone)").matches || global.navigator?.standalone);
  }

  const app = {
    state: createDefaultState(),
    isLocked: true,
    deferredInstallPrompt: null,
    googleDiscoveryPromise: null,
    googleTokenCache: {},

    init() {
      this.state = loadState();
      this.cacheDom();
      this.applyTheme();
      this.setupPwa();
      this.bindEvents();
      this.hydrateForms();
      this.renderAll();

      if (this.isLocked) {
        global.setTimeout(() => {
          this.dom.loginForm.elements.credential.focus();
        }, 0);
      }
    },

    cacheDom() {
      this.dom = {
        status: document.getElementById("appStatus"),
        loginStatus: document.getElementById("loginStatus"),
        loginShell: document.getElementById("loginShell"),
        loginForm: document.getElementById("loginForm"),
        loginCreateForm: document.getElementById("loginCreateForm"),
        googleLoginButton: document.getElementById("googleLoginButton"),
        googleLoginHelp: document.getElementById("googleLoginHelp"),
        googleClientIdForms: Array.from(document.querySelectorAll("[data-google-client-id-form]")),
        googleClientIdInputs: Array.from(document.querySelectorAll("[data-google-client-id-input]")),
        googleClientIdHelp: Array.from(document.querySelectorAll("[data-google-client-id-help]")),
        loginAccountList: document.getElementById("loginAccountList"),
        heroMetrics: document.getElementById("heroMetrics"),
        activeAccountSummary: document.getElementById("activeAccountSummary"),
        googleSyncForm: document.getElementById("googleSyncForm"),
        googleSyncNote: document.getElementById("googleSyncNote"),
        connectGoogleCalendarButton: document.getElementById("connectGoogleCalendarButton"),
        syncGoogleCalendarButton: document.getElementById("syncGoogleCalendarButton"),
        lockAppButton: document.getElementById("lockAppButton"),
        deleteProfileButton: document.getElementById("deleteProfileButton"),
        dashboardBadges: document.getElementById("dashboardBadges"),
        dashboardSummary: document.getElementById("dashboardSummary"),
        dashboardPaySummary: document.getElementById("dashboardPaySummary"),
        dashboardFinanceSummary: document.getElementById("dashboardFinanceSummary"),
        dashboardCalendarMonthLabel: document.getElementById("dashboardCalendarMonthLabel"),
        dashboardCalendarGrid: document.getElementById("dashboardCalendarGrid"),
        dashboardShiftPreview: document.getElementById("dashboardShiftPreview"),
        dashboardSubscriptionPreview: document.getElementById("dashboardSubscriptionPreview"),
        dashboardExpensePreview: document.getElementById("dashboardExpensePreview"),
        dashboardGoalPreview: document.getElementById("dashboardGoalPreview"),
        salaryPreview: document.getElementById("salaryPreview"),
        holidayList: document.getElementById("holidayList"),
        ratePreview: document.getElementById("ratePreview"),
        payPeriodList: document.getElementById("payPeriodList"),
        calendarMonthLabel: document.getElementById("calendarMonthLabel"),
        calendarGrid: document.getElementById("calendarGrid"),
        shiftList: document.getElementById("shiftList"),
        expenseSummary: document.getElementById("expenseSummary"),
        expenseList: document.getElementById("expenseList"),
        subscriptionSummary: document.getElementById("subscriptionSummary"),
        subscriptionList: document.getElementById("subscriptionList"),
        savingsSummary: document.getElementById("savingsSummary"),
        goalList: document.getElementById("goalList"),
        debtSummary: document.getElementById("debtSummary"),
        debtList: document.getElementById("debtList"),
        settingsForm: document.getElementById("settingsForm"),
        holidayForm: document.getElementById("holidayForm"),
        shiftForm: document.getElementById("shiftForm"),
        expenseForm: document.getElementById("expenseForm"),
        subscriptionForm: document.getElementById("subscriptionForm"),
        savingsForm: document.getElementById("savingsForm"),
        debtForm: document.getElementById("debtForm"),
        exportDataButton: document.getElementById("exportDataButton"),
        importDataButton: document.getElementById("importDataButton"),
        loginImportDataButton: document.getElementById("loginImportDataButton"),
        importDataInput: document.getElementById("importDataInput"),
        installAppButton: document.getElementById("installAppButton"),
        loginInstallAppButton: document.getElementById("loginInstallAppButton"),
        themeToggleButton: document.getElementById("themeToggleButton"),
        themeColorMeta: document.querySelector('meta[name="theme-color"]'),
        tabButtons: Array.from(document.querySelectorAll(".tab-bar [data-tab]")),
        panels: Array.from(document.querySelectorAll("[data-panel]")),
        salaryViewButtons: Array.from(document.querySelectorAll("[data-salary-view]")),
        salaryPanels: Array.from(document.querySelectorAll("[data-salary-panel]"))
      };
    },

    bindEvents() {
      this.dom.tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          this.state.activeTab = button.dataset.tab;
          this.persist();
          this.renderTabs();
        });
      });

      this.dom.salaryViewButtons.forEach((button) => {
        button.addEventListener("click", () => {
          this.state.activeSalaryView = button.dataset.salaryView;
          this.persist();
          this.renderSalaryViews();
        });
      });

      this.dom.themeToggleButton.addEventListener("click", () => {
        this.toggleTheme();
      });

      this.dom.loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleLoginSubmit();
      });

      if (this.dom.loginCreateForm) {
        this.dom.loginCreateForm.addEventListener("submit", (event) => {
          event.preventDefault();
          this.handleProfileCreate();
        });
      }

      if (this.dom.googleLoginButton) {
        this.dom.googleLoginButton.addEventListener("click", () => {
          this.handleGoogleLoginClick();
        });
      }

      this.dom.googleClientIdForms.forEach((form) => {
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          this.handleGoogleClientIdSave(form);
        });
      });

      if (this.dom.lockAppButton) {
        this.dom.lockAppButton.addEventListener("click", () => {
          this.lockApp();
        });
      }

      if (this.dom.deleteProfileButton) {
        this.dom.deleteProfileButton.addEventListener("click", () => {
          this.handleProfileDelete();
        });
      }

      if (this.dom.googleSyncForm) {
        this.dom.googleSyncForm.addEventListener("submit", (event) => {
          event.preventDefault();
          this.handleGoogleSyncEmailSave();
        });
      }

      if (this.dom.connectGoogleCalendarButton) {
        this.dom.connectGoogleCalendarButton.addEventListener("click", () => {
          this.handleGoogleCalendarConnect();
        });
      }

      if (this.dom.syncGoogleCalendarButton) {
        this.dom.syncGoogleCalendarButton.addEventListener("click", () => {
          this.handleGoogleCalendarSync();
        });
      }

      this.dom.settingsForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleSettingsSave();
      });

      this.dom.holidayForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleHolidaySave();
      });

      this.dom.shiftForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleShiftSave();
      });

      this.dom.expenseForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleExpenseSave();
      });

      this.dom.subscriptionForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleSubscriptionSave();
      });

      this.dom.savingsForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleSavingsSave();
      });

      this.dom.debtForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleDebtSave();
      });

      this.dom.exportDataButton.addEventListener("click", () => this.exportData());
      this.dom.importDataButton.addEventListener("click", () => this.openImportPicker());
      this.dom.loginImportDataButton.addEventListener("click", () => this.openImportPicker());
      this.dom.importDataInput.addEventListener("change", (event) => {
        this.handleImportSelected(event);
      });
      this.dom.installAppButton.addEventListener("click", () => {
        this.handleInstallClick();
      });
      this.dom.loginInstallAppButton.addEventListener("click", () => {
        this.handleInstallClick();
      });

      document.addEventListener("click", (event) => {
        const actionButton = event.target.closest("[data-action]");

        if (!actionButton) {
          return;
        }

        const { action, id } = actionButton.dataset;

        if (action === "fill-credential") {
          const credential = actionButton.dataset.credential || "";

          this.dom.loginForm.elements.credential.value = credential;
          this.dom.loginForm.elements.credential.focus();
          return;
        }

        if (action === "delete-holiday") {
          this.state.holidays = this.state.holidays.filter((holiday) => holiday.id !== id);
          this.persistAndRender("Public holiday removed.");
        }

        if (action === "load-official-holidays") {
          this.handleOfficialHolidayLoad();
        }

        if (action === "calendar-prev") {
          this.state.activeCalendarMonth = getMonthKey(addMonths(parseMonthKey(this.state.activeCalendarMonth), -1));
          this.persist();
          this.renderCalendar();
        }

        if (action === "calendar-next") {
          this.state.activeCalendarMonth = getMonthKey(addMonths(parseMonthKey(this.state.activeCalendarMonth), 1));
          this.persist();
          this.renderCalendar();
        }

        if (action === "delete-shift") {
          this.state.shifts = this.state.shifts.filter((shift) => shift.id !== id);
          this.persistAndRender("Shift removed.");
        }

        if (action === "delete-expense") {
          this.state.expenses = this.state.expenses.filter((expense) => expense.id !== id);
          this.persistAndRender("Expense removed.");
        }

        if (action === "delete-subscription") {
          this.state.subscriptions = this.state.subscriptions.filter((subscription) => subscription.id !== id);
          this.persistAndRender("Subscription removed.");
        }

        if (action === "delete-goal") {
          this.state.savingsGoals = this.state.savingsGoals.filter((goal) => goal.id !== id);
          this.persistAndRender("Savings goal removed.");
        }

        if (action === "delete-debt") {
          this.state.debts = this.state.debts.filter((debt) => debt.id !== id);
          this.persistAndRender("Debt removed.");
        }
      });
    },

    hydrateForms() {
      const settings = this.state.settings;

      this.dom.loginForm.reset();
      if (this.dom.loginCreateForm) {
        this.dom.loginCreateForm.reset();
      }

      if (this.dom.googleSyncForm) {
        this.dom.googleSyncForm.elements.syncEmail.value = this.getActiveProfile()?.google?.syncEmail || "";
      }
      this.dom.settingsForm.elements.jobLabel.value = settings.jobLabel || "";
      this.dom.settingsForm.elements.awardName.value = settings.awardName || "";
      this.dom.settingsForm.elements.awardCode.value = settings.awardCode || "";
      this.dom.settingsForm.elements.classification.value = settings.classification || "";
      this.dom.settingsForm.elements.employmentType.value = settings.employmentType || "casual";
      this.dom.settingsForm.elements.workState.value = settings.workState || "NSW";
      this.dom.settingsForm.elements.rateDate.value = settings.rateDate || getTodayKey();
      this.dom.settingsForm.elements.payFrequency.value = settings.payFrequency || "fortnightly";
      this.dom.settingsForm.elements.cycleAnchor.value = settings.cycleAnchor || getTodayKey();
      this.dom.settingsForm.elements.taxResidency.value = settings.taxResidency || "resident";
      this.dom.settingsForm.elements.includeMedicare.checked = Boolean(settings.includeMedicare);
      this.dom.settingsForm.elements.hasTFN.checked = Boolean(settings.hasTFN);
      this.dom.settingsForm.elements.eveningStart.value = settings.windows.eveningStart || "19:00";
      this.dom.settingsForm.elements.overnightStart.value = settings.windows.overnightStart || "00:00";
      this.dom.settingsForm.elements.dayStart.value = settings.windows.dayStart || "07:00";
      this.dom.settingsForm.elements.weekdayDay.value = settings.rates.weekday.day || "";
      this.dom.settingsForm.elements.weekdayEvening.value = settings.rates.weekday.evening || "";
      this.dom.settingsForm.elements.weekdayOvernight.value = settings.rates.weekday.overnight || "";
      this.dom.settingsForm.elements.saturdayDay.value = settings.rates.saturday.day || "";
      this.dom.settingsForm.elements.saturdayEvening.value = settings.rates.saturday.evening || "";
      this.dom.settingsForm.elements.saturdayOvernight.value = settings.rates.saturday.overnight || "";
      this.dom.settingsForm.elements.sundayDay.value = settings.rates.sunday.day || "";
      this.dom.settingsForm.elements.sundayEvening.value = settings.rates.sunday.evening || "";
      this.dom.settingsForm.elements.sundayOvernight.value = settings.rates.sunday.overnight || "";
      this.dom.settingsForm.elements.publicHolidayDay.value = settings.rates.publicHoliday.day || "";
      this.dom.settingsForm.elements.publicHolidayEvening.value = settings.rates.publicHoliday.evening || "";
      this.dom.settingsForm.elements.publicHolidayOvernight.value = settings.rates.publicHoliday.overnight || "";
      this.dom.settingsForm.elements.awardNotes.value = settings.awardNotes || "";

      this.dom.holidayForm.reset();
      this.dom.holidayForm.elements.date.value = getTodayKey();
      this.dom.holidayForm.elements.startTime.value = "";
      this.dom.holidayForm.elements.endTime.value = "";
      this.dom.shiftForm.reset();
      this.dom.shiftForm.elements.date.value = getTodayKey();
      this.dom.shiftForm.elements.startTime.value = "09:00";
      this.dom.shiftForm.elements.endTime.value = "17:00";
      this.dom.shiftForm.elements.breakMinutes.value = "30";
      this.dom.expenseForm.reset();
      this.dom.expenseForm.elements.date.value = getTodayKey();
      this.dom.subscriptionForm.reset();
      this.dom.subscriptionForm.elements.nextCharge.value = getTodayKey();
      this.dom.savingsForm.reset();
      this.dom.debtForm.reset();
      this.dom.debtForm.elements.dueDate.value = getTodayKey();
    },

    setupPwa() {
      if (typeof global.addEventListener === "function") {
        global.addEventListener("beforeinstallprompt", (event) => {
          event.preventDefault();
          this.deferredInstallPrompt = event;
          this.renderInstallButton();
        });

        global.addEventListener("appinstalled", () => {
          this.deferredInstallPrompt = null;
          this.renderInstallButton();
          this.showStatus("Shiftwise is installed on this device and ready for offline use.");
        });
      }

      if (canUseServiceWorker()) {
        global.navigator.serviceWorker.register("service-worker.js").catch(() => {
          // Ignore service worker registration issues in unsupported or local preview contexts.
        });
      }
    },

    async waitForGoogleClient(timeoutMs = 8000) {
      const clientId = getGoogleClientId();

      if (!clientId) {
        return false;
      }

      if (global.google?.accounts?.oauth2) {
        return true;
      }

      const start = Date.now();

      while (Date.now() - start < timeoutMs) {
        await new Promise((resolve) => global.setTimeout(resolve, 120));

        if (global.google?.accounts?.oauth2) {
          return true;
        }
      }

      return false;
    },

    async requestGoogleToken(scopes, options = {}) {
      const clientId = getGoogleClientId();

      if (!clientId) {
        throw new Error("Save your Google OAuth client ID in Shiftwise before using Google login or Calendar sync.");
      }

      const isReady = await this.waitForGoogleClient();

      if (!isReady) {
        throw new Error("Google sign-in is still loading. Try again in a moment.");
      }

      const cacheKey = `${scopes}|${normalizeEmail(options.loginHint || "")}`;
      const cached = this.googleTokenCache[cacheKey];

      if (!options.prompt && cached && cached.expiresAt > Date.now() + 60000) {
        return cached.response;
      }

      return new Promise((resolve, reject) => {
        const tokenClient = global.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: scopes,
          callback: (response) => {
            if (!response || response.error) {
              reject(new Error(response?.error_description || response?.error || "Google authorization did not finish."));
              return;
            }

            this.googleTokenCache[cacheKey] = {
              response,
              expiresAt: Date.now() + Math.max((Number(response.expires_in) || 0) - 60, 0) * 1000
            };
            resolve(response);
          },
          error_callback: () => {
            reject(new Error("Google sign-in was closed before it finished."));
          }
        });

        tokenClient.requestAccessToken({
          prompt: options.prompt ?? "",
          login_hint: options.loginHint || undefined
        });
      });
    },

    async getGoogleUserInfoEndpoint() {
      if (!this.googleDiscoveryPromise) {
        this.googleDiscoveryPromise = fetch(GOOGLE_OPENID_DISCOVERY_URL)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Could not load Google account details.");
            }

            return response.json();
          })
          .then((data) => data.userinfo_endpoint || "https://openidconnect.googleapis.com/v1/userinfo");
      }

      return this.googleDiscoveryPromise;
    },

    async fetchGoogleIdentity(accessToken) {
      const endpoint = await this.getGoogleUserInfoEndpoint();
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Could not read your Google account details.");
      }

      const data = await response.json();

      return {
        email: normalizeEmail(data.email || ""),
        name: String(data.name || "").trim(),
        sub: String(data.sub || "").trim()
      };
    },

    updateGoogleProfile(profile, identity) {
      profile.google = mergeGoogleProfile(profile.google);
      profile.google.email = normalizeEmail(identity.email || profile.google.email || "");
      profile.google.syncEmail = normalizeEmail(profile.google.syncEmail || identity.email || "");
      profile.google.displayName = identity.name || profile.google.displayName || profile.name;
      profile.google.sub = identity.sub || profile.google.sub || "";
      return profile.google;
    },

    async googleApiRequest(path, options = {}) {
      const url = new URL(path, `${GOOGLE_CALENDAR_API_BASE}/`);
      const query = options.query || {};

      Object.keys(query).forEach((key) => {
        const value = query[key];

        if (Array.isArray(value)) {
          value.forEach((item) => url.searchParams.append(key, item));
        } else if (value != null && value !== "") {
          url.searchParams.append(key, value);
        }
      });

      const response = await fetch(url.toString(), {
        method: options.method || "GET",
        headers: {
          Authorization: `Bearer ${options.accessToken}`,
          "Content-Type": "application/json"
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      if (!response.ok) {
        let errorMessage = "Google Calendar request failed.";

        try {
          const payload = await response.json();
          errorMessage = payload?.error?.message || errorMessage;
        } catch (error) {
          // Ignore JSON parsing issues from empty error bodies.
        }

        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        return null;
      }

      return response.json();
    },

    async ensureGoogleCalendar(profile, accessToken) {
      profile.google = mergeGoogleProfile(profile.google);

      if (profile.google.calendarId) {
        return {
          id: profile.google.calendarId,
          summary: profile.google.calendarSummary || `Shiftwise AU - ${profile.name}`
        };
      }

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Australia/Sydney";
      const calendar = await this.googleApiRequest("calendars", {
        method: "POST",
        accessToken,
        body: {
          summary: `Shiftwise AU - ${profile.name}`,
          description: "One-way shift sync from Shiftwise AU",
          timeZone
        }
      });

      profile.google.calendarId = calendar.id || "";
      profile.google.calendarSummary = calendar.summary || `Shiftwise AU - ${profile.name}`;
      return calendar;
    },

    buildGoogleCalendarEvent(shift, profile) {
      const settings = this.state.settings;
      const payData = calculateShift(shift, settings, this.state.holidays);
      const startDateTime = parseDateTime(shift.date, shift.startTime);
      const endDateTime = getShiftEndDateTime(shift);
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Australia/Sydney";
      const jobLabel = settings.jobLabel || "Shift";
      const descriptionLines = [
        `Shiftwise AU sync for ${profile.name}.`,
        `Estimated gross pay: ${formatCurrency(payData.grossPay)}`,
        `Unpaid break: ${shift.breakMinutes || 0} minutes`
      ];

      if (settings.awardName) {
        descriptionLines.push(`Award: ${settings.awardName}`);
      }

      if (shift.notes) {
        descriptionLines.push(`Notes: ${shift.notes}`);
      }

      return {
        summary: `${jobLabel} shift`,
        description: descriptionLines.join("\n"),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone
        },
        extendedProperties: {
          private: {
            shiftwiseApp: "shiftwise-au",
            shiftwiseProfileId: profile.id,
            shiftwiseShiftId: shift.id
          }
        }
      };
    },

    focusGoogleClientIdInput() {
      const input = this.dom.googleClientIdInputs.find((field) => !field.disabled && field.offsetParent !== null)
        || this.dom.googleClientIdInputs.find((field) => !field.disabled)
        || this.dom.googleClientIdInputs[0];

      if (!input || typeof input.focus !== "function") {
        return;
      }

      input.focus();

      if (typeof input.select === "function") {
        input.select();
      }
    },

    handleGoogleClientIdSave(form) {
      if (getEmbeddedGoogleClientId()) {
        this.showStatus("Google login is already configured in this app build.");
        this.renderProfiles();
        return;
      }

      const clientId = String(form?.elements?.googleClientId?.value || "").trim();

      if (clientId && !/^[a-z0-9-]+\.apps\.googleusercontent\.com$/i.test(clientId)) {
        this.focusGoogleClientIdInput();
        this.showStatus("Enter a valid Google OAuth client ID ending in .apps.googleusercontent.com.", "error");
        return;
      }

      saveGoogleClientId(clientId);
      this.googleTokenCache = {};
      this.renderProfiles();

      if (clientId) {
        this.showStatus("Google setup saved. You can now use Login with Google.");
      } else {
        this.showStatus("Saved Google setup was cleared from this device.");
      }
    },

    async ensureGoogleCalendarConnection(promptValue = "") {
      const profile = this.getActiveProfile();

      if (!profile) {
        throw new Error("No active account was found.");
      }

      profile.google = mergeGoogleProfile(profile.google);
      const loginHint = profile.google.syncEmail || profile.google.email || "";
      const tokenResponse = await this.requestGoogleToken(GOOGLE_CALENDAR_SCOPE, {
        prompt: promptValue || (profile.google.calendarId ? "" : "select_account"),
        loginHint
      });
      const identity = await this.fetchGoogleIdentity(tokenResponse.access_token);
      const expectedEmail = normalizeEmail(profile.google.syncEmail || profile.google.email || "");

      if (expectedEmail && identity.email && identity.email !== expectedEmail) {
        throw new Error(`Google returned ${identity.email}. Save that Gmail in the sync field or choose the matching Google account.`);
      }

      this.updateGoogleProfile(profile, identity);
      await this.ensureGoogleCalendar(profile, tokenResponse.access_token);
      return { profile, tokenResponse, identity };
    },

    async handleGoogleLoginClick() {
      if (!getGoogleClientId()) {
        this.focusGoogleClientIdInput();
        this.showStatus("Save your Google OAuth client ID first, then try Login with Google again.", "error");
        return;
      }

      try {
        const tokenResponse = await this.requestGoogleToken(GOOGLE_LOGIN_SCOPE, {
          prompt: "select_account"
        });
        const identity = await this.fetchGoogleIdentity(tokenResponse.access_token);

        if (!identity.email) {
          throw new Error("Google did not return an email address for this account.");
        }

        syncActiveProfileFromTopLevel(this.state);
        let profile = findProfileByGoogleIdentity(identity, this.state.profiles);

        if (!profile) {
          const displayName = identity.name || identity.email.split("@")[0] || "Google user";
          const profileName = createUniqueProfileName(displayName, this.state.profiles);
          const baseUsername = buildBaseUsername(identity.email.split("@")[0] || profileName);

          profile = createDefaultProfile(profileName);
          profile.login.username = createUniqueUsername(baseUsername, this.state.profiles);
          this.updateGoogleProfile(profile, identity);
          this.state.profiles.push(profile);
        } else {
          this.updateGoogleProfile(profile, identity);
        }

        this.state.activeTab = "dashboard";
        this.state.activeSalaryView = "overview";
        this.switchProfile(profile.id, `Signed in with Google as ${profile.name}.`);
      } catch (error) {
        this.showStatus(error.message || "Google login could not be completed.", "error");
      }
    },

    handleGoogleSyncEmailSave() {
      const profile = this.getActiveProfile();

      if (!profile) {
        this.showStatus("No active account was found.", "error");
        return;
      }

      const email = normalizeEmail(this.dom.googleSyncForm.elements.syncEmail.value || "");

      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        this.showStatus("Enter a valid Gmail or Google account email first.", "error");
        return;
      }

      profile.google = mergeGoogleProfile(profile.google);
      profile.google.syncEmail = email;
      this.persist();
      this.renderProfiles();
      this.showStatus(email ? `Saved ${email} for Google Calendar sync.` : "Cleared the saved Gmail for calendar sync.");
    },

    async handleGoogleCalendarConnect() {
      if (!getGoogleClientId()) {
        this.focusGoogleClientIdInput();
        this.showStatus("Save your Google OAuth client ID first, then connect Google Calendar.", "error");
        return;
      }

      try {
        const { profile, identity } = await this.ensureGoogleCalendarConnection();

        this.persist();
        this.hydrateForms();
        this.renderProfiles();
        this.showStatus(`Google Calendar connected for ${identity.email}. Shifts will sync into ${profile.google.calendarSummary || "your Shiftwise calendar"}.`);
      } catch (error) {
        this.showStatus(error.message || "Google Calendar could not be connected.", "error");
      }
    },

    async handleGoogleCalendarSync() {
      if (!getGoogleClientId()) {
        this.focusGoogleClientIdInput();
        this.showStatus("Save your Google OAuth client ID first, then sync your shifts to Google Calendar.", "error");
        return;
      }

      if (this.state.shifts.length === 0) {
        this.showStatus("Add at least one shift before syncing to Google Calendar.", "error");
        return;
      }

      try {
        const { profile, tokenResponse } = await this.ensureGoogleCalendarConnection();
        const calendarId = profile.google.calendarId;
        const existing = await this.googleApiRequest(`calendars/${encodeURIComponent(calendarId)}/events`, {
          accessToken: tokenResponse.access_token,
          query: {
            privateExtendedProperty: `shiftwiseProfileId=${profile.id}`,
            maxResults: "2500",
            singleEvents: "true",
            showDeleted: "false"
          }
        });
        const existingMap = new Map();

        (existing.items || []).forEach((event) => {
          const shiftId = event?.extendedProperties?.private?.shiftwiseShiftId;

          if (shiftId) {
            existingMap.set(shiftId, event);
          }
        });

        let createdCount = 0;
        let updatedCount = 0;

        for (const shift of this.state.shifts) {
          const eventBody = this.buildGoogleCalendarEvent(shift, profile);
          const existingEvent = existingMap.get(shift.id);

          if (existingEvent?.id) {
            await this.googleApiRequest(`calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(existingEvent.id)}`, {
              method: "PATCH",
              accessToken: tokenResponse.access_token,
              body: eventBody
            });
            updatedCount += 1;
          } else {
            await this.googleApiRequest(`calendars/${encodeURIComponent(calendarId)}/events`, {
              method: "POST",
              accessToken: tokenResponse.access_token,
              body: eventBody
            });
            createdCount += 1;
          }
        }

        let deletedCount = 0;
        const activeShiftIds = new Set(this.state.shifts.map((shift) => shift.id));

        for (const [shiftId, event] of existingMap.entries()) {
          if (!activeShiftIds.has(shiftId) && event?.id) {
            await this.googleApiRequest(`calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(event.id)}`, {
              method: "DELETE",
              accessToken: tokenResponse.access_token
            });
            deletedCount += 1;
          }
        }

        profile.google.lastSyncedAt = new Date().toISOString();
        this.persist();
        this.renderProfiles();
        this.showStatus(`Google Calendar synced: ${createdCount} created, ${updatedCount} updated, ${deletedCount} removed.`);
      } catch (error) {
        this.showStatus(error.message || "Shifts could not be synced to Google Calendar.", "error");
      }
    },

    getActiveProfile() {
      return getActiveProfileRecord(this.state);
    },

    switchProfile(profileId, message = "") {
      if (!profileId) {
        return;
      }

      syncActiveProfileFromTopLevel(this.state);
      const nextProfile = this.state.profiles.find((profile) => profile.id === profileId);

      if (!nextProfile) {
        this.showStatus("That profile could not be found.", "error");
        return;
      }

      hydrateStateFromProfile(this.state, nextProfile);
      this.isLocked = false;
      this.persist();
      this.hydrateForms();
      this.renderAll();

      if (message) {
        this.showStatus(message);
      }
    },

    handleLoginSubmit() {
      const credential = String(this.dom.loginForm.elements.credential.value || "").trim();

      if (!credential) {
        this.showStatus("Enter your email, username, or PIN to unlock the app.", "error");
        return;
      }

      const { profile, error } = findProfileByCredential(credential, this.state.profiles);

      if (!profile) {
        this.showStatus(error || "No allowed account matched that email, username, or PIN.", "error");
        return;
      }

      this.switchProfile(profile.id, `Signed in as ${profile.name}.`);
    },

    lockApp(message = "Switched account. Enter your email, username, or PIN to continue.") {
      const credentialField = this.dom.loginForm?.elements?.credential;

      syncActiveProfileFromTopLevel(this.state);
      this.isLocked = true;
      this.persist();
      this.hydrateForms();
      this.renderAll();
      this.showStatus(message);

      if (credentialField && typeof credentialField.focus === "function") {
        global.setTimeout(() => {
          credentialField.focus();
        }, 0);
      }
    },

    handleProfileCreate() {
      syncActiveProfileFromTopLevel(this.state);
      const form = this.dom.loginCreateForm.elements;
      const rawDisplayName = String(form.displayName.value || "").trim();
      const rawUsername = String(form.username.value || "").trim();
      const rawPin = String(form.pin.value || "").trim();

      if (!rawDisplayName) {
        this.showStatus("Enter a display name for the new account.", "error");
        return;
      }

      if (!rawUsername) {
        this.showStatus("Choose a username for the new account.", "error");
        return;
      }

      const username = buildBaseUsername(rawUsername);
      const pin = normalizePin(rawPin);
      const usernameExists = this.state.profiles.some((profile) => profile.login?.username === username);

      if (/^\d+$/.test(username)) {
        this.showStatus("Usernames need at least one letter so they do not clash with PIN logins.", "error");
        return;
      }

      if (usernameExists) {
        this.showStatus(`That username is already in use. Try ${createUniqueUsername(username, this.state.profiles)} instead.`, "error");
        return;
      }

      if (rawPin && (pin.length < 4 || pin.length > 6)) {
        this.showStatus("PINs need to be 4 to 6 digits.", "error");
        return;
      }

      if (pin && this.state.profiles.some((profile) => profile.login?.pin === pin)) {
        this.showStatus("That PIN is already used by another local account. Choose a different PIN.", "error");
        return;
      }

      const profileName = createUniqueProfileName(rawDisplayName, this.state.profiles);
      const profile = createDefaultProfile(profileName);

      profile.login = {
        username,
        pin
      };

      this.state.profiles.push(profile);
      this.state.activeTab = "dashboard";
      this.state.activeSalaryView = "overview";
      hydrateStateFromProfile(this.state, profile);
      this.isLocked = false;
      this.persist();
      this.hydrateForms();
      this.renderAll();
      this.showStatus(`Created ${profile.name} with username @${username}.`);
    },

    handleProfileDelete() {
      if (this.state.profiles.length <= 1) {
        this.showStatus("Keep at least one local account in the app.", "error");
        return;
      }

      const activeProfile = this.getActiveProfile();

      if (!activeProfile) {
        this.showStatus("No active profile was found.", "error");
        return;
      }

      const confirmed = global.confirm(`Delete the local account "${activeProfile.name}" and all of its saved data on this browser?`);

      if (!confirmed) {
        return;
      }

      this.state.profiles = this.state.profiles.filter((profile) => profile.id !== activeProfile.id);
      hydrateStateFromProfile(this.state, this.state.profiles[0]);
      this.isLocked = true;
      this.persist();
      this.hydrateForms();
      this.renderAll();
      this.showStatus(`Deleted ${activeProfile.name}. Enter another username or PIN to continue.`);
    },

    handleSettingsSave() {
      const form = this.dom.settingsForm.elements;

      this.state.settings = {
        ...this.state.settings,
        jobLabel: form.jobLabel.value.trim(),
        awardName: form.awardName.value.trim(),
        awardCode: form.awardCode.value.trim(),
        classification: form.classification.value.trim(),
        employmentType: form.employmentType.value,
        workState: form.workState.value,
        rateDate: form.rateDate.value,
        payFrequency: form.payFrequency.value,
        cycleAnchor: form.cycleAnchor.value,
        taxResidency: form.taxResidency.value,
        includeMedicare: form.includeMedicare.checked,
        hasTFN: form.hasTFN.checked,
        windows: {
          eveningStart: form.eveningStart.value,
          overnightStart: form.overnightStart.value,
          dayStart: form.dayStart.value
        },
        rates: {
          weekday: {
            day: form.weekdayDay.value,
            evening: form.weekdayEvening.value,
            overnight: form.weekdayOvernight.value
          },
          saturday: {
            day: form.saturdayDay.value,
            evening: form.saturdayEvening.value,
            overnight: form.saturdayOvernight.value
          },
          sunday: {
            day: form.sundayDay.value,
            evening: form.sundayEvening.value,
            overnight: form.sundayOvernight.value
          },
          publicHoliday: {
            day: form.publicHolidayDay.value,
            evening: form.publicHolidayEvening.value,
            overnight: form.publicHolidayOvernight.value
          }
        },
        awardNotes: form.awardNotes.value.trim()
      };

      this.persistAndRender("Salary setup saved.");
    },

    handleHolidaySave() {
      const form = this.dom.holidayForm.elements;
      const date = form.date.value;

      if (!date) {
        this.showStatus("Please choose a public holiday date.", "error");
        return;
      }

      const startMinute = form.startTime.value ? parseTimeToMinutes(form.startTime.value) : 0;
      const endMinute = form.endTime.value ? parseTimeToMinutes(form.endTime.value) : 24 * 60;
      const existingHoliday = this.state.holidays.find((holiday) => {
        return holiday.date === date
          && holiday.startMinute === startMinute
          && holiday.endMinute === endMinute
          && holiday.source === "manual";
      });

      if (form.startTime.value && form.endTime.value && endMinute <= startMinute) {
        this.showStatus("Holiday end time needs to be later than the start time on the same date.", "error");
        return;
      }

      if (existingHoliday) {
        existingHoliday.label = form.label.value.trim() || existingHoliday.label || "Public holiday";
      } else {
        this.state.holidays.push({
          id: createId("holiday"),
          date,
          label: form.label.value.trim() || "Public holiday",
          startMinute,
          endMinute,
          source: "manual",
          state: this.state.settings.workState || ""
        });
      }

      this.state.holidays = dedupeHolidays(normalizeHolidays(this.state.holidays)).sort((left, right) => compareDateKeys(left.date, right.date));
      this.dom.holidayForm.reset();
      this.dom.holidayForm.elements.date.value = getTodayKey();
      this.dom.holidayForm.elements.startTime.value = "";
      this.dom.holidayForm.elements.endTime.value = "";
      this.persistAndRender("Public holiday saved.");
    },

    handleOfficialHolidayLoad() {
      const stateCode = this.state.settings.workState;

      if (!stateCode || !OFFICIAL_HOLIDAY_DATA[stateCode]) {
        this.showStatus("Save your work state or territory first, then load the official holidays.", "error");
        return;
      }

      this.state.holidays = syncOfficialHolidays(this.state.holidays, stateCode);
      const officialCount = this.state.holidays.filter((holiday) => holiday.isOfficial).length;
      const notes = OFFICIAL_HOLIDAY_NOTES[stateCode] || [];
      const noteText = notes.length ? ` ${notes[0]}` : "";

      this.persistAndRender(`Loaded ${officialCount} official holidays for ${STATE_LABELS[stateCode]} across 2026 and 2027.${noteText}`);
    },

    handleShiftSave() {
      if (!toNumber(this.state.settings.rates.weekday.day)) {
        this.showStatus("Save at least the weekday day rate from Fair Work before you add shifts.", "error");
        return;
      }

      const form = this.dom.shiftForm.elements;
      const shift = {
        id: createId("shift"),
        date: form.date.value,
        startTime: form.startTime.value,
        endTime: form.endTime.value,
        breakMinutes: form.breakMinutes.value,
        notes: form.notes.value.trim()
      };
      const payData = calculateShift(shift, this.state.settings, this.state.holidays);

      if (payData.totalMinutes <= 0) {
        this.showStatus("Please enter a valid shift with time on and time off.", "error");
        return;
      }

      this.state.shifts.push(shift);
      this.state.shifts.sort((left, right) => compareDateKeys(right.date, left.date));
      this.state.activeCalendarMonth = shift.date.slice(0, 7);
      this.dom.shiftForm.reset();
      this.dom.shiftForm.elements.date.value = getTodayKey();
      this.dom.shiftForm.elements.startTime.value = "09:00";
      this.dom.shiftForm.elements.endTime.value = "17:00";
      this.dom.shiftForm.elements.breakMinutes.value = "30";
      this.persistAndRender(`Shift saved. Estimated pay: ${formatCurrency(payData.grossPay)}.`);
    },

    handleExpenseSave() {
      const form = this.dom.expenseForm.elements;
      this.state.expenses.unshift({
        id: createId("expense"),
        date: form.date.value,
        category: form.category.value.trim(),
        amount: toNumber(form.amount.value),
        merchant: form.merchant.value.trim(),
        note: form.note.value.trim()
      });
      this.dom.expenseForm.reset();
      this.dom.expenseForm.elements.date.value = getTodayKey();
      this.persistAndRender("Expense added.");
    },

    handleSubscriptionSave() {
      const form = this.dom.subscriptionForm.elements;
      this.state.subscriptions.unshift({
        id: createId("subscription"),
        name: form.name.value.trim(),
        amount: toNumber(form.amount.value),
        frequency: form.frequency.value,
        nextCharge: form.nextCharge.value,
        note: form.note.value.trim()
      });
      this.dom.subscriptionForm.reset();
      this.dom.subscriptionForm.elements.nextCharge.value = getTodayKey();
      this.persistAndRender("Subscription added.");
    },

    handleSavingsSave() {
      const form = this.dom.savingsForm.elements;
      this.state.savingsGoals.unshift({
        id: createId("goal"),
        name: form.name.value.trim(),
        targetAmount: toNumber(form.targetAmount.value),
        currentAmount: toNumber(form.currentAmount.value),
        monthlyContribution: toNumber(form.monthlyContribution.value),
        targetDate: form.targetDate.value
      });
      this.dom.savingsForm.reset();
      this.persistAndRender("Savings goal added.");
    },

    handleDebtSave() {
      const form = this.dom.debtForm.elements;
      this.state.debts.unshift({
        id: createId("debt"),
        name: form.name.value.trim(),
        provider: form.provider.value.trim(),
        balance: toNumber(form.balance.value),
        monthlyPayment: toNumber(form.monthlyPayment.value),
        interestRate: toNumber(form.interestRate.value),
        dueDate: form.dueDate.value,
        note: form.note.value.trim()
      });
      this.dom.debtForm.reset();
      this.dom.debtForm.elements.dueDate.value = getTodayKey();
      this.persistAndRender("Debt added.");
    },

    exportData() {
      const blob = new Blob([JSON.stringify(serializeState(this.state), null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `shiftwise-au-backup-${getTodayKey()}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      this.showStatus("Backup downloaded.");
    },

    openImportPicker() {
      if (!this.dom.importDataInput) {
        return;
      }

      this.dom.importDataInput.value = "";
      this.dom.importDataInput.click();
    },

    async handleImportSelected(event) {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      try {
        const contents = await file.text();
        const importedState = mergeState(JSON.parse(contents));
        const confirmed = global.confirm("Import this backup and replace the current local data on this device?");

        if (!confirmed) {
          event.target.value = "";
          return;
        }

        this.state = importedState;
        this.isLocked = true;
        this.applyTheme();
        this.hydrateForms();
        this.renderAll();
        this.persist();
        this.showStatus("Backup imported. Sign in with one of the restored local accounts.");
      } catch (error) {
        this.showStatus("That backup file could not be imported.", "error");
      } finally {
        event.target.value = "";
      }
    },

    async handleInstallClick() {
      if (isStandaloneMode()) {
        this.renderInstallButton();
        this.showStatus("Shiftwise is already installed on this device.");
        return;
      }

      if (!canUseServiceWorker()) {
        this.showStatus("Install and offline support will work after you publish the app over HTTPS.", "error");
        return;
      }

      if (this.deferredInstallPrompt) {
        const prompt = this.deferredInstallPrompt;

        prompt.prompt();

        try {
          await prompt.userChoice;
        } catch (error) {
          // Keep the button usable even if the browser doesn't resolve the choice.
        }

        this.deferredInstallPrompt = null;
        this.renderInstallButton();
        this.showStatus("Finish the install from your browser prompt to keep Shiftwise offline-ready.");
        return;
      }

      if (isIosDevice()) {
        this.showStatus("On iPhone or iPad in Safari, tap Share and choose Add to Home Screen.");
        return;
      }

      this.showStatus("Use your browser menu and choose Install app or Add to Home Screen.");
    },

    persist() {
      saveState(serializeState(this.state));
    },

    persistAndRender(message) {
      this.persist();
      this.renderAll();
      this.showStatus(message || "Saved.");
    },

    showStatus(message, tone = "info") {
      const target = this.isLocked ? this.dom.loginStatus : this.dom.status;
      const other = this.isLocked ? this.dom.status : this.dom.loginStatus;

      if (!target) {
        return;
      }

      if (other) {
        other.classList.add("hidden");
      }

      target.textContent = message;
      target.dataset.tone = tone;
      target.classList.remove("hidden");

      clearTimeout(this.statusTimer);
      this.statusTimer = global.setTimeout(() => {
        target.classList.add("hidden");
      }, 3600);
    },

    renderAll() {
      this.renderThemeToggle();
      this.renderInstallButton();
      this.renderProfiles();
      this.renderTabs();
      this.renderSalaryViews();
      this.renderHeroMetrics();
      this.renderDashboard();
      this.renderSalaryPreview();
      this.renderHolidayList();
      this.renderRatePreview();
      this.renderPayPeriods();
      this.renderCalendar();
      this.renderShiftList();
      this.renderExpenseSummary();
      this.renderExpenseList();
      this.renderSubscriptionSummary();
      this.renderSubscriptionList();
      this.renderSavingsSummary();
      this.renderSavingsGoals();
      this.renderDebtSummary();
      this.renderDebtList();
    },

    renderTabs() {
      this.dom.tabButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.tab === this.state.activeTab);
      });

      this.dom.panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.panel === this.state.activeTab);
      });
    },

    renderSalaryViews() {
      const activeSalaryView = this.state.activeSalaryView || "overview";

      this.dom.salaryViewButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.salaryView === activeSalaryView);
      });

      this.dom.salaryPanels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.salaryPanel === activeSalaryView);
      });
    },

    applyTheme() {
      const theme = normalizeTheme(this.state.theme);

      document.body.dataset.theme = theme;

      if (this.dom?.themeColorMeta) {
        this.dom.themeColorMeta.setAttribute("content", THEME_META_COLORS[theme]);
      }
    },

    renderThemeToggle() {
      const isDark = normalizeTheme(this.state.theme) === "dark";

      this.dom.themeToggleButton.textContent = isDark ? "Light mode" : "Dark mode";
      this.dom.themeToggleButton.setAttribute("aria-pressed", String(isDark));
      this.dom.themeToggleButton.title = isDark ? "Switch to light mode" : "Switch to dark mode";
    },

    renderInstallButton() {
      const buttons = [this.dom.installAppButton, this.dom.loginInstallAppButton].filter(Boolean);

      if (buttons.length === 0) {
        return;
      }

      if (isStandaloneMode()) {
        buttons.forEach((installButton) => {
          installButton.disabled = true;
          installButton.textContent = "App installed";
          installButton.title = "Shiftwise is already installed on this device";
        });
        return;
      }

      buttons.forEach((installButton) => {
        installButton.disabled = false;
      });

      if (!canUseServiceWorker()) {
        buttons.forEach((installButton) => {
          installButton.textContent = "Install app";
          installButton.title = "Install becomes available after the app is published over HTTPS";
        });
        return;
      }

      if (this.deferredInstallPrompt) {
        buttons.forEach((installButton) => {
          installButton.textContent = "Install app";
          installButton.title = "Install Shiftwise on this device";
        });
        return;
      }

      if (isIosDevice()) {
        buttons.forEach((installButton) => {
          installButton.textContent = "Add to Home Screen";
          installButton.title = "Show iPhone or iPad install steps";
        });
        return;
      }

      buttons.forEach((installButton) => {
        installButton.textContent = "Install help";
        installButton.title = "Show browser install guidance";
      });
    },

    toggleTheme() {
      this.state.theme = normalizeTheme(this.state.theme) === "dark" ? "light" : "dark";
      this.applyTheme();
      this.renderThemeToggle();
      this.persist();
    },

    renderProfiles() {
      const activeProfile = this.getActiveProfile();
      const totalItems = this.state.shifts.length
        + this.state.expenses.length
        + this.state.subscriptions.length
        + this.state.savingsGoals.length
        + this.state.debts.length;
      const recordLabel = totalItems === 1 ? "record" : "records";
      const deviceMode = isStandaloneMode() ? "Installed app" : "Browser mode";
      const accessLabel = activeProfile?.login?.pin ? "Email, username, or PIN" : "Email or username";
      const loginEmail = normalizeEmail(activeProfile?.login?.email || "");

      document.body.classList.toggle("is-locked", this.isLocked);
      this.dom.loginShell.classList.toggle("hidden", !this.isLocked);
      this.dom.loginShell.setAttribute("aria-hidden", String(!this.isLocked));

      if (this.isLocked) {
        this.dom.status.classList.add("hidden");
      } else {
        this.dom.loginStatus.classList.add("hidden");
      }

      if (this.dom.loginAccountList) {
        this.dom.loginAccountList.innerHTML = this.state.profiles
          .map((profile) => `
            <article class="login-account-item">
              <div class="login-account-copy">
                <strong>${profile.name}</strong>
                <p class="snapshot-meta">${profile.login.email || `@${profile.login.username}`} | ${profile.login.pin ? "Email, username, or PIN" : "Email or username"}</p>
              </div>
              <button class="button ghost-button" data-action="fill-credential" data-credential="${profile.login.email || profile.login.username}" type="button">Use saved login</button>
            </article>
          `)
          .join("");
      }

      if (this.dom.activeAccountSummary) {
        this.dom.activeAccountSummary.innerHTML = activeProfile ? `
          <div class="account-summary-head">
            <div>
              <p class="section-kicker">Current local account</p>
              <h3 class="account-name">${activeProfile.name}</h3>
            </div>
            <span class="badge">${loginEmail || `@${activeProfile.login.username}`}</span>
          </div>
          <div class="account-summary-grid">
            <div class="account-detail">
              <span>Access</span>
              <strong>${accessLabel}</strong>
            </div>
            <div class="account-detail">
              <span>Allowed email</span>
              <strong>${loginEmail || "Not set in admin panel"}</strong>
            </div>
            <div class="account-detail">
              <span>Saved data</span>
              <strong>${totalItems} ${recordLabel}</strong>
            </div>
            <div class="account-detail">
              <span>Device mode</span>
              <strong>${deviceMode}</strong>
            </div>
          </div>
          <p class="field-help">
            ${activeProfile.login.pin ? "Quick PIN unlock is enabled on this device." : "This account currently signs in with email or username only."}
            Access is managed from the separate admin panel, and this device can keep working offline after the account has been added here.
          </p>
        ` : '<p class="empty-state">No local account is selected.</p>';
      }

      if (this.dom.lockAppButton) {
        this.dom.lockAppButton.disabled = !activeProfile;
      }

      if (this.dom.deleteProfileButton) {
        this.dom.deleteProfileButton.disabled = this.state.profiles.length <= 1;
        this.dom.deleteProfileButton.textContent = "Delete current account";
        this.dom.deleteProfileButton.title = activeProfile ? `Delete ${activeProfile.name}` : "Delete current account";
      }
    },

    renderHeroMetrics() {
      const payPeriods = buildPayPeriods(this.state.shifts, this.state.settings, this.state.holidays);
      const latestPeriod = payPeriods[0];
      const expenseSummary = summarizeExpenses(this.state.expenses);
      const subscriptionSummary = summarizeSubscriptions(this.state.subscriptions);
      const savingsSummary = summarizeSavings(this.state.savingsGoals);

      this.dom.heroMetrics.innerHTML = [
        this.renderMetricCard("Latest gross pay", latestPeriod ? formatCurrency(latestPeriod.grossPay) : formatCurrency(0)),
        this.renderMetricCard("This month spent", formatCurrency(expenseSummary.monthTotal)),
        this.renderMetricCard("Monthly subscriptions", formatCurrency(subscriptionSummary.monthly)),
        this.renderMetricCard("Saved toward goals", formatCurrency(savingsSummary.saved))
      ].join("");
    },

    renderMetricCard(label, value) {
      return `
        <article class="metric-card">
          <span>${label}</span>
          <strong>${value}</strong>
        </article>
      `;
    },

    renderDashboard() {
      const payPeriods = buildPayPeriods(this.state.shifts, this.state.settings, this.state.holidays);
      const currentPeriod = getPayPeriod(getTodayKey(), this.state.settings);
      const currentCycle = payPeriods.find((period) => period.key === currentPeriod.key) || {
        ...currentPeriod,
        grossPay: 0,
        paidHours: 0,
        shiftCount: 0,
        tax: 0,
        netPay: 0
      };
      const expenseSummary = summarizeExpenses(this.state.expenses);
      const subscriptionSummary = summarizeSubscriptions(this.state.subscriptions);
      const savingsSummary = summarizeSavings(this.state.savingsGoals);
      const debtSummary = summarizeDebts(this.state.debts);
      const activeProfile = this.getActiveProfile();

      this.dom.dashboardBadges.innerHTML = [
        `<span class="badge">${activeProfile ? activeProfile.name : "Primary profile"}</span>`,
        `<span class="badge">${this.state.settings.jobLabel || "No job label saved"}</span>`,
        `<span class="badge">${STATE_LABELS[this.state.settings.workState] || "No state saved"}</span>`
      ].join("");

      this.dom.dashboardSummary.innerHTML = [
        this.renderSummaryCard("Expected gross", formatCurrency(currentCycle.grossPay)),
        this.renderSummaryCard("Expected net", formatCurrency(currentCycle.netPay)),
        this.renderSummaryCard("Shifts saved", String(this.state.shifts.length)),
        this.renderSummaryCard("This month spent", formatCurrency(expenseSummary.monthTotal)),
        this.renderSummaryCard("Monthly subscriptions", formatCurrency(subscriptionSummary.monthly)),
        this.renderSummaryCard("Saved toward goals", formatCurrency(savingsSummary.saved)),
        this.renderSummaryCard("Debt balance", formatCurrency(debtSummary.totalBalance)),
        this.renderSummaryCard("Debts tracked", String(debtSummary.count))
      ].join("");

      this.dom.dashboardPaySummary.innerHTML = [
        this.renderSummaryCard("Pay period", `${formatShortDate(currentCycle.startKey)} - ${formatShortDate(currentCycle.endKey)}`),
        this.renderSummaryCard("Shifts in cycle", String(currentCycle.shiftCount)),
        this.renderSummaryCard("Paid hours", formatHours(currentCycle.paidHours || 0)),
        this.renderSummaryCard("Gross pay", formatCurrency(currentCycle.grossPay)),
        this.renderSummaryCard("Estimated tax", formatCurrency(currentCycle.tax)),
        this.renderSummaryCard("Estimated net", formatCurrency(currentCycle.netPay))
      ].join("");

      this.dom.dashboardFinanceSummary.innerHTML = [
        this.renderSummaryCard("Last 30 days spent", formatCurrency(expenseSummary.lastThirtyDays)),
        this.renderSummaryCard("Expense entries", String(expenseSummary.count)),
        this.renderSummaryCard("Next 30 days subs", formatCurrency(subscriptionSummary.upcoming)),
        this.renderSummaryCard("Saved", formatCurrency(savingsSummary.saved)),
        this.renderSummaryCard("Remaining to goals", formatCurrency(savingsSummary.remaining)),
        this.renderSummaryCard("Monthly goal plan", formatCurrency(savingsSummary.monthly)),
        this.renderSummaryCard("Debt balance", formatCurrency(debtSummary.totalBalance)),
        this.renderSummaryCard("Monthly debt repayments", formatCurrency(debtSummary.monthlyRepayments))
      ].join("");

      this.renderDashboardShiftPreview();
      this.renderDashboardSubscriptionPreview();
      this.renderDashboardExpensePreview();
      this.renderDashboardGoalPreview();
    },

    renderSnapshotItem(title, meta, value = "") {
      return `
        <div class="snapshot-item">
          <div>
            <strong>${title}</strong>
            ${meta ? `<p class="snapshot-meta">${meta}</p>` : ""}
          </div>
          ${value ? `<div class="snapshot-value">${value}</div>` : ""}
        </div>
      `;
    },

    renderDashboardShiftPreview() {
      const todayKey = getTodayKey();
      const upcoming = this.state.shifts
        .filter((shift) => compareDateKeys(shift.date, todayKey) >= 0)
        .slice()
        .sort((left, right) => compareDateKeys(left.date, right.date));
      const fallback = this.state.shifts
        .slice()
        .sort((left, right) => compareDateKeys(right.date, left.date));
      const visibleShifts = (upcoming.length > 0 ? upcoming : fallback).slice(0, 4);

      if (visibleShifts.length === 0) {
        this.dom.dashboardShiftPreview.innerHTML = '<p class="empty-state">No shifts saved yet.</p>';
        return;
      }

      this.dom.dashboardShiftPreview.innerHTML = visibleShifts.map((shift) => {
        const payData = calculateShift(shift, this.state.settings, this.state.holidays);
        const endDateTime = getShiftEndDateTime(shift);
        const endDateKey = toDateKey(endDateTime);
        const dateLabel = shift.date === endDateKey
          ? WEEKDAY_FORMATTER.format(parseDateKey(shift.date))
          : `${formatShortDate(shift.date)} to ${formatShortDate(endDateKey)}`;
        const timeLabel = `${TIME_FORMATTER.format(parseDateTime(shift.date, shift.startTime))} - ${TIME_FORMATTER.format(endDateTime)}`;
        const meta = shift.notes ? `${timeLabel} | ${shift.notes}` : timeLabel;

        return this.renderSnapshotItem(dateLabel, meta, formatCurrency(payData.grossPay));
      }).join("");
    },

    renderDashboardSubscriptionPreview() {
      const visibleSubscriptions = this.state.subscriptions
        .slice()
        .sort((left, right) => compareDateKeys(left.nextCharge, right.nextCharge))
        .slice(0, 4);

      if (visibleSubscriptions.length === 0) {
        this.dom.dashboardSubscriptionPreview.innerHTML = '<p class="empty-state">No subscriptions saved yet.</p>';
        return;
      }

      this.dom.dashboardSubscriptionPreview.innerHTML = visibleSubscriptions
        .map((subscription) => this.renderSnapshotItem(
          subscription.name,
          `${subscription.frequency} | next charge ${formatDate(subscription.nextCharge)}`,
          formatCurrency(toNumber(subscription.amount))
        ))
        .join("");
    },

    renderDashboardExpensePreview() {
      const visibleExpenses = this.state.expenses
        .slice()
        .sort((left, right) => compareDateKeys(right.date, left.date))
        .slice(0, 4);

      if (visibleExpenses.length === 0) {
        this.dom.dashboardExpensePreview.innerHTML = '<p class="empty-state">No expenses saved yet.</p>';
        return;
      }

      this.dom.dashboardExpensePreview.innerHTML = visibleExpenses
        .map((expense) => this.renderSnapshotItem(
          expense.category,
          `${formatDate(expense.date)}${expense.merchant ? ` | ${expense.merchant}` : ""}`,
          formatCurrency(toNumber(expense.amount))
        ))
        .join("");
    },

    renderDashboardGoalPreview() {
      const visibleGoals = this.state.savingsGoals.slice(0, 3);

      if (visibleGoals.length === 0) {
        this.dom.dashboardGoalPreview.innerHTML = '<p class="empty-state">No savings goals saved yet.</p>';
        return;
      }

      this.dom.dashboardGoalPreview.innerHTML = visibleGoals.map((goal) => {
        const target = toNumber(goal.targetAmount);
        const current = toNumber(goal.currentAmount);
        const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
        const projection = getGoalProjection(goal);

        return `
          <div class="snapshot-item">
            <div>
              <strong>${goal.name}</strong>
              <p class="snapshot-meta">${formatCurrency(current)} saved of ${formatCurrency(target)}</p>
              <div class="progress-shell">
                <div class="progress-fill" style="width: ${progress}%"></div>
              </div>
              <p class="snapshot-meta">${projection.targetDateMessage}</p>
            </div>
            <div class="snapshot-value">${progress.toFixed(0)}%</div>
          </div>
        `;
      }).join("");
    },

    renderSalaryPreview() {
      const payPeriods = buildPayPeriods(this.state.shifts, this.state.settings, this.state.holidays);
      const latest = payPeriods[0];
      const previewCards = latest ? [
        this.renderSummaryCard("Pay period", `${formatShortDate(latest.startKey)} - ${formatShortDate(latest.endKey)}`),
        this.renderSummaryCard("Gross pay", formatCurrency(latest.grossPay)),
        this.renderSummaryCard("Estimated tax", formatCurrency(latest.tax)),
        this.renderSummaryCard("Estimated net", formatCurrency(latest.netPay))
      ] : [
        this.renderSummaryCard("Pay period", "No shifts yet"),
        this.renderSummaryCard("Gross pay", formatCurrency(0)),
        this.renderSummaryCard("Estimated tax", formatCurrency(0)),
        this.renderSummaryCard("Estimated net", formatCurrency(0))
      ];

      this.dom.salaryPreview.innerHTML = previewCards.join("");
    },

    renderSummaryCard(label, value) {
      return `
        <article class="summary-card">
          <span>${label}</span>
          <strong>${value}</strong>
        </article>
      `;
    },

    renderHolidayList() {
      if (this.state.holidays.length === 0) {
        this.dom.holidayList.innerHTML = '<p class="empty-state">No public holidays saved yet.</p>';
        return;
      }

      const notes = OFFICIAL_HOLIDAY_NOTES[this.state.settings.workState] || [];

      this.dom.holidayList.innerHTML = this.state.holidays
        .slice()
        .sort((left, right) => {
          const byDate = compareDateKeys(left.date, right.date);
          return byDate || left.startMinute - right.startMinute;
        })
        .map((holiday) => `
          <div class="chip">
            <span>${formatShortDate(holiday.date)} • ${holiday.label} • ${formatHolidayRange(holiday)}${holiday.isOfficial ? " • Official" : " • Manual"}</span>
            <button class="chip-button" data-action="delete-holiday" data-id="${holiday.id}" type="button">Remove</button>
          </div>
        `)
        .join("");

      if (notes.length) {
        this.dom.holidayList.innerHTML += `<p class="empty-state">${notes.join(" ")}</p>`;
      }
    },

    renderRatePreview() {
      const settings = this.state.settings;
      const rows = [
        ["Weekday", settings.rates.weekday],
        ["Saturday", settings.rates.saturday],
        ["Sunday", settings.rates.sunday],
        ["Public holiday", settings.rates.publicHoliday]
      ];

      this.dom.ratePreview.innerHTML = `
        <div class="rate-preview-table">
          <div class="rate-preview-row rate-preview-header">
            <span>Day type</span>
            <span>Day</span>
            <span>Evening</span>
            <span>Overnight</span>
          </div>
          ${rows.map(([label, rates]) => `
            <div class="rate-preview-row">
              <span>${label}</span>
              <span>${toNumber(rates.day) ? formatCurrency(toNumber(rates.day)) : "—"}</span>
              <span>${toNumber(rates.evening) ? formatCurrency(toNumber(rates.evening)) : "Fallback"}</span>
              <span>${toNumber(rates.overnight) ? formatCurrency(toNumber(rates.overnight)) : "Fallback"}</span>
            </div>
          `).join("")}
        </div>
        <p class="card-note">
          ${this.state.settings.jobLabel || "Job"} • ${this.state.settings.awardName || "Award not saved yet"}${this.state.settings.awardCode ? ` (${this.state.settings.awardCode})` : ""} • ${STATE_LABELS[this.state.settings.workState] || "No state saved"}
        </p>
      `;
    },

    renderPayPeriods() {
      const periods = buildPayPeriods(this.state.shifts, this.state.settings, this.state.holidays);

      if (periods.length === 0) {
        this.dom.payPeriodList.innerHTML = '<p class="empty-state">Save some shifts and your pay runs will appear here automatically.</p>';
        return;
      }

      this.dom.payPeriodList.innerHTML = periods
        .map((period) => `
          <article class="period-card">
            <div class="period-head">
              <div>
                <h3>${formatShortDate(period.startKey)} - ${formatShortDate(period.endKey)}</h3>
                <p>${period.shiftCount} shift${period.shiftCount === 1 ? "" : "s"} • ${formatHours(period.paidHours)}</p>
              </div>
              <div class="goal-amount period-total">
                <span>Estimated take-home</span>
                <strong>${formatCurrency(period.netPay)}</strong>
              </div>
            </div>
            <div class="period-grid">
              ${this.renderPayStat("Gross", formatCurrency(period.grossPay))}
              ${this.renderPayStat("Estimated tax", formatCurrency(period.tax))}
              ${this.renderPayStat("Estimated net", formatCurrency(period.netPay))}
            </div>
          </article>
        `)
        .join("");
    },

    renderCalendar() {
      const monthKey = this.state.activeCalendarMonth || getTodayKey().slice(0, 7);
      const monthDate = parseMonthKey(monthKey);
      const days = buildCalendarDays(monthKey, this.state.shifts, this.state.settings, this.state.holidays);
      const monthLabel = MONTH_FORMATTER.format(monthDate);
      const calendarMarkup = [
        ...WEEKDAY_NAMES.map((weekday) => `<div class="calendar-day-name">${weekday}</div>`),
        ...days.map((day) => {
          const classes = [
            "calendar-cell",
            day.inMonth ? "" : "is-outside-month",
            day.isToday ? "is-today" : "",
            day.holidayLabel ? "is-holiday" : ""
          ].filter(Boolean).join(" ");
          const visibleEntries = day.entries.slice(0, 3);
          const extraEntries = day.entries.length - visibleEntries.length;

          return `
            <article class="${classes}">
              <div class="calendar-cell-head">
                <div class="calendar-date">${day.dayNumber}</div>
                <div class="calendar-day-summary">
                  ${day.holidayLabel ? `<div>${day.holidayLabel}</div>` : ""}
                  ${day.shiftCount ? `<div>${day.shiftCount} shift${day.shiftCount === 1 ? "" : "s"}</div>` : ""}
                  ${day.totalHours ? `<div>${formatHours(day.totalHours)}</div>` : ""}
                </div>
              </div>
              <div class="calendar-items">
                ${visibleEntries.map((entry) => `
                  <div class="calendar-shift ${entry.isHoliday ? "is-holiday" : ""}">
                    <span class="calendar-shift-time">${entry.label}</span>
                    <span class="calendar-shift-meta">${formatHours(entry.hours)} • ${formatCurrency(entry.pay)}</span>
                    ${entry.notes ? `<span class="calendar-shift-meta">${entry.notes}</span>` : ""}
                  </div>
                `).join("")}
                ${extraEntries > 0 ? `<div class="calendar-empty">+${extraEntries} more shift${extraEntries === 1 ? "" : "s"}</div>` : ""}
                ${day.entries.length === 0 && day.inMonth ? '<div class="calendar-empty">No shifts saved.</div>' : ""}
              </div>
            </article>
          `;
        })
      ].join("");

      this.dom.calendarMonthLabel.textContent = monthLabel;
      this.dom.calendarGrid.innerHTML = calendarMarkup;

      if (this.dom.dashboardCalendarMonthLabel) {
        this.dom.dashboardCalendarMonthLabel.textContent = monthLabel;
      }

      if (this.dom.dashboardCalendarGrid) {
        this.dom.dashboardCalendarGrid.innerHTML = calendarMarkup;
      }
    },

    renderPayStat(label, value) {
      return `
        <div class="pay-stat">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `;
    },

    renderShiftList() {
      if (this.state.shifts.length === 0) {
        this.dom.shiftList.innerHTML = '<p class="empty-state">No shifts saved yet.</p>';
        return;
      }

      const entries = this.state.shifts
        .slice()
        .sort((left, right) => compareDateKeys(right.date, left.date))
        .map((shift) => {
          const payData = calculateShift(shift, this.state.settings, this.state.holidays);
          const totalHours = payData.totalMinutes / 60;
          const paidHours = payData.paidMinutes / 60;
          const shiftFlags = [];

          if (payData.isOvernight) {
            shiftFlags.push('<span class="badge">Overnight</span>');
          }

          if (payData.publicHolidayMinutes > 0) {
            shiftFlags.push('<span class="badge">Public holiday hours</span>');
          }

          return `
            <article class="entry-card">
              <div class="entry-head">
                <div>
                  <h3>${WEEKDAY_FORMATTER.format(parseDateKey(shift.date))}</h3>
                  <p>${TIME_FORMATTER.format(parseDateTime(shift.date, shift.startTime))} - ${TIME_FORMATTER.format(getShiftEndDateTime(shift))}</p>
                </div>
                <div class="entry-amount">${formatCurrency(payData.grossPay)}</div>
              </div>
              <div class="badge-row">${shiftFlags.join("")}</div>
              <div class="entry-meta">
                ${this.renderPayStat("Worked", formatHours(totalHours))}
                ${this.renderPayStat("Paid after break", formatHours(paidHours))}
                ${this.renderPayStat("Break", `${payData.breakMinutes} min`)}
                ${this.renderPayStat("Tax estimate", formatCurrency(estimatePay(payData.grossPay, this.state.settings).periodTax))}
              </div>
              <div class="segment-list">
                ${payData.segments.map((segment) => `
                  <p class="segment-line">
                    ${formatShortDate(segment.dateKey)} • ${DAY_TYPE_LABELS[segment.dayType]} ${BAND_LABELS[segment.band]} •
                    ${formatHours(segment.paidMinutes / 60)} @ ${formatCurrency(segment.rate)} = ${formatCurrency(segment.pay)}
                  </p>
                `).join("")}
              </div>
              ${shift.notes ? `<p class="entry-note">${shift.notes}</p>` : ""}
              <div class="entry-actions">
                <button class="button danger-button" data-action="delete-shift" data-id="${shift.id}" type="button">Delete shift</button>
              </div>
            </article>
          `;
        });

      this.dom.shiftList.innerHTML = entries.join("");
    },

    renderExpenseSummary() {
      const summary = summarizeExpenses(this.state.expenses);
      this.dom.expenseSummary.innerHTML = [
        this.renderSummaryCard("This month", formatCurrency(summary.monthTotal)),
        this.renderSummaryCard("Last 30 days", formatCurrency(summary.lastThirtyDays)),
        this.renderSummaryCard("Average expense", formatCurrency(summary.averageExpense)),
        this.renderSummaryCard("Entries", String(summary.count))
      ].join("");
    },

    renderExpenseList() {
      if (this.state.expenses.length === 0) {
        this.dom.expenseList.innerHTML = '<p class="empty-state">No expenses saved yet.</p>';
        return;
      }

      this.dom.expenseList.innerHTML = this.state.expenses
        .slice()
        .sort((left, right) => compareDateKeys(right.date, left.date))
        .map((expense) => `
          <article class="entry-card">
            <div class="entry-head">
              <div>
                <h3>${expense.category}</h3>
                <p>${formatDate(expense.date)}${expense.merchant ? ` • ${expense.merchant}` : ""}</p>
              </div>
              <div class="entry-amount">${formatCurrency(toNumber(expense.amount))}</div>
            </div>
            ${expense.note ? `<p class="entry-note">${expense.note}</p>` : ""}
            <div class="entry-actions">
              <button class="button danger-button" data-action="delete-expense" data-id="${expense.id}" type="button">Delete expense</button>
            </div>
          </article>
        `)
        .join("");
    },

    renderSubscriptionSummary() {
      const summary = summarizeSubscriptions(this.state.subscriptions);
      this.dom.subscriptionSummary.innerHTML = [
        this.renderSummaryCard("Monthly equivalent", formatCurrency(summary.monthly)),
        this.renderSummaryCard("Yearly equivalent", formatCurrency(summary.yearly)),
        this.renderSummaryCard("Next 30 days", formatCurrency(summary.upcoming)),
        this.renderSummaryCard("Subscriptions", String(summary.count))
      ].join("");
    },

    renderSubscriptionList() {
      if (this.state.subscriptions.length === 0) {
        this.dom.subscriptionList.innerHTML = '<p class="empty-state">No subscriptions saved yet.</p>';
        return;
      }

      this.dom.subscriptionList.innerHTML = this.state.subscriptions
        .slice()
        .sort((left, right) => compareDateKeys(left.nextCharge, right.nextCharge))
        .map((subscription) => `
          <article class="entry-card">
            <div class="entry-head">
              <div>
                <h3>${subscription.name}</h3>
                <p>${subscription.frequency} • next charge ${formatDate(subscription.nextCharge)}</p>
              </div>
              <div class="entry-amount">${formatCurrency(toNumber(subscription.amount))}</div>
            </div>
            <div class="entry-meta">
              ${this.renderPayStat("Monthly", formatCurrency(getMonthlyEquivalent(subscription)))}
              ${this.renderPayStat("Yearly", formatCurrency(getYearlyEquivalent(subscription)))}
              ${this.renderPayStat("Next charge", formatDate(subscription.nextCharge))}
              ${this.renderPayStat("Amount", formatCurrency(toNumber(subscription.amount)))}
            </div>
            ${subscription.note ? `<p class="entry-note">${subscription.note}</p>` : ""}
            <div class="entry-actions">
              <button class="button danger-button" data-action="delete-subscription" data-id="${subscription.id}" type="button">Delete subscription</button>
            </div>
          </article>
        `)
        .join("");
    },

    renderSavingsSummary() {
      const summary = summarizeSavings(this.state.savingsGoals);
      this.dom.savingsSummary.innerHTML = [
        this.renderSummaryCard("Saved", formatCurrency(summary.saved)),
        this.renderSummaryCard("Target", formatCurrency(summary.target)),
        this.renderSummaryCard("Remaining", formatCurrency(summary.remaining)),
        this.renderSummaryCard("Monthly plan", formatCurrency(summary.monthly))
      ].join("");
    },

    renderSavingsGoals() {
      if (this.state.savingsGoals.length === 0) {
        this.dom.goalList.innerHTML = '<p class="empty-state">No savings goals saved yet.</p>';
        return;
      }

      this.dom.goalList.innerHTML = this.state.savingsGoals.map((goal) => {
        const target = toNumber(goal.targetAmount);
        const current = toNumber(goal.currentAmount);
        const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
        const projection = getGoalProjection(goal);
        const paceText = Number.isFinite(projection.monthsAtCurrentPace)
          ? `About ${projection.monthsAtCurrentPace.toFixed(1)} months at your current pace.`
          : "No monthly contribution set yet.";

        return `
          <article class="goal-card">
            <div class="goal-head">
              <div>
                <h3>${goal.name}</h3>
                <p>${formatCurrency(current)} saved of ${formatCurrency(target)}</p>
              </div>
              <div class="goal-amount">${progress.toFixed(0)}%</div>
            </div>
            <div class="progress-shell">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="entry-meta">
              ${this.renderPayStat("Saved", formatCurrency(current))}
              ${this.renderPayStat("Remaining", formatCurrency(projection.remaining))}
              ${this.renderPayStat("Monthly plan", formatCurrency(toNumber(goal.monthlyContribution)))}
              ${this.renderPayStat("Target date", goal.targetDate ? formatDate(goal.targetDate) : "Not set")}
            </div>
            <p class="entry-note">${paceText}</p>
            <p class="entry-note">${projection.targetDateMessage}</p>
            <div class="goal-actions">
              <button class="button danger-button" data-action="delete-goal" data-id="${goal.id}" type="button">Delete goal</button>
            </div>
          </article>
        `;
      }).join("");
    },

    renderDebtSummary() {
      const summary = summarizeDebts(this.state.debts);
      this.dom.debtSummary.innerHTML = [
        this.renderSummaryCard("Total balance", formatCurrency(summary.totalBalance)),
        this.renderSummaryCard("Monthly repayments", formatCurrency(summary.monthlyRepayments)),
        this.renderSummaryCard("Average interest", `${summary.averageInterestRate.toFixed(2)}%`),
        this.renderSummaryCard("Due in 30 days", String(summary.dueSoon))
      ].join("");
    },

    renderDebtList() {
      if (this.state.debts.length === 0) {
        this.dom.debtList.innerHTML = '<p class="empty-state">No debts saved yet.</p>';
        return;
      }

      this.dom.debtList.innerHTML = this.state.debts
        .slice()
        .sort((left, right) => {
          const leftDue = left.dueDate || "9999-12-31";
          const rightDue = right.dueDate || "9999-12-31";
          return compareDateKeys(leftDue, rightDue);
        })
        .map((debt) => `
          <article class="entry-card">
            <div class="entry-head">
              <div>
                <h3>${debt.name}</h3>
                <p>${debt.provider ? debt.provider : "No lender saved"}${debt.dueDate ? ` | due ${formatDate(debt.dueDate)}` : ""}</p>
              </div>
              <div class="entry-amount">${formatCurrency(toNumber(debt.balance))}</div>
            </div>
            <div class="entry-meta">
              ${this.renderPayStat("Balance", formatCurrency(toNumber(debt.balance)))}
              ${this.renderPayStat("Monthly repayment", formatCurrency(toNumber(debt.monthlyPayment)))}
              ${this.renderPayStat("Interest", toNumber(debt.interestRate) ? `${toNumber(debt.interestRate).toFixed(2)}%` : "Not set")}
              ${this.renderPayStat("Due date", debt.dueDate ? formatDate(debt.dueDate) : "Not set")}
            </div>
            ${debt.note ? `<p class="entry-note">${debt.note}</p>` : ""}
            <div class="entry-actions">
              <button class="button danger-button" data-action="delete-debt" data-id="${debt.id}" type="button">Delete debt</button>
            </div>
          </article>
        `)
        .join("");
    }
  };

  const exported = {
    STORAGE_KEY,
    createDefaultState,
    createDefaultSettings,
    createDefaultProfile,
    mergeState,
    serializeState,
    createUniqueProfileName,
    createUniqueUsername,
    buildBaseUsername,
    normalizeEmail,
    normalizePin,
    calculateShift,
    getPayPeriod,
    buildPayPeriods,
    createOfficialHolidayEntries,
    syncOfficialHolidays,
    normalizeHoliday,
    formatHolidayRange,
    estimatePay,
    buildCalendarDays,
    summarizeExpenses,
    summarizeSubscriptions,
    summarizeSavings,
    summarizeDebts,
    getGoalProjection,
    parseDateKey,
    toDateKey
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = exported;
  }

  global.ShiftwiseAU = exported;

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
      if (document.body?.dataset?.shiftwiseApp === "main") {
        app.init();
      }
    });
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
