
try {
const { useState, useMemo, useRef, useEffect, useLayoutEffect } = React;
// グラフ部品(Recharts)は大きいので、ページを開いた直後は待たずに画面を出し、読み込めたらここで部品を取り出す
let AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid;
function bindRecharts() {
  const R = window.Recharts;
  if (!R) return false;
  ({ AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } = R);
  return true;
}
function useRechartsReady() {
  const [state, setState] = useState(() => (bindRecharts() ? "ready" : "wait"));
  useEffect(() => {
    if (state !== "wait") return;
    let cancelled = false;
    const p = window.__rechartsPromise;
    if (p && p.then) {
      p.then(
        () => {
          if (!cancelled) setState(bindRecharts() ? "ready" : "error");
        },
        () => {
          if (!cancelled) setState("error");
        }
      );
      return () => {
        cancelled = true;
      };
    }
    const id = setInterval(() => {
      if (bindRecharts()) {
        clearInterval(id);
        if (!cancelled) setState("ready");
      }
    }, 100);
    const giveUp = setTimeout(() => {
      clearInterval(id);
      if (!cancelled) setState("error");
    }, 20000);
    return () => {
      cancelled = true;
      clearInterval(id);
      clearTimeout(giveUp);
    };
  }, [state]);
  return state;
}

function Icon({ paths, size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {paths}
    </svg>
  );
}
const TrendingUp = (props) => (
  <Icon {...props} paths={<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>} />
);
const BarChart3 = (props) => (
  <Icon {...props} paths={<><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></>} />
);
const Calendar = (props) => (
  <Icon {...props} paths={<><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></>} />
);
const Clock = (props) => (
  <Icon {...props} paths={<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>} />
);
const Upload = (props) => (
  <Icon {...props} paths={<><path d="M12 3v12" /><polyline points="7 8 12 3 17 8" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></>} />
);
const Download = (props) => (
  <Icon {...props} paths={<><path d="M12 15V3" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>} />
);
const Play = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);
const XIcon = (props) => (
  <Icon {...props} paths={<><path d="M18 6 6 18" /><path d="M6 6l12 12" /></>} />
);
const Bell = (props) => (
  <Icon {...props} paths={<><path d="M6 8a6 6 0 0 1 12 0c0 3 1 4.5 2 6H4c1-1.5 2-3 2-6" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>} />
);
const ShareIcon = (props) => (
  <Icon {...props} paths={<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 10.6 15.4 6.4" /><path d="M8.6 13.4 15.4 17.6" /></>} />
);
const Dice = (props) => (
  <Icon {...props} paths={<><rect width="18" height="18" x="3" y="3" rx="3" /><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" /><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" /><circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" /><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></>} />
);
const MessageIcon = (props) => (
  <Icon {...props} paths={<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />} />
);
const Thermometer = (props) => (
  <Icon {...props} paths={<><path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" /><path d="M12 14v3" /></>} />
);
const PieIcon = (props) => (
  <Icon {...props} paths={<><path d="M21.2 15.3A10 10 0 1 1 10 2.1" /><path d="M21.2 15.3 12 12V2a10 10 0 0 1 9.2 13.3z" /></>} />
);
const Grid = (props) => (
  <Icon {...props} paths={<><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></>} />
);
const Search = (props) => (
  <Icon {...props} paths={<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>} />
);
const CalendarRange = (props) => (
  <Icon {...props} paths={<><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /></>} />
);
const Scale = (props) => (
  <Icon {...props} paths={<><path d="M12 3v18" /><path d="M5 7h14" /><path d="M5 7 3 13a2.5 2.5 0 0 0 5 0z" /><path d="M19 7l-2 6a2.5 2.5 0 0 0 5 0z" /></>} />
);
const Sun = (props) => (
  <Icon {...props} paths={<><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="M4.9 4.9l1.4 1.4" /><path d="M17.7 17.7l1.4 1.4" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="M4.9 19.1l1.4-1.4" /><path d="M17.7 6.3l1.4-1.4" /></>} />
);
const Moon = (props) => (
  <Icon {...props} paths={<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />} />
);
function Star({ size = 14, filled, color }) {
  const c = color || (filled ? "#FFC53D" : "currentColor");
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? c : "none"} stroke={c} strokeWidth={filled ? 0 : 2} strokeLinejoin="round">
      <path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.1 1.3-6.5L2.5 9.3l6.6-.7z" />
    </svg>
  );
}
function Flame({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="flameOuter" x1="0" y1="22" x2="0" y2="2">
          <stop offset="0%" stopColor="#E8432F" />
          <stop offset="50%" stopColor="#FF8A3D" />
          <stop offset="100%" stopColor="#FFD764" />
        </linearGradient>
        <linearGradient id="flameInner" x1="0" y1="19" x2="0" y2="7">
          <stop offset="0%" stopColor="#FF7A3D" />
          <stop offset="100%" stopColor="#FFF3C4" />
        </linearGradient>
      </defs>
      <path
        d="M12.4 2.2c.6 2.4-.7 3.9-2.1 5.6C8.7 9.5 7.3 11.4 7.3 14a4.9 4.9 0 0 0 4.9 4.9c2.8 0 5-2.2 4.9-4.9-.1-1.9-1.1-3.2-1.9-4.6-.5.9-.8 1.9-.7 2.9.1 1-.4 1.9-1.4 1.9-1 0-1.6-.9-1.5-1.9.2-1.6 1.5-2.9 1.6-4.6.1-1.9-.9-3.6-1.8-5.5z"
        fill="url(#flameOuter)"
      />
      <path
        d="M12.1 10.3c.5 1 .1 2-.5 2.9-.5.7-.8 1.5-.6 2.3.3 1.1 1.4 1.7 2.3 1.4 1.1-.3 1.7-1.5 1.4-2.6-.3-1-1.2-1.6-1.6-2.6-.3-.6-.4-1-1-1.4z"
        fill="url(#flameInner)"
        opacity="0.85"
      />
    </svg>
  );
}

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const THEME_DARK = {
  bg: "radial-gradient(circle at 18% -8%, rgba(79,140,255,0.18), transparent 55%), radial-gradient(circle at 100% 105%, rgba(255,166,61,0.16), transparent 55%), #0E0E14",
  panel: "#1D1A26",
  panel2: "#19151F",
  stroke: "#2C2736",
  text: "#F5F3FA",
  sub: "#9A93AC",
  subtle: "#655E78",
  green: "#30E07E",
  greenDim: "rgba(48,224,126,0.16)",
  red: "#FF5C7A",
  redDim: "rgba(255,92,122,0.16)",
  a: "#4F8CFF",
  b: "#FFA63D",
  grid: "#2A2538",
};

const THEME_LIGHT = {
  bg: "radial-gradient(circle at 18% -8%, rgba(79,140,255,0.10), transparent 55%), radial-gradient(circle at 100% 105%, rgba(255,166,61,0.10), transparent 55%), #F5F3FA",
  panel: "#FFFFFF",
  panel2: "#F1EEF7",
  stroke: "#E3DFEE",
  text: "#241F2E",
  sub: "#6B6480",
  subtle: "#9A93AC",
  green: "#1FAE62",
  greenDim: "rgba(31,174,98,0.12)",
  red: "#E0405F",
  redDim: "rgba(224,64,95,0.12)",
  a: "#2E6FE0",
  b: "#CC7A1E",
  grid: "#E3DFEE",
};

const ACCENT_PRESETS = {
  default: { label: "既定", a: null, b: null },
  purple: { label: "パープル", a: "#9D7CFF", b: "#FF7CC8" },
  mint: { label: "ミント", a: "#2FCBA3", b: "#3DB1FF" },
  sunset: { label: "サンセット", a: "#FF6F6F", b: "#FFC24B" },
  mono: { label: "モノトーン", a: "#9099A8", b: "#D9A441" },
};

const C = Object.assign({}, THEME_DARK);

const RANGES = [
  { key: "1W", label: "1週間", days: 7 },
  { key: "2W", label: "2週間", days: 14 },
  { key: "1M", label: "1ヶ月", days: 30 },
  { key: "ALL", label: "全期間", days: 9999 },
];

const PAGES = [
  { key: "overview", label: "概要", icon: TrendingUp },
  { key: "detail", label: "詳細", icon: BarChart3 },
  { key: "history", label: "履歴", icon: Calendar },
  { key: "streak", label: "記録", icon: Flame },
  { key: "hourly", label: "時間帯", icon: Clock },
];

const EXTRA_PAGES = [
  { key: "breakdown", label: "内訳", icon: PieIcon },
  { key: "calendarmap", label: "カレンダー", icon: Grid },
  { key: "search", label: "検索", icon: Search },
  { key: "monthly", label: "月次", icon: CalendarRange },
  { key: "compare", label: "比較", icon: Scale },
  { key: "share", label: "シェア", icon: ShareIcon },
  { key: "replay", label: "再生", icon: MessageIcon },
];

const HOUR_SEGMENTS = [
  { key: "night", label: "深夜", range: "0-5時", hours: [0, 1, 2, 3, 4, 5], color: "#8B7CFF" },
  { key: "morning", label: "朝", range: "6-11時", hours: [6, 7, 8, 9, 10, 11], color: "#FFA63D" },
  { key: "afternoon", label: "昼", range: "12-17時", hours: [12, 13, 14, 15, 16, 17], color: "#30E07E" },
  { key: "evening", label: "夜", range: "18-23時", hours: [18, 19, 20, 21, 22, 23], color: "#4F8CFF" },
];

const HOUR_BANDS = [
  { key: "midnight", label: "深夜", range: "0-3時", hours: [0, 1, 2, 3], emoji: "🌙" },
  { key: "dawn", label: "明け方", range: "4-7時", hours: [4, 5, 6, 7], emoji: "🌅" },
  { key: "morning", label: "午前", range: "8-11時", hours: [8, 9, 10, 11], emoji: "☕" },
  { key: "noon", label: "お昼", range: "12-15時", hours: [12, 13, 14, 15], emoji: "🌞" },
  { key: "dusk", label: "夕方", range: "16-19時", hours: [16, 17, 18, 19], emoji: "🌇" },
  { key: "night", label: "夜", range: "20-23時", hours: [20, 21, 22, 23], emoji: "🌃" },
];

const TOPIC_CATEGORIES = [
  { key: "food", label: "ご飯・食事", emoji: "🍚", keywords: ["ご飯", "ごはん", "ランチ", "ディナー", "食べ", "飲み", "カフェ", "ラーメン", "焼肉", "お腹", "お店"] },
  { key: "work", label: "仕事・学校", emoji: "💼", keywords: ["仕事", "会社", "学校", "授業", "会議", "バイト", "残業", "宿題", "テスト", "出勤"] },
  { key: "love", label: "気持ち・愛情", emoji: "💕", keywords: ["好き", "大好き", "愛", "会いたい", "寂しい", "かわいい", "ありがとう", "大切"] },
  { key: "plan", label: "予定・約束", emoji: "📅", keywords: ["明日", "今度", "予定", "約束", "行こう", "会おう", "週末", "来週"] },
  { key: "daily", label: "日常・雑談", emoji: "☀️", keywords: ["眠い", "疲れた", "天気", "暑い", "寒い", "雨", "帰り", "おはよう", "おやすみ"] },
];

// 話題の分類用: キーワードを1つの正規表現にまとめて、1件ずつ何十回も includes しない
const TOPIC_RES = TOPIC_CATEGORIES.map((t) => new RegExp(t.keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")));

const TYPE_LABELS = { text: "テキスト", stamp: "スタンプ", photo: "写真", video: "動画", file: "ファイル", other: "その他" };
const TYPE_MAP = {
  "[スタンプ]": "stamp",
  "[写真]": "photo",
  "[動画]": "video",
  "[ファイル]": "file",
  "[アルバム]": "file",
  "[位置情報]": "other",
  "[音声メッセージ]": "other",
  "[ノート]": "other",
};
const NON_TEXT_PLACEHOLDERS = new Set(Object.keys(TYPE_MAP));

const STOPWORDS = new Set([
  "これ", "それ", "あれ", "この", "その", "あの", "ここ", "そこ", "あそこ",
  "こう", "そう", "どう", "まあ", "えー", "うん", "です", "ます", "した",
  "して", "いる", "ある", "から", "ので", "けど", "でも", "だから", "そして",
  "また", "もう", "まだ", "なんか", "けっこう", "ちょっと", "今日", "明日",
  "笑", "www", "ww", "って", "けど", "だと", "みたい", "ほんと", "ほんとに",
]);
const WORD_RE = /[぀-ヿ一-鿿a-zA-Z0-9]{2,}/g;
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu;

// trimEnd() が取り除く空白類（JS の WhiteSpace + LineTerminator と同じ）
function isWsCode(c) {
  return c === 32 || (c >= 9 && c <= 13) || c === 160 || c === 0x1680 || (c >= 0x2000 && c <= 0x200a) ||
    c === 0x2028 || c === 0x2029 || c === 0x202f || c === 0x205f || c === 0x3000 || c === 0xfeff;
}

function parseLineExport(text) {
  // 通常の改行(\n / \r\n)だけのファイルは高速パス（行配列を作らず直接走査）。それ以外は従来の正規表現パス
  const fast = !/\r(?!\n)|[\u2028\u2029]/.test(text);
  let chatTitle = null;
  const dateRe = /^(\d{4})\/(\d{2})\/(\d{2})\(.\)\s*$/;
  const msgRe = /^(\d{2}):(\d{2})\t([^\t]+)\t(.*)$/;

  let curDate = null;
  const dayMap = new Map();
  const senderTotals = new Map();
  const messages = [];

  let curDay = null;
  let curBase = 0;

  const add = (timeStr, hh, mi, sender, content) => {
    // 先頭が空白でなければ trim は不要（末尾は取り込み時に除去済み）。"[" で始まらない文章はプレースホルダ判定を丸ごと省く
    const f0 = content.charCodeAt(0);
    const trimmed = f0 > 32 && f0 < 160 ? content : content.trim();
    const isHolder = trimmed.charCodeAt(0) === 91;
    const msgType = (isHolder && TYPE_MAP[trimmed]) || "text";
    if (!curDay) {
      curDay = { total: 0, bySender: new Map(), chars: 0, hours: new Array(24).fill(0) };
      dayMap.set(curDate, curDay);
    }
    const day = curDay;
    day.total += 1;
    day.bySender.set(sender, (day.bySender.get(sender) || 0) + 1);
    if (hh >= 0 && hh < 24) day.hours[hh] += 1;
    if (!(isHolder && NON_TEXT_PLACEHOLDERS.has(trimmed))) {
      // 文字数（サロゲートペアは1文字として数える）
      let n = content.length;
      for (let k = 0; k < content.length; k++) {
        const cc = content.charCodeAt(k);
        if (cc >= 0xd800 && cc <= 0xdbff) n--;
      }
      day.chars += n;
    }
    senderTotals.set(sender, (senderTotals.get(sender) || 0) + 1);
    messages.push({
      date: curDate,
      time: timeStr,
      sender,
      content,
      type: msgType,
      t: curBase + hh * 60 + mi,
    });
  };
  const setDate = (dm) => {
    curDate = `${dm[1]}-${dm[2]}-${dm[3]}`;
    curDay = dayMap.get(curDate) || null;
    curBase = parseDay(curDate) / 60000;
  };

  if (fast) {
    const n = text.length;
    let nl0 = text.indexOf("\n");
    if (nl0 < 0) nl0 = n;
    let l0 = text.slice(0, nl0);
    if (l0.charCodeAt(l0.length - 1) === 13) l0 = l0.slice(0, -1);
    const titleMatch = /^\[LINE\]\s*(.+?)とのトーク履歴/.exec(l0);
    if (titleMatch) chatTitle = titleMatch[1].trim();

    const recent = []; // 直近に出てきた送信者名（同じ文字列オブジェクトを使い回して比較・ハッシュを速くする）
    let tabAt = -1; // 直近に見つけた「次のタブ」の位置（行ごとに先まで探し直さないため）
    let pos = 0;
    while (pos <= n) {
      const s = pos;
      let e = text.indexOf("\n", pos);
      if (e < 0) e = n;
      pos = e + 1;
      let end = e;
      while (end > s) {
        const c = text.charCodeAt(end - 1);
        if (c > 32 && c < 160) break;
        if (isWsCode(c)) end--;
        else break;
      }
      const len = end - s;
      if (len === 0) continue;
      if (len > 2 && text.charCodeAt(s + 2) === 58) {
        if (curDate === null || len < 8) continue;
        const c0 = text.charCodeAt(s) - 48;
        const c1 = text.charCodeAt(s + 1) - 48;
        const c3 = text.charCodeAt(s + 3) - 48;
        const c4 = text.charCodeAt(s + 4) - 48;
        if (c0 < 0 || c0 > 9 || c1 < 0 || c1 > 9 || c3 < 0 || c3 > 9 || c4 < 0 || c4 > 9) continue;
        if (text.charCodeAt(s + 5) !== 9) continue;
        if (tabAt < s + 6) {
          tabAt = text.indexOf("\t", s + 6);
          if (tabAt < 0) tabAt = n + 1;
        }
        const t2 = tabAt;
        if (t2 <= s + 6 || t2 >= end) continue;
        const sl = t2 - s - 6;
        let sender = null;
        for (let k = 0; k < recent.length; k++) {
          const r = recent[k];
          if (r.length === sl && text.startsWith(r, s + 6)) {
            sender = r;
            break;
          }
        }
        if (sender === null) {
          sender = text.slice(s + 6, t2);
          if (recent.length < 8) recent.push(sender);
        }
        add(text.slice(s, s + 5), c0 * 10 + c1, c3 * 10 + c4, sender, text.slice(t2 + 1, end));
      } else if (len === 13) {
        const dm = dateRe.exec(text.slice(s, end));
        if (dm) setDate(dm);
      }
    }
  } else {
    const lines = text.split(/\r?\n/);
    const titleMatch = /^\[LINE\]\s*(.+?)とのトーク履歴/.exec(lines[0] || "");
    if (titleMatch) chatTitle = titleMatch[1].trim();
    for (let li = 0; li < lines.length; li++) {
      const line = lines[li].trimEnd();
      if (line.length === 0) continue;
      // メッセージ行は "HH:MM\t..." で始まる（3文字目が ":"）。それ以外は日付行かどうかだけ調べる
      if (line.charCodeAt(2) !== 58) {
        const dm = dateRe.exec(line);
        if (dm) setDate(dm);
        continue;
      }
      const mm = msgRe.exec(line);
      if (mm && curDate) {
        add(`${mm[1]}:${mm[2]}`, parseInt(mm[1], 10), parseInt(mm[2], 10), mm[3], mm[4]);
      }
    }
  }

  const dates = [...dayMap.keys()].sort();
  if (dates.length === 0) return null;

  const senders = [...senderTotals.entries()].sort((x, y) => y[1] - x[1]).map(([name]) => name);
  const nameA = senders[0] || "A";
  const nameB = senders[1] || "B";

  const RAW = dates.map((date) => {
    const d = dayMap.get(date);
    return {
      date,
      total: d.total,
      a: d.bySender.get(nameA) || 0,
      b: d.bySender.get(nameB) || 0,
      chars: d.chars,
    };
  });

  const HOURLY_BY_DAY = dates.map((date) => ({ date, hours: dayMap.get(date).hours }));

  return {
    RAW,
    HOURLY_BY_DAY,
    names: { a: nameA, b: nameB },
    chatTitle,
    messageCount: RAW.reduce((s, d) => s + d.total, 0),
    messages,
  };
}

function computeStreaks(data) {
  const streaks = [];
  let runStart = data[0].date;
  let runLen = 1;
  for (let i = 1; i < data.length; i++) {
    const diffDays = Math.round((parseDay(data[i].date) - parseDay(data[i - 1].date)) / 86400000);
    if (diffDays === 1) {
      runLen++;
    } else {
      streaks.push({ start: runStart, end: data[i - 1].date, length: runLen });
      runStart = data[i].date;
      runLen = 1;
    }
  }
  streaks.push({ start: runStart, end: data[data.length - 1].date, length: runLen });
  return streaks;
}

function fmtShort(d) {
  const [, m, day] = d.split("-");
  return `${parseInt(m)}/${parseInt(day)}`;
}
function fmtLong(d) {
  const [y, m, day] = d.split("-");
  return `${parseInt(m)}月${parseInt(day)}日`;
}
function fmtWeekday(d) {
  const dt = new Date(d + "T00:00:00");
  return ["日", "月", "火", "水", "木", "金", "土"][dt.getDay()];
}
function fmtMinutes(min) {
  if (min < 60) return `${Math.round(min)}分`;
  if (min < 1440) return `${(min / 60).toFixed(1)}時間`;
  return `${(min / 1440).toFixed(1)}日`;
}

const IS_IOS = (() => {
  try {
    const ua = navigator.userAgent || "";
    return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  } catch (e) {
    return false;
  }
})();

function getAudioCtx() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!window.__ltaAudioCtx) window.__ltaAudioCtx = new AudioCtx();
  const ctx = window.__ltaAudioCtx;
  if (ctx.state !== "running") {
    try {
      const p = ctx.resume();
      if (p && p.catch) p.catch(() => {});
    } catch (e) {}
  }
  return ctx;
}

// 全ての効果音はここを通す（スマホの小さいスピーカーでも聞こえるよう音量を持ち上げ、割れないようにコンプレッサーを通す）
function getAudioOut(ctx) {
  if (window.__ltaAudioOut && window.__ltaAudioOut.ctx === ctx) return window.__ltaAudioOut.node;
  const gain = ctx.createGain();
  gain.gain.value = 2.4;
  let node = gain;
  try {
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 12;
    comp.ratio.value = 8;
    comp.attack.value = 0.002;
    comp.release.value = 0.08;
    gain.connect(comp);
    comp.connect(ctx.destination);
  } catch (e) {
    gain.connect(ctx.destination);
  }
  window.__ltaAudioOut = { ctx, node };
  return node;
}

// iPhone: マナースイッチがONでもWeb Audioが鳴るように、無音の<audio>を再生して「再生」扱いにする（最初のタップで1回だけ）
function makeSilentWavUrl() {
  const rate = 8000;
  const n = 800;
  const buf = new ArrayBuffer(44 + n);
  const v = new DataView(buf);
  const w = (o, str) => {
    for (let i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i));
  };
  w(0, "RIFF");
  v.setUint32(4, 36 + n, true);
  w(8, "WAVE");
  w(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  w(36, "data");
  v.setUint32(40, n, true);
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}
function unlockAudio() {
  try {
    if (IS_IOS) {
      try {
        if (navigator.audioSession) navigator.audioSession.type = "playback";
      } catch (e) {}
      if (!window.__ltaSilentAudio) {
        const a = new Audio(makeSilentWavUrl());
        a.loop = true;
        a.setAttribute("playsinline", "");
        window.__ltaSilentAudio = a;
      }
      const pr = window.__ltaSilentAudio.play();
      if (pr && pr.catch) pr.catch(() => {});
    }
    const ctx = getAudioCtx();
    if (ctx) {
      const src = ctx.createBufferSource();
      src.buffer = ctx.createBuffer(1, 1, 22050);
      src.connect(ctx.destination);
      src.start(0);
    }
  } catch (e) {}
}
// 最初のタッチ/クリックで音を使えるようにしておく（スマホは操作の中でしか音を出せないため）
// 画面の長押し・右クリックでの選択/コピーを止める（入力欄と、共有画面の画像の長押し保存だけは残す）
(function setupCopyGuard() {
  try {
    const st = document.createElement("style");
    st.textContent =
      "html,body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}" +
      "input,textarea{-webkit-user-select:text;user-select:text}" +
      "img{-webkit-touch-callout:default}";
    document.head.appendChild(st);
    const allowed = (t) => !!(t && t.closest && t.closest("input,textarea,img"));
    ["copy", "cut", "contextmenu", "selectstart", "dragstart"].forEach((ev) =>
      document.addEventListener(ev, (e) => { if (!allowed(e.target)) e.preventDefault(); }, true)
    );
    // 開発者ツール・ソース表示のショートカットを止める（見えにくくするだけで、完全には防げません）
    document.addEventListener(
      "keydown",
      (e) => {
        const k = (e.key || "").toLowerCase();
        const mod = e.ctrlKey || e.metaKey;
        if (e.key === "F12" || (mod && k === "u") || (mod && e.shiftKey && (k === "i" || k === "j" || k === "c")) || (e.metaKey && e.altKey && (k === "i" || k === "u" || k === "j"))) {
          e.preventDefault();
        }
      },
      true
    );
  } catch (e) {}
})();

(function setupAudioUnlock() {
  try {
  let done = 0;
  const handler = () => {
    unlockAudio();
    // 数回は繰り返す（OSによっては最初の1回で許可されないことがあるため）
    if (++done >= 3) {
      ["touchend", "pointerdown", "click", "keydown"].forEach((t) => window.removeEventListener(t, handler, true));
    }
  };
  ["touchend", "pointerdown", "click", "keydown"].forEach((t) => window.addEventListener(t, handler, true));
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) getAudioCtx();
  });
  } catch (e) {}
})();

