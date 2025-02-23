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
        const subject = encodeURIComponent("Student Engagement Report");
        const body = encodeURIComponent(
            `Hello,
    
    Based on today's class activities, we have analyzed the engagement levels and here are the results:
    
    📊 **Engagement Score:** ${selectedData?.engagement}%
    
    🟡 **Boredom:** ${selectedData?.boredom}%
    🔴 **Frustration:** ${selectedData?.frustration}%
    🟠 **Confusion:** ${selectedData?.confusion}%
    
    💡 If you’re struggling with focus, here are some helpful strategies to enhance your engagement:
    1️⃣ Break Learning into Chunks– Study in short sessions with breaks to improve concentration.
    2️⃣ Interactive Learning – Try using mind games, quizzes, or group discussions to stay engaged.
    3️⃣ Mindfulness & Meditation – Practicing mindfulness can enhance focus and reduce distractions.
    4️⃣ Active Participation – Asking questions and engaging in discussions boosts retention.
    
    ⚠️ Reminder: Today's lecture content will be included in an upcoming quiz. Reviewing the material and engaging in class discussions can help reinforce learning.
    
    Stay curious and keep up the effort!
    
    Best,  
    [Your Name or Institution]`
        );
    
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };
    

    const selectedData = reportData ? reportData[selectedSample] : null;

    // Determine the card color and message based on engagement score
    let cardColor = "bg-red-100 border-red-500";
    let titleColor = "text-red-800";
    let message = `⚠️ Low engagement detected. 

    Engaging more in class activities can significantly enhance your learning experience and retention. Here are some ways to boost your participation and get the most out of your learning journey:
    
    1️⃣ **Set Small Goals** – Start by actively participating at least once in each session, whether by asking a question or sharing your thoughts.  
    
    2️⃣ **Stay Focused** – Minimize distractions like social media or unrelated tasks to stay fully present in class discussions.  
    
    3️⃣ **Take Notes Effectively** – Writing key points in your own words helps with retention and keeps you engaged.  
    
    4️⃣ **Engage with Peers** – Collaborate in discussions, group projects, or study sessions to reinforce your understanding.  
    
    5️⃣ **Ask Questions** – Even if you’re unsure, asking questions clarifies doubts and shows curiosity, which leads to better learning.  
    
    6️⃣ **Apply What You Learn** – Try relating concepts to real-world examples or personal experiences to deepen your understanding.  
    
    🚀 **Every step towards more engagement leads to better learning outcomes.** Start small, stay consistent, and watch your progress grow! You've got this!`;
    

    if (selectedData) {
        if (selectedData.engagement > 60) {
            cardColor = "bg-green-100 border-green-500";
            titleColor = "text-green-800";
            message = "High engagement detected in today's lecture! Studies show that active participation enhances learning retention by up to 70%. Your focus and involvement are making a real impact—keep it up! Stay curious, stay engaged, and keep pushing forward!";

        } else if (selectedData.engagement >= 50) {
            cardColor = "bg-yellow-100 border-yellow-500";
            titleColor = "text-yellow-800";
            message = `Moderate engagement detected!

You're on the right track, but there's room to take your participation to the next level. Here are some ways to boost your engagement and make the most of your learning experience:

1️⃣ **Ask Questions** – Clarifying doubts not only helps you but also benefits others. Engaged learners ask more questions!

2️⃣ **Actively Participate** – Share your thoughts, contribute to discussions, and collaborate with peers to deepen your understanding.

3️⃣ **Take Notes & Reflect** – Writing down key points and summarizing them in your own words improves retention and comprehension.

4️⃣ **Stay Curious** – Challenge yourself to explore topics beyond the basics. Curiosity drives deeper learning and keeps engagement high.

5️⃣ **Limit Distractions** – Minimize multitasking and create an environment conducive to focused learning. Small changes lead to big results!

Keep up the effort, and aim for even greater engagement! You're capable of achieving amazing progress. 🚀`;

            
            
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center w-full" ref={reportRef}>
            {/* Header Section */}
            <div className="w-full bg-[#002f56] text-white text-center py-4 text-lg font-semibold">
        PERI: PEDAGOGICAL & EDUCATIONAL REINFORCEMENT INTERVENTION
      </div>
            
            {/* Engagement Feedback Card */}
            {selectedData && (
                <div className={`w-4/5 max-w-3xl mt-8 p-6 ${cardColor} border-l-4 shadow-lg rounded-lg`}>
                    <h3 className={`text-xl font-semibold ${titleColor}`}>Engagement Report</h3>
                    <p className="text-gray-700 mt-2">{message}</p>
                    <br/>
                    <br/>
                    <div className="flex justify-center items-center space-x-4">
    <button onClick={saveAsPDF} className="px-4 py-2 bg-[#ffc72c] text-white rounded-lg shadow-md hover:bg-yellow-700">
        Save as PDF
    </button>
    <button onClick={sendEmail} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">
        Email Report
    </button>
</div>
                </div>
            )}
                        {/* Action Buttons */}
                        
            

            
            <div className="mt-6 w-4/5 flex justify-center">
                <img src="/ai_institute_image.png" alt="Illustration" className="w-4/5 h-48 object-cover rounded-lg" />
            </div>
            </div>
    );
}
