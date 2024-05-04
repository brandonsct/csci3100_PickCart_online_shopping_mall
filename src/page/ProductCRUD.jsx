import React from "react";
import ProductTable from "../Components/productCRUD/ProductTable";
/**
 * Renders the ProductCRUD component.
 *
 * @returns {JSX.Element} The rendered ProductCRUD component.
 */
const ProductCRUD = () => {
  return (
    <div class="overflow-x-auto w-full m-6">
      <ProductTable />
    </div>
  );
};

export default ProductCRUD;
