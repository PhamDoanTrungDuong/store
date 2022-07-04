using System.Linq;
using System;
using System.Collections.Generic;
using API.DTOs;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.ViewModel
{
      public class PagedList<T> : List<T>
      {
            public PaginationDto PaginationDto { get; set; }

            public PagedList(List<T> items, int count, int pageNumber, int pageSize)
            {
                PaginationDto = new PaginationDto
                {
                    TotalCount = count,
                    PageSize = pageSize,
                    CurrentPage = pageNumber,
                    TotalPages = (int) Math.Ceiling(count / (double)pageSize)
                };
                AddRange(items);
            }


             public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
             {
                var count = await query.CountAsync();
                var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

                return new PagedList<T>(items, count, pageNumber, pageSize);
             }
      }
}







