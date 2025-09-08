import { LoanProduct } from "@/types/knowledge";
import LoanProductItem from "./LoanProductItem";

const LoanProductsTab: React.FC<{ data: LoanProduct[] }> = ({ data }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {data.map((product) => (
       <LoanProductItem product={product} key={product.type} type={product.type}/>
    ))}
  </div>
);

export default LoanProductsTab