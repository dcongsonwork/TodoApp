namespace TodoApp.Api.DTOs
{
    public class UserResponse
    {
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}
