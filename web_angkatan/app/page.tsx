/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useMemo } from "react";
import megabit from "@/json/megabit.json";
import ultras from "@/json/ultras.json";
import proximiti from "@/json/proximiti.json";
import halloffames from "@/json/halloffame.json";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Counter from "@/components/counter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faExpand } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Home() {
  const [isLogo, setIslogo] = useState(true);
  const [activeGaleriTab, setActiveGaleriTab] = useState<
    "proximiti" | "megabit" | "ultras"
  >("proximiti");
  const [proximitiList, setProximitiList] = useState(proximiti);
  const [megabitList, setMegabitList] = useState(megabit);
  const [ultrasList, setUltrasList] = useState(ultras);
  const [hallOfFameList, setHallOfFameList] = useState(halloffames);
  const [infoList, setInfoList] = useState<any[]>([]);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [hallOfFameActiveIndex, setHallOfFameActiveIndex] = useState(0);

  const loopedHallOfFame = useMemo(() => {
    if (!hallOfFameList || hallOfFameList.length === 0) return [];
    if (hallOfFameList.length < 6) {
      let result: any[] = [];
      while (result.length < 8) {
        result = [...result, ...hallOfFameList];
      }
      return result;
    }
    return hallOfFameList;
  }, [hallOfFameList]);

  useEffect(() => {
    fetch("/api/galeri?kategori=proximiti")
      .then((r) => r.json())
      .then((r) => {
        if (r.success && r.data?.length) setProximitiList(r.data);
      })
      .catch(() => {});

    fetch("/api/galeri?kategori=megabit")
      .then((r) => r.json())
      .then((r) => {
        if (r.success && r.data?.length) setMegabitList(r.data);
      })
      .catch(() => {});

    fetch("/api/galeri?kategori=ultras")
      .then((r) => r.json())
      .then((r) => {
        if (r.success && r.data?.length) setUltrasList(r.data);
      })
      .catch(() => {});

    fetch("/api/hall-of-fame")
      .then((r) => r.json())
      .then((r) => {
        if (r.success && r.data?.length) setHallOfFameList(r.data);
      })
      .catch(() => {});

    fetch("/api/information")
      .then((r) => r.json())
      .then((r) => {
        if (r.success && r.data?.length) setInfoList(r.data.slice(0, 3));
      })
      .catch(() => {});
  }, []);
  return (
    <>
      <Header />

      <main className="md:px-0">
        <section className="relative flex flex-col px-3 md:px-0 py-10 items-center justify-center md:w-1/2 mx-auto">
          <div
            onMouseEnter={() => setIslogo(false)}
            onMouseLeave={() => setIslogo(true)}
          >
            <img
              src="/logo-akt.png"
              alt="logo"
              className="w-36 h-36 transition-all duration-500 ease-in-out hover:scale-110"
            />
          </div>
          <span className="block min-h-[370px] w-full max-w-3xl pt-8 text-center">
            {isLogo ? (
              <div>
                <h1 className="font-semibold text-4xl pb-5 md:text-5xl">
                  Concordia Fratrum, Lux in Futuri
                </h1>
                <p className="text-bas leading-8 sm:text-md">
                  Menjadi prinsip bahwa persaudaraan dan persatuan adalah
                  fondasi untuk membangun masa depan bersama. Velkarys bukan
                  sekadar nama atau lambang sebuah angkatan, melainkan
                  representasi dari sebuah ikatan yang dibangun melalui
                  keberanian, diperkuat oleh persaudaraan, dan diarahkan oleh
                  visi yang sama.
                </p>
              </div>
            ) : (
              <div>
                <h1 className="font-semibold text-4xl pb-5 md:text-5xl">
                  Makna Logo Angkatan
                </h1>
                <p className="text-base leading-8 sm:text-md">
                  Naga melambangkan kekuatan, keberanian, dan semangat Angkatan
                  25 untuk terus melangkah menghadapi berbagai rintangan. Sayap
                  naga yang membentang menggambarkan persatuan seluruh anggota
                  dari latar belakang berbeda dengan satu tujuan untuk tumbuh
                  bersama menuju masa depan yang cerah. Perisai menjadi simbol
                  perlindungan dan kekeluargaan, yaitu sikap saling menjaga,
                  melindungi, dan menguatkan satu sama lain. Sementara itu,
                  lingkaran melambangkan ikatan yang tidak terputus dan bintang
                  menggambarkan arah, visi, serta harapan Angkatan 25 dalam
                  menjalani perjalanan panjangnya.
                </p>
              </div>
            )}
          </span>

          <div className="flex justify-center items-center py-10 md:py-0 md:pb-10 gap-5 md:gap-10">
            <span className="text-center">
              <Counter total={6} />
              <h2 className="font-semibold text-lg md:text-xl">Kelas</h2>
            </span>
            <span className="text-center">
              <Counter total={228} />
              <h2 className="font-semibold text-lg md:text-xl">
                Mahasiswa Aktif
              </h2>
            </span>
            <span className="text-center">
              <Counter total={2025} />
              <h2 className="font-semibold text-lg md:text-xl">Angkatan</h2>
            </span>
          </div>

          <div className="w-full max-w-5xl mx-auto px-4">
            <iframe
              className="w-full aspect-video rounded-2xl"
              src="https://www.youtube.com/embed/P2vpZ0XiyCA?si=xwIe4hAj5ddLzNyy"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
        </section>

        <section className="relative grid text-white min-h-screen w-full grid-cols-1 overflow-hidden bg-hijaugelap  md:grid-cols-2">
          <div className="relative min-h-[400px] md:min-h-screen">
            <div className="absolute inset-0 bg-[url('/BG-IT.jpeg')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <div className="flex flex-col text-gray-300 justify-center px-8 py-16 md:px-12 lg:px-16 xl:px-20">
            {" "}
            <span className="mb-4 ">
              <h1 className=" text-4xl font-bold md:text-5xl lg:text-6xl">
                VISI
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-8  md:text-base">
                Membangun angkatan 25 Teknologi Informasi yang kompak,
                komunikatif, dan saling membantu, serta tumbuh bersama selama
                menjalani perjalanan di Prodi Teknologi Informasi, juga menjadi
                jembatan komunikasi dan informasi antar angkatan.
              </p>
            </span>
            <div className="my-10 h-px w-full max-w-xl bg-white/10" />
            <span>
              <h1 className=" text-4xl font-bold md:text-5xl lg:text-6xl">
                MISI
              </h1>
              <ul className="mt-6 max-w-xl space-y-4 text-sm leading-7  md:text-base">
                <li>
                  01. Komunikasi terbuka dan aktif Informasi jelas dan jalur
                  aspirasi yang mudah diakses.
                </li>
                <li>
                  02. Budaya saling membantu Forum belajar bersama dan berbagi
                  materi antar teman seangkatan.
                </li>
                <li>
                  03. Kekompakan lintas kelas Kegiatan kebersamaan yang
                  melibatkan seluruh kelas angkatan.
                </li>
                <li>
                  04. Penghubung yang responsif Menyambungkan angkatan secara
                  transparan.
                </li>
              </ul>
            </span>
          </div>
        </section>

        {/* === SECTION GALERI KAMI === */}
        <section className="w-11/12 max-w-7xl mx-auto py-16 flex flex-col items-center gap-8">
          <div className="text-center max-w-2xl space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-hijaugelap tracking-tight">
              Galeri Kami
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Dokumentasi dan rekam jejak kegiatan mahasiswa S1 Teknologi
              Informasi Angkatan 2025
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-gray-100 border border-gray-200">
            {(["proximiti", "megabit", "ultras"] as const).map((tab) => {
              const isActive = activeGaleriTab === tab;
              const label =
                tab === "proximiti"
                  ? "Proximiti"
                  : tab === "megabit"
                    ? "Megabit"
                    : "Ultras TI";
              const count =
                tab === "proximiti"
                  ? proximitiList.length
                  : tab === "megabit"
                    ? megabitList.length
                    : ultrasList.length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveGaleriTab(tab)}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-hijauhunter text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Modern Photo Grid */}
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {(activeGaleriTab === "proximiti"
                ? proximitiList
                : activeGaleriTab === "megabit"
                  ? megabitList
                  : ultrasList
              )
                .slice(0, 8)
                .map((item: any, idx: number) => (
                  <Link
                    key={item.id || idx}
                    href="/galeri"
                    className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-2xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
                  >
                    <img
                      src={item.src}
                      alt={item.caption || `Foto ${activeGaleriTab}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Dark Glass Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
                      <div className="flex justify-end">
                        <span className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs backdrop-blur-xs">
                          <FontAwesomeIcon icon={faExpand} />
                        </span>
                      </div>

                      <div>
                        {item.caption && (
                          <p className="text-white text-xs font-semibold line-clamp-2 drop-shadow-sm">
                            {item.caption}
                          </p>
                        )}
                        <p className="text-emerald-300 text-[10px] font-medium mt-0.5">
                          Lihat di Galeri &rarr;
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* CTA Link to Full Gallery */}
          <Link
            href="/galeri"
            className="py-3 px-6 inline-flex items-center gap-x-2.5 text-sm font-semibold rounded-xl bg-hijauhunter hover:bg-hijaugelap text-white transition-all shadow-sm hover:shadow-md cursor-pointer group"
          >
            <span>Lihat Galeri Selengkapnya</span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-xs transition-transform group-hover:translate-x-1"
            />
          </Link>
        </section>

        <section className="relative overflow-hidden bg-hijaugelap px-4 py-10 text-white md:px-8">
          <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-hijauterangbanget/30 blur-[100px]" />
          <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-jeruk/10 blur-[100px]" />

          <div className="relative mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                  Hall of Fame<span className="text-hijaugelap">.</span>
                </h1>

                <p className="mt-4 max-w-md text-sm leading-7 text-gray-400 md:text-base">
                  Inilah beberapa hasil prestasi mahasiswa angkatan kami.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {hallOfFameList.map((isian: any, idx: number) => (
                <div
                  key={`${isian.id}-${idx}`}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:border-[#EB5E28]/50 ${
                    idx === 0 ? "md:col-span-2 lg:col-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${"h-[300px] md:h-[400px]"}`}
                  >
                    <img
                      src={isian.foto}
                      alt={isian.nama}
                      className="h-full w-full object-cover brightness-75 transition-all duration-700 group-hover:scale-110 "
                    />

                    <div className="absolute inset-0 " />
                    <div className="absolute bottom-0 left-0 w-full p-5 md:p-6">
                      <span className="mb-3 inline-block rounded-md bg-hijauhunter px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                        {isian.penghargaan}
                      </span>

                      <h2
                        className={`font-bold leading-tight text-white transition-colors duration-300 ${"text-2xl md:text-3xl"}`}
                      >
                        {isian.nama}
                      </h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === INFORMATION HUB PREVIEW === */}
        <section className="max-w-[1400px] mx-auto flex justify-center items-center flex-col gap-6 py-16">
          <span className="text-center">
            <h1 className="font-semibold text-4xl pb-3 md:text-5xl">
              Information Hub
            </h1>
            <p className="text-gray-500">
              Event, beasiswa, dan info terbaru untuk warga angkatan
            </p>
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {infoList.map((item, idx) => (
              <a
                key={item.id}
                href={`/information/${item.id}`}
                className={`group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col ${idx > 0 ? "hidden md:flex" : "flex"}`}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="inline-block bg-hijauhunter text-jeruk text-xs font-bold px-3 py-1 rounded-full mb-3 self-start">
                    {item.type}
                  </span>
                  <h3 className="font-bold text-lg text-hijaugelap mb-1 line-clamp-2 group-hover:text-hijauterang transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{item.organizer}</p>
                  <p className="text-sm text-gray-400 line-clamp-2 flex-grow">
                    {item.excerpt}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <Link
            href="/information"
            className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-hijauterang hover:bg-hijauhunter cursor-pointer hover:text-jeruk transition-all ease-in-out"
          >
            Info Lainnya
            <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
