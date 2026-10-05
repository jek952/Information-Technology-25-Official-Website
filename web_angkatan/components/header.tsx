/* eslint-disable @next/next/no-img-element */
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const route = useRouter();
  const [isNav, setIsnav] = useState(false);

  const navigateTo = (path: string) => {
    setIsnav(false);
    route.push(path);
  };

  return (
    <header className="flex sticky top-0 flex-wrap sm:justify-start sm:flex-col z-40 w-full bg-white border-b border-gray-200 text-sm pb-2 sm:pb-0">
      <nav className="relative w-full md:mt-0 mt-3 mx-auto md:py-2 px-4 flex justify-between items-center sm:px-6 lg:px-8">
        <div
          onClick={() => navigateTo("/")}
          className="flex items-center cursor-pointer justify-center gap-2"
        >
          <img
            src="/logo-proximiti.png"
            alt="Logo Proximiti"
            className="w-12 h-12 md:w-16 md:h-16"
          />
          <p className="text-xl text-[#5f6368] font-bold">IT 25</p>
        </div>
        <div
          className="block md:hidden cursor-pointer p-2"
          onClick={() => setIsnav(!isNav)}
        >
          <FontAwesomeIcon
            icon={isNav ? faXmark : faBars}
            className="text-2xl text-hijaugelap"
          />
        </div>
        
        {/* Navigation Links */}
        <div
          className={`absolute left-0 top-full w-full bg-white border-b border-gray-200 px-6 py-4 transition-all duration-300 ease-in-out md:static md:flex md:w-auto md:border-0 md:bg-transparent md:p-0 md:opacity-100 md:visible md:translate-y-0 md:pointer-events-auto shadow-md md:shadow-none ${
            isNav ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-start md:justify-end gap-4 md:gap-6">
            <a
              className="cursor-pointer font-medium text-gray-700 hover:text-hijauhunter transition-colors"
              onClick={() => navigateTo("/galeri")}
            >
              Galeri
            </a>
            <a
              className="cursor-pointer font-medium text-gray-700 hover:text-hijauhunter transition-colors"
              onClick={() => navigateTo("/struktur")}
            >
              Struktur
            </a>
            <a
              className="cursor-pointer font-medium text-gray-700 hover:text-hijauhunter transition-colors"
              onClick={() => navigateTo("/information")}
            >
              Information Hub
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
