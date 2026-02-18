import React, { useState } from 'react';
import { uploadCSV } from '../services/api';
import { Upload as UploadIcon, Loader2 } from 'lucide-react';

interface UploadProps {
    onUploadSuccess: () => void;
}

const Upload: React.FC<UploadProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setMessage('');

        try {
            await uploadCSV(file);
            setMessage('Upload successful!');
            onUploadSuccess();
        } catch (error) {
            console.error(error);
            setMessage('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UploadIcon className="w-5 h-5" /> Import Transactions
            </h2>
            <div className="flex flex-col gap-4">
                <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
                <button 
                    onClick={handleUpload} 
                    disabled={!file || uploading}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
                </button>
                {message && <p className={`text-sm ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
            </div>
        </div>
    );
};

export default Upload;
