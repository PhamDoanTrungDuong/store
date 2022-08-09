import * as React from "react";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import AppCheckbox from "../../app/components/AppCheckbox";

const AddressForm: React.FC = () => {
  const { control, formState } = useFormContext();
  return (
    <>
      <h6 className='text-xl font-medium my-2'>
        Shipping address
      </h6>
        <div>
          <div className="py-4">
            <AppTextInput control={control} name="fullName" label="Full Name" />
          </div>
          <div className="py-4">
            <AppTextInput control={control} name="address1" label="Address 1" />
          </div>
          <div className="py-4">
            <AppTextInput control={control} name="address2" label="Address 2" />
          </div>
          <div className="grid grid-cols-2 py-4">
            <div className="pr-2">
              <AppTextInput control={control} name="city" label="City" />
            </div>
            <div className="pl-2">
              <AppTextInput control={control} name="state" label="State" />
            </div>
          </div>
          <div className="grid grid-cols-2 py-4">
            <div className="pr-2">
              <AppTextInput control={control} name="zip" label="Zip" />
            </div>
            <div className="pl-2">
              <AppTextInput control={control} name="country" label="Country" />
            </div>
          </div>
          <div>
            <AppCheckbox name='saveAddress' label='Save this as the default address' control={control} disabled={!formState.isDirty} />
          </div>
        </div>
    </>
  );
};

export default AddressForm;