async function playTick(freq = 880, duration = 0.08) {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const out = getAudioOut(ctx);
    const t0 = ctx.currentTime;
    // 基音(三角波) + 2倍音(サイン): 小さいスピーカーでも聞き取りやすい
    [[freq, "triangle", 0.2], [freq * 2, "sine", 0.08]].forEach(([f, type, vol]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = f;
      osc.type = type;
      gain.gain.setValueAtTime(vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t0);
      osc.stop(t0 + duration + 0.01);
    });
  } catch (e) {}
}
// 「しゅぽっ！」: LINEのメッセージ送信音のような、丸くてかわいいポップ音
// high=true: 自分側(右) / false: 相手側(左)で少し音程を変える。fast=true: 速い再生向けに短く
function playPop(high, fast) {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const out = getAudioOut(ctx);
    const t0 = ctx.currentTime;
    const dur = fast ? 0.09 : 0.15;
    // しゅ… : ふわっとした息のようなノイズ
    {
      const len = Math.max(64, Math.floor(ctx.sampleRate * 0.04));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const x = i / len;
        data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * Math.min(1, x * 1.2)) * (1 - x);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = high ? 2600 : 2200;
      bp.Q.value = 0.7;
      const g = ctx.createGain();
      g.gain.value = fast ? 0.12 : 0.18;
      src.connect(bp);
      bp.connect(g);
      g.connect(out);
      src.start(t0);
    }
    // ぽっ : 下からやさしく持ち上がる丸い音（落ち着いた低めの音程）
    const f0 = high ? 400 : 320;
    const f1 = high ? 640 : 510;
    const t1 = t0 + 0.03;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f0, t1);
    osc.frequency.exponentialRampToValueAtTime(f1, t1 + dur * 0.5);
    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0.0001, t1);
    g1.gain.linearRampToValueAtTime(0.34, t1 + 0.02);
    g1.gain.exponentialRampToValueAtTime(0.001, t1 + dur);
    osc.connect(g1);
    g1.connect(out);
    osc.start(t1);
    osc.stop(t1 + dur + 0.02);
    // ほんの少しだけ倍音を足して、やわらかく
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(f0 * 2, t1);
    osc2.frequency.exponentialRampToValueAtTime(f1 * 2, t1 + dur * 0.5);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.0001, t1);
    g2.gain.linearRampToValueAtTime(0.045, t1 + 0.015);
    g2.gain.exponentialRampToValueAtTime(0.001, t1 + dur * 0.7);
    osc2.connect(g2);
    g2.connect(out);
    osc2.start(t1);
    osc2.stop(t1 + dur);
  } catch (e) {}
}
// 軽い「カチッ」: very short, high noise ticks (press + release)
function playClick() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const out = getAudioOut(ctx);
    const burst = (at, freq, vol, ms) => {
      const len = Math.max(32, Math.floor(ctx.sampleRate * ms));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = freq;
      bp.Q.value = 1.4;
      const g = ctx.createGain();
      g.gain.value = vol;
      src.connect(bp);
      bp.connect(g);
      g.connect(out);
      src.start(ctx.currentTime + at);
    };
    burst(0, 3200, 1.1, 0.014);
    burst(0.034, 4200, 0.7, 0.01);
  } catch (e) {}
}
function vibrate(pattern) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (e) {}
}
function playCelebration() {
  playTick(660, 0.1);
  setTimeout(() => playTick(880, 0.12), 110);
  setTimeout(() => playTick(1100, 0.16), 230);
  vibrate([40, 30, 40, 30, 80]);
}

async function downloadCSV(rows, names, chatTitle, setCsvStatus) {
  const header = ["date", "total", names.a, names.b, "chars"];
  const lines = [header.join(",")];
  rows.forEach((d) => {
    lines.push([d.date, d.total, d.a, d.b, d.chars || 0].join(","));
  });
  const csv = lines.join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  try {
    const downloads = await window.claude.use("downloads");
    if (!downloads) {
      setCsvStatus && setCsvStatus("この環境では保存できません");
      return;
    }
    await downloads.save({ filename: `${chatTitle || "talk"}_data.csv`, data: blob });
    setCsvStatus && setCsvStatus("保存しました");
  } catch (e) {
    if (e && e.code === "declined") {
      setCsvStatus && setCsvStatus(null);
    } else {
      setCsvStatus && setCsvStatus("保存できませんでした");
    }
  }
}

/* ---------- Image export (canvas) ---------- */
const CV_FONT = '"Hachi Maru Pop", "Hiragino Maru Gothic Pro", sans-serif';

function cvRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function cvText(ctx, s, x, y, size, color, align, maxW) {
  let px = size;
  ctx.font = `700 ${px}px ${CV_FONT}`;
  if (maxW) {
    while (ctx.measureText(String(s)).width > maxW && px > 16) {
      px -= 2;
      ctx.font = `700 ${px}px ${CV_FONT}`;
    }
  }
  ctx.fillStyle = color;
  ctx.textAlign = align || "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(String(s), x, y);
}


/* Save files: Claude's downloads capability when available, otherwise normal mobile/desktop web behaviour */
async function saveFilesAnywhere(files) {
  let dl = null;
  try {
    if (window.claude && window.claude.use) dl = await window.claude.use("downloads");
  } catch (e) {}
  if (dl) {
    for (const f of files) await dl.save({ filename: f.filename, data: f.blob });
    return;
  }
  try {
    const list = files.map((f) => new File([f.blob], f.filename, { type: f.blob.type }));
    if (navigator.canShare && navigator.canShare({ files: list })) {
      await navigator.share({ files: list });
      return;
    }
  } catch (e) {
    if (e && e.name === "AbortError") throw { code: "declined" };
  }
  for (let i = 0; i < files.length; i++) {
    const url = URL.createObjectURL(files[i].blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = files[i].filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    if (i < files.length - 1) await new Promise((r) => setTimeout(r, 400));
  }
}

// 画像を作ったあと、画面いっぱいのプレビュー（共有 / 保存 / 長押し保存）を開く
const ltaShareBus = { open: null };

async function saveCanvasImages(pages, setStatus) {
  try {
    setStatus && setStatus("作成中…");
    try {
      if (document.fonts && document.fonts.load) await document.fonts.load('700 40px "Hachi Maru Pop"');
    } catch (e) {}
    const files = [];
    for (const pg of pages) {
      const canvas = document.createElement("canvas");
      canvas.width = pg.w;
      canvas.height = pg.h;
      pg.draw(canvas.getContext("2d"), pg.w, pg.h);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("no blob");
      files.push({ blob, filename: pg.filename });
    }
    if (ltaShareBus.open) {
      ltaShareBus.open(files);
      setStatus && setStatus(null);
    } else {
      await saveFilesAnywhere(files);
      setStatus && setStatus(files.length > 1 ? `${files.length}枚保存しました` : "保存しました");
    }
  } catch (e) {
    if (e && e.code === "declined") setStatus && setStatus(null);
    else setStatus && setStatus("画像を作れませんでした");
  }
}

function ShareOverlay() {
  const [items, setItems] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const itemsRef = useRef(null);

  const revoke = (list) => {
    if (list) list.forEach((f) => {
      try {
        URL.revokeObjectURL(f.url);
      } catch (e) {}
    });
  };
  useEffect(() => {
    ltaShareBus.open = (files) => {
      revoke(itemsRef.current);
      const list = files.map((f) => {
        let file = null;
        try {
          file = new File([f.blob], f.filename, { type: f.blob.type || "image/png" });
        } catch (e) {}
        return { blob: f.blob, filename: f.filename, file, url: URL.createObjectURL(f.blob) };
      });
      itemsRef.current = list;
      setMsg(null);
      setItems(list);
    };
    return () => {
      ltaShareBus.open = null;
    };
  }, []);

  if (!items) return null;

  const close = () => {
    revoke(itemsRef.current);
    itemsRef.current = null;
    setItems(null);
  };
  const fileList = items.map((f) => f.file).filter(Boolean);
  let canShareFiles = false;
  try {
    canShareFiles = !!(navigator.share && navigator.canShare && fileList.length > 0 && navigator.canShare({ files: fileList }));
  } catch (e) {}

  // 共有: 画像はもう出来ているので、タップの直後にそのまま共有画面を開ける（スマホで拒否されない）
  const doShare = async () => {
    try {
      await navigator.share({ files: fileList });
      setMsg(null);
    } catch (e) {
      if (e && e.name === "AbortError") return;
      setMsg("共有できませんでした。下の画像を長押しして保存してください");
    }
  };
  const doSave = async () => {
    setBusy(true);
    setMsg(null);
    try {
      let dl = null;
      try {
        if (window.claude && window.claude.use) dl = await window.claude.use("downloads");
      } catch (e) {}
      if (dl) {
        for (const f of items) await dl.save({ filename: f.filename, data: f.blob });
        setMsg("保存しました");
      } else {
        for (let i = 0; i < items.length; i++) {
          const a = document.createElement("a");
          a.href = items[i].url;
          a.download = items[i].filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          if (i < items.length - 1) await new Promise((r) => setTimeout(r, 400));
        }
        setMsg("ダウンロードを開始しました。うまくいかないときは画像を長押ししてください");
      }
    } catch (e) {
      if (!(e && e.code === "declined")) setMsg("保存できませんでした。画像を長押しして保存してください");
    }
    setBusy(false);
  };

  const btn = (primary) => ({
    flex: 1,
    border: primary ? "none" : "1px solid rgba(255,255,255,0.22)",
    background: primary ? "linear-gradient(135deg, #FF6FA5, #FFA64D)" : "rgba(255,255,255,0.10)",
    color: "#fff",
    borderRadius: 999,
    padding: "13px 0",
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "inherit",
    cursor: "pointer",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        background: "#0A0A10",
        display: "flex",
        flexDirection: "column",
        fontFamily: "inherit",
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "max(14px, env(safe-area-inset-top)) 16px 10px" }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>画像ができました</div>
        <button
          onClick={close}
          aria-label="閉じる"
          style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.10)", color: "#fff", fontSize: 18, lineHeight: 1, cursor: "pointer", fontFamily: "inherit" }}
        >
          ✕
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch", padding: "0 16px 12px" }}>
        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.7)", textAlign: "center", marginBottom: 10, lineHeight: 1.6 }}>
          下のボタンで共有・保存できます。
          <br />
          画像を長押しして「写真に追加」「画像を保存」もできます。
        </div>
        {items.map((f, i) => (
          <img
            key={i}
            src={f.url}
            alt={f.filename}
            style={{
              display: "block",
              width: "100%",
              maxWidth: 440,
              margin: "0 auto 14px",
              borderRadius: 14,
              WebkitTouchCallout: "default",
              WebkitUserSelect: "auto",
              userSelect: "auto",
            }}
          />
        ))}
      </div>
      <div style={{ padding: "10px 16px max(16px, env(safe-area-inset-bottom))", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        {msg && <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.85)", textAlign: "center", marginBottom: 8, lineHeight: 1.5 }}>{msg}</div>}
        <div style={{ display: "flex", gap: 10, maxWidth: 440, margin: "0 auto" }}>
          {canShareFiles && (
            <button onClick={doShare} style={btn(true)}>
              共有する
            </button>
          )}
          <button onClick={doSave} disabled={busy} style={{ ...btn(!canShareFiles), opacity: busy ? 0.6 : 1 }}>
            {busy ? "保存中…" : "保存する"}
          </button>
        </div>
      </div>
    </div>
  );
}

function saveCanvasImage(draw, w, h, filename, setStatus) {
  return saveCanvasImages([{ draw, w, h, filename }], setStatus);
}

function drawDigestImage(ctx, w, h, d) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, C.a);
  g.addColorStop(1, C.b);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  [[130, 90, 120], [960, 70, 90], [1000, h - 160, 170], [90, h - 120, 110]].forEach(([x, y, r]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.fill();
  });
  cvText(ctx, d.title, w / 2, 92, 34, "rgba(255,255,255,0.92)", "center", w - 160);
  drawStoryDigest(ctx, w, 130, d.digest);
  cvText(ctx, "TALK ANALYTICS 🎀", w / 2, h - 50, 28, "rgba(255,255,255,0.9)", "center");
}

function drawShareImage(ctx, w, h, d) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, C.a);
  g.addColorStop(1, C.b);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const white = "#FFFFFF";
  const soft = "rgba(255,255,255,0.85)";
  cvText(ctx, "TALK ANALYTICS", w / 2, 260, 34, soft, "center");
  cvText(ctx, d.title, w / 2, 400, 78, white, "center", w - 160);
  cvText(ctx, `${d.names.a} ⇄ ${d.names.b}`, w / 2, 470, 44, soft, "center", w - 160);
  const cols = [
    { v: d.total.toLocaleString(), l: "総メッセージ数" },
    { v: d.span, l: "日間" },
    { v: d.longest, l: "最長連続日数" },
  ];
  cols.forEach((c, i) => {
    const x = (w / 3) * i + w / 6;
    cvText(ctx, c.v, x, 760, 92, white, "center", w / 3 - 30);
    cvText(ctx, c.l, x, 830, 34, soft, "center");
  });
  cvText(ctx, `現在${d.current}日連続中 🔥`, w / 2, 1060, 40, soft, "center");
  if (d.topic || d.digest) {
    let top = 1120;
    if (d.topic) {
      drawTopicPanel(ctx, w, top, 640, d.topic, d.names);
      top += 640 + 30;
    }
    if (d.digest) drawStoryDigest(ctx, w, top, d.digest);
    cvText(ctx, "TALK ANALYTICS 🎀", w / 2, h - 50, 28, soft, "center");
  }
}

function drawCompareImage(ctx, w, h, d) {
  ctx.fillStyle = C.bg0 || "#0E0E14";
  ctx.fillRect(0, 0, w, h);
  cvRoundRect(ctx, 50, 50, w - 100, h - 100, 48);
  ctx.fillStyle = C.panel;
  ctx.fill();
  cvText(ctx, "PERIOD COMPARE", 110, 150, 30, C.sub, "left");
  cvText(ctx, d.title, 110, 230, 56, C.text, "left", w - 220);
  const xs = [110, 470, 760, 970];
  cvText(ctx, d.pA.label, xs[1], 360, 34, C.a, "right", 280);
  cvText(ctx, d.pB.label, xs[2], 360, 34, C.b, "right", 280);
  cvText(ctx, "差", xs[3], 360, 34, C.sub, "right");
  cvText(ctx, `${d.pA.start} 〜 ${d.pA.end}`, xs[1], 400, 22, C.sub, "right");
  cvText(ctx, `${d.pB.start} 〜 ${d.pB.end}`, xs[2], 400, 22, C.sub, "right");
  d.table.forEach((r, i) => {
    const y = 500 + i * 120;
    ctx.fillStyle = C.stroke;
    ctx.fillRect(110, y - 70, w - 220, 2);
    cvText(ctx, r.label, xs[0], y, 36, C.sub, "left", 300);
    cvText(ctx, r.a, xs[1], y, 40, C.text, "right");
    cvText(ctx, r.b, xs[2], y, 40, C.text, "right");
    cvText(ctx, r.diff, xs[3], y, 36, r.up === null ? C.sub : r.up ? C.green : C.red, "right");
  });
}

function storyDigestItems(slides) {
  const tiles = [];
  const wides = [];
  slides.forEach((sl, i) => {
    if (i === 0 || sl.kind === "finale" || sl.kind === "bubbles") return;
    if (sl.kind === "text") {
      tiles.push({
        emoji: sl.emoji,
        label: sl.caption,
        value: sl.count !== undefined ? `${sl.count.toLocaleString()}${sl.suffix || ""}` : sl.title,
        sub: sl.sub,
      });
    } else wides.push(sl);
  });
  return { tiles, wides };
}

function summaryImageHeight(hasTopic, digest, base, topicTop, topicH) {
  if (!hasTopic && !digest) return base;
  let top = topicTop;
  if (hasTopic) top += topicH + 30;
  return (digest ? top + storyDigestHeight(digest) : top - 30) + 120;
}

function storyDigestHeight(slides) {
  const { tiles, wides } = storyDigestItems(slides);
  return 160 + Math.ceil(tiles.length / 2) * (168 + 16) + wides.reduce((sum, sl) => sum + (sl.kind === "bar" ? 200 : 210), 0) + 40;
}

function drawStoryDigest(ctx, w, y0, slides) {
  const ink = "#3A3350";
  const mute = "#8C85A3";
  const { tiles, wides } = storyDigestItems(slides);
  const H = storyDigestHeight(slides);
  cvRoundRect(ctx, 60, y0, w - 120, H, 64);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fill();
  cvText(ctx, "✨ ストーリーまとめ", 110, y0 + 90, 44, ink, "left");
  cvText(ctx, "ふたりのトーク 全期間のふり返り", 110, y0 + 134, 24, mute, "left", w - 220);
  const pastel = ["#EAF1FF", "#FFF0F5", "#FFF6E3", "#EAFBF1", "#F3EDFF", "#EDF7FB"];
  const tw = (w - 120 - 60 - 16) / 2;
  tiles.forEach((t, i) => {
    const x = 90 + (i % 2) * (tw + 16);
    const y = y0 + 160 + Math.floor(i / 2) * (168 + 16);
    cvRoundRect(ctx, x, y, tw, 168, 36);
    ctx.fillStyle = pastel[i % pastel.length];
    ctx.fill();
    cvText(ctx, t.emoji, x + 26, y + 66, 46, ink, "left");
    cvText(ctx, t.label, x + 92, y + 56, 22, mute, "left", tw - 110);
    cvText(ctx, t.value, x + tw / 2, y + 116, 46, ink, "center", tw - 40);
    if (t.sub) cvText(ctx, t.sub, x + tw / 2, y + 150, 20, mute, "center", tw - 40);
  });
  let y = y0 + 160 + Math.ceil(tiles.length / 2) * (168 + 16);
  wides.forEach((sl) => {
    cvText(ctx, `${sl.emoji} ${sl.caption}`, 110, y + 44, 26, mute, "left", w - 220);
    if (sl.kind === "bar") {
      const [r0, r1] = sl.rows;
      cvText(ctx, `${r0.label} ${r0.pct}%`, 110, y + 100, 30, C.a, "left", 440);
      cvText(ctx, `${r1.label} ${r1.pct}%`, w - 110, y + 100, 30, C.b, "right", 440);
      const bw = w - 220;
      cvRoundRect(ctx, 110, y + 124, bw, 24, 12);
      ctx.fillStyle = "#EEEAF6";
      ctx.fill();
      ctx.save();
      cvRoundRect(ctx, 110, y + 124, bw, 24, 12);
      ctx.clip();
      ctx.fillStyle = C.a;
      ctx.fillRect(110, y + 124, bw * (r0.pct / 100), 24);
      ctx.fillStyle = C.b;
      ctx.fillRect(110 + bw * (r0.pct / 100), y + 124, bw * (r1.pct / 100), 24);
      ctx.restore();
      y += 200;
    } else {
      const items = sl.items.slice(0, 5);
      const colW = (w - 220) / items.length;
      items.forEach((it, k) => {
        const cx = 110 + colW * (k + 0.5);
        cvText(ctx, it.label, cx, y + 112, sl.emoji === "😆" ? 50 : 32, ink, "center", colW - 12);
        cvText(ctx, `${it.value}回`, cx, y + 156, 22, mute, "center");
      });
      y += 210;
    }
  });
}

