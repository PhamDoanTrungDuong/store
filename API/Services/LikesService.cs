using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
      public class LikesService
      {
            private readonly StoreContext _context;
            public LikesService(StoreContext context)
            {
                  _context = context;
            }

            public async Task<UserLike> GetProductLikes(int userId, int likedProductId)
            {
                return await _context.Likes.FindAsync(userId, likedProductId);
            }

            // public async Task<IEnumerable<LikeDto>> GetProductLikes(string predicate, int userId, int productId)
            // {
            //     return null;
            // }

            public async Task<Product> GetProductWithLikes(int productId)
            {
                return await _context.Products
                    .Include(x => x.LikedByUsers)
                    .FirstOrDefaultAsync(x => x.Id == productId);
            }
      }
}