using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.ViewModel
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();
            CreateMap<MemberUpdateDto, Address>();
            CreateMap<Comment, CommentDto>();
            CreateMap<UserLike, LikeDto>();
            CreateMap<ProductDiscount, DiscountDto>();
            CreateMap<SelectedAddress, SelectedAddressDto>();
        }
    }
}