using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using API.ViewModel;
using AutoMapper;
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
                        Content = createCommentDto.Content
                  };

                  _commentService.AddComment(comment);

                  if(await _commentService.SaveAllAsync()) return Ok(_mapper.Map<CommentDto>(comment));

                  return BadRequest(new ProblemDetails{Title = "Failed to send message"});
            }

            [HttpGet]
            public async Task<ActionResult<IEnumerable<CommentDto>>> GetCommentsForProduct([FromQuery] CommentParams commentParams)
            {
                  var comments = await _commentService.GetCommentForProduct(commentParams);

                  Response.AddPaginationHeader(comments.PaginationDto);

                  return comments;
            }
      }
}