"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function NextPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reportRef = useRef();
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

    const saveAsPDF = async () => {
        const input = reportRef.current;
        if (!input) return;

        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("Student_Report.pdf");
    };

    const sendEmail = () => {
        window.location.href = `mailto:?subject=Student Engagement Report&body=Based on today's class activities, we noticed that today's engagement score was ${selectedData?.engagement}%.%0D%0A%0D%0ABoredom: ${selectedData?.boredom}%0D%0AFrustration: ${selectedData?.frustration}%0D%0AConfusion: ${selectedData?.confusion}%0D%0A%0D%0AHere are a few tips if you are struggling with focus:%0D%0A1. Try reading%0D%0A2. Engage in mind games%0D%0A3. Meditate%0D%0A%0D%0APlease note that today's lecture will be asked in a quiz to help reinforce the content.`;
    };

    const selectedData = reportData ? reportData[selectedSample] : null;

    // Determine the card color and message based on engagement score
    let cardColor = "bg-red-100 border-red-500";
    let titleColor = "text-red-800";
    let message = "Low engagement detected. Consider engaging more in class activities.";

    if (selectedData) {
        if (selectedData.engagement > 60) {
            cardColor = "bg-green-100 border-green-500";
            titleColor = "text-green-800";
            message = "High engagement detected. Keep up the great work!";
        } else if (selectedData.engagement >= 50) {
            cardColor = "bg-yellow-100 border-yellow-500";
            titleColor = "text-yellow-800";
            message = "Moderate engagement detected. Keep participating actively.";
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center w-full" ref={reportRef}>
            {/* Header Section */}
            <div className="w-full bg-blue-600 text-white text-center py-4 text-lg font-semibold">
                PERI: Empowering Learning, Enhancing Insights
            </div>
            
            {/* Engagement Feedback Card */}
            {selectedData && (
                <div className={`w-4/5 max-w-3xl mt-8 p-6 ${cardColor} border-l-4 shadow-lg rounded-lg`}>
                    <h3 className={`text-xl font-semibold ${titleColor}`}>Engagement Report</h3>
                    <p className="text-gray-700 mt-2">{message}</p>
                </div>
            )}
            
            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
                <button onClick={saveAsPDF} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">Save as PDF</button>
                <button onClick={sendEmail} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">Email Report</button>
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
