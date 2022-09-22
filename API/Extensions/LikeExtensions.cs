using System.Linq;
using API.Entities;

namespace API.Extensions
{
    public static class LikeExtensions
    {
        public static IQueryable<UserLike> Search(this IQueryable<UserLike> query, string searchTerm)
        {
            if(string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.Username.ToLower().Contains(lowerCaseSearchTerm) || p.productName.ToLower().Contains(lowerCaseSearchTerm));
        }
    }
}