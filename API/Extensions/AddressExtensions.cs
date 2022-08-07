using API.DTOs;
using API.Entities;

namespace API.Extensions
{
    public static class AddressExtensions
    {
        public static AddressDto MapAddressToDto(this Address address)
        {
            return new AddressDto
            {
                FullName = address.FullName,
                Address1 = address.Address1,
                Address2 = address.Address2,
                State = address.State,
                Zip = address.Zip,
                City = address.City,
                Country = address.Country
            };
        }
    }
}