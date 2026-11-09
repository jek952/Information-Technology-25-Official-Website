"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendar, faBuilding } from "@fortawesome/free-solid-svg-icons";
import DOMPurify from "isomorphic-dompurify";

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

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mt-10">
            <div className="animate-pulse space-y-6">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="h-72 bg-gray-200 rounded-2xl"></div>
              <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              <div className="space-y-3 pt-6">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto mt-10 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Informasi Tidak Ditemukan</h1>
            <p className="text-gray-500 mb-8">Informasi yang Anda cari tidak tersedia atau telah dihapus.</p>
            <Link
              href="/information"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-hijauhunter text-white text-sm font-semibold hover:bg-hijaugelap transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Kembali ke Pusat Informasi
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mt-10">
          <Link href="/information" className="text-hijauterang hover:text-hijaugelap font-medium flex items-center gap-2 mb-8 transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} /> Kembali ke Informasi
          </Link>

          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="w-full h-[400px]">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-8 md:p-12">
              <div className="flex gap-3 mb-6">
                <span className="bg-jeruk text-hijaugelap text-sm font-bold px-3 py-1 rounded-full">{item.type}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-hijaugelap mb-6 leading-tight">
                {item.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-10 border-b border-gray-200 pb-6">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-hijauterang" />
                  <span className="font-medium">{item.organizer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendar} className="text-hijauterang" />
                  <span className="font-medium">Batas Waktu: {item.avail_date}</span>
                </div>
              </div>

              <div
                className="prose prose-lg prose-green max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }}
              />
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
