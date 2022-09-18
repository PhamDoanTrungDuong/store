using API.Data;

namespace API.Controllers
{
   public class LikeController : BaseController
   {
      private readonly StoreContext _context;
      public LikeController(StoreContext context)
      {
         _context = context;
      }
   }
}