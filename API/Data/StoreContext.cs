using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
     public class StoreContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
     {
          public StoreContext(DbContextOptions options) : base(options)
          {
          }

          public DbSet<Product> Products { get; set; }
          public DbSet<Basket> Baskets { get; set; }
          public DbSet<Order> Orders { get; set; }
          public DbSet<Comment> Comments { get; set; }
          public DbSet<Category> Categories { get; set; }
          public DbSet<UserLike> Likes { get; set; }

          protected override void OnModelCreating(ModelBuilder builder)
          {
               base.OnModelCreating(builder);
               // USER - ROLE
               builder.Entity<User>()
                    .HasOne(a => a.Address)
                    .WithOne()
                    .HasForeignKey<UserAddress>(a => a.Id)
                    .OnDelete(DeleteBehavior.Cascade);

               builder.Entity<Role>()
                    .HasData(
                         new Role{Id = 1, Name = "Member", NormalizedName = "MEMBER"},
                         new Role{Id = 2, Name = "Admin", NormalizedName = "ADMIN"}
                    );

               builder.Entity<User>()
                    .HasMany(ur => ur.UserRoles)
                    .WithOne(u => u.User)
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();

               builder.Entity<Role>()
                    .HasMany(ur => ur.UserRoles)
                    .WithOne(u => u.Role)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

               //COMMENTS
               builder.Entity<Comment>()
                    .HasOne(u => u.Product)
                    .WithMany(c => c.CommentReceived)
                    .OnDelete(DeleteBehavior.Cascade);

               builder.Entity<Comment>()
                    .HasOne(u => u.User)
                    .WithMany(c => c.CommentSent)
                    .OnDelete(DeleteBehavior.Cascade);

               // CATEGORY
               builder.Entity<Product>()
                    .HasOne(c => c.Category)
                    .WithMany(p => p.Products)
                    .HasForeignKey(k => k.CurrentCateId);


               //USER LIKE
               builder.Entity<UserLike>()
                    .HasKey(k => new {k.UserId, k.LikedProductId});

               builder.Entity<UserLike>()
                    .HasOne(u => u.User)
                    .WithMany(p => p.LikedProducts)
                    .HasForeignKey(s => s.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

               builder.Entity<UserLike>()
                    .HasOne(u => u.LikedProduct)
                    .WithMany(p => p.LikedByUsers)
                    .HasForeignKey(s => s.LikedProductId)
                    .OnDelete(DeleteBehavior.Cascade);
          }
     }
}