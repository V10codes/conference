import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import conferenceRoute from "./routes/conference.route.js";
import registrationRoute from "./routes/registration.route.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/test", testRoute);
app.use("/api/conferences", conferenceRoute);
app.use("/api/registrations", registrationRoute);

app.listen(8800, () => {
  console.log("Server is running!");
});
