"use client";

import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faRotateRight,
  faCheck,
  faXmark,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  cropShape?: "round" | "rect";
  aspectRatio?: number;
  title?: string;
  subtitle?: string;
  onCancel: () => void;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

function calculateBoundingBox(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<{ file: File; url: string }> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context tidak tersedia");
  }

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = calculateBoundingBox(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    throw new Error("Canvas 2D context tidak tersedia");
  }

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Gagal menghasilkan blob gambar"));
          return;
        }
        const file = new File([blob], `avatar_${Date.now()}.webp`, {
          type: "image/webp",
        });
        const url = URL.createObjectURL(blob);
        resolve({ file, url });
      },
      "image/webp",
      0.9
    );
  });
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  cropShape = "round",
  aspectRatio = 1,
  title,
  subtitle,
  onCancel,
  onCropComplete,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleCropComplete = useCallback(
    (_croppedArea: Area, currentCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(currentCroppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setProcessing(true);
    try {
      const { file, url } = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      onCropComplete(file, url);
    } catch (err) {
      console.error("Gagal melakukan crop gambar:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  if (!isOpen || !imageSrc) return null;

  const modalTitle =
    title ||
    (cropShape === "round" ? "Sesuaikan Foto Lingkaran" : "Sesuaikan Foto");
  const modalSubtitle =
    subtitle ||
    (cropShape === "round"
      ? "Geser dan perbesar agar bagian wajah/badan berada tepat di dalam lingkaran."
      : "Geser dan atur area foto yang akan ditampilkan.");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">{modalTitle}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{modalSubtitle}</p>
          </div>
          <button
            onClick={onCancel}
            type="button"
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Cropper Viewport */}
        <div className="relative w-full h-80 bg-gray-900 select-none">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="p-5 space-y-4 bg-gray-50/50 border-t border-gray-100 text-xs">
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-gray-600 font-semibold">
              <span>Perbesar (Zoom)</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(2)))}
                className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center cursor-pointer transition shrink-0"
              >
                <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
              </button>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#31572c] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}
                className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center cursor-pointer transition shrink-0"
              >
                <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
              </button>
            </div>
          </div>

          {/* Rotate & Reset */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-semibold cursor-pointer transition"
              >
                <FontAwesomeIcon icon={faRotateRight} />
                <span>Putar 90°</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 cursor-pointer transition"
              >
                <FontAwesomeIcon icon={faArrowsRotate} />
                <span>Reset</span>
              </button>
            </div>

            <span className="text-[11px] text-gray-400">
              {cropShape === "round" ? "Format Lingkaran Profil" : "Format Persegi"}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 p-4 bg-white border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-semibold cursor-pointer text-xs"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={processing}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-hijauhunter hover:bg-hijaugelap text-white font-semibold transition cursor-pointer text-xs shadow-sm disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faCheck} />
            <span>{processing ? "Memproses..." : "Terapkan Foto"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
