/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { KTTabs } from "@keenthemes/ktui";
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
import {
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [isLogo, setIslogo] = useState(true);
  useEffect(() => {
    KTTabs.init();
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
              src="/logo-proximiti.png"
              alt=""
              className="w-32 h-32 transition-all duration-500 ease-in-out hover:scale-110"
            />
          </div>
          <span className="min-h-62.5 block w-full pt-4 text-center">
            {isLogo ? (
              <div>
                <h1 className="font-semibold text-4xl pb-5 md:text-5xl">
                  One Team, One Vision, IT In Action
                </h1>
                <p className="text-base sm:text-md">
                  Angkatan 25 adalshasjdlajesf Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Harum quo, illum quod
                  accusantium ratione maiores cupiditate, perferendis eos nulla
                  in aut velit eum. Porro necessitatibus in corporis ullam
                  excepturi eius.
                </p>
              </div>
            ) : (
              <div>
                <h1 className="font-semibold text-4xl pb-5 md:text-5xl">
                  Makna Logo Angkatan
                </h1>
                <p className="text-base sm:text-md">
                  Makna adalshasjdlajesf Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Harum quo, illum quod accusantium ratione
                  maiores cupiditate, perferendis eos nulla in aut velit eum.
                  Porro necessitatibus in corporis ullam excdasdsaepturi eius.
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
              <Counter total={223} />
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

        <section className="flex relative text-jeruk mb-10 justify-center items-center min-h-screen gap-20 mx-auto w-full">
          <div className="absolute inset-0 bg-[url('/BG-IT.jpeg')] bg-cover bg-center bg-blend-multiply bg-black/70" />
          <div className="z-10 flex md:flex-row flex-col justify-center md:justify-between items-center gap-10 w-11/12">
            {" "}
            <span className="md:w-1/2 text-center">
              <h1 className="font-semibold text-4xl pb-5 md:text-5xl">VISI</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum,
                temporibus! Blanditiis laboriosam quidem exercitationem aperiam,
                debitis qui delectus numquam! Molestiae, consequuntur libero?
                Cumque magnam nobis culpa eaque. Ipsa, ad quaerat.
              </p>
            </span>
            <span className="md:w-1/2 text-center">
              <h1 className="font-semibold text-4xl pb-5 md:text-5xl">MISI</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum,
                temporibus! Blanditiis laboriosam quidem exercitationem aperiam,
                debitis qui delectus numquam! Molestiae, consequuntur libero?
                Cumque magnam nobis culpa eaque. Ipsa, ad quaerat.
              </p>
            </span>
          </div>
        </section>

        <section className="w-11/12  mx-auto flex justify-center items-center flex-col gap-4">
          <span className="text-center">
            <h1 className="font-semibold text-4xl pb-5 md:text-5xl">
              Galeri Kami
            </h1>
            <p>Beberapa galeri kami selama kami di telkom univeristy</p>
          </span>
          <div
            className="kt-tabs kt-tabs-line inline-flex items-center gap-1 rounded-lg border border-jeruk bg-hijauhunter p-2"
            data-kt-tabs="true"
          >
            <button
              className="kt-tab-toggle cursor-pointer  active rounded-md px-4 py-2 text-sm text-white"
              data-kt-tab-toggle="#tab_1"
            >
              Proximiti
            </button>

            <button
              className="kt-tab-toggle cursor-pointer  rounded-md px-4 py-2 text-sm text-white"
              data-kt-tab-toggle="#tab_2"
            >
              Megabit
            </button>

            <button
              className="kt-tab-toggle cursor-pointer rounded-md px-4 py-2 text-sm text-white"
              data-kt-tab-toggle="#tab_3"
            >
              Ultras
            </button>
          </div>

          <div className="text-sm min-h-[650px]">
            <div
              id="tab_1"
              className="flex flex-wrap gap-3 justify-center items-center"
            >
              {proximiti.map((proximiti) => (
                <div
                  className="md:max-w-[33.333%] md:max-h-75"
                  key={proximiti.id}
                >
                  <img
                    src={proximiti.src}
                    className="block w-85 h-[250px] object-cover md:max-w-full md:max-h-75 md:w-auto md:h-auto md:object-contain border-2 border-hijauhunter rounded-xl"
                  />
                </div>
              ))}
            </div>
            <div id="tab_2" className="hidden">
              <div className="flex flex-wrap gap-3 justify-center items-center">
                {megabit.map((mega) => (
                  <div className="md:max-w-[33.333%] md:max-h-75" key={mega.id}>
                    <img
                      src={mega.src}
                      className="block w-85 h-[250px] object-cover md:max-w-full md:max-h-75 md:w-auto md:h-auto md:object-contain border-2 border-hijauhunter rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div id="tab_3" className="hidden">
              <div className="flex flex-wrap gap-3 justify-center items-center">
                {ultras.map((ultras) => (
                  <div
                    className="md:max-w-[33.333%] md:max-h-75"
                    key={ultras.id}
                  >
                    <img
                      src={ultras.src}
                      className="block w-85 h-[250px] object-cover md:max-w-full md:max-h-75 md:w-auto md:h-auto md:object-contain border-2 border-hijauhunter rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-hijauterang hover:bg-hijauhunter cursor-pointer hover:text-jeruk transition-all ease-in-out">
            Lihat Semuanya
            <FontAwesomeIcon icon={faArrowRight} className="text-lg" />
          </button>
        </section>

        <section className="flex flex-col pt-16  px-3 md:px-0 gap-5 min-h-175">
          <span className="text-center">
            <h1 className="font-semibold text-4xl pb-5 md:text-5xl">
              Hall Of Fame
            </h1>
            <p>Inilah beberapa hasil prestasi mahasiswa angkatan kami</p>
          </span>
          <div className="w-full max-w-6xl mx-auto">
            <Swiper
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={1}
              spaceBetween={20}
              loop={true}
              speed={700}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              coverflowEffect={{
                rotate: 0,
                stretch: 80,
                depth: 200,
                modifier: 1,
                slideShadows: false,
              }}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
              className="w-full"
            >
              {halloffames.map((isian) => (
                <SwiperSlide key={isian.id}>
                  <div
                    style={{ backgroundImage: `url(${isian.foto})` }}
                    className="relative rounded-xl w-auto md:w-125 bg-blend-multiply bg-black/50 text-white flex flex-col items-start justify-end p-4 h-[300px] bg-center bg-cover"
                  >
                    <h2 className="text-cl md:text-2xl font-bold">
                      {isian.nama}
                    </h2>
                    <h1 className="text-base md:text-lg font-semibold">
                      {isian.penghargaan}
                    </h1>
                    <p className="text-sm mt-2">{isian.deskripsi}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
