// 香水推荐类型定义

// 香调信息
export interface ScentNotes {
  top: string[];    // 前调
  middle: string[]; // 中调
  base: string[];   // 后调
}

// 购买途径与比价信息
export interface PurchaseOption {
  retailer: string;  // 零售商名称
  price: number;     // 价格
  currency: string;  // 货币单位
  link: string;      // 购买链接
  stockStatus: 'in_stock' | 'out_of_stock' | 'low_stock'; // 库存状态
}

// 成分分析信息
export interface IngredientAnalysis {
  mainIngredients: string[];       // 主要成分
  naturalIngredients: boolean;     // 是否含有天然成分
  syntheticIngredients: boolean;   // 是否含有合成成分
  allergyInfo: string[];           // 过敏信息
  veganFriendly: boolean;          // 是否 vegan 友好
  crueltyFree: boolean;            // 是否 cruelty free
}

// 香水详细信息
export interface Perfume {
  id: string;                       // 唯一标识符
  name: string;                     // 香水名称
  brand: string;                    // 品牌
  description: string;              // 描述
  imageUrl: string;                 // 产品图片 URL
  price: number;                    // 官方价格
  currency: string;                 // 货币单位
  scentNotes: ScentNotes;          // 香调信息
  ingredientAnalysis: IngredientAnalysis; // 成分分析
  purchaseOptions: PurchaseOption[]; // 购买途径与比价
  gender: 'unisex' | 'men' | 'women'; // 适用性别
  concentration: string;            // 浓度 (EDT, EDP, Parfum 等)
  longevity: string;                 // 持久度描述
  sillage: string;                   // 扩散度描述
}

// API 请求参数
export interface RecommendationRequest {
  query: string;                    // 用户自然语言查询
  count?: number;                   // 推荐数量 (默认 3)
}

// API 响应结果
export interface RecommendationResponse {
  success: boolean;                 // 请求是否成功
  perfumes: Perfume[];              // 推荐的香水列表
  query: string;                     // 用户查询内容
  timestamp: string;                 // 响应时间戳
}

// 错误响应
export interface ErrorResponse {
  success: boolean;
  error: string;
  message?: string;
}
