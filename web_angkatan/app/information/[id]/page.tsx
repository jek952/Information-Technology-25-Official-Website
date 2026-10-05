"use client";
import React from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendar, faBuilding } from "@fortawesome/free-solid-svg-icons";

export default function InformationDetail() {
  const { id } = useParams();

  // Nanti Fetch ke backend berdasarkan ID. Untuk sekarang data dummy.
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
              <img src="/BG-IT.jpeg" alt="Cover" className="w-full h-full object-cover" />
            </div>

            <div className="p-8 md:p-12">
              <div className="flex gap-3 mb-6">
                <span className="bg-jeruk text-hijaugelap text-sm font-bold px-3 py-1 rounded-full">Event Angkatan</span>
                <span className="bg-gray-100 text-gray-600 text-sm font-semibold px-3 py-1 rounded-full">ID: {id}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-hijaugelap mb-6 leading-tight">
                Malam Keakraban Angkatan 25
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-10 border-b border-gray-200 pb-6">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-hijauterang" />
                  <span className="font-medium">Panitia Proximiti</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendar} className="text-hijauterang" />
                  <span className="font-medium">Batas Waktu: 2027-12-01</span>
                </div>
              </div>

              {/* Rich Text / Blog Content Layout */}
              <div className="prose prose-lg prose-green max-w-none text-gray-700">
                <h2>Latar Belakang Acara</h2>
                <p>
                  Malam keakraban ini diselenggarakan untuk menjalin silaturahmi antar seluruh mahasiswa angkatan 25 prodi Teknologi Informasi. Diharapkan seluruh warga angkatan dapat hadir dan berpartisipasi aktif dalam kegiatan ini.
                </p>
                
                <h3>Waktu dan Tempat Pelaksanaan</h3>
                <ul>
                  <li><strong>Tanggal:</strong> 1-2 Desember 2027</li>
                  <li><strong>Lokasi:</strong> Villa IT, Bandung</li>
                  <li><strong>Dresscode:</strong> Kemeja bebas rapi</li>
                </ul>

                <p>
                  Bagi mahasiswa yang belum mendaftar, silakan mengisi formulir melalui link yang telah dibagikan di grup angkatan. Mari kita jadikan angkatan ini semakin solid dan kompak!
                </p>
                
                <img src="/BG-Utama.jpeg" alt="Poster Acara" className="rounded-xl my-8 w-full max-h-[500px] object-cover" />
                
                <p>
                  Terima kasih atas partisipasinya. <em>One Team, One Vision, IT In Action!</em>
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
