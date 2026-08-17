namespace TodoApp.Api.DTOs { 
    public class CreateTaskRq
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateOnly DueDate { get; set; }
        public string Priority { get; set; } = "Medium";
        public int? AssignedTo { get; set; }
    }
}
