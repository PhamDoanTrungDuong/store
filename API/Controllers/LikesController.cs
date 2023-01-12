using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using API.ViewModel;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
   public class LikesController : BaseController
   {
      private readonly StoreContext _context;
      private readonly IMapper _mapper;
      public LikesController(StoreContext context, IMapper mapper)
      {
         _mapper = mapper;
         _context = context;
      }

      [HttpPost]
      public async Task<ActionResult<UserLike>> AddLike(int productId)
      {
         var username = User.GetUsername();

         if (username == null) return Unauthorized(new ProblemDetails { Title = "You must Login to like" });

         var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == username);
         var product = await _context.Products.FindAsync(productId);
         var likedProduct = await _context.Likes.FirstOrDefaultAsync(x => x.LikedProductId == productId);

         if (product == null) return NotFound();

         var userLike = new UserLike
         {
            User = user,
            LikedProduct = product,
            isLike = true,
            Username = user.UserName,
            productName = product.Name,
            PictureUrl = product.PictureUrl
         };

         if(likedProduct != null)
         {
             _context.Likes.Remove(likedProduct);
         }else
         {
             _context.Likes.Add(userLike);
         }

         if (await _context.SaveChangesAsync() > 0) return Ok(_mapper.Map<LikeDto>(userLike));

         return BadRequest(new ProblemDetails { Title = "Failed to like" });
      }

      [HttpGet("get-all-like")]
      public async Task<List<UserLike>> GetLikes([FromQuery] LikeVm likeVm)
      {
            return await _context.Likes
                        .Search(likeVm.SearchTerm)
                        .OrderByDescending(x => x.LikeAt)
                        .ToListAsync();
      }

      [HttpGet("get-current-like")]
      public async Task<List<UserLike>> GetCurrentLikes()
      {
            return await _context.Likes
                        .Where(x => x.Username == User.Identity.Name)
                        .OrderByDescending(x => x.LikeAt)
                        .ToListAsync();
      }
   }
}