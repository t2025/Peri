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
            <div className="w-full bg-[#002f56] text-white text-center py-4 text-lg font-semibold">
                PERI: PEDAGOGICAL & EDUCATIONAL REINFORCEMENT INTERVENTION
            </div>
            
            {/* Main Content */}
            <div className="mt-6 w-4/5 flex justify-center">
                <img src="/ai_institute_image.png" alt="Illustration" className="w-4/5 h-48 object-cover rounded-lg" />
            </div>

            <div className="w-4/5 max-w-6xl mt-8 grid grid-cols-2 gap-8">
                {/* Results Section */}
                <div className="w-full p-6 bg-white shadow-lg rounded-lg text-gray-900 flex flex-col justify-between items-center h-full">
    <h3 className="text-2xl font-semibold text-[#002f56]-600 mb-4">Results:</h3>
    
    {selectedData ? (
        <div className="flex flex-col gap-4 w-full text-center">
            <p className="text-xl font-semibold"><strong>Engagement:</strong> <span className="text-green-600">{selectedData.engagement}%</span></p>
            <p className="text-xl font-semibold"><strong>Boredom:</strong> <span className="text-yellow-600">{selectedData.boredom}%</span></p>
            <p className="text-xl font-semibold"><strong>Frustration:</strong> <span className="text-red-600">{selectedData.frustration}%</span></p>
            <p className="text-xl font-semibold"><strong>Confusion:</strong> <span className="text-purple-600">{selectedData.confusion}%</span></p>
        </div>
    ) : (
        <p className="text-lg text-gray-500">No data found for this sample.</p>
    )}

    <button 
        onClick={handleSubmit} 
        className="bg-[#002f56] text-white px-6 py-3 rounded-lg hover:bg-blue-700 mt-6 w-full max-w-xs"
    >
        Generate Student Report
    </button>
</div>


                {/* Graph Section */}
                <div className="w-full p-10 bg-white shadow-lg rounded-lg flex flex-col items-center text-gray-900">
                    <h3 className="text-2xl font-semibold mb-4 text-[#002f56]-600">Graph & Plot:</h3>
                   
                        {selectedData ? (
                            <img src={`/${selectedSample.replace(".mp4", "")}_graph.png`} alt="Results Illustration" className="w-full h-full object-contain rounded-lg" />
                        ) : (
                            <p className="text-gray-500">No graph available</p>
                        )}
                </div>
            </div>

            
        </div>
    );
}
