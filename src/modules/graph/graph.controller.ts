import { NextFunction, Request, Response } from "express";
import * as graphService from "./graph.service";

export const getMonthlyRevenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const revenue = await graphService.getMonthlyRevenue();
        res.status(200).json(revenue);
    } catch (error) {
        next(error);
    }
}