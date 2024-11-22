using System;
using System.ComponentModel.DataAnnotations;

namespace NewsAPI.Models
{
    public class Post
{
    public int id { get; set; }
    public string title { get; set; } = string.Empty; 
    public string content { get; set; } = string.Empty;
    public string image_url { get; set; } = string.Empty;
    public string author { get; set; } = string.Empty;
    public DateTime created_at { get; set; }
}

}
