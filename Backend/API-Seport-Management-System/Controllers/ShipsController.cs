using API_Seport_Management_System.Models;
using Microsoft.AspNetCore.Mvc;
using SeaportAPI.Data;

namespace SeaportAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShipsController : ControllerBase
    {
        private readonly ShipsData _shipsData;

        public ShipsController(IConfiguration configuration)
        {
            _shipsData = new ShipsData(configuration);
        }

        // GET: api/ships
        [HttpGet]
        public IActionResult GetAllShips()
        {
            var ships = _shipsData.GetAllShips();
            return Ok(ships);
        }

        // GET: api/ships/5
        [HttpGet("{id}")]
        public IActionResult GetShipById(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid ship ID. ID must be a positive number.");

            var ship = _shipsData.GetShipById(id);

            if (ship == null) return NotFound($"No ship found with ID {id}.");
            return Ok(ship);
        }

        // GET: api/ships/search?name=ocean
        [HttpGet("search")]
        public IActionResult SearchShips([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Search term cannot be empty. Please provide a ship name to search for.");

            if (name.Length < 2)
                return BadRequest("Search term is too short. Please enter at least 2 characters.");

            var ships = _shipsData.SearchShips(name);
            return Ok(ships);
        }

        // POST: api/ships
        [HttpPost]
        public IActionResult AddShip([FromBody] Ship ship)
        {
            if (ship == null)
                return BadRequest("Ship data is required");

            // ShipID must be provided manually (no auto-increment)
            if (ship.ShipID <= 0)
                return BadRequest("ShipID is required & must be a positive number");

            // Required field checks
            if (string.IsNullOrWhiteSpace(ship.ShipName))
                return BadRequest("Ship name is required & cannot be empty.");

            if (string.IsNullOrWhiteSpace(ship.ShipType))
                return BadRequest("Ship type is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(ship.FlagCountry))
                return BadRequest("Flag country is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(ship.ContactNumber))
                return BadRequest("Contact Number is required ");


            // Value range checks
            if (ship.Capacity <= 0)
                return BadRequest("Capacity must be a positive number greater than zero.");

            if (ship.Capacity > 500000)
                return BadRequest("Capacity value seems unrealistic. Please enter a value under 500,000 tons.");

            // Length checks
            if (ship.ShipName.Length > 100)
                return BadRequest("Ship name is too long. Maximum allowed length is 100 characters.");

            if (ship.OwnerName.Length > 100)
                return BadRequest("Owner name is too long. Maximum allowed length is 100 characters.");

            // Status validation (case-insensitive — auto-corrects to proper casing)
            var validStatuses = new[] { "Active", "Inactive", "Under Maintenance", "Decommissioned" };
            var matchedStatus = validStatuses.FirstOrDefault(s => s.Equals(ship.Status, StringComparison.OrdinalIgnoreCase));
            if (matchedStatus == null)
                return BadRequest($"Invalid status '{ship.Status}'. Allowed values are: {string.Join(", ", validStatuses)}.");
            ship.Status = matchedStatus;

            // Check if ShipID already exists
            if (_shipsData.ShipExists(ship.ShipID))
                return Conflict($"A ship with ShipID {ship.ShipID} already exists. Please use a different ID.");

            bool added = _shipsData.AddShip(ship);
            if (added) return Ok("Ship added successfully.");

            return BadRequest("Failed to add ship. Please try again.");
        }

        // PUT: api/ships/5
        [HttpPut("{id}")]
        public IActionResult UpdateShip(int id, [FromBody] Ship ship)
        {
            if (id <= 0)
                return BadRequest("Invalid ship ID. ID must be a positive number.");

            if (ship == null)
                return BadRequest("Ship data is required. Please provide updated ship details in the request body.");

            // Required field checks
            if (string.IsNullOrWhiteSpace(ship.ShipName))
                return BadRequest("Ship name is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(ship.ShipType))
                return BadRequest("Ship type is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(ship.FlagCountry))
                return BadRequest("Flag country is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(ship.OwnerName))
                return BadRequest("Owner name is required and cannot be empty.");

            // Value range checks
            if (ship.Capacity <= 0)
                return BadRequest("Capacity must be a positive number greater than zero.");

            if (ship.Capacity > 500000)
                return BadRequest("Capacity value seems unrealistic. Please enter a value under 500,000 tons.");

            // Length checks
            if (ship.ShipName.Length > 100)
                return BadRequest("Ship name is too long. Maximum allowed length is 100 characters.");

            if (ship.OwnerName.Length > 100)
                return BadRequest("Owner name is too long. Maximum allowed length is 100 characters.");

            // Status validation (case-insensitive — auto-corrects to proper casing)
            var validStatuses = new[] { "Active", "Inactive", "Under Maintenance", "Decommissioned" };
            var matchedStatus = validStatuses.FirstOrDefault(s => s.Equals(ship.Status, StringComparison.OrdinalIgnoreCase));
            if (matchedStatus == null)
                return BadRequest($"Invalid status '{ship.Status}'. Allowed values are: {string.Join(", ", validStatuses)}.");
            ship.Status = matchedStatus;

            bool updated = _shipsData.UpdateShip(id, ship);
            if (updated) return Ok("Ship updated successfully.");

            return NotFound($"No ship found with ID {id}. Update was not applied.");
        }

        // DELETE: api/ships/5
        [HttpDelete("{id}")]
        public IActionResult DeleteShip(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid ship ID. ID must be a positive number.");

            // Check if ship has active arrivals before deleting
            int arrivalCount = _shipsData.GetArrivalCountForShip(id);
            if (arrivalCount > 0)
                return Conflict($"Cannot delete ship with ID {id}. It has {arrivalCount} associated arrival record(s). Remove those arrivals first.");

            bool deleted = _shipsData.DeleteShip(id);
            if (deleted) return Ok("Ship deleted successfully.");

            return NotFound($"No ship found with ID {id}. Nothing was deleted.");
        }
    }
}