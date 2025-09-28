import React, { useRef } from 'react';
import type { AnalysisResult } from '../types';

declare global {
    interface Window {
        html2canvas: any;
    }
}

interface ResultsDisplayProps {
    results: AnalysisResult;
}

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border border-slate-200 ${className}`}>
        {children}
    </div>
);

const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>;
const ChartPieIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;
const LightbulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const WarningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
    const resultsRef = useRef<HTMLDivElement>(null);

    const generateImage = () => {
        if (!resultsRef.current || !window.html2canvas) {
            alert("Không thể tạo ảnh. Vui lòng thử làm mới trang.");
            return;
        }

        window.html2canvas(resultsRef.current, {
            scale: 2, 
            backgroundColor: '#f0f9ff'
        }).then((canvas: HTMLCanvasElement) => {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            const fileDate = new Date().toISOString().split('T')[0];
            link.download = `ket_qua_danh_muc_${fileDate}.png`;
            link.href = image;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch((error: any) => {
            console.error("Lỗi khi tạo ảnh:", error);
            alert("Đã xảy ra lỗi khi tạo tệp ảnh.");
        });
    };

    const isHealthy = results.weightedSum > 50;

    return (
        <div className="mt-8 animate-fade-in">
            <div ref={resultsRef} className="space-y-6 bg-sky-50 p-4 rounded-xl">
                 <p className="text-center text-slate-500 text-sm">📅 Thời gian tính toán: {results.calculationTime}</p>
                <Card className="lg:col-span-2 !bg-blue-700 text-white shadow-2xl shadow-blue-200">
                    <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
                        <div className="flex items-center mb-4 md:mb-0">
                             <div className={`p-3 rounded-full mr-4 ${isHealthy ? 'bg-green-400' : 'bg-red-400'}`}>
                                <HeartIcon />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white/90">Tổng quan Sức khỏe Danh mục</h3>
                                <p className={`text-4xl font-extrabold ${isHealthy ? 'text-green-300' : 'text-red-300'}`}>{results.weightedSum.toFixed(2)}</p>
                            </div>
                        </div>
                        <p className={`mt-2 md:mt-0 md:ml-6 text-lg font-semibold p-3 rounded-lg ${isHealthy ? 'bg-green-500/50' : 'bg-red-500/50'}`}>{results.portfolioComment}</p>
                    </div>
                </Card>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                         <div className="flex items-center mb-4">
                            <ChartPieIcon />
                            <h3 className="text-xl font-bold text-blue-800 ml-2">Phân bổ Tỷ trọng</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b"><p>Tỷ trọng Gợi ý Nắm giữ:</p><p className="font-bold text-lg text-blue-600">{results.suggestedRatio.toFixed(2)}%</p></div>
                            <div className="flex justify-between items-center py-2 border-b"><p>Tỷ trọng Cổ phiếu Thực tế:</p><p className="font-bold text-lg">{results.totalStockWeight.toFixed(2)}%</p></div>
                            <div className="flex justify-between items-center py-2"><p>Tỷ trọng Tiền mặt:</p><p className="font-bold text-lg">{results.cashWeight.toFixed(2)}%</p></div>
                        </div>
                    </Card>

                     <Card className="!bg-blue-50 border-blue-200">
                         <div className="flex items-center mb-4">
                            <LightbulbIcon />
                            <h3 className="text-xl font-bold text-blue-800 ml-2">Khuyến nghị Điều chỉnh</h3>
                        </div>
                        <div className="text-center bg-white p-4 rounded-lg">
                            <p className="text-2xl">
                                <span className="font-extrabold text-blue-700">{results.action}</span>
                                <span className="text-slate-600"> tỷ trọng cổ phiếu</span>
                            </p>
                            <p className="mt-1 text-slate-600">với số tiền khoảng</p>
                            <p className="text-3xl font-bold text-green-600 mt-1">
                                {results.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} triệu
                            </p>
                        </div>
                    </Card>
                </div>

                <Card className="lg:col-span-2">
                     <div className="flex items-center mb-4">
                        <div className={`${results.weakStocks.length > 0 ? 'text-red-500' : 'text-green-500'}`}><WarningIcon /></div>
                        <h3 className={`text-xl font-bold ml-2 ${results.weakStocks.length > 0 ? 'text-red-700' : 'text-green-700'}`}>
                            {results.weakStocks.length > 0 ? 'Phân tích Cổ phiếu yếu' : 'Nhận xét về Cổ phiếu'}
                        </h3>
                    </div>
                    {results.weakStocks.length > 0 ? (
                        <div className="space-y-3">
                             {results.weakStocks.map((stock, index) => (
                                <p key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                    <span className="font-bold">- {stock}: </span>{results.weakStocksComment}
                                </p>
                             ))}
                        </div>
                    ) : (
                        <p className="text-center text-green-800 bg-green-50 p-4 rounded-lg font-semibold">{results.weakStocksComment}</p>
                    )}
                </Card>
            </div>
            
            <div className="text-center pt-8">
                 <button
                    onClick={generateImage}
                    className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-md hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                 >
                    🖼️ Tải xuống kết quả (Ảnh)
                 </button>
            </div>
        </div>
    );
};