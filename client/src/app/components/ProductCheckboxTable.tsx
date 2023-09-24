import React, { useState } from "react";
import ProductDetailsTable from "./ProductDetailsTable";

interface IProps {
	data: any;
  onSelectedItemsChange: any;
}

const ProductCheckboxTable: React.FC<IProps> = ({ data, onSelectedItemsChange }) => {

	const [selectedItems, setSelectedItems] = useState<any>([]);
	const [selectedParentItems, setSelectedParentItems] = useState<any>([]);
  onSelectedItemsChange([...selectedItems, ...selectedParentItems].length, selectedItems, selectedParentItems)

//   console.log(selectedItems)
//   console.log(selectedParentItems)

	// Function to toggle item selection
	const toggleItemSelection = (productId: any, parentId: any) => {
		if (selectedItems.includes(productId)) {
			setSelectedItems(selectedItems.filter((id: any) => id !== productId));
		} else {
			setSelectedItems([...selectedItems, productId]);
			!selectedParentItems.includes(parentId) && setSelectedParentItems([...selectedParentItems, parentId]);
		}
	};
	const toggleParentSelection = (productId: any) => {
		if (selectedParentItems.includes(productId)) {
			setSelectedParentItems(selectedParentItems.filter((id: any) => id !== productId));
		} else {
			setSelectedParentItems([...selectedParentItems, productId]);
		}
	};

	// if (editMode) return <ReceiptForm cancelEdit={cancelEdit} />;

	return (
		<table className="table-auto w-full bg-white  overflow-hidden">
			<thead className="text-gray-700">
				<tr>
					<th className="px-3 text-center py-2"></th>
					<th className="px-4 py-2 text-left">Product Name</th>
					<th className="px-4 py-2 text-left">Unit</th>
					<th className="px-4 py-2">Total Quantity</th>
				</tr>
			</thead>
			<tbody className="text-gray-600">
				{data.map((product: any) => (
					<React.Fragment key={product.productId}>
						<tr>
							<td className="px-3 text-center py-2">
								<input
									type="checkbox"
									checked={selectedParentItems.includes(
										product.productId
									)}
									onChange={() =>
										toggleParentSelection(
											product.productId
										)
									}
									className="form-checkbox h-5 w-5 text-indigo-600"
								/>
							</td>
							<td className="px-4 py-2 flex items-center gap-4">
								<img
									src={product.pictureUrl}
									alt={product.name}
									style={{
										height: 80,
										marginRight: 20,
                    borderRadius: 10
									}}
								/>
								<span className="text-medium font-medium">{product.name}</span>
							</td>
							<td className="px-4 py-2">
								$
							</td>
							<td className="px-4 py-2 text-center text-medium font-medium">
								{product.quantity}
							</td>
						</tr>
						{product.productDetails &&
							product.productDetails.length > 0 && (
								<tr className="border-b border-gray-200">
									<td></td>
									<td col-span="2">
										<ProductDetailsTable
											data={
												product.productDetails
											}
											selectedItems={
												selectedItems
											}
											toggleItemSelection={
												toggleItemSelection
											}
                      selectedParentItems={selectedItems}
										/>
									</td>
								</tr>
							)}
					</React.Fragment>
				))}
			</tbody>
		</table>
	);
};

export default ProductCheckboxTable;
