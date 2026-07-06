using API_Seport_Management_System.Models;
using Microsoft.Data.SqlClient;

namespace SeaportAPI.Data
{
    public class ArrivalsData
    {
        private readonly string _connectionString;

        public ArrivalsData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SeaportDB")!;
        }

        // ── Reads ────────────────────────────────────────────

        public List<Arrival> GetAllArrivals()
        {
            var arrivals = new List<Arrival>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT a.*, s.ShipName, d.DockNumber, c.CargoType
                    FROM Arrivals a
                    INNER JOIN Ships  s ON a.ShipID  = s.ShipID
                    INNER JOIN Docks  d ON a.DockID  = d.DockID
                    INNER JOIN Cargo  c ON a.CargoID = c.CargoID";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    arrivals.Add(MapArrival(reader));
                }
            }
            return arrivals;
        }

        public Arrival? GetArrivalById(int id)
        {
            Arrival? arrival = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT a.*, s.ShipName, d.DockNumber, c.CargoType
                    FROM Arrivals a
                    INNER JOIN Ships  s ON a.ShipID  = s.ShipID
                    INNER JOIN Docks  d ON a.DockID  = d.DockID
                    INNER JOIN Cargo  c ON a.CargoID = c.CargoID
                    WHERE a.ArrivalID = @ArrivalID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@ArrivalID", id);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read()) arrival = MapArrival(reader);
            }
            return arrival;
        }

        public List<Arrival> SearchArrivals(string? ship, string? status)
        {
            var arrivals = new List<Arrival>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT a.*, s.ShipName, d.DockNumber, c.CargoType
                    FROM Arrivals a
                    INNER JOIN Ships  s ON a.ShipID  = s.ShipID
                    INNER JOIN Docks  d ON a.DockID  = d.DockID
                    INNER JOIN Cargo  c ON a.CargoID = c.CargoID
                    WHERE 1=1";

                if (!string.IsNullOrEmpty(ship)) query += " AND s.ShipName LIKE @ShipName";
                if (!string.IsNullOrEmpty(status)) query += " AND a.Status = @Status";

                SqlCommand cmd = new SqlCommand(query, conn);
                if (!string.IsNullOrEmpty(ship)) cmd.Parameters.AddWithValue("@ShipName", "%" + ship + "%");
                if (!string.IsNullOrEmpty(status)) cmd.Parameters.AddWithValue("@Status", status);

                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read()) arrivals.Add(MapArrival(reader));
            }
            return arrivals;
        }

        // ── Existence / lookup checks ────────────────────────

        // Verify ShipID exists
        public bool ShipExists(int shipId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                var shipCheck = new SqlCommand("SELECT COUNT(*) FROM Ships WHERE ShipID = @ShipID", conn);
                shipCheck.Parameters.AddWithValue("@ShipID", shipId);
                return (int)shipCheck.ExecuteScalar() > 0;
            }
        }

        // Verify DockID exists
        public bool DockExists(int dockId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                var dockCheck = new SqlCommand("SELECT COUNT(*) FROM Docks WHERE DockID = @DockID", conn);
                dockCheck.Parameters.AddWithValue("@DockID", dockId);
                return (int)dockCheck.ExecuteScalar() > 0;
            }
        }

        // Verify CargoID exists
        public bool CargoExists(int cargoId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                var cargoCheck = new SqlCommand("SELECT COUNT(*) FROM Cargo WHERE CargoID = @CargoID", conn);
                cargoCheck.Parameters.AddWithValue("@CargoID", cargoId);
                return (int)cargoCheck.ExecuteScalar() > 0;
            }
        }

        // Check if dock is available (not occupied by another active arrival)
        public string? GetDockStatus(int dockId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                var dockStatusCheck = new SqlCommand("SELECT Status FROM Docks WHERE DockID = @DockID", conn);
                dockStatusCheck.Parameters.AddWithValue("@DockID", dockId);
                return dockStatusCheck.ExecuteScalar()?.ToString();
            }
        }

        // Check if ArrivalID already exists
        public bool ArrivalIdExists(int arrivalId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string idCheck = "SELECT COUNT(*) FROM Arrivals WHERE ArrivalID = @ArrivalID";
                SqlCommand idCmd = new SqlCommand(idCheck, conn);
                idCmd.Parameters.AddWithValue("@ArrivalID", arrivalId);
                return (int)idCmd.ExecuteScalar() > 0;
            }
        }

        public string? GetArrivalStatus(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string statusQuery = "SELECT Status FROM Arrivals WHERE ArrivalID = @ArrivalID";
                SqlCommand statusCmd = new SqlCommand(statusQuery, conn);
                statusCmd.Parameters.AddWithValue("@ArrivalID", id);
                object? statusResult = statusCmd.ExecuteScalar();
                return statusResult?.ToString();
            }
        }

        //  insert 

        public int InsertArrival(Arrival arrival)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string query = @"INSERT INTO Arrivals (ArrivalID, ShipID, DockID, CargoID, ArrivalDate, DepartureDate, Status, Notes)
                                 VALUES (@ArrivalID, @ShipID, @DockID, @CargoID, @ArrivalDate, @DepartureDate, @Status, @Notes)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@ArrivalID", arrival.ArrivalID);
                cmd.Parameters.AddWithValue("@ShipID", arrival.ShipID);
                cmd.Parameters.AddWithValue("@DockID", arrival.DockID);
                cmd.Parameters.AddWithValue("@CargoID", arrival.CargoID);
                cmd.Parameters.AddWithValue("@ArrivalDate", arrival.ArrivalDate);
                cmd.Parameters.AddWithValue("@DepartureDate", (object?)arrival.DepartureDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Status", arrival.Status);
                cmd.Parameters.AddWithValue("@Notes", (object?)arrival.Notes ?? DBNull.Value);
                return cmd.ExecuteNonQuery();
            }
        }
        //update
        public int UpdateArrival(int id, Arrival arrival)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string query = @"UPDATE Arrivals SET
                                    ShipID        = @ShipID,
                                    DockID        = @DockID,
                                    CargoID       = @CargoID,
                                    ArrivalDate   = @ArrivalDate,
                                    DepartureDate = @DepartureDate,
                                    Status        = @Status,
                                    Notes         = @Notes
                                 WHERE ArrivalID = @ArrivalID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@ArrivalID", id);
                cmd.Parameters.AddWithValue("@ShipID", arrival.ShipID);
                cmd.Parameters.AddWithValue("@DockID", arrival.DockID);
                cmd.Parameters.AddWithValue("@CargoID", arrival.CargoID);
                cmd.Parameters.AddWithValue("@ArrivalDate", arrival.ArrivalDate);
                cmd.Parameters.AddWithValue("@DepartureDate", (object?)arrival.DepartureDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Status", arrival.Status);
                cmd.Parameters.AddWithValue("@Notes", (object?)arrival.Notes ?? DBNull.Value);
                return cmd.ExecuteNonQuery();
            }
        }
        // delete
        public int DeleteArrival(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                string query = "DELETE FROM Arrivals WHERE ArrivalID = @ArrivalID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@ArrivalID", id);
                return cmd.ExecuteNonQuery();
            }
        }

        // ── Private Helper ──────────────────────────────────

        private static Arrival MapArrival(SqlDataReader reader)
        {
            return new Arrival
            {
                ArrivalID = (int)reader["ArrivalID"],
                ShipID = (int)reader["ShipID"],
                DockID = (int)reader["DockID"],
                CargoID = (int)reader["CargoID"],
                ArrivalDate = (DateTime)reader["ArrivalDate"],
                DepartureDate = reader["DepartureDate"] == DBNull.Value ? null : (DateTime?)reader["DepartureDate"],
                Status = reader["Status"].ToString()!,
                Notes = reader["Notes"] == DBNull.Value ? null : reader["Notes"].ToString(),
                ShipName = reader["ShipName"].ToString(),
                DockNumber = reader["DockNumber"].ToString(),
                CargoType = reader["CargoType"].ToString()
            };
        }
    }
}