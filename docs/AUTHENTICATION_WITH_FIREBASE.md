Sau đây là hướng dẫn chi tiết để bạn cài đặt xác thực người dùng ở cả frontend và backend sửt dụng Firebase.

Giải pháp cốt lõi ở đây là sử dụng **Firebase ID Token (JWT)**.

**Luồng hoạt động sẽ như sau:**

1.  **Frontend:** Người dùng đăng nhập bằng Firebase Auth (ví dụ: email/pass, Google, Facebook).
2.  **Frontend:** Sau khi đăng nhập thành công, Firebase Client SDK trả về một **ID Token**.
3.  **Frontend:** Khi gọi bất kỳ API nào của backend, frontend sẽ đính kèm ID Token này vào **header `Authorization`** (thường là `Bearer <token>`).
4.  **Backend:** Nhận được yêu cầu, backend lấy ID Token từ header.
5.  **Backend:** Sử dụng **Firebase Admin SDK** để *xác minh* ID Token này.
6.  **Backend:**
      * Nếu token hợp lệ, backend tin tưởng người dùng này đã được xác thực và xử lý yêu cầu.
      * Nếu token không hợp lệ (hết hạn, giả mạo), backend trả về lỗi `401 Unauthorized` hoặc `403 Forbidden`.

Dưới đây là các bước cụ thể cho từng phần.

-----

## 👩‍💻 Phần Frontend (Client-side)

Phần này sử dụng **Firebase Client SDK**. Giả sử bạn đang dùng JavaScript/TypeScript.

### 1\. Cài đặt và Khởi tạo Firebase

Bạn cần cài đặt SDK của Firebase:

```bash
npm install firebase
```

Sau đó, khởi tạo Firebase trong ứng dụng của bạn (thường là ở file `index.js` hoặc `firebase.js`):

```javascript
// Import các hàm cần thiết
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ...các thông tin khác
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Auth
export const auth = getAuth(app);
```

### 2\. Xử lý Đăng nhập và Lấy ID Token

Khi người dùng đăng nhập (hoặc đã đăng nhập từ phiên trước), bạn có thể lấy ID Token của họ.

```javascript
import { auth } from "./firebase"; // Import từ file cấu hình của bạn
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

// Ví dụ hàm đăng nhập
async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Đăng nhập thành công!", userCredential.user);
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
  }
}

// Hàm quan trọng: Lấy ID Token hiện tại
async function getIdToken() {
  const user = auth.currentUser;
  if (user) {
    try {
      // Hàm này tự động làm mới token nếu nó sắp hết hạn
      const idToken = await user.getIdToken(true); // 'true' để buộc làm mới (tùy chọn)
      return idToken;
    } catch (error) {
      console.error("Lỗi khi lấy ID token:", error);
      return null;
    }
  }
  return null; // Không có người dùng đăng nhập
}
```

> **Lưu ý:** Bạn nên sử dụng `onAuthStateChanged` để theo dõi trạng thái đăng nhập của người dùng và lấy token khi trạng thái thay đổi.

### 3\. Gọi API Backend với Token

Khi bạn gọi backend (ví dụ: dùng `fetch` hoặc `axios`), hãy đính kèm token vào header `Authorization`.

```javascript
async function callProtectedApi() {
  const token = await getIdToken();

  if (!token) {
    alert("Bạn cần đăng nhập để thực hiện hành động này!");
    return;
  }

  try {
    const response = await fetch("https://your-backend-api.com/api/protected-data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Đây là phần quan trọng
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      // Backend trả về lỗi (ví dụ: 401 hoặc 403)
      throw new Error(`Lỗi: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Dữ liệu từ backend:", data);

  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    // Nếu lỗi là 401/403, có thể token đã hết hạn hoặc không hợp lệ
  }
}
```

-----

## ⚙️ Phần Backend (Server-side)

Phần này sử dụng **Firebase Admin SDK**. Ví dụ này sử dụng Node.js và Express.js, nhưng logic là tương tự cho các ngôn ngữ khác (Python, Go, Java...).

### 1\. Cài đặt và Khởi tạo Admin SDK

Bạn cần cài đặt `firebase-admin`:

```bash
npm install firebase-admin
```

Bạn cũng cần tải **Service Account Key** (file JSON) từ Project Settings \> Service Accounts trong Firebase Console của bạn.

Khởi tạo Admin SDK (thường ở file `index.js` hoặc `server.js`):

```javascript
const admin = require("firebase-admin");

// Đường dẫn đến file service account key của bạn
const serviceAccount = require("./path/to/your-service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

### 2\. Tạo Middleware Xác thực 🔒

Cách tốt nhất để bảo vệ các route của bạn là tạo một **middleware**. Middleware này sẽ kiểm tra token trước khi cho phép request đi tiếp đến logic chính.

```javascript
const admin = require("firebase-admin");

// Middleware để xác minh ID Token
async function verifyAuthToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ error: "Unauthorized. No token provided." });
  }

  const idToken = authHeader.split(" ")[1]; // Lấy token sau "Bearer "

  try {
    // Xác minh token bằng Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Token hợp lệ!
    // Gắn thông tin người dùng đã giải mã vào request để sử dụng ở các route sau
    req.user = decodedToken;
    next(); // Cho phép request đi tiếp
  } catch (error) {
    // Token không hợp lệ (hết hạn, giả mạo, v.v.)
    console.error("Lỗi xác thực token:", error);
    return res.status(403).send({ error: "Forbidden. Invalid token." });
  }
}

module.exports = verifyAuthToken;
```

### 3\. Áp dụng Middleware cho các Route

Bây giờ, bạn chỉ cần thêm middleware `verifyAuthToken` vào bất kỳ route nào bạn muốn bảo vệ.

```javascript
const express = require("express");
const app = express();
const verifyAuthToken = require("./verifyAuthToken"); // Import middleware

app.use(express.json());

// --- Ví dụ các Route ---

// Route công khai (public) - không cần xác thực
app.get("/api/public-data", (req, res) => {
  res.send({ message: "Đây là dữ liệu công khai." });
});

// Route được bảo vệ (protected) - YÊU CẦU XÁC THỰC
app.get("/api/protected-data", verifyAuthToken, (req, res) => {
  // Nếu request đến được đây, nghĩa là token đã HỢP LỆ
  
  // Bạn có thể truy cập thông tin người dùng từ `req.user`
  const uid = req.user.uid;
  const email = req.user.email;

  res.send({ 
    message: `Chào ${email}, bạn đã được xác thực!`,
    yourUserId: uid 
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy ở cổng ${PORT}`);
});
```

Khi frontend gọi `/api/protected-data` mà không có token hợp lệ, middleware sẽ chặn lại và trả về lỗi 401 hoặc 403, đúng như yêu cầu của bạn.
