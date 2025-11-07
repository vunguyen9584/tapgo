export const DURATION_OPTIONS = [15, 30, 60, 120] as const;

// Compare typed text against target and count per‑character correctness for the typed portion only.
export function computeCorrectIncorrect(typed: string, target: string): { correct: number; incorrect: number } {
  let correct = 0;
  let incorrect = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correct++;
    else incorrect++;
  }
  return { correct, incorrect };
}

function uniqueNonWhitespaceChars(input: string): string[] {
  const set = new Set<string>();
  for (const ch of input) {
    if (!/\s/.test(ch)) set.add(ch.toLowerCase());
  }
  return Array.from(set);
}

// Build a stream of pseudo‑words comprised only of provided characters.
export function generateCharPracticeText(chars: string, approxLength = 160): string {
  const pool = uniqueNonWhitespaceChars(chars);
  if (pool.length === 0) return 'Please configure character set (e.g. asdfg).';
  const words: string[] = [];
  let totalLen = 0;
  while (totalLen < approxLength) {
    const wordLen = 3 + Math.floor(Math.random() * 5); // 3..7
    let w = '';
    for (let i = 0; i < wordLen; i++) w += pool[Math.floor(Math.random() * pool.length)];
    words.push(w);
    totalLen += w.length + 1;
  }
  return words.join(' ').slice(0, approxLength).trimEnd();
}

const COMMON_WORDS = [
  'the','be','to','of','and','a','in','that','have','I',
  'it','for','not','on','with','he','as','you','do','at',
  'this','but','his','by','from','they','we','say','her','she',
  'or','an','will','my','one','all','would','there','their','what',
  'so','up','out','if','about','who','get','which','go','me',
  'when','make','can','like','time','no','just','him','know','take',
  'people','into','year','your','good','some','could','them','see','other',
  'new','first','last','long','great','little','own','old','right','big',
  'high','small','large','next','early','young','important','few','public','same',
  'able','work','life','world','hand','part','place','case','week','company',
  'system','program','question','night','point','home','water','room','area','money',
  'story','fact','month','lot','study','book','eye','job','word','business',
  'issue','side','kind','head','house','service','friend','father','power','hour',
  'game','line','end','member','law','car','city','community','health','name'
];

export function generateWordPracticeText(count = 60): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * COMMON_WORDS.length);
    const w = COMMON_WORDS[idx] ?? 'the';
    words.push(w);
  }
  return words.join(' ');
}

// --- Random sentence generator for Typing Test (EN/VI) ---
type Lang = 'en' | 'vi';

