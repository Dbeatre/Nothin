import { useState, useRef } from 'react';
import { useStudyStore } from '../../store/useStudyStore';
import { Camera, Image, FileText, Upload, X } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';
import { callGemini } from '../../lib/gemini';
import { extractTextFromPDF } from '../../lib/pdfExtract';
import { saveToStorage } from '../../lib/storage';

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const setAnalysis = useStudyStore((s) => s.setAnalysis);
  const setMockMode = useStudyStore((s) => s.setMockMode);
  const setAnalysisLoading = useStudyStore((s) => s.setAnalysisLoading);
  const setAnalysisError = useStudyStore((s) => s.setAnalysisError);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setFileType(selected.type);

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selected);
    } else if (selected.type === 'application/pdf' || selected.type === 'text/plain') {
      setFilePreview(null);
    } else {
      setFile(null);
      setFilePreview(null);
      setFileType(null);
      alert('Unsupported file type. Please upload an image or PDF.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setAnalysisLoading(true);
    setAnalysisError(null);

    try {
      let imageBase64 = null;
      let pdfText = null;

      if (file.type.startsWith('image/')) {
        // Convert to base64 (without header)
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        imageBase64 = dataUrl.split(',')[1];
      } else if (file.type === 'application/pdf') {
        pdfText = await extractTextFromPDF(file);
      } else if (file.type === 'text/plain') {
        pdfText = await file.text(); // treat as text
      }

      const prompt = `Analyze the following study material and provide a structured analysis:
      - Subject and grade level
      - 5-8 bullet point summary
      - Mermaid syntax for a mind map
      - 3 multiple choice questions with options, correct index, explanation
      - 2 short questions with answers
      - 2 numerical problems with step-by-step solutions (array of strings for steps) and final answer`;

      const result = await callGemini(prompt, imageBase64, pdfText);
      setAnalysis(result.analysis);
      setMockMode(result.mock);
      saveToStorage('lastAnalysis', result.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisError(error.message || 'Failed to analyze material.');
    } finally {
      setIsLoading(false);
      setAnalysisLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    setFileType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold">Upload Study Material</h2>
        {file && (
          <button onClick={clearFile} className="text-white/50 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center space-y-4">
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              <Image className="w-6 h-6 text-accent-violet" />
              <span className="text-sm">Gallery</span>
            </button>
            <button
              onClick={() => {
                // Use input with capture attribute for camera
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.capture = 'environment';
                input.onchange = (e) => {
                  if (e.target.files.length) {
                    handleFileChange(e);
                  }
                };
                input.click();
              }}
              className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              <Camera className="w-6 h-6 text-accent-cyan" />
              <span className="text-sm">Camera</span>
            </button>
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.txt';
                input.onchange = handleFileChange;
                input.click();
              }}
              className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              <FileText className="w-6 h-6 text-white/60" />
              <span className="text-sm">PDF / TXT</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-sm text-white/40">Tap to upload from gallery, camera, or files</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filePreview && (
            <div className="rounded-xl overflow-hidden max-h-64 flex justify-center bg-black/30">
              <img src={filePreview} alt="Preview" className="object-contain max-h-64" />
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white/80">
              {file.name}
            </span>
            <span className="text-white/40">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <GradientButton
            onClick={handleUpload}
            loading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Analyze Material
          </GradientButton>
        </div>
      )}
    </GlassCard>
  );
}
