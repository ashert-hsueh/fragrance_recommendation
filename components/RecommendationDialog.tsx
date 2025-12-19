// 香水推荐对话框组件
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Perfume } from "@/types";

// 对话消息类型
interface ChatMessage {
  id: string;
  type: "user" | "agent";
  content: string;
  timestamp: Date;
  perfumes?: Perfume[];
}

interface RecommendationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const RecommendationDialog: React.FC<RecommendationDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // 调用推荐 API
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage.content,
          count: 3,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const agentMessage: ChatMessage = {
          id: `msg_${Date.now()}_agent`,
          type: "agent",
          content: `为您推荐以下 ${data.perfumes.length} 款香水：`,
          timestamp: new Date(),
          perfumes: data.perfumes,
        };
        setMessages((prev) => [...prev, agentMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: `msg_${Date.now()}_agent`,
          type: "agent",
          content: "抱歉，未能为您找到合适的香水推荐。请您尝试调整搜索条件。",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_agent`,
        type: "agent",
        content: "抱歉，推荐服务暂时 unavailable，请稍后再试。",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理键盘回车
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 关闭对话框
  const handleClose = () => {
    setMessages([]);
    setInputValue("");
    onClose();
  };

  // 处理卡片点击
  const handleCardClick = (perfume: Perfume) => {
    // 导航到香水详情页
    router.push(`/perfume/${perfume.id}`);
    // 关闭对话框
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* 对话框头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">香水推荐助手</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>开始与香水推荐助手对话吧！</p>
              <p className="text-sm mt-2">例如："推荐一款适合夏天的男士香水"</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>

                  {/* 显示推荐的香水卡片 */}
                  {message.perfumes && message.perfumes.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {message.perfumes.map((perfume) => (
                        <div
                          key={perfume.id}
                          onClick={() => handleCardClick(perfume)}
                          className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            {/* 香水图片 */}
                            <div className="relative w-20 h-20 bg-gray-50 rounded-md overflow-hidden">
                              <img
                                src={perfume.imageUrl}
                                alt={`${perfume.brand} ${perfume.name}`}
                                className="w-full h-full object-contain p-2"
                              />
                            </div>

                            {/* 香水信息 */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {perfume.brand} {perfume.name}
                              </h3>
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center text-xs text-gray-500">
                                  <span className="font-medium">前调：</span>
                                  <span className="ml-1 text-gray-700">
                                    {perfume.scentNotes.top.join(", ")}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <span className="font-medium">中调：</span>
                                  <span className="ml-1 text-gray-700">
                                    {perfume.scentNotes.middle.join(", ")}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <span className="font-medium">后调：</span>
                                  <span className="ml-1 text-gray-700">
                                    {perfume.scentNotes.base.join(", ")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p
                    className={`text-xs mt-2 ${
                      message.type === "user" ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的香水需求..."
              className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="flex-shrink-0 rounded-lg bg-blue-600 text-white px-4 py-3 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationDialog;