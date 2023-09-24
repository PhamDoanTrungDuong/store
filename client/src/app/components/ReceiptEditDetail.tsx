import React, { useState } from "react";
import { Control, FieldValues, UseFormRegister } from "react-hook-form";
import AppTextInputReceipt from "./AppTextInputReceipt";

interface IProps {
  data: any;
  control: Control<FieldValues, object>;
  register: UseFormRegister<FieldValues>;
  defaultValues: any
}

const ReceiptEditDetail: React.FC<IProps> = ({ data, control, register, defaultValues }) => {
  console.log(defaultValues)
   return (
    <table className="min-w-[60%] ml-10 overflow-hidden">
    <thead className=" text-gray-700">
      <tr >
        <th className="px-4 py-2 text-left"></th>
        <th className="px-4 py-2">Color</th>
        <th className="px-4 py-2">Size</th>
        <th className="px-4 py-2">Quantity</th>
        <th className="px-4 py-2">Import Number</th>
        <th className="px-4 py-2">Price</th>
      </tr>
    </thead>
    <tbody className="text-gray-600">
      {data.map((detail: any) => (
        <tr key={detail.id}>
          <td className="px-4 py-2 text-center">
          </td>
          <td className="px-4 py-2 text-center">{detail.colorsValue}</td>
          <td className="px-4 py-2 text-center">{detail.sizesValue}</td>
          <td className="px-4 py-2 text-center">{detail.quantity}</td>
          <input
            type="hidden"
						{...register(`childrenIds[${detail.parentProductId}][${detail.id}]`)}
            value={detail.id}
          />
          <td className="px-4 py-2 text-center"><AppTextInputReceipt control={control} name={`quantity[${detail.parentProductId}][${detail.id}]`} label='' /></td>
          <td className="px-4 py-2 text-center"><AppTextInputReceipt control={control} name={`price[${detail.parentProductId}][${detail.id}]`} label='' /></td>
        </tr>
      ))}
    </tbody>
  </table>
   );
 };

export default ReceiptEditDetail;
