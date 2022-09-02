using System.Linq;
using API.Entities;

namespace API.Extensions
{
    public static class CategoriesExtension
    {
        public static IQueryable<Category> Search(this IQueryable<Category> query, string searchTerm)
        {
            if(string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }
    }
}