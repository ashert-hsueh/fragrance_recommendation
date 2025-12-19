// 香水推荐 Agent 服务
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { Perfume, RecommendationRequest } from "@/types";

// 模拟数据 - 用于演示和测试
const mockPerfumes: Perfume[] = [
  {
    id: "perfume_1",
    name: "Sauvage",
    brand: "迪奥",
    description: "经典的木质香调，适合自信、现代的男性。前调以佛手柑和胡椒为主，中调是雪松和广藿香，后调则是降龙涎香醚和木质香调的完美结合。",
    imageUrl: "https://images.unsplash.com/photo-1596464130119-49a8179e6f10?q=80&w=2835&auto=format&fit=crop",
    price: 850,
    currency: "CNY",
    scentNotes: {
      top: ["佛手柑", "胡椒", "薰衣草"],
      middle: ["雪松", "广藿香", "香根草"],
      base: ["降龙涎香醚", "木质香调", "麝香"]
    },
    ingredientAnalysis: {
      mainIngredients: ["佛手柑", "胡椒", "雪松"],
      naturalIngredients: true,
      syntheticIngredients: true,
      allergyInfo: [],
      veganFriendly: false,
      crueltyFree: false
    },
    purchaseOptions: [],
    gender: "men",
    concentration: "EDT",
    longevity: "6-8小时",
    sillage: "中等"
  },
  {
    id: "perfume_2",
    name: "Chanel No. 5",
    brand: "香奈儿",
    description: "永恒的经典花香调香水，展现女性的优雅与魅力。",
    imageUrl: "https://images.unsplash.com/photo-1556228453-efd1b786231c?q=80&w=2836&auto=format&fit=crop",
    price: 1200,
    currency: "CNY",
    scentNotes: {
      top: ["柑橘", "aldehyde"],
      middle: ["玫瑰", "茉莉"],
      base: ["檀香", "麝香"]
    },
    ingredientAnalysis: {
      mainIngredients: ["玫瑰", "茉莉", "檀香"],
      naturalIngredients: true,
      syntheticIngredients: false,
      allergyInfo: [],
      veganFriendly: false,
      crueltyFree: false
    },
    purchaseOptions: [],
    gender: "women",
    concentration: "EDP",
    longevity: "8-10小时",
    sillage: "强烈"
  },
  {
    id: "perfume_3",
    name: "Le Labo Santal 33",
    brand: "Le Labo",
    description: "中性木质香调，带有皮革和烟草的温暖气息，适合追求个性的人士。",
    imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34d19?q=80&w=2836&auto=format&fit=crop",
    price: 1500,
    currency: "CNY",
    scentNotes: {
      top: ["檀木", "雪松"],
      middle: ["皮革", "烟草"],
      base: ["琥珀", "香草"]
    },
    ingredientAnalysis: {
      mainIngredients: ["檀木", "皮革", "烟草"],
      naturalIngredients: true,
      syntheticIngredients: true,
      allergyInfo: [],
      veganFriendly: false,
      crueltyFree: true
    },
    purchaseOptions: [],
    gender: "unisex",
    concentration: "EDP",
    longevity: "10-12小时",
    sillage: "强烈"
  }
];

/**
 * 香水推荐服务类
 */
class PerfumeRecommendationService {
  /**
   * 根据用户需求推荐香水
   * @param request 用户需求请求
   * @returns 推荐结果
   */
  async recommendPerfumes(
    request: RecommendationRequest
  ): Promise<Perfume[]> {
    try {
      console.log("收到推荐请求:", request.query);

      // 目前使用模拟数据进行演示，后续可接入真实的 AI 模型
      console.log("使用模拟数据进行推荐");
      return mockPerfumes;
    } catch (error) {
      console.error("香水推荐服务出现错误:", error);
      // 返回模拟数据作为后备方案
      return mockPerfumes;
    }
  }
}

// 创建单例实例
const perfumeRecommendationService = new PerfumeRecommendationService();

export default perfumeRecommendationService;