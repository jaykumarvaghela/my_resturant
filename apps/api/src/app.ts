import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { menuRouter } from "./modules/menu/menu.controller";
import { reservationRouter } from "./modules/reservation/reservation.controller";
import { orderRouter } from "./modules/order/order.controller";
import { userRouter } from "./modules/user/user.controller";

const app = express();

app.use(helmet());
app.use(cors({ 
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200
 }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/menu", menuRouter);
app.use("/api/reservations", reservationRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);

app.get("/health", (_, res) => res.json({ status: "ok" }));

export default app;
