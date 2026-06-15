import dotenv from "dotenv";

import "express-async-errors";
import express from "express";
import cors, { type CorsOptions } from "cors";
import http from "http";
import { Server } from "socket.io";

import connection from "./db.js";
import {
  authRouter,
  chatRouter,
  projectRouter,
  userRouter,
} from "./Routes/index.js";
import { registerChatHandlers } from "./Services/chat.service.js";
import {
  instantiateMeetingState,
  registerMeetingHandlers,
  registerWhiteboardHandlers,
} from "./Services/project.service.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitizer from "express-mongo-sanitize";

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT;

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, please try again later" },
});

const allowedOrigins: string[] = [
  process.env.CLIENT_URL || "http://localhost",
  "https://workspace-fe.happysea-04483485.australiaeast.azurecontainerapps.io",
  "http://localhost:5173",
];

/**
 * Immediately invoked async function to connect to MongoDB.
 * Terminates the server if connection fails.
 */
(async function db() {
  try {
    await connection();
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
})();

/**
 * CORS configuration to restrict origins and allowed methods.
 * Ensures that only authorized clients can access the API.
 */
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          process.env.KEYCLOAK_URL || "",
          process.env.CLIENT_URL || "",
          "ws:",
          "wss:",
        ],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        frameSrc: ["'self'", process.env.KEYCLOAK_URL || ""],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(limiter);
app.use(express.json());
app.use(mongoSanitizer());

// Register REST API routes
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

/**
 * Register socket event handlers for chat, whiteboard, and meeting modules.
 * Also initialize shared meeting state.
 */
registerChatHandlers(io);
registerWhiteboardHandlers(io);
registerMeetingHandlers(io);
instantiateMeetingState(io);

// Start the HTTP server
server.listen(port, () => {
  console.log(`Socket server listening on port ${port}`);
});
