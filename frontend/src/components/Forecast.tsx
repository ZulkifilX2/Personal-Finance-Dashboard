import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStats } from '../services/api';

interface ForecastData {
    date: string;
    predicted_balance: number;
}

const Forecast: React.FC = () => {
    const [originalSlope, setOriginalSlope] = useState(0);
    const [intercept, setIntercept] = useState(0); // Current Balance approximately
    const [adjustment, setAdjustment] = useState(0); // Monthly adjustment
    const [data, setData] = useState<ForecastData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const stats = await getStats();
                // We need the slope and intercept from the backend, 
                // but the backend returns pre-calculated points.
                // We can estimate slope from the first and last point of forecast.
                if (stats.forecast && stats.forecast.length > 0) {
                    const first = stats.forecast[0];
                    const last = stats.forecast[stats.forecast.length - 1];
                    const days = stats.forecast.length;
                    const slope = (last.predicted_balance - first.predicted_balance) / days;
                    
                    setOriginalSlope(slope);
                    setIntercept(stats.net_worth); // Start from current net worth
                    
                    // Initial calculation
                    calculateForecast(slope, stats.net_worth);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const calculateForecast = (slope: number, startBalance: number) => {
        const newData = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            newData.push({
                date: date.toLocaleDateString(),
                predicted_balance: startBalance + (slope * i)
            });
        }
        setData(newData);
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setAdjustment(val);
        // val is change in monthly spending. 
        // If val is -500 (saving 500 more), daily slope increases by 500/30.
        // Wait, if I spend LESS, my net flow INCREASES.
        // So if adjustment is "Spending Change", then -500 means spending 500 less.
        // Slope += (-val) / 30
        const newSlope = originalSlope + (-val / 30);
        calculateForecast(newSlope, intercept);
    };

    if (loading) return <div>Loading forecast...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
            <h2 className="text-xl font-bold mb-4">What-If Simulator</h2>
            <p className="text-gray-600 mb-6">
                Adjust your monthly spending to see how it affects your financial runway.
            </p>

            <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Spending Adjustment: <span className={`font-bold ${adjustment > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {adjustment > 0 ? '+' : ''}{adjustment}
                    </span>
                </label>
                <input 
                    type="range" 
                    min="-1000" 
                    max="1000" 
                    step="50" 
                    value={adjustment} 
                    onChange={handleSliderChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Save $1000/mo</span>
                    <span>No Change</span>
                    <span>Spend $1000/mo</span>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tickFormatter={(str) => new Date(str).getDate().toString()} />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="predicted_balance" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorForecast)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Forecast;
