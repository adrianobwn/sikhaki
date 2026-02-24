"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Camera, RefreshCw, X, SwitchCamera } from "lucide-react";

interface CameraModuleProps {
  photo: string | null;
  onCapture: (dataUrl: string) => void;
}

export default function CameraModule({ photo, onCapture }: CameraModuleProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const streamRef = useRef<MediaStream | null>(null);

  // Attach stream to video element once it's rendered
  useEffect(() => {
    if (streaming && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => { });
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

  const startCamera = useCallback(async (mode: "user" | "environment" = facingMode) => {
    try {
      setError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Browser Anda tidak mendukung akses kamera. Gunakan browser modern seperti Chrome atau Safari.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
        audio: false,
      });
      streamRef.current = stream;
      setStreaming(true);
    } catch (err) {
      console.error("Camera error:", err);

      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setError("Akses kamera ditolak. Klik ikon kunci/kamera di address bar browser, lalu izinkan akses kamera.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setError("Kamera tidak ditemukan. Pastikan perangkat Anda memiliki kamera.");
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          setError("Kamera sedang digunakan aplikasi lain. Tutup aplikasi yang menggunakan kamera, lalu coba lagi.");
        } else if (err.name === "OverconstrainedError") {
          // Fallback: jika kamera yang diminta tidak tersedia, coba tanpa facingMode
          try {
            const fallback = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false,
            });
            streamRef.current = fallback;
            setStreaming(true);
            return;
          } catch {
            setError("Kamera tidak dapat diakses. Coba refresh halaman.");
          }
        } else {
          setError(`Error: ${err.message}. Coba refresh halaman atau gunakan browser lain.`);
        }
      } else {
        setError("Kamera tidak dapat diakses. Pastikan izin kamera sudah diberikan dan tidak digunakan aplikasi lain.");
      }
    }
  }, [facingMode]);

  const toggleCamera = async () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setStreaming(false);

    setTimeout(() => {
      startCamera(newMode);
    }, 100);
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (facingMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      onCapture(dataUrl);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStreaming(false);
  }, [onCapture, facingMode]);

  const retake = () => {
    onCapture("");
    setStreaming(false);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="border border-red-200 bg-red-50 p-4 rounded-xl space-y-3">
          <div className="flex items-start gap-2 text-sm text-red-700 font-medium">
            <span className="shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* STATE: Idle - Show start buttons */}
      {!streaming && !photo && (
        <div className="space-y-3">
          {/* Tombol utama buka kamera */}
          <button
            type="button"
            onClick={() => startCamera()}
            className="w-full border-2 border-dashed border-teal-300 bg-gradient-to-br from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 rounded-2xl py-10 px-4 transition-all group active:scale-[0.98]"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                <Camera size={32} />
              </div>
              <div className="text-center">
                <span className="font-bold text-teal-900 text-lg block">Foto Absen Pulang</span>
                <span className="text-sm text-teal-600">
                  {facingMode === "user" ? "📷 Kamera Depan (Selfie)" : "📷 Kamera Belakang"}
                </span>
              </div>
            </div>
          </button>

          {/* Toggle kamera depan/belakang sebelum buka */}
          <button
            type="button"
            onClick={() => setFacingMode(facingMode === "user" ? "environment" : "user")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors active:scale-[0.98]"
          >
            <SwitchCamera size={16} />
            {facingMode === "user" ? "Ganti ke Kamera Belakang" : "Ganti ke Kamera Depan (Selfie)"}
          </button>
        </div>
      )}

      {/* STATE: Streaming - Camera preview + CAPTURE BUTTON */}
      {streaming && (
        <div className="space-y-4">
          {/* Camera Preview */}
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-slate-800 bg-black relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full aspect-[3/4] object-cover ${facingMode === "user" ? "transform -scale-x-100" : ""}`}
            />

            {/* Camera Toggle Button — dengan label */}
            <button
              type="button"
              onClick={toggleCamera}
              className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-all active:scale-95"
            >
              <SwitchCamera size={18} />
              <span className="text-xs font-semibold">
                {facingMode === "user" ? "Belakang" : "Depan"}
              </span>
            </button>

            {/* Kamera mode indicator */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs font-semibold backdrop-blur-sm">
              {facingMode === "user" ? "📷 Kamera Depan" : "📷 Kamera Belakang"}
            </div>
          </div>

          {/* Capture Button - besar untuk jempol */}
          <button
            type="button"
            onClick={capturePhoto}
            className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-red-500/30 active:scale-[0.97] transition-all text-lg"
          >
            <Camera size={24} />
            Ambil Foto Sekarang
          </button>

          <p className="text-center text-xs text-slate-500">Posisikan wajah/objek di tengah frame, pastikan terlihat jelas</p>
        </div>
      )}

      {/* STATE: Photo captured - Show preview */}
      {photo && (
        <div className="space-y-3">
          <div className="rounded-2xl overflow-hidden shadow-md border border-green-200 bg-slate-50 relative">
            <img src={photo} alt="Foto absen pulang" className="w-full" />
            <button
              type="button"
              onClick={retake}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors active:scale-90"
            >
              <X size={18} />
            </button>
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center justify-center gap-2 text-white text-sm font-semibold">
                <span className="bg-green-400 w-2.5 h-2.5 rounded-full animate-pulse"></span>
                Foto berhasil diambil
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={retake}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors active:scale-[0.98]"
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
