using System.Linq;
using API.Entities;

namespace API.Extensions
{
    public static class CommentExtensions
    {
        public static IQueryable<Comment> Search(this IQueryable<Comment> query, string searchTerm)
        {
            if(string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.Username.ToLower().Contains(lowerCaseSearchTerm) || p.productName.ToLower().Contains(lowerCaseSearchTerm));
        }
    }
}