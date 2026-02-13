import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Search, ChevronRight, Book } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/PageHeader";
import { WEREWOLF_ROLES, type WerewolfRole } from "../types/roles";
import { werewolf } from "../i18n";

interface RoleDictionaryProps {
  lang?: "en" | "vi";
}

export const RoleDictionary: React.FC<RoleDictionaryProps> = ({
  lang = "en",
}) => {
  const [search, setSearch] = useState("");
  const t = werewolf[lang];

  // Helper to get translated role
  const getTranslatedRole = (role: WerewolfRole) => ({
    ...role,
    name: t[`role.${role.id}.name` as keyof typeof t] || role.name,
    description:
      t[`role.${role.id}.desc` as keyof typeof t] || role.description,
  });

  const filteredRoles = WEREWOLF_ROLES.map(getTranslatedRole).filter(
    (role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      role.description.toLowerCase().includes(search.toLowerCase()),
  );

  const getFactionStyles = (faction: string) => {
    switch (faction) {
      case "village":
        return {
          badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          card: "hover:border-emerald-500/40",
          iconBg: "bg-emerald-500/10 text-emerald-600",
        };
      case "werewolves":
        return {
          badge: "bg-rose-500/10 text-rose-500 border-rose-500/20",
          card: "hover:border-rose-500/40",
          iconBg: "bg-rose-500/10 text-rose-600",
        };
      case "neutral":
        return {
          badge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          card: "hover:border-amber-500/40",
          iconBg: "bg-amber-500/10 text-amber-600",
        };
      default:
        return {
          badge: "bg-slate-500/10 text-slate-500 border-slate-500/20",
          card: "hover:border-slate-500/40",
          iconBg: "bg-slate-500/10 text-slate-600",
        };
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto min-h-screen pb-20">
      <div className="px-4 sm:px-8 py-6 sm:py-10">
        <PageHeader
          title={lang === "vi" ? "Từ điển Vai trò" : "Role Dictionary"}
          subtitle={
            lang === "vi"
              ? "Tìm hiểu về các nhân vật, phe phái và khả năng đặc biệt của họ."
              : "Learn about characters, factions, and their special abilities."
          }
          lang={lang}
          icon={
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Book className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
          }
        />
      </div>

      <div className="sticky top-0 bg-background/80 backdrop-blur-xl z-20 py-4 px-4 sm:px-8 border-b border-border/50">
        <div className="relative group max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder={
              lang === "vi" ? "Tìm kiếm vai trò..." : "Search roles..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 bg-muted/30 focus:bg-background transition-all text-lg font-medium shadow-inner"
          />
        </div>
      </div>

      <div className="px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4">
        {filteredRoles.length > 0 ? (
          filteredRoles
            .sort((a, b) => a.faction.localeCompare(b.faction))
            .map((role) => {
              const styles = getFactionStyles(role.faction);
              return (
                <Card
                  key={role.id}
                  className={`group overflow-hidden border-2 transition-all duration-300 rounded-3xl active:scale-[0.98] ${styles.card} hover:shadow-xl hover:shadow-primary/5`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-xl sm:text-2xl font-black">
                          {role.name}
                        </CardTitle>
                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-primary/60">
                          Priority: {role.priority}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`${styles.badge} py-1.5 px-3 rounded-xl font-bold border shrink-0`}
                        variant="outline"
                      >
                        {role.faction === "village"
                          ? lang === "vi"
                            ? "Dân làng"
                            : "Village"
                          : role.faction === "werewolves"
                            ? lang === "vi"
                              ? "Ma Sói"
                              : "Werewolf"
                            : lang === "vi"
                              ? "Trung lập"
                              : "Neutral"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <p className="text-sm sm:text-base leading-relaxed text-muted-foreground font-medium">
                      {role.description}
                    </p>
                    {role.nightAction && (
                      <div className="bg-muted/40 p-4 rounded-2xl border border-border/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                          <ChevronRight className="h-8 w-8" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-1">
                          Night Action
                        </span>
                        <p className="text-sm italic font-semibold text-foreground/80 leading-snug">
                          {role.nightAction}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
        ) : (
          <div className="col-span-full text-center py-20 px-4">
            <div className="bg-muted/30 inline-flex p-6 rounded-full mb-4">
              <Search className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground text-xl font-medium italic">
              {lang === "vi"
                ? "Không tìm thấy vai trò nào khớp với tìm kiếm."
                : "No roles found matching your search."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
