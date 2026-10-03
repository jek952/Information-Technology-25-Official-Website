/* eslint-disable @next/next/no-img-element */
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const route = useRouter();
  const [isNav, setIsnav] = useState(false);
  return (
    <header className="flex sticky top-0 flex-wrap sm:justify-start sm:flex-col z-40 w-full bg-white border-b border-gray-200 text-sm pb-2 sm:pb-0">
      <nav className="relative w-full md:mt-0 mt-3 mx-auto md:py-2 px-4 flex justify-between items-center sm:px-6 lg:px-8">
        <div
          onClick={() => route.push("/")}
          className="flex items-center cursor-pointer justify-center gap-2"
        >
          <img
            src="/logo-proximiti.png"
            alt=""
            className="w-12 h-12 md:w-16 md:h-16"
          />
          <p className="text-xl text-[#5f6368] font-bold">IT 25</p>
        </div>
        <div
          className="block md:hidden cursor-pointer"
          onClick={() => setIsnav(!isNav)}
        >
          <FontAwesomeIcon
            icon={isNav ? faXmark : faBars}
            className="text-2xl"
          />
        </div>
        <div
          className={`absolute left-0 top-full w-full bg-white border-b border-gray-200 px-6 transition-all duration-300 ease-in-out md:static md:flex md:w-auto md:border-0 md:bg-transparent md:px-0 md:opacity-100 md:visible md:translate-y-0 md:pointer-events-auto ${isNav ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0 pointer-events-none"}`}
        >
          <div className="flex my-4 md:mt-0 md:space-y-0 space-y-2 flex-col sm:flex-row sm:items-center sm:justify-end gap-0 md:gap-5">
            <a
              className="md:py-3 cursor-pointer font-medium text-doff hover:text-hijauhunter"
              onClick={() => route.push("/")}
            >
              Galeri
            </a>
            <a
              className="md:py-3 cursor-pointer font-medium text-doff hover:text-hijauhunter"
              onClick={() => route.push("/struktur")}
            >
              Struktur
            </a>
            <a
              className="md:py-3  cursor-pointer font-medium text-doff hover:text-hijauhunter"
              onClick={() => route.push("/")}
            >
              Hall of fame
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
