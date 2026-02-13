import React from "react";

interface LanguageSwitcherProps {
  currentLang: string;
  currentPath: string; // The path without the language prefix
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  currentPath,
}) => {
  const getPathForLang = (lang: string) => {
    return `/${lang}${currentPath === "/" ? "" : currentPath}`;
  };

  const nextLang = currentLang === "en" ? "vi" : "en";

  return (
    <div className="flex items-center bg-card/60 backdrop-blur-md border border-border/50 rounded-full p-1 shadow-lg pointer-events-auto">
      <a
        href={getPathForLang("en")}
        className={`px-4 py-1.5 text-xs font-bold tracking-wider rounded-full transition-all ${
          currentLang === "en"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </a>
      <a
        href={getPathForLang("vi")}
        className={`px-4 py-1.5 text-xs font-bold tracking-wider rounded-full transition-all ${
          currentLang === "vi"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        VI
      </a>
    </div>
  );
};
