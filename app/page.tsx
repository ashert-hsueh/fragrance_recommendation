"use client";

import { useEffect, useState } from "react";
import RecommendationDialog from "@/components/RecommendationDialog";
import { MessageCircle } from "lucide-react";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const shouldOpenRecommendation =
      searchParams.get("recommendation") === "open" ||
      sessionStorage.getItem("recommendationDialogOpen") === "true";

    if (shouldOpenRecommendation) {
      sessionStorage.setItem("recommendationDialogOpen", "true");
      window.history.replaceState(null, "", "/");
      queueMicrotask(() => {
        setIsDialogOpen(true);
      });
    }
  }, []);

  const openDialog = () => {
    sessionStorage.setItem("recommendationDialogOpen", "true");
    setIsDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
          AI 香水顾问
        </div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            找到真正适合你的那一瓶香水
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            告诉我你的场景、季节、预算或喜欢的气味，我会按香调、留香和适用人群给出推荐。
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <button
            onClick={openDialog}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[200px]"
          >
            <MessageCircle className="w-5 h-5" />
            开始推荐
          </button>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="#"
          >
            先随便看看
          </a>
        </div>
      </main>

      {/* 香水推荐对话框 */}
      <RecommendationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