function drawSummaryImage(ctx, w, h, d) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, C.a);
  g.addColorStop(1, C.b);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // soft bubbles
  [[130, 150, 150], [960, 110, 100], [1000, 1180, 190], [90, 1240, 120], [880, 330, 55]].forEach(([x, y, r]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.fill();
  });
  const ink = "#3A3350";
  const mute = "#8C85A3";
  cvText(ctx, "✨ ふたりのトークまとめ ✨", w / 2, 150, 54, "#FFFFFF", "center", w - 120);
  cvText(ctx, d.title, w / 2, 225, 40, "rgba(255,255,255,0.92)", "center", w - 160);
  cvText(ctx, d.rangeLabel, w / 2, 280, 28, "rgba(255,255,255,0.8)", "center");

  cvRoundRect(ctx, 60, 320, w - 120, 880, 64);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fill();

  const tileW = (w - 120 - 60 - 24) / 2;
  const tileH = 220;
  d.tiles.forEach((t, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 90 + col * (tileW + 24);
    const y = 350 + row * (tileH + 20);
    cvRoundRect(ctx, x, y, tileW, tileH, 40);
    ctx.fillStyle = t.bg;
    ctx.fill();
    cvText(ctx, t.emoji, x + 34, y + 76, 52, ink, "left");
    cvText(ctx, t.label, x + 104, y + 70, 26, mute, "left", tileW - 130);
    cvText(ctx, t.value, x + tileW / 2, y + 150, 58, ink, "center", tileW - 40);
    if (t.sub) cvText(ctx, t.sub, x + tileW / 2, y + 198, 24, mute, "center", tileW - 40);
  });

  // ratio bar
  const by = 350 + 3 * (tileH + 20) + 30;
  cvText(ctx, `${d.names.a} ${d.aShare}%`, 100, by, 30, C.a, "left", 440);
  cvText(ctx, `${d.names.b} ${100 - d.aShare}%`, w - 100, by, 30, C.b, "right", 440);
  const bx = 100, bw = w - 200, bh = 26, byy = by + 24;
  cvRoundRect(ctx, bx, byy, bw, bh, 13);
  ctx.fillStyle = "#EEEAF6";
  ctx.fill();
  ctx.save();
  cvRoundRect(ctx, bx, byy, bw, bh, 13);
  ctx.clip();
  ctx.fillStyle = C.a;
  ctx.fillRect(bx, byy, bw * (d.aShare / 100), bh);
  ctx.fillStyle = C.b;
  ctx.fillRect(bx + bw * (d.aShare / 100), byy, bw * (1 - d.aShare / 100), bh);
  ctx.restore();

  if (d.topic || d.digest) {
    let top = 1230;
    if (d.topic) {
      drawTopicPanel(ctx, w, top, 650, d.topic, d.names);
      top += 650 + 30;
    }
    if (d.digest) drawStoryDigest(ctx, w, top, d.digest);
    cvText(ctx, "TALK ANALYTICS 🎀", w / 2, h - 50, 28, "rgba(255,255,255,0.9)", "center");
  } else {
    cvText(ctx, "TALK ANALYTICS 🎀", w / 2, 1280, 28, "rgba(255,255,255,0.9)", "center");
  }
}

/* ---------- Period helpers ---------- */
// 日付文字列 -> ミリ秒。同じ日付は何万回も呼ばれるのでキャッシュする
const __dayCache = new Map();
function parseDay(s) {
  let v = __dayCache.get(s);
  if (v === undefined) {
    const [y, m, d] = s.split("-").map(Number);
    v = Date.UTC(y, m - 1, d);
    __dayCache.set(s, v);
  }
  return v;
}
// "HH:MM" の時 (0-23)。文字列を分割せずに読む
function hourOf(m) {
  const t = m.time;
  return (t.charCodeAt(0) - 48) * 10 + (t.charCodeAt(1) - 48);
}
// 日付順に並んだ messages から [startDate, endDate] の範囲だけを取り出す（二分探索。全件を調べない）
function sliceByDate(messages, startDate, endDate) {
  let lo = 0;
  let hi = messages.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (messages[mid].date < startDate) lo = mid + 1;
    else hi = mid;
  }
  const from = lo;
  hi = messages.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (messages[mid].date <= endDate) lo = mid + 1;
    else hi = mid;
  }
  return messages.slice(from, lo);
}
// 曜日 (0=日〜6=土)
const __wdCache = new Map();
function weekdayOf(s) {
  let v = __wdCache.get(s);
  if (v === undefined) {
    v = new Date(parseDay(s)).getUTCDay();
    __wdCache.set(s, v);
  }
  return v;
}
function addDaysStr(s, n) {
  return new Date(parseDay(s) + n * 86400000).toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  return Math.round((parseDay(b) - parseDay(a)) / 86400000) + 1;
}
function summarizePeriod(RAW_D, p) {
  const rows = RAW_D.filter((d) => d.date >= p.start && d.date <= p.end);
  const sum = (k) => rows.reduce((s, d) => s + (d[k] || 0), 0);
  const total = sum("total");
  const days = Math.max(1, daysBetween(p.start, p.end));
  return { ...p, total, a: sum("a"), b: sum("b"), chars: sum("chars"), days, activeDays: rows.length, avg: total / days };
}

/* ---------- Hot topic ---------- */
function minutesOf(m) {
  if (m.t !== undefined) return m.t;
  return parseDay(m.date) / 60000 + parseInt(m.time.slice(0, 2), 10) * 60 + parseInt(m.time.slice(3, 5), 10);
}
const FUN_RE = /笑|ｗ|w{1,}|草|!|！|\?|？|♡|❤|ー{2,}/g;

function liveliness(m) {
  const c = m.content;
  const marks = (c.match(FUN_RE) || []).length + (c.match(EMOJI_RE) || []).length;
  return Math.min(4, marks) * 2 + Math.min(c.length, 40) / 10;
}

const __funCache = new WeakMap();
function funScore(m) {
  let v = __funCache.get(m);
  if (v === undefined) {
    const c = m.content;
    v = Math.min(4, (c.match(FUN_RE) || []).length + (c.match(EMOJI_RE) || []).length);
    __funCache.set(m, v);
  }
  return v;
}

function findHotTopic(messages, startDate) {
  // messages は日付順なので、開始位置を二分探索で見つける（配列のコピーはしない）
  let lo = 0;
  let hi = messages.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (messages[mid].date < startDate) lo = mid + 1;
    else hi = mid;
  }
  // 30分以内のやりとりを1つの「話」としてまとめる（範囲 [i0, i1] だけ持つ）
  const sessions = [];
  let cur = null;
  for (let i = lo; i < messages.length; i++) {
    const t = minutesOf(messages[i]);
    if (cur && t - cur.lastT <= 30) {
      cur.i1 = i;
      cur.lastT = t;
    } else {
      cur = { i0: i, i1: i, startT: t, lastT: t };
      sessions.push(cur);
    }
  }
  // 基本点 + 「盛り上がり」の上限で見込み点を出し、見込みが高い順に調べて、勝てない話は調べない
  const cands0 = [];
  sessions.forEach((ss) => {
    const n = ss.i1 - ss.i0 + 1;
    if (n < 6) return;
    const counts = {};
    for (let i = ss.i0; i <= ss.i1; i++) {
      const sd = messages[i].sender;
      counts[sd] = (counts[sd] || 0) + 1;
    }
    const vals = Object.values(counts).sort((x, y) => y - x);
    if (vals.length < 2) return;
    const balance = vals[1] / vals[0];
    const dur = Math.max(1, ss.lastT - ss.startT);
    const base = n * (0.5 + balance) + Math.min(dur, 120) * 0.05;
    cands0.push({ ss, n, base, ub: base + 6 * n });
  });
  cands0.sort((x, y) => y.ub - x.ub);
  let best = null;
  for (const c of cands0) {
    if (best && c.ub < best.score) break;
    const { ss } = c;
    const texts = [];
    let fun = 0;
    for (let i = ss.i0; i <= ss.i1; i++) {
      const m = messages[i];
      if (m.type !== "text") continue;
      texts.push(m);
      fun += funScore(m);
    }
    const score = c.base + fun * 1.5;
    // 同点のときは時間が早い話を優先（元の並び順どおり）
    if (!best || score > best.score || (score === best.score && ss.i0 < best.ss.i0)) best = { score, ss, texts };
  }
  if (!best) return null;
  const { ss, texts } = best;
  const cands = texts.filter((m) => m.content.trim().length >= 3 && !/https?:\/\//.test(m.content));
  const highlights = cands
    .map((m, i) => ({ m, i, sc: liveliness(m) }))
    .sort((x, y) => y.sc - x.sc)
    .slice(0, 4)
    .sort((x, y) => x.i - y.i)
    .map((x) => x.m);
  const first = messages[ss.i0];
  const last = messages[ss.i1];
  return {
    date: first.date,
    start: first.time,
    end: last.time,
    endDate: last.date,
    count: ss.i1 - ss.i0 + 1,
    durMin: Math.round(ss.lastT - ss.startT),
    highlights,
  };
}

function topicStartDate(RAW_D, rangeKey) {
  const r = RANGES.find((x) => x.key === rangeKey) || RANGES[0];
  const firstD = RAW_D[0].date;
  const lastD = RAW_D[RAW_D.length - 1].date;
  if (r.days >= 9999) return firstD;
  const st = addDaysStr(lastD, -(r.days - 1));
  return st < firstD ? firstD : st;
}

