import type { Stock, AnalysisResult } from '../types';

function calculateWeightedAverage(stocks: Stock[]): { weightedSum: number; totalInvestment: number } {
    const investments = stocks.map(s => s.investment || 0);
    const rsivValues = stocks.map(s => s.rsiv || 0);
    
    const totalInvestment = investments.reduce((sum, val) => sum + val, 0);
    if (totalInvestment === 0) {
        throw new Error("Tổng số tiền đầu tư vào cổ phiếu không thể bằng 0.");
    }

    const weightedSum = stocks.reduce((sum, stock) => {
        return sum + (stock.rsiv || 0) * ((stock.investment || 0) / totalInvestment);
    }, 0);

    return { weightedSum, totalInvestment };
}

function suggestHoldingRatio(safetyLevel: number, weightedSum: number): number {
    return safetyLevel * 10 * (weightedSum / 50);
}

function analyzeWeakStocks(stocks: Stock[]): string[] {
    return stocks
        .map((stock, i) => ({ rsiv: stock.rsiv || 0, index: i + 1 }))
        .filter(stock => stock.rsiv < 50)
        .map(stock => `Cổ phiếu ${stock.index} (RSIV = ${stock.rsiv.toFixed(2)})`);
}

function calculateActualWeights(totalInvestment: number, cashBalance: number): { totalStockWeight: number, cashWeight: number, totalPortfolioValue: number } {
    const totalPortfolioValue = totalInvestment + cashBalance;
    if (totalPortfolioValue === 0) {
        return { totalStockWeight: 0, cashWeight: 0, totalPortfolioValue: 0 };
    }
    const totalStockWeight = (totalInvestment / totalPortfolioValue) * 100;
    const cashWeight = (cashBalance / totalPortfolioValue) * 100;
    return { totalStockWeight, cashWeight, totalPortfolioValue };
}

function generateRecommendation(totalStockWeight: number, suggestedRatio: number, totalPortfolioValue: number): { action: 'Tăng' | 'Giảm' | 'Giữ nguyên', amount: number } {
    const difference = suggestedRatio - totalStockWeight;
    let action: 'Tăng' | 'Giảm' | 'Giữ nguyên' = 'Giữ nguyên';
    let amount = 0;

    if (difference > 1) { // Add a small threshold
        action = 'Tăng';
        amount = totalPortfolioValue * (difference / 100);
    } else if (difference < -1) { // Add a small threshold
        action = 'Giảm';
        amount = totalPortfolioValue * (Math.abs(difference) / 100);
    }
    
    return { action, amount };
}

export const analyzePortfolio = (safetyLevel: number, cashBalance: number, stocks: Stock[]): AnalysisResult => {
    // Validate inputs
    if (stocks.some(s => s.rsiv === null || s.investment === null)) {
        throw new Error("Dữ liệu cổ phiếu không hợp lệ.");
    }

    const { weightedSum, totalInvestment } = calculateWeightedAverage(stocks);
    const suggestedRatio = suggestHoldingRatio(safetyLevel, weightedSum);
    const { totalStockWeight, cashWeight, totalPortfolioValue } = calculateActualWeights(totalInvestment, cashBalance);
    const { action, amount } = generateRecommendation(totalStockWeight, suggestedRatio, totalPortfolioValue);
    const weakStocks = analyzeWeakStocks(stocks);

    const portfolioComment = weightedSum > 50
        ? "Danh mục này đang khá hơn thị trường chung (RSIV > 50)."
        : "Danh mục này đang yếu hơn thị trường chung (RSIV ≤ 50).";
        
    const weakStocksComment = weakStocks.length > 0
        ? "Nên chuyển sang cổ phiếu khỏe hơn Vnindex, có sức mạnh nội tại HL đảm bảo và có điểm vào theo phương pháp."
        : "Không có cổ phiếu nào yếu hơn Vnindex (tất cả đều có RSIV >= 50).";
        
    const calculationTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    return {
        calculationTime,
        weightedSum,
        suggestedRatio,
        totalStockWeight,
        cashWeight,
        totalPortfolioValue,
        action,
        amount,
        weakStocks,
        portfolioComment,
        weakStocksComment
    };
};