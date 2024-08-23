using AccountPractice.Models;
using AccountPractice.Models.Configurations;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    public DbSet<Article> Articles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.Entity<Article>()
        .HasOne(a => a.Author)
        .WithMany()
        .HasForeignKey(a => a.AuthorId);
    }
}