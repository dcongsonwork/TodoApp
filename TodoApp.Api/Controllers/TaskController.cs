using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TodoApp.Api.Data;
using TodoApp.Api.DTOs;

namespace TodoApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;

    public TasksController(AppDbContext db)
    {
        _db = db;
    }

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private bool IsAdmin => User.IsInRole("Admin");

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskResponse>>> GetTasks()
    {
        var query = _db.Tasks.Include(t => t.AssignedToNavigation).AsQueryable();

        if (!IsAdmin)
            query = query.Where(t => t.AssignedTo == CurrentUserId);

        var tasks = await query.ToListAsync();

        var result = tasks.Select(MapToResponse).ToList();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskResponse>> GetTask(int id)
    {
        var task = await _db.Tasks.Include(t => t.AssignedToNavigation)
            .FirstOrDefaultAsync(t => t.TaskId == id);

        if (task is null) return NotFound();

        if (!IsAdmin && task.AssignedTo != CurrentUserId)
            return Forbid();

        return Ok(MapToResponse(task));
    }

    // POST /api/tasks
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TaskResponse>> CreateTask(CreateTaskRq request)
    {
        var task = new TodoApp.Api.Models.Task
        {
            Title = request.Title,
            Description = request.Description,
            DueDate = request.DueDate,
            Priority = request.Priority,
            AssignedTo = request.AssignedTo,
            CreatedBy = CurrentUserId
        };

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();

        await _db.Entry(task).Reference(t => t.AssignedToNavigation).LoadAsync();

        return CreatedAtAction(nameof(GetTask), new { id = task.TaskId }, MapToResponse(task));
    }

    // PUT /api/tasks/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateTask(int id, UpdateTaskRq request)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task is null) return NotFound();

        task.Title = request.Title;
        task.Description = request.Description;
        task.DueDate = request.DueDate;
        task.Priority = request.Priority;
        task.AssignedTo = request.AssignedTo;
        task.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task is null) return NotFound();

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/toggle-complete")]
    public async Task<IActionResult> ToggleComplete(int id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task is null) return NotFound();

        if (!IsAdmin && task.AssignedTo != CurrentUserId)
            return Forbid();

        task.IsCompleted = !task.IsCompleted;
        task.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static TaskResponse MapToResponse(TodoApp.Api.Models.Task t)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var status = t.IsCompleted ? "Completed"
            : t.DueDate < today ? "Overdue"
            : t.DueDate == today ? "Today"
            : "Pending";

        return new TaskResponse
        {
            TaskId = t.TaskId,
            Title = t.Title,
            Description = t.Description,
            DueDate = t.DueDate,
            Priority = t.Priority,
            IsCompleted = t.IsCompleted,
            Status = status,
            AssignedTo = t.AssignedTo,
            AssignedToUsername = t.AssignedToNavigation?.Username
        };
    }
}