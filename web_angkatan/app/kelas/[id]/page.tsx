/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Card from "@/components/cardkelas";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Listkelas = () => {
  const router = useRouter();
  const paras = useParams<{ id: string }>();
  const id = Number(paras?.id || "1");
  const kelasON = `IT-49-${String(id).padStart(2, "0")}`;

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(
    "https://res.cloudinary.com/hvnrszvj/image/upload/v1791307752/proximiti-2026/galeri/proximiti/f1b4kso4lakrmnkykk5h.jpg"
  );
  const [waldos, setWaldos] = useState<any>({
    nama: "Naran",
    email: "naran@example.com",
    github: "https://github.com/naran",
    instagram: "https://instagram.com/naran",
    linkedin: "https://linkedin.com/in/naran",
    foto: "https://res.cloudinary.com/hvnrszvj/image/upload/v1791309130/proximiti-2026/struktur/ketua_angkatan.webp",
    kelas: `Waldos ${kelasON}`,
  });
  const [ketuaKelas, setKetuaKelas] = useState<any>({
    nama: "Ara",
    email: "ara@example.com",
    github: "https://github.com/ara",
    instagram: "https://instagram.com/ara",
    linkedin: "https://linkedin.com/in/ara",
    foto: "https://res.cloudinary.com/hvnrszvj/image/upload/v1791307750/proximiti-2026/warga/lhqlrgaukm2430s4iujh.jpg",
    kelas: kelasON,
  });

  useEffect(() => {
    async function fetchWarga() {
      setLoading(true);
      try {
        const [response, metaRes] = await Promise.all([
          fetch(`/api/warga?kelas=${encodeURIComponent(kelasON)}`),
          fetch(`/api/kelas?kelas=${encodeURIComponent(kelasON)}`).catch(() => null),
        ]);

        if (metaRes && metaRes.ok) {
          const metaJson = await metaRes.json();
          if (metaJson?.data?.banner) {
            setBanner(metaJson.data.banner);
          }
        }

        if (!response.ok) {
          throw new Error(`Gagal memuat data: ${response.status}`);
        }
        const result = await response.json();
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error(result.error || "Gagal memuat data");
        }

        const data = result.data;
        const rolewarga = data.filter(
          (warga: any) => warga.role === "anggota" || !warga.role,
        );
        const foundWaldos = data.find((warga: any) => warga.role === "waldos");
        const foundKetua = data.find(
          (warga: any) => warga.role === "ketua_kelas",
        );

        setStudents(rolewarga);
        if (foundWaldos) {
          setWaldos(foundWaldos);
        } else {
          setWaldos({
            nama: "Naran",
            email: "naran@example.com",
            github: "https://github.com/naran",
            instagram: "https://instagram.com/naran",
            linkedin: "https://linkedin.com/in/naran",
            foto: "https://res.cloudinary.com/hvnrszvj/image/upload/v1791309130/proximiti-2026/struktur/ketua_angkatan.webp",
            kelas: `Waldos ${kelasON}`,
          });
        }

        if (foundKetua) {
          setKetuaKelas(foundKetua);
        } else {
          setKetuaKelas({
            nama: "Ara",
            email: "ara@example.com",
            github: "https://github.com/ara",
            instagram: "https://instagram.com/ara",
            linkedin: "https://linkedin.com/in/ara",
            foto: "https://res.cloudinary.com/hvnrszvj/image/upload/v1791307750/proximiti-2026/warga/lhqlrgaukm2430s4iujh.jpg",
            kelas: kelasON,
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data mahasiswa dari database:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWarga();
  }, [kelasON]);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50/30">
        <section className="mx-auto max-w-6xl px-4 space-y-6 py-6 md:py-8">
          {/* Tombol Navigasi Kembali */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/struktur");
                }
              }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 shadow-2xs transition-all hover:text-hijaugelap hover:border-gray-300 group cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="text-xs transition-transform group-hover:-translate-x-1"
              />
              <span>Kembali</span>
            </button>

            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white text-gray-700 border border-gray-200 shadow-2xs uppercase tracking-wider">
              {kelasON}
            </span>
          </div>

          <div
            style={{
              backgroundImage: `url('${banner}')`,
            }}
            className="relative flex h-80 sm:h-96 md:h-100 rounded-2xl w-full items-center justify-center overflow-hidden bg-cover bg-center bg-blend-multiply bg-black/70 text-5xl md:text-7xl font-bold text-white shadow-md"
          >
            {kelasON}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-center">
                Dosen Wali Mahasiswa
              </h1>
              <Card
                nama={waldos.nama}
                email={waldos.email}
                github={waldos.github}
                insgaram={waldos.instagram}
                linkedin={waldos.linkedin}
                foto={waldos.foto}
                kelas={waldos.kelas || `Waldos ${kelasON}`}
                variant="waldos"
              />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-center">Ketua kelas</h1>
              <Card
                nama={ketuaKelas.nama}
                email={ketuaKelas.email}
                github={ketuaKelas.github}
                insgaram={ketuaKelas.instagram}
                linkedin={ketuaKelas.linkedin}
                foto={ketuaKelas.foto}
                kelas={ketuaKelas.kelas || kelasON}
                variant="waldos"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center">Anggota Mahasiswa</h1>
          {loading ? (
            <div className="flex justify-center items-center py-16 text-gray-400">
              Memuat data kelas dari database...
            </div>
          ) : students.length === 0 ? (
            <div className="flex justify-center items-center py-16 text-gray-500 text-center">
              Belum ada data anggota untuk kelas {kelasON}.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
              {students.map((user) => (
                <Card
                  key={user.id || user.email || user.nama}
                  foto={user.foto}
                  nama={user.nama || user.nama_lengkap || user.name}
                  kelas={user.kelas}
                  email={user.email}
                  github={user.github}
                  linkedin={user.linkedin}
                  insgaram={user.instagram}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Listkelas;
