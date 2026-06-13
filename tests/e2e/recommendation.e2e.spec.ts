import { expect, test } from "@playwright/test";

const perfume = {
  id: "perfume_test_1",
  name: "Santal 33",
  brand: "Le Labo",
  description: "温暖的中性木质香，带有檀香、雪松和微妙皮革气息。",
  imageUrl: "https://example.com/santal-missing.jpg",
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
    allergyInfo: [],
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
};

test("user can request recommendations and open a perfume detail page", async ({
  page,
}) => {
  await page.route("https://example.com/santal-missing.jpg", async (route) => {
    await route.fulfill({ status: 404, body: "" });
  });

  await page.route("**/api/recommend", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        perfumes: [perfume],
        query: "推荐一款适合夏天的男士香水",
        timestamp: new Date().toISOString(),
      }),
    });
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "找到真正适合你的那一瓶香水" })).toBeVisible();

  await page.getByRole("button", { name: /开始推荐/ }).click();
  await expect(page.getByRole("heading", { name: "香水推荐助手" })).toBeVisible();

  await page
    .getByPlaceholder("输入您的香水需求...")
    .fill("推荐一款适合夏天的男士香水");
  await page.keyboard.press("Enter");

  await expect(page.getByText("为您推荐以下 1 款香水：")).toBeVisible();
  await expect(page.getByText("Le Labo Santal 33")).toBeVisible();
  await expect(page.getByLabel("Le Labo Santal 33 图片暂不可用")).toBeVisible();

  await page.getByText("Le Labo Santal 33").click();

  await expect(page).toHaveURL(/\/perfume\/perfume_test_1$/);
  await expect(page.getByRole("heading", { name: "Santal 33" })).toBeVisible();
  await expect(page.getByLabel("Le Labo Santal 33 图片暂不可用")).toBeVisible();
  await expect(page.getByText("前调：小豆蔻")).toBeVisible();
  await expect(page.getByText("中调：鸢尾, 紫罗兰")).toBeVisible();
  await expect(page.getByText("后调：檀香, 雪松")).toBeVisible();

  await page.getByRole("button", { name: "返回" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: "香水推荐助手" })).toBeVisible();
  await expect(page.getByText("推荐一款适合夏天的男士香水")).toBeVisible();
  await expect(page.getByText("为您推荐以下 1 款香水：")).toBeVisible();
  await expect(page.getByText("Le Labo Santal 33")).toBeVisible();
});
