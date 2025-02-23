"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NextPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [reportData, setReportData] = useState(null);
    
    // Get selected sample from query parameters, default to recorded_sample_1.mp4 if missing
    const selectedSample = searchParams.get("sample") || "recorded_sample_1.mp4";

    useEffect(() => {
        const fetchReportData = async () => {
            const response = await fetch("/data.json");
            const data = await response.json();
            setReportData(data);
        };

        fetchReportData();
    }, []);

    const handleSubmit = () => {
        router.push(`/students-report?sample=${encodeURIComponent(selectedSample)}`);
    };

    const selectedData = reportData ? reportData[selectedSample] : null;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center w-full">
            {/* Header Section */}
            <div className="w-full bg-blue-600 text-white text-center py-4 text-lg font-semibold">
                PERI: Empowering Learning, Enhancing Insights
            </div>
            
            {/* Main Content */}
            <div className="w-4/5 max-w-6xl mt-8 grid grid-cols-2 gap-8">
                <div className="w-full p-10 bg-white shadow-lg rounded-lg text-gray-900 flex flex-col items-center">
                    <h3 className="text-2xl font-semibold mb-4 text-blue-600">Results:</h3>
                    {selectedData ? (
                        <>
                            <p className="text-lg"><strong>Engagement:</strong> <span className="text-green-600">{selectedData.engagement}%</span></p>
                            <p className="text-lg"><strong>Boredom:</strong> <span className="text-yellow-600">{selectedData.boredom}%</span></p>
                            <p className="text-lg"><strong>Frustration:</strong> <span className="text-red-600">{selectedData.frustration}%</span></p>
                            <p className="text-lg"><strong>Confusion:</strong> <span className="text-purple-600">{selectedData.confusion}%</span></p>
                        </>
                    ) : (
                        <p className="text-lg text-gray-500">No data found for this sample.</p>
                    )}
                </div>
                <div className="w-full p-10 bg-white shadow-lg rounded-lg flex flex-col items-center text-gray-900">
                    <h3 className="text-2xl font-semibold mb-4 text-blue-600">Graphs:</h3>
                    <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-lg relative">
                        {selectedData ? (
                            <img src={`/${selectedSample.replace(".mp4", "")}_graph.png`} alt="Results Illustration" className="w-4/5 mx-auto h-full object-contain" />
                        ) : (
                            <p className="text-gray-500">No graph available</p>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="text-center mt-6">
                <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                    Generate Student Report
                </button>
            </div>
            
            <div className="mt-6 w-4/5">
                <img src="/ai_institute_image.png" alt="Illustration" className="w-4/5 mx-auto" />
            </div>
        </div>
    );
}