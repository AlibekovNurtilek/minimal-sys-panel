import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { schemasApiClient, Schema, SchemasResponse } from "@/api/schema";
import { Pagination } from "@/components/Pagination";

export default function Schemes() {
  const { t, i18n } = useTranslation();
  const [schemasResponse, setSchemasResponse] = useState<SchemasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSchema, setEditingSchema] = useState<Schema | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchSchemas = async () => {
      setLoading(true);
      try {
        const response = await schemasApiClient.getSchemas(i18n.language, page, pageSize);
        setSchemasResponse(response);
        setError(null);
      } catch (err) {
        setError(t("errors.failedToLoadSchemas"));
      } finally {
        setLoading(false);
      }
    };
    fetchSchemas();
  }, [page, i18n.language, t]); // Add i18n.language and t to dependencies

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleEditClick = (schema: Schema) => {
    setEditingSchema(schema);
    setEditedDescription(schema.description);
  };

  const handleSaveEdit = async () => {
    if (!editingSchema) return;
    try {
      await schemasApiClient.updateSchema(
        { ...editingSchema, description: editedDescription },
        i18n.language // Use current language
      );
      setSchemasResponse((prev) =>
        prev
          ? {
              ...prev,
              schemas: prev.schemas.map((s) =>
                s.name === editingSchema.name
                  ? { ...s, description: editedDescription }
                  : s
              ),
            }
          : prev
      );
      setEditingSchema(null);
      setEditedDescription("");
    } catch (err) {
      setError(t("errors.failedToUpdateSchema"));
    }
  };

  const handleCancelEdit = () => {
    setEditingSchema(null);
    setEditedDescription("");
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between space-x-4 px-6">
        <h1 className="text-4xl font-bold text-gray-900">{t("pages.schemes")} 🛠️</h1>
        {schemasResponse && (
          <span className="text-gray-500 text-lg">
            {t("total")}: {schemasResponse.total}
          </span>
        )}
      </div>

      {/* Schemas */}
      <Card className="shadow-lg rounded-2xl">
        <CardContent>
          {loading && <p className="text-gray-500">{t("loading")}</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && schemasResponse && (
            <div className="space-y-4">
              <ul className="space-y-3">
                {schemasResponse.schemas.map((schema) => (
                  <li
                    key={schema.name}
                    className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-start"
                  >
                    {editingSchema?.name === schema.name ? (
                      <div className="flex-1 space-y-3">
                        <p className="font-semibold text-gray-800">{schema.name}</p>
                        <Input
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          placeholder={t("placeholders.schemaDescription")}
                          className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveEdit} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            {t("common.save")}
                          </Button>
                          <Button variant="outline" onClick={handleCancelEdit}>
                            {t("common.cancel")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{schema.name}</p>
                        <p
                          className="text-gray-500 mt-1 cursor-pointer hover:text-gray-900 transition-colors"
                          onClick={() => handleEditClick(schema)}
                        >
                          {schema.description || t("placeholders.noDescription")}
                        </p>
                      </div>
                    )}
                    {editingSchema?.name !== schema.name && (
                      <Button
                        variant="outline"
                        onClick={() => handleEditClick(schema)}
                        className="h-10 self-center"
                      >
                        {t("common.edit")}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>

              <Pagination
                currentPage={schemasResponse.page}
                pageSize={schemasResponse.page_size}
                total={schemasResponse.total}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}