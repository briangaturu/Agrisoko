import { useState, useRef } from "react";
import {
  Camera, Upload, X, Loader2, Search,
  AlertTriangle, CheckCircle,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api/external";

// ── Helper ─────────────────────────────────────────────────────────────────────
const formatDiseaseLabel = (label: string) => {
  const parts     = label.replace(/_/g, " ").split("___");
  const crop      = parts[0] || "Plant";
  const condition = parts[1] || label;
  const isHealthy = condition.toLowerCase().includes("healthy");
  return { crop, condition, isHealthy };
};

interface DiseaseResult {
  label: string;
  score: number;
}

// ── Component ──────────────────────────────────────────────────────────────────
const DiseaseTab = () => {
  const [diseaseImage, setDiseaseImage] = useState<string | null>(null);
  const [diseaseFile, setDiseaseFile]   = useState<File | null>(null);
  const [results, setResults]           = useState<DiseaseResult[] | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef     = useRef<HTMLVideoElement>(null);
  const streamRef    = useRef<MediaStream | null>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Camera ───────────────────────────────────────────────────────────────────
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      setError("Camera access denied. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas  = canvasRef.current;
    canvas.width  = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      setDiseaseFile(file);
      setDiseaseImage(canvas.toDataURL("image/jpeg"));
      setResults(null);
      stopCamera();
    }, "image/jpeg");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDiseaseFile(file);
    setResults(null);
    setError(null);
    const reader   = new FileReader();
    reader.onload  = (ev) => setDiseaseImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── Detection — sends to backend ─────────────────────────────────────────────
  const detectDisease = async () => {
    if (!diseaseFile) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("image", diseaseFile);

      const res = await fetch(`${API_BASE}/disease`, {
        method: "POST",
        body:   formData,
        // ⚠️ Do NOT set Content-Type — browser sets it automatically with boundary
      });

      const json = await res.json();

      if (res.status === 503) throw new Error(json.error);
      if (!res.ok)            throw new Error(json.error || "Detection failed");

      setResults((json.data || json).slice(0, 5));
    } catch (err: any) {
      setError(err.message || "Failed to detect disease.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setDiseaseImage(null);
    setDiseaseFile(null);
    setResults(null);
    setError(null);
    stopCamera();
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-800">Plant Disease Detection</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Take a photo or upload an image of your crop to detect diseases using AI
        </p>
      </div>

      {/* Options */}
      {!diseaseImage && !cameraActive && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={startCamera}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50 transition"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Camera size={22} className="text-green-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800 text-sm">Take Photo</p>
              <p className="text-xs text-gray-400 mt-0.5">Use your camera</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50 transition"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload size={22} className="text-blue-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800 text-sm">Upload Image</p>
              <p className="text-xs text-gray-400 mt-0.5">From your gallery</p>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {/* Camera */}
      {cameraActive && (
        <div className="bg-black rounded-2xl overflow-hidden relative">
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-2xl" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium hover:bg-white/30 transition backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              onClick={capturePhoto}
              className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition"
            >
              <div className="w-12 h-12 bg-green-600 rounded-full" />
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      {diseaseImage && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={diseaseImage}
              alt="Crop to analyze"
              className="w-full max-h-72 object-cover rounded-2xl shadow-sm"
            />
            <button
              onClick={clearAll}
              className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition"
            >
              <X size={16} />
            </button>
          </div>

          {!results && (
            <button
              onClick={detectDisease}
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Analyzing crop...</>
                : <><Search size={18} /> Detect Disease</>
              }
            </button>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm font-medium">⚠️ {error}</p>
              {error.includes("loading") && (
                <button
                  onClick={detectDisease}
                  className="mt-2 text-xs text-red-600 underline"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800">Detection Results</h3>

              {/* Top result */}
              {(() => {
                const { crop, condition, isHealthy } = formatDiseaseLabel(results[0].label);
                return (
                  <div className={`rounded-2xl p-5 ${
                    isHealthy
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      {isHealthy
                        ? <CheckCircle size={22} className="text-green-600 flex-shrink-0" />
                        : <AlertTriangle size={22} className="text-red-600 flex-shrink-0" />
                      }
                      <div>
                        <p className={`font-bold text-lg ${isHealthy ? "text-green-800" : "text-red-800"}`}>
                          {isHealthy ? "Healthy Plant" : condition}
                        </p>
                        <p className="text-sm text-gray-500">Crop: {crop}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${isHealthy ? "bg-green-500" : "bg-red-500"}`}
                          style={{ width: `${(results[0].score * 100).toFixed(0)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {(results[0].score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Other possibilities */}
              {results.length > 1 && (
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Other Possibilities
                  </p>
                  <div className="space-y-2">
                    {results.slice(1).map((r, i) => {
                      const { condition, isHealthy } = formatDiseaseLabel(r.label);
                      return (
                        <div key={i} className="flex items-center justify-between">
                          <p className="text-sm text-gray-700 truncate flex-1">{condition}</p>
                          <div className="flex items-center gap-2 ml-3">
                            <div className="w-16 bg-gray-100 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  isHealthy ? "bg-green-400" : "bg-orange-400"
                                }`}
                                style={{ width: `${(r.score * 100).toFixed(0)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-10 text-right">
                              {(r.score * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={clearAll}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Try Another
                </button>
                <button
                  onClick={() => { setResults(null); detectDisease(); }}
                  className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition"
                >
                  Re-analyze
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      {!diseaseImage && !cameraActive && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm font-semibold text-blue-800 mb-2">💡 Tips for best results</p>
          <ul className="space-y-1">
            {[
              "Take a clear, well-lit photo of the affected leaf or stem",
              "Get close enough to show the disease symptoms clearly",
              "Avoid blurry or dark images for accurate detection",
              "Works best with tomatoes, potatoes, corn, and other common crops",
            ].map((tip, i) => (
              <li key={i} className="text-xs text-blue-700 flex items-start gap-1.5">
                <span className="mt-0.5">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiseaseTab;