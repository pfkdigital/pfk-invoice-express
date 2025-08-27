import { Request, Response, NextFunction } from 'express';
import * as graphService from './graph.service';
import { HttpStatus } from '../../enums/http-status.enum';

export const getMonthlyRevenue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const monthlyRevenue = await graphService.getMonthlyRevenue();
    res.status(HttpStatus.OK).json(monthlyRevenue);
  } catch (error) {
    next(error);
  }
};

export const getInvoiceStatusDistribution = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const statusDistribution =
      await graphService.getInvoiceStatusDistribution();
    res.status(HttpStatus.OK).json(statusDistribution);
  } catch (error) {
    next(error);
  }
};

export const getTopClientsByRevenue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const topClients = await graphService.getTopClientsByRevenue(limit);
    res.status(HttpStatus.OK).json(topClients);
  } catch (error) {
    next(error);
  }
};

export const getInvoiceAgingAnalysis = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const agingAnalysis = await graphService.getInvoiceAgingAnalysis();
    res.status(HttpStatus.OK).json(agingAnalysis);
  } catch (error) {
    next(error);
  }
};

export const getCashFlowProjection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const months = parseInt(req.query.months as string) || 12;
    const cashFlow = await graphService.getCashFlowProjection(months);
    res.status(HttpStatus.OK).json(cashFlow);
  } catch (error) {
    next(error);
  }
};

export const getDashboardData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [
      monthlyRevenue,
      statusDistribution,
      topClients,
      agingAnalysis,
      cashFlow,
    ] = await Promise.all([
      graphService.getMonthlyRevenue(),
      graphService.getInvoiceStatusDistribution(),
      graphService.getTopClientsByRevenue(5),
      graphService.getInvoiceAgingAnalysis(),
      graphService.getCashFlowProjection(12),
    ]);

    res.status(HttpStatus.OK).json({
      monthlyRevenue,
      statusDistribution,
      topClients,
      agingAnalysis,
      cashFlow,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

export const getRevenueByClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { clientId } = req.params;
    const months = parseInt(req.query.months as string) || 12;

    const clientRevenue = await graphService.getRevenueByClient(
      clientId,
      months,
    );
    res.status(HttpStatus.OK).json(clientRevenue);
  } catch (error) {
    next(error);
  }
};

export const getPaymentTrends = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paymentTrends = await graphService.getPaymentTrends();
    res.status(HttpStatus.OK).json(paymentTrends);
  } catch (error) {
    next(error);
  }
};
