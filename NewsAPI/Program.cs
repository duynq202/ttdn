using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NewsAPI.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.FileProviders;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Thêm các dịch vụ vào container.
builder.Services.AddControllers();

// Cấu hình DbContext với chuỗi kết nối từ appsettings.json
builder.Services.AddDbContext<NewsWebContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("http://localhost:3000") // Địa chỉ của React app
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

// Cấu hình Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Cấu hình logging
builder.Logging.ClearProviders(); // Xóa các nhà cung cấp logging mặc định
builder.Logging.AddConsole(); // Thêm logging đến console
builder.Logging.AddDebug(); // Thêm logging đến debug

var app = builder.Build();

// Cấu hình middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Cấu hình StaticFileOptions cho thư mục uploads
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "uploads")),
    RequestPath = "/uploads"
});

// Sử dụng Routing trước Authorization
app.UseRouting();

// Sử dụng CORS
app.UseCors("AllowReactApp");

// Sử dụng Authorization
app.UseAuthorization();

// Ánh xạ controllers
app.MapControllers();

// Chạy ứng dụng
app.Run();
