import { LoanProduct } from "@/types/knowledge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Edit, Check, X } from "lucide-react";

interface Props {
  product: LoanProduct;
  type: string;
  onSave?: (product: LoanProduct) => void;
}

const LoanProductItem: React.FC<Props> = ({ product, type, onSave }) => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState<LoanProduct>(product);

  const handleClick = () => {
    if (!editMode) navigate(`/knowledge/loans_info/${type}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditedProduct(product);
    setEditMode(false);
  };

  const handleSaveClick = () => {
    onSave?.(editedProduct);
    setEditMode(false);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative border rounded-xl p-4 sm:p-5 md:p-6 shadow-md transition-all w-full 
        ${editMode ? "bg-blue-50 shadow-lg" : "hover:shadow-xl hover:bg-blue-50"} 
        cursor-pointer`}
    >
      {editMode ? (
        <div className="space-y-4">
          {/* Название */}
          <div>
            <label className="font-semibold text-gray-700 text-sm sm:text-base">Название</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 sm:p-2.5 focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={editedProduct.name}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, name: e.target.value })
              }
            />
          </div>

          {/* Описание */}
          <div>
            <label className="font-semibold text-gray-700 text-sm sm:text-base">Описание</label>
            <textarea
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 sm:p-2.5 focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={editedProduct.description || ""}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, description: e.target.value })
              }
            />
          </div>

          {/* Purposes */}
          <div>
            <label className="font-semibold text-gray-700 text-sm sm:text-base">Purposes (через запятую)</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 sm:p-2.5 focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={editedProduct.purposes?.join(", ") || ""}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  purposes: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          </div>

          {/* Advantages */}
          <div>
            <label className="font-semibold text-gray-700 text-sm sm:text-base">Advantages (через запятую)</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 sm:p-2.5 focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={editedProduct.advantages?.join(", ") || ""}
              onChange={(e) =>
                setEditedProduct({
                  ...editedProduct,
                  advantages: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          </div>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2 justify-end">
            <button
              onClick={handleSaveClick}
              className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm sm:text-base transition"
            >
              <Check size={16} /> Сохранить
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm sm:text-base transition"
            >
              <X size={16} /> Отмена
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-700 mb-3 text-sm sm:text-base">{product.description}</p>

          {product.purposes?.length > 0 && (
            <>
              <p className="font-semibold text-sm sm:text-base">Purposes:</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-2 text-sm sm:text-base">
                {product.purposes.map((pur, idx) => (
                  <li key={idx}>{pur}</li>
                ))}
              </ul>
            </>
          )}

          {product.advantages?.length > 0 && (
            <>
              <p className="font-semibold text-sm sm:text-base">Advantages:</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm sm:text-base">
                {product.advantages.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>
            </>
          )}

          {hover && (
            <Edit
              onClick={handleEditClick}
              className="absolute top-3 right-3 text-blue-500 hover:text-blue-700"
            />
          )}
        </>
      )}
    </div>
  );
};

export default LoanProductItem;
