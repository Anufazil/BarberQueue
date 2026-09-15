const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const barberRoutes = require("./routes/barberRoutes");
const queueRoutes = require("./routes/queueRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");

const logger = require("./config/logger");

const {
  apiLimiter,
  securityMiddleware,
} = require("./config/security");


const errorHandler = require("./middleware/errorMiddleware");
const helmet = require("helmet");

const app = express();

// Security Headers
app.use(helmet());

// Trust reverse proxy (Render, Railway, Nginx, etc.)
app.set("trust proxy", Number(process.env.TRUST_PROXY || 0));

// Logger
app.use(logger());

// CORS
app.use(
  cors({
    origin: require('./config/origins'),
    credentials: true,
  })
);

// Security Middleware
securityMiddleware.forEach((middleware) => {
  app.use(middleware);
});

// Body Parser
app.use(express.json({ limit: "10kb" }));

// Rate Limiter
app.use('/api', (req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
app.use("/api", apiLimiter);

if (process.env.NODE_ENV !== "production") {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
}

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BarberQueue API Running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/barbers", barberRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);

// Global Error Handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));
app.use(errorHandler);

module.exports = app;