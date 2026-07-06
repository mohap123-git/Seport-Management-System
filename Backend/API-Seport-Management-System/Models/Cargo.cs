namespace API_Seport_Management_System.Models
{
    public class Cargo
    {
        public int CargoID { get; set; }
        public string CargoType { get; set; } = string.Empty;
        public decimal Weight { get; set; }
        public string? Description { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public string? OwnerEmail { get; set; }
        public bool IsHazardous { get; set; } = false;
    }
}
