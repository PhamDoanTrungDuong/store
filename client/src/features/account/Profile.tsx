import React, { useEffect } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import agent from '../../app/api/agent';
import ProfileForm from './ProfileForm';

const Profile: React.FC = () => {

  const methods = useForm({
		mode: "all",
	});

	useEffect(() => {
		agent.Account.currentUser().then((res) => {
			if (res) {
				methods.reset({
					...methods.getValues(),
					...res,
					...res.address,
				});
			}
		});
	}, [methods]);

	async function handleSubmitData(data: FieldValues) {
            try {
                if (data) {
                    let response = await agent.Profile.updateProfile(data);
			  if(response)
			  {
				Swal.fire({
					icon: 'success',
					title: 'Update Profile Successful',
					showConfirmButton: false,
					timer: 1500
				    })
			  }else{
				Swal.fire({
					icon: 'error',
					title: 'Failed To Update Profile',
					showConfirmButton: false,
					timer: 1500
				    })
			  }
                }
            } catch (error) {
                console.log(error)
            }
        }

  return (
    <div className="h-[800px] mt-5 p-5">
	<FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmitData)}>
              <ProfileForm />
		  <button type="submit" className="bg-indigo-600 border border-indigo-600 text-white px-4 p-2 w-full rounded-xl shadow-xl mt-10 hover:shadow-2xl my-2 hover:bg-transparent hover:text-indigo-600 duration-200">Save Changes</button>
          </form>
      </FormProvider>

    </div>
  )
}

export default Profile