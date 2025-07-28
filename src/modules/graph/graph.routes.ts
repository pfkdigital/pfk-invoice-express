import { Router } from "express";
import * as graphController from "./graph.controller";

const graphRouter = Router();

graphRouter.get("/monthly-revenue", graphController.getMonthlyRevenue);
graphRouter.get("/top-clients", (req, res) => {
    res.status(200).json({
        message: "Top clients data is not implemented yet."
    })
});

export { graphRouter };