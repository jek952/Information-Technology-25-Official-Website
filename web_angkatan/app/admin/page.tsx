/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import ImageCropperModal from "@/components/ImageCropperModal";
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
  faRightFromBracket,
  faUsers,
  faImages,
  faPenToSquare,
  faUserPlus,
  faArrowUpRightFromSquare,
  faTrash,
  faUser,
  faUserTie,
  faCrown,
  faMagnifyingGlass,
  faCamera,
  faCheck,
  faXmark,
  faGlobe,
  faEnvelope,
  faArrowRotateRight,
  faCalendarDays,
  faBuilding,
  faFilter,
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

  const [stats, setStats] = useState({
    totalWarga: 0,
    totalInfo: 0,
    totalGaleri: 0,
    classCount: {} as Record<string, number>,
    recentWarga: [] as any[],
    recentInfo: [] as any[],
  });
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchDashboardData = async () => {
    setStatsLoading(true);
    try {
      const [wargaRes, infoRes, galeriRes] = await Promise.all([
        fetch("/api/warga").then((r) => r.json()),
        fetch("/api/information").then((r) => r.json()),
        fetch("/api/galeri").then((r) => r.json()),
      ]);

      const wargaList: any[] = wargaRes.success && Array.isArray(wargaRes.data) ? wargaRes.data : [];
      const infoList: any[] = infoRes.success && Array.isArray(infoRes.data) ? infoRes.data : [];
      const galeriList: any[] = galeriRes.success && Array.isArray(galeriRes.data) ? galeriRes.data : [];

      const counts: Record<string, number> = {};
      wargaList.forEach((w) => {
        const k = w.kelas || "Lainnya";
        counts[k] = (counts[k] || 0) + 1;
      });

      const sortedWarga = [...wargaList].sort((a, b) => {
        const da = new Date(a.updated_at || a.created_at || 0).getTime();
        const db = new Date(b.updated_at || b.created_at || 0).getTime();
        return db - da;
      });

      const sortedInfo = [...infoList].sort((a, b) => {
        const da = new Date(a.created_at || 0).getTime();
        const db = new Date(b.created_at || 0).getTime();
        return db - da;
      });

      setStats({
        totalWarga: wargaList.length,
        totalInfo: infoList.length,
        totalGaleri: galeriList.length,
        classCount: counts,
        recentWarga: sortedWarga.slice(0, 5),
        recentInfo: sortedInfo.slice(0, 4),
      });
    } catch (err) {
      console.error("Gagal memuat ringkasan dashboard:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const [wargaList, setWargaList] = useState<any[]>([]);
  const [wargaLoading, setWargaLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [wargaSearch, setWargaSearch] = useState("");
  const [classMeta, setClassMeta] = useState<Record<string, any>>({});
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [isWargaModalOpen, setIsWargaModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("edit");
  const [modalSaving, setModalSaving] = useState(false);
  const [modalForm, setModalForm] = useState({
    id: "",
    nama: "",
    kelas: "IT-49-01",
    role: "anggota",
    email: "",
    github: "",
    instagram: "",
    linkedin: "",
    foto: "",
  });
  const [modalPhotoFile, setModalPhotoFile] = useState<File | null>(null);
  const [modalPhotoPreview, setModalPhotoPreview] = useState<string | null>(null);

  // Cropper State
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropperRawSrc, setCropperRawSrc] = useState<string | null>(null);
  const [cropperShape, setCropperShape] = useState<"round" | "rect">("round");
  const [cropperAspect, setCropperAspect] = useState<number>(1);
  const [cropperTitle, setCropperTitle] = useState<string>("Sesuaikan Foto");
  const [cropperSubtitle, setCropperSubtitle] = useState<string>("");
  const [cropTarget, setCropTarget] = useState<"modalWarga" | "tambahWarga" | "banner" | "editInfoCover" | "tambahInfoCover" | "galeriFoto">("modalWarga");
  const [tambahWargaPreview, setTambahWargaPreview] = useState<string | null>(null);

  // Admin Galeri State
  const [adminGaleriList, setAdminGaleriList] = useState<any[]>([]);
  const [adminGaleriLoading, setAdminGaleriLoading] = useState(false);
  const [selectedGaleriCategory, setSelectedGaleriCategory] = useState<string | null>(null);
  const [galeriUploadKategori, setGaleriUploadKategori] = useState<"proximiti" | "megabit" | "ultras">("proximiti");
  const [galeriUploadCaption, setGaleriUploadCaption] = useState("");
  const [galeriUploadFile, setGaleriUploadFile] = useState<File | null>(null);
  const [galeriUploadPreview, setGaleriUploadPreview] = useState<string | null>(null);
  const [galeriUploading, setGaleriUploading] = useState(false);

  const fetchAdminGaleri = async () => {
    setAdminGaleriLoading(true);
    try {
      const res = await fetch("/api/galeri");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAdminGaleriList(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat galeri:", err);
    } finally {
      setAdminGaleriLoading(false);
    }
  };

  useEffect(() => {
    if (active === "Kelola Galeri") {
      fetchAdminGaleri();
    }
  }, [active]);

  const handleDeleteGaleri = async (id: string) => {
    if (!confirm("Yakin ingin menghapus foto ini dari galeri?")) return;
    try {
      const res = await fetch(`/api/galeri?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus foto.");
      }
      toast.success("Foto berhasil dihapus dari galeri.");
      setAdminGaleriList((prev) => prev.filter((p) => p.id !== id));
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus foto.");
    }
  };

  const handleUploadGaleri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galeriUploadFile) {
      toast.error("Silakan pilih dan sesuaikan foto terlebih dahulu.");
      return;
    }

    setGaleriUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", galeriUploadFile);
      fd.append("folder", `galeri/${galeriUploadKategori}`);
      const upRes = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const upJson = await upRes.json();
      if (!upRes.ok || !upJson.url) {
        throw new Error(upJson.error || "Gagal mengunggah foto ke Cloudinary.");
      }

      const res = await fetch("/api/galeri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kategori: galeriUploadKategori,
          caption: galeriUploadCaption || undefined,
          src: upJson.url,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan data foto ke database.");
      }

      toast.success("Foto berhasil ditambahkan ke galeri!");
      setGaleriUploadFile(null);
      setGaleriUploadPreview(null);
      setGaleriUploadCaption("");
      fetchDashboardData();
      setActive("Kelola Galeri");
      setSelectedGaleriCategory(galeriUploadKategori);
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setGaleriUploading(false);
    }
  };

  // Update Informasi State
  const [infoList, setInfoList] = useState<any[]>([]);
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoSearch, setInfoSearch] = useState("");
  const [selectedInfoCategory, setSelectedInfoCategory] = useState<string | null>(null);
  const [infoModalMode, setInfoModalMode] = useState<"add" | "edit">("edit");

  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [editInfoForm, setEditInfoForm] = useState({
    id: "",
    title: "",
    type: "Event Angkatan",
    organizer: "",
    avail_date: "",
    image: "",
    content: "",
  });
  const [editInfoCoverFile, setEditInfoCoverFile] = useState<File | null>(null);
  const [editInfoCoverPreview, setEditInfoCoverPreview] = useState<string | null>(null);
  const [savingInfo, setSavingInfo] = useState(false);

  const fetchAllInfo = async () => {
    setInfoLoading(true);
    try {
      const res = await fetch("/api/information");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInfoList(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat list informasi:", err);
    } finally {
      setInfoLoading(false);
    }
  };

  useEffect(() => {
    if (active === "Update Informasi") {
      fetchAllInfo();
    }
  }, [active]);

  const openAddInfoModal = (defaultCategory?: string) => {
    setInfoModalMode("add");
    setEditInfoForm({
      id: "",
      title: "",
      type: defaultCategory || selectedInfoCategory || "Event Angkatan",
      organizer: "",
      avail_date: "",
      image: "",
      content: "",
    });
    setEditInfoCoverFile(null);
    setEditInfoCoverPreview(null);
    setIsEditInfoModalOpen(true);
  };

  const openEditInfoModal = (item: any) => {
    setInfoModalMode("edit");
    setEditInfoForm({
      id: item.id || "",
      title: item.title || "",
      type: item.type || "Event Angkatan",
      organizer: item.organizer || "",
      avail_date: item.avail_date || item.availDate || "",
      image: item.image || "",
      content: item.content || "",
    });
    setEditInfoCoverFile(null);
    setEditInfoCoverPreview(item.image || null);
    setIsEditInfoModalOpen(true);
  };

  const handleSaveInfoModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInfoForm.title.trim()) {
      toast.error("Judul postingan wajib diisi.");
      return;
    }
    if (!editInfoForm.content.trim()) {
      toast.error("Konten informasi wajib diisi.");
      return;
    }

    setSavingInfo(true);
    try {
      let finalImageUrl = editInfoForm.image || "/BG-IT.jpeg";
      if (editInfoCoverFile) {
        const fd = new FormData();
        fd.append("file", editInfoCoverFile);
        fd.append("folder", "information");
        const upRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        const upJson = await upRes.json();
        if (!upRes.ok || !upJson.url) {
          throw new Error(upJson.error || "Gagal mengunggah cover poster.");
        }
        finalImageUrl = upJson.url;
      }

      const cleanExcerpt =
        editInfoForm.content.replace(/<[^>]+>/g, "").slice(0, 150) || editInfoForm.title;

      const payload = {
        title: editInfoForm.title,
        type: editInfoForm.type,
        organizer: editInfoForm.organizer || "Pengurus IT 25",
        avail_date: editInfoForm.avail_date,
        image: finalImageUrl,
        excerpt: cleanExcerpt,
        content: editInfoForm.content,
      };

      const res = await fetch("/api/information", {
        method: infoModalMode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          infoModalMode === "add" ? payload : { id: editInfoForm.id, ...payload }
        ),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan informasi.");
      }

      toast.success(
        infoModalMode === "add"
          ? "Postingan baru berhasil ditambahkan."
          : "Informasi berhasil diperbarui."
      );
      setIsEditInfoModalOpen(false);
      fetchAllInfo();
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleDeleteInfo = async (id: string, itemTitle: string) => {
    if (!confirm(`Yakin ingin menghapus postingan "${itemTitle}"?`)) return;
    try {
      const res = await fetch(`/api/information?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus informasi.");
      }
      toast.success(`Postingan "${itemTitle}" berhasil dihapus.`);
      setInfoList((prev) => prev.filter((item) => item.id !== id));
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus informasi.");
    }
  };

  const handleCroppedImage = async (croppedFile: File, previewUrl: string) => {
    setIsCropperOpen(false);
    setCropperRawSrc(null);

    if (cropTarget === "modalWarga") {
      setModalPhotoFile(croppedFile);
      setModalPhotoPreview(previewUrl);
    } else if (cropTarget === "tambahWarga") {
      SetFoto(croppedFile);
      setTambahWargaPreview(previewUrl);
    } else if (cropTarget === "banner") {
      await uploadBannerFile(croppedFile);
    } else if (cropTarget === "editInfoCover") {
      setEditInfoCoverFile(croppedFile);
      setEditInfoCoverPreview(previewUrl);
    } else if (cropTarget === "tambahInfoCover") {
      setSelectedFile(croppedFile);
      setCoverPreview(previewUrl);
    } else if (cropTarget === "galeriFoto") {
      setGaleriUploadFile(croppedFile);
      setGaleriUploadPreview(previewUrl);
    }
  };

  const fetchAllWarga = async () => {
    setWargaLoading(true);
    try {
      const res = await fetch("/api/warga");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setWargaList(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat list warga:", err);
    } finally {
      setWargaLoading(false);
    }
  };

  const fetchClassMeta = async () => {
    try {
      const res = await fetch("/api/kelas");
      const json = await res.json();
      if (json.success && json.data) {
        setClassMeta(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat metadata kelas:", err);
    }
  };

  useEffect(() => {
    if (active === "Update Warga") {
      fetchAllWarga();
      fetchClassMeta();
    }
  }, [active]);

  const openAddModal = (role: string = "anggota", defaultKelas?: string) => {
    setModalMode("add");
    setModalForm({
      id: "",
      nama: "",
      kelas: defaultKelas || selectedClass || "IT-49-01",
      role: role || "anggota",
      email: "",
      github: "",
      instagram: "",
      linkedin: "",
      foto: "",
    });
    setModalPhotoFile(null);
    setModalPhotoPreview(null);
    setIsWargaModalOpen(true);
  };

  const openEditModal = (w: any) => {
    setModalMode("edit");
    setModalForm({
      id: w.id || "",
      nama: w.nama || "",
      kelas: w.kelas || selectedClass || "IT-49-01",
      role: w.role || "anggota",
      email: w.email || "",
      github: w.github || "",
      instagram: w.instagram || "",
      linkedin: w.linkedin || "",
      foto: w.foto || "",
    });
    setModalPhotoFile(null);
    setModalPhotoPreview(w.foto || null);
    setIsWargaModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm.nama.trim()) {
      toast.error("Nama wajib diisi.");
      return;
    }

    if (modalMode === "add" && !modalPhotoFile && !modalForm.foto) {
      toast.error("Foto warga wajib dipilih.");
      return;
    }

    setModalSaving(true);
    try {
      let finalFoto = modalForm.foto;
      if (modalPhotoFile) {
        const upData = new FormData();
        upData.append("file", modalPhotoFile);
        upData.append("folder", "warga");
        const upRes = await fetch("/api/upload", {
          method: "POST",
          body: upData,
        });
        const upJson = await upRes.json();
        if (!upRes.ok || !upJson.url) {
          throw new Error(upJson.error || "Gagal mengunggah foto.");
        }
        finalFoto = upJson.url;
      }

      const payload = {
        ...modalForm,
        foto: finalFoto,
      };

      if (modalMode === "add") {
        const res = await fetch("/api/warga", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Gagal menambahkan data.");
        }
        toast.success("Data berhasil ditambahkan.");
      } else {
        const res = await fetch("/api/warga", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Gagal memperbarui data.");
        }
        toast.success("Data berhasil diperbarui.");
      }

      setIsWargaModalOpen(false);
      fetchAllWarga();
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setModalSaving(false);
    }
  };

  const handleDeleteWarga = async (id: string, nama: string) => {
    if (!confirm(`Yakin ingin menghapus ${nama}?`)) return;
    try {
      const res = await fetch(`/api/warga?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus.");
      }
      toast.success(`Data ${nama} berhasil dihapus.`);
      setWargaList((prev) => prev.filter((w) => w.id !== id));
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus.");
    }
  };

  const uploadBannerFile = async (file: File) => {
    if (!selectedClass) return;
    const currentClass = selectedClass;
    setUploadingBanner(true);
    try {
      const upData = new FormData();
      upData.append("file", file);
      upData.append("folder", "kelas");
      const upRes = await fetch("/api/upload", {
        method: "POST",
        body: upData,
      });
      const upJson = await upRes.json();
      if (!upRes.ok || !upJson.url) {
        throw new Error(upJson.error || "Gagal mengunggah banner.");
      }

      const res = await fetch("/api/kelas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kelas: currentClass,
          banner: upJson.url,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan banner kelas.");
      }

      setClassMeta((prev) => ({
        ...prev,
        [currentClass]: {
          ...(prev[currentClass] || {}),
          banner: upJson.url,
        },
      }));
      toast.success(`Banner header kelas ${currentClass} berhasil diperbarui.`);
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah banner.");
    } finally {
      setUploadingBanner(false);
    }
  };

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
    {
      nama: "Galeri Foto",
      icon: faImages,
      submenu: ["Kelola Galeri", "Upload Foto Galeri"],
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
          "Content-Type": "application/json",
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
    setCropperRawSrc(URL.createObjectURL(file));
    setCropperShape("rect");
    setCropperAspect(16 / 9);
    setCropperTitle("Sesuaikan Cover Poster Informasi");
    setCropperSubtitle("Geser dan atur area lanskap poster informasi (16:9).");
    setCropTarget("tambahInfoCover");
    setIsCropperOpen(true);
    e.target.value = "";
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
        toast.success("Postingan berhasil disimpan ke database!");
        setTitle("");
        setOrganizer("");
        setAvailDate("");
        setContent("");
        setCoverPreview(null);
        setSelectedFile(null);
        fetchDashboardData();
      } else {
        toast.error("Gagal menyimpan: " + (res.error || "Terjadi kesalahan."));
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
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

        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-colors cursor-pointer text-sm font-medium"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
      <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 md:p-10 font-sans md:ml-64">
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-30 cursor-pointer rounded-lg bg-hijaugelap p-3 text-white md:hidden shadow-md"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className="w-full flex flex-col items-center justify-center">
          {active === "Dashboard" && (
            <div className="w-full max-w-5xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-xs text-gray-500 mt-1">Pusat kendali data dan informasi angkatan IT 25</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-hijauhunter hover:bg-hijaugelap text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
                  >
                    <span>Lihat Web</span>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[11px]" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Warga</span>
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-hijauhunter flex items-center justify-center">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mt-3">{stats.totalWarga}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                    {Object.entries(stats.classCount).map(([kelas, count]) => (
                      <span key={kelas} className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                        {kelas}: {count}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Information Hub</span>
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-hijauhunter flex items-center justify-center">
                      <FontAwesomeIcon icon={faNewspaper} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mt-3">{stats.totalInfo}</p>
                  <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                    Pengumuman dan event aktif
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Foto Galeri</span>
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-hijauhunter flex items-center justify-center">
                      <FontAwesomeIcon icon={faImages} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mt-3">{stats.totalGaleri}</p>
                  <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                    Dokumentasi kegiatan angkatan
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setActive("Tambah Informasi")}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-hijauhunter hover:bg-gray-50/70 transition text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-hijauhunter flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Tulis Informasi Baru</p>
                      <p className="text-xs text-gray-500">Buat artikel berita, agenda, atau event angkatan</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActive("Tambah Warga")}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-hijauhunter hover:bg-gray-50/70 transition text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-hijauhunter flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faUserPlus} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Tambah Warga Manual</p>
                      <p className="text-xs text-gray-500">Input data anggota kelas satu per satu</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-900">Warga Terdaftar Terbaru</h2>
                    <span className="text-xs text-gray-400">{stats.recentWarga.length} orang terakhir</span>
                  </div>
                  {stats.recentWarga.length === 0 ? (
                    <p className="text-xs text-gray-400 py-6 text-center">Belum ada data warga.</p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {stats.recentWarga.map((w) => (
                        <div key={w.id || w.email || w.nama} className="py-2.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={w.foto || "/logo-proximiti.png"}
                              alt={w.nama}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-gray-900 truncate">{w.nama}</p>
                              <p className="text-[11px] text-gray-400 truncate">{w.email || "Tanpa email"}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-medium px-2 py-0.5 bg-gray-100 text-gray-700 rounded shrink-0">
                            {w.kelas}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-900">Informasi Terakhir</h2>
                    <span className="text-xs text-gray-400">{stats.recentInfo.length} postingan</span>
                  </div>
                  {stats.recentInfo.length === 0 ? (
                    <p className="text-xs text-gray-400 py-6 text-center">Belum ada postingan informasi.</p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {stats.recentInfo.map((info) => (
                        <div key={info.id || info.title} className="py-2.5 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">{info.title}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 truncate">{info.organizer || "Pengurus IT 25"}</p>
                          </div>
                          <span className="text-[11px] px-2 py-0.5 bg-emerald-50 text-hijauhunter rounded font-medium shrink-0">
                            {info.type || "Event"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {active === "Update Warga" && (() => {
            const defaultClasses = ["IT-49-01", "IT-49-02", "IT-49-03", "IT-49-04", "IT-49-05", "IT-49-INT"];
            const classList = Array.from(
              new Set([...defaultClasses, ...wargaList.map((w) => w.kelas).filter(Boolean)])
            ).sort();

            const currentBanner =
              (selectedClass && classMeta[selectedClass]?.banner) ||
              "https://res.cloudinary.com/hvnrszvj/image/upload/v1791307752/proximiti-2026/galeri/proximiti/f1b4kso4lakrmnkykk5h.jpg";

            const waldos = selectedClass ? wargaList.find((w) => w.kelas === selectedClass && w.role === "waldos") : null;
            const ketua = selectedClass ? wargaList.find((w) => w.kelas === selectedClass && w.role === "ketua_kelas") : null;
            const members = selectedClass
              ? wargaList
                  .filter((w) => w.kelas === selectedClass && (w.role === "anggota" || !w.role))
                  .filter(
                    (w) =>
                      !wargaSearch ||
                      w.nama.toLowerCase().includes(wargaSearch.toLowerCase()) ||
                      (w.email && w.email.toLowerCase().includes(wargaSearch.toLowerCase()))
                  )
              : [];

            return (
              <div className="w-full max-w-5xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Data Warga</h1>
                    <p className="text-xs text-gray-500 mt-1">
                      Data dikelompokkan per kelas dengan pengaturan header (Waldos, Ketua Kelas, Banner) dan data anggota.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        fetchAllWarga();
                        fetchClassMeta();
                      }}
                      disabled={wargaLoading}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl border border-gray-300 transition cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faArrowRotateRight} className={wargaLoading ? "animate-spin" : ""} />
                      <span>Muat Ulang</span>
                    </button>
                    <button
                      onClick={() => openAddModal("anggota", selectedClass || undefined)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-hijauhunter hover:bg-hijaugelap text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Tambah Warga</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
                    Pilih Kelas
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {classList.map((c) => {
                      const count = wargaList.filter((w) => w.kelas === c).length;
                      const isSelected = selectedClass === c;
                      return (
                        <button
                          key={c}
                          onClick={() => setSelectedClass(selectedClass === c ? null : c)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? "bg-hijauhunter text-white shadow-sm"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          <span>{c}</span>
                          <span
                            className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                              isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!selectedClass ? (
                  <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-3 text-sm">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">Pilih salah satu kelas di atas</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Klik salah satu tombol kelas untuk melihat banner header, dosen wali, ketua kelas, dan daftar mahasiswa.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        Header Kelas {selectedClass}
                      </h2>
                      <p className="text-xs text-gray-500">
                        Pengaturan banner kelas dan pimpinan (Dosen Wali & Ketua Kelas)
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">Foto Banner Header Kelas</span>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg border border-gray-300 transition cursor-pointer">
                        <FontAwesomeIcon icon={faCamera} className="text-xs" />
                        <span>{uploadingBanner ? "Mengunggah..." : "Ganti Banner"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingBanner}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setCropperRawSrc(URL.createObjectURL(file));
                              setCropperShape("rect");
                              setCropperAspect(16 / 7);
                              setCropperTitle(`Sesuaikan Banner Header ${selectedClass}`);
                              setCropperSubtitle("Geser dan atur area lanskap banner kelas.");
                              setCropTarget("banner");
                              setIsCropperOpen(true);
                              e.target.value = "";
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="relative h-44 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-900">
                      <img
                        src={currentBanner}
                        alt={`Banner ${selectedClass}`}
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-3xl font-extrabold text-white tracking-wider">
                          {selectedClass}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-hijauhunter flex items-center justify-center text-xs">
                            <FontAwesomeIcon icon={faUserTie} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-900 block">Dosen Wali (Waldos)</span>
                            <span className="text-[11px] text-gray-500">{selectedClass}</span>
                          </div>
                        </div>
                        {waldos && (
                          <button
                            onClick={() => openEditModal(waldos)}
                            className="text-xs font-semibold text-hijauhunter hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                        )}
                      </div>

                      {waldos ? (
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-200/60">
                          <img
                            src={waldos.foto || "/logo-proximiti.png"}
                            alt={waldos.nama}
                            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{waldos.nama}</p>
                            <p className="text-xs text-gray-500 truncate">{waldos.email || "Belum ada email"}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 text-center border-t border-dashed border-gray-200">
                          <p className="text-xs text-gray-400 mb-2">Belum ada Dosen Wali</p>
                          <button
                            onClick={() => openAddModal("waldos", selectedClass)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-hijauhunter hover:bg-emerald-100 font-semibold transition cursor-pointer"
                          >
                            + Tetapkan Dosen Wali
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs">
                            <FontAwesomeIcon icon={faCrown} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-900 block">Ketua Kelas</span>
                            <span className="text-[11px] text-gray-500">{selectedClass}</span>
                          </div>
                        </div>
                        {ketua && (
                          <button
                            onClick={() => openEditModal(ketua)}
                            className="text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                        )}
                      </div>

                      {ketua ? (
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-200/60">
                          <img
                            src={ketua.foto || "/logo-proximiti.png"}
                            alt={ketua.nama}
                            className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{ketua.nama}</p>
                            <p className="text-xs text-gray-500 truncate">{ketua.email || "Belum ada email"}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 text-center border-t border-dashed border-gray-200">
                          <p className="text-xs text-gray-400 mb-2">Belum ada Ketua Kelas</p>
                          <button
                            onClick={() => openAddModal("ketua_kelas", selectedClass)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold transition cursor-pointer"
                          >
                            + Tetapkan Ketua Kelas
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        Data Anggota Mahasiswa {selectedClass}
                      </h2>
                      <p className="text-xs text-gray-500">
                        Daftar mahasiswa yang terdaftar di kelas ini ({members.length} orang)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faMagnifyingGlass}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                        />
                        <input
                          type="text"
                          value={wargaSearch}
                          onChange={(e) => setWargaSearch(e.target.value)}
                          placeholder="Cari nama atau email..."
                          className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter w-48 sm:w-60"
                        />
                      </div>
                      <button
                        onClick={() => openAddModal("anggota", selectedClass)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-hijauhunter hover:bg-hijaugelap text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                        <span>Tambah Anggota</span>
                      </button>
                    </div>
                  </div>

                  {wargaLoading ? (
                    <div className="py-12 text-center text-xs text-gray-400">
                      Memuat data warga...
                    </div>
                  ) : members.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-xl">
                      <p className="text-xs">
                        {wargaSearch
                          ? "Tidak ada anggota yang cocok dengan pencarian."
                          : `Belum ada anggota terdaftar untuk kelas ${selectedClass}.`}
                      </p>
                      <button
                        onClick={() => openAddModal("anggota", selectedClass)}
                        className="mt-3 text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition cursor-pointer"
                      >
                        + Tambah Mahasiswa Pertama
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-3">Mahasiswa</th>
                            <th className="py-3 px-3">Email</th>
                            <th className="py-3 px-3">Media Sosial</th>
                            <th className="py-3 px-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {members.map((w) => (
                            <tr key={w.id} className="hover:bg-gray-50/70 transition">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={w.foto || "/logo-proximiti.png"}
                                    alt={w.nama}
                                    className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                                  />
                                  <div>
                                    <p className="font-semibold text-gray-900">{w.nama}</p>
                                    <span className="text-[10px] text-gray-400 font-medium">
                                      {w.role === "anggota" || !w.role ? "Anggota" : w.role}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-gray-600">
                                {w.email || <span className="text-gray-300">—</span>}
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1.5">
                                  {w.instagram ? (
                                    <a
                                      href={w.instagram}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2 py-0.5 rounded bg-pink-50 text-pink-700 text-[10px] font-medium hover:underline"
                                    >
                                      IG
                                    </a>
                                  ) : null}
                                  {w.linkedin ? (
                                    <a
                                      href={w.linkedin}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium hover:underline"
                                    >
                                      LinkedIn
                                    </a>
                                  ) : null}
                                  {w.github ? (
                                    <a
                                      href={w.github}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-[10px] font-medium hover:underline"
                                    >
                                      GitHub
                                    </a>
                                  ) : null}
                                  {!w.instagram && !w.linkedin && !w.github && (
                                    <span className="text-gray-300 text-[11px]">—</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => openEditModal(w)}
                                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                                  >
                                    <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteWarga(w.id, w.nama)}
                                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                                  >
                                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                    <span>Hapus</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })()}

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
                      <option value="IT-49-04">IT-49-04</option>
                      <option value="IT-49-05">IT-49-05</option>
                      <option value="IT-49-INT">IT-49-INT</option>
                    </select>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="pointer-events-none absolute text-xs right-4 top-[47px] text-gray-500"
                    />
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="role"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Peran (Role)
                    </label>

                    {(() => {
                      const existingWaldos = wargaList.find(
                        (w) => w.kelas === createWarga.kelas && w.role === "waldos"
                      );
                      const existingKetua = wargaList.find(
                        (w) => w.kelas === createWarga.kelas && w.role === "ketua_kelas"
                      );
                      return (
                        <>
                          <select
                            id="role"
                            name="role"
                            value={createWarga.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border appearance-none border-gray-300 focus:ring-2 focus:ring-hijauterang focus:border-hijauterang outline-none transition"
                          >
                            <option value="anggota">Anggota</option>
                            <option value="ketua_kelas">
                              {existingKetua ? `Ketua Kelas (Gantikan ${existingKetua.nama})` : "Ketua Kelas"}
                            </option>
                            {existingWaldos ? (
                              <option value="waldos" disabled>
                                Dosen Wali (Sudah ada: {existingWaldos.nama})
                              </option>
                            ) : (
                              <option value="waldos">Dosen Wali (Waldos)</option>
                            )}
                          </select>
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className="pointer-events-none absolute text-xs right-4 top-[47px] text-gray-500"
                          />
                          {createWarga.role === "ketua_kelas" && existingKetua && (
                            <p className="mt-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                              Ketua kelas saat ini ({existingKetua.nama}) akan otomatis beralih menjadi Anggota.
                            </p>
                          )}
                        </>
                      );
                    })()}
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
                      Foto Profil
                    </label>

                    <input
                      id="foto"
                      name="foto"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCropperRawSrc(URL.createObjectURL(file));
                          setCropperShape("round");
                          setCropperAspect(1);
                          setCropperTitle("Sesuaikan Foto Profil Warga");
                          setCropperSubtitle("Geser dan sesuaikan agar wajah/badan berada tepat di dalam lingkaran.");
                          setCropTarget("tambahWarga");
                          setIsCropperOpen(true);
                          e.target.value = "";
                        }
                      }}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-green-50 file:px-4 file:py-2 file:font-semibold file:text-hijauhunter hover:file:bg-green-100"
                    />

                    {tambahWargaPreview && (
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          src={tambahWargaPreview}
                          alt="Preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/40"
                        />
                        <span className="text-xs text-gray-500">Foto profil siap disimpan (lingkaran WebP)</span>
                      </div>
                    )}

                    <p className="mt-2 text-xs text-gray-500">
                      Format JPG, PNG, atau WebP. Gambar otomatis disesuaikan dalam bentuk lingkaran profil.
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

          {active === "Update Informasi" && (() => {
            const categories = ["Event Angkatan", "Event Kampus", "Beasiswa", "Perlombaan"];

            const itemsInCategory = selectedInfoCategory
              ? infoList.filter((item) => item.type === selectedInfoCategory)
              : [];

            const filteredInfo = itemsInCategory.filter(
              (item) =>
                !infoSearch ||
                item.title?.toLowerCase().includes(infoSearch.toLowerCase()) ||
                item.organizer?.toLowerCase().includes(infoSearch.toLowerCase())
            );

            return (
              <div className="w-full max-w-5xl space-y-6">
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Informasi & Agenda</h1>
                    <p className="text-xs text-gray-500 mt-1">
                      Pilih kategori terlebih dahulu untuk melihat dan mengelola postingan.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchAllInfo}
                      disabled={infoLoading}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl border border-gray-300 transition cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faArrowRotateRight} className={infoLoading ? "animate-spin" : ""} />
                      <span>Muat Ulang</span>
                    </button>
                    <button
                      onClick={() => openAddInfoModal(selectedInfoCategory || undefined)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-hijauhunter hover:bg-hijaugelap text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Tulis Informasi Baru</span>
                    </button>
                  </div>
                </div>

                {/* Category Selector Tabs */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const count = infoList.filter((item) => item.type === cat).length;
                      const isSelected = selectedInfoCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedInfoCategory(isSelected ? null : cat)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? "bg-hijauhunter text-white shadow-sm ring-2 ring-hijauhunter/20"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          <span>{cat}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isSelected ? "bg-white/25 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aturan UI/UX: Sebelum dipilih gausa nampil isinya */}
                {!selectedInfoCategory ? (
                  <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-hijauhunter flex items-center justify-center mx-auto mb-3 text-lg">
                      <FontAwesomeIcon icon={faNewspaper} />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      Pilih kategori informasi di atas untuk melihat dan mengelola postingan.
                    </p>
                    <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                      Daftar postingan dikelompokkan per kategori (Event Angkatan, Event Kampus, Beasiswa, atau Perlombaan) agar pengelolaan rapi dan terfokus.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Subheader per category with search and add button */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h2 className="text-base font-bold text-gray-900">
                          Kategori: {selectedInfoCategory}
                        </h2>
                        <p className="text-xs text-gray-500">
                          Menampilkan {itemsInCategory.length} postingan yang terdaftar.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                          />
                          <input
                            type="text"
                            value={infoSearch}
                            onChange={(e) => setInfoSearch(e.target.value)}
                            placeholder="Cari judul atau penyelenggara..."
                            className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter w-48 sm:w-60"
                          />
                        </div>
                        <button
                          onClick={() => openAddInfoModal(selectedInfoCategory)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-hijauhunter hover:bg-hijaugelap text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faPlus} className="text-xs" />
                          <span>Tambah Post</span>
                        </button>
                      </div>
                    </div>

                    {/* Posts Cards */}
                    {infoLoading ? (
                      <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-xs text-gray-400">
                        Memuat daftar informasi...
                      </div>
                    ) : filteredInfo.length === 0 ? (
                      <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
                        <p className="text-xs font-semibold text-gray-700">
                          {infoSearch
                            ? "Tidak ada postingan yang sesuai dengan kata kunci pencarian."
                            : `Belum ada postingan yang dibuat untuk kategori ${selectedInfoCategory}.`}
                        </p>
                        <button
                          onClick={() => openAddInfoModal(selectedInfoCategory)}
                          className="mt-3 text-xs px-3.5 py-1.5 rounded-xl bg-hijauhunter hover:bg-hijaugelap text-white font-semibold transition cursor-pointer"
                        >
                          + Buat Postingan Pertama
                        </button>
                      </div>
                    ) : (
                      filteredInfo.map((item) => {
                        const isExpired = item.avail_date && new Date() > new Date(item.avail_date);
                        return (
                          <div
                            key={item.id}
                            className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-gray-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-4 min-w-0">
                              <img
                                src={item.image || "/BG-IT.jpeg"}
                                alt={item.title}
                                className="w-24 h-16 sm:w-32 sm:h-20 rounded-xl object-cover border border-gray-200 shrink-0 bg-gray-100"
                              />
                              <div className="min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-emerald-50 text-hijauhunter border-emerald-200">
                                    {item.type || selectedInfoCategory}
                                  </span>
                                  {item.avail_date && (
                                    <span
                                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                        isExpired
                                          ? "bg-gray-100 text-gray-600 border border-gray-200"
                                          : "bg-emerald-50 text-hijauhunter border border-emerald-200"
                                      }`}
                                    >
                                      {isExpired ? "Telah Berakhir" : "Aktif"}
                                    </span>
                                  )}
                                  {(item.avail_date || item.availDate) && (
                                    <span className="text-[11px] text-gray-500 flex items-center gap-1">
                                      <FontAwesomeIcon icon={faCalendarDays} className="text-[10px]" />
                                      <span>Batas: {item.avail_date || item.availDate}</span>
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                                  {item.title}
                                </h3>
                                <p className="text-xs text-gray-500 flex items-center gap-1.5 truncate">
                                  <FontAwesomeIcon icon={faBuilding} className="text-[10px] text-gray-400" />
                                  <span>{item.organizer || "Pengurus IT 25"}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <a
                                href={`/information/${item.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer flex items-center gap-1.5"
                              >
                                <span>Lihat</span>
                                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                              </a>
                              <button
                                onClick={() => openEditInfoModal(item)}
                                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer flex items-center gap-1.5"
                              >
                                <FontAwesomeIcon icon={faPenToSquare} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteInfo(item.id, item.title)}
                                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer flex items-center gap-1.5"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {active === "Kelola Galeri" && (() => {
            const galeriCategories = [
              { id: "proximiti", label: "Proximiti" },
              { id: "megabit", label: "Megabit" },
              { id: "ultras", label: "Ultras" },
            ];

            const photosInCat = selectedGaleriCategory
              ? adminGaleriList.filter(
                  (p) => p.kategori?.toLowerCase() === selectedGaleriCategory.toLowerCase()
                )
              : [];

            return (
              <div className="w-full max-w-5xl space-y-6">
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kelola Galeri Dokumentasi</h1>
                    <p className="text-xs text-gray-500 mt-1">
                      Pilih album kategori terlebih dahulu untuk mengelola foto dokumentasi IT 25.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchAdminGaleri}
                      disabled={adminGaleriLoading}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl border border-gray-300 transition cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faArrowRotateRight} className={adminGaleriLoading ? "animate-spin" : ""} />
                      <span>Muat Ulang</span>
                    </button>
                    <button
                      onClick={() => setActive("Upload Foto Galeri")}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-hijauhunter hover:bg-hijaugelap text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Upload Foto Baru</span>
                    </button>
                  </div>
                </div>

                {/* Album Category Tabs */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex flex-wrap gap-2">
                    {galeriCategories.map((cat) => {
                      const count = adminGaleriList.filter(
                        (p) => p.kategori?.toLowerCase() === cat.id
                      ).length;
                      const isSelected = selectedGaleriCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() =>
                            setSelectedGaleriCategory(isSelected ? null : cat.id)
                          }
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? "bg-hijauhunter text-white shadow-sm ring-2 ring-hijauhunter/20"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          <span>Album {cat.label}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isSelected
                                ? "bg-white/25 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aturan UI/UX: Sebelum dipilih gausa nampil isinya */}
                {!selectedGaleriCategory ? (
                  <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-hijauhunter flex items-center justify-center mx-auto mb-3 text-lg">
                      <FontAwesomeIcon icon={faImages} />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      Pilih album di atas untuk melihat dan mengelola foto galeri.
                    </p>
                    <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                      Dokumentasi dipisahkan berdasarkan album (Proximiti, Megabit, atau Ultras) agar pengelolaan foto tertata rapi.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold text-gray-900 capitalize">
                          Album: {selectedGaleriCategory}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {photosInCat.length} foto tersimpan dalam album ini.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setGaleriUploadKategori(selectedGaleriCategory as any);
                          setActive("Upload Foto Galeri");
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-hijauhunter hover:bg-hijaugelap text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                        <span>Upload ke Album Ini</span>
                      </button>
                    </div>

                    {adminGaleriLoading ? (
                      <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-xs text-gray-400">
                        Memuat foto galeri...
                      </div>
                    ) : photosInCat.length === 0 ? (
                      <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
                        <p className="text-xs font-semibold text-gray-700">
                          Belum ada foto dalam album {selectedGaleriCategory}.
                        </p>
                        <button
                          onClick={() => {
                            setGaleriUploadKategori(selectedGaleriCategory as any);
                            setActive("Upload Foto Galeri");
                          }}
                          className="mt-3 text-xs px-3.5 py-1.5 rounded-xl bg-hijauhunter text-white font-semibold transition cursor-pointer"
                        >
                          + Upload Foto Pertama
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photosInCat.map((photo) => (
                          <div
                            key={photo.id}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
                          >
                            <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                              <img
                                src={photo.src}
                                alt={photo.caption || "Foto galeri"}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold uppercase backdrop-blur-xs">
                                {photo.kategori}
                              </span>
                            </div>

                            <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                              {photo.caption ? (
                                <p className="text-xs text-gray-700 font-medium line-clamp-1">
                                  {photo.caption}
                                </p>
                              ) : (
                                <span className="text-[11px] text-gray-400 italic">Tanpa keterangan</span>
                              )}

                              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <a
                                  href={photo.src}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-gray-600 hover:text-hijauhunter font-semibold flex items-center gap-1"
                                >
                                  <span>Lihat HD</span>
                                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[9px]" />
                                </a>

                                <button
                                  onClick={() => handleDeleteGaleri(photo.id)}
                                  className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                                >
                                  <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {active === "Upload Foto Galeri" && (
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Upload Foto Galeri Baru</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Foto akan dikompresi ke WebP dan disimpan langsung ke Cloudinary serta Firestore.
                  </p>
                </div>
                <button
                  onClick={() => setActive("Kelola Galeri")}
                  className="text-xs px-3 py-1.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold transition cursor-pointer"
                >
                  Kembali ke Galeri
                </button>
              </div>

              <form onSubmit={handleUploadGaleri} className="space-y-5 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Pilih Album Kategori *
                  </label>
                  <select
                    value={galeriUploadKategori}
                    onChange={(e) => setGaleriUploadKategori(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter bg-white text-xs"
                  >
                    <option value="proximiti">Proximiti (Inaugurasi & Makrab)</option>
                    <option value="megabit">Megabit (Akademik & Prodi TI)</option>
                    <option value="ultras">Ultras (Suporter & Solidaritas)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Keterangan Foto (Opsional)
                  </label>
                  <input
                    type="text"
                    value={galeriUploadCaption}
                    onChange={(e) => setGaleriUploadCaption(e.target.value)}
                    placeholder="Misal: Malam Keakraban Angkatan 25 di Bandung"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Pilih & Sesuaikan Foto *
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {galeriUploadPreview ? (
                      <img
                        src={galeriUploadPreview}
                        alt="Preview Foto"
                        className="w-40 h-28 rounded-xl object-cover border-2 border-emerald-500/40 bg-gray-100 shrink-0"
                      />
                    ) : (
                      <div className="w-40 h-28 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 shrink-0 bg-gray-50">
                        <FontAwesomeIcon icon={faCamera} className="text-xl mb-1 text-gray-300" />
                        <span className="text-[10px]">Belum ada foto</span>
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCropperRawSrc(URL.createObjectURL(file));
                            setCropperShape("rect");
                            setCropperAspect(4 / 3);
                            setCropperTitle("Sesuaikan Foto Galeri");
                            setCropperSubtitle("Geser dan atur area foto galeri (rasio 4:3).");
                            setCropTarget("galeriFoto");
                            setIsCropperOpen(true);
                            e.target.value = "";
                          }
                        }}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-hijauhunter hover:file:bg-emerald-100 cursor-pointer"
                      />
                      <p className="text-[11px] text-gray-400">
                        Format JPG, PNG, atau WebP. Foto akan dipotong sesuai rasio dan otomatis dikompresi.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setActive("Kelola Galeri")}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={galeriUploading || !galeriUploadFile}
                    className="px-6 py-2.5 rounded-xl bg-hijauhunter hover:bg-hijaugelap text-white font-semibold transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>{galeriUploading ? "Mengunggah..." : "Simpan ke Galeri"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {isWargaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {modalMode === "add" ? "Tambah Data Warga" : "Edit Data Warga"}
                </h3>
                <p className="text-xs text-gray-500">
                  Perubahan data akan langsung disimpan ke database Firestore.
                </p>
              </div>
              <button
                onClick={() => setIsWargaModalOpen(false)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.nama}
                  onChange={(e) => setModalForm({ ...modalForm, nama: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Kelas *
                  </label>
                  <select
                    value={modalForm.kelas}
                    onChange={(e) => setModalForm({ ...modalForm, kelas: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter bg-white"
                  >
                    <option value="IT-49-01">IT-49-01</option>
                    <option value="IT-49-02">IT-49-02</option>
                    <option value="IT-49-03">IT-49-03</option>
                    <option value="IT-49-04">IT-49-04</option>
                    <option value="IT-49-05">IT-49-05</option>
                    <option value="IT-49-INT">IT-49-INT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Peran (Role) *
                  </label>
                  {(() => {
                    const existingWaldos = wargaList.find(
                      (w) => w.kelas === modalForm.kelas && w.role === "waldos" && w.id !== modalForm.id
                    );
                    const existingKetua = wargaList.find(
                      (w) => w.kelas === modalForm.kelas && w.role === "ketua_kelas" && w.id !== modalForm.id
                    );
                    return (
                      <>
                        <select
                          value={modalForm.role}
                          onChange={(e) => setModalForm({ ...modalForm, role: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter bg-white"
                        >
                          <option value="anggota">Anggota</option>
                          <option value="ketua_kelas">
                            {existingKetua ? `Ketua Kelas (Gantikan ${existingKetua.nama})` : "Ketua Kelas"}
                          </option>
                          {existingWaldos && modalMode === "add" ? (
                            <option value="waldos" disabled>
                              Dosen Wali (Sudah ada: {existingWaldos.nama})
                            </option>
                          ) : (
                            <option value="waldos">
                              {existingWaldos ? `Dosen Wali (Gantikan ${existingWaldos.nama})` : "Dosen Wali (Waldos)"}
                            </option>
                          )}
                        </select>
                        {modalForm.role === "ketua_kelas" && existingKetua && (
                          <p className="mt-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                            Perhatian: Ketua kelas saat ini ({existingKetua.nama}) akan otomatis dialihkan menjadi Anggota.
                          </p>
                        )}
                        {modalForm.role === "waldos" && existingWaldos && modalMode === "edit" && (
                          <p className="mt-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                            Perhatian: Dosen wali saat ini ({existingWaldos.nama}) akan otomatis dialihkan menjadi Anggota.
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={modalForm.email}
                  onChange={(e) => setModalForm({ ...modalForm, email: e.target.value })}
                  placeholder="contoh@mail.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Foto {modalMode === "add" ? "*" : "(Opsional jika ingin mengganti)"}
                </label>
                <div className="flex items-center gap-3">
                  {(modalPhotoPreview || modalForm.foto) && (
                    <img
                      src={modalPhotoPreview || modalForm.foto}
                      alt="Preview"
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shrink-0"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCropperRawSrc(URL.createObjectURL(file));
                        setCropperShape("round");
                        setCropperAspect(1);
                        setCropperTitle("Sesuaikan Foto Profil Mahasiswa");
                        setCropperSubtitle("Geser dan sesuaikan agar wajah/badan berada tepat di dalam lingkaran.");
                        setCropTarget("modalWarga");
                        setIsCropperOpen(true);
                        e.target.value = "";
                      }
                    }}
                    className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="block text-[11px] font-semibold text-gray-500 uppercase">
                  Media Sosial (Opsional)
                </span>
                <input
                  type="text"
                  value={modalForm.instagram}
                  onChange={(e) => setModalForm({ ...modalForm, instagram: e.target.value })}
                  placeholder="Instagram (@username atau URL)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter"
                />
                <input
                  type="text"
                  value={modalForm.linkedin}
                  onChange={(e) => setModalForm({ ...modalForm, linkedin: e.target.value })}
                  placeholder="LinkedIn (username atau URL)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter"
                />
                <input
                  type="text"
                  value={modalForm.github}
                  onChange={(e) => setModalForm({ ...modalForm, github: e.target.value })}
                  placeholder="GitHub (username atau URL)"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsWargaModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={modalSaving}
                  className="px-5 py-2 rounded-xl bg-hijauhunter hover:bg-hijaugelap text-white font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  {modalSaving ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT & TAMBAH INFORMASI */}
      {isEditInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {infoModalMode === "add" ? "Tambah Informasi Baru" : "Edit Informasi"}
                </h3>
                <p className="text-xs text-gray-500">
                  {infoModalMode === "add"
                    ? "Publikasikan postingan informasi atau agenda baru ke database."
                    : "Perubahan akan langsung diperbarui ke database Firestore."}
                </p>
              </div>
              <button
                onClick={() => setIsEditInfoModalOpen(false)}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form onSubmit={handleSaveInfoModal} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Judul Postingan *
                </label>
                <input
                  type="text"
                  required
                  value={editInfoForm.title}
                  onChange={(e) => setEditInfoForm({ ...editInfoForm, title: e.target.value })}
                  placeholder="Judul informasi atau event"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Kategori Tipe *
                  </label>
                  <select
                    value={editInfoForm.type}
                    onChange={(e) => setEditInfoForm({ ...editInfoForm, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter bg-white"
                  >
                    <option value="Event Angkatan">Event Angkatan</option>
                    <option value="Event Kampus">Event Kampus</option>
                    <option value="Beasiswa">Beasiswa</option>
                    <option value="Perlombaan">Perlombaan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Batas Waktu (Avail Date)
                  </label>
                  <input
                    type="date"
                    value={editInfoForm.avail_date}
                    onChange={(e) => setEditInfoForm({ ...editInfoForm, avail_date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Penyelenggara
                </label>
                <input
                  type="text"
                  value={editInfoForm.organizer}
                  onChange={(e) => setEditInfoForm({ ...editInfoForm, organizer: e.target.value })}
                  placeholder="Misal: HIMA TI / Kemdikbud"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hijauhunter/20 focus:border-hijauhunter"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Cover Poster (Lanskap 16:9)
                </label>
                <div className="flex items-center gap-3">
                  {(editInfoCoverPreview || editInfoForm.image) && (
                    <img
                      src={editInfoCoverPreview || editInfoForm.image}
                      alt="Preview Cover"
                      className="w-24 h-16 rounded-xl object-cover border border-gray-200 shrink-0 bg-gray-100"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCropperRawSrc(URL.createObjectURL(file));
                          setCropperShape("rect");
                          setCropperAspect(16 / 9);
                          setCropperTitle("Sesuaikan Cover Poster Informasi");
                          setCropperSubtitle("Geser dan atur area lanskap poster informasi (16:9).");
                          setCropTarget("editInfoCover");
                          setIsCropperOpen(true);
                          e.target.value = "";
                        }
                      }}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Gambar otomatis disesuaikan dalam rasio 16:9 dan dikompresi ke WebP.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Konten Informasi *
                </label>
                <RichTextEditor
                  content={editInfoForm.content}
                  onChange={(html) => setEditInfoForm({ ...editInfoForm, content: html })}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsEditInfoModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingInfo}
                  className="px-5 py-2 rounded-xl bg-hijauhunter hover:bg-hijaugelap text-white font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  {savingInfo
                    ? "Menyimpan..."
                    : infoModalMode === "add"
                    ? "Publikasikan"
                    : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={cropperRawSrc}
        cropShape={cropperShape}
        aspectRatio={cropperAspect}
        title={cropperTitle}
        subtitle={cropperSubtitle}
        onCancel={() => {
          setIsCropperOpen(false);
          setCropperRawSrc(null);
        }}
        onCropComplete={handleCroppedImage}
      />
    </>
  );
}
