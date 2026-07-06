using API_Seport_Management_System.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SeaportAPI.Data;

namespace SeaportAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArrivalsController : ControllerBase
    {
        private readonly ArrivalsData _arrivalsData;

        public ArrivalsController(IConfiguration configuration)
        {
            _arrivalsData = new ArrivalsData(configuration);
        }

        // GET: api/arrivals
        [HttpGet]
        public IActionResult GetAllArrivals()
        {
            var arrivals = _arrivalsData.GetAllArrivals();
            return Ok(arrivals);
        }

        // GET: api/arrivals/5
        [HttpGet("{id}")]
        public IActionResult GetArrivalById(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid arrival ID. ID must be a positive number.");

            var arrival = _arrivalsData.GetArrivalById(id);

            if (arrival == null) return NotFound($"No arrival found with ID {id}.");
            return Ok(arrival);
        }

        // GET: api/arrivals/search?ship=ocean&status=Pending
        [HttpGet("search")]
        public IActionResult SearchArrivals([FromQuery] string? ship, [FromQuery] string? status)
        {
            if (string.IsNullOrWhiteSpace(ship) && string.IsNullOrWhiteSpace(status))
                return BadRequest("At least one search parameter is required. Use 'ship' (ship name) or 'status' as query parameters.");

            // Status filter validation
            if (!string.IsNullOrWhiteSpace(status))
            {
                var validStatuses = new[] { "Pending", "Arrived", "Departed", "Cancelled" };
                var matchedSearchStatus = validStatuses.FirstOrDefault(s => s.Equals(status, StringComparison.OrdinalIgnoreCase));
                if (matchedSearchStatus == null)
                    return BadRequest($"Invalid status '{status}'. Allowed values are: {string.Join(", ", validStatuses)}.");
                status = matchedSearchStatus;
            }

            var arrivals = _arrivalsData.SearchArrivals(ship, status);
            return Ok(arrivals);
        }

        // POST: api/arrivals
        [HttpPost]
        public IActionResult AddArrival([FromBody] Arrival arrival)
        {
            if (arrival == null)
                return BadRequest("Arrival data is required.");

            // ArrivalID must be provided manually (no auto-increment)
            if (arrival.ArrivalID <= 0)
                return BadRequest("ArrivalID is required and must be a positive number.");

            // Required ID checks
            if (arrival.ShipID <= 0)
                return BadRequest("A valid ShipID is required and must be a positive number.");

            if (arrival.DockID <= 0)
                return BadRequest("A valid DockID is required and must be a positive number.");

            if (arrival.CargoID <= 0)
                return BadRequest("A valid CargoID is required and must be a positive number.");

            // Date checks
            if (arrival.ArrivalDate == default)
                return BadRequest("Arrival date is required. Please provide a valid date.");

            if (arrival.ArrivalDate > DateTime.Now.AddDays(1))
                return BadRequest("Arrival date cannot be more than 1 day in the future.");

            if (arrival.DepartureDate.HasValue)
            {
                if (arrival.DepartureDate <= arrival.ArrivalDate)
                    return BadRequest("Departure date must be after the arrival date.");

                if (arrival.DepartureDate > DateTime.Now.AddYears(2))
                    return BadRequest("Departure date seems too far in the future. Please enter a realistic date.");
            }

            // Status validation (case-insensitive — auto-corrects to proper casing)
            var validStatuses = new[] { "Pending", "Arrived", "Departed", "Cancelled" };
            var matchedStatus = validStatuses.FirstOrDefault(s => s.Equals(arrival.Status, StringComparison.OrdinalIgnoreCase));
            if (matchedStatus == null)
                return BadRequest($"Invalid status '{arrival.Status}'. Allowed values are: {string.Join(", ", validStatuses)}.");
            arrival.Status = matchedStatus;

            // Verify ShipID exists
            if (!_arrivalsData.ShipExists(arrival.ShipID))
                return BadRequest($"Ship with ID {arrival.ShipID} does not exist. Please provide a valid ShipID.");

            // Verify DockID exists
            if (!_arrivalsData.DockExists(arrival.DockID))
                return BadRequest($"Dock with ID {arrival.DockID} does not exist. Please provide a valid DockID.");

            // Verify CargoID exists
            if (!_arrivalsData.CargoExists(arrival.CargoID))
                return BadRequest($"Cargo with ID {arrival.CargoID} does not exist. Please provide a valid CargoID.");

            // Check if dock is available (not occupied by another active arrival)
            string? dockStatus = _arrivalsData.GetDockStatus(arrival.DockID);
            if (dockStatus == "Occupied")
                return Conflict($"Dock with ID {arrival.DockID} is currently occupied. Please choose a different dock or wait until it becomes available.");
            if (dockStatus == "Closed" || dockStatus == "Under Maintenance")
                return Conflict($"Dock with ID {arrival.DockID} is currently '{dockStatus}' and cannot accept arrivals.");

            // Check if ArrivalID already exists
            if (_arrivalsData.ArrivalIdExists(arrival.ArrivalID))
                return Conflict($"An arrival record with ArrivalID {arrival.ArrivalID} already exists. Please use a different ID.");

            int rows = _arrivalsData.InsertArrival(arrival);
            if (rows > 0) return Ok("Arrival record added successfully.");

            return BadRequest("Failed to add arrival. Please try again.");
        }

        // PUT: api/arrivals/5
        [HttpPut("{id}")]
        public IActionResult UpdateArrival(int id, [FromBody] Arrival arrival)
        {
            if (id <= 0)
                return BadRequest("Invalid arrival ID. ID must be a positive number.");

            if (arrival == null)
                return BadRequest("Arrival data is required. Please provide updated arrival details in the request body.");

            // Required ID checks
            if (arrival.ShipID <= 0)
                return BadRequest("A valid ShipID is required and must be a positive number.");

            if (arrival.DockID <= 0)
                return BadRequest("A valid DockID is required and must be a positive number.");

            if (arrival.CargoID <= 0)
                return BadRequest("A valid CargoID is required and must be a positive number.");

            // Date checks
            if (arrival.ArrivalDate == default)
                return BadRequest("Arrival date is required. Please provide a valid date.");

            if (arrival.DepartureDate.HasValue)
            {
                if (arrival.DepartureDate <= arrival.ArrivalDate)
                    return BadRequest("Departure date must be after the arrival date.");

                if (arrival.DepartureDate > DateTime.Now.AddYears(2))
                    return BadRequest("Departure date seems too far in the future. Please enter a realistic date.");
            }

            // Status validation (case-insensitive — auto-corrects to proper casing)
            var validStatuses = new[] { "Pending", "Arrived", "Departed", "Cancelled" };
            var matchedStatus = validStatuses.FirstOrDefault(s => s.Equals(arrival.Status, StringComparison.OrdinalIgnoreCase));
            if (matchedStatus == null)
                return BadRequest($"Invalid status '{arrival.Status}'. Allowed values are: {string.Join(", ", validStatuses)}.");
            arrival.Status = matchedStatus;

            // Verify ShipID exists
            if (!_arrivalsData.ShipExists(arrival.ShipID))
                return BadRequest($"Ship with ID {arrival.ShipID} does not exist. Please provide a valid ShipID.");

            // Verify DockID exists
            if (!_arrivalsData.DockExists(arrival.DockID))
                return BadRequest($"Dock with ID {arrival.DockID} does not exist. Please provide a valid DockID.");

            // Verify CargoID exists
            if (!_arrivalsData.CargoExists(arrival.CargoID))
                return BadRequest($"Cargo with ID {arrival.CargoID} does not exist. Please provide a valid CargoID.");

            int rows = _arrivalsData.UpdateArrival(id, arrival);
            if (rows > 0) return Ok("Arrival updated successfully.");

            return NotFound($"No arrival found with ID {id}. Update was not applied.");
        }

        // DELETE: api/arrivals/5
        [HttpDelete("{id}")]
        public IActionResult DeleteArrival(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid arrival ID. ID must be a positive number.");

            // Prevent deleting an active/in-progress arrival
            string? currentStatus = _arrivalsData.GetArrivalStatus(id);

            if (currentStatus == null)
                return NotFound($"No arrival found with ID {id}. Nothing was deleted.");

            if (currentStatus == "Arrived")
                return Conflict($"Cannot delete arrival with ID {id} because the ship has already arrived and is currently docked. Change the status before deleting.");

            int rows = _arrivalsData.DeleteArrival(id);
            if (rows > 0) return Ok("Arrival deleted successfully.");

            return BadRequest("Failed to delete arrival. Please try again.");
        }
    }
}