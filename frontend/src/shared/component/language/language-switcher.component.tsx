import "./language-switcher.component.scss";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";

const flagMap: Record<string, string> = {
  vi: "/flags/vi.png",
  en: "/flags/en.png",
  fr: "/flags/fr.png",
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="language-switcher relative" ref={ref}>
      <div className="flag w-14 h-14 rounded-sm overflow-hidden cursor-pointer" onClick={() => setOpen(!open)}>
        <img src={flagMap[i18n.language]} alt={i18n.language} className="w-full h-full object-cover" />
      </div>

      {open && (
        <div className="absolute top-12 right-0 bg-white shadow-md rounded-md w-12 py-2 z-50">
          {Object.keys(flagMap).map((lng) => (
            <button key={lng} onClick={() => changeLanguage(lng)} className="w-full flex items-center justify-center px-2 py-1 hover:bg-gray-100">
              <img src={flagMap[lng]} alt={lng} className="w-7 h-5 rounded-md" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
