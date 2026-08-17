namespace TodoApp.Api.DTOs 
{
    public class TaskResponse
    {
        public int TaskId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateOnly DueDate { get; set; }
        public string Priority { get; set; } = null!;
        public bool IsCompleted { get; set; }
        public string Status { get; set; } = null!; // Today / Pending / Overdue / Completed
        public int? AssignedTo { get; set; }
        public string? AssignedToUsername { get; set; }
    }
}
