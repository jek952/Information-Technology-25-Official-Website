"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faImage } from "@fortawesome/free-solid-svg-icons";

// Dynamic import agar tidak error SSR
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-xl min-h-[320px] flex items-center justify-center text-gray-400">
      Memuat editor...
    </div>
  ),
});

export default function AdminInfo() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Event Angkatan");
  const [organizer, setOrganizer] = useState("");
  const [availDate, setAvailDate] = useState("");
  const [content, setContent] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, type, organizer, availDate, content });
    alert("Data berhasil disimpan! (Belum tersambung ke backend)");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-hijaugelap">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Kelola postingan Information Hub</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
            <FontAwesomeIcon icon={faPlus} className="text-hijauterang" />
            <h2 className="text-2xl font-bold">Buat Postingan Baru</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Judul */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Judul Postingan
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Seminar Nasional IT 2026"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-hijauterang focus:border-hijauterang outline-none transition"
                  required
                />
              </div>

              {/* Tipe */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori Tipe
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-hijauterang focus:border-hijauterang outline-none transition"
                >
                  <option value="Event Angkatan">Event Angkatan</option>
                  <option value="Event Kampus">Event Kampus</option>
                  <option value="Beasiswa">Beasiswa</option>
                  <option value="Perlombaan">Perlombaan</option>
                </select>
              </div>

              {/* Penyelenggara */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Penyelenggara
                </label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="Misal: HIMA TI / Kemdikbud"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-hijauterang focus:border-hijauterang outline-none transition"
                />
              </div>

              {/* Avail Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Batas Waktu (Avail Date)
                </label>
                <input
                  type="date"
                  value={availDate}
                  onChange={(e) => setAvailDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-hijauterang focus:border-hijauterang outline-none transition"
                />
              </div>

              {/* Upload Poster/Cover */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Poster / Cover
                </label>
                <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-dashed border-gray-400 bg-gray-50 text-gray-500 hover:bg-gray-100 cursor-pointer transition">
                  <FontAwesomeIcon icon={faImage} />
                  <span className="text-sm">
                    {coverPreview ? "Ganti gambar..." : "Pilih gambar dari komputer..."}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                </label>

                {/* Preview Cover */}
                {coverPreview && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 h-40">
                    <img
                      src={coverPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Konten Postingan
              </label>
              <RichTextEditor onChange={setContent} />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-hijauhunter hover:bg-hijaugelap text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-colors flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSave} /> Publish Postingan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
