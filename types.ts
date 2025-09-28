
export interface Stock {
    rsiv: number | null;
    investment: number | null;
}

export interface AnalysisResult {
    calculationTime: string;
    weightedSum: number;
    suggestedRatio: number;
    totalStockWeight: number;
    cashWeight: number;
    totalPortfolioValue: number;
    action: 'Tăng' | 'Giảm' | 'Giữ nguyên';
    amount: number;
    weakStocks: string[];
    portfolioComment: string;
    weakStocksComment: string;
}
