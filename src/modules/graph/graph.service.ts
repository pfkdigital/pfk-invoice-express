import prisma from "../../config/prisma"
import { errorHandler } from "../../handlers/errorHandler"

export const getMonthlyRevenue = async () => {
    try {
        const monthlyRevenue = await prisma.$queryRaw<{ month: string, revenue: number }[]>`
            SELECT
                TO_CHAR("dueDate",'Month') AS month,
                SUM("totalAmount") as revenue
            FROM "Invoice"
            WHERE "status" = 'PAID'
            GROUP BY month
            ORDER BY DATE_PART('month', "dueDate");
        `

        return monthlyRevenue;
    } catch (error) {
        errorHandler(error)
    }
}