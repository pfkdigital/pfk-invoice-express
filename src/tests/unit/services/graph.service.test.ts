import { getMonthlyRevenue } from "../../../modules/graph/graph.service"
import prisma from "../../../config/prisma"
import { errorHandler } from "../../../handlers/errorHandler"

jest.mock("../../../config/prisma", () => ({
    $queryRaw: jest.fn(),
}))
jest.mock("../../../handlers/errorHandler", () => ({
    errorHandler: jest.fn(),
}))

describe("getMonthlyRevenue", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("should return monthly revenue when query succeeds", async () => {
        const mockResult = [
            { month: "January", revenue: 1000 },
            { month: "February", revenue: 2000 },
        ]
        (prisma.$queryRaw as jest.Mock).mockResolvedValue(mockResult)

        const result = await getMonthlyRevenue()

        expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
        expect(result).toEqual(mockResult)
    })

    it("should call errorHandler when query fails", async () => {
        const mockError = new Error("DB error")
        (prisma.$queryRaw as jest.Mock).mockRejectedValue(mockError)

        const result = await getMonthlyRevenue()

        expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
        expect(errorHandler).toHaveBeenCalledWith(mockError)
        expect(result).toBeUndefined()
    })
})