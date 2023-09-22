import React, { useState } from "react";

interface IProps {
  data: any;
  selectedItems: any;
  toggleItemSelection: any;
  selectedParentItems: any;
}

const ProductDetailsTable: React.FC<IProps> = ({ data, selectedItems, toggleItemSelection, selectedParentItems }) => {
   return (
    <table className="min-w-[60%] ml-10 overflow-hidden">
    <thead className=" text-gray-700">
      <tr >
        <th className="px-4 py-2 text-left"></th>
        <th className="px-4 py-2">Color</th>
        <th className="px-4 py-2">Size</th>
        <th className="px-4 py-2">Quantity</th>
      </tr>
    </thead>
    <tbody className="text-gray-600">
      {data.map((detail: any) => (
        <tr key={detail.id}>
          <td className="px-4 py-2 text-center">
            <input
              type="checkbox"
              checked={selectedItems.includes(detail.id)}
              onChange={() => toggleItemSelection(detail.id)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
          </td>
          <td className="px-4 py-2 text-center">{detail.colorsValue}</td>
          <td className="px-4 py-2 text-center">{detail.sizesValue}</td>
          <td className="px-4 py-2 text-center">{detail.quantity}</td>
        </tr>
      ))}
    </tbody>
  </table>
   );
 };

export default ProductDetailsTable;
