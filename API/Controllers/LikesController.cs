using System.Threading.Tasks;
using API.Data;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
      public class LikesController : BaseController
      {
            private readonly LikesService _likes;
            private readonly StoreContext _context;
            public LikesController(LikesService likes, StoreContext context)
            {
                  _context = context;
                  _likes = likes;
            }

            // [HttpPost]
            // public async Task<ActionResult> AddLike(string username, int productId)
            // {
            //     return null;
            // }
      }
}