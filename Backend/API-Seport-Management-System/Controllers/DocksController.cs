using API_Seport_Management_System.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SeaportAPI.Data;

namespace SeaportAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocksController : ControllerBase
    {
        private readonly DocksData _docksData;

        public DocksController(IConfiguration configuration)
        {
            _docksData = new DocksData(configuration);
        }

        // GET: api/docks
        [HttpGet]
        public IActionResult GetAllDocks()
        {
            var docks = _docksData.GetAllDocks();
            return Ok(docks);
        }

        // GET: api/docks/5
        [HttpGet("{id}")]
        public IActionResult GetDockById(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid dock ID. ID must be a positive number.");

            var dock = _docksData.GetDockById(id);

            if (dock == null) return NotFound($"No dock found with ID {id}.");
            return Ok(dock);
        }

        // POST: api/docks
        [HttpPost]
        public IActionResult AddDock([FromBody] Dock dock)
        {
            if (dock == null)
                return BadRequest("Dock data is required. Please provide dock details in the request body.");

            // DockID must be provided manually (no auto-increment)
            if (dock.DockID <= 0)
                return BadRequest("DockID is required and must be a positive number. Please provide a unique DockID.");

            // Required field checks
            if (string.IsNullOrWhiteSpace(dock.DockNumber))
                return BadRequest("Dock number is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(dock.Location))
                return BadRequest("Dock location is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(dock.DockType))
                return BadRequest("Dock type is required and cannot be empty.");

            // Capacity validation
            if (dock.MaxCapacity <= 0)
                return BadRequest("Max capacity must be a positive number greater than zero.");

            if (dock.MaxCapacity > 1000000)
                return BadRequest("Max capacity value seems unrealistic. Please enter a value under 1,000,000 tons.");

            // Length checks
            if (dock.DockNumber.Length > 50)
                return BadRequest("Dock number is too long. Maximum allowed length is 50 characters.");

            if (dock.Location.Length > 200)
                return BadRequest("Location is too long. Maximum allowed length is 200 characters.");

            // Status validation (case-insensitive — auto-corrects to proper casing)
            var validStatuses = new[] { "Available", "Occupied", "Under Maintenance", "Closed" };
            var matchedStatus = validStatuses.FirstOrDefault(s => s.Equals(dock.Status, StringComparison.OrdinalIgnoreCase));
            if (matchedStatus == null)
                return BadRequest($"Invalid status '{dock.Status}'. Allowed values are: {string.Join(", ", validStatuses)}.");
            dock.Status = matchedStatus;

            // Check if DockID already exists
            if (_docksData.DockIdExists(dock.DockID))
                return Conflict($"A dock with DockID {dock.DockID} already exists. Please use a different ID.");

            // Check for duplicate dock number
            if (_docksData.DockNumberExists(dock.DockNumber))
                return Conflict($"A dock with dock number '{dock.DockNumber}' already exists. Please use a unique dock number.");

            bool added = _docksData.AddDock(dock);
            if (added) return Ok("Dock added successfully.");

            return BadRequest("Failed to add dock. Please try again.");
        }

        // PUT: api/docks/5
        [HttpPut("{id}")]
        public IActionResult UpdateDock(int id, [FromBody] Dock dock)
        {
            if (id <= 0)
                return BadRequest("Invalid dock ID. ID must be a positive number.");

            if (dock == null)
                return BadRequest("Dock data is required. Please provide updated dock details in the request body.");

            // Required field checks
            if (string.IsNullOrWhiteSpace(dock.DockNumber))
                return BadRequest("Dock number is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(dock.Location))
                return BadRequest("Dock location is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(dock.DockType))
                return BadRequest("Dock type is required and cannot be empty.");

            // Capacity validation
            if (dock.MaxCapacity <= 0)
                return BadRequest("Max capacity must be a positive number greater than zero.");

            if (dock.MaxCapacity > 1000000)
                return BadRequest("Max capacity value seems unrealistic. Please enter a value under 1,000,000 tons.");

            // Length checks
            if (dock.DockNumber.Length > 50)
                return BadRequest("Dock number is too long. Maximum allowed length is 50 characters.");

            if (dock.Location.Length > 200)
                return BadRequest("Location is too long. Maximum allowed length is 200 characters.");

            // Status validation (case-insensitive — auto-corrects to proper casing)
            var validStatuses = new[] { "Available", "Occupied", "Under Maintenance", "Closed" };
            var matchedStatus = validStatuses.FirstOrDefault(s => s.Equals(dock.Status, StringComparison.OrdinalIgnoreCase));
            if (matchedStatus == null)
                return BadRequest($"Invalid status '{dock.Status}'. Allowed values are: {string.Join(", ", validStatuses)}.");
            dock.Status = matchedStatus;

            // Check for duplicate dock number on a different dock
            if (_docksData.DockNumberExistsForOtherDock(dock.DockNumber, id))
                return Conflict($"Another dock already uses dock number '{dock.DockNumber}'. Please use a unique dock number.");

            bool updated = _docksData.UpdateDock(id, dock);
            if (updated) return Ok("Dock updated successfully.");

            return NotFound($"No dock found with ID {id}. Update was not applied.");
        }

        // DELETE: api/docks/5
        [HttpDelete("{id}")]
        public IActionResult DeleteDock(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid dock ID. ID must be a positive number.");

            // Prevent delete if dock has associated arrivals
            int arrivalCount = _docksData.GetArrivalCountForDock(id);
            if (arrivalCount > 0)
                return Conflict($"Cannot delete dock with ID {id}. It has {arrivalCount} associated arrival record(s). Remove those arrivals first.");

            bool deleted = _docksData.DeleteDock(id);
            if (deleted) return Ok("Dock deleted successfully.");

            return NotFound($"No dock found with ID {id}. Nothing was deleted.");
        }
    }
}