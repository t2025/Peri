"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Video } from "lucide-react";

export default function LearningStatesUploader() {
  const [file, setFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const router = useRouter();
  let chunks = [];

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
    setVideoBlob(null);
    setVideoURL(null);
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]); // When `stream` is set, it updates the video element

  const startRecording = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(userStream); // Set stream, triggering video display
      
      mediaRecorderRef.current = new MediaRecorder(userStream);
      chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/mp4" });
        setVideoBlob(blob);
        setVideoURL(URL.createObjectURL(blob));

        // Stop the live stream and release the camera
        userStream.getTracks().forEach((track) => track.stop());
        setStream(null); // Clear the stream so it stops displaying
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const handleSubmit = () => {
    const sampleName = file ? file.name : "recorded_sample_1.mp4";
    router.push(`/next-page?sample=${encodeURIComponent(sampleName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center w-full">
      {/* Header Section */}
            {/* Header Section */}
            <div className="w-full bg-[#002f56] text-white text-center py-4 text-lg font-semibold">
                PERI: PEDAGOGICAL & EDUCATIONAL REINFORCEMENT INTERVENTION
            </div>

      {/* Main Content */}
      <div className="w-4/5 max-w-2xl mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
  Detecting and Analyzing Learning States
</h2>
<p className="text-gray-600 mb-4 text-lg font-semibold">What is PERI?</p>
<p className="text-gray-700 mb-4">
  PERI is an AI-powered tool designed to analyze and classify students' cognitive learning states—Engagement, Confusion, Boredom, and Frustration—by processing short video clips. 
</p>
<h3 className="text-xl font-semibold text-gray-800 mb-3">How It Works:</h3>
<ul className="list-disc list-inside text-gray-600 mb-4">
  <li>📹 <strong>Upload or Record a Video</strong>: Provide a short video clip of a student engaged in a learning activity.</li>
  <li>🧠 <strong>AI-Powered Analysis</strong>: Our advanced model will assess engagement levels, identifying signs of focus, confusion, boredom, or frustration.</li>
  <li>📊 <strong>Get Actionable Insights</strong>: Receive a detailed report on the cognitive learning states, helping tailor interventions for better learning outcomes.</li>
</ul>
<p className="text-gray-700 mb-4">
  Whether you're an educator looking to enhance classroom engagement or a student striving for improved learning experiences, PERI empowers you with data-driven insights to optimize the educational journey. 
</p>


        {/* Upload & Record Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
          <label className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 flex items-center cursor-pointer">
            <Upload className="mr-2" size={24} />
            <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
            Upload Video
          </label>
          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-[#ffc72c] text-white px-8 py-3 rounded-lg hover:bg-yellow-700 flex items-center"
            >
              <Video className="mr-2" size={24} /> Record Video
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700"
            >
              Stop Recording
            </button>
          )}
        </div>

        {/* Video Preview Section */}
        <div className="mt-4 text-center">
          {stream ? (
            <div>
              <p className="text-gray-700">Recording in Progress...</p>
              <video ref={videoRef} className="w-full max-w-md mx-auto rounded-md shadow-lg" autoPlay playsInline muted />
            </div>
          ) : videoURL ? (
            <div>
              <video className="w-full max-w-md mx-auto rounded-md shadow-lg" controls>
                <source src={videoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-gray-700 mt-2">Recorded Video Ready</p>
            </div>
          ) : null}
        </div>

        {/* Display Uploaded Video Filename */}
        {file && (
          <div className="text-center mt-4 text-gray-700">
            <p>File: {file.name}</p>
          </div>
        )}

        {/* Submit Button */}
        {(file || videoBlob) && (
          <div className="text-center mt-6">
            <button onClick={handleSubmit} className="bg-[#002f56] text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Submit
            </button>
          </div>
        )}
      </div>

      {/* Footer Image */}
      <div className="mt-4 w-4/5 flex justify-center">
                <img src="/ai_institute_image.png" alt="Illustration" className="w-4/5 h-48 object-cover rounded-lg" />
            </div>
            </div>
  );
}
