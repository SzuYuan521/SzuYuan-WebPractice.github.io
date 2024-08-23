using Microsoft.EntityFrameworkCore;

namespace AccountPractice.Services
{
    public class ArticleCleanupService : BackgroundService
    {
        private readonly IServiceProvider _services;

        public ArticleCleanupService(IServiceProvider services)
        {
            _services = services;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _services.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    var articlesToDelete = await context.Articles
                        .Where(a => a.IsDeleted && a.DeletedAt.HasValue && a.DeletedAt.Value.AddDays(7) < DateTime.Now)
                        .ToListAsync(stoppingToken);

                    context.Articles.RemoveRange(articlesToDelete);
                    await context.SaveChangesAsync(stoppingToken);
                }

                await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
            }
        }
    }
}
