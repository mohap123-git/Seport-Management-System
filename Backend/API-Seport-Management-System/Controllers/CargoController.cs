using API_Seport_Management_System.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SeaportAPI.Data;

namespace SeaportAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CargoController : ControllerBase
    {
        private readonly CargoData _cargoData;

        public CargoController(IConfiguration configuration)
        {
            _cargoData = new CargoData(configuration);
        }

        // GET: api/cargo
        [HttpGet]
        public IActionResult GetAllCargo()
        {
            var cargoList = _cargoData.GetAllCargo();
            return Ok(cargoList);
        }

        // GET: api/cargo/5
        [HttpGet("{id}")]
        public IActionResult GetCargoById(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid cargo ID. ID must be a positive number.");

            var cargo = _cargoData.GetCargoById(id);

            if (cargo == null) return NotFound($"No cargo found with ID {id}.");
            return Ok(cargo);
        }

        // POST: api/cargo
        [HttpPost]
        public IActionResult AddCargo([FromBody] Cargo cargo)
        {
            if (cargo == null)
                return BadRequest("Cargo data is required");

            // CargoID must be provided manually (no auto-increment)
            if (cargo.CargoID <= 0)
                return BadRequest("CargoID is required and must be a positive number. Please provide a unique CargoID.");

            // Required field checks
            if (string.IsNullOrWhiteSpace(cargo.CargoType))
                return BadRequest("Cargo type is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(cargo.OwnerName))
                return BadRequest("Owner name is required and cannot be empty.");

            // Weight validation
            if (cargo.Weight <= 0)
                return BadRequest("Weight must be a positive number greater than zero.");

            if (cargo.Weight > 200000)
                return BadRequest("Weight value seems unrealistic. Please enter a value under 200,000 kg.");

            // Length checks
            if (cargo.CargoType.Length > 100)
                return BadRequest("Cargo type is too long. Maximum allowed length is 100 characters.");

            if (cargo.OwnerName.Length > 100)
                return BadRequest("Owner name is too long. Maximum allowed length is 100 characters.");

            // Email format check (basic)
            if (!string.IsNullOrWhiteSpace(cargo.OwnerEmail))
            {
                if (!cargo.OwnerEmail.Contains("@") || !cargo.OwnerEmail.Contains("."))
                    return BadRequest($"The email address '{cargo.OwnerEmail}' is not valid, Please enter a valid email like example@gmail.com");

                if (cargo.OwnerEmail.Length > 200)
                    return BadRequest("Owner email address is too long. Maximum allowed length is 200 characters.");
            }

            // Check if CargoID already exists
            if (_cargoData.CargoExists(cargo.CargoID))
                return Conflict($"A cargo record with CargoID {cargo.CargoID} already exists. Please use a different ID.");

            bool added = _cargoData.AddCargo(cargo);
            if (added) return Ok("Cargo added successfully.");

            return BadRequest("Failed to add cargo. Please try again.");
        }

        // PUT: api/cargo/5
        [HttpPut("{id}")]
        public IActionResult UpdateCargo(int id, [FromBody] Cargo cargo)
        {
            if (id <= 0)
                return BadRequest("Invalid cargo ID. ID must be a positive number.");

            if (cargo == null)
                return BadRequest("Cargo data is required. Please provide updated cargo details in the request body.");

            // If cargoID is provided in the body, it must match the URL id
            if (cargo.CargoID != 0 && cargo.CargoID != id)
                return BadRequest($"The cargoID in the request body ({cargo.CargoID}) does not match the ID in the URL ({id}). Either remove cargoID from the body or make them match.");

            // Required field checks
            if (string.IsNullOrWhiteSpace(cargo.CargoType))
                return BadRequest("Cargo type is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(cargo.OwnerName))
                return BadRequest("Owner name is required and cannot be empty.");

            // Weight validation
            if (cargo.Weight <= 0)
                return BadRequest("Weight must be a positive number greater than zero.");

            if (cargo.Weight > 200000)
                return BadRequest("Weight value seems unrealistic. Please enter a value under 200,000 kg.");

            // Length checks
            if (cargo.CargoType.Length > 100)
                return BadRequest("Cargo type is too long. Maximum allowed length is 100 characters.");

            if (cargo.OwnerName.Length > 100)
                return BadRequest("Owner name is too long. Maximum allowed length is 100 characters.");

            // Email format check (basic)
            if (!string.IsNullOrWhiteSpace(cargo.OwnerEmail))
            {
                if (!cargo.OwnerEmail.Contains("@") || !cargo.OwnerEmail.Contains("."))
                    return BadRequest($"The email address '{cargo.OwnerEmail}' is not valid. Please enter a proper email like example@domain.com.");

                if (cargo.OwnerEmail.Length > 200)
                    return BadRequest("Owner email address is too long. Maximum allowed length is 200 characters.");
            }

            bool updated = _cargoData.UpdateCargo(id, cargo);
            if (updated) return Ok("Cargo updated successfully.");

            return NotFound($"No cargo found with ID {id}. Update was not applied.");
        }

        // DELETE: api/cargo/5
        [HttpDelete("{id}")]
        public IActionResult DeleteCargo(int id)
        {
            if (id <= 0)
                return BadRequest("Invalid cargo ID. ID must be a positive number.");

            // Prevent delete if cargo is referenced by arrivals
            int arrivalCount = _cargoData.GetArrivalCountForCargo(id);
            if (arrivalCount > 0)
                return Conflict($"Cannot delete cargo with ID {id}. It is linked to {arrivalCount} arrival record(s). Remove those arrivals first.");

            bool deleted = _cargoData.DeleteCargo(id);
            if (deleted) return Ok("Cargo deleted successfully.");

            return NotFound($"No cargo found with ID {id}. Nothing was deleted.");
        }
    }
}