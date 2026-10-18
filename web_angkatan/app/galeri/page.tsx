"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImages,
  faExpand,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faDownload,
  faShareNodes,
  faTableCells,
  faTableCellsLarge,
  faMagnifyingGlass,
  faCheck,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

interface GaleriItem {
  id: string;
  kategori: "proximiti" | "megabit" | "ultras" | string;
  src: string;
  caption?: string;
  created_at?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  semua: "Semua Momen",
  proximiti: "Proximiti",
  megabit: "Megabit",
  ultras: "Ultras TI",
};

export default function GaleriPage() {
  const [photos, setPhotos] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [viewMode, setViewMode] = useState<"masonry" | "grid">("masonry");
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchGaleri = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/galeri");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPhotos(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat foto galeri:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGaleri();
  }, [fetchGaleri]);

  // Filter foto berdasarkan kategori dan pencarian
  const filteredPhotos = photos.filter((p) => {
    const matchCat =
      selectedCategory === "semua" || p.kategori?.toLowerCase() === selectedCategory;
    const matchSearch =
      !searchQuery ||
      p.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kategori?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Navigasi Lightbox
  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || filteredPhotos.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null || prev === 0 ? filteredPhotos.length - 1 : prev - 1
    );
  }, [lightboxIndex, filteredPhotos.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || filteredPhotos.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null || prev === filteredPhotos.length - 1 ? 0 : prev + 1
    );
  }, [lightboxIndex, filteredPhotos.length]);

  const handleCloseLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation untuk lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") handleCloseLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [lightboxIndex, handlePrev, handleNext, handleCloseLightbox]);

  const handleCopyPhotoLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mt-6 space-y-8">
          {/* Header Title */}
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-hijaugelap tracking-tight">
              Galeri Green Comrades 25
            </h1>
          </div>

          {/* TOOLBAR & FILTER SECTION */}
          <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {(["semua", "proximiti", "megabit", "ultras"] as const).map((cat) => {
                const isSelected = selectedCategory === cat;
                const count =
                  cat === "semua"
                    ? photos.length
                    : photos.filter((p) => p.kategori?.toLowerCase() === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-hijauhunter text-white shadow-sm ring-2 ring-hijauhunter/20"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <span>{CATEGORY_LABELS[cat] || cat}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Controls: Search & Layout Mode */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-60">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari foto..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter bg-white"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center rounded-xl border border-gray-300 p-0.5 bg-white shrink-0">
                <button
                  onClick={() => setViewMode("masonry")}
                  title="Tampilan Alami (Masonry)"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === "masonry"
                      ? "bg-hijauhunter text-white shadow-xs font-bold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <FontAwesomeIcon icon={faTableCellsLarge} className="text-xs" />
                  <span className="hidden sm:inline">Masonry</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  title="Tampilan Persegi (Grid)"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === "grid"
                      ? "bg-hijauhunter text-white shadow-xs font-bold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <FontAwesomeIcon icon={faTableCells} className="text-xs" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchGaleri}
                disabled={loading}
                title="Muat ulang galeri"
                className="w-9 h-9 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 flex items-center justify-center text-xs transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faRotateRight} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* PHOTO GALLERY SECTION */}
          <div>
          {loading ? (
            /* SKELETON LOADER */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl bg-gray-200 animate-pulse border border-gray-200"
                />
              ))}
            </div>
          ) : filteredPhotos.length === 0 ? (
            /* EMPTY STATE */
            <div className="bg-white p-16 rounded-2xl border border-dashed border-gray-300 text-center max-w-xl mx-auto my-12">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-hijauhunter flex items-center justify-center mx-auto mb-3 text-lg">
                <FontAwesomeIcon icon={faImages} />
              </div>
              <h3 className="text-base font-bold text-gray-900">Tidak ada foto ditemukan</h3>
              <p className="text-xs text-gray-500 mt-1">
                {searchQuery
                  ? `Tidak ada dokumentasi yang cocok dengan kata kunci "${searchQuery}".`
                  : "Belum ada foto yang diunggah untuk kategori ini."}
              </p>
              {(searchQuery || selectedCategory !== "semua") && (
                <button
                  onClick={() => {
                    setSelectedCategory("semua");
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-hijauhunter text-white text-xs font-semibold hover:bg-hijaugelap transition cursor-pointer"
                >
                  Tampilkan Semua Foto
                </button>
              )}
            </div>
          ) : viewMode === "masonry" ? (
            /* MASONRY VIEW (PINTEREST STYLE) */
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {filteredPhotos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="break-inside-avoid relative rounded-2xl overflow-hidden bg-white border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <img
                    src={photo.src}
                    alt={photo.caption || `Dokumentasi IT 25 ${photo.kategori}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Dark Glass Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    {/* Top Pill */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-hijaugelap backdrop-blur-xs">
                        {photo.kategori}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-xs backdrop-blur-xs">
                        <FontAwesomeIcon icon={faExpand} />
                      </span>
                    </div>

                    {/* Bottom Info */}
                    <div>
                      {photo.caption && (
                        <p className="text-white text-xs font-semibold line-clamp-2 drop-shadow-sm mb-1">
                          {photo.caption}
                        </p>
                      )}
                      <p className="text-white/80 text-[10px]">Klik untuk memperbesar</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* SQUARE GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPhotos.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="aspect-square relative rounded-2xl overflow-hidden bg-white border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <img
                    src={photo.src}
                    alt={photo.caption || `Dokumentasi IT 25 ${photo.kategori}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Dark Glass Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 text-hijaugelap backdrop-blur-xs">
                        {photo.kategori}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center text-xs backdrop-blur-xs">
                        <FontAwesomeIcon icon={faExpand} />
                      </span>
                    </div>

                    <div>
                      {photo.caption && (
                        <p className="text-white text-xs font-semibold line-clamp-2 drop-shadow-sm mb-1">
                          {photo.caption}
                        </p>
                      )}
                      <p className="text-white/80 text-[10px]">Klik untuk memperbesar</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

        {/* FULLSCREEN LIGHTBOX MODAL */}
        {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10 z-20">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {filteredPhotos[lightboxIndex].kategori}
                </span>
                <span className="text-xs text-white/70 font-medium">
                  Foto {lightboxIndex + 1} dari {filteredPhotos.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Download Button */}
                <a
                  href={filteredPhotos[lightboxIndex].src}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  title="Buka / Unduh foto asli"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition cursor-pointer"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </a>

                {/* Share / Copy Link Button */}
                <button
                  onClick={() => handleCopyPhotoLink(filteredPhotos[lightboxIndex].src)}
                  title="Salin tautan foto"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition cursor-pointer"
                >
                  <FontAwesomeIcon icon={copiedLink ? faCheck : faShareNodes} />
                </button>

                {/* Close Button */}
                <button
                  onClick={handleCloseLightbox}
                  title="Tutup (Esc)"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500/30 text-white hover:text-red-300 flex items-center justify-center text-sm transition cursor-pointer ml-2"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            </div>

            {/* Main Stage with Center Image & Nav Buttons */}
            <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0">
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                title="Foto Sebelumnya (Panah Kiri)"
                className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center text-sm transition cursor-pointer backdrop-blur-xs"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>

              {/* High-Res Photo Container */}
              <div className="relative max-w-full max-h-full flex items-center justify-center">
                <img
                  src={filteredPhotos[lightboxIndex].src}
                  alt={
                    filteredPhotos[lightboxIndex].caption ||
                    `Foto ${filteredPhotos[lightboxIndex].kategori}`
                  }
                  className="max-h-[72vh] max-w-[88vw] object-contain rounded-xl shadow-2xl transition-all duration-200"
                />
              </div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                title="Foto Selanjutnya (Panah Kanan)"
                className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center text-sm transition cursor-pointer backdrop-blur-xs"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>

            {/* Bottom Bar: Thumbnail Strip & Caption */}
            <div className="px-4 sm:px-8 py-3 border-t border-white/10 bg-black/50 backdrop-blur-md z-20 space-y-2">
              {filteredPhotos[lightboxIndex].caption && (
                <p className="text-center text-xs text-white/90 font-medium">
                  {filteredPhotos[lightboxIndex].caption}
                </p>
              )}

              {/* Horizontal Thumbnail Strip */}
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 max-w-3xl mx-auto scrollbar-none">
                {filteredPhotos.map((thumb, tIdx) => (
                  <button
                    key={thumb.id || tIdx}
                    onClick={() => setLightboxIndex(tIdx)}
                    className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer border-2 ${
                      tIdx === lightboxIndex
                        ? "border-emerald-400 scale-105 shadow-md"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={thumb.src}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <p className="text-center text-[10px] text-white/40">
                Gunakan tombol panah kiri / kanan pada keyboard untuk navigasi, tombol Esc untuk menutup.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}