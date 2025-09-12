import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient, FAQCategoriesResponse, FAQResponse, FAQItem, UpdateFAQResponse } from "@/lib/api";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Save, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {t} from "i18next"

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<FAQCategoriesResponse>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");

  useEffect(() => {
    setLoading(true);
    apiClient
      .getFAQCategories(i18n.language)
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [i18n.language]);

  useEffect(() => {
    if (selectedCategory) {
      setLoadingItems(true);
      apiClient
        .getFAQByCategory(selectedCategory, i18n.language, currentPage, pageSize)
        .then((data: FAQResponse) => {
          setFaqItems(data.items);
          setTotalItems(data.total);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingItems(false));
    }
  }, [selectedCategory, i18n.language, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startEditing = (item: FAQItem) => {
    setEditingItemId(item.id);
    setEditedQuestion(item.question);
    setEditedAnswer(item.answer);
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditedQuestion("");
    setEditedAnswer("");
  };

  const saveEditing = async (id: number) => {
    if (!selectedCategory) return;
    try {
      const updatedItem: FAQItem = {
        id,
        question: editedQuestion,
        answer: editedAnswer,
      };
      const response: UpdateFAQResponse = await apiClient.updateFAQItem(
        selectedCategory,
        id,
        updatedItem,
        i18n.language
      );
      setFaqItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? response.updated_item : item
        )
      );
      setEditingItemId(null);
      setEditedQuestion("");
      setEditedAnswer("");
    } catch (err) {
      console.error("Failed to update FAQ item:", err);
    }
  };

  const tabs = categories.map((cat) => ({
    id: cat,
    label: cat,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <PageHeader
          title={t('nav.faq')}
        />

        {/* Categories */}
        <div className="mb-8">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">{t("loading", "Загрузка...")}</span>
            </div>
          ) : categories.length > 0 ? (
            <div className="relative">
              <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`
                      relative flex-1 px-6 py-3 rounded-lg font-medium text-sm 
                      transition-all duration-300 ease-out
                      ${selectedCategory === tab.id 
                        ? "bg-white text-blue-600 shadow-lg shadow-blue-100/50 transform scale-[1.02]" 
                        : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                      }
                    `}
                    onClick={() => {
                      setSelectedCategory(tab.id);
                      setCurrentPage(1);
                      setEditingItemId(null);
                    }}
                  >
                    {t(`faq.${tab.label}`)}
                    
                    {selectedCategory === tab.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">
              {t("faq.noCategories", "Категории не найдены")}
            </p>
          )}
        </div>

        {/* FAQ Items */}
        {selectedCategory && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
              </h2>
              <span className="text-sm text-gray-500">
                Всего: {totalItems}
              </span>
            </div>

            {loadingItems ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">{t("loading", "Загрузка...")}</span>
              </div>
            ) : faqItems.length > 0 ? (
              <div className="space-y-6">
                {faqItems.map((item) => (
                  <Card key={item.id} className="border border-gray-200">
                    <CardContent className="p-6">
                      {editingItemId === item.id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Вопрос
                            </label>
                            <Textarea
                              value={editedQuestion}
                              onChange={(e) => setEditedQuestion(e.target.value)}
                              placeholder={t("faq.questionPlaceholder", "Введите вопрос")}
                              className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Ответ
                            </label>
                            <Textarea
                              value={editedAnswer}
                              onChange={(e) => setEditedAnswer(e.target.value)}
                              placeholder={t("faq.answerPlaceholder", "Введите ответ")}
                              className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => saveEditing(item.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              {t("faq.save", "Сохранить")}
                            </Button>
                            <Button
                              onClick={cancelEditing}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <X className="h-4 w-4 mr-2" />
                              {t("faq.cancel", "Отменить")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                              {item.question}
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditing(item)}
                              className="ml-4 border-gray-300 hover:bg-gray-50 flex-shrink-0"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              {t("faq.edit", "Редактировать")}
                            </Button>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    total={totalItems}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            ) : (
              <Card className="border border-gray-200">
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500 text-lg">
                    {t("faq.noItems", "Вопросы не найдены")}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    В этой категории пока нет вопросов
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}