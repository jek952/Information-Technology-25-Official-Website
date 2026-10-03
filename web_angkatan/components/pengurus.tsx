/* eslint-disable @next/next/no-img-element */
type PengurusProps = {
  foto: string;
  nama: string;
  kelas: string;
  jabatan: string;
};

export default function Pengurus({
  foto,
  nama,
  kelas,
  jabatan,
}: PengurusProps) {
  return (
    <div className="border w-[80%] sm:w-full hover:bg-hijauhunter transition-all ease-in-out p-3 sm:p-4 text-center hover:text-jeruk">
      <img
        src={foto}
        alt=""
        className="w-full h-48 md:h-45  object-cover border-2 hover:border-jeruk"
      />
      <h2 className="mt-4 text-lg font-semibold">{nama}</h2>
      <p className="text-sm">{kelas}</p>
      <p className="mt-1 font-semibold">{jabatan}</p>
    </div>
  );
}
