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
          public DbSet<ProductDiscount> ProductDiscounts { get; set; }
          public DbSet<UserLike> Likes { get; set; }
          public DbSet<Entities.Size> Sizes { get; set; }
          public DbSet<Colour> Colours { get; set; }
          protected override void OnModelCreating(ModelBuilder builder)
          {
               base.OnModelCreating(builder);

               foreach (var entityType in builder.Model.GetEntityTypes ()) {
                    var tableName = entityType.GetTableName ();
                    if (tableName.StartsWith ("AspNet")) {
                         entityType.SetTableName (tableName.Substring (6));
                    }
               }

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

               //PRODUCT ATTR
               builder.Entity<ProductSize>()
                    .HasKey(k => new {k.SizeId, k.ProductId});
               builder.Entity<ProductColour>()
                    .HasKey(k => new {k.ColourId, k.ProductId});

               // builder.Entity<Colour>()
               //      .HasMany(p => p.ProductColours)
               //      .WithOne(a => a.Colour)
               //      .HasForeignKey(fk => fk.ColourId);
               //  builder.Entity<Product>()
               //      .HasMany(p => p.ProductColours)
               //      .WithOne(a => a.Product)
               //      .HasForeignKey(fk => fk.ProductId);

               // builder.Entity<Size>()
               //      .HasMany(p => p.ProductSizes)
               //      .WithOne(a => a.Size)
               //      .HasForeignKey(fk => fk.SizeId);
               //  builder.Entity<Product>()
               //      .HasMany(p => p.ProductSizes)
               //      .WithOne(a => a.Product)
               //      .HasForeignKey(fk => fk.ProductId);

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