using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser<int>
    {
        public UserAddress Address { get; set; }
        public string PictureUrl { get; set; }
        public string PublicId { get; set; }
        public int Timer { get; set; } = default;

        public ICollection<UserRole> UserRoles { get; set; }
        public ICollection<Comment> CommentSent { get; set; }
        public ICollection<UserLike> LikedProducts { get; set; }
        public ICollection<SelectedAddress> SelectedAddresses { get; set; }

    }
}