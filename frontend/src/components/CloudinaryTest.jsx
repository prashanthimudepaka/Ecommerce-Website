import { useState } from 'react';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

const CloudinaryTest = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const testCloudinary = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/products/test-cloudinary');
            console.log('Cloudinary test response:', response.data);
            setResult(response.data);
            toast.success('Cloudinary is configured correctly!');
        } catch (error) {
            console.error('Cloudinary test error:', error);
            toast.error(error.response?.data?.message || 'Failed to test Cloudinary');
            setResult(error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-emerald-300">Cloudinary Test</h2>
            <button
                onClick={testCloudinary}
                disabled={loading}
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
            >
                {loading ? 'Testing...' : 'Test Cloudinary Configuration'}
            </button>
            
            {result && (
                <div className="mt-4 p-4 bg-gray-700 rounded">
                    <h3 className="font-semibold mb-2">Test Results:</h3>
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default CloudinaryTest; 