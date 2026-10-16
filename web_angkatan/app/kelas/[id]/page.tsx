/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Card from "@/components/cardkelas";
import Footer from "@/components/footer";
import Header from "@/components/header";


const Listkelas = ({ params }: { params: { id: string } }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [waldos, setWaldos] = useState<any>({
    nama: "Naran",
    email: "naran@example.com",
    github: "https://github.com/naran",
    instagram: "https://instagram.com/naran",
    linkedin: "https://linkedin.com/in/naran",
    foto: "https://res.cloudinary.com/hvnrszvj/image/upload/v1791307750/proximiti-2026/warga/lhqlrgaukm2430s4iujh.jpg",
    kelas: "Waldos IT-49-01",
  });
  const [ketuaKelas, setKetuaKelas] = useState<any>({
    nama: "Ara",
    email: "ara@example.com",
    github: "https://github.com/ara",
    instagram: "https://instagram.com/ara", 
    linkedin: "https://linkedin.com/in/ara",
    foto: "https://res.cloudinary.com/hvnrszvj/image/upload/v1791307750/proximiti-2026/warga/lhqlrgaukm2430s4iujh.jpg",
    kelas: "IT-49-01",
  });

  useEffect(() => {
    fetch("/api/warga?kelas=IT-49-01")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.length) {
          const members = res.data.filter((u: any) => u.role === "anggota" || !u.role);
          const foundWaldos = res.data.find((u: any) => u.role === "waldos");
          const foundKetua = res.data.find((u: any) => u.role === "ketua_kelas");

          if (members.length) setStudents(members);
          if (foundWaldos) setWaldos(foundWaldos);
          if (foundKetua) setKetuaKelas(foundKetua);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Header />

      <main>
        <section className="mx-auto max-w-6xl px-4 space-y-6 py-10">
          <div
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/hvnrszvj/image/upload/v1791307752/proximiti-2026/galeri/proximiti/f1b4kso4lakrmnkykk5h.jpg')",
            }}
            className="relative flex h-100 rounded-2xl w-full items-center justify-center overflow-hidden bg-cover bg-center bg-blend-multiply bg-black/70 text-5xl md:text-7xl font-bold text-white"
          >
            IT-49-01
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
                kelas={waldos.kelas || "Waldos IT-49-01"}
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
                kelas={ketuaKelas.kelas || "IT-49-01"}
                variant="waldos"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center">Anggota Mahasiswa</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
            {students.map((user) => (
              <Card
                key={user.id}
                foto={user.foto}
                nama={user.nama || user.name}
                kelas={user.kelas}
                email={user.email}
                github={user.github}
                linkedin={user.linkedin}
                insgaram={user.instagram}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Listkelas;
