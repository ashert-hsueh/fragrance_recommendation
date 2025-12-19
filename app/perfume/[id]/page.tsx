// 香水详情页
import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ShoppingCart,
  Info,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Perfume } from "@/types";

// 模拟数据 - 实际应该从API或数据库获取
const mockPerfumes: Record<string, Perfume> = {
  // 这里可以存放一些示例数据
  // 实际应用中，应该从API根据id获取香水信息
};

interface PerfumeDetailPageProps {
  params: {
    id: string;
  };
}

const PerfumeDetailPage: React.FC<PerfumeDetailPageProps> = ({
  params,
}) => {
  const { id } = params;
  const [showDetails, setShowDetails] = React.useState(false);
  const [showPurchaseOptions, setShowPurchaseOptions] =
    React.useState(false);

  // 尝试从模拟数据中获取香水信息
  // 实际应用中应该调用API
  let perfume: Perfume | undefined = mockPerfumes[id];

  // 如果没有找到，返回404
  if (!perfume) {
    // 这里可以尝试从URL参数或其他地方获取香水信息
    // 暂时返回notFound
    // notFound();

    // 为了演示，创建一个临时的香水对象
    perfume = {
      id: id,
      name: "未知香水",
      brand: "未知品牌",
      description: "暂无描述信息",
      imageUrl: "/placeholder.jpg",
      price: 0,
      currency: "CNY",
      scentNotes: {
        top: [],
        middle: [],
        base: [],
      },
      ingredientAnalysis: {
        mainIngredients: [],
        naturalIngredients: false,
        syntheticIngredients: false,
        allergyInfo: [],
        veganFriendly: false,
        crueltyFree: false,
      },
      purchaseOptions: [],
      gender: "unisex",
      concentration: "",
      longevity: "",
      sillage: "",
    };
  }

  // 获取最低价格
  const lowestPrice = perfume.purchaseOptions.length > 0
    ? Math.min(...perfume.purchaseOptions.map((option) => option.price))
    : perfume.price;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              返回
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              香水详情
            </h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* 产品图片和基本信息 */}
          <div className="flex flex-col md:flex-row">
            {/* 产品图片 */}
            <div className="relative w-full md:w-1/3 h-96 md:h-auto bg-gray-50">
              {perfume.imageUrl ? (
                <img
                  src={perfume.imageUrl}
                  alt={`${perfume.brand} ${perfume.name}`}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  暂无图片
                </div>
              )}
            </div>

            {/* 基本信息 */}
            <div className="w-full md:w-2/3 p-8">
              {/* 品牌和名称 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {perfume.brand}
                </h3>
                <h2 className="text-3xl font-bold text-gray-900">
                  {perfume.name}
                </h2>
              </div>

              {/* 价格信息 */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    ¥{lowestPrice.toLocaleString()}
                  </span>
                  {perfume.price !== lowestPrice && (
                    <span className="ml-3 text-lg text-gray-400 line-through">
                      ¥{perfume.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {perfume.purchaseOptions.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    最低价来自{" "}
                    {perfume.purchaseOptions.find(
                      (option) => option.price === lowestPrice
                    )?.retailer}
                  </p>
                )}
              </div>

              {/* 香调信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  香调
                </h4>
                <div className="space-y-2">
                  {perfume.scentNotes.top.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        前调:
                      </span>
                      <span className="text-sm text-gray-700 ml-2">
                        {perfume.scentNotes.top.join(", ")}
                      </span>
                    </div>
                  )}
                  {perfume.scentNotes.middle.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        中调:
                      </span>
                      <span className="text-sm text-gray-700 ml-2">
                        {perfume.scentNotes.middle.join(", ")}
                      </span>
                    </div>
                  )}
                  {perfume.scentNotes.base.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        后调:
                      </span>
                      <span className="text-sm text-gray-700 ml-2">
                        {perfume.scentNotes.base.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 快速信息标签 */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {perfume.gender === "unisex"
                    ? "中性"
                    : perfume.gender === "men"
                    ? "男士"
                    : "女士"}
                </span>
                {perfume.concentration && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {perfume.concentration}
                  </span>
                )}
                {perfume.longevity && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    持久度: {perfume.longevity}
                  </span>
                )}
                {perfume.sillage && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    扩散度: {perfume.sillage}
                  </span>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-3">
                {perfume.purchaseOptions.length > 0 && (
                  <button
                    onClick={() => setShowPurchaseOptions(!showPurchaseOptions)}
                    className="flex-1 min-w-[140px] bg-black text-white py-3 px-6 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    购买渠道
                  </button>
                )}

                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex-1 min-w-[140px] bg-white text-gray-900 border border-gray-300 py-3 px-6 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  {showDetails ? "收起详情" : "查看详情"}
                </button>
              </div>
            </div>
          </div>

          {/* 详细信息部分 */}
          {showDetails && (
            <div className="border-t border-gray-200 p-8">
              {/* 香水描述 */}
              <div className="mb-8">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  香水描述
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {perfume.description}
                </p>
              </div>

              {/* 成分分析 */}
              {Object.keys(perfume.ingredientAnalysis).some(
                (key) =>
                  Array.isArray(perfume.ingredientAnalysis[key as keyof typeof perfume.ingredientAnalysis])
                    ? (perfume.ingredientAnalysis[key as keyof typeof perfume.ingredientAnalysis] as Array<any>).length > 0
                    : perfume.ingredientAnalysis[key as keyof typeof perfume.ingredientAnalysis]
              ) && (
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    成分分析
                  </h4>

                  {/* 主要成分 */}
                  {perfume.ingredientAnalysis.mainIngredients.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">
                        主要成分
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {perfume.ingredientAnalysis.mainIngredients.map(
                          (ingredient, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                            >
                              {ingredient}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* 成分特点 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          perfume.ingredientAnalysis.naturalIngredients
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {perfume.ingredientAnalysis.naturalIngredients ? (
                          <span className="text-xs font-bold">✓</span>
                        ) : (
                          <span className="text-xs">✗</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">
                        含天然成分
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          perfume.ingredientAnalysis.syntheticIngredients
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {perfume.ingredientAnalysis.syntheticIngredients ? (
                          <span className="text-xs font-bold">✓</span>
                        ) : (
                          <span className="text-xs">✗</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">
                        含合成成分
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          perfume.ingredientAnalysis.veganFriendly
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {perfume.ingredientAnalysis.veganFriendly ? (
                          <span className="text-xs font-bold">✓</span>
                        ) : (
                          <span className="text-xs">✗</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">Vegan 友好</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          perfume.ingredientAnalysis.crueltyFree
                            ? "bg-pink-100 text-pink-800"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {perfume.ingredientAnalysis.crueltyFree ? (
                          <span className="text-xs font-bold">✓</span>
                        ) : (
                          <span className="text-xs">✗</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-700">
                        无动物实验
                      </span>
                    </div>
                  </div>

                  {/* 过敏信息 */}
                  {perfume.ingredientAnalysis.allergyInfo.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">
                        过敏提示
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {perfume.ingredientAnalysis.allergyInfo.map(
                          (info, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-50 text-red-700"
                            >
                              {info}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 购买渠道部分 */}
          {showPurchaseOptions && perfume.purchaseOptions.length > 0 && (
            <div className="border-t border-gray-200 p-8 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-6">
                购买渠道与比价
              </h4>

              <div className="space-y-4">
                {perfume.purchaseOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-md border ${
                      option.price === lowestPrice
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* 零售商名称 */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          {option.retailer}
                        </h5>
                        <div className="flex items-center gap-2 mt-1">
                          {/* 价格 */}
                          <span
                            className={`text-lg font-bold ${
                              option.price === lowestPrice
                                ? "text-green-700"
                                : "text-gray-900"
                            }`}
                          >
                            ¥{option.price.toLocaleString()}
                          </span>

                          {/* 最低价标签 */}
                          {option.price === lowestPrice && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              最低价
                            </span>
                          )}
                        </div>

                        {/* 库存状态 */}
                        <div className="flex items-center gap-2 mt-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              option.stockStatus === "in_stock"
                                ? "bg-green-500"
                                : option.stockStatus === "low_stock"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className="text-xs text-gray-500">
                            {option.stockStatus === "in_stock"
                              ? "有货"
                              : option.stockStatus === "low_stock"
                              ? "库存紧张"
                              : "缺货"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 购买按钮 */}
                    <a
                      href={option.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                        option.price === lowestPrice
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      去购买
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfumeDetailPage;