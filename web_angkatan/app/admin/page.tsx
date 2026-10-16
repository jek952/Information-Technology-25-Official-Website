/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSave,
  faImage,
  faChevronUp,
  faX,
  faBars,
  faNewspaper,
  faChevronDown,
  faGridVertical,
  faPeopleLine,
} from "@fortawesome/free-solid-svg-icons";

// Dynamic import agar tidak error SSR
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 rounded-xl min-h-80 flex items-center justify-center text-gray-400">
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menus = [
    {
      nama: "Dashboard",
      icon: faGridVertical,
    },
    {
      nama: "Warga 25",
      icon: faPeopleLine,
      submenu: ["Tambah Warga", "Update Warga"],
    },
    {
      nama: "Information Hub",
      icon: faNewspaper,
      submenu: ["Tambah Informasi", "Update Informasi"],
    },
  ];
  const [createWarga, setCreatewarga] = useState({
    nama: "",
    foto: "",
    kelas: "",
    email: "",
    github: "",
    instagram: "",
    linkedin: "",
    role: "anggota",
  });
  const [foto, SetFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setCreatewarga({
      ...createWarga,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    setPesan("");
    try {
      if (!foto) {
        throw new Error("plih foto terlebih dulu");
      }

      const uploadData = new FormData();
      uploadData.append("file", foto);
      uploadData.append("folder", "warga");

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const uploadText = await uploadResponse.text();

      console.log("Status:", uploadResponse.status);

      console.log("Response:", uploadText);

      if (!uploadResponse.ok) {
        throw new Error(`Upload gagal: ${uploadText}`);
      }

      const uploadResult = JSON.parse(uploadText);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload gagal.");
      }

      const fotoUrl = uploadResult.url;

      const response = await fetch("/api/warga", {
        method: "POST",
        headers: {
          "Content-Type": "applocation/json",
        },
        body: JSON.stringify({
          ...createWarga,
          foto: fotoUrl,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(uploadResult.error || "gagal menambahkan data warga");
      }
      setCreatewarga({
        nama: "",
        foto: "",
        kelas: "",
        email: "",
        github: "",
        instagram: "",
        linkedin: "",
        role: "anggota",
      });
      SetFoto(null);

      const inputfoto = document.getElementById(
        "foto",
      ) as HTMLInputElement | null;

      if (inputfoto) {
        inputfoto.value = "";
      }
      toast.success("Data warga berhasil ditambahkan!", {
        description: "Data warga sudah berhasil disimpan.",
      });
    } catch (error) {
      toast.error("Gagal menambahkan data warga", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan yang tidak diketahui.",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = coverPreview || "/BG-IT.jpeg";

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("folder", "information");
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        }).then((r) => r.json());

        if (uploadRes.success) {
          imageUrl = uploadRes.url;
        }
      }

      const res = await fetch("/api/information", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          organizer,
          avail_date: availDate,
          image: imageUrl,
          excerpt: content.replace(/<[^>]+>/g, "").slice(0, 150) || title,
          content,
        }),
      }).then((r) => r.json());

      if (res.success) {
        alert("Postingan berhasil disimpan ke database!");
        setTitle("");
        setOrganizer("");
        setAvailDate("");
        setContent("");
        setCoverPreview(null);
        setSelectedFile(null);
      } else {
        alert("Gagal menyimpan: " + (res.error || "Terjadi kesalahan."));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-hijaugelap text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex h-16 shrink-0  items-center justify-between border-b border-white/10 px-5">
          <h1>Halaman Admin 25</h1>
          <button onClick={() => setSidebarOpen(false)} className=" md:hidden">
            <FontAwesomeIcon
              icon={faX}
              className="text-xs cursor cursor-pointer"
            />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menus.map((menu) => {
            const isOpen = openMenu === menu.nama;
            return (
              <div key={menu.nama}>
                <button
                  onClick={() => {
                    if (menu.nama === "Dashboard") {
                      setActive("Dashboard");
                      setOpenMenu(null);
                      setSidebarOpen(false);
                    } else {
                      setOpenMenu(isOpen ? null : menu.nama);
                    }
                  }}
                  className={`flex w-full items-center cursor-pointer  justify-between rounded-xl px-4 py-3 transition-colors ${
                    active === menu.nama || isOpen
                      ? "bg-hijauterang text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <FontAwesomeIcon icon={menu.icon} className="w-5" />

                    <span className="font-medium">{menu.nama}</span>
                  </span>

                  {menu.submenu && (
                    <FontAwesomeIcon
                      icon={isOpen ? faChevronDown : faChevronUp}
                      className="text-xs"
                    />
                  )}
                </button>

                {isOpen && menu.submenu && (
                  <div className="ml-5 mt-2 space-y-1 border-l border-white/20 pl-4">
                    {menu.submenu?.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setActive(sub);
                          setSidebarOpen(false);
                        }}
                        className={`block cursor-pointer w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          active === sub
                            ? "bg-white/15 text-white"
                            : "text-white/65 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span>{sub}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
      {active === "Dashboard" && (
        <div className="fixed inset-y-0 left-0 right-0 md:left-64 flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-hijaugelap">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 px-2 mt-1">
            Kelola postingan Information Hub Dan Data Warga IT 25
          </p>
        </div>
      )}
      <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-10 font-sans">
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-30 cursor-pointer rounded-lg bg-hijaugelap p-3.5 text-white  md:hidden"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="relative inset-y-0 left-0 right-0 md:left-32 flex flex-col items-center justify-center ">
          {active === "Tambah Warga" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                <FontAwesomeIcon icon={faPlus} className="text-hijauterang" />
                <h2 className="text-2xl font-bold">
                  Tambah Data Warga 25
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="nama"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Nama
                    </label>

                    <input
                      id="nama"
                      name="nama"
                      type="text"
                      value={createWarga.nama}
                      onChange={handleChange}
                      placeholder="Masukkan nama"
                      required
                      minLength={2}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-hijauterang focus:border-hijauterang outline-none transition"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="kelas"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Kelas
                    </label>

                    <select
                      id="kelas"
                      name="kelas"
                      value={createWarga.kelas}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border appearance-none border-gray-300 focus:ring-2 focus:ring-hijauterang focus:border-hijauterang outline-none transition"
                    >
                      <option value="">Pilih kelas</option>
                      <option value="IT-49-01">IT-49-01</option>
                      <option value="IT-49-02">IT-49-02</option>
                      <option value="IT-49-03">IT-49-03</option>
                      <option value="IT-49-03">IT-49-04</option>
                      <option value="IT-49-03">IT-49-05</option>
                      <option value="IT-49-03">IT-49-INT</option>
                    </select>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="pointer-events-none absolute text-xs right-4 top-[47px] text-gray-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={createWarga.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-hijauterang focus:border-hijauterang outline-none transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="github"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      GitHub
                    </label>

                    <input
                      id="github"
                      name="github"
                      type="text"
                      value={createWarga.github}
                      onChange={handleChange}
                      placeholder="Link GitHub"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-hijauterang focus:border-hijauterang outline-none transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="instagram"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Instagram
                    </label>

                    <input
                      id="instagram"
                      name="instagram"
                      type="text"
                      value={createWarga.instagram}
                      onChange={handleChange}
                      placeholder="Link Instagram"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-hijauterang focus:border-hijauterang outline-none transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="linkedin"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      LinkedIn
                    </label>
                    <input
                      id="linkedin"
                      name="linkedin"
                      type="text"
                      value={createWarga.linkedin}
                      onChange={handleChange}
                      placeholder="Link LinkedIn"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-hijauterang focus:border-hijauterang outline-none transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="foto"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Foto
                    </label>

                    <input
                      id="foto"
                      name="foto"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => SetFoto(e.target.files?.[0] ?? null)}
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-green-50 file:px-4 file:py-2 file:font-semibold file:text-hijauhunter hover:file:bg-green-100"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      Format JPG, PNG. Maksimal 1 MB.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-hijauhunter cursor-pointer hover:bg-hijaugelap text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-colors flex items-center gap-2"
                  >
                    {loading ? "Menyimpan..." : "Submit"}
                  </button>
                </div>

                {pesan && (
                  <div role="status" className="rounded-xl p-4 text-sm">
                    {pesan}
                  </div>
                )}
              </form>
            </div>
          )}
          {active === "Tambah Informasi" && (
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
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori Tipe
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border appearance-none border-gray-300 focus:ring-2 focus:ring-hijauterang focus:border-hijauterang outline-none transition"
                    >
                      <option value="Event Angkatan">Event Angkatan</option>
                      <option value="Event Kampus">Event Kampus</option>
                      <option value="Beasiswa">Beasiswa</option>
                      <option value="Perlombaan">Perlombaan</option>
                    </select>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="pointer-events-none absolute text-xs right-4 top-[47px] text-gray-500"
                    />
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
                        {coverPreview
                          ? "Ganti gambar..."
                          : "Pilih gambar dari komputer..."}
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
          )}
        </div>
      </div>
    </>
  );
}
