import { LoanProduct } from "@/types/knowledge";
import { useNavigate } from "react-router-dom";

const LoanProductItem: React.FC<{ product: LoanProduct,type:string }> = ({ product, type }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/knowledge/loans_info/${type}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow cursor-pointer hover:bg-blue-50"
    >
      <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
      <p className="text-gray-700 mb-3">{product.description}</p>
        
    {!product.purposes  ? "" :
        <><p>purposes:</p><ul className="list-disc pl-5 text-gray-600 space-y-1">
          {product.purposes?.map((pur, idx) => (
            <li key={idx}>{pur}</li>
          ))}
        </ul></>}
      <p className="pt-2">advantages:</p>
      <ul className="list-disc pl-5 text-gray-600 space-y-1">
        {product.advantages.map((adv, idx) => (
          <li key={idx}>{adv}</li>
        ))}
      </ul>
    </div>
  );
};

export default LoanProductItem;