function HotTopicCard({ messages, RAW_D, names, rangeKey, setRangeKey }) {
  const topic = useMemo(() => findHotTopic(messages, topicStartDate(RAW_D, rangeKey)), [messages, RAW_D, rangeKey]);
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>🔥 盛り上がった話</div>
      <RangeSelector rangeKey={rangeKey} setRangeKey={setRangeKey} />
      <Card>
        {!topic ? (
          <div style={{ fontSize: 12, color: C.subtle, textAlign: "center", padding: "10px 0" }}>
            この期間には盛り上がった話が見つかりませんでした
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{fmtLong(topic.date)}</div>
              <div style={{ fontSize: 11, color: C.subtle }}>
                {topic.start}〜{topic.end} ・ {topic.count}件{topic.durMin > 0 ? ` ・ ${topic.durMin}分間` : ""}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {topic.highlights.map((m, i) => {
                const mine = m.sender === names.a;
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-start" : "flex-end" }}>
                    <div style={{ fontSize: 10, color: C.subtle, marginBottom: 2 }}>{m.sender} {m.time}</div>
                    <div
                      style={{
                        maxWidth: "85%",
                        padding: "8px 12px",
                        borderRadius: 16,
                        fontSize: 12.5,
                        lineHeight: 1.5,
                        background: mine ? hexToRgba(C.a, 0.18) : hexToRgba(C.b, 0.18),
                        border: `1px solid ${mine ? hexToRgba(C.a, 0.4) : hexToRgba(C.b, 0.4)}`,
                        wordBreak: "break-word",
                      }}
                    >
                      {m.content.length > 80 ? m.content.slice(0, 80) + "…" : m.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

function cvWrap(ctx, s, x, y, maxW, lineH, maxLines, size, color) {
  ctx.font = `700 ${size}px ${CV_FONT}`;
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  let line = "";
  let lines = [];
  for (const ch of Array.from(String(s))) {
    if (ctx.measureText(line + ch).width > maxW) {
      lines.push(line);
      line = ch;
    } else line += ch;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const arr = Array.from(lines[maxLines - 1]);
    while (arr.length && ctx.measureText(arr.join("") + "…").width > maxW) arr.pop();
    lines[maxLines - 1] = arr.join("") + "…";
  }
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
  return lines.length;
}

function drawTopicPanel(ctx, w, y0, h, t, names) {
  cvRoundRect(ctx, 60, y0, w - 120, h, 64);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fill();
  cvText(ctx, "🔥 盛り上がった話", 110, y0 + 90, 44, "#3A3350", "left");
  const d = t.date.split("-");
  cvText(ctx, `${parseInt(d[1])}/${parseInt(d[2])} ${t.start}〜${t.end} ・ ${t.count}件${t.durMin > 0 ? ` ・ ${t.durMin}分間` : ""}`, 110, y0 + 140, 26, "#8C85A3", "left", w - 220);
  let y = y0 + 200;
  t.highlights.slice(0, 3).forEach((m) => {
    const mine = m.sender === names.a;
    cvText(ctx, `${m.sender} ${m.time}`, 110, y, 24, mine ? C.a : C.b, "left", w - 220);
    const n = cvWrap(ctx, m.content, 130, y + 46, w - 280, 40, 2, 32, "#3A3350");
    y += 46 + n * 40 + 34;
  });
}

function Card({ children, style, onClick, wide }) {
  return (
    <div
      className={wide ? "lta-card lta-wide" : "lta-card"}
      onClick={onClick}
      style={{
        background: C.panel,
        border: `1px solid ${C.stroke}`,
        borderRadius: 20,
        padding: 16,
        boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset, 0 6px 18px rgba(0,0,0,0.25)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function StatTile({ label, value, sub }) {
  return (
    <div
      style={{
        background: C.panel2,
        border: `1px solid ${C.stroke}`,
        borderRadius: 16,
        padding: "12px 14px",
      }}
    >
      <div style={{ fontSize: 11, color: C.sub, marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 10.5, color: C.subtle, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const row = payload[0].payload;
  const deltaColor = row.dayDelta > 0 ? C.green : row.dayDelta < 0 ? C.red : C.subtle;
  const sign = row.dayDelta > 0 ? "+" : "";
  return (
    <div
      style={{
        background: C.panel2,
        border: `1px solid ${C.stroke}`,
        borderRadius: 14,
        padding: "10px 13px",
        fontSize: 12,
        color: C.text,
        boxShadow: "0 10px 28px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ color: C.sub, marginBottom: 5, fontSize: 11 }}>{fmtLong(label)}</div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{row.total}件</div>
      <div style={{ color: deltaColor, fontSize: 11.5, fontWeight: 600 }}>
        {sign}
        {row.dayDelta}（前日比）
      </div>
    </div>
  );
}

function UploadScreen({ onFile, error, loading }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const pick = () => inputRef.current && inputRef.current.click();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <div
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Hachi Maru Pop', 'Hiragino Maru Gothic Pro', sans-serif",
        padding: 16,
        maxWidth: 440,
        margin: "0 auto",
        borderRadius: 28,
      }}
    >
      <div style={{ textAlign: "center", marginTop: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>トーク分析</div>
        <div style={{ fontSize: 12.5, color: C.sub, marginTop: 6 }}>
          トーク履歴ファイル（.txt）を読み込むと、<br />
          株価風チャートでやりとりを振り返れます
        </div>
      </div>

      <div
        onClick={pick}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? C.a : C.stroke}`,
          borderRadius: 20,
          background: dragOver ? "rgba(79,140,255,0.08)" : C.panel,
          padding: "36px 16px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <Upload size={28} color={C.sub} />
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>ここにファイルをドロップ</div>
        <div style={{ fontSize: 11.5, color: C.subtle, marginTop: 4 }}>またはタップして選択</div>
        <input
          ref={inputRef}
          type="file"
          accept=".txt"
          hidden
          onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            if (file) onFile(file);
          }}
        />
      </div>

      {loading && (
        <div style={{ textAlign: "center", fontSize: 12, color: C.sub, marginTop: 14 }}>読み込み中…</div>
      )}
      {error && (
        <div
          style={{
            marginTop: 14,
            padding: "10px 14px",
            borderRadius: 14,
            background: C.redDim,
            color: C.red,
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}

      <Card style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>ファイルの出し方</div>
        <div style={{ fontSize: 11.5, color: C.sub, lineHeight: 1.7 }}>
          トーク画面右上の設定 → 「トーク履歴を送信」→「テキストファイル」を選ぶと書き出せます。
        </div>
      </Card>

      <div style={{ fontSize: 10.5, color: C.subtle, textAlign: "center", marginTop: 14 }}>
        ファイルはこの端末内だけで処理されます。どこにも送信されません。
      </div>
    </div>
  );
}

/* ---------- ページ切り替えタブ（ガラスのスライド） ----------
   選択中のページは小さな外部ストアで持つ。タブだけが再描画されるので、スライド操作中に画面全体が再描画されない */
const navStore = {
  key: "overview",
  subs: new Set(),
  set(k) {
    this.key = k;
    this.subs.forEach((f) => f(k));
  },
};
function useNavKey() {
  const [k, setK] = useState(navStore.key);
  useEffect(() => {
    navStore.subs.add(setK);
    setK(navStore.key);
    return () => {
      navStore.subs.delete(setK);
    };
  }, []);
  return k;
}

function GlassTabs({ items, onSelect, variant }) {
  const activeKey = useNavKey();
  const dragRef = useRef(null); // ドラッグ中の位置(%)。Reactの状態にせず、枠はDOMを直接動かす
  const pillRef = useRef(null);
  const barRef = useRef(null);
  const pressRef = useRef(null);
  const activeRef = useRef(false);
  const rectRef = useRef(null);
  const dragEndedRef = useRef(false);
  const extra = variant === "extra";
  const n = items.length;
  // バーの幅を測って、長い名前（「カレンダー」など）は光る枠に収まる大きさまで文字を小さくする
  const [barW, setBarW] = useState(0);
  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const measure = () => setBarW((v) => (v === el.clientWidth ? v : el.clientWidth));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const labelSize = (label) => {
    if (!extra || !barW) return 10;
    const fit = Math.floor(((barW / n - 7) / Array.from(label).length) * 10) / 10;
    return Math.max(6.5, Math.min(10, fit));
  };
  const w = 100 / n;
  const activeIdx = items.findIndex((p) => p.key === activeKey);
  const clampPct = (d) => Math.min(100 - w, Math.max(0, d - w / 2));
  const pillPct = dragRef.current !== null ? clampPct(dragRef.current) : Math.max(0, activeIdx) * w;
  const movePill = (pct, fast) => {
    const el = pillRef.current;
    if (!el) return;
    // なぞっている間・指を離したときは吸い込みアニメーションなしで、その場で動かす
    el.style.transition = fast ? "none" : "transform 0.16s ease-out, opacity 0.2s ease";
    el.style.opacity = "1";
    el.style.transform = `translate3d(${(pct / w) * 100}%, 0, 0)`;
  };

  const pctAt = (x) => {
    const rect = rectRef.current || (barRef.current && barRef.current.getBoundingClientRect());
    if (!rect) return 0;
    return Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100));
  };
  const onDown = (e) => {
    const x0 = e.clientX;
    clearTimeout(pressRef.current);
    activeRef.current = false;
    let lastIdx = -1;
    const apply = (x) => {
      const pct = pctAt(x);
      dragRef.current = pct;
      movePill(clampPct(pct), true);
      const idx = Math.min(n - 1, Math.max(0, Math.floor((pct / 100) * n)));
      if (idx !== lastIdx) {
        lastIdx = idx;
        onSelect(items[idx].key, true);
      }
    };
    pressRef.current = setTimeout(() => {
      activeRef.current = true;
      // スライド中は位置の測り直しをしない（最初に1回だけ測る）
      rectRef.current = barRef.current ? barRef.current.getBoundingClientRect() : null;
      apply(x0);
    }, 280);
    const onMove = (ev) => {
      if (activeRef.current) apply(ev.clientX);
    };
    const onUp = () => {
      clearTimeout(pressRef.current);
      if (activeRef.current) {
        dragEndedRef.current = true;
        setTimeout(() => {
          dragEndedRef.current = false;
        }, 80);
        // 指を離したところで、止まったページを1回だけ描く
        if (lastIdx >= 0) {
          movePill(lastIdx * w, true);
          const key = items[lastIdx].key;
          // 枠の位置を先に画面へ出してから、ページを描く
          requestAnimationFrame(() => requestAnimationFrame(() => onSelect(key)));
        }
      }
      activeRef.current = false;
      rectRef.current = null;
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return (
    <div
      style={{
        background: C.panel2,
        border: `1px solid ${C.stroke}`,
        borderRadius: 16,
        padding: 4,
        marginBottom: extra ? 14 : 8,
      }}
    >
      <div ref={barRef} onPointerDown={onDown} style={{ position: "relative", display: "flex", touchAction: "none", userSelect: "none" }}>
        <div
          ref={pillRef}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: `${w}%`,
            transform: `translate3d(${(pillPct / w) * 100}%, 0, 0)`,
            transition: "transform 0.16s ease-out, opacity 0.2s ease",
            willChange: "transform",
            opacity: activeIdx === -1 && dragRef.current === null ? 0 : 1,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: extra ? 1 : 2,
              borderRadius: 12,
              background: "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.07) 100%)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.22)",
            }}
          />
        </div>
        {items.map((p) => {
          const Icon2 = p.icon;
          const active = activeKey === p.key;
          return (
            <button
              key={p.key}
              onClick={() => {
                if (pillRef.current) pillRef.current.style.transition = "transform 0.16s ease-out, opacity 0.2s ease";
                onSelect(p.key);
                if (!dragEndedRef.current) {
                  playTick(extra ? 690 : 760, 0.05);
                  vibrate(extra ? 7 : 8);
                }
              }}
              style={{
                position: "relative",
                zIndex: 1,
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: extra ? "column" : "row",
                alignItems: "center",
                justifyContent: "center",
                gap: extra ? 3 : 6,
                background: "transparent",
                color: active ? C.text : C.sub,
                border: "none",
                borderRadius: 12,
                padding: extra ? "7px 0" : "9px 0",
                fontSize: extra ? 10 : 12.5,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: extra ? "nowrap" : undefined,
                transition: extra ? undefined : "color 0.2s ease",
              }}
            >
              <Icon2 size={14} />
              {extra ? <span style={{ fontSize: labelSize(p.label), lineHeight: "14px", height: 14 }}>{p.label}</span> : p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// enabled が true になるまで計算しない useMemo（開いていないページ用の重い集計を後回しにする）
function useLazyMemo(enabled, factory, deps) {
  return useMemo(() => (enabled ? factory() : null), [enabled, ...deps]);
}

function LineChatApp({ RAW, HOURLY_BY_DAY, names, chatTitle, messages, onReset }) {
  const [page, setPage] = useState("overview");
  // タブの見た目（選択中ページ）は外部ストアですぐ動かし、重いページ本体は低優先度の更新(transition)で描く
  useState(() => {
    navStore.key = "overview";
    return 0;
  });
  const pageTimerRef = useRef(null);
  const goPage = (key, defer) => {
    navStore.set(key);
    clearTimeout(pageTimerRef.current);
    const commit = () => {
      if (React.startTransition) React.startTransition(() => setPage(key));
      else setPage(key);
    };
    // タブをスライドして動かしている間は、ページを描かない（指を離したときに、止まったページだけ描く）
    if (defer) return;
    commit();
  };
  // まだ開いていないページ用の重い集計は、そのページを初めて開くまで計算しない
  const visitedRef = useRef(new Set());
  visitedRef.current.add(page);
  // 重い集計は「必要になったとき」か「読み込み後の空き時間」に1回だけ計算して使い回す
  const lazyRef = useRef({ defs: {}, vals: {} });
  const L = lazyRef.current;
  const lazyGet = (name) => {
    if (!(name in L.vals)) L.vals[name] = L.defs[name]();
    return L.vals[name];
  };
  const lazy = (name, enabled, factory) => {
    L.defs[name] = factory;
    return enabled || name in L.vals ? lazyGet(name) : null;
  };
  const seen = (...keys) => keys.some((k) => visitedRef.current.has(k));
  const needHourly = seen("hourly");
  const needBreakdown = seen("breakdown");
  const needRank = seen("breakdown", "calendarmap");
  const needStory = seen("share");
  const [rangeKey, setRangeKey] = useState("1M");
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("lta_theme") === "light" ? "light" : "dark";
    } catch (e) {
      return "dark";
    }
  });

  const [, forceAutoTick] = useState(0);
  useEffect(() => {
    if (theme !== "auto") return;
    const id = setInterval(() => forceAutoTick((t) => t + 1), 60000);
    return () => clearInterval(id);
  }, [theme]);

  const nowHour = new Date().getHours();
  const effectiveTheme = theme === "auto" ? (nowHour >= 6 && nowHour < 18 ? "light" : "dark") : theme;

  // Keep the mutable color token object in sync with the chosen theme + accent
  // on every render, so all components below read the current colors.
  Object.assign(C, effectiveTheme === "dark" ? THEME_DARK : THEME_LIGHT);

  useEffect(() => {
    try {
      document.body.style.background = C.bg;
      document.body.style.colorScheme = effectiveTheme;
    } catch (e) {}
  }, [effectiveTheme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("lta_theme", next);
    } catch (e) {}
    setTheme(next);
    playClick();
    vibrate(10);
  };

  const RAW_D = useMemo(
    () =>
      RAW.map((d, i) => {
        const prevTotal = i === 0 ? d.total : RAW[i - 1].total;
        const dayDelta = d.total - prevTotal;
        const dayPct = prevTotal === 0 ? 0 : (dayDelta / prevTotal) * 100;
        return { ...d, dayDelta, dayPct };
      }),
    [RAW]
  );
  const HOURLY_MAP = useMemo(() => Object.fromEntries(HOURLY_BY_DAY.map((d) => [d.date, d.hours])), [HOURLY_BY_DAY]);

  const range = RANGES.find((r) => r.key === rangeKey);
  const sliced = useMemo(() => {
    const n = Math.min(range.days, RAW_D.length);
    return RAW_D.slice(RAW_D.length - n);
  }, [rangeKey, RAW_D]);

  const latest = RAW_D[RAW_D.length - 1];
  const first = sliced[0];
  const isUp = latest.total - first.total >= 0;
  const lineColor = isUp ? C.green : C.red;

  const totalAll = RAW_D.reduce((s, d) => s + d.total, 0);
  const rangeTotal = sliced.reduce((s, d) => s + d.total, 0);
  const rangeChars = sliced.reduce((s, d) => s + (d.chars || 0), 0);
  const avgInRange = rangeTotal / sliced.length;
  const avgCharsInRange = rangeChars / sliced.length;
  const peak = sliced.reduce((a, b) => (b.total > a.total ? b : a), sliced[0]);
  const low = sliced.reduce((a, b) => (b.total < a.total ? b : a), sliced[0]);
  const rangeA = sliced.reduce((s, d) => s + d.a, 0);
  const rangeB = sliced.reduce((s, d) => s + d.b, 0);
  const rangeAShare = rangeTotal === 0 ? 50 : Math.round((rangeA / rangeTotal) * 100);

  const streaks = useMemo(() => computeStreaks(RAW_D), [RAW_D]);
  const currentStreak = streaks[streaks.length - 1];
  const longestStreak = streaks.reduce((a, b) => (b.length > a.length ? b : a), streaks[0]);
  const topStreaks = [...streaks].sort((a, b) => b.length - a.length).slice(0, 5);

  const hourly = useMemo(() => {
    const totals = new Array(24).fill(0);
    sliced.forEach((d) => {
      const hours = HOURLY_MAP[d.date];
      if (hours) hours.forEach((c, h) => (totals[h] += c));
    });
    return totals.map((total, hour) => ({ hour, total }));
  }, [sliced, HOURLY_MAP]);
  const hourlyTotal = hourly.reduce((s, h) => s + h.total, 0);
  const peakHour = hourly.reduce((a, b) => (b.total > a.total ? b : a), hourly[0]);
  const hourSegments = HOUR_SEGMENTS.map((seg) => {
    const count = seg.hours.reduce((s, h) => s + hourly[h].total, 0);
    const pct = hourlyTotal === 0 ? 0 : Math.round((count / hourlyTotal) * 100);
    return { ...seg, count, pct };
  });

  // --- lifestyle type diagnosis (per sender, from all-time messages) ---
  const lifestyle = lazy("lifestyle", needHourly, () => {
    const perSender = {
      a: { hours: new Array(24).fill(0), weekday: new Array(7).fill(0) },
      b: { hours: new Array(24).fill(0), weekday: new Array(7).fill(0) },
    };
    messages.forEach((m) => {
      const key = m.sender === names.a ? "a" : m.sender === names.b ? "b" : null;
      if (!key) return;
      const hh = hourOf(m);
      if (hh >= 0 && hh < 24) perSender[key].hours[hh]++;
      const wd = weekdayOf(m.date);
      perSender[key].weekday[wd]++;
    });
    const BAND_LABELS = {
      midnight: "深夜型",
      dawn: "明け方型",
      morning: "午前型",
      noon: "お昼型",
      dusk: "夕方型",
      night: "夜型",
    };
    const typeFor = (data) => {
      const total = data.hours.reduce((s, c) => s + c, 0);
      if (total === 0) return { label: "データ不足", emoji: "🤔", detail: "" };
      const bandShares = HOUR_BANDS.map((band) => ({
        band,
        share: band.hours.reduce((s, h) => s + data.hours[h], 0) / total,
      }));
      const top = bandShares.reduce((a, b) => (b.share > a.share ? b : a));
      const concentration =
        top.share >= 0.45 ? "一極集中型" : top.share >= 0.3 ? "やや集中型" : "まんべんなく型";
      const weekdayTotal = [1, 2, 3, 4, 5].reduce((s, d) => s + data.weekday[d], 0);
      const weekendTotal = data.weekday[0] + data.weekday[6];
      const weekdayAvg = weekdayTotal / 5;
      const weekendAvg = weekendTotal / 2;
      let weekdayLabel = "変わらず型";
      if (weekendAvg > weekdayAvg * 1.25) weekdayLabel = "休日おしゃべり型";
      else if (weekdayAvg > weekendAvg * 1.25) weekdayLabel = "平日おしゃべり型";
      return {
        emoji: top.band.emoji,
        label: BAND_LABELS[top.band.key],
        pct: Math.round(top.share * 100),
        concentration,
        weekdayLabel,
        detail: `${top.band.range}が中心・${concentration}・${weekdayLabel}`,
      };
    };
    return { a: typeFor(perSender.a), b: typeFor(perSender.b) };
  });

  // --- weekday × hour heatmap ---
  const weekdayHourMatrix = lazy("weekdayHourMatrix", needHourly, () => {
    const matrix = Array.from({ length: 7 }, () => new Array(24).fill(0));
    messages.forEach((m) => {
      const hh = hourOf(m);
      const wd = weekdayOf(m.date);
      if (hh >= 0 && hh < 24) matrix[wd][hh]++;
    });
    return matrix;
  });

  // --- topic auto-classification ---
  const topics = lazy("topics", needBreakdown, () => {
    const counts = Object.fromEntries(TOPIC_CATEGORIES.map((t) => [t.key, 0]));
    let total = 0;
    messages.forEach((m) => {
      if (m.type !== "text") return;
      let hit = null;
      for (let ti = 0; ti < TOPIC_RES.length; ti++) {
        if (TOPIC_RES[ti].test(m.content)) {
          hit = TOPIC_CATEGORIES[ti];
          break;
        }
      }
      if (hit) {
        counts[hit.key]++;
        total++;
      }
    });
    return TOPIC_CATEGORIES.map((t) => ({ ...t, count: counts[t.key], pct: total === 0 ? 0 : Math.round((counts[t.key] / total) * 100) })).sort(
      (x, y) => y.count - x.count
    );
  });

  // --- emoji usage over time (monthly) ---
  const emojiTrend = lazy("emojiTrend", needBreakdown, () => {
    const byMonth = new Map();
    messages.forEach((m) => {
      if (m.type !== "text") return;
      const matches = m.content.match(EMOJI_RE);
      if (!matches) return;
      const ym = m.date.slice(0, 7);
      byMonth.set(ym, (byMonth.get(ym) || 0) + matches.length);
    });
    return [...byMonth.entries()]
      .sort((x, y) => (x[0] < y[0] ? -1 : 1))
      .map(([ym, count]) => ({ ym, label: `${parseInt(ym.split("-")[1])}月`, count }));
  });

  // --- weekly auto-report (always last 7 vs previous 7, regardless of range filter) ---
  const weeklyReport = useMemo(() => {
    const n = RAW_D.length;
    const last7 = RAW_D.slice(Math.max(0, n - 7));
    const prev7 = RAW_D.slice(Math.max(0, n - 14), Math.max(0, n - 7));
    const sum = (arr) => arr.reduce((s, d) => s + d.total, 0);
    const last7Total = sum(last7);
    const prev7Total = sum(prev7);
    const diff = last7Total - prev7Total;
    const busiest = last7.reduce((a, b) => (b.total > a.total ? b : a), last7[0]);
    return { last7Total, prev7Total, diff, busiest, days: last7.length };
  }, [RAW_D]);

  // --- type breakdown + word/emoji ranking (for 内訳 page) ---
  const typeCounts = lazy("typeCounts", needBreakdown, () => {
    const counts = {
      a: { text: 0, stamp: 0, photo: 0, video: 0, file: 0, other: 0 },
      b: { text: 0, stamp: 0, photo: 0, video: 0, file: 0, other: 0 },
    };
    messages.forEach((m) => {
      const key = m.sender === names.a ? "a" : m.sender === names.b ? "b" : null;
      if (!key) return;
      counts[key][m.type] = (counts[key][m.type] || 0) + 1;
    });
    return counts;
  });

  const wordRanking = lazy("wordRanking", needRank, () => {
    const freq = new Map();
    messages.forEach((m) => {
      if (m.type !== "text") return;
      const matches = m.content.match(WORD_RE);
      if (!matches) return;
      matches.forEach((w) => {
        const lw = w.toLowerCase();
        if (STOPWORDS.has(w) || /^\d+$/.test(w)) return;
        freq.set(lw, (freq.get(lw) || 0) + 1);
      });
    });
    return [...freq.entries()]
      .sort((x, y) => y[1] - x[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  });

  const emojiRanking = lazy("emojiRanking", needRank, () => {
    const freq = new Map();
    messages.forEach((m) => {
      if (m.type !== "text") return;
      const matches = m.content.match(EMOJI_RE);
      if (!matches) return;
      matches.forEach((e) => freq.set(e, (freq.get(e) || 0) + 1));
    });
    return [...freq.entries()]
      .sort((x, y) => y[1] - x[1])
      .slice(0, 10)
      .map(([emoji, count]) => ({ emoji, count }));
  });

  // --- reply speed analysis ---
  const replyStats = lazy("replyStats", needBreakdown, () => {
    const buckets = [
      { label: "1分未満", max: 1, count: 0 },
      { label: "1〜5分", max: 5, count: 0 },
      { label: "5〜30分", max: 30, count: 0 },
      { label: "30分〜3時間", max: 180, count: 0 },
      { label: "3〜24時間", max: 1440, count: 0 },
      { label: "24時間以上", max: Infinity, count: 0 },
    ];
    const gapsA = [];
    const gapsB = [];
    for (let i = 1; i < messages.length; i++) {
      const prev = messages[i - 1];
      const cur = messages[i];
      if (prev.sender === cur.sender) continue;
      const gapMin = minutesOf(cur) - minutesOf(prev);
      if (gapMin < 0) continue;
      const bucket = buckets.find((bk) => gapMin < bk.max);
      if (bucket) bucket.count++;
      if (cur.sender === names.a) gapsA.push(gapMin);
      else if (cur.sender === names.b) gapsB.push(gapMin);
    }
    const avg = (arr) => (arr.length === 0 ? null : arr.reduce((s, v) => s + v, 0) / arr.length);
    return { buckets, avgA: avg(gapsA), avgB: avg(gapsB), totalReplies: gapsA.length + gapsB.length };
  });

  // --- calendar heatmap data ---
  const calendarDays = useMemo(() => {
    const totalsByDate = Object.fromEntries(RAW_D.map((d) => [d.date, d.total]));
    const startDate = new Date(RAW_D[0].date + "T00:00:00");
    const endDate = new Date(RAW_D[RAW_D.length - 1].date + "T00:00:00");
    const days = [];
    const cur = new Date(startDate);
    const toLocalISO = (dt) => {
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, "0");
      const d = String(dt.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    };
    while (cur <= endDate) {
      const iso = toLocalISO(cur);
      days.push({ date: iso, total: totalsByDate[iso] || 0, weekday: cur.getDay() });
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }, [RAW_D]);

  const maxDayTotal = useMemo(() => RAW_D.reduce((m, d) => Math.max(m, d.total), 1), [RAW_D]);

  const milestone = useMemo(() => {
    const distinctDays = RAW_D.length;
    const nextTarget = distinctDays % 50 === 0 && distinctDays > 0 ? distinctDays : Math.ceil((distinctDays + 1) / 50) * 50;
    const isExact = distinctDays > 0 && distinctDays % 50 === 0;
    const firstDate = new Date(RAW_D[0].date + "T00:00:00");
    const lastDate = new Date(RAW_D[RAW_D.length - 1].date + "T00:00:00");
    let anniversaryYears = null;
    const anniversaryDates = [];
    for (let y = 1; y <= 20; y++) {
      const anniv = new Date(firstDate);
      anniv.setFullYear(firstDate.getFullYear() + y);
      if (anniv > lastDate) break;
      anniversaryDates.push({ years: y, date: anniv });
      if (Math.abs(anniv - lastDate) <= 3 * 86400000) anniversaryYears = y;
    }
    const achieved = [];
    for (let target = 50; target <= distinctDays; target += 50) {
      achieved.push({ type: "day", label: `累計${target}日目`, date: RAW_D[target - 1].date });
    }
    anniversaryDates.forEach((an) => {
      achieved.push({ type: "anniv", label: `${an.years}周年`, dateObj: an.date });
    });
    achieved.sort((x, y) => {
      const xd = x.dateObj ? x.dateObj : new Date(x.date + "T00:00:00");
      const yd = y.dateObj ? y.dateObj : new Date(y.date + "T00:00:00");
      return xd - yd;
    });
    return { distinctDays, nextTarget, isExact, anniversaryYears, achieved };
  }, [RAW_D]);

  // --- monthly report ---
  const monthly = useMemo(() => {
    const map = new Map();
    RAW_D.forEach((d) => {
      const ym = d.date.slice(0, 7);
      if (!map.has(ym)) map.set(ym, { ym, total: 0, a: 0, b: 0, chars: 0, days: 0, topDay: d });
      const m = map.get(ym);
      m.total += d.total;
      m.a += d.a;
      m.b += d.b;
      m.chars += d.chars || 0;
      m.days += 1;
      if (d.total > m.topDay.total) m.topDay = d;
    });
    return [...map.values()].sort((x, y) => (x.ym < y.ym ? 1 : -1));
  }, [RAW_D]);

  const storySlides = lazy("storySlides", needStory, () =>
    buildStorySlides({ names, chatTitle, RAW_D, messages, totalAll, longestStreak, currentStreak, milestone, wordRanking: lazyGet("wordRanking"), emojiRanking: lazyGet("emojiRanking") })
  );

  // 読み込みが落ち着いたあと、空き時間に少しずつ先に計算しておく（初めてそのページを開いたときの待ちをなくす）
  useEffect(() => {
    let cancelled = false;
    const order = ["lifestyle", "weekdayHourMatrix", "typeCounts", "topics", "emojiTrend", "replyStats", "wordRanking", "emojiRanking", "storySlides"];
    let i = 0;
    const idle = (f) => (window.requestIdleCallback ? window.requestIdleCallback(f, { timeout: 4000 }) : setTimeout(f, 400));
    const step = () => {
      if (cancelled || i >= order.length) return;
      try {
        lazyGet(order[i]);
      } catch (e) {}
      i++;
      idle(step);
    };
    idle(step);
    return () => {
      cancelled = true;
    };
  }, []);

  // 全ページで文字を選択・コピーできないようにする（検索欄などの入力欄だけは入力できる）
  return (
    <div
      className="lta-nocopy"
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Hachi Maru Pop', 'Hiragino Maru Gothic Pro', sans-serif",
        padding: 16,
        maxWidth: "var(--lta-max, 440px)",
        margin: "0 auto",
        borderRadius: 28,
      }}
    >
      <style>{`.lta-nocopy,.lta-nocopy *{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}.lta-nocopy input,.lta-nocopy textarea{-webkit-user-select:text;user-select:text}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={toggleTheme}
            aria-label="テーマ切替"
            style={{
              background: C.panel2,
              border: `1px solid ${C.stroke}`,
              borderRadius: 999,
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: C.sub,
              flexShrink: 0,
            }}
          >
            {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
        <button
          onClick={onReset}
          style={{
            background: "transparent",
            border: "none",
            color: C.subtle,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "inherit",
            textDecoration: "underline",
            padding: 0,
            flexShrink: 0,
          }}
        >
          別のファイルを読み込む
        </button>
      </div>

      <GlassTabs items={PAGES} onSelect={goPage} variant="main" />
      <GlassTabs items={EXTRA_PAGES} onSelect={goPage} variant="extra" />

      <div className="lta-page">
      {page === "overview" && (
        <OverviewPage
          sliced={sliced}
          latest={latest}
          first={first}
          lineColor={lineColor}
          avgInRange={avgInRange}
          rangeKey={rangeKey}
          setRangeKey={setRangeKey}
          range={range}
          names={names}
          chatTitle={chatTitle}
          weeklyReport={weeklyReport}
          messages={messages}
          RAW_D={RAW_D}
        />
      )}

      {page === "detail" && (
        <DetailPage
          sliced={sliced}
          rangeKey={rangeKey}
          setRangeKey={setRangeKey}
          range={range}
          rangeTotal={rangeTotal}
          rangeChars={rangeChars}
          avgInRange={avgInRange}
          avgCharsInRange={avgCharsInRange}
          peak={peak}
          low={low}
          rangeA={rangeA}
          rangeB={rangeB}
          rangeAShare={rangeAShare}
          names={names}
          chatTitle={chatTitle}
          weeklyReport={weeklyReport}
          messages={messages}
          RAW_D={RAW_D}
          getStory={() => lazyGet("storySlides")}
        />
      )}

      {page === "history" && (
        <HistoryPage
          sliced={sliced}
          rangeKey={rangeKey}
          setRangeKey={setRangeKey}
          range={range}
          names={names}
          chatTitle={chatTitle}
          RAW_D={RAW_D}
        />
      )}

      {page === "streak" && (
        <StreakPage currentStreak={currentStreak} longestStreak={longestStreak} topStreaks={topStreaks} totalDays={RAW_D.length} />
      )}

      {page === "hourly" && (
        <HourlyPage
          hourly={hourly}
          hourlyTotal={hourlyTotal}
          peakHour={peakHour}
          hourSegments={hourSegments}
          rangeKey={rangeKey}
          setRangeKey={setRangeKey}
          range={range}
          lifestyle={lifestyle}
          names={names}
          weekdayHourMatrix={weekdayHourMatrix}
        />
      )}

      {page === "breakdown" && (
        <BreakdownPage
          typeCounts={typeCounts}
          names={names}
          wordRanking={wordRanking}
          emojiRanking={emojiRanking}
          replyStats={replyStats}
          topics={topics}
          emojiTrend={emojiTrend}
        />
      )}

      {page === "calendarmap" && (
        <CalendarMapPage
          calendarDays={calendarDays}
          maxDayTotal={maxDayTotal}
          milestone={milestone}
          totalAll={totalAll}
          longestStreak={longestStreak}
          currentStreak={currentStreak}
          chatTitle={chatTitle}
          names={names}
          RAW_D={RAW_D}
          messages={messages}
          wordRanking={wordRanking}
          emojiRanking={emojiRanking}
        />
      )}

      {page === "search" && <SearchPage messages={messages} names={names} />}

      {page === "monthly" && <MonthlyPage monthly={monthly} names={names} />}

      {page === "compare" && <ComparePage names={names} RAW_D={RAW_D} totalAll={totalAll} chatTitle={chatTitle} />}

      {page === "share" && (
        <ShareCardPage storySlides={storySlides} messages={messages} names={names} chatTitle={chatTitle} totalAll={totalAll} RAW_D={RAW_D} longestStreak={longestStreak} currentStreak={currentStreak} />
      )}

      {page === "replay" && <ReplayPage messages={messages} names={names} RAW_D={RAW_D} />}
      </div>
    </div>
  );
}

function GlassSegment({ options, value, onChange, small }) {
  const dragRef = useRef(null);
  const pillRef = useRef(null);
  const pendRef = useRef(null);
  const pendTimerRef = useRef(null);
  const barRef = useRef(null);
  const pressRef = useRef(null);
  const activeRef = useRef(false);
  const dragEndedRef = useRef(false);
  const n = options.length;
  const w = 100 / n;
  const idx = Math.max(0, options.findIndex((o) => o.key === value));
  const clampPct = (d) => Math.min(100 - w, Math.max(0, d - w / 2));
  const pillPct = dragRef.current !== null ? clampPct(dragRef.current) : idx * w;
  const movePill = (pct, fast) => {
    const el = pillRef.current;
    if (!el) return;
    el.style.transition = fast ? "none" : "transform 0.16s ease-out";
    el.style.transform = `translate3d(${(pct / w) * 100}%, 0, 0)`;
  };

  const rectRef = useRef(null);
  const pctAt = (x) => {
    const rect = rectRef.current || (barRef.current && barRef.current.getBoundingClientRect());
    if (!rect) return 0;
    return Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100));
  };
  const onDown = (e) => {
    const x0 = e.clientX;
    clearTimeout(pressRef.current);
    activeRef.current = false;
    let last = value;
    const apply = (x) => {
      const pct = pctAt(x);
      dragRef.current = pct;
      movePill(clampPct(pct), true);
      const k = options[Math.min(n - 1, Math.max(0, Math.floor((pct / 100) * n)))].key;
      if (k !== last) {
        last = k;
        // 動かしている間は重い再描画を待ち、少し止まったときか指を離したときに1回だけ反映する
        pendRef.current = k;
        clearTimeout(pendTimerRef.current);
        pendTimerRef.current = setTimeout(() => {
          if (pendRef.current !== null) onChange(pendRef.current);
          pendRef.current = null;
        }, 140);
      }
    };
    pressRef.current = setTimeout(() => {
      activeRef.current = true;
      rectRef.current = barRef.current ? barRef.current.getBoundingClientRect() : null;
      apply(x0);
    }, 220);
    const onMove = (ev) => {
      if (activeRef.current) apply(ev.clientX);
    };
    const onUp = () => {
      clearTimeout(pressRef.current);
      if (activeRef.current) {
        // ドラッグ操作の直後に出るクリックでは音を鳴らさない
        dragEndedRef.current = true;
        setTimeout(() => {
          dragEndedRef.current = false;
        }, 80);
      }
      if (activeRef.current) {
        clearTimeout(pendTimerRef.current);
        movePill(Math.max(0, options.findIndex((o) => o.key === last)) * w, true);
        const k = pendRef.current;
        pendRef.current = null;
        if (k !== null) requestAnimationFrame(() => requestAnimationFrame(() => onChange(k)));
      }
      activeRef.current = false;
      rectRef.current = null;
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return (
    <div
      style={{
        background: C.panel2,
        border: `1px solid ${C.stroke}`,
        borderRadius: 16,
        padding: 4,
        marginBottom: 14,
      }}
    >
      <div ref={barRef} onPointerDown={onDown} style={{ position: "relative", display: "flex", touchAction: "none", userSelect: "none" }}>
        <div
          ref={pillRef}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: `${w}%`,
            transform: `translate3d(${(pillPct / w) * 100}%, 0, 0)`,
            transition: "transform 0.16s ease-out",
            willChange: "transform",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 2,
              borderRadius: 12,
              background: "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.07) 100%)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.22)",
            }}
          />
        </div>
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => {
              if (pillRef.current) pillRef.current.style.transition = "transform 0.16s ease-out";
              onChange(o.key);
              if (!dragEndedRef.current) {
                playTick(659.25, 0.05); // ミ(E5)
                vibrate(7);
              }
            }}
            style={{
              position: "relative",
              zIndex: 1,
              flex: 1,
              background: "transparent",
              color: value === o.key ? C.text : C.sub,
              border: "none",
              borderRadius: 12,
              padding: small ? "6px 0" : "8px 0",
              fontSize: small ? 11.5 : 12.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RangeSelector({ rangeKey, setRangeKey }) {
  return <GlassSegment options={RANGES.map((r) => ({ key: r.key, label: r.key }))} value={rangeKey} onChange={setRangeKey} />;
}

// なぞって数字が変わるたびにグラフ(最大1000点以上)を描き直さないよう、グラフ本体は props が変わったときだけ再描画する
const OverviewAreaChart = React.memo(function OverviewAreaChart({ data, lineColor, avgInRange, onMove, onLeave }) {
  return (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 6, right: 14, left: 0, bottom: 0 }} onMouseMove={onMove} onMouseLeave={onLeave}>
              <defs>
                <linearGradient id="fillUp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.green} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillDown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.red} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={C.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.grid} strokeDasharray="3 3" horizontal={false} vertical />
              <XAxis dataKey="date" hide />
              <YAxis
                orientation="right"
                domain={["dataMin - 20", "dataMax + 20"]}
                tick={{ fill: C.sub, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <ReferenceLine y={avgInRange} stroke={C.sub} strokeDasharray="2 3" strokeOpacity={0.5} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: C.sub, strokeWidth: 1, strokeDasharray: "3 3" }} />
              <Area
                type="linear"
                dataKey="total"
                stroke={lineColor}
                strokeWidth={2.5}
                fill={lineColor === C.green ? "url(#fillUp)" : "url(#fillDown)"}
                dot={false}
                activeDot={{ r: 5, fill: lineColor, stroke: C.panel, strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
  );
});

function OverviewPage({
  sliced,
  latest,
  first,
  lineColor,
  avgInRange,
  rangeKey,
  setRangeKey,
  range,
  names,
  chatTitle,
  weeklyReport,
  messages,
  RAW_D,
}) {
  const [topicRange, setTopicRange] = useState("1M");
  // グラフをなぞったときの表示。ここだけで持つので、画面全体は再描画されない
  const [hover, setHover] = useState(null);
  const handleMove = React.useCallback((state) => {
    if (state && state.activePayload && state.activePayload.length) {
      setHover(state.activePayload[0].payload);
    }
  }, []);
  const handleLeave = React.useCallback(() => setHover(null), []);
  const displayed = hover ?? latest;
  const displayedDelta = displayed.dayDelta;
  const displayedPct = displayed.dayPct;
  const displayedIsUp = displayedDelta >= 0;
  const momentumRatio = weeklyReport && weeklyReport.prev7Total > 0 ? weeklyReport.last7Total / weeklyReport.prev7Total : weeklyReport && weeklyReport.last7Total > 0 ? 1.3 : 1;
  const momentumInfo =
    momentumRatio >= 1.15
      ? { label: "勢いアップ中", emoji: "🔥", color: C.red }
      : momentumRatio <= 0.85
      ? { label: "ペースダウン中", emoji: "❄️", color: C.a }
      : { label: "安定ペース", emoji: "🌤️", color: C.green };
  const gaugeFill = Math.min(100, Math.max(5, Math.round((momentumRatio / 2) * 100)));

  return (
    <>
      {weeklyReport && (
        <Card style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <Thermometer size={20} color={momentumInfo.color} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: momentumInfo.color }}>
              {momentumInfo.emoji} {momentumInfo.label}
            </div>
            <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", background: C.stroke, marginTop: 5 }}>
              <div style={{ width: `${gaugeFill}%`, background: momentumInfo.color, borderRadius: 999 }} />
            </div>
          </div>
          <div style={{ fontSize: 10, color: C.subtle, textAlign: "right" }}>
            直近7日 {weeklyReport.last7Total}件
            <br />
            前週 {weeklyReport.prev7Total}件
          </div>
        </Card>
      )}

      <RangeSelector rangeKey={rangeKey} setRangeKey={setRangeKey} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {chatTitle || `${names.a} ⇄ ${names.b}`}
          </div>
          <div style={{ fontSize: 14, color: C.sub, marginTop: 1 }}>
            {chatTitle ? `${names.a} ⇄ ${names.b}` : "トーク"}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            {displayed.total}
          </div>
          <div style={{ fontSize: 10, color: C.sub, marginTop: 1 }}>前日比</div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              marginTop: 3,
              padding: "2px 8px",
              borderRadius: 999,
              fontSize: 12.5,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              color: displayedIsUp ? C.green : C.red,
              background: displayedIsUp ? C.greenDim : C.redDim,
            }}
          >
            <span style={{ fontSize: 9 }}>{displayedIsUp ? "▲" : "▼"}</span>
            {Math.abs(displayedDelta)} ({displayedIsUp ? "+" : "-"}
            {Math.abs(displayedPct).toFixed(1)}%)
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: C.sub, margin: "10px 0 8px", height: 16 }}>
        {hover ? fmtLong(hover.date) : `${range.label}のメッセージ数推移`}
      </div>

      <Card wide style={{ padding: "18px 4px 12px" }}>
        <div style={{ marginLeft: 12, marginRight: 0 }}>
          <OverviewAreaChart data={sliced} lineColor={lineColor} avgInRange={avgInRange} onMove={handleMove} onLeave={handleLeave} colorKey={C.bg} />
        </div>
      </Card>

      <div style={{ fontSize: 11, color: C.subtle, textAlign: "center", marginTop: 10 }}>
        チャートをなぞると日別の件数が見られます
      </div>
      <HotTopicCard messages={messages} RAW_D={RAW_D} names={names} rangeKey={topicRange} setRangeKey={setTopicRange} />
    </>
  );
}

function DetailPage({
  sliced,
  rangeKey,
  setRangeKey,
  range,
  rangeTotal,
  rangeChars,
  avgInRange,
  avgCharsInRange,
  peak,
  low,
  rangeA,
  rangeB,
  rangeAShare,
  names,
  chatTitle,
  weeklyReport,
  messages,
  RAW_D,
  getStory,
}) {
  const [shareStatus, setShareStatus] = useState(null);
  const topChars = [...sliced].sort((a, b) => b.chars - a.chars).slice(0, 10);
  // 長い期間は1日ごとに棒を描くと細かすぎて重いので、120本までにまとめる（1本あたりの1日平均）
  const barSize = Math.max(1, Math.ceil(sliced.length / 120));
  const barData = useMemo(() => {
    if (barSize === 1) return sliced;
    const out = [];
    for (let i = 0; i < sliced.length; i += barSize) {
      const chunk = sliced.slice(i, i + barSize);
      const n = chunk.length;
      out.push({
        date: chunk[0].date,
        endDate: chunk[n - 1].date,
        days: n,
        a: Math.round(chunk.reduce((x, d) => x + d.a, 0) / n),
        b: Math.round(chunk.reduce((x, d) => x + d.b, 0) / n),
      });
    }
    return out;
  }, [sliced, barSize]);

  const shareSummary = (which) => {
    const spanDays = daysBetween(sliced[0].date, sliced[sliced.length - 1].date);
    const typeMin = Math.round(rangeChars / 50);
    const typeLabel = typeMin >= 60 ? `${Math.floor(typeMin / 60)}時間${typeMin % 60}分` : `${typeMin}分`;
    const tiles = [
      { emoji: "📅", label: "トークした期間", value: `${spanDays}日間`, sub: `うち${sliced.length}日おしゃべり`, bg: "#EAF1FF" },
      { emoji: "💬", label: "メッセージ合計", value: `${rangeTotal.toLocaleString()}件`, sub: `1日平均 ${Math.round(avgInRange)}件`, bg: "#FFF0F5" },
      { emoji: "⏰", label: "打った時間のめやす", value: `約${typeLabel}`, sub: "1分50字で計算", bg: "#FFF6E3" },
      { emoji: "✏️", label: "文字数", value: `${rangeChars.toLocaleString()}字`, sub: `1日平均 ${Math.round(avgCharsInRange)}字`, bg: "#EAFBF1" },
      { emoji: "🏆", label: "いちばん盛り上がった日", value: fmtShort(peak.date), sub: `${peak.total}件`, bg: "#F3EDFF" },
      { emoji: "🌙", label: "いちばん静かな日", value: fmtShort(low.date), sub: `${low.total}件`, bg: "#EDF7FB" },
    ];
    const title = chatTitle || `${names.a} ⇄ ${names.b}`;
    const topic = messages && RAW_D ? findHotTopic(messages, topicStartDate(RAW_D, rangeKey)) : null;
    // ストーリーのまとめは、シェアを押したときに初めて作る（詳細ページを開くだけなら作らない）
    const digest = getStory ? getStory() : null;
    const pages = [
      {
        draw: (ctx, w, h) => drawSummaryImage(ctx, w, h, { title, names, rangeLabel: range.label, tiles, aShare: rangeAShare, topic }),
        w: 1080,
        h: topic ? 2000 : 1350,
        filename: `${title}_summary.png`,
      },
    ];
    if (digest) {
      pages.push({
        draw: (ctx, w, h) => drawDigestImage(ctx, w, h, { title, digest }),
        w: 1080,
        h: 130 + storyDigestHeight(digest) + 120,
        filename: `${title}_summary_2.png`,
      });
    }
    saveCanvasImages([pages[which] || pages[0]], setShareStatus);
  };

  return (
    <>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>詳細統計</div>

      <button
        onClick={() => shareSummary(0)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "18px 16px",
          marginBottom: 10,
          border: "none",
          borderRadius: 24,
          background: `linear-gradient(135deg, ${C.a}, ${C.b})`,
          color: "#fff",
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: "0.02em",
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "0 10px 24px rgba(0,0,0,0.3)",
        }}
      >
        <span style={{ fontSize: 22 }}>🎀</span>
        トークまとめをシェアする
        <span style={{ fontSize: 22 }}>✨</span>
      </button>
      <button
        onClick={() => shareSummary(1)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "18px 16px",
          marginBottom: shareStatus ? 6 : 14,
          border: `2px solid ${C.a}`,
          borderRadius: 24,
          background: "transparent",
          color: C.text,
          fontSize: 16,
          fontWeight: 800,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <span style={{ fontSize: 22 }}>📖</span>
        ストーリーまとめをシェアする
        <span style={{ fontSize: 22 }}>✨</span>
      </button>
      {shareStatus && (
        <div style={{ fontSize: 11, color: C.subtle, textAlign: "center", marginBottom: 12 }}>{shareStatus}</div>
      )}

      {weeklyReport && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8, color: C.sub }}>週間レポート</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.7 }}>
            直近{weeklyReport.days}日間は<b>{weeklyReport.last7Total}件</b>のやりとりでした。
            前の週（{weeklyReport.prev7Total}件）と比べて
            <b style={{ color: weeklyReport.diff >= 0 ? C.green : C.red }}>
              {weeklyReport.diff >= 0 ? `${weeklyReport.diff}件増えました` : `${Math.abs(weeklyReport.diff)}件減りました`}
            </b>
            。一番やりとりが多かったのは <b>{fmtLong(weeklyReport.busiest.date)}</b>（{weeklyReport.busiest.total}件）でした。
          </div>
        </Card>
      )}

      <RangeSelector rangeKey={rangeKey} setRangeKey={setRangeKey} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <StatTile label="合計" value={`${rangeTotal.toLocaleString()}件`} />
        <StatTile label="文字数" value={`${rangeChars.toLocaleString()}字`} />
        <StatTile label="1日平均" value={`${Math.round(avgInRange)}件`} />
        <StatTile label="1日平均文字数" value={`${Math.round(avgCharsInRange)}字`} />
        <StatTile label="最高" value={`${peak.total}件`} sub={fmtShort(peak.date)} />
        <StatTile label="最低" value={`${low.total}件`} sub={fmtShort(low.date)} />
        <StatTile label="対話日数" value={`${sliced.length}日`} />
      </div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10, color: C.sub }}>
          送信者別メッセージ数（{range.label}）
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={barData} margin={{ top: 10, right: 16, left: 6, bottom: 4 }}>
            <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" hide />
            <YAxis tick={{ fill: C.sub, fontSize: 10 }} axisLine={false} tickLine={false} width={44} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div
                    style={{
                      background: C.panel2,
                      border: `1px solid ${C.stroke}`,
                      borderRadius: 12,
                      padding: "8px 11px",
                      fontSize: 11.5,
                    }}
                  >
                    <div style={{ color: C.sub, marginBottom: 4 }}>
                      {payload[0]?.payload?.endDate && payload[0].payload.endDate !== label
                        ? `${fmtLong(label)}〜${fmtLong(payload[0].payload.endDate)}（1日平均）`
                        : fmtLong(label)}
                    </div>
                    <div style={{ color: C.a, fontWeight: 600 }}>{names.a} {payload[0]?.payload?.a}</div>
                    <div style={{ color: C.b, fontWeight: 600 }}>{names.b} {payload[0]?.payload?.b}</div>
                  </div>
                );
              }}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />
            <Bar dataKey="a" stackId="s" fill={C.a} radius={[0, 0, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="b" stackId="s" fill={C.b} radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginTop: 10 }}>
          <span style={{ color: C.a, fontWeight: 600 }}>{names.a} {rangeA}件（{rangeAShare}%）</span>
          <span style={{ color: C.b, fontWeight: 600 }}>{names.b} {rangeB}件（{100 - rangeAShare}%）</span>
        </div>
        <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", background: C.stroke, marginTop: 6 }}>
          <div style={{ width: `${rangeAShare}%`, background: C.a }} />
          <div style={{ width: `${100 - rangeAShare}%`, background: C.b }} />
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10, color: C.sub }}>文字数ランキング TOP10</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {topChars.map((d, i) => (
            <div key={d.date} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10.5, color: C.subtle, width: 16 }}>{i + 1}</span>
              <span style={{ fontSize: 12, fontWeight: 600, minWidth: 48 }}>{fmtShort(d.date)}</span>
              <div style={{ flex: 1, height: 6, borderRadius: 999, background: C.stroke, overflow: "hidden" }}>
                <div style={{ width: `${(d.chars / (topChars[0].chars || 1)) * 100}%`, height: "100%", background: C.b, borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 11, color: C.subtle, width: 56, textAlign: "right" }}>{d.chars.toLocaleString()}字</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function loadFavorites(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}
function saveFavorites(storageKey, favs) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(favs));
  } catch (e) {}
}

