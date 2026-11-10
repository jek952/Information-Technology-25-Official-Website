/* eslint-disable @typescript-eslint/no-unused-vars */

import { faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* eslint-disable @next/next/no-img-element */
type CardProps = {
  nama: string;
  github: string;
  linkedin: string;
  instagram: string;
  kelas: string;
  foto: string;
  variant?: "anggota" | "waldos";
};

function safeSocialLink(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed;
  }
  return null;
}

export default function Card({
  foto,
  nama,
  github,
  linkedin,
  kelas,
  instagram,
  variant,
  ...props
}: CardProps) {
  const safeGithub = safeSocialLink(github);
  const safeLinkedin = safeSocialLink(linkedin);
  const safeInstagram = safeSocialLink(instagram);

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
        <h2
          className={
            variant == "waldos"
              ? "mt-2 md:mt-2 flex h-9 w-full items-center justify-center overflow-hidden text-center text-xl font-medium text-gray-900"
              : "mt-2 md:mt-5 flex h-14 w-full items-center justify-center overflow-hidden text-center text-xl font-medium text-gray-900"
          }
        >
          <span className="line-clamp-2">{nama}</span>
        </h2>

        <p className="mt-1 text-center text-xs text-gray-400">{kelas}</p>
      </div>
      <span className="mt-3 md:mt-5 flex gap-2">
        {safeGithub ? (
          <a
            href={safeGithub}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub ${nama}`}
            className="flex h-9 w-9 text-hijaugelap hover:text-white items-center justify-center rounded-full border transition duration-300 hover:scale-110 hover:bg-hijaugelap"
          >
            <FontAwesomeIcon icon={faGithub} className="text-xl" />
          </a>
        ) : (
          <span className="flex h-9 w-9 text-gray-300 items-center justify-center rounded-full border border-gray-100 opacity-40 cursor-not-allowed">
            <FontAwesomeIcon icon={faGithub} className="text-xl" />
          </span>
        )}

        {safeLinkedin ? (
          <a
            href={safeLinkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn ${nama}`}
            className="flex h-9 w-9 text-hijaugelap hover:text-white items-center justify-center rounded-full border transition duration-300 hover:scale-110 hover:bg-hijaugelap"
          >
            <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
          </a>
        ) : (
          <span className="flex h-9 w-9 text-gray-300 items-center justify-center rounded-full border border-gray-100 opacity-40 cursor-not-allowed">
            <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
          </span>
        )}

        {safeInstagram ? (
          <a
            href={safeInstagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${nama}`}
            className="flex h-9 w-9 text-hijaugelap hover:text-white items-center justify-center rounded-full border transition duration-300 hover:scale-110 hover:bg-hijaugelap"
          >
            <FontAwesomeIcon icon={faInstagram} className="text-xl" />
          </a>
        ) : (
          <span className="flex h-9 w-9 text-gray-300 items-center justify-center rounded-full border border-gray-100 opacity-40 cursor-not-allowed">
            <FontAwesomeIcon icon={faInstagram} className="text-xl" />
          </span>
        )}
      </span>
    </div>
  );
}
