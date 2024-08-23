using AccountPractice.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class AccountController : Controller
{
    private readonly ApplicationDbContext _context;

    public AccountController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Register()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Register(User user)
    {
        if (ModelState.IsValid)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
            if (existingUser != null)
            {
                ModelState.AddModelError("Username", "此用戶名已被使用");
                return View(user);
            }

            _context.Add(user);
            await _context.SaveChangesAsync();
            return RedirectToAction("Login");
        }
        return View(user);
    }

    public IActionResult Login()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Login(string username, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.Password == password);
        if (user != null)
        {
            HttpContext.Session.SetString("UserId", user.Id.ToString());
            return RedirectToAction("Index", "Home");
        }
        ModelState.AddModelError("", "Invalid username or password");
        return View();
    }

    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return RedirectToAction("Index", "Home");
    }
}