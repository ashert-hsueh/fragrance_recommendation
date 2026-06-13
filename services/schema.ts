import { z } from "zod";

export const PerfumeSchema = z.object({
  name: z.string().describe("香水名称"),
  brand: z.string().describe("品牌"),
  description: z.string().describe("描述"),
  imageUrl: z.string().url().describe("产品图片 URL"),
  price: z.number().describe("官方价格"),
  currency: z.literal("CNY").describe("货币单位"),

  scentNotes: z
    .object({
      top: z.array(z.string()).describe("前调"),
      middle: z.array(z.string()).describe("中调"),
      base: z.array(z.string()).describe("后调"),
    })
    .describe("香调信息"),

  ingredientAnalysis: z
    .object({
      mainIngredients: z.array(z.string()).describe("主要成分"),
      naturalIngredients: z.boolean().describe("是否含有天然成分"),
      syntheticIngredients: z.boolean().describe("是否含有合成成分"),
      allergyInfo: z.array(z.string()).describe("过敏原信息"),
      veganFriendly: z.boolean().describe("是否适合素食主义者"),
      crueltyFree: z.boolean().describe("是否无动物实验"),
    })
    .describe("成分分析"),

  purchaseOptions: z
    .array(
      z.object({
        retailer: z.string().describe("零售商名称"),
        price: z.number().describe("价格"),
        currency: z.literal("CNY").describe("货币单位"),
        link: z.string().url().describe("购买链接"),
        stockStatus: z
          .enum(["in_stock", "out_of_stock", "low_stock"])
          .describe("库存状态"),
      })
    )
    .describe("购买选项"),

  gender: z.enum(["unisex", "men", "women"]).describe("适用性别"),
  concentration: z.string().describe("浓度"),
  longevity: z.string().describe("持久度描述"),
  sillage: z.string().describe("扩散度描述"),
}).describe("香水详细信息");

export const RecommendationSchema = z.object({
  recommendations: z.array(PerfumeSchema).describe("推荐的香水列表"),
}).describe("香水推荐响应格式");
