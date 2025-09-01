import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { promptsApiClient, Prompt, PromptResponse, UpdatePromptResponse } from "@/api/system_prompt";

export default function Prompts() {
  const { t, i18n } = useTranslation();
  const [prompts, setPrompts] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [editPrompt, setEditPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false);

  // Перезагружаем промты при смене языка
  useEffect(() => {
    fetchPrompts();
  }, [i18n.language]);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const response = await promptsApiClient.getPrompts(i18n.language);
      setPrompts(response);
      if (response.length > 0) {
        fetchPrompt(response[0]);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load prompts");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrompt = async (key: string) => {
    setLoading(true);
    try {
      const response: PromptResponse = await promptsApiClient.getPrompt(key, i18n.language);
      setSelectedPrompt(response);
      setEditPrompt(response);
      setEditing(false);
      setError(null);
    } catch (err) {
      setError(`Failed to load prompt ${key}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelClick = () => {
    if (selectedPrompt) {
      setEditPrompt(selectedPrompt);
    }
    setEditing(false);
    setError(null);
  };

  const handleSaveClick = async () => {
    if (!editPrompt) return;

    setLoading(true);
    try {
      const response: UpdatePromptResponse = await promptsApiClient.updatePrompt(editPrompt, i18n.language);
      if (response.status === "success") {
        setSelectedPrompt(editPrompt);
        setEditing(false);
        setError(null);
      }
    } catch (err) {
      setError(`Failed to update prompt ${editPrompt.key}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = prompts.map((key) => ({ id: key, label: key }));

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-foreground">{t('pages.prompts')}</h1>

      {/* Табы */}
      <div className="relative mb-6">
        <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                relative flex-1 px-6 py-3 rounded-lg font-medium text-sm 
                transition-all duration-300 ease-out
                ${selectedPrompt?.key === tab.id
                  ? "bg-white text-blue-600 shadow-lg shadow-blue-100/50 transform scale-[1.02]"
                  : "text-gray-600 hover:text-gray-800 hover:bg-white/70"
                }
              `}
              onClick={() => fetchPrompt(tab.id)}
            >
              {t(`promts.${tab.label}`)}
              {selectedPrompt?.key === tab.id && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Загрузка...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {selectedPrompt && editPrompt && (
        <Card>
          <CardContent className="mt-4">
            {editing ? (
              <div className="space-y-4">
                <Textarea
                  value={editPrompt.template}
                  onChange={(e) =>
                    setEditPrompt({ ...editPrompt, template: e.target.value })
                  }
                  className="h-64 w-full resize-none focus-visible:ring-0 focus-visible:ring-offset-0 border-none shadow-none bg-gray-50"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <Button onClick={handleSaveClick} disabled={loading}>
                    {loading ? t("common.loading") : t("common.save")}
                  </Button>
                  <Button variant="outline" onClick={handleCancelClick} disabled={loading}>
                    {t("common.cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 cursor-text" onClick={handleEditClick}>
                <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded hover:bg-gray-200 transition-colors">
                  {selectedPrompt.template}
                </pre>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick();
                  }}
                >
                  {t("common.edit")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
