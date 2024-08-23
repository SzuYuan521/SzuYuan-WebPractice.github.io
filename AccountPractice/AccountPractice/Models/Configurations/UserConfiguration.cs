using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AccountPractice.Models.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);

            builder
                .Property(x => x.Username)
                .HasMaxLength(20)
                .HasColumnType("nvarchar(20)")
                .HasColumnName("Username")
                .IsRequired();

            builder
                .Property(x => x.Password)
                .HasMaxLength(16)
                .HasColumnType("varchar(16)")
                .HasColumnName("Password")
                .IsRequired();

            builder
                .Property(x => x.Email)
                .HasMaxLength(50)
                .HasColumnType("nvarchar(50)")
                .HasColumnName("Email")
                .IsRequired();

            // 確保 Username 是唯一的
            builder.HasIndex(x => x.Username).IsUnique();
        }
    }
}
