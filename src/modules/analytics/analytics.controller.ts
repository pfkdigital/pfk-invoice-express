import { NextFunction, Request, Response } from 'express';
import * as analyticsService from './analytics.service';

export const getInvoiceCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const count = await analyticsService.getInvoiceCount();
        res.status(200).json({ count });
    } catch (error) {
        next(error);
    }
}

export const getClientCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const count = await analyticsService.getClientCount();
        res.status(200).json({ count });
    } catch (error) {
        next(error);
    }
};

export const getTotalAmount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const total = await analyticsService.getTotalAmount();
        res.status(200).json({ total });
    } catch (error) {
        next(error);
    }
};

export const getTotalAmountUnpaid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalUnpaid = await analyticsService.getTotalAmountUnpaid();
        res.status(200).json({ totalUnpaid });
    } catch (error) {
        next(error);
    }
};