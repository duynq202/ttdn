using Microsoft.EntityFrameworkCore;

namespace NewsAPI.Models
{
    public partial class NewsWebContext : DbContext
    {
        public NewsWebContext(DbContextOptions<NewsWebContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Post> Posts { get; set; }
        public virtual DbSet<User> Users { get; set; }

        // Cấu hình DbContext
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Host=localhost;Database=news_web;Username=postgres;Password=123456");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Post>(entity =>
            {
                entity.HasKey(e => e.id).HasName("post_pkey");

                entity.ToTable("post");

                entity.Property(e => e.id).HasColumnName("id");

                entity.Property(e => e.author)
                    .HasMaxLength(255)
                    .HasColumnName("author");

                entity.Property(e => e.content)
                    .HasColumnName("content");

                entity.Property(e => e.created_at)
                    .HasDefaultValueSql("now()")
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("created_at");

                entity.Property(e => e.image_url)
                    .HasMaxLength(255)
                    .HasColumnName("image_url");

                entity.Property(e => e.title)
                    .HasMaxLength(255)
                    .HasColumnName("title");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("users_pkey");

                entity.ToTable("users");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Password)
                    .HasMaxLength(255)
                    .HasColumnName("password");

                entity.Property(e => e.Username)
                    .HasMaxLength(50)
                    .HasColumnName("username");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
