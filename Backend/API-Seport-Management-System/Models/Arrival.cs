namespace API_Seport_Management_System.Models
{
    public class Arrival
    {
        public int ArrivalID { get; set; }
        public int ShipID { get; set; }
        public int DockID { get; set; }
        public int CargoID { get; set; }
        public DateTime ArrivalDate { get; set; }
        public DateTime? DepartureDate { get; set; }
        public string Status { get; set; } = "Pending";
        public string? Notes { get; set; }

        // For display (joined from related tables)
        public string? ShipName { get; set; }
        public string? DockNumber { get; set; }
        public string? CargoType { get; set; }
    }
}
