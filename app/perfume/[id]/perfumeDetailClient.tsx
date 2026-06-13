"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, ShoppingCart } from "lucide-react";
import { Perfume } from "@/types";
import PerfumeImage from "@/components/PerfumeImage";

interface PerfumeDetailClientProps {
  id: string;
}

const formatGender = (gender: Perfume["gender"]) => {
  if (gender === "men") return "男士";
  if (gender === "women") return "女士";
  return "中性";
};

const formatStockStatus = (status: Perfume["purchaseOptions"][number]["stockStatus"]) => {
  if (status === "in_stock") return "有货";
  if (status === "low_stock") return "库存紧张";
  return "缺货";
};

export default function PerfumeDetailClient({ id }: PerfumeDetailClientProps) {
  const router = useRouter();
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [showPurchaseOptions, setShowPurchaseOptions] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const cachedPerfume = sessionStorage.getItem(`perfume:${id}`);

      if (cachedPerfume) {
        try {
          setPerfume(JSON.parse(cachedPerfume) as Perfume);
        } catch (error) {
          console.error("Failed to parse cached perfume:", error);
        }
      }

      setIsLoaded(true);
    });
  }, [id]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
        正在加载香水详情...
      </div>
    );
  }

  if (!perfume) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">没有找到这款香水</h1>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            当前详情页会优先展示刚刚推荐过的香水。请返回首页重新发起一次推荐，再点击卡片查看详情。
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const lowestPrice =
    perfume.purchaseOptions.length > 0
      ? Math.min(...perfume.purchaseOptions.map((option) => option.price))
      : perfume.price;
  const lowestRetailer = perfume.purchaseOptions.find(
    (option) => option.price === lowestPrice
  )?.retailer;
  const handleReturnToRecommendations = () => {
    sessionStorage.setItem("recommendationDialogOpen", "true");
    router.push("/?recommendation=open");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleReturnToRecommendations}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            返回
          </button>
          <h1 className="text-xl font-semibold text-gray-900">香水详情</h1>
          <div className="w-16" />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-96 w-full bg-gray-50 md:h-auto md:w-1/3">
              <PerfumeImage
                src={perfume.imageUrl}
                alt={`${perfume.brand} ${perfume.name}`}
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            <div className="w-full p-8 md:w-2/3">
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                {perfume.brand}
              </p>
              <h2 className="mt-1 text-3xl font-bold text-gray-900">
                {perfume.name}
              </h2>

              <div className="mt-6">
                <span className="text-3xl font-bold text-gray-900">
                  ¥{lowestPrice.toLocaleString()}
                </span>
                {perfume.price !== lowestPrice && (
                  <span className="ml-3 text-lg text-gray-400 line-through">
                    ¥{perfume.price.toLocaleString()}
                  </span>
                )}
                {lowestRetailer && (
                  <p className="mt-2 text-sm text-gray-500">
                    最低价来自 {lowestRetailer}
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium text-gray-900">香调</h3>
                <p className="text-sm text-gray-700">
                  前调：{perfume.scentNotes.top.join(", ") || "暂无"}
                </p>
                <p className="text-sm text-gray-700">
                  中调：{perfume.scentNotes.middle.join(", ") || "暂无"}
                </p>
                <p className="text-sm text-gray-700">
                  后调：{perfume.scentNotes.base.join(", ") || "暂无"}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {[formatGender(perfume.gender), perfume.concentration, `持久度: ${perfume.longevity}`, `扩散度: ${perfume.sillage}`]
                  .filter(Boolean)
                  .map((label) => (
                    <span
                      key={label}
                      className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800"
                    >
                      {label}
                    </span>
                  ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {perfume.purchaseOptions.length > 0 && (
                  <button
                    onClick={() => setShowPurchaseOptions((value) => !value)}
                    className="flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    购买渠道
                  </button>
                )}
                <button
                  onClick={() => setShowDetails((value) => !value)}
                  className="flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  <Info className="h-4 w-4" />
                  {showDetails ? "收起详情" : "查看详情"}
                </button>
              </div>
            </div>
          </div>

          {showDetails && (
            <div className="border-t border-gray-200 p-8">
              <h3 className="text-sm font-medium text-gray-900">香水描述</h3>
              <p className="mt-3 text-sm leading-6 text-gray-700">
                {perfume.description}
              </p>

              <h3 className="mt-8 text-sm font-medium text-gray-900">成分分析</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {perfume.ingredientAnalysis.mainIngredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <span className="text-sm text-gray-700">
                  天然成分：{perfume.ingredientAnalysis.naturalIngredients ? "是" : "否"}
                </span>
                <span className="text-sm text-gray-700">
                  合成成分：{perfume.ingredientAnalysis.syntheticIngredients ? "是" : "否"}
                </span>
                <span className="text-sm text-gray-700">
                  Vegan：{perfume.ingredientAnalysis.veganFriendly ? "是" : "否"}
                </span>
                <span className="text-sm text-gray-700">
                  无动物实验：{perfume.ingredientAnalysis.crueltyFree ? "是" : "否"}
                </span>
              </div>
              {perfume.ingredientAnalysis.allergyInfo.length > 0 && (
                <p className="mt-4 text-sm text-red-700">
                  过敏提示：{perfume.ingredientAnalysis.allergyInfo.join(", ")}
                </p>
              )}
            </div>
          )}

          {showPurchaseOptions && perfume.purchaseOptions.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 p-8">
              <h3 className="text-sm font-medium text-gray-900">购买渠道与比价</h3>
              <div className="mt-4 space-y-3">
                {perfume.purchaseOptions.map((option) => (
                  <div
                    key={`${option.retailer}-${option.link}`}
                    className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {option.retailer}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatStockStatus(option.stockStatus)}
                      </p>
                    </div>
                    <a
                      href={option.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                      ¥{option.price.toLocaleString()} 去购买
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
