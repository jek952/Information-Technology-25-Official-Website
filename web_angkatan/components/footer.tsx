/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faBuilding,
  faEnvelope,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  const socialLinks = [
    {
      name: "Instagram",
      icon: faInstagram,
      href: "https://instagram.com",
    },
    {
      name: "TikTok",
      icon: faTiktok,
      href: "https://tiktok.com",
    },
    {
      name: "YouTube",
      icon: faYoutube,
      href: "https://youtube.com",
    },
  ];

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Galeri Foto", href: "/galeri" },
    { label: "Struktur Organisasi", href: "/struktur" },
    { label: "Information Hub", href: "/information" },
  ];

  const kelasLinks = [
    { label: "IT-49-01", id: "1" },
    { label: "IT-49-02", id: "2" },
    { label: "IT-49-03", id: "3" },
    { label: "IT-49-04", id: "4" },
    { label: "IT-49-05", id: "5" },
    { label: "IT-49-06", id: "6" },
  ];

  return (
    <footer className="bg-hijaugelap text-gray-300 border-t border-hijauhunter/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Identity (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo-proximiti.png"
                alt="Logo IT 25"
                className="w-12 h-12 object-contain shrink-0"
              />
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-wide">
                  GREEN COMRADES 25
                </h2>
                <p className="text-xs text-jeruk font-medium">
                  S1 Teknologi Informasi &bull; Telkom University
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed max-w-md">
              Wadah resmi persatuan, sinergi, dan rekam jejak dokumentasi seluruh
              mahasiswa S1 Teknologi Informasi Angkatan 2025 Telkom University.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-hijauhunter text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                >
                  <FontAwesomeIcon icon={item.icon} className="text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigasi Cepat (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-jeruk">
              Navigasi
            </h3>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:underline transition-colors block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Kelas IT-49 (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-jeruk">
              Kelas Angkatan
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {kelasLinks.map((item) => (
                <Link
                  key={item.id}
                  href={`/kelas/${item.id}`}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-center font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Lokasi & Kampus (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-jeruk">
              Kampus Utama
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="text-jeruk text-sm mt-0.5 shrink-0"
                />
                <p className="leading-relaxed">
                  Jl. Telekomunikasi No. 1, Terusan Buahbatu, Sukapura, Dayeuhkolot,
                  Kabupaten Bandung, Jawa Barat 40257
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-jeruk text-sm shrink-0"
                />
                <a
                  href="mailto:it25@telkomuniversity.ac.id"
                  className="hover:text-white transition-colors underline"
                >
                  it25@telkomuniversity.ac.id
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Motto */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="text-center sm:text-left">
            &copy; 2026 Information Technology 25 &bull; All Rights Reserved.
          </p>

          <p className="text-xs text-jeruk font-semibold tracking-wide">
            One Team, One Vision, IT In Action
          </p>
        </div>
      </div>
    </footer>
  );
}