const WORDS: Record<Lang, {
  nouns: string[];
  verbs: string[];
  adjectives: string[];
  adverbs: string[];
  connectors: string[];
}> = {
  en: {
    nouns: [
      'fox','dog','river','mountain','ocean','forest','city','writer','musician','teacher','student','garden','sunset','morning','evening','breeze','storm','path','memory','dream','thought','keyboard','screen','book','coffee','letter','voice','story','mirror','lantern',
      'valley','meadow','cloud','rain','thunder','library','market','traveler','artist','engineer','neighbor','child','parent','friend','camera','notebook','bicycle','train','station','bridge','harbor','village','field','desert','canyon','island','shore','wave','pixel','algorithm','cursor','window','lamp','candle','shadow','pattern','rhythm','tempo','code','function','module'
    ],
    verbs: [
      'run','walk','glide','whisper','glimmer','bloom','echo','gather','linger','reach','write','paint','compose','reflect','search','weave','build','measure',
      'drift','wander','flow','sparkle','ripple','hum','dance','twist','unfold','emerge','illuminate','navigate','observe','ponder','discover','assemble','connect','balance','debug','optimize'
    ],
    adjectives: [
      'quiet','gentle','bright','silent','patient','curious','distant','familiar','fragile','warm','tender','soft','vivid','steady','humble','lively','brisk','calm',
      'crisp','shimmering','golden','dim','faint','bold','wild','serene','restless','ancient','modern','playful','subtle','radiant','cool','windy','rainy','misty','cloudy','cozy','fleeting','endless','finite','messy','pristine','glossy','dusty','narrow','wide','deep','shallow'
    ],
    adverbs: [
      'quietly','slowly','gently','boldly','softly','lightly','firmly','bravely','brightly','calmly','patiently','briefly',
      'swiftly','eagerly','smoothly','gracefully','roughly','neatly','sharply','deeply','truly','freely','precisely','casually','carefully','suddenly','rarely','often','seldom'
    ],
    connectors: ['and','but','because','so','while','yet','though','however','therefore','meanwhile','moreover','nevertheless'],
  },
  vi: {
    nouns: [
      'cơn gió','dòng sông','ngọn núi','mặt trời','khu vườn','con đường','thành phố','người viết','người học','bài hát','kỷ niệm','giấc mơ','suy nghĩ','màn hình','bàn phím','cuốn sách','tách cà phê','buổi sáng','buổi tối',
      'ánh trăng','đám mây','cơn mưa','tiếng sét','thư viện','khu chợ','người lữ khách','người nghệ sĩ','người kỹ sư','người hàng xóm','đứa trẻ','người cha','người mẹ','người bạn','máy ảnh','sổ tay','xe đạp','tàu hỏa','nhà ga','cây cầu','bến cảng','ngôi làng','cánh đồng','sa mạc','hẻm núi','hòn đảo','bờ bãi','con sóng','thuật toán','con trỏ','cửa sổ','ngọn đèn','cái bóng','mẫu hình','nhịp điệu','nhịp độ','mã nguồn','hàm số','mô-đun'
    ],
    verbs: [
      'chạy','đi','viết','đọc','nghe','nhìn','gọi','giữ','ghép','gom','xây','tìm','đợi','ngẫm',
      'trôi','lang thang','tuôn chảy','lấp lánh','gợn sóng','rì rầm','nhảy múa','xoắn','mở ra','hiện lên','soi sáng','điều hướng','quan sát','suy ngẫm','khám phá','lắp ráp','kết nối','cân bằng','gỡ lỗi','tối ưu'
    ],
    adjectives: [
      'nhẹ','chậm','nhanh','ấm','trong','lặng','dài','ngắn','gần','xa','thân','khác','xanh','đẹp','bền',
      'giòn','lấp lánh','vàng óng','mờ','nhạt','đậm','hoang dã','thanh bình','bồn chồn','cổ xưa','hiện đại','đùa nghịch','tinh tế','rực rỡ','mát','lộng gió','mưa','mờ sương','nhiều mây','ấm cúng','thoáng chốc','bất tận','hữu hạn','lộn xộn','tinh khôi','bóng bẩy','bụi bặm','hẹp','rộng','sâu','nông','gọn gàng'
    ],
    adverbs: ['rất','khá','hơi','đôi khi','luôn','thường','chậm rãi','nhẹ nhàng','nhanh chóng','háo hức','êm ái','duyên dáng','thô ráp','gọn gàng','sắc bén','sâu sắc','thật lòng','tự do','chính xác','tình cờ','cẩn thận','đột ngột','hiếm khi','thường xuyên','từ tốn','vội vã','vững vàng','tỉ mỉ'],
    connectors: ['và','nhưng','bởi vì','nên','trong khi','tuy nhiên','vì vậy','do đó','trong lúc đó','hơn nữa','dẫu vậy'],
  },
};

