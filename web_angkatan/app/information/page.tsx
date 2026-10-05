"use client";
import React, { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faBuilding, faTag } from "@fortawesome/free-solid-svg-icons";

// Data Dummy (Nanti diganti dengan fetch dari backend/JSON)
const DUMMY_DATA = [
  {
    id: "1",
    title: "Malam Keakraban Angkatan 25",
    type: "Event Angkatan",
    organizer: "Panitia Proximiti",
    avail_date: "2027-12-01",
    image: "/BG-IT.jpeg",
    excerpt: "Acara malam keakraban untuk seluruh mahasiswa angkatan 25 Teknologi Informasi.",
  },
  {
    id: "2",
    title: "Beasiswa Unggulan Mahasiswa IT",
    type: "Beasiswa",
    organizer: "Kemdikbud",
    avail_date: "2026-08-01", // Sudah kedaluwarsa
    image: "/BG-Utama.jpeg",
    excerpt: "Pendaftaran beasiswa unggulan untuk mahasiswa berprestasi semester 3 ke atas.",
  },
  {
    id: "3",
    title: "Hackathon Nasional 2026",
    type: "Perlombaan",
    organizer: "Kementerian Kominfo",
    avail_date: "2027-01-15",
    image: "/BG-IT.jpeg",
    excerpt: "Lomba membuat inovasi aplikasi untuk menyelesaikan masalah sosial di Indonesia.",
  },
  {
    id: "4",
    title: "Seminar AI & Future of Tech",
    type: "Event Kampus",
    organizer: "HIMA TI",
    avail_date: "2026-09-10", // Sudah kedaluwarsa
    image: "/BG-Utama.jpeg",
    excerpt: "Seminar menghadirkan pakar AI dari perusahaan teknologi terkemuka.",
  },
];

export default function InformationHub() {
  const [filterType, setFilterType] = useState("Semua");
  const [filterAvail, setFilterAvail] = useState("Aktif");

  // Logika Filter (Sesuai poin 2 yang Anda minta)
  const filteredData = DUMMY_DATA.filter((item) => {
    const isExpired = new Date() > new Date(item.avail_date);
    
    // Logika 1: Jika ini Beasiswa/Perlombaan DAN expired, maka SEMBUNYIKAN (Return false)
    if ((item.type === "Beasiswa" || item.type === "Perlombaan") && isExpired) {
      return false;
    }

    // Logika 2: Filter berdasarkan ketersediaan (Aktif / Riwayat)
    if (filterAvail === "Aktif" && isExpired) return false;
    if (filterAvail === "Riwayat" && !isExpired) return false;

    // Logika 3: Filter berdasarkan tipe
    if (filterType !== "Semua" && item.type !== filterType) return false;

    return true;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mt-10">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-hijaugelap sm:text-5xl">Information Hub</h1>
            <p className="mt-4 text-xl text-gray-500">Pusat informasi event, lomba, dan beasiswa.</p>
          </div>

          {/* Filter Section */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8 gap-4">
            
            {/* Filter Status (Avail / Tidak) */}
            <div className="flex space-x-2">
              {["Aktif", "Riwayat", "Semua"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterAvail(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    filterAvail === status 
                      ? "bg-jeruk text-hijaugelap" 
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Filter Tipe */}
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 outline-none focus:border-hijauterang"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Event Angkatan">Event Angkatan</option>
              <option value="Event Kampus">Event Kampus</option>
              <option value="Beasiswa">Beasiswa</option>
              <option value="Perlombaan">Perlombaan</option>
            </select>
          </div>

          {/* Grid Konten (3 ke kanan) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const isExpired = new Date() > new Date(item.avail_date);
                return (
                  <Link href={`/information/${item.id}`} key={item.id} className="group cursor-pointer">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col relative">
                      
                      {/* Badge Expired */}
                      {isExpired && (
                        <div className="absolute top-4 right-4 bg-gray-800/80 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                          Telah Berakhir
                        </div>
                      )}

                      <div className="h-52 overflow-hidden relative">
                        <img src={item.image} alt={item.title} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isExpired ? 'grayscale opacity-70' : ''}`} />
                        <div className="absolute bottom-4 left-4 bg-hijauterang text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          {item.type}
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-hijaugelap mb-3 group-hover:text-hijauterang transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        
                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <p className="flex items-center gap-2"><FontAwesomeIcon icon={faBuilding} className="text-hijauterangbanget w-4" /> {item.organizer}</p>
                          <p className="flex items-center gap-2"><FontAwesomeIcon icon={faCalendar} className="text-hijauterangbanget w-4" /> Batas: {item.avail_date}</p>
                        </div>
                        
                        <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow">
                          {item.excerpt}
                        </p>
                        
                        <div className="mt-auto text-hijauterang font-semibold text-sm flex items-center group-hover:gap-2 transition-all">
                          Baca Selengkapnya <span>&rarr;</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                Belum ada informasi yang sesuai dengan filter.
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
