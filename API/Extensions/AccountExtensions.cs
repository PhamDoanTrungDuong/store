using System.Linq;
using API.Entities;

namespace API.Extensions
{
    public static class AccountExtensions
    {
        public static IQueryable<User> Search(this IQueryable<User> query, string searchTerm)
        {
            if(string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.UserName.ToLower().Contains(lowerCaseSearchTerm));
        }
    }
}