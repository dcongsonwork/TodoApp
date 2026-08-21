namespace TodoApp.Api.DTOs
{
    public class UpdateTaskRq
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateOnly DueDate { get; set; }
        public string Priority { get; set; } = null!;
        public int? AssignedTo { get; set; }
    }
}