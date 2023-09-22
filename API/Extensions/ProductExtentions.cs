using System.Drawing;
using System.Linq;
using API.Entities;
using System.Collections.Generic;
using System;
using API.DTOs;
using Microsoft.EntityFrameworkCore;

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

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm) || p.Brand.ToLower().Contains(lowerCaseSearchTerm) || p.Type.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types, string minPrice, string maxPrice)
        {
            var brandList = new List<string>();
            var typeList = new List<string>();

            if(!string.IsNullOrEmpty(brands))
                brandList.AddRange(brands.ToLower().Split(",").ToList());

            if(!string.IsNullOrEmpty(types))
                typeList.AddRange(types.ToLower().Split(",").ToList());

            if(!string.IsNullOrEmpty(minPrice) && !string.IsNullOrEmpty(maxPrice)){
                query = query.Where(p => p.Price >= Int64.Parse(minPrice) && p.Price <= Int64.Parse(maxPrice));
            }

            query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
            query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Category.Name.ToLower()));

            return query;
        }
        public static IQueryable<ProductReceiptDto> ProjectOrderToOrderDto(this IQueryable<Product> query)
        {
            return query
                .Select(product => new ProductReceiptDto
                {
                    ProductId = product.Id,
                    Name = product.Name,
                    Quantity = product.QuantityInStock,
                    PictureUrl = product.PictureUrl,
                    ProductDetails = product.ProductDetails.Select(item => new ProductReceiptDetailsDto
                    {
                        Id = item.Id,
                        ParentProductId = product.Id,
                        ColourId = item.ColourId,
                        ColorsValue = item.ColourValue,
                        SizeId = item.SizeId,
                        SizesValue = item.SizeValue,
                        Quantity = item.Quantity,
                    }).ToList()
                });
        }

        public static IQueryable<ReceiptDto> ProjectReceiptToReceiptDto(this IQueryable<Receipt> query)
        {
            return query
                .Select(receipt => new ReceiptDto
                {
                    Id = receipt.Id,
                    DateCreate = receipt.DateCreate,
                    PartnerId = receipt.PartnerId,
                    Status = receipt.Status,
                    Total = receipt.Total,
                    ReceiptDetails = receipt.ReceiptDetails.Select(item => new ReceiptDetailsDto
                    {
                        Id = item.Id,
                        ReceiptId = item.ReceiptId,
                        AfterPrice = item.AfterPrice,
                        Price = item.Price,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                    }).ToList()
                }).AsNoTracking();;
        }

    }
}