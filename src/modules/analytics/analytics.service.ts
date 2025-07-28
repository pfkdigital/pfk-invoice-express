import * as analyticsRepository from './analytics.repository';
import { errorHandler } from '../../handlers/errorHandler';


export const getInvoiceCount = () => {
    try {
        return analyticsRepository.countInvoices();
    } catch (error) {
        errorHandler(error)
    }
}

export const getClientCount = () => {
    try {
        return analyticsRepository.getClientCount();
    } catch (error) {
        errorHandler(error)
    }
}

export const getTotalAmount = () => {
    try {
        return analyticsRepository.getTotalAmount();
    } catch (error) {
        errorHandler(error)
    }
}

export const getTotalAmountUnpaid = () => {
    try {
        return analyticsRepository.getTotalAmountUnpaid();
    } catch (error) {
        errorHandler(error)
    }
}