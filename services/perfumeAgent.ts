// 香水推荐 Agent 服务
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { Perfume, RecommendationRequest } from "@/types";

// 环境变量验证
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error(
    "GOOGLE_API_KEY is not set in the environment variables"
  );
}

// 初始化 Google Generative AI 模型
const model = new ChatGoogleGenerativeAI({
  model: "gemini-pro",
  apiKey: apiKey,
  temperature: 0.7,
});

// 香水推荐提示模板
const PERFUME_RECOMMENDATION_TEMPLATE = `
你是一位专业的香水推荐顾问。根据用户的需求，为他们推荐合适的香水。

用户需求：{query}

请推荐{count}款符合用户需求的香水，并按照以下格式返回每款香水的详细信息：

每款香水的信息应该包含：
1. name: 香水名称（字符串）
2. brand: 品牌（字符串）
3. description: 香水描述（字符串，不超过200字）
4. imageUrl: 产品图片URL（请提供真实可访问的图片链接，例如来自品牌官网或大型零售商）
5. price: 官方价格（数字，单位为人民币）
6. currency: 货币单位（字符串，统一为"CNY"）
7. scentNotes: 香调信息（对象，包含top、middle、base三个数组）
8. ingredientAnalysis: 成分分析（对象）
9. purchaseOptions: 购买途径与比价（数组，至少包含3个购买选项）
10. gender: 适用性别（字符串，只能是"unisex"、"men"或"women"）
11. concentration: 浓度（字符串，例如"EDT"、"EDP"、"Parfum"等）
12. longevity: 持久度描述（字符串，例如"4-6小时"、"6-8小时"等）
13. sillage: 扩散度描述（字符串，例如"柔和"、"中等"、"强烈"等）

注意事项：
- 请确保推荐的香水信息真实可靠
- 每款香水的purchaseOptions应该包含不同的零售商，包括线上和线下渠道
- 请提供准确的价格信息和库存状态
- 图片链接必须是可访问的，避免使用需要登录或权限的链接
- 请用中文返回所有内容

请严格按照JSON格式返回数据，不要包含任何额外的文本或解释。
`;

// 结构化输出解析器
const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
  perfumes: "推荐的香水列表，包含若干款香水的详细信息",
});

// 创建提示模板
const promptTemplate = PromptTemplate.fromTemplate(
  PERFUME_RECOMMENDATION_TEMPLATE
);

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
      // 生成提示
      const formattedPrompt = await promptTemplate.format({
        query: request.query,
        count: request.count || 3,
      });

      // 调用模型
      const response = await model.invoke(formattedPrompt);

      // 解析响应
      const parsedResult = await outputParser.parse(
        response.content.toString()
      );

      // 为每款香水添加唯一ID
      const perfumesWithId = (parsedResult.perfumes as unknown as Omit<Perfume, "id">[]).map(
        (perfume: Omit<Perfume, "id">, index: number) => ({
          ...perfume,
          id: `perfume_${Date.now()}_${index}`,
        })
      );

      return perfumesWithId;
    } catch (error) {
      console.error("Error recommending perfumes:", error);
      throw new Error(
        "Failed to generate perfume recommendations. Please try again."
      );
    }
  }
}

// 创建单例实例
const perfumeRecommendationService = new PerfumeRecommendationService();

export default perfumeRecommendationService;
