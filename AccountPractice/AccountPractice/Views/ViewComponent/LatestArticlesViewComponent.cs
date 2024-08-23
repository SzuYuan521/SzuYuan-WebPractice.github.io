using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace AccountPractice.Views.ViewComponents
{

    public class LatestArticlesViewComponent : ViewComponent
    {
        private readonly ApplicationDbContext _context;

        public LatestArticlesViewComponent(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync(int count = 5)
        {
            var latestArticles = await _context.Articles
                .Where(a => !a.IsDeleted)
                .OrderByDescending(a => a.CreatedAt)
                .Take(count)
                .Include(a => a.Author)
                .ToListAsync();

            return View("~/Views/Article/ArticleList.cshtml", latestArticles);
        }
    }
}
