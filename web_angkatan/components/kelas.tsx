type KelasProps = {
  kelas: string;
  foto: string;
  onclick?: () => void;
};

export default function Kelas({ foto, kelas, onclick, ...props }: KelasProps) {
  return (
    <div
      onClick={onclick}
      style={{ backgroundImage: `url(${foto})` }}
      className="relative group bg-black/70 bg-blend-multiply lg:bg-black/0 lg:bg-blend-normal lg:hover:bg-black/70 lg:hover:bg-blend-multiply cursor-pointer  flex justify-center items-center overflow-hidden transition-all duration-300 bg-cover bg-center rounded-xl"
    >
      <span className="relative z-10 text-3xl font-bold opaciy-100 text-white transition-opacity duration-300  lg:opacity-0 lg:group-hover:opacity-100">
        {kelas}
      </span>
    </div>
  );
}
