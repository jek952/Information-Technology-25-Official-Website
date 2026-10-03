"use client";

import Card from "@/components/cardkelas";
import Footer from "@/components/footer";
import Header from "@/components/header";
import User from "@/json/kelas.json";

const Listkelas = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <Header />

      <main>
        <section className="mx-auto max-w-6xl px-4 space-y-6 py-10">
          <div
            style={{
              backgroundImage:
                "url('https://i.ibb.co.com/W47r8ZS7/IMG-7204.jpg')",
            }}
            className="relative flex h-[400px] rounded-2xl w-full items-center justify-center overflow-hidden bg-cover bg-center bg-blend-multiply bg-black/70 text-5xl md:text-7xl font-bold text-white"
          >
            IT-49-01
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-center">
                Dosen Wali Mahasiswa
              </h1>
              <Card
                nama="Naran"
                email="naran@example.com"
                github="https://github.com/naran"
                insgaram="https://instagram.com/naran"
                linkedin="https://linkedin.com/in/naran"
                foto="https://i.ibb.co.com/Gf0WdVMK/IMG-7659.png"
                kelas="Waldos IT-49-01"
                variant="waldos"
              />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-center">Ketua kelas</h1>
              <Card
                nama="Ara"
                email="ara@example.com"
                github="https://github.com/ara"
                insgaram="https://instagram.com/ara"
                linkedin="https://linkedin.com/in/ara"
                foto="https://i.ibb.co.com/3mHQcZFL/IMG-7990.png"
                kelas="IT-49-01"
                variant="waldos"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center">Anggota Mahasiswa</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
            {User.map((user) => (
              <Card
                key={user.id}
                foto={user.foto}
                nama={user.name}
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