function hash32(str: string): number {
  // FNV-1a 32-bit
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

function mulberry32(a: number): () => number {
  let t = a >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randIntInclusive(prng: () => number, min: number, max: number): number {
  return Math.floor(prng() * (max - min + 1)) + min;
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function pickOne<T>(arr: readonly T[], prng: () => number): T {
  const idx = Math.floor(prng() * arr.length);
  return arr[idx]!;
}

function makeClause(lang: Lang, prng: () => number): string {
  const W = WORDS[lang];
  if (lang === 'en') {
    const useAdv = prng() < 0.6;
    const a1 = pickOne(W.adjectives, prng);
    const n1 = pickOne(W.nouns, prng);
    const v = pickOne(W.verbs, prng) + (prng() < 0.7 ? 's' : '');
    const a2 = pickOne(W.adjectives, prng);
    const n2 = pickOne(W.nouns, prng);
    const adv = useAdv ? pickOne(W.adverbs, prng) + ' ' : '';
    // Choose determiners to avoid always starting with "the"; sometimes omit or use a/an.
    const startsWithVowel = (w: string) => /^[aeiou]/i.test(w);
    const detFor = (adj: string): string => {
      const r = prng();
      if (r < 0.45) return '';
      if (r < 0.75) return 'the ';
      return startsWithVowel(adj) ? 'an ' : 'a ';
    };
    const det1 = detFor(a1);
    const det2 = detFor(a2);
    return `${det1}${a1} ${n1} ${adv}${v} ${det2}${a2} ${n2}`;
  } else {
    const useAdv = prng() < 0.6;
    const a1 = pickOne(W.adjectives, prng);
    const n1 = pickOne(W.nouns, prng);
    const v = pickOne(W.verbs, prng);
    const a2 = pickOne(W.adjectives, prng);
    const n2 = pickOne(W.nouns, prng);
    const adv = useAdv ? pickOne(W.adverbs, prng) + ' ' : '';
    return `${n1} ${adv}${v} ${n2} ${a2}`;
  }
}

function makeSentence(lang: Lang, prng: () => number): string {
  const clauses = randIntInclusive(prng, 1, 3);
  const parts: string[] = [];
  for (let i = 0; i < clauses; i++) parts.push(makeClause(lang, prng));
  let s = parts.join(', ');
  s = capitalize(s.trim());
  if (!/[.!?]$/.test(s)) s += '.';
  return s;
}

function generateText(lang: Lang, prng: () => number, minLen = 40, maxLen = 160): string {
  let attempt = 0;
  let text = '';
  while (attempt < 12) {
    const sentences = randIntInclusive(prng, 1, 3);
    const buf: string[] = [];
    for (let i = 0; i < sentences; i++) buf.push(makeSentence(lang, prng));
    text = buf.join(' ');
    if (text.length < minLen) text += ' ' + makeSentence(lang, prng);
    if (text.length > maxLen) { attempt++; continue; }
    if (text.length >= minLen && text.length <= maxLen) return text;
    attempt++;
  }
  if (text.length > maxLen) {
    text = text.slice(0, Math.max(0, maxLen - 1)).replace(/[,. ]+$/g, '').trim() + '.';
  }
  return text;
}

export function generateTypingTestText(params?: {
  lang?: Lang;
  minLength?: number;
  maxLength?: number;
  seed?: string | number;
}): string {
  const lang = params?.lang ?? 'en';
  const minLen = params?.minLength ?? 40;
  const maxLen = params?.maxLength ?? 160;
  const s32 = hash32(String(params?.seed ?? Math.random()));
  const prng = mulberry32(s32);
  // Generate base text (no forced inclusion of particular characters)
  let text = generateText(lang, prng, minLen, maxLen);

  // Normalize adjacent punctuation defensively.
  text = text.replace(/([.,;:!?])([.,;:!?])+/g, '$1');

  // Remove spaces that appear immediately before punctuation marks.
  // Examples: "word ," -> "word,", "hello !" -> "hello!"
  text = text.replace(/\s+([.,;:!?])/g, '$1');

  // Ensure exactly one space after punctuation when followed by a non-space character.
  // Examples: "hello,world" -> "hello, world"; "end!  Next" -> "end! Next"
  text = text.replace(/([.,;:!?])\s*(?=\S)/g, '$1 ');

  // Collapse repeated apostrophes (e.g., '' or ’’) into a single one.
  text = text.replace(/(['])\1+/g, '$1');

  return text;
}
