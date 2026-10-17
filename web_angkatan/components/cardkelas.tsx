/* eslint-disable @typescript-eslint/no-unused-vars */

import { faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* eslint-disable @next/next/no-img-element */
type CardProps = {
  nama: string;
  email: string;
  github: string;
  linkedin: string;
  insgaram: string;
  kelas: string;
  foto: string;
  variant?: "anggota" | "waldos";
};

export default function Card({
  foto,
  nama,
  email,
  github,
  linkedin,
  kelas,
  insgaram,
  variant,
  ...props
}: CardProps) {
  return (
    <div
      className={
        variant == "waldos"
          ? "flex flex-col items-center justify-center rounded-xl border border-gray-200 p-4 shadow-sm"
          : "flex w-full h-full max-w-[280px] flex-col items-center justify-center rounded-xl border border-gray-200 p-4 shadow-sm"
      }
    >
      <img
        src={foto}
        alt={nama}
        loading="lazy"
        decoding="async"
        className="rounded-full object-cover shrink-0 w-22 h-22 md:w-24 md:h-24"
      />
      <div className="w-full">
        <h2 className="mt-2 md:mt-5 flex h-14 w-full items-center justify-center overflow-hidden text-center text-xl font-medium text-gray-900">
          <span className="line-clamp-2">{nama}</span>
        </h2>

        <p className="mt-2 h-10 break-all text-center text-sm text-gray-600">
          {email}
        </p>

        <p className="mt-1 text-center text-xs text-gray-400">{kelas}</p>
      </div>
      <span className="mt-3 md:mt-5 flex gap-2">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 text-hijaugelap hover:text-white items-center justify-center rounded-full border transition duration-300 hover:scale-110 hover:bg-hijaugelap"
        >
          <FontAwesomeIcon icon={faGithub} className="text-xl" />
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 text-hijaugelap hover:text-white items-center justify-center rounded-full border transition duration-300 hover:scale-110 hover:bg-hijaugelap"
        >
          <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
        </a>
        <a
          href={insgaram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 text-hijaugelap hover:text-white items-center justify-center rounded-full border transition duration-300 hover:scale-110 hover:bg-hijaugelap"
        >
          <FontAwesomeIcon icon={faInstagram} className="text-xl" />
        </a>
      </span>
    </div>
  );
}
