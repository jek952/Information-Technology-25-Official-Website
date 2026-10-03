import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
export default function Footer() {
  return (
    <footer className="bg-hijauhunter text-jeruk h-auto w-full pt-10 md:pt-0 px-3 md:px-32 pb-10">
      <div className="flex flex-col gap-6 md:gap-0 md:flex-row justify-start md:justify-between md:py-10">
        <div className="flex flex-col gap-7 w-auto md:w-1/2">
          <h1 className="font-bold text-3xl">IT ANGKATAN 25</h1>
          <p>
            kampus utama Telkom University Bandung berada di Jl. Telekomunikasi
            No. 1, Terusan Buahbatu, Sukapura, Kec. Dayeuhkolot, Kabupaten
            Bandung, Jawa Barat 40257
          </p>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border transition duration-300 hover:scale-110 hover:bg-hijaugelap">
              <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border transition duration-300 hover:scale-110 hover:bg-hijaugelap">
              <FontAwesomeIcon icon={faTiktok} className="text-2xl" />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border transition duration-300 hover:scale-110 hover:bg-hijaugelap">
              <FontAwesomeIcon icon={faGithub} className="text-2xl" />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border transition duration-300 hover:scale-110 hover:bg-hijaugelap">
              <FontAwesomeIcon icon={faYoutube} className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-row md:flex-col items-start md:items-center">
          <a href="#" className="font-normal text-lg hover:underline">
            Tentang kami
          </a>
          <a href="#" className="font-normal text-lg hover:underline">
            Hubungi kami
          </a>
        </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
      <span className="block text-sm text-center">
        copyright© 2026 Angkatan 25 | One Team, One Vision, IT In Action
      </span>
    </footer>
  );
}
