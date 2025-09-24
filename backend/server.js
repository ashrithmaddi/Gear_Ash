import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://gear-ash.vercel.app",
  "https://www.gearup4.com"
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON request body

// ----------- Example Routes ----------- //

// Health check
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Auth route (sample)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Dummy auth logic
  if (email === "test@example.com" && password === "123456") {
    return res.json({ success: true, message: "Login success" });
  } else {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// -------------------------------------- //

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
