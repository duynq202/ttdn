using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewsAPI.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace NewsAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly NewsWebContext _context;
        private readonly string _uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

        public PostController(NewsWebContext context)
        {
            _context = context;

            if (!Directory.Exists(_uploadFolder))
            {
                Directory.CreateDirectory(_uploadFolder);
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePost([FromForm] Post post, IFormFile image)
        {
            // Kiểm tra và lưu tệp ảnh nếu có
            if (image != null && image.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(image.FileName)}";
                var filePath = Path.Combine(_uploadFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                post.image_url = fileName;
            }

            // Lưu thông tin bài đăng vào cơ sở dữ liệu
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Bài đăng đã được tạo thành công!" });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
        {
            var posts = await _context.Posts.ToListAsync(); 
            foreach (var post in posts)
            {
                if (!string.IsNullOrEmpty(post.image_url))
                {
                    post.image_url = $"/uploads/{post.image_url}";
                }
            }

            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPostById(int id)
        {
            var post = await _context.Posts.FindAsync(id);

            if (post == null)
            {
                return NotFound(new { message = "Bài viết không tồn tại." });
            }

            if (!string.IsNullOrEmpty(post.image_url))
            {
                post.image_url = $"/uploads/{post.image_url}";
            }

            return Ok(post);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {


            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {

                return NotFound(new { message = "Bài viết không tồn tại." });
            }

            // Xóa file ảnh nếu có
            if (!string.IsNullOrEmpty(post.image_url))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", post.image_url);
                if (System.IO.File.Exists(filePath))
                {
                    Console.WriteLine($"Deleting file: {filePath}");
                    System.IO.File.Delete(filePath);
                }
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Bài viết đã được xóa thành công." });
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromForm] Post updatedPost, IFormFile? image)
        {
            var existingPost = await _context.Posts.FindAsync(id);

            if (existingPost == null)
            {
                return NotFound(new { message = "Bài viết không tồn tại." });
            }

            // Cập nhật các thông tin của bài viết
            existingPost.title = updatedPost.title;
            existingPost.content = updatedPost.content;
            existingPost.author = updatedPost.author;

            // Nếu có ảnh mới, xóa ảnh cũ và lưu ảnh mới
            if (image != null && image.Length > 0)
            {
                // Xóa ảnh cũ nếu có
                if (!string.IsNullOrEmpty(existingPost.image_url))
                {
                    var oldFilePath = Path.Combine(_uploadFolder, existingPost.image_url);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // Lưu ảnh mới
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(image.FileName)}";
                var filePath = Path.Combine(_uploadFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                existingPost.image_url = fileName;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Bài viết đã được cập nhật thành công!" });
        }
    }
}