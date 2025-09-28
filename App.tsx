import React, { useState, useMemo } from 'react';
import type { Stock, AnalysisResult } from './types';
import { analyzePortfolio } from './services/portfolioAnalyzer';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Footer } from './components/Footer';

const App: React.FC = () => {
    const [safetyLevel, setSafetyLevel] = useState<number | null>(null);
    const [numStocks, setNumStocks] = useState<number | null>(null);
    const [cashBalance, setCashBalance] = useState<number | null>(null);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [results, setResults] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleNumStocksChange = (count: number) => {
        setNumStocks(count);
        setResults(null); // Reset results when inputs change
        if (count > 0) {
            setStocks(currentStocks => {
                const newStocks = Array(count).fill(null).map((_, i) => 
                    currentStocks[i] || { rsiv: null, investment: null }
                );
                return newStocks;
            });
        } else {
            setStocks([]);
        }
    };
    
    const handleStockChange = (index: number, field: keyof Stock, value: number | null) => {
        setResults(null); // Reset results when inputs change
        setStocks(currentStocks => {
            const newStocks = [...currentStocks];
            newStocks[index] = { ...newStocks[index], [field]: value };
            return newStocks;
        });
    };

    const isFormValid = useMemo(() => {
        if (safetyLevel === null || numStocks === null || cashBalance === null || numStocks <= 0) {
            return false;
        }
        if (stocks.length !== numStocks) return false;

        return stocks.every(stock => stock.rsiv !== null && stock.investment !== null);

    }, [safetyLevel, numStocks, cashBalance, stocks]);

    const handleCalculate = () => {
        setError(null);
        setResults(null);

        if (!isFormValid || safetyLevel === null || cashBalance === null) {
            setError("Vui lòng điền đầy đủ tất cả các trường thông tin.");
            return;
        }
        
        try {
            const analysis = analyzePortfolio(safetyLevel, cashBalance, stocks);
            setResults(analysis);
        } catch (e: any) {
            setError(e.message);
        }
    };
    
    const totalPortfolioValue = useMemo(() => {
        if (!cashBalance && stocks.every(s => s.investment === null)) return null;
        const totalStockInvestment = stocks.reduce((sum, stock) => sum + (stock.investment || 0), 0);
        return totalStockInvestment + (cashBalance || 0);
    }, [stocks, cashBalance]);

    return (
        <div className="min-h-screen bg-sky-50 font-sans text-slate-800">
            <main className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
                <Header />
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-8">
                    <InputSection
                        safetyLevel={safetyLevel}
                        setSafetyLevel={setSafetyLevel}
                        numStocks={numStocks}
                        handleNumStocksChange={handleNumStocksChange}
                        cashBalance={cashBalance}
                        setCashBalance={setCashBalance}
                        stocks={stocks}
                        handleStockChange={handleStockChange}
                    />

                    {isFormValid && (
                         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                            <p className="text-lg font-medium text-blue-800">
                                Tổng giá trị danh mục hiện tại: 
                                <span className="font-bold text-2xl ml-2">{totalPortfolioValue?.toLocaleString()} triệu</span>
                            </p>
                        </div>
                    )}
                    
                    <div className="pt-4">
                        <button
                            onClick={handleCalculate}
                            disabled={!isFormValid}
                            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-xl shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                        >
                            Phân tích Danh mục
                        </button>
                    </div>

                    {error && (
                        <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                            <p className="font-bold">Lỗi</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {results && <ResultsDisplay results={results} />}
                </div>
                <Footer />
            </main>
        </div>
    );
};

export default App;