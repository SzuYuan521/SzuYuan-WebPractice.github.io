using AccountPractice.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllersWithViews();

// 添加 Session 支援
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Session 超時設置
    options.Cookie.HttpOnly = true; // 確保 Session Cookie 只能由伺服器訪問
    options.Cookie.IsEssential = true; // 必須設置為必需的，以便即使用戶禁用了 Cookie，也能使用 Session
});

builder.Services.AddHostedService<ArticleCleanupService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// 確保 UseSession 在 UseRouting 之後，UseAuthorization 之前
app.UseSession();

// 使用身份驗證和授權
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
