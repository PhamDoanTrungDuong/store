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
          public DbSet<ProductDetails> ProductDetails { get; set; }
          public DbSet<SelectedAddress> SelectedAddresses { get; set; }
          public DbSet<OrderItem> OrderItems { get; set; }
          public DbSet<Slider> Sliders { get; set; }
          public DbSet<Partner> Partners { get; set; }
          public DbSet<DiscountBanner> DiscountBanners { get; set; }
          public DbSet<Voucher> Vouchers { get; set; }
          public DbSet<Shipper> Shippers { get; set; }
          public DbSet<Notify> Notifies { get; set; }
          public DbSet<Message> Messages { get; set; }
          public DbSet<Receipt> Receipts { get; set; }
          public DbSet<ReceiptDetails> ReceiptDetails { get; set; }

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
               // builder.Entity<ProductSize>()
               //      .HasKey(k => new {k.SizeId, k.ProductId});
               // builder.Entity<ProductDetails>()
               //      .HasKey(k => new {k.ColourId, k.SizeId, k.ProductId});

               //MESSAGE
               builder.Entity<Message>()
                .HasOne(u => u.Recipient)
                .WithMany(m => m.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

               builder.Entity<Message>()
                    .HasOne(u => u.Sender)
                    .WithMany(m => m.MessagesSent)
                    .OnDelete(DeleteBehavior.Restrict);

          }
     }
}