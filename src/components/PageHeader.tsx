import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  lang: "en" | "vi";
  currentPath?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backHref,
  actions,
  icon,
  lang,
  currentPath: providedPath,
}) => {
  const currentPath = React.useMemo(() => {
    if (providedPath) return providedPath;
    if (typeof window === "undefined") return "/";
    return window.location.pathname.replace(new RegExp(`^/${lang}`), "") || "/";
  }, [providedPath, lang]);

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {backHref && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-primary/10 text-primary shrink-0"
              onClick={() => (window.location.href = backHref)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          {icon && <div className="shrink-0">{icon}</div>}
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight bg-linear-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent truncate">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {actions}
          <LanguageSwitcher
            currentLang={lang}
            currentPath={currentPath}
          />
        </div>
      </div>
      {subtitle && (
        <p className={`text-muted-foreground text-sm sm:text-base font-medium ${backHref ? "ml-13" : icon ? "ml-13" : "ml-1"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
