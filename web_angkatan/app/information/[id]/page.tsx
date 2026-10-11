"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendar, faBuilding } from "@fortawesome/free-solid-svg-icons";

export default function InformationDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/information/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setItem(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const displayData = item || {
    title: "Malam Keakraban Angkatan 25",
    type: "Event Angkatan",
    organizer: "Panitia Proximiti",
    avail_date: "2027-12-01",
    image: "/BG-IT.jpeg",
    content: "<h2>Latar Belakang Acara</h2><p>Malam keakraban ini diselenggarakan untuk menjalin silaturahmi antar seluruh mahasiswa angkatan 25 prodi Teknologi Informasi.</p><h3>Waktu dan Tempat Pelaksanaan</h3><ul><li><strong>Tanggal:</strong> 1-2 Desember 2027</li><li><strong>Lokasi:</strong> Villa IT, Bandung</li></ul>"
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mt-10">
          <Link href="/information" className="text-hijauterang hover:text-hijaugelap font-medium flex items-center gap-2 mb-8 transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} /> Kembali ke Informasi
          </Link>

          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Cover Image */}
            <div className="w-full h-[400px]">
              <img src={displayData.image} alt="Cover" className="w-full h-full object-cover" />
            </div>

            <div className="p-8 md:p-12">
              <div className="flex gap-3 mb-6">
                <span className="bg-jeruk text-hijaugelap text-sm font-bold px-3 py-1 rounded-full">{displayData.type}</span>
                <span className="bg-gray-100 text-gray-600 text-sm font-semibold px-3 py-1 rounded-full">ID: {id}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-hijaugelap mb-6 leading-tight">
                {displayData.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-10 border-b border-gray-200 pb-6">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-hijauterang" />
                  <span className="font-medium">{displayData.organizer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendar} className="text-hijauterang" />
                  <span className="font-medium">Batas Waktu: {displayData.avail_date}</span>
                </div>
              </div>

              {/* Rich Text / Blog Content Layout */}
              <div
                className="prose prose-lg prose-green max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: displayData.content }}
              />
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
