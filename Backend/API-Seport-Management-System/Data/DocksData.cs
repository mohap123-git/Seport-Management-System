using API_Seport_Management_System.Models;
using Microsoft.Data.SqlClient;

namespace SeaportAPI.Data
{
    public class DocksData
    {
        private readonly string _connectionString;

        public DocksData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SeaportDB")!;
        }

        public List<Dock> GetAllDocks()
        {
            var docks = new List<Dock>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Docks";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    docks.Add(new Dock
                    {
                        DockID = (int)reader["DockID"],
                        DockNumber = reader["DockNumber"].ToString()!,
                        Location = reader["Location"].ToString()!,
                        MaxCapacity = (decimal)reader["MaxCapacity"],
                        DockType = reader["DockType"].ToString()!,
                        Status = reader["Status"].ToString()!
                    });
                }
            }
            return docks;
        }

        public Dock? GetDockById(int id)
        {
            Dock? dock = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Docks WHERE DockID = @DockID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@DockID", id);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    dock = new Dock
                    {
                        DockID = (int)reader["DockID"],
                        DockNumber = reader["DockNumber"].ToString()!,
                        Location = reader["Location"].ToString()!,
                        MaxCapacity = (decimal)reader["MaxCapacity"],
                        DockType = reader["DockType"].ToString()!,
                        Status = reader["Status"].ToString()!
                    };
                }
            }
            return dock;
        }

        public bool DockIdExists(int dockId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string idCheck = "SELECT COUNT(*) FROM Docks WHERE DockID = @DockID";
                SqlCommand idCmd = new SqlCommand(idCheck, conn);
                idCmd.Parameters.AddWithValue("@DockID", dockId);
                conn.Open();
                int idExists = (int)idCmd.ExecuteScalar();
                return idExists > 0;
            }
        }

        public bool DockNumberExists(string dockNumber)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string dupCheck = "SELECT COUNT(*) FROM Docks WHERE DockNumber = @DockNumber";
                SqlCommand dupCmd = new SqlCommand(dupCheck, conn);
                dupCmd.Parameters.AddWithValue("@DockNumber", dockNumber);
                conn.Open();
                int exists = (int)dupCmd.ExecuteScalar();
                return exists > 0;
            }
        }

        public bool DockNumberExistsForOtherDock(string dockNumber, int dockId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string dupCheck = "SELECT COUNT(*) FROM Docks WHERE DockNumber = @DockNumber AND DockID <> @DockID";
                SqlCommand dupCmd = new SqlCommand(dupCheck, conn);
                dupCmd.Parameters.AddWithValue("@DockNumber", dockNumber);
                dupCmd.Parameters.AddWithValue("@DockID", dockId);
                conn.Open();
                int exists = (int)dupCmd.ExecuteScalar();
                return exists > 0;
            }
        }

        public bool AddDock(Dock dock)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO Docks (DockID, DockNumber, Location, MaxCapacity, DockType, Status)
                                 VALUES (@DockID, @DockNumber, @Location, @MaxCapacity, @DockType, @Status)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@DockID", dock.DockID);
                cmd.Parameters.AddWithValue("@DockNumber", dock.DockNumber);
                cmd.Parameters.AddWithValue("@Location", dock.Location);
                cmd.Parameters.AddWithValue("@MaxCapacity", dock.MaxCapacity);
                cmd.Parameters.AddWithValue("@DockType", dock.DockType);
                cmd.Parameters.AddWithValue("@Status", dock.Status);
                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }

        public bool UpdateDock(int id, Dock dock)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Docks SET
                                    DockNumber  = @DockNumber,
                                    Location    = @Location,
                                    MaxCapacity = @MaxCapacity,
                                    DockType    = @DockType,
                                    Status      = @Status
                                 WHERE DockID = @DockID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@DockID", id);
                cmd.Parameters.AddWithValue("@DockNumber", dock.DockNumber);
                cmd.Parameters.AddWithValue("@Location", dock.Location);
                cmd.Parameters.AddWithValue("@MaxCapacity", dock.MaxCapacity);
                cmd.Parameters.AddWithValue("@DockType", dock.DockType);
                cmd.Parameters.AddWithValue("@Status", dock.Status);
                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }

        public int GetArrivalCountForDock(int dockId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string checkQuery = "SELECT COUNT(*) FROM Arrivals WHERE DockID = @DockID";
                SqlCommand checkCmd = new SqlCommand(checkQuery, conn);
                checkCmd.Parameters.AddWithValue("@DockID", dockId);
                conn.Open();
                return (int)checkCmd.ExecuteScalar();
            }
        }

        public bool DeleteDock(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Docks WHERE DockID = @DockID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@DockID", id);
                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }
    }
}