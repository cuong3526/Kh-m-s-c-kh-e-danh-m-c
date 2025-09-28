import React from 'react';
import type { Stock } from '../types';

interface InputSectionProps {
    safetyLevel: number | null;
    setSafetyLevel: (value: number | null) => void;
    numStocks: number | null;
    handleNumStocksChange: (value: number) => void;
    cashBalance: number | null;
    setCashBalance: (value: number | null) => void;
    stocks: Stock[];
    handleStockChange: (index: number, field: keyof Stock, value: number | null) => void;
}

const NumberInput: React.FC<{
    label: string;
    value: number | null;
    onChange: (value: number | null) => void;
    placeholder: string;
    min?: number;
    max?: number;
    step?: number;
    icon: React.ReactNode;
}> = ({ label, value, onChange, placeholder, min, max, step, icon }) => (
    <div>
        <label className="flex items-center text-md font-semibold text-slate-700 mb-2">
            {icon}
            <span className="ml-2">{label}</span>
        </label>
        <input
            type="number"
            value={value === null ? '' : value}
            onChange={(e) => onChange(e.target.value === '' ? null : parseInt(e.target.value, 10))}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
    </div>
);

const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const CashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const MoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>;


export const InputSection: React.FC<InputSectionProps> = ({
    safetyLevel,
    setSafetyLevel,
    numStocks,
    handleNumStocksChange,
    cashBalance,
    setCashBalance,
    stocks,
    handleStockChange
}) => {
    return (
        <div className="space-y-8">
            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/50">
                 <h3 className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-3 mb-6">Thông tin chung</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <NumberInput 
                            label="Mức an toàn của Vnindex (0-9)"
                            value={safetyLevel}
                            onChange={setSafetyLevel}
                            placeholder="Nhập mức độ"
                            min={0}
                            max={9}
                            step={1}
                            icon={<ShieldIcon />}
                        />
                         {safetyLevel !== null && (
                            <div className={`mt-2 text-sm font-bold p-2 rounded-lg text-center ${safetyLevel >= 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {safetyLevel >= 5 ? `Mức an toàn: ${safetyLevel} (An toàn)` : `Mức an toàn: ${safetyLevel} (Cảnh báo)`}
                            </div>
                        )}
                    </div>
                    <NumberInput 
                        label="Số tiền mặt hiện có (triệu)"
                        value={cashBalance}
                        onChange={setCashBalance}
                        placeholder="Nhập số tiền mặt"
                        min={0}
                        step={1}
                        icon={<CashIcon />}
                    />
                    <div className="md:col-span-2">
                         <NumberInput 
                            label="Số lượng cổ phiếu trong danh mục"
                            value={numStocks}
                            onChange={(val) => handleNumStocksChange(val || 0)}
                            placeholder="Nhập số lượng"
                            min={1}
                            step={1}
                            icon={<ListIcon />}
                        />
                    </div>
                </div>
            </div>
            
            {numStocks !== null && numStocks > 0 && (
                 <div className="space-y-6">
                     <h3 className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-3 mb-6">Chi tiết Cổ phiếu</h3>
                     {stocks.map((_, i) => (
                         <div key={i} className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm space-y-4">
                             <p className="font-bold text-lg text-blue-700">Cổ phiếu {i + 1}</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-start">
                                <div>
                                    <NumberInput 
                                        label={`RSIV của cổ phiếu ${i + 1}`}
                                        value={stocks[i].rsiv}
                                        onChange={(val) => handleStockChange(i, 'rsiv', val)}
                                        placeholder="Nhập RSIV"
                                        min={0}
                                        step={1}
                                        icon={<ChartIcon />}
                                    />
                                    {stocks[i].rsiv !== null && (
                                        <div className={`mt-2 text-sm font-bold p-2 rounded-lg text-center text-white ${stocks[i].rsiv! >= 50 ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {stocks[i].rsiv! >= 50 ? 'Khỏe hơn Vnindex' : 'Yếu hơn Vnindex'}
                                        </div>
                                     )}
                                </div>
                                 <NumberInput 
                                    label={`Số tiền đầu tư (triệu)`}
                                    value={stocks[i].investment}
                                    onChange={(val) => handleStockChange(i, 'investment', val)}
                                    placeholder="Nhập số tiền"
                                    min={0}
                                    step={1}
                                    icon={<MoneyIcon />}
                                />
                             </div>
                         </div>
                     ))}
                 </div>
            )}
        </div>
    );
};