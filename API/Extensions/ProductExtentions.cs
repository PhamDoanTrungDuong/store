using System.Linq;
using API.Entities;
using System.Collections.Generic;

namespace API.Extensions
{
    public static class ProductExtentions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
        {
            if(string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);

            query = orderBy switch
                {
                  "latest" => query.OrderByDescending(p => p.Id),
                  "name" => query.OrderBy(p => p.Name),
                  "price" => query.OrderBy(p => p.Price),
                  "priceDesc" => query.OrderByDescending(p => p.Price),
                  _ => query.OrderByDescending(p => p.Id),
                };

            return query;
        }
        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if(string.IsNullOrEmpty(searchTerm)) return query;

            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {
            var brandList = new List<string>();
            var typeList = new List<string>();

            if(!string.IsNullOrEmpty(brands))
                brandList.AddRange(brands.ToLower().Split(",").ToList());

            if(!string.IsNullOrEmpty(types))
                typeList.AddRange(types.ToLower().Split(",").ToList());

            query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
            query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Category.Name.ToLower()));

            return query;
        }


    }
}