import React, { useEffect, useState } from 'react';
import { getStats } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react';

interface ForecastData {
    date: string;
    predicted_balance: number;
}

interface Stats {
    net_worth: number;
    total_income: number;
    total_expenses: number;
    burn_rate: number;
    forecast: ForecastData[];
    trend_slope: number;
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getStats();
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading dashboard...</div>;
    if (!stats) return <div>No data available. Upload a CSV to get started.</div>;

    const runway = stats.burn_rate !== 0 ? Math.abs(stats.net_worth / stats.burn_rate) : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Net Worth" value={`$${stats.net_worth.toFixed(2)}`} icon={<Wallet className="w-5 h-5 text-blue-600" />} />
                <KPICard title="Monthly Income" value={`$${stats.total_income.toFixed(2)}`} icon={<TrendingUp className="w-5 h-5 text-green-600" />} />
                <KPICard title="Monthly Expenses" value={`$${Math.abs(stats.total_expenses).toFixed(2)}`} icon={<TrendingDown className="w-5 h-5 text-red-600" />} />
                <KPICard title="Runway (Months)" value={`${runway.toFixed(1)}`} icon={<Activity className="w-5 h-5 text-purple-600" />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-bold mb-4">Financial Forecast (30 Days)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.forecast}>
                            <defs>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tickFormatter={(str) => new Date(str).getDate().toString()} />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="predicted_balance" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                    Based on your current spending habits, your balance is trending {stats.trend_slope > 0 ? 'up' : 'down'}.
                </p>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-full">{icon}</div>
    </div>
);

export default Dashboard;
