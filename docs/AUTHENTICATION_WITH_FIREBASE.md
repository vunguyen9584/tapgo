# Hướng dẫn thiết lập xác thực người dùng với Firebase

Tài liệu này hướng dẫn tích hợp Firebase Authentication cho frontend (React + Vite) và cách backend xác minh người dùng bằng Firebase ID Token (JWT).

## Kiến trúc/luồng xác thực
1) Frontend đăng nhập qua Firebase Auth (Google, Email/Password...).
2) Firebase Client SDK cấp ID Token cho người dùng đã đăng nhập.
3) Frontend gọi API kèm header Authorization: `Bearer <ID_TOKEN>`.
4) Backend nhận token và dùng Firebase Admin SDK để xác minh.
5) Hợp lệ → xử lý request; Không hợp lệ → trả 401/403.

## Yêu cầu trước khi bắt đầu
- Firebase Project và Web App (Firebase Console).
- Bật các Sign-in providers cần dùng (ví dụ: Google, Email/Password).
- Thêm domain phát triển vào Authorized domains (ví dụ: `localhost` với Vite: `http://localhost:5173`).
- (Nếu có backend) Service Account JSON cho Admin SDK, lưu ở secret/biến môi trường.

## Thiết lập trên Firebase Console
1) Tạo Project và Web App, lấy cấu hình Web (apiKey, authDomain, projectId, ...).
2) Vào Authentication → Sign-in method → Enable các providers (Google/Email-Password...).
3) Vào Authentication → Settings → Authorized domains, thêm domain dev nếu thiếu.

---

## Frontend (React + Vite + TypeScript)
Thư viện `firebase` đã có trong dự án. Nếu thiếu, cài bằng: `npm i firebase`.

### Biến môi trường (Vite)
Tạo file `.env.local` (không commit) ở thư mục gốc và điền các khóa từ Firebase Web App:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Khởi tạo SDK và API sẵn có
Dự án đã có `src/lib/firebase.ts` khởi tạo app và xuất sẵn các hàm:
- `firebaseEnabled`: bật khi cấu hình hợp lệ.
- `loginWithGoogle()`, `logout()`.
- `onUserChange(cb)`: theo dõi trạng thái đăng nhập.
- `loadProgress(uid)`, `saveProgress(uid, lessons)`: ví dụ lưu Firestore.

Ví dụ sử dụng trong React:

```ts
import { loginWithGoogle, logout, onUserChange, firebaseEnabled, auth } from "../src/lib/firebase";

onUserChange((user) => {
  console.log("auth state:", user?.uid);
});

async function signIn() {
  if (!firebaseEnabled) return;
  await loginWithGoogle();
}

async function signOut() {
  await logout();
}
```

### Gọi API backend kèm ID Token
Khi gọi API cần xác thực, lấy ID Token từ người dùng hiện tại và đính kèm vào header:

```ts
async function callProtectedApi(url: string, init: RequestInit = {}) {
  const token = await auth?.currentUser?.getIdToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(url, { ...init, headers });
}
```

---

## Backend (tùy chọn)
Ví dụ với Node.js + Express và Firebase Admin SDK.

### Cài đặt
```
npm i firebase-admin express
```

### Khởi tạo Admin SDK (ESM)
Không nhúng file JSON trực tiếp; đọc từ biến môi trường:

```ts
import express from "express";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!);
initializeApp({ credential: cert(serviceAccount) });

const app = express();
app.use(express.json());
```

### Middleware xác minh ID Token
```ts
import type { Request, Response, NextFunction } from "express";

async function verifyAuthToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("authorization");
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  const token = authHeader.slice("Bearer ".length);
  try {
    const decoded = await getAuth().verifyIdToken(token);
    (req as any).user = decoded;
    return next();
  } catch {
    return res.status(403).json({ error: "Forbidden" });
  }
}

app.get("/api/protected", verifyAuthToken, (req, res) => {
  res.json({ ok: true, uid: (req as any).user.uid });
});
```

---

## Kiểm thử nhanh
1) `npm run dev` → mở app tại `http://localhost:5173`.
2) Đăng nhập Google (bảo đảm provider đã bật và domain đã được cho phép).
3) Gọi API backend bằng hàm `callProtectedApi` ở trên và kiểm tra 200/401/403.

## Lưu ý bảo mật và lỗi thường gặp
- Không commit `.env*` và Service Account JSON; luôn dùng biến môi trường/secret manager.
- 401: thiếu hoặc sai header Authorization.
- 403: token hết hạn/không hợp lệ/không thuộc project.
- Provider chưa enable hoặc domain chưa nằm trong Authorized domains sẽ khiến đăng nhập thất bại.
