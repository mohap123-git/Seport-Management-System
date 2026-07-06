namespace API_Seport_Management_System.Models
{
    public class Dock
    {
        public int DockID { get; set; }
        public string DockNumber { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal MaxCapacity { get; set; }
        public string DockType { get; set; } = string.Empty;
        public string Status { get; set; } = "Available";
    }
}
