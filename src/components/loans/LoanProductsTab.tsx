import { useState, useEffect } from "react";
import { LoanProduct } from "@/types/knowledge";
import LoanProductItem from "./LoanProductItem";
import { updateLoanProducts } from "@/api/knowledge";
interface Props {
  data: LoanProduct[];
  lang?: string;
  onUpdate?: (updated: LoanProduct) => void; // чтобы обновлять родителя
}

const LoanProductsTab: React.FC<{
  data: LoanProduct[];
  onUpdate: (updatedProducts: LoanProduct[]) => void;
}> = ({ data, onUpdate }) => {
  const [products, setProducts] = useState<LoanProduct[]>(data);

  // Синхронизация локального состояния с пропсом data
  useEffect(() => {
    setProducts(data);
  }, [data]);

const handleSave = async (updatedProduct: LoanProduct) => {
  try {
    // Создаём новый массив с обновлённым продуктом
    const updatedProducts = products.map((p) =>
      p.type === updatedProduct.type ? updatedProduct : p
    );

    const updatedList = await updateLoanProducts(updatedProducts, "ru");
    setProducts(updatedList); // теперь обновляется весь массив
    onUpdate(updatedList);    // обновляем родителя
    alert("Изменения сохранены!");
  } catch (err: any) {
    console.error(err);
    alert("Ошибка: " + err.message);
  }
};



  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <LoanProductItem
          key={product.type}
          product={product}
          type={product.type}
          onSave={handleSave}
        />
      ))}
    </div>
  );
};

export default LoanProductsTab;