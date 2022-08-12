using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using API.ViewModel;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
      public class CommentController : BaseController
      {
            private readonly CommentService _commentService;
            private readonly StoreContext _context;
            private readonly IMapper _mapper;
            public CommentController(CommentService commentService, StoreContext context, IMapper mapper)
            {
                  _context = context;
                  _commentService = commentService;
                  _mapper = mapper;
            }

            [HttpPost]
            public async Task<ActionResult<CommentDto>> CreateComment(CreateCommentDto createCommentDto)
            {
                  var username = User.GetUsername();

                  if (username == null) return Unauthorized();

                  var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == username);
                  var product = await _context.Products.FindAsync(createCommentDto.ProductId);

                  if (product == null) return NotFound();

                  var comment = new Comment
                  {
                        User = user,
                        Product = product,
                        Username = user.UserName,
                        productName = product.Name,
                        Content = createCommentDto.Content,
                        Rate = createCommentDto.Rate,
                  };

                  _commentService.AddComment(comment);

                  if(await _commentService.SaveAllAsync()) return Ok(_mapper.Map<CommentDto>(comment));

                  return BadRequest(new ProblemDetails{Title = "Failed to send message"});
            }

            [HttpGet("get-all-comments")]
            public async Task<List<Comment>> GetComments()
            {
                  return await _commentService.GetComments();
            }

            [HttpGet]
            public async Task<ActionResult<IEnumerable<CommentDto>>> GetCommentsForProduct([FromQuery] CommentParams commentParams)
            {
                  var comments = await _commentService.GetCommentForProduct(commentParams);

                  Response.AddPaginationHeader(comments.PaginationDto);

                  return comments;
            }

            [HttpGet("get-ratings")]
            public async Task<double> GetRatings(int productId)
            {
                  var arr = await _context.Comments
                        .Where(p => p.productId == productId)
                        .Select(x => x.Rate)
                        .ToArrayAsync();

                  int count1 = 0;
                  int count2 = 0;
                  int count3 = 0;
                  int count4 = 0;
                  int count5 = 0;

                  for (int i = 0; i < arr.Length; i++)
                  {
                        switch(arr[i])
                        {
                              case 1:
                                    count1++;
                                    break;
                              case 2:
                                    count2++;
                                    break;
                              case 3:
                                    count3++;
                                    break;
                              case 4:
                                    count4++;
                                    break;
                              case 5:
                                    count5++;
                                    break;
                              default:
                                    break;
                        }
                  }

                  if(count5 == 0 && count4 == 0 && count3 == 0 && count2 == 0 && count1 == 0)
                  {
                        return 0;
                  }

                  double rating = (double)(5 * count5 + 4 * count4 + 3 * count3 + 2 * count2 + 1 * count1) / (count5 + count4 + count3 + count2 + count1);

                  rating = Math.Round(rating, 1);

                  return rating;
            }

            [Authorize(Roles = "Admin")]
            [HttpDelete("{id}")]
            public async Task<ActionResult> DeleteComment(int id)
            {
                  var comment = await _commentService.GetComment(id);

                  if(comment != null) {
                        comment.userDeleted = true;
                        _commentService.RemoveComment(comment);
                  }

                  if(await _commentService.SaveAllAsync()) return Ok();

                  return BadRequest(new ProblemDetails{Title = "Problem deleting the comment"});

            }

      }

}