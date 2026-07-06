namespace API_Seport_Management_System.Models
{
    public class Ship
    {
        public int ShipID { get; set; }
        public string ShipName { get; set; } = string.Empty;
        public string ShipType { get; set; } = string.Empty;
        public decimal Capacity { get; set; }
        public string FlagCountry { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string? ContactNumber { get; set; }
        public string Status { get; set; } = "Active";
    }
}
