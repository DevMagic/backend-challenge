import { Router } from "express";

import { summonerRoutes } from "./players.routes";

const router = Router();

router.use("/player", summonerRoutes);

export { router };
