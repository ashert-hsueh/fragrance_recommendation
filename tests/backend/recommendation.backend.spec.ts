import { expect, test } from "@playwright/test";
import { POST } from "@/app/api/recommend/route";
import perfumeRecommendationService from "@/services/perfumeAgent";
import { RecommendationSchema } from "@/services/schema";

const validRecommendation = {
  recommendations: [
    {
      name: "Santal 33",
      brand: "Le Labo",
      description: "温暖的木质皮革调，适合中性穿搭。",
      imageUrl: "https://example.com/santal.jpg",
      price: 1500,
      currency: "CNY",
      scentNotes: {
        top: ["小豆蔻"],
        middle: ["鸢尾", "紫罗兰"],
        base: ["檀香", "雪松"],
      },
      ingredientAnalysis: {
        mainIngredients: ["檀香", "雪松"],
        naturalIngredients: true,
        syntheticIngredients: true,
        allergyInfo: ["香精过敏者谨慎"],
        veganFriendly: false,
        crueltyFree: true,
      },
      purchaseOptions: [
        {
          retailer: "品牌官网",
          price: 1500,
          currency: "CNY",
          link: "https://example.com/buy",
          stockStatus: "in_stock",
        },
      ],
      gender: "unisex",
      concentration: "EDP",
      longevity: "8-10小时",
      sillage: "中等",
    },
  ],
};

test("schema accepts perfume recommendations matching the app type contract", () => {
  const parsed = RecommendationSchema.parse(validRecommendation);

  expect(parsed.recommendations).toHaveLength(1);
  expect(parsed.recommendations[0].ingredientAnalysis.naturalIngredients).toBe(
    true
  );
});

test("schema rejects old ingredient shapes that drift from the app contract", () => {
  const invalidRecommendation = structuredClone(validRecommendation);
  invalidRecommendation.recommendations[0].ingredientAnalysis.naturalIngredients = [
    "檀香",
  ] as unknown as boolean;

  expect(() => RecommendationSchema.parse(invalidRecommendation)).toThrow();
});

test("recommendation service falls back to mock data when GOOGLE_API_KEY is absent", async () => {
  const previousApiKey = process.env.GOOGLE_API_KEY;
  delete process.env.GOOGLE_API_KEY;

  const perfumes = await perfumeRecommendationService.recommendPerfumes({
    query: "推荐一款适合夏天的男士香水",
    count: 3,
  });

  process.env.GOOGLE_API_KEY = previousApiKey;

  expect(perfumes).toHaveLength(3);
  expect(perfumes[0]).toMatchObject({
    brand: "迪奥",
    name: "Sauvage",
  });
});

test("POST /api/recommend validates the query body", async () => {
  const response = await POST(
    new Request("http://localhost/api/recommend", {
      method: "POST",
      body: JSON.stringify({ query: "" }),
    }) as never
  );

  const payload = await response.json();

  expect(response.status).toBe(400);
  expect(payload).toMatchObject({
    success: false,
    error: "Invalid request",
  });
});
