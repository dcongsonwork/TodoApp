using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TaskModel = TodoApp.Api.Models.Task;

namespace TodoApp.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TodoAppController : ControllerBase
    {
        private readonly AppDbContext _db;
        public TodoAppController(AppDbContext db) 
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskModel>>> GetAll()
            => Ok(await _db.Tasks.ToListAsync());

        [HttpGet("{id:int}")]
        public async Task<ActionResult<TaskModel>> Get(int id)
        {
            var item = await _db.Tasks.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<TaskModel>> Create(TaskModel model)
        {
            _db.Tasks.Add(model);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = model.TaskId }, model);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, TaskModel model)
        {
            if (id != model.TaskId) return BadRequest();
            _db.Entry(model).State = EntityState.Modified;
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _db.Tasks.AnyAsync(t => t.TaskId == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Tasks.FindAsync(id);
            if (item == null) return NotFound();
            _db.Tasks.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}