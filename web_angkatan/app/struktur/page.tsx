/* eslint-disable @next/next/no-img-element */
"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Kelas from "@/components/kelas";
import Pengurus from "@/components/pengurus";
import { useRouter } from "next/navigation";

export default function Struktur() {
  const router = useRouter();
  return (
    <>
      <Header />
      <main className="">
        <section className="relative flex flex-col px-3 md:px-0 py-10 items-center justify-center w-10/12 mx-auto">
          <h1 className=" text-3xl md:text-5xl font-bold text-center">
            STRUKTUR ANGKATAN IT 25
          </h1>
          <div className="relative flex w-full flex-col md:flex-row overflow-hidden border p-4 mt-10 items-center gap-8 hover:bg-hijauhunter hover:text-jeruk transition-all ease-in-out">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-hijauterangbanget/40" />
            <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-jeruk/20" />

            <img
              src="https://i.ibb.co.com/Gf0WdVMK/IMG-7659.png"
              alt=""
              className="w-auto md:h-[400px] z-10  border-2 "
            />

            <span className="space-y-2">
              <h1 className="text-3xl font-bold">KETUA ANGKATAN</h1>
              <h2 className="text-xl font-semibold ">Fathir An-nafiier</h2>

              <h3 className="mt-1 text-lg font-medium">IT 49-01</h3>
              <hr className=" mt-2" />
              <div className="mt-6 space-y-2 w-11/12">
                <div>
                  <h4 className="text-xl font-bold">Visi</h4>

                  <p className="mt-2 text-justify">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Eligendi ipsum doloremque repellat architecto ducimus?
                    Voluptates, quae rem tempora ad quam, nulla eius amet eos id
                    perferendis ab ea mollitia non!
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-bold">Misi</h4>
                  <p className="mt-2 text-justify">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Eligendi ipsum doloremque repellat architecto ducimus?
                    Voluptates, quae rem tempora ad quam, nulla eius amet eos id
                    perferendis ab ea mollitia non!
                  </p>
                </div>
              </div>
            </span>
          </div>

          <div className="relative w-full h-20 hidden lg:block">
            <div className="absolute left-1/2 top-0 h-16 w-1 -translate-x-1/2 bg-hijauhunter" />
            <div className="absolute left-[10%] right-[10%] top-[80%] h-1 bg-hijauhunter" />
            <div className="absolute left-[30%] top-[85%] h-8 w-1 bg-hijauhunter" />
            <div className="absolute left-1/2 top-[85%] h-8 w-1 -translate-x-1/2 bg-hijauhunter" />
            <div className="absolute left-[70%] top-[85%] h-8 w-1 bg-hijauhunter" />
            <div className="absolute left-[90%] top-[80%] h-8 w-1 bg-hijauhunter" />
            <div className="absolute left-[10%] top-[85%] h-8 w-1 bg-hijauhunter" />
          </div>

          <div className="relative w-full h-20 sm:hidden block">
            <div className="absolute left-1/2 top-0 h-[112px] w-1 -translate-x-1/2 bg-hijauhunter" />
            <div className="absolute left-1/2 top-[527%] h-[21px] w-1 -translate-x-1/2 bg-hijauhunter" />
            <div className="absolute left-1/2 top-[939%] h-[21px] w-1 -translate-x-1/2 bg-hijauhunter" />
            <div className="absolute left-1/2 top-[1352%] h-[21px] w-1 -translate-x-1/2 bg-hijauhunter" />
            <div className="absolute left-1/2 top-[1764%] h-[21px] w-1 -translate-x-1/2 bg-hijauhunter" />
          </div>

          <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center  gap-5 mt-8">
            <Pengurus
              foto="https://i.ibb.co.com/k6q0FpbH/IMG-7990.jpg"
              nama="Reval Satria"
              kelas="IT 49-01"
              jabatan="WAKIL KETUA"
            />
            <Pengurus
              foto="https://i.ibb.co.com/pjRKsKh5/IMG-5984.png"
              nama="Ariiq M"
              kelas="IT 49-01"
              jabatan="SEKRE 1"
            />
            <Pengurus
              foto="https://i.ibb.co.com/rGF9SmZZ/IMG-7190.png"
              nama="Zhafran Ujep"
              kelas="IT 49-01"
              jabatan="SEKRE 2"
            />
            <Pengurus
              foto="https://i.ibb.co.com/rGF9SmZZ/IMG-7190.png"
              nama="Dimas Dirda"
              kelas="IT 49-01"
              jabatan="BENDAHARA 1"
            />
            <Pengurus
              foto="https://i.ibb.co.com/rGF9SmZZ/IMG-7190.png"
              nama="Josjis"
              kelas="IT 49-01"
              jabatan="BENDAHARA 2"
            />
          </div>
        </section>

        <section className="relative flex flex-col px-3 md:px-0 py-8 sm:py-10 items-center justify-center w-11/12 max-w-6xl sm:w-10/12 mx-auto">
          <h1 className="mb-5 text-3xl md:text-4xl font-bold">KELAS IT-49</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-4 h-[1180px] md:h-125 w-full md:w-11/12">
            <Kelas
              kelas="IT 49-01"
              foto="https://i.ibb.co.com/W47r8ZS7/IMG-7204.jpg"
              onclick={() => {
                router.push(`/kelas/1`);
              }}
            />
            <Kelas
              kelas="IT 49-02"
              foto="https://i.ibb.co.com/W47r8ZS7/IMG-7204.jpg"
            />
            <Kelas
              kelas="IT 49-03"
              foto="https://i.ibb.co.com/W47r8ZS7/IMG-7204.jpg"
            />
            <Kelas
              kelas="IT 49-04"
              foto="https://i.ibb.co.com/W47r8ZS7/IMG-7204.jpg"
            />
            <Kelas
              kelas="IT 49-05"
              foto="https://i.ibb.co.com/W47r8ZS7/IMG-7204.jpg"
            />
            <Kelas
              kelas="IT 49-06"
              foto="https://i.ibb.co.com/W47r8ZS7/IMG-7204.jpg"
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
