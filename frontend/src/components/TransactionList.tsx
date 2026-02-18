import React, { useEffect, useState } from 'react';
import { getTransactions } from '../services/api';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Transaction {
    id: number;
    date: string;
    description: string;
    amount: number;
    category: {
        name: string;
        type: string;
    };
}

const TransactionList: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const data = await getTransactions(0, 50); // Fetch latest 50
            setTransactions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading transactions...</div>;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-left">
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Description</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{tx.date}</td>
                                <td className="px-4 py-2 font-medium">{tx.description}</td>
                                <td className="px-4 py-2">
                                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                        {tx.category ? tx.category.name : 'Uncategorized'}
                                    </span>
                                </td>
                                <td className={`px-4 py-2 text-right font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionList;
