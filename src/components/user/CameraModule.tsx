"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Camera, RefreshCw, X, UserCircle } from "lucide-react";

interface CameraModuleProps {
  photo: string | null;
  onCapture: (dataUrl: string) => void;
}

export default function CameraModule({ photo, onCapture }: CameraModuleProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Attach stream to video element once it's rendered
  useEffect(() => {
    if (streaming && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [streaming]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      // Set streaming first so video element renders, then useEffect attaches stream
      setStreaming(true);
    } catch {
      setError("Kamera selfie tidak dapat diakses. Pastikan izin kamera diberikan di pengaturan browser.");
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      onCapture(dataUrl);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStreaming(false);
  }, [onCapture]);

  const retake = () => {
    onCapture("");
    setStreaming(false);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700 font-medium rounded-xl flex items-start gap-2">
          <span className="shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* STATE: Idle - Show start button */}
      {!streaming && !photo && (
        <button
          type="button"
          onClick={startCamera}
          className="w-full border-2 border-dashed border-teal-300 bg-gradient-to-br from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 rounded-2xl py-10 px-4 transition-all group active:scale-[0.98]"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
              <UserCircle size={32} />
            </div>
            <div className="text-center">
              <span className="font-bold text-teal-900 text-lg block">Selfie Absen Pulang</span>
              <span className="text-sm text-teal-600">Tap untuk buka kamera depan</span>
            </div>
          </div>
        </button>
      )}

      {/* STATE: Streaming - Camera preview + CAPTURE BUTTON */}
      {streaming && (
        <div className="space-y-4">
          {/* Camera Preview */}
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-slate-800 bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-[3/4] object-cover transform -scale-x-100"
            />
          </div>

          {/* Capture Button - OUTSIDE the video container so always visible */}
          <button
            type="button"
            onClick={capturePhoto}
            className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-red-500/30 active:scale-[0.97] transition-all text-lg"
          >
            <Camera size={24} />
            Ambil Foto Sekarang
          </button>

          <p className="text-center text-xs text-slate-500">Posisikan wajah di tengah frame, pastikan terlihat jelas</p>
        </div>
      )}

      {/* STATE: Photo captured - Show preview */}
      {photo && (
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden shadow-md border border-green-200 bg-slate-50 relative">
            <img src={photo} alt="Selfie absen pulang" className="w-full" />
            <button
              type="button"
              onClick={retake}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center justify-center gap-2 text-white text-sm font-semibold">
                <span className="bg-green-400 w-2.5 h-2.5 rounded-full animate-pulse"></span>
                Selfie berhasil diambil
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={retake}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw size={14} />
            Foto kurang jelas? Ambil ulang
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
