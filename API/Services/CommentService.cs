using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.ViewModel;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace API.Services
{
      public class CommentService
      {
            private readonly StoreContext _context;
            private readonly IMapper _mapper;
            public CommentService(StoreContext context, IMapper mapper)
            {
                  _mapper = mapper;
                  _context = context;
            }

            public void AddComment(Comment comment)
            {
                  _context.Comments.Add(comment);
            }

            public void RemoveComment(Comment comment)
            {
                  _context.Comments.Remove(comment);
            }

            public async Task<Comment> GetComment(int id)
            {
                  return await _context.Comments.FindAsync(id);
            }

            public async Task<PagedList<CommentDto>> GetCommentForProduct(CommentParams commentParams)
            {
                  var query = _context.Comments
                      .OrderByDescending(c => c.CommentSent)
                      .Where(p => p.productId == commentParams.productId)
                      .AsQueryable();

                  var comments = query.ProjectTo<CommentDto>(_mapper.ConfigurationProvider);

                  return await PagedList<CommentDto>.ToPagedList(comments, commentParams.PageNumber, 100);
            }

            public Task<IEnumerable<CommentDto>> GetCommentThread(int currentUserId, int productId)
            {
                  return null;
            }

            public async Task<bool> SaveAllAsync()
            {
                  return await _context.SaveChangesAsync() > 0;
            }
      }
}