using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CategoryController : BaseController
    {
         private readonly StoreContext _context;
            public CategoryController(StoreContext context)
            {
                  _context = context;
            }

            // [HttpGet]
            // public async Task<ActionResult> GetCategory()
            // {
            //     var categories = await _context.Categories
            //             .Select(p => new
            //             {
            //                 CateId = p.CateId,
            //                 Name = p.Name
            //             }).ToListAsync();

            //     return Ok(new { categories });
            // }

            [HttpGet]
            public async Task<List<Category>> GetCategory()
            {
                var categories = await _context.Categories
                                .OrderByDescending(x => x.CateId)
                                .ToListAsync();

                return categories;
            }

            [Authorize(Roles = "Admin")]
            [HttpPost]
            public async Task<ActionResult<CategoryDto>> CreateCategory(CategoryDto categoryDto)
            {
                var category = new Category
                {
                    Name = categoryDto.Name
                };
                await _context.Categories.AddAsync(category);

                var result = await _context.SaveChangesAsync() > 0;

                if(result) return Ok(result);

                return BadRequest();
            }

            [Authorize(Roles = "Admin")]
            [HttpDelete("{id}")]
            public async Task<ActionResult> DeleteCategory(int id)
            {
                var cate = await _context.Categories.FindAsync(id);

                if(cate == null) return NotFound();

                _context.Categories.Remove(cate);

                var result = await _context.SaveChangesAsync() > 0;

                if(result) return Ok(result);

                return BadRequest();
            }
    }
}