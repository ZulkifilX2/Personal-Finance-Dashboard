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
    const [isError, setIsError] = useState(false);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['text/csv', 'application/vnd.ms-excel', '.csv'];

    const validateFile = (selectedFile: File): string | null => {
        // Check file extension
        const lastDotIndex = selectedFile.name.lastIndexOf('.');
        const extension = lastDotIndex !== -1 ? selectedFile.name.substring(lastDotIndex).toLowerCase() : '';

        if (!ALLOWED_TYPES.includes(selectedFile.type) && !ALLOWED_TYPES.includes(extension)) {
            return 'Invalid file type. Please upload a CSV file.';
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            return 'File size too large. Maximum size is 5MB.';
        }

        return null;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setMessage('');
        setIsError(false);

        if (selectedFile) {
            const error = validateFile(selectedFile);
            if (error) {
                setMessage(error);
                setIsError(true);
                setFile(null);
                e.target.value = ''; // Reset input
                return;
            }
            setFile(selectedFile);
        } else {
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const error = validateFile(file);
        if (error) {
            setMessage(error);
            setIsError(true);
            setFile(null);
            return;
        }

        setUploading(true);
        setMessage('');
        setIsError(false);

        try {
            await uploadCSV(file);
            setMessage('Upload successful!');
            setIsError(false);
            onUploadSuccess();
        } catch (error) {
            console.error(error);
            setMessage('Upload failed. Please try again.');
            setIsError(true);
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
                {message && <p className={`text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
            </div>
        </div>
    );
};

export default Upload;
