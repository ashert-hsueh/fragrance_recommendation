// 香水推荐 API 路由
import { NextRequest, NextResponse } from "next/server";
import {
  RecommendationRequest,
  RecommendationResponse,
  ErrorResponse,
} from "@/types";
import perfumeRecommendationService from "@/services/perfumeAgent";

/**
 * POST /api/recommend - 获取香水推荐
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body: RecommendationRequest = await request.json();

    // 验证请求参数
    if (!body.query || typeof body.query !== "string") {
      const errorResponse: ErrorResponse = {
        success: false,
        error: "Invalid request",
        message: "Query parameter is required and must be a string",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 调用推荐服务
    const perfumes = await perfumeRecommendationService.recommendPerfumes(
      body
    );

    // 构造成功响应
    const response: RecommendationResponse = {
      success: true,
      perfumes: perfumes,
      query: body.query,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API error:", error);

    // 构造错误响应
    const errorResponse: ErrorResponse = {
      success: false,
      error: "Internal server error",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * GET /api/recommend - 健康检查
 */
export async function GET() {
  const response = {
    success: true,
    message: "Perfume recommendation API is running",
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(response);
}
