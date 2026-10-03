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
      className="relative group hover:bg-blend-multiply hover:bg-black/70 cursor-pointer  flex justify-center items-center overflow-hidden transition-all duration-300 bg-cover bg-center rounded-xl"
    >
      <span className="relative z-10 text-3xl font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {kelas}
      </span>
    </div>
  );
}
