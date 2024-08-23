using AccountPractice.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class AccountController : Controller
{
    private readonly ApplicationDbContext _context;

    // 依賴注入：通過構造函數將 ApplicationDbContext 注入到控制器中
    public AccountController(ApplicationDbContext context)
    {
        _context = context;
    }

    // 顯示註冊頁面
    public IActionResult Register()
    {
        return View();
    }

    // 處理註冊表單提交的請求
    [HttpPost]
    public async Task<IActionResult> Register(User user)
    {
        if (ModelState.IsValid)  // 檢查用戶輸入的資料是否符合模型驗證規則
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
            if (existingUser != null)
            {
                ModelState.AddModelError("Username", "此用戶名已被使用");
                return View(user);
            }

            _context.Add(user); // 將新用戶加入到資料庫上下文中
            await _context.SaveChangesAsync(); // 異步保存變更到資料庫
            return RedirectToAction("Login"); // 重定向到登入頁面
        }
        return View(user); // 如果資料驗證失敗，返回註冊頁面並顯示錯誤訊息
    }

    // 顯示登入頁面
    public IActionResult Login()
    {
        return View();
    }

    // 處理登入表單提交的請求
    [HttpPost]
    public async Task<IActionResult> Login(string username, string password)
    {
        // 根據用戶名和密碼查找用戶
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.Password == password);
        if (user != null)
        {
            // 如果用戶存在，將用戶ID存入Session
            HttpContext.Session.SetString("UserId", user.Id.ToString());
            HttpContext.Session.SetString("Username", user.Username);
            return RedirectToAction("Index", "Home"); // 重定向到首頁
        }

        // 如果用戶名或密碼錯誤，返回登入頁面並顯示錯誤訊息
        ModelState.AddModelError("", "Invalid username or password");
        return View();
    }

    // 處理登出請求
    public IActionResult Logout()
    {
        HttpContext.Session.Clear(); // 清除所有Session資料
        return RedirectToAction("Index", "Home"); // 重定向到首頁
    }
}