"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Video } from "lucide-react";

export default function LearningStatesUploader() {
  const [file, setFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const router = useRouter();

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/mp4" });
        setVideoBlob(blob);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
};

const stopRecording = () => {
    mediaRecorderRef.current.stop();
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    setRecording(false);
};

const handleSubmit = () => {
  const sampleName = file ? file.name : "recorded_sample_1.mp4";
  router.push(`/next-page?sample=${encodeURIComponent(sampleName)}`);
};


  return (
   <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center w-full px-4">
      {/* Header Section */}
      <div className="w-full bg-blue-600 text-white text-center py-4 text-lg font-semibold">
        PERI: Empowering Learning, Enhancing Insights
      </div>
      
      {/* Main Content */}
      <div className="w-4/5 max-w-2xl mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Detecting and Analyzing Learning States
        </h2>
        <p className="text-gray-600 mb-4">What is this project about?</p>
        <p className="text-gray-700 mb-4">
          This AI-powered tool classifies students' cognitive learning states—Engagement, Confusion, Boredom, and Frustration—by analyzing short video clips. Our goal is to enhance personalized learning and improve student outcomes.
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Upload a short video of a student learning or record a new one.</li>
          <li>Our AI will analyze engagement levels.</li>
          <li>Get insights on cognitive learning states!</li>
        </ul>
        
{/* Upload & Record Buttons in Row */}
<div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
  <label className="inline-flex flex-col items-center cursor-pointer border-2 border-blue-600 rounded-lg px-8 py-3 bg-blue-600 text-white hover:bg-blue-700">
    <Upload className="mb-1" size={24} />
    <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
    Upload Video
  </label>
  {!recording ? (
    <button onClick={startRecording} className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 flex items-center">
      <Video className="mr-2" size={24} /> Record Video
    </button>
  ) : (
    <button onClick={stopRecording} className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700">
      Stop Recording
    </button>
  )}
</div>
        
        {file && (
          <div className="text-center mt-4 text-gray-700">
            File: {file.name}
          </div>
        )}
        
        {videoBlob && (
          <div className="text-center mt-4">
            <p className="text-gray-700">Recorded Video Ready</p>
          </div>
        )}
        
        {/* Submit Button */}
        {(file || videoBlob) && (
          <div className="text-center mt-6">
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Submit
            </button>
          </div>
        )}
      </div>
      
      {/* Footer Image */}
      <div className="mt-6 w-4/5">
        <img src="/ai_institute_image.png" alt="Illustration" className="w-4/5 mx-auto" />
      </div>
    </div>
  );
}
