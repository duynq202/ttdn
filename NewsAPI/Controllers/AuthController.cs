using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using NewsAPI.Models; 

namespace NewsAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly NewsWebContext _context; // Sử dụng NewsWebContext

        public AuthController(NewsWebContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            // Kiểm tra xem tên người dùng đã tồn tại hay chưa
            if (await _context.Users.AnyAsync(u => u.Username == user.Username))
            {
                return BadRequest(new { message = "Tên người dùng đã tồn tại." });
            }

            // Thêm người dùng vào database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đăng ký thành công!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            Console.WriteLine($"Username: {user.Username}, Password: {user.Password}");

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == user.Username && u.Password == user.Password);

            if (existingUser == null)
            {
                return Unauthorized(new { message = "Tên người dùng hoặc mật khẩu không đúng." });
            }

            return Ok(new { message = "Đăng nhập thành công!" });
        }



    }
}