function HistoryPage({ sliced, rangeKey, setRangeKey, range, names, chatTitle, RAW_D }) {
  const storageKey = `lta_fav_${(chatTitle || "") + "_" + names.a + "_" + names.b}`;
  const [favorites, setFavorites] = useState(() => loadFavorites(storageKey));
  const [onlyFav, setOnlyFav] = useState(false);
  const [editingDate, setEditingDate] = useState(null);
  const [randomPick, setRandomPick] = useState(null);
  const [jumpResult, setJumpResult] = useState(null);
  const [jumpError, setJumpError] = useState(null);

  const pickRandom = () => {
    const idx = Math.floor(Math.random() * sliced.length);
    setRandomPick(sliced[idx]);
    setJumpResult(null);
  };

  const jumpToDate = (dateStr) => {
    setJumpError(null);
    const found = RAW_D.find((d) => d.date === dateStr);
    if (!found) {
      setJumpError("この日にはやりとりの記録がありません");
      setJumpResult(null);
      return;
    }
    setJumpResult(found);
    setRandomPick(null);
  };

  const toggleFav = (date) => {
    const next = { ...favorites };
    if (next[date] && next[date].fav) {
      next[date] = { ...next[date], fav: false };
    } else {
      next[date] = { ...(next[date] || {}), fav: true };
    }
    setFavorites(next);
    saveFavorites(storageKey, next);
  };
  const updateMemo = (date, memo) => {
    const next = { ...favorites, [date]: { ...(favorites[date] || {}), memo } };
    setFavorites(next);
    saveFavorites(storageKey, next);
  };

  const reversed = [...sliced].reverse().filter((d) => !onlyFav || (favorites[d.date] && favorites[d.date].fav));
  // 何百日分もある期間でも軽いように、最初は60日分だけ描き、下までスクロールしたら続きを足す
  const [limit, setLimit] = useState(60);
  useEffect(() => {
    setLimit(60);
  }, [rangeKey, onlyFav]);
  const visibleRows = reversed.length > limit ? reversed.slice(0, limit) : reversed;
  const sortedTotals = [...sliced].map((d) => d.total).sort((a, b) => a - b);
  const hotThreshold = sortedTotals[Math.floor(sortedTotals.length * 0.85)] ?? Infinity;
  const coldThreshold = sortedTotals[Math.floor(sortedTotals.length * 0.15)] ?? -1;

  return (
    <>
      <style>{`
        .no-scrollbar{scrollbar-width:none;-ms-overflow-style:none}
        .no-scrollbar::-webkit-scrollbar{display:none}
        @keyframes lta-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.15); } }
        .lta-hot-badge { animation: lta-pulse 1.6s ease-in-out infinite; display: inline-block; }
      `}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 6 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>日別履歴</div>
        <button
          onClick={pickRandom}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "transparent",
            color: C.a,
            border: `1px solid ${C.stroke}`,
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <Dice size={11} />
          思い出
        </button>
        <button
          onClick={() => setOnlyFav((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: onlyFav ? C.greenDim : "transparent",
            color: onlyFav ? C.green : C.subtle,
            border: `1px solid ${onlyFav ? C.green : C.stroke}`,
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <Star size={11} filled={onlyFav} color={onlyFav ? C.green : C.subtle} />
          お気に入りのみ
        </button>
      </div>
      <RangeSelector rangeKey={rangeKey} setRangeKey={setRangeKey} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
          background: C.panel2,
          border: `1px solid ${C.stroke}`,
          borderRadius: 12,
          padding: "6px 10px",
        }}
      >
        <span style={{ fontSize: 11, color: C.subtle, flexShrink: 0 }}>日付にジャンプ</span>
        <input
          type="date"
          min={RAW_D[0].date}
          max={RAW_D[RAW_D.length - 1].date}
          onChange={(e) => e.target.value && jumpToDate(e.target.value)}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: C.text,
            fontSize: 12,
            fontFamily: "inherit",
            colorScheme: "dark",
          }}
        />
      </div>
      {jumpError && <div style={{ fontSize: 11, color: C.red, marginBottom: 10 }}>{jumpError}</div>}

      {jumpResult && (
        <Card style={{ marginBottom: 12, border: `1px solid ${hexToRgba(C.a, 0.4)}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: C.sub, fontWeight: 600 }}>📍 指定日の結果</span>
            <button onClick={() => setJumpResult(null)} style={{ background: "transparent", border: "none", color: C.subtle, cursor: "pointer" }}>
              <XIcon size={13} />
            </button>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>
            {fmtLong(jumpResult.date)}（{fmtWeekday(jumpResult.date)}）
          </div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>
            {jumpResult.total}件のやりとり・{jumpResult.chars.toLocaleString()}字
          </div>
        </Card>
      )}

      {randomPick && (
        <Card
          style={{
            marginBottom: 12,
            background: `linear-gradient(135deg, ${hexToRgba(C.a, 0.12)}, ${hexToRgba(C.b, 0.12)})`,
            border: `1px solid ${C.stroke}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: C.sub, fontWeight: 600 }}>🎲 ランダム思い出</span>
            <button onClick={() => setRandomPick(null)} style={{ background: "transparent", border: "none", color: C.subtle, cursor: "pointer" }}>
              <XIcon size={13} />
            </button>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>
            {fmtLong(randomPick.date)}（{fmtWeekday(randomPick.date)}）
          </div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>
            {randomPick.total}件のやりとり・{randomPick.chars.toLocaleString()}字
          </div>
          {favorites[randomPick.date]?.memo && (
            <div style={{ fontSize: 11.5, color: C.a, marginTop: 6 }}>📝 {favorites[randomPick.date].memo}</div>
          )}
        </Card>
      )}

      <div style={{ fontSize: 11.5, color: C.subtle, marginBottom: 10 }}>
        {range.label}・{reversed.length}日分を新しい順に表示
      </div>
      <div
        className="no-scrollbar"
        style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 440, overflowY: "auto" }}
        onScroll={(e) => {
          const el = e.currentTarget;
          if (limit < reversed.length && el.scrollTop + el.clientHeight > el.scrollHeight - 300) setLimit((l) => l + 60);
        }}
      >
        {reversed.length === 0 && (
          <div style={{ fontSize: 12, color: C.subtle, textAlign: "center", padding: "20px 0" }}>
            お気に入りの日がありません
          </div>
        )}
        {visibleRows.map((d) => {
          const deltaColor = d.dayDelta > 0 ? C.green : d.dayDelta < 0 ? C.red : C.subtle;
          const aShare = d.total === 0 ? 50 : Math.round((d.a / d.total) * 100);
          const fav = favorites[d.date] && favorites[d.date].fav;
          const memo = (favorites[d.date] && favorites[d.date].memo) || "";
          const editing = editingDate === d.date;
          const isHot = d.total >= hotThreshold && d.total > 0;
          const isCold = d.total <= coldThreshold;
          return (
            <div
              key={d.date}
              style={{
                background: C.panel2,
                border: `1px solid ${isHot ? hexToRgba(C.red, 0.5) : C.stroke}`,
                borderRadius: 14,
                padding: "10px 14px",
                boxShadow: isHot ? `0 0 0 1px ${hexToRgba(C.red, 0.15)}` : "none",
                opacity: isCold ? 0.72 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ minWidth: 56 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                    {fmtShort(d.date)}
                    {isHot && <span className="lta-hot-badge">💕</span>}
                  </div>
                  <div style={{ fontSize: 10.5, color: C.subtle }}>（{fmtWeekday(d.date)}）</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", height: 5, borderRadius: 999, overflow: "hidden", background: C.stroke }}>
                    <div style={{ width: `${aShare}%`, background: C.a }} />
                    <div style={{ width: `${100 - aShare}%`, background: C.b }} />
                  </div>
                  <div style={{ fontSize: 10, color: C.subtle, marginTop: 4 }}>{d.chars.toLocaleString()}字</div>
                </div>
                <div style={{ textAlign: "right", minWidth: 60 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{d.total}件</div>
                  <div style={{ fontSize: 10.5, color: deltaColor, fontWeight: 600 }}>
                    {d.dayDelta > 0 ? "+" : ""}
                    {d.dayDelta}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 2 }}>
                  <button
                    onClick={() => toggleFav(d.date)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2 }}
                    aria-label="お気に入り"
                  >
                    <Star size={15} filled={fav} />
                  </button>
                  <button
                    onClick={() => setEditingDate(editing ? null : d.date)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: 2, color: memo ? C.a : C.subtle, fontSize: 13 }}
                    aria-label="メモ"
                  >
                    ✎
                  </button>
                </div>
              </div>
              {editing && (
                <textarea
                  value={memo}
                  onChange={(e) => updateMemo(d.date, e.target.value)}
                  placeholder="この日のメモ…"
                  style={{
                    width: "100%",
                    marginTop: 8,
                    background: C.panel,
                    border: `1px solid ${C.stroke}`,
                    borderRadius: 10,
                    padding: "8px 10px",
                    color: C.text,
                    fontSize: 12,
                    fontFamily: "inherit",
                    resize: "vertical",
                    minHeight: 50,
                  }}
                />
              )}
              {!editing && memo && (
                <div style={{ fontSize: 11, color: C.sub, marginTop: 6, paddingLeft: 2 }}>📝 {memo}</div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function StreakPage({ currentStreak, longestStreak, topStreaks, totalDays }) {
  const isRecordNow = currentStreak.length >= longestStreak.length;
  const pct = Math.min(100, Math.round((currentStreak.length / longestStreak.length) * 100));

  return (
    <>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>連続記録</div>

      <Card
        style={{
          marginBottom: 12,
          background: `linear-gradient(135deg, ${C.panel} 0%, ${C.panel2} 100%)`,
          textAlign: "center",
          padding: "22px 16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
          <Flame size={30} />
        </div>
        <div style={{ fontSize: 11.5, color: C.sub, marginBottom: 4 }}>現在の連続記録</div>
        <div style={{ fontSize: 40, fontWeight: 800, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {currentStreak.length}
          <span style={{ fontSize: 16, fontWeight: 600, color: C.sub, marginLeft: 4 }}>日</span>
        </div>
        <div style={{ fontSize: 11.5, color: C.subtle, marginTop: 6 }}>
          {fmtShort(currentStreak.start)} 〜 {fmtShort(currentStreak.end)}
        </div>
        {isRecordNow && currentStreak.length > 1 && (
          <div
            style={{
              display: "inline-block",
              marginTop: 8,
              padding: "3px 10px",
              borderRadius: 999,
              background: C.greenDim,
              color: C.green,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            歴代最長タイ記録中！
          </div>
        )}
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <div style={{ fontSize: 12.5, color: C.sub, fontWeight: 600 }}>今までの最長記録</div>
          <div style={{ fontSize: 20, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
            {longestStreak.length}
            <span style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginLeft: 2 }}>日</span>
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: C.subtle, marginBottom: 10 }}>
          {fmtShort(longestStreak.start)} 〜 {fmtShort(longestStreak.end)}
        </div>
        <div style={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden", background: C.stroke }}>
          <div style={{ width: `${pct}%`, background: isRecordNow ? C.green : C.b, borderRadius: 999 }} />
        </div>
        <div style={{ fontSize: 10.5, color: C.subtle, marginTop: 6, textAlign: "right" }}>
          現在の記録は最長記録の{pct}%
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 12.5, color: C.sub, fontWeight: 600, marginBottom: 10 }}>記録ランキング</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {topStreaks.map((s, i) => (
            <div
              key={s.start}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: 12,
                background: C.panel2,
                border: `1px solid ${C.stroke}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: i === 0 ? C.b : C.stroke,
                    color: i === 0 ? C.panel : C.sub,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontSize: 12, color: C.subtle }}>
                  {fmtShort(s.start)} 〜 {fmtShort(s.end)}
                </div>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{s.length}日</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function HourlyPage({ hourly, hourlyTotal, peakHour, hourSegments, rangeKey, setRangeKey, range, lifestyle, names, weekdayHourMatrix }) {
  const weekdayLabels = ["日", "月", "火", "水", "木", "金", "土"];
  const matrixMax = weekdayHourMatrix ? Math.max(1, ...weekdayHourMatrix.flat()) : 1;

  return (
    <>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>時間帯分析</div>

      {lifestyle && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10, color: C.sub }}>生活タイプ診断</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: names.a, color: C.a, info: lifestyle.a },
              { label: names.b, color: C.b, info: lifestyle.b },
            ].map((p) => (
              <div
                key={p.label}
                style={{
                  background: C.panel2,
                  border: `1px solid ${C.stroke}`,
                  borderRadius: 14,
                  padding: "12px 10px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 11.5, color: p.color, fontWeight: 600, marginBottom: 4 }}>{p.label}</div>
                <div style={{ fontSize: 24 }}>{p.info.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{p.info.label}</div>
                {p.info.concentration && (
                  <div style={{ fontSize: 10, color: C.a, marginTop: 3, fontWeight: 600 }}>{p.info.concentration}</div>
                )}
                {p.info.weekdayLabel && (
                  <div style={{ fontSize: 10, color: C.b, marginTop: 1, fontWeight: 600 }}>{p.info.weekdayLabel}</div>
                )}
                {p.info.pct != null && (
                  <div style={{ fontSize: 10, color: C.subtle, marginTop: 4 }}>その時間帯が{p.info.pct}%</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <RangeSelector rangeKey={rangeKey} setRangeKey={setRangeKey} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <StatTile label="一番多い時間帯" value={`${peakHour.hour}時台`} sub={`${peakHour.total.toLocaleString()}件`} />
        <StatTile label="合計" value={`${hourlyTotal.toLocaleString()}件`} sub={range.label} />
      </div>

      <Card wide style={{ marginBottom: 14, padding: "18px 4px 12px" }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10, marginLeft: 12, color: C.sub }}>
          時間帯別メッセージ数（{range.label}）
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={hourly} margin={{ top: 10, right: 22, left: 6, bottom: 4 }}>
            <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="hour"
              tick={{ fill: C.sub, fontSize: 9.5 }}
              axisLine={false}
              tickLine={false}
              interval={3}
              tickFormatter={(h) => `${h}時`}
            />
            <YAxis tick={{ fill: C.sub, fontSize: 10 }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => v.toLocaleString()} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const row = payload[0].payload;
                return (
                  <div
                    style={{
                      background: C.panel2,
                      border: `1px solid ${C.stroke}`,
                      borderRadius: 12,
                      padding: "8px 11px",
                      fontSize: 11.5,
                    }}
                  >
                    <div style={{ color: C.sub, marginBottom: 2 }}>{row.hour}時台</div>
                    <div style={{ fontWeight: 700 }}>{row.total}件</div>
                  </div>
                );
              }}
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {hourly.map((h) => (
                <Cell key={h.hour} fill={h.hour === peakHour.hour ? C.b : C.a} fillOpacity={h.hour === peakHour.hour ? 1 : 0.55} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div style={{ fontSize: 12.5, color: C.sub, fontWeight: 600, marginBottom: 10 }}>時間帯の内訳</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {hourSegments.map((seg) => (
            <div key={seg.key}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>
                  {seg.label} <span style={{ color: C.subtle, fontWeight: 400 }}>（{seg.range}）</span>
                </span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>
                  {seg.count.toLocaleString()}件（{seg.pct}%）
                </span>
              </div>
              <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", background: C.stroke }}>
                <div style={{ width: `${seg.pct}%`, background: seg.color, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function BreakdownPage({ typeCounts, names, wordRanking, emojiRanking, replyStats, topics, emojiTrend }) {
  const typeKeys = ["text", "stamp", "photo", "video", "file", "other"];
  const totalA = typeKeys.reduce((s, k) => s + typeCounts.a[k], 0) || 1;
  const totalB = typeKeys.reduce((s, k) => s + typeCounts.b[k], 0) || 1;
  const maxWordCount = wordRanking[0]?.count || 1;
  const maxEmojiCount = emojiRanking[0]?.count || 1;
  const maxBucket = Math.max(1, ...replyStats.buckets.map((b) => b.count));

  // --- playful "compatibility" score (entertainment only, not a real metric) ---
  const totalMsgs = totalA + totalB;
  const balanceScore = 100 - Math.abs(50 - Math.round((totalA / (totalMsgs || 1)) * 100)) * 1.6;
  const fastReplies = replyStats.buckets.slice(0, 3).reduce((s, b) => s + b.count, 0);
  const speedScore = replyStats.totalReplies === 0 ? 50 : Math.min(100, Math.round((fastReplies / replyStats.totalReplies) * 100));
  const compatScore = Math.max(0, Math.min(100, Math.round(balanceScore * 0.5 + speedScore * 0.5)));
  const compatTier =
    compatScore >= 85
      ? { label: "運命の相性 ✨", emoji: "💞" }
      : compatScore >= 65
      ? { label: "いい感じ 😊", emoji: "💛" }
      : compatScore >= 40
      ? { label: "まだ発展中 🌱", emoji: "🌿" }
      : { label: "個性バラバラ型 🎭", emoji: "🔮" };

  return (
    <>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>内訳・ランキング</div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10, color: C.sub }}>メッセージ種類の内訳</div>
        {[
          { label: names.a, counts: typeCounts.a, total: totalA, color: C.a },
          { label: names.b, counts: typeCounts.b, total: totalB, color: C.b },
        ].map((person) => (
          <div key={person.label} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: person.color, marginBottom: 6 }}>{person.label}</div>
            <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", background: C.stroke }}>
              {typeKeys.map((k, i) =>
                person.counts[k] > 0 ? (
                  <div
                    key={k}
                    style={{
                      width: `${(person.counts[k] / person.total) * 100}%`,
                      background: hexToRgba(person.color, 1 - i * 0.14),
                    }}
                  />
                ) : null
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
              {typeKeys
                .filter((k) => person.counts[k] > 0)
                .map((k) => (
                  <span key={k} style={{ fontSize: 10.5, color: C.subtle }}>
                    {TYPE_LABELS[k]} {person.counts[k]}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10, color: C.sub }}>返信速度</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <StatTile label={`${names.a}の平均返信`} value={replyStats.avgA == null ? "—" : fmtMinutes(replyStats.avgA)} />
          <StatTile label={`${names.b}の平均返信`} value={replyStats.avgB == null ? "—" : fmtMinutes(replyStats.avgB)} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {replyStats.buckets.map((bk) => (
            <div key={bk.label}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: C.sub }}>{bk.label}</span>
                <span>{bk.count}件</span>
              </div>
              <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", background: C.stroke }}>
                <div style={{ width: `${(bk.count / maxBucket) * 100}%`, background: C.a, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10, color: C.sub }}>頻出ワードランキング</div>
        {wordRanking.length === 0 && <div style={{ fontSize: 11.5, color: C.subtle }}>十分なテキストがありません</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {wordRanking.map((w, i) => (
            <div key={w.word} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10.5, color: C.subtle, width: 16 }}>{i + 1}</span>
              <span style={{ fontSize: 12, fontWeight: 600, minWidth: 64 }}>{w.word}</span>
              <div style={{ flex: 1, height: 6, borderRadius: 999, background: C.stroke, overflow: "hidden" }}>
                <div style={{ width: `${(w.count / maxWordCount) * 100}%`, height: "100%", background: C.a, borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 11, color: C.subtle, width: 30, textAlign: "right" }}>{w.count}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10, color: C.sub }}>絵文字ランキング</div>
        {emojiRanking.length === 0 && <div style={{ fontSize: 11.5, color: C.subtle }}>絵文字が見つかりませんでした</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {emojiRanking.map((e) => (
            <div
              key={e.emoji}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: C.panel2,
                border: `1px solid ${C.stroke}`,
                borderRadius: 12,
                padding: "8px 10px",
                minWidth: 54,
              }}
            >
              <div style={{ fontSize: 18 }}>{e.emoji}</div>
              <div style={{ fontSize: 10.5, color: C.subtle, marginTop: 3 }}>{e.count}</div>
            </div>
          ))}
        </div>
      </Card>

      {topics && topics.some((t) => t.count > 0) && (
        <Card style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10, color: C.sub }}>会話トピック分類</div>
          <div style={{ fontSize: 10, color: C.subtle, marginBottom: 10 }}>
            キーワードから簡易的に分類した話題の傾向です
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {topics.map((t) => (
              <div key={t.key}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span>
                    {t.emoji} {t.label}
                  </span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>
                    {t.count}件（{t.pct}%）
                  </span>
                </div>
                <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", background: C.stroke }}>
                  <div style={{ width: `${t.pct}%`, background: C.a, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {emojiTrend && emojiTrend.length > 1 && (
        <Card style={{ marginTop: 14, padding: "16px 4px 10px" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8, marginLeft: 12, color: C.sub }}>
            絵文字使用率の時系列
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={emojiTrend} margin={{ top: 10, right: 20, left: 6, bottom: 4 }}>
              <defs>
                <linearGradient id="emojiFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.b} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={C.b} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: C.sub, fontSize: 9.5 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.sub, fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const row = payload[0].payload;
                  return (
                    <div style={{ background: C.panel2, border: `1px solid ${C.stroke}`, borderRadius: 10, padding: "6px 10px", fontSize: 11.5 }}>
                      {row.label}：{row.count}個
                    </div>
                  );
                }}
              />
              <Area type="monotone" dataKey="count" stroke={C.b} strokeWidth={2.5} fill="url(#emojiFill)" isAnimationActive={false} dot={{ r: 3, fill: C.b }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      <Card style={{ marginTop: 14, textAlign: "center" }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: C.sub, marginBottom: 8 }}>相性レポート</div>
        <div style={{ fontSize: 32 }}>{compatTier.emoji}</div>
        <div style={{ fontSize: 26, fontWeight: 800, marginTop: 2 }}>{compatScore}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.a, marginTop: 2 }}>{compatTier.label}</div>
        <div style={{ fontSize: 10, color: C.subtle, marginTop: 8 }}>
          ※メッセージ量と返信スピードから算出した占い感覚の遊び要素です
        </div>
      </Card>
    </>
  );
}

/* ---------- Story (wrapped-style playback) ---------- */
const STORY_BGS = [
  ["#4F8CFF", "#8B5CF6"],
  ["#FF7CC8", "#FFA63D"],
  ["#2FCBA3", "#3DB1FF"],
  ["#FF6F6F", "#FFC24B"],
  ["#6366F1", "#EC4899"],
  ["#0EA5E9", "#22C55E"],
  ["#F97316", "#DB2777"],
  ["#7C3AED", "#2563EB"],
];

function buildStorySlides({ names, chatTitle, RAW_D, messages, totalAll, longestStreak, currentStreak, milestone, wordRanking, emojiRanking }) {
  const slides = [];
  const add = (sl) => slides.push({ ...sl, bg: STORY_BGS[slides.length % STORY_BGS.length] });
  const title = chatTitle || `${names.a} ⇄ ${names.b}`;
  const firstD = RAW_D[0].date;
  const lastD = RAW_D[RAW_D.length - 1].date;
  const spanDays = daysBetween(firstD, lastD);
  const chars = RAW_D.reduce((sum, d) => sum + (d.chars || 0), 0);
  const sumA = RAW_D.reduce((sum, d) => sum + d.a, 0);
  const sumB = RAW_D.reduce((sum, d) => sum + d.b, 0);
  const aShare = totalAll === 0 ? 50 : Math.round((sumA / (sumA + sumB || 1)) * 100);
  const peak = RAW_D.reduce((m, d) => (d.total > m.total ? d : m), RAW_D[0]);

  add({ kind: "text", emoji: "💌", caption: "ふたりのトーク", title, sub: `${fmtLong(firstD)} 〜 ${fmtLong(lastD)}`, hint: "タップで次へ ／ 長押しで一時停止" });
  add({ kind: "text", emoji: "📅", caption: "トークを始めて", count: spanDays, suffix: "日", sub: `そのうち ${RAW_D.length}日 おしゃべりしました` });
  add({ kind: "text", emoji: "💬", caption: "やりとりしたメッセージ", count: totalAll, suffix: "件", sub: `1日平均 ${(totalAll / RAW_D.length).toFixed(1)}件` });
  if (chars > 0) {
    add({ kind: "text", emoji: "📚", caption: "打った文字数", count: chars, suffix: "字", sub: `文庫本 およそ${Math.max(0.1, chars / 100000).toFixed(1)}冊分` });
    const typeMin = Math.round(chars / 50);
    const typeLabel = typeMin >= 60 ? `${Math.floor(typeMin / 60)}時間${typeMin % 60}分` : `${typeMin}分`;
    add({ kind: "text", emoji: "⏰", caption: "文字を打っていた時間のめやす", title: `約${typeLabel}`, sub: "1分50字で計算しています" });
  }
  add({ kind: "bar", emoji: "⚖️", caption: "おしゃべりの割合", rows: [{ label: names.a, pct: aShare, count: sumA }, { label: names.b, pct: 100 - aShare, count: sumB }], sub: aShare === 50 ? "ぴったり半分ずつ！" : `${aShare > 50 ? names.a : names.b}のほうが少し多めです` });
  add({ kind: "text", emoji: "🏆", caption: "いちばん盛り上がった日", title: fmtLong(peak.date), sub: `${peak.total}件のやりとり` });

  const wdTotals = new Array(7).fill(0);
  RAW_D.forEach((d) => {
    wdTotals[new Date(parseDay(d.date)).getUTCDay()] += d.total;
  });
  const wdMax = wdTotals.indexOf(Math.max(...wdTotals));
  add({ kind: "text", emoji: "🗓️", caption: "いちばん話す曜日", title: `${["日", "月", "火", "水", "木", "金", "土"][wdMax]}曜日`, sub: `${wdTotals[wdMax].toLocaleString()}件` });

  const hours = new Array(24).fill(0);
  messages.forEach((m) => {
    const h = parseInt(m.time.slice(0, 2), 10);
    if (h >= 0 && h < 24) hours[h] += 1;
  });
  const ph = hours.indexOf(Math.max(...hours));
  add({ kind: "text", emoji: ph >= 6 && ph < 18 ? "☀️" : "🌙", caption: "いちばん話す時間帯", title: `${ph}時台`, sub: `${hours[ph].toLocaleString()}件` });
  const nightPct = messages.length ? Math.round(((hours[0] + hours[1] + hours[2] + hours[3] + hours[4] + hours[5]) / messages.length) * 100) : 0;
  if (nightPct >= 1) add({ kind: "text", emoji: "🦉", caption: "深夜（0〜5時）のメッセージ", count: nightPct, suffix: "%", sub: nightPct >= 15 ? "夜ふかしさんですね" : "ほどよく夜ふかし" });

  add({ kind: "text", emoji: "🔥", caption: "最長の連続記録", count: longestStreak.length, suffix: "日", sub: `${fmtShort(longestStreak.start)} 〜 ${fmtShort(longestStreak.end)}` });
  if (currentStreak.length > 0) add({ kind: "text", emoji: "⚡", caption: "いまの連続記録", count: currentStreak.length, suffix: "日", sub: "この勢いを継続中！" });

  if (wordRanking && wordRanking.length >= 3) {
    add({ kind: "rank", emoji: "🗣️", caption: "よく使った言葉", items: wordRanking.slice(0, 5).map((w) => ({ label: w.word, value: w.count })) });
  }
  if (emojiRanking && emojiRanking.length >= 1) {
    add({ kind: "rank", emoji: "😆", caption: "よく使った絵文字", items: emojiRanking.slice(0, 5).map((e) => ({ label: e.emoji, value: e.count })) });
  }

  const topic = findHotTopic(messages, firstD);
  if (topic && topic.highlights.length) {
    add({ kind: "bubbles", emoji: "🔥", caption: "いちばん盛り上がった話", topic, names });
  }

  if (milestone.anniversaryYears) add({ kind: "text", emoji: "🎂", caption: "記念日", title: `${milestone.anniversaryYears}周年`, sub: "おめでとう！" });
  add({ kind: "text", emoji: "✨", caption: "次の目標", title: `累計${milestone.nextTarget}日`, sub: `あと${Math.max(0, milestone.nextTarget - milestone.distinctDays)}日でたどりつきます` });
  add({ kind: "finale", emoji: "🎉", caption: "ふり返りはここまで", title: "これからもよろしく！", sub: `${totalAll.toLocaleString()}件 ・ ${spanDays}日間 ・ ${title}` });
  return slides;
}

// 大きな数字や見出しを、画面の幅に合わせて自動で縮めて収める（長い数字が折り返して崩れないように）
function FitBig({ base, allowWrap, sample, children, style, className }) {
  const outerRef = useRef(null);
  const sampleRef = useRef(null);
  const [fit, setFit] = useState({ size: base, wrap: false });
  useLayoutEffect(() => {
    let dead = false;
    const run = () => {
      const o = outerRef.current;
      const sm = sampleRef.current;
      if (dead || !o || !sm) return;
      const avail = o.clientWidth;
      const w = sm.offsetWidth; // base の大きさで1行に並べたときの幅
      if (!avail || !w) return;
      let next;
      if (w <= avail) next = { size: base, wrap: false };
      else {
        const target = Math.floor(base * (avail / w) * 0.98);
        const floor = allowWrap ? Math.round(base * 0.6) : 20;
        if (target >= floor) next = { size: target, wrap: false };
        else next = { size: floor, wrap: !!allowWrap };
      }
      setFit((f) => (f.size === next.size && f.wrap === next.wrap ? f : next));
    };
    run();
    // フォントの読み込み完了や画面サイズの変化で幅が変わるので測り直す
    try {
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    } catch (e) {}
    window.addEventListener("resize", run);
    return () => {
      dead = true;
      window.removeEventListener("resize", run);
    };
  }, [base, allowWrap, sample]);
  return (
    <div ref={outerRef} className={className} style={{ ...style, fontSize: fit.size, whiteSpace: fit.wrap ? "normal" : "nowrap", wordBreak: fit.wrap ? "break-word" : "normal" }}>
      <span
        ref={sampleRef}
        aria-hidden="true"
        style={{ position: "absolute", right: "100%", top: 0, visibility: "hidden", whiteSpace: "nowrap", pointerEvents: "none", fontSize: base, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}
      >
        {sample}
      </span>
      {children}
    </div>
  );
}

function CountUp({ to }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    let t0 = null;
    const tick = (t) => {
      if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / 1500);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{v.toLocaleString()}</>;
}

const STORY_CSS = `
@keyframes lta-up { from { opacity: 0; transform: translateY(26px) scale(.96); } to { opacity: 1; transform: none; } }
@keyframes lta-pop { 0% { transform: scale(.3); opacity: 0; } 60% { transform: scale(1.18); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes lta-prog { from { width: 0%; } to { width: 100%; } }
@keyframes lta-float { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-34px) scale(1.06); } }
@keyframes lta-grow { from { width: 0%; } }
@keyframes lta-rain { 0% { transform: translateY(-12vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(112vh) rotate(560deg); opacity: .9; } }
.lta-up { opacity: 0; animation: lta-up .7s cubic-bezier(.2,.9,.25,1) forwards; }
`;

function StoryPlayer({ slides, onClose }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const holdRef = useRef(null);
  const heldRef = useRef(false);
  const slide = slides[idx];
  const last = idx === slides.length - 1;
  const dur = slide.kind === "bubbles" ? 7 : slide.kind === "rank" ? 5.5 : 4.2;

  const next = () => setIdx((i) => Math.min(slides.length - 1, i + 1));
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const stop = (e) => e.stopPropagation();
  const up = (delay) => ({ className: "lta-up", style: { animationDelay: `${delay}s` } });

  const onDown = () => {
    heldRef.current = false;
    clearTimeout(holdRef.current);
    holdRef.current = setTimeout(() => {
      heldRef.current = true;
      setPaused(true);
    }, 200);
  };
  const onUp = (e) => {
    clearTimeout(holdRef.current);
    if (heldRef.current) {
      heldRef.current = false;
      setPaused(false);
      return;
    }
    const x = e.clientX;
    if (x < window.innerWidth * 0.33) prev();
    else next();
  };
  const onCancel = () => {
    clearTimeout(holdRef.current);
    heldRef.current = false;
    setPaused(false);
  };

  const bigText = slide.title || "";
  const bigSize = slide.count !== undefined ? 76 : bigText.length > 14 ? 30 : bigText.length > 9 ? 38 : 52;

  return (
    <div
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: `linear-gradient(160deg, ${slide.bg[0]}, ${slide.bg[1]})`,
        transition: "background 0.6s ease",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 24px calc(48px + env(safe-area-inset-bottom, 0px))",
        overflow: "hidden",
        userSelect: "none",
        touchAction: "manipulation",
        cursor: "pointer",
      }}
    >
      <style>{STORY_CSS}</style>
      {[[8, 12, 120], [78, 22, 70], [20, 70, 90], [84, 78, 150], [50, 45, 40], [62, 8, 56]].map(([l, t, sz], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${l}%`,
            top: `${t}%`,
            width: sz,
            height: sz,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            animation: `lta-float ${6 + i}s ease-in-out ${i * 0.4}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      <div style={{ position: "absolute", top: "calc(16px + env(safe-area-inset-top, 0px))", left: 16, right: 56, display: "flex", gap: 3 }}>
        {slides.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: "rgba(255,255,255,0.3)", overflow: "hidden" }}>
            {i < idx || (i === idx && last) ? (
              <div style={{ width: "100%", height: "100%", background: "#fff" }} />
            ) : i === idx ? (
              <div
                key={idx}
                onAnimationEnd={next}
                style={{ height: "100%", background: "#fff", animation: `lta-prog ${dur}s linear forwards`, animationPlayState: paused ? "paused" : "running" }}
              />
            ) : null}
          </div>
        ))}
      </div>
      <button
        onPointerDown={stop}
        onPointerUp={stop}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="閉じる"
        style={{ position: "absolute", top: "calc(6px + env(safe-area-inset-top, 0px))", right: 8, background: "transparent", border: "none", color: "#fff", padding: 12, cursor: "pointer" }}
      >
        <XIcon size={22} />
      </button>

      {last &&
        Array.from({ length: 36 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: `${(i * 97) % 100}%`,
              width: 8,
              height: 14,
              borderRadius: 2,
              background: ["#fff", "#FFD166", "#FF7CC8", "#7CF2D0"][i % 4],
              animation: `lta-rain ${3 + (i % 5) * 0.6}s linear ${(i % 9) * 0.25}s infinite`,
              pointerEvents: "none",
            }}
          />
        ))}

      <div key={idx} style={{ position: "relative", width: "100%", maxWidth: 420, textAlign: "center" }}>
        <div style={{ fontSize: 84, lineHeight: 1, animation: "lta-pop .8s cubic-bezier(.2,.9,.25,1) both" }}>{slide.emoji}</div>
        <div {...up(0.15)} style={{ ...up(0.15).style, fontSize: 16, opacity: 0.9, marginTop: 18, letterSpacing: "0.04em" }}>
          {slide.caption}
        </div>

        {(slide.kind === "text" || slide.kind === "finale") && (
          <>
            <FitBig
              className="lta-up"
              base={bigSize}
              allowWrap={slide.count === undefined}
              sample={
                slide.count !== undefined ? (
                  <>
                    {Number(slide.count).toLocaleString()}
                    <span style={{ fontSize: "0.4em", marginLeft: "0.05em" }}>{slide.suffix}</span>
                  </>
                ) : (
                  bigText
                )
              }
              style={{ position: "relative", animationDelay: "0.3s", fontWeight: 800, marginTop: 10, lineHeight: 1.2, fontVariantNumeric: "tabular-nums", textShadow: "0 4px 18px rgba(0,0,0,0.25)" }}
            >
              {slide.count !== undefined ? (
                <>
                  <CountUp to={slide.count} />
                  <span style={{ fontSize: "0.4em", marginLeft: "0.05em" }}>{slide.suffix}</span>
                </>
              ) : (
                bigText
              )}
            </FitBig>
            {slide.sub && (
              <div className="lta-up" style={{ animationDelay: "0.55s", fontSize: 15, opacity: 0.92, marginTop: 14, lineHeight: 1.6 }}>
                {slide.sub}
              </div>
            )}
          </>
        )}

        {slide.kind === "bar" && (
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 18 }}>
            {slide.rows.map((r, i) => (
              <div key={i} className="lta-up" style={{ animationDelay: `${0.3 + i * 0.2}s`, textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
                  <span>{r.label}</span>
                  <span>{r.pct}%</span>
                </div>
                <div style={{ height: 16, borderRadius: 999, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
                  <div style={{ width: `${r.pct}%`, height: "100%", borderRadius: 999, background: "#fff", animation: `lta-grow 1.2s cubic-bezier(.2,.9,.25,1) ${0.5 + i * 0.2}s backwards` }} />
                </div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{r.count.toLocaleString()}件</div>
              </div>
            ))}
            <div className="lta-up" style={{ animationDelay: "0.9s", fontSize: 14, opacity: 0.92 }}>{slide.sub}</div>
          </div>
        )}

        {slide.kind === "rank" && (
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {slide.items.map((it, i) => {
              const max = slide.items[0].value || 1;
              return (
                <div key={i} className="lta-up" style={{ animationDelay: `${0.3 + i * 0.18}s`, display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
                  <div style={{ width: 24, fontSize: 18, fontWeight: 800, opacity: 0.9 }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: i === 0 ? 22 : 17, fontWeight: 700 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.label}</span>
                      <span style={{ fontSize: 13, opacity: 0.9 }}>{it.value.toLocaleString()}回</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.25)", marginTop: 4, overflow: "hidden" }}>
                      <div style={{ width: `${(it.value / max) * 100}%`, height: "100%", background: "#fff", borderRadius: 999, animation: `lta-grow 1s ease-out ${0.5 + i * 0.18}s backwards` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {slide.kind === "bubbles" && (
          <div style={{ marginTop: 14 }}>
            <div className="lta-up" style={{ animationDelay: "0.3s", fontSize: 13, opacity: 0.92, marginBottom: 12 }}>
              {fmtLong(slide.topic.date)} {slide.topic.start}〜{slide.topic.end}（{slide.topic.count}件）
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {slide.topic.highlights.slice(0, 4).map((m, i) => {
                const mine = m.sender === slide.names.a;
                return (
                  <div key={i} className="lta-up" style={{ animationDelay: `${0.6 + i * 0.7}s`, alignSelf: mine ? "flex-start" : "flex-end", maxWidth: "85%", textAlign: "left" }}>
                    <div style={{ fontSize: 10.5, opacity: 0.85, marginBottom: 2, textAlign: mine ? "left" : "right" }}>{m.sender}</div>
                    <div style={{ background: mine ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.28)", color: mine ? "#2A2540" : "#fff", padding: "9px 13px", borderRadius: 18, fontSize: 14, lineHeight: 1.5, wordBreak: "break-word" }}>
                      {m.content.length > 60 ? m.content.slice(0, 60) + "…" : m.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {slide.hint && (
          <div className="lta-up" style={{ animationDelay: "1s", fontSize: 11.5, opacity: 0.8, marginTop: 36 }}>{slide.hint}</div>
        )}

        {last && (
          <div className="lta-up" style={{ animationDelay: "1s", display: "flex", gap: 10, justifyContent: "center", marginTop: 28 }}>
            <button
              onPointerDown={stop}
              onPointerUp={stop}
              onClick={(e) => {
                e.stopPropagation();
                setIdx(0);
              }}
              style={{ background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.5)", color: "#fff", borderRadius: 999, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >
              もう一度見る
            </button>
            <button
              onPointerDown={stop}
              onPointerUp={stop}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              style={{ background: "#fff", border: "none", color: "#2A2540", borderRadius: 999, padding: "10px 22px", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
            >
              閉じる
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Confetti({ seed }) {
  const colors = [C.a, C.b, C.green, C.red];
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 3800);
    return () => clearTimeout(t);
  }, [seed]);
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 1.2,
        color: colors[i % colors.length],
        rotate: Math.random() * 360,
      })),
    [seed]
  );
  if (done) return null;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: 20 }}>
      <style>{`@keyframes lta-confetti-fall { 0% { transform: translateY(-10px) rotate(0deg); opacity: 1; } 100% { transform: translateY(160px) rotate(360deg); opacity: 0; } }`}</style>
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: 0,
            width: 6,
            height: 10,
            background: p.color,
            borderRadius: 2,
            opacity: 0,
            animation: `lta-confetti-fall ${p.duration}s ease-in ${p.delay}s 1 both`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function CalendarMapPage({ calendarDays, maxDayTotal, milestone, totalAll, longestStreak, currentStreak, chatTitle, names, RAW_D, messages, wordRanking, emojiRanking }) {
  const [storyOpen, setStoryOpen] = useState(false);
  const [confettiKey, setConfettiKey] = useState(milestone.isExact ? 1 : 0);
  // ストーリーは「ストーリー再生」を押すまで作らない
  const [storyUsed, setStoryUsed] = useState(false);
  const storySlides = useLazyMemo(
    storyUsed,
    () => buildStorySlides({ names, chatTitle, RAW_D, messages, totalAll, longestStreak, currentStreak, milestone, wordRanking, emojiRanking }),
    [names, chatTitle, RAW_D, messages, totalAll, longestStreak, currentStreak, milestone, wordRanking, emojiRanking]
  );

  return (
    <>
      {storyOpen && storySlides && <StoryPlayer slides={storySlides} onClose={() => setStoryOpen(false)} />}
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>カレンダー・記念日</div>
      <button
        onClick={() => {
          setStoryUsed(true);
          setStoryOpen(true);
        }}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "26px 16px",
          marginBottom: 16,
          background: `linear-gradient(135deg, ${C.a}, ${C.b})`,
          color: "#fff",
          border: "none",
          borderRadius: 28,
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: "0.03em",
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
        }}
      >
        <Play size={26} color="#fff" />
        ストーリー再生
        <span style={{ fontSize: 26 }}>✨</span>
      </button>

      <Card style={{ marginBottom: 14, textAlign: "center", position: "relative", overflow: "hidden" }}>
        {confettiKey > 0 && <Confetti key={confettiKey} seed={confettiKey} />}
        {milestone.isExact ? (
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.green }}>
            🎉 累計トーク {milestone.distinctDays}日目の記念日！
          </div>
        ) : (
          <div style={{ fontSize: 13, color: C.sub }}>
            累計トーク日数 <b style={{ color: C.text }}>{milestone.distinctDays}日</b>
            　次の記念日（{milestone.nextTarget}日）まであと {milestone.nextTarget - milestone.distinctDays}日
          </div>
        )}
        {milestone.anniversaryYears && (
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.b, marginTop: 6 }}>
            🎂 トーク開始から{milestone.anniversaryYears}周年！
          </div>
        )}
        <button
          onClick={() => {
            setConfettiKey((k) => k + 1);
            playCelebration();
          }}
          style={{
            marginTop: 10,
            background: "transparent",
            border: `1px solid ${C.stroke}`,
            borderRadius: 999,
            padding: "4px 12px",
            fontSize: 11,
            color: C.subtle,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          🎊 お祝いする
        </button>
      </Card>

      {milestone.achieved.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10, color: C.sub, display: "flex", alignItems: "center", gap: 5 }}>
            <Bell size={13} />
            記念日の通知リスト
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {milestone.achieved.map((item, i) => {
              const dateLabel = item.date
                ? fmtLong(item.date)
                : `${item.dateObj.getMonth() + 1}月${item.dateObj.getDate()}日`;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: C.panel2,
                    border: `1px solid ${C.stroke}`,
                    borderRadius: 10,
                    padding: "7px 10px",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{item.type === "anniv" ? "🎂" : "🎉"}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 10.5, color: C.subtle }}>{dateLabel}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </>
  );
}

const __lowersCache = new WeakMap();
function SearchPage({ messages, names }) {
  const [query, setQuery] = useState("");
  // 入力欄はすぐ反応させ、検索そのものは少し遅れて実行する（長いトークでも打ち込みが重くならない）
  const deferredQuery = React.useDeferredValue ? React.useDeferredValue(query) : query;
  // 小文字化は最初に検索するときまで行わない（ページを開くだけでは全件を処理しない）
  const hasQuery = deferredQuery.trim() !== "";
  const lowers = useMemo(() => {
    if (!hasQuery) return null;
    let v = __lowersCache.get(messages);
    if (!v) {
      v = messages.map((m) => m.content.toLowerCase());
      __lowersCache.set(messages, v);
    }
    return v;
  }, [messages, hasQuery]);

  const matches = useMemo(() => {
    const q = deferredQuery.trim();
    if (!q || !lowers) return [];
    const lowerQ = q.toLowerCase();
    const out = [];
    for (let i = lowers.length - 1; i >= 0; i--) {
      if (lowers[i].includes(lowerQ)) out.push(messages[i]);
    }
    return out;
  }, [deferredQuery, messages, lowers]);

  const highlight = (content, q) => {
    if (!q) return content;
    const idx = content.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return content;
    return (
      <>
        {content.slice(0, idx)}
        <mark style={{ background: C.b, color: C.panel, borderRadius: 3, padding: "0 2px" }}>
          {content.slice(idx, idx + q.length)}
        </mark>
        {content.slice(idx + q.length)}
      </>
    );
  };

  return (
    <>
      <style>{`.no-scrollbar{scrollbar-width:none;-ms-overflow-style:none}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>キーワード検索</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: C.panel2,
          border: `1px solid ${C.stroke}`,
          borderRadius: 14,
          padding: "10px 14px",
          marginBottom: 10,
        }}
      >
        <Search size={15} color={C.subtle} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="キーワードを入力"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: C.text,
            fontSize: 13,
            fontFamily: "inherit",
          }}
        />
      </div>

      {query.trim() && (
        <div style={{ fontSize: 11.5, color: C.subtle, marginBottom: 10 }}>
          {matches.length}件見つかりました{matches.length > 150 ? "（先頭150件を表示）" : ""}
        </div>
      )}

      <div className="no-scrollbar" style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 460, overflowY: "auto" }}>
        {matches.slice(0, 150).map((m, i) => (
          <div
            key={i}
            style={{
              background: C.panel2,
              border: `1px solid ${C.stroke}`,
              borderRadius: 12,
              padding: "9px 12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: C.subtle, marginBottom: 4 }}>
              <span style={{ color: m.sender === names.a ? C.a : C.b, fontWeight: 600 }}>{m.sender}</span>
              <span>{fmtLong(m.date)} {m.time}</span>
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.5, wordBreak: "break-word" }}>{highlight(m.content, query.trim())}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function MonthlyPage({ monthly, names }) {
  const trendData = [...monthly]
    .reverse()
    .map((m) => ({ ym: m.ym, label: `${parseInt(m.ym.split("-")[1])}月`, total: m.total }));

  const [goal, setGoal] = useState(() => {
    try {
      return parseInt(localStorage.getItem("lta_goal"), 10) || 500;
    } catch (e) {
      return 500;
    }
  });
  const updateGoal = (v) => {
    const n = Math.max(1, parseInt(v, 10) || 1);
    setGoal(n);
    try {
      localStorage.setItem("lta_goal", String(n));
    } catch (e) {}
  };
  const latestMonth = monthly[0];
  const goalProgress = latestMonth ? Math.min(100, Math.round((latestMonth.total / goal) * 100)) : 0;
  const goalReached = goalProgress >= 100;

  return (
    <>
      <style>{`.no-scrollbar{scrollbar-width:none;-ms-overflow-style:none}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>月間まとめ</div>

      {latestMonth && (
        <Card style={{ marginBottom: 14, position: "relative", overflow: "hidden" }}>
          {goalReached && <Confetti key={latestMonth.ym} seed={latestMonth.ym} />}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.sub }}>今月の目標</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                type="number"
                value={goal}
                onChange={(e) => updateGoal(e.target.value)}
                style={{
                  width: 64,
                  background: C.panel2,
                  border: `1px solid ${C.stroke}`,
                  borderRadius: 8,
                  color: C.text,
                  fontSize: 11,
                  padding: "3px 6px",
                  fontFamily: "inherit",
                }}
              />
              <span style={{ fontSize: 10.5, color: C.subtle }}>件</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
            <span style={{ fontWeight: 700 }}>
              {latestMonth.total} / {goal}件
            </span>
            <span style={{ color: goalReached ? C.green : C.subtle, fontWeight: 600 }}>{goalProgress}%{goalReached ? " 🎉達成！" : ""}</span>
          </div>
          <div style={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden", background: C.stroke }}>
            <div style={{ width: `${goalProgress}%`, background: goalReached ? C.green : C.a, borderRadius: 999 }} />
          </div>
        </Card>
      )}

      {trendData.length > 1 && (
        <Card wide style={{ marginBottom: 14, padding: "16px 4px 10px" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8, marginLeft: 12, color: C.sub }}>
            月次成長トレンド
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={trendData} margin={{ top: 14, right: 22, left: 6, bottom: 4 }}>
              <defs>
                <linearGradient id="monthlyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.a} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={C.a} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: C.sub, fontSize: 9.5 }} axisLine={false} tickLine={false} padding={{ left: 8, right: 8 }} />
              <YAxis tick={{ fill: C.sub, fontSize: 10 }} axisLine={false} tickLine={false} width={44} domain={[0, "auto"]} tickFormatter={(v) => v.toLocaleString()} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const row = payload[0].payload;
                  return (
                    <div style={{ background: C.panel2, border: `1px solid ${C.stroke}`, borderRadius: 10, padding: "6px 10px", fontSize: 11.5 }}>
                      {row.label}：{row.total}件
                    </div>
                  );
                }}
              />
              <Area type="monotone" dataKey="total" stroke={C.a} strokeWidth={2.5} fill="url(#monthlyFill)" isAnimationActive={false} dot={{ r: 3, fill: C.a }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      <div className="no-scrollbar" style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 520, overflowY: "auto" }}>
        {monthly.map((m) => {
          const [y, mo] = m.ym.split("-");
          const aShare = m.total === 0 ? 50 : Math.round((m.a / m.total) * 100);
          return (
            <Card key={m.ym}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>
                  {y}年{parseInt(mo)}月
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{m.total.toLocaleString()}件</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                <StatTile label="対話日数" value={`${m.days}日`} />
                <StatTile label="1日平均" value={`${Math.round(m.total / m.days)}件`} />
                <StatTile label="最多日" value={`${m.topDay.total}件`} sub={fmtShort(m.topDay.date)} />
              </div>
              <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", background: C.stroke }}>
                <div style={{ width: `${aShare}%`, background: C.a }} />
                <div style={{ width: `${100 - aShare}%`, background: C.b }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: C.subtle, marginTop: 5 }}>
                <span>{names.a} {aShare}%</span>
                <span>{names.b} {100 - aShare}%</span>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function PeriodCompare({ names, RAW_D, chatTitle }) {
  const first = RAW_D[0].date;
  const last = RAW_D[RAW_D.length - 1].date;
  const months = useMemo(() => Array.from(new Set(RAW_D.map((d) => d.date.slice(0, 7)))), [RAW_D]);
  const [mode, setMode] = useState("w");
  const [mA, setMA] = useState(months[months.length - 1]);
  const [mB, setMB] = useState(months[Math.max(0, months.length - 2)]);
  const [status, setStatus] = useState(null);

  const monthPeriod = (ym) => {
    const [y, m] = ym.split("-").map(Number);
    const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const s = `${ym}-01`;
    const e = `${ym}-${String(lastDay).padStart(2, "0")}`;
    return { label: `${y}年${m}月`, start: s < first ? first : s, end: e > last ? last : e };
  };
  const winPeriod = (n, offset, label) => {
    const end = addDaysStr(last, -offset);
    const start = addDaysStr(end, -(n - 1));
    return { label, start: start < first ? first : start, end };
  };

  let pA, pB;
  if (mode === "w") {
    pA = winPeriod(7, 0, "直近7日");
    pB = winPeriod(7, 7, "その前7日");
  } else if (mode === "d30") {
    pA = winPeriod(30, 0, "直近30日");
    pB = winPeriod(30, 30, "その前30日");
  } else {
    pA = monthPeriod(mA);
    pB = monthPeriod(mB);
  }
  const sA = summarizePeriod(RAW_D, pA);
  const sB = summarizePeriod(RAW_D, pB);

  const metrics = [
    { label: "メッセージ数", get: (s) => s.total, fmt: (v) => `${v.toLocaleString()}件` },
    { label: "1日平均", get: (s) => s.avg, fmt: (v) => `${v.toFixed(1)}件` },
    { label: "やりとりした日", get: (s) => s.activeDays, fmt: (v) => `${v}日` },
    { label: names.a, get: (s) => s.a, fmt: (v) => `${v.toLocaleString()}件` },
    { label: names.b, get: (s) => s.b, fmt: (v) => `${v.toLocaleString()}件` },
    { label: "文字数", get: (s) => s.chars, fmt: (v) => `${Math.round(v).toLocaleString()}字` },
  ];
  const table = metrics.map((m) => {
    const va = m.get(sA);
    const vb = m.get(sB);
    if (!vb) return { label: m.label, a: m.fmt(va), b: m.fmt(vb), diff: "—", up: null };
    const pct = ((va - vb) / vb) * 100;
    return {
      label: m.label,
      a: m.fmt(va),
      b: m.fmt(vb),
      diff: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
      up: pct === 0 ? null : pct > 0,
    };
  });
  const title = chatTitle || `${names.a} ⇄ ${names.b}`;

  const modeBtn = (key, label) => (
    <button
      key={key}
      onClick={() => setMode(key)}
      style={{
        flex: 1,
        padding: "7px 0",
        borderRadius: 999,
        border: `1px solid ${mode === key ? C.a : C.stroke}`,
        background: mode === key ? C.panel2 : "transparent",
        color: mode === key ? C.text : C.sub,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
  const selStyle = {
    flex: 1,
    background: C.panel2,
    color: C.text,
    border: `1px solid ${C.stroke}`,
    borderRadius: 12,
    padding: "7px 8px",
    fontSize: 12,
    fontFamily: "inherit",
  };

  return (
    <>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>期間で比較</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {modeBtn("w", "週")}
        {modeBtn("d30", "30日")}
        {modeBtn("m", "月")}
      </div>
      {mode === "m" && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
          <select value={mA} onChange={(e) => setMA(e.target.value)} style={{ ...selStyle, color: C.a }}>
            {months.map((m) => (
              <option key={m} value={m}>{m.replace("-", "年")}月</option>
            ))}
          </select>
          <span style={{ fontSize: 11, color: C.subtle }}>vs</span>
          <select value={mB} onChange={(e) => setMB(e.target.value)} style={{ ...selStyle, color: C.b }}>
            {months.map((m) => (
              <option key={m} value={m}>{m.replace("-", "年")}月</option>
            ))}
          </select>
        </div>
      )}
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr 1fr 0.8fr", gap: 6, alignItems: "end", marginBottom: 8 }}>
          <div />
          <div style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: C.a }}>{pA.label}</div>
          <div style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: C.b }}>{pB.label}</div>
          <div style={{ textAlign: "right", fontSize: 11, color: C.sub }}>差</div>
        </div>
        {table.map((r) => (
          <div
            key={r.label}
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 1fr 1fr 0.8fr",
              gap: 6,
              padding: "9px 0",
              borderTop: `1px solid ${C.stroke}`,
              fontSize: 12.5,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <div style={{ color: C.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</div>
            <div style={{ textAlign: "right", fontWeight: 600 }}>{r.a}</div>
            <div style={{ textAlign: "right", fontWeight: 600 }}>{r.b}</div>
            <div style={{ textAlign: "right", fontWeight: 700, color: r.up === null ? C.subtle : r.up ? C.green : C.red }}>{r.diff}</div>
          </div>
        ))}
      </Card>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginTop: 10 }}>
        {status && <span style={{ fontSize: 10.5, color: C.subtle }}>{status}</span>}
        <button
          onClick={() =>
            saveCanvasImage(
              (ctx, w, h) => drawCompareImage(ctx, w, h, { title, pA, pB, table }),
              1080,
              1350,
              `${title}_compare.png`,
              setStatus
            )
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: C.panel2,
            color: C.sub,
            border: `1px solid ${C.stroke}`,
            borderRadius: 999,
            padding: "5px 12px",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <Download size={12} />
          画像で保存
        </button>
      </div>
      <div style={{ height: 22 }} />
    </>
  );
}

function ComparePage({ names, RAW_D, totalAll, chatTitle }) {
  const [compareData, setCompareData] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = typeof reader.result === "string" ? reader.result : "";
        const result = parseLineExport(text);
        if (!result) {
          setError("メッセージが見つかりませんでした。");
          return;
        }
        setCompareData(result);
      } catch (e) {
        setError("ファイルの読み込みに失敗しました。");
      }
    };
    reader.readAsText(file, "utf-8");
  };

  const firstDate = RAW_D[0].date;
  const lastDate = RAW_D[RAW_D.length - 1].date;
  const spanDays = Math.round((new Date(lastDate) - new Date(firstDate)) / 86400000) + 1;
  const avgPerDay = totalAll / RAW_D.length;

  let cmpSpanDays = null;
  let cmpAvgPerDay = null;
  if (compareData) {
    const cFirst = compareData.RAW[0].date;
    const cLast = compareData.RAW[compareData.RAW.length - 1].date;
    cmpSpanDays = Math.round((new Date(cLast) - new Date(cFirst)) / 86400000) + 1;
    cmpAvgPerDay = compareData.messageCount / compareData.RAW.length;
  }

  return (
    <>
      <PeriodCompare names={names} RAW_D={RAW_D} chatTitle={chatTitle} />
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>トーク比較</div>

      {!compareData && (
        <Card
          onClick={() => inputRef.current && inputRef.current.click()}
          style={{ textAlign: "center", padding: "26px 16px", cursor: "pointer", border: `2px dashed ${C.stroke}` }}
        >
          <Upload size={22} color={C.sub} />
          <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 8 }}>比較したい2つ目のファイルを選択</div>
          <div style={{ fontSize: 10.5, color: C.subtle, marginTop: 4 }}>別のトーク履歴を読み込んで比較します</div>
          <input
            ref={inputRef}
            type="file"
            accept=".txt"
            hidden
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) handleFile(file);
            }}
          />
        </Card>
      )}

      {error && (
        <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 14, background: C.redDim, color: C.red, fontSize: 12 }}>
          {error}
        </div>
      )}

      {compareData && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
            <button
              onClick={() => setCompareData(null)}
              style={{ background: "transparent", border: "none", color: C.subtle, fontSize: 11, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit" }}
            >
              読み込み直す
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Card>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.a, marginBottom: 10 }}>
                {chatTitle || `${names.a} ⇄ ${names.b}`}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <StatTile label="総メッセージ数" value={`${totalAll.toLocaleString()}件`} />
                <StatTile label="期間" value={`${spanDays}日`} />
                <StatTile label="1日平均" value={`${avgPerDay.toFixed(1)}件`} />
              </div>
            </Card>
            <Card>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.b, marginBottom: 10 }}>
                {compareData.chatTitle || `${compareData.names.a} ⇄ ${compareData.names.b}`}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <StatTile label="総メッセージ数" value={`${compareData.messageCount.toLocaleString()}件`} />
                <StatTile label="期間" value={`${cmpSpanDays}日`} />
                <StatTile label="1日平均" value={`${cmpAvgPerDay.toFixed(1)}件`} />
              </div>
            </Card>
          </div>

          <Card style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 8 }}>1日平均メッセージ数の比較</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 90 }}>
              {[
                { label: "こちら", value: avgPerDay, color: C.a },
                { label: "比較先", value: cmpAvgPerDay, color: C.b },
              ].map((bar) => {
                const maxV = Math.max(avgPerDay, cmpAvgPerDay, 1);
                const h = Math.max(6, (bar.value / maxV) * 80);
                return (
                  <div key={bar.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{bar.value.toFixed(1)}</div>
                    <div style={{ width: "60%", height: h, background: bar.color, borderRadius: "6px 6px 0 0" }} />
                    <div style={{ fontSize: 10.5, color: C.subtle, marginTop: 4 }}>{bar.label}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </>
  );
}

function ShareCardPage({ storySlides, messages, names, chatTitle, totalAll, RAW_D, longestStreak, currentStreak }) {
  const spanDays = Math.round((new Date(RAW_D[RAW_D.length - 1].date) - new Date(RAW_D[0].date)) / 86400000) + 1;
  const [imgStatus, setImgStatus] = useState(null);
  const [topicRange, setTopicRange] = useState("1M");
  const [withTopic, setWithTopic] = useState(true);
  const title = chatTitle || `${names.a} ⇄ ${names.b}`;
  const topic = useMemo(() => findHotTopic(messages, topicStartDate(RAW_D, topicRange)), [messages, RAW_D, topicRange]);
  const imgTopic = withTopic ? topic : null;
  const saveShare = (which) => {
    const pages = [
      {
        draw: (ctx, w, h) =>
          drawShareImage(ctx, w, h, {
            title,
            names,
            total: totalAll,
            span: spanDays,
            longest: longestStreak.length,
            current: currentStreak.length,
            topic: imgTopic,
          }),
        w: 1080,
        h: imgTopic ? 1880 : 1350,
        filename: `${title}_card.png`,
      },
    ];
    if (storySlides) {
      pages.push({
        draw: (ctx, w, h) => drawDigestImage(ctx, w, h, { title, digest: storySlides }),
        w: 1080,
        h: 130 + storyDigestHeight(storySlides) + 120,
        filename: `${title}_card_2.png`,
      });
    }
    saveCanvasImages([pages[which] || pages[0]], setImgStatus);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>シェア用カード</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {imgStatus && <span style={{ fontSize: 10.5, color: C.subtle }}>{imgStatus}</span>}
          <button
            onClick={() => saveShare(0)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: C.panel2,
              color: C.sub,
              border: `1px solid ${C.stroke}`,
              borderRadius: 999,
              padding: "5px 12px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Download size={12} />
            画像で保存
          </button>
          {storySlides && (
            <button
              onClick={() => saveShare(1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: C.panel2,
                color: C.sub,
                border: `1px solid ${C.stroke}`,
                borderRadius: 999,
                padding: "5px 12px",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <Download size={12} />
              ストーリー画像
            </button>
          )}
        </div>
      </div>
      <div
        style={{
          borderRadius: 24,
          padding: "32px 24px",
          background: `linear-gradient(160deg, ${C.a} 0%, ${C.b} 100%)`,
          color: "#fff",
          textAlign: "center",
          boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontSize: 11, opacity: 0.85, letterSpacing: "0.08em" }}>TALK ANALYTICS</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginTop: 10 }}>{chatTitle || `${names.a} ⇄ ${names.b}`}</div>
        <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>
          {names.a} ⇄ {names.b}
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: 24 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{totalAll.toLocaleString()}</div>
            <div style={{ fontSize: 10.5, opacity: 0.85, marginTop: 2 }}>総メッセージ数</div>
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{spanDays}</div>
            <div style={{ fontSize: 10.5, opacity: 0.85, marginTop: 2 }}>日間</div>
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{longestStreak.length}</div>
            <div style={{ fontSize: 10.5, opacity: 0.85, marginTop: 2 }}>最長連続日数</div>
          </div>
        </div>
        <div style={{ fontSize: 10, opacity: 0.75, marginTop: 24 }}>
          現在{currentStreak.length}日連続中 🔥
        </div>
      </div>
      <HotTopicCard messages={messages} RAW_D={RAW_D} names={names} rangeKey={topicRange} setRangeKey={setTopicRange} />
      <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11.5, color: C.sub, marginTop: 4, cursor: "pointer" }}>
        <input type="checkbox" checked={withTopic} onChange={(e) => setWithTopic(e.target.checked)} />
        盛り上がった話を画像に入れる
      </label>
      <div style={{ fontSize: 10.5, color: C.subtle, textAlign: "center", marginTop: 12 }}>
        「画像で保存」でカード、「ストーリー画像」でストーリーまとめをPNG画像にできます
      </div>
    </>
  );
}

// ms = 1件あたりの間隔。期間（1日〜全期間）に関係なく、どの期間でも同じ速さで再生する
const REPLAY_SPEEDS = [
  { key: "s1", label: "ゆっくり", ms: 1200 },
  { key: "s2", label: "ふつう", ms: 700 },
  { key: "s3", label: "はやい", ms: 400 },
  { key: "s4", label: "超はやい", ms: 100 },
];
function fmtEta(sec) {
  if (sec < 60) return `約${Math.max(1, Math.round(sec))}秒`;
  if (sec < 3600) return `約${Math.round(sec / 60)}分`;
  return `約${(sec / 3600).toFixed(1)}時間`;
}
const REPLAY_WINDOW = 150;
// days = 選んだ日を最終日として、さかのぼって再生する日数（0 = 全期間）
const REPLAY_MODES = [
  { key: "day", label: "1日", days: 1 },
  { key: "w1", label: "1週間", days: 7 },
  { key: "w2", label: "2週間", days: 14 },
  { key: "m1", label: "1ヶ月", days: 30 },
  { key: "all", label: "全期間", days: 0 },
];
function fmtYMD(d) {
  const [y, m, day] = d.split("-");
  return `${y}年${parseInt(m)}月${parseInt(day)}日`;
}

// 再生中は1件増えるたびに一覧が再描画されるので、すでに出ているメッセージは作り直さない
const ReplayBubble = React.memo(function ReplayBubble({ m, isA, newDay, showDate }) {
  const isPlaceholder = m.type !== "text";
  return (
    <>
      {newDay && (
        <div style={{ alignSelf: "center", fontSize: 10, color: C.sub, background: C.panel, border: `1px solid ${C.stroke}`, borderRadius: 999, padding: "2px 10px", margin: "6px 0 2px" }}>
          {showDate}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: isA ? "flex-end" : "flex-start" }}>
        <div style={{ maxWidth: "75%" }}>
          {!isA && <div style={{ fontSize: 9.5, color: C.subtle, marginBottom: 2, marginLeft: 4 }}>{m.sender}</div>}
          <div
            style={{
              background: isA ? C.green : C.panel,
              color: isA ? "#07210F" : C.text,
              border: isA ? "none" : `1px solid ${C.stroke}`,
              borderRadius: 14,
              padding: "7px 12px",
              fontSize: 12.5,
              wordBreak: "break-word",
              fontStyle: isPlaceholder ? "italic" : "normal",
              opacity: isPlaceholder ? 0.8 : 1,
            }}
          >
            {isPlaceholder ? TYPE_LABELS[m.type] : m.content}
          </div>
          <div style={{ fontSize: 9, color: C.subtle, marginTop: 2, textAlign: isA ? "right" : "left" }}>{m.time}</div>
        </div>
      </div>
    </>
  );
});

function ReplayPage({ messages, names, RAW_D }) {
  const [mode, setMode] = useState("day");
  const [speedKey, setSpeedKey] = useState("s2");
  const [selectedDate, setSelectedDate] = useState(RAW_D[RAW_D.length - 1].date);
  const [visibleCount, setVisibleCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);
  const speed = REPLAY_SPEEDS.find((x) => x.key === speedKey) || REPLAY_SPEEDS[0];
  const modeDef = REPLAY_MODES.find((x) => x.key === mode) || REPLAY_MODES[0];
  const isAll = mode === "all";
  const isMulti = mode !== "day";
  const periodStart = isAll ? RAW_D[0].date : addDaysStr(selectedDate, -(modeDef.days - 1));

  const source = useMemo(() => {
    if (isAll) return messages;
    return sliceByDate(messages, isMulti ? periodStart : selectedDate, selectedDate);
  }, [messages, selectedDate, isAll, isMulti, periodStart]);

  useEffect(() => {
    setVisibleCount(0);
    setPlaying(false);
    clearTimeout(timerRef.current);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [selectedDate, mode]);

  useEffect(() => {
    if (!playing) return;
    if (visibleCount >= source.length) {
      setPlaying(false);
      return;
    }
    // 期間に関係なく、いつも1件ずつ speed.ms 間隔で再生する
    const tickMs = speed.ms;
    timerRef.current = setTimeout(() => {
      const next = source[visibleCount];
      setVisibleCount((c) => Math.min(source.length, c + 1));
      // 出てくるメッセージごとに「しゅぽっ」（自分側は高め、相手側は低め）
      playPop(!!next && next.sender === names.a, tickMs < 250);
    }, tickMs);
    return () => clearTimeout(timerRef.current);
  }, [playing, visibleCount, source.length, speed.ms, names.a]);

  useEffect(() => {
    if (visibleCount > 0 && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [visibleCount]);

  const startPlay = () => {
    if (source.length === 0) return;
    setVisibleCount(0);
    setPlaying(true);
  };
  const stopPlay = () => {
    clearTimeout(timerRef.current);
    setPlaying(false);
  };

  const started = playing || visibleCount > 0;
  const endIdx = started ? visibleCount : source.length;
  const startIdx = isMulti ? Math.max(0, endIdx - REPLAY_WINDOW) : 0;
  const shown = source.slice(startIdx, endIdx);

  return (
    <>
      <style>{`.no-scrollbar{scrollbar-width:none;-ms-overflow-style:none}.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>トーク再生</div>

      <GlassSegment options={REPLAY_MODES.map((x) => ({ key: x.key, label: x.label }))} value={mode} onChange={setMode} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
          background: C.panel2,
          border: `1px solid ${C.stroke}`,
          borderRadius: 12,
          padding: "6px 10px",
        }}
      >
        {isAll ? (
          <div style={{ flex: 1, fontSize: 12, color: C.sub }}>
            {fmtShort(RAW_D[0].date)} 〜 {fmtShort(RAW_D[RAW_D.length - 1].date)}（{source.length.toLocaleString()}件・{fmtEta((source.length * speed.ms) / 1000)}）
          </div>
        ) : (
          <>
            {isMulti && <span style={{ fontSize: 11, color: C.sub, whiteSpace: "nowrap" }}>この日まで</span>}
            <input
              type="date"
              value={selectedDate}
              min={RAW_D[0].date}
              max={RAW_D[RAW_D.length - 1].date}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 12, fontFamily: "inherit" }}
            />
          </>
        )}
        <button
          onClick={playing ? stopPlay : startPlay}
          disabled={source.length === 0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: `linear-gradient(135deg, ${C.a}, ${C.b})`,
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "6px 12px",
            fontSize: 11,
            fontWeight: 700,
            cursor: source.length === 0 ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            opacity: source.length === 0 ? 0.5 : 1,
          }}
        >
          {playing ? "■ 停止" : (<><Play size={9} color="#fff" />再生</>)}
        </button>
      </div>

      <GlassSegment options={REPLAY_SPEEDS.map((x) => ({ key: x.key, label: x.label }))} value={speedKey} onChange={setSpeedKey} small />

      {isMulti && !isAll && !started && (
        <div style={{ fontSize: 10.5, color: C.subtle, textAlign: "center", margin: "-6px 0 8px" }}>
          {fmtYMD(periodStart)} 〜 {fmtYMD(selectedDate)}（{source.length.toLocaleString()}件・{fmtEta((source.length * speed.ms) / 1000)}）
        </div>
      )}
      {isMulti && started && (
        <div style={{ fontSize: 10.5, color: C.subtle, textAlign: "center", margin: "-6px 0 8px" }}>
          {visibleCount.toLocaleString()} / {source.length.toLocaleString()}件{visibleCount > 0 && source[visibleCount - 1] ? `（${fmtYMD(source[visibleCount - 1].date)}）` : ""}
        </div>
      )}
      {isMulti && !started && source.length > REPLAY_WINDOW && (
        <div style={{ fontSize: 10.5, color: C.subtle, textAlign: "center", margin: "-6px 0 8px" }}>
          最新の{REPLAY_WINDOW}件を表示中。「再生」で最初から再生します
        </div>
      )}

      {source.length === 0 ? (
        <div style={{ fontSize: 12, color: C.subtle, textAlign: "center", padding: "30px 0" }}>{isMulti ? "この期間" : "この日"}のやりとりはありません</div>
      ) : (
        <div
          ref={scrollRef}
          className="no-scrollbar"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            maxHeight: 460,
            overflowY: "auto",
            background: C.panel2,
            border: `1px solid ${C.stroke}`,
            borderRadius: 16,
            padding: 12,
          }}
        >
          {shown.map((m, i) => {
            const prev = i > 0 ? shown[i - 1] : null;
            const newDay = isMulti && (!prev || prev.date !== m.date);
            return <ReplayBubble key={startIdx + i} m={m} isA={m.sender === names.a} newDay={newDay} showDate={newDay ? fmtYMD(m.date) : ""} />;
          })}
        </div>
      )}
    </>
  );
}

function App() {
  const rechartsState = useRechartsReady();
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (file) => {
    setError(null);
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setLoading(false);
      try {
        const text = typeof reader.result === "string" ? reader.result : "";
        const result = parseLineExport(text);
        if (!result) {
          setError("メッセージが見つかりませんでした。トーク履歴テキストファイルを選んでください。");
          return;
        }
        setParsed(result);
      } catch (e) {
        setError("ファイルの読み込みに失敗しました。もう一度お試しください。");
      }
    };
    reader.onerror = () => {
      setLoading(false);
      setError("ファイルの読み込みに失敗しました。もう一度お試しください。");
    };
    reader.readAsText(file, "utf-8");
  };

  if (!parsed) {
    return <UploadScreen onFile={handleFile} error={error} loading={loading} />;
  }

  if (rechartsState !== "ready") {
    return (
      <div style={{ color: rechartsState === "error" ? "#FF5C7A" : "#9A93AC", fontFamily: "sans-serif", fontSize: 13, textAlign: "center", padding: "40px 16px", lineHeight: 1.6 }}>
        {rechartsState === "error" ? "グラフ部品の読み込みに失敗しました。通信状況を確認して、ページを再読み込みしてください。" : "グラフを準備しています…"}
      </div>
    );
  }

  return (
    <>
    <ShareOverlay />
    <LineChatApp
      RAW={parsed.RAW}
      HOURLY_BY_DAY={parsed.HOURLY_BY_DAY}
      names={parsed.names}
      chatTitle={parsed.chatTitle}
      messages={parsed.messages}
      onReset={() => {
        setParsed(null);
        setError(null);
      }}
    />
    </>
  );
}

document.getElementById("root").dataset.ltaMounted = "1";
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
} catch (err) {
  console.error(err);
  var el = document.getElementById("root");
  if (el) {
    el.innerHTML =
      '<div style="color:#FF5C7A;font-family:sans-serif;font-size:13px;text-align:center;padding:40px 16px;line-height:1.6;white-space:pre-wrap;word-break:break-word;">' +
      "読み込みに失敗しました。<br><br><span style=\"opacity:0.8;font-size:11px;\">" +
      String((err && (err.stack || err.message)) || err) +
      "</span></div>";
  }
}
