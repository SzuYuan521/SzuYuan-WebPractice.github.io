using AccountPractice.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AccountPractice.Controllers
{
    public class ArticleController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ArticleController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> ArticleIndex()
        {
            var articles = await _context.Articles
                .Where(a => !a.IsDeleted)
                .Include(a => a.Author)
                .ToListAsync();
            return View(articles);
        }

     //   [HttpGet]
        public IActionResult Create()
        {
            // 沒登入, 切到登入畫面
            if (HttpContext.Session.GetString("UserId") == null)
            {
                return RedirectToAction("Login", "Account");
            }

            // 有登入
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Article article)
        {
            string userId = HttpContext.Session.GetString("UserId") ?? string.Empty;
            // 沒登入
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            int id = int.Parse(userId);
            article.AuthorId = id;
            var author = await _context.Users.FindAsync(id);
            if (author!=null)
            {
                article.Author = author;
            }

            if (ModelState.IsValid)
            {
                article.CreatedAt = DateTime.Now;
                _context.Add(article);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(ArticleIndex));
            }
            else
            {
                // 如果 ModelState 無效，顯示錯誤訊息
                var errors = ModelState.Values.SelectMany(v => v.Errors);
                foreach (var error in errors)
                {
                    // 你可以在這裡放置斷點，或者使用日誌記錄來查看錯誤
                    System.Diagnostics.Debug.WriteLine(error.ErrorMessage);
                }
            }
            return View(article);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            // 如果未提供文章ID，返回404錯誤
            if (id == null)
            {
                return NotFound();
            }

            string userId = HttpContext.Session.GetString("UserId") ?? string.Empty;
            // 沒登入
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            // 查找要編輯的文章
            var article = await _context.Articles.FindAsync(id);
            if (article == null || article.IsDeleted)
            {
                return NotFound();
            }

            // 確認是否為文章的作者
            if (article.AuthorId != int.Parse(userId))
            {
                return Forbid();
            }

            return View(article);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Article article)
        {
            if (id != article.Id)
            {
                return NotFound();
            }

            string userId = HttpContext.Session.GetString("UserId") ?? string.Empty;
            // 沒登入
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            int ids = int.Parse(userId);

            if (ModelState.IsValid)
            {
                try
                {
                    // 確認是否為文章的作者
                    if (article.AuthorId != ids)
                    {
                        return Forbid();
                    }

                    // 更新文章並保存
                    article.UpdatedAt = DateTime.Now;
                    _context.Update(article);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ArticleExists(article.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(ArticleIndex));
            }
            return View(article);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            string userId = HttpContext.Session.GetString("UserId") ?? string.Empty;
            // 沒登入
            if (string.IsNullOrEmpty(userId))
            {
                return RedirectToAction("Login", "Account");
            }

            int ids = int.Parse(userId);

            // 查找要刪除的文章
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
            {
                return NotFound();
            }

            // 確認是否為文章的作者或管理員
            if (article.AuthorId != ids)
            {
                return Forbid();
            }

            // 標記文章為已刪除，並設置刪除時間
            article.IsDeleted = true;
            article.DeletedAt = DateTime.Now;
            await _context.SaveChangesAsync();

            // 刪除後重定向到文章列表頁面
            return RedirectToAction(nameof(ArticleIndex));
        }

        private bool ArticleExists(int id)
        {
            return _context.Articles.Any(e => e.Id == id);
        }
    }
}
