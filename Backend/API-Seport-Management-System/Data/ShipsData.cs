using API_Seport_Management_System.Models;
using Microsoft.Data.SqlClient;

namespace SeaportAPI.Data
{
    public class ShipsData
    {
        private readonly string _connectionString;

        public ShipsData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SeaportDB")!;
        }

        public List<Ship> GetAllShips()
        {
            var ships = new List<Ship>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Ships";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    ships.Add(new Ship
                    {
                        ShipID = (int)reader["ShipID"],
                        ShipName = reader["ShipName"].ToString()!,
                        ShipType = reader["ShipType"].ToString()!,
                        Capacity = (decimal)reader["Capacity"],
                        FlagCountry = reader["FlagCountry"].ToString()!,
                        OwnerName = reader["OwnerName"].ToString()!,
                        ContactNumber = reader["ContactNumber"] == DBNull.Value ? null : reader["ContactNumber"].ToString(),
                        Status = reader["Status"].ToString()!
                    });
                }
            }
            return ships;
        }

        public Ship? GetShipById(int id)
        {
            Ship? ship = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Ships WHERE ShipID = @ShipID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@ShipID", id);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    ship = new Ship
                    {
                        ShipID = (int)reader["ShipID"],
                        ShipName = reader["ShipName"].ToString()!,
                        ShipType = reader["ShipType"].ToString()!,
                        Capacity = (decimal)reader["Capacity"],
                        FlagCountry = reader["FlagCountry"].ToString()!,
                        OwnerName = reader["OwnerName"].ToString()!,
                        ContactNumber = reader["ContactNumber"] == DBNull.Value ? null : reader["ContactNumber"].ToString(),
                        Status = reader["Status"].ToString()!
                    };
                }
            }
            return ship;
        }

        public List<Ship> SearchShips(string name)
        {
            var ships = new List<Ship>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Ships WHERE ShipName LIKE @Name";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Name", "%" + name + "%");
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    ships.Add(new Ship
                    {
                        ShipID = (int)reader["ShipID"],
                        ShipName = reader["ShipName"].ToString()!,
                        ShipType = reader["ShipType"].ToString()!,
                        Capacity = (decimal)reader["Capacity"],
                        FlagCountry = reader["FlagCountry"].ToString()!,
                        OwnerName = reader["OwnerName"].ToString()!,
                        ContactNumber = reader["ContactNumber"] == DBNull.Value ? null : reader["ContactNumber"].ToString(),
                        Status = reader["Status"].ToString()!
                    });
                }
            }
            return ships;
        }

        public bool ShipExists(int shipId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string dupCheck = "SELECT COUNT(*) FROM Ships WHERE ShipID = @ShipID";
                SqlCommand dupCmd = new SqlCommand(dupCheck, conn);
                dupCmd.Parameters.AddWithValue("@ShipID", shipId);
                conn.Open();
                int exists = (int)dupCmd.ExecuteScalar();
                return exists > 0;
            }
        }

        public bool AddShip(Ship ship)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO Ships (ShipID, ShipName, ShipType, Capacity, FlagCountry, OwnerName, ContactNumber, Status)
                                 VALUES (@ShipID, @ShipName, @ShipType, @Capacity, @FlagCountry, @OwnerName, @ContactNumber, @Status)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@ShipID", ship.ShipID);
                cmd.Parameters.AddWithValue("@ShipName", ship.ShipName);
                cmd.Parameters.AddWithValue("@ShipType", ship.ShipType);
                cmd.Parameters.AddWithValue("@Capacity", ship.Capacity);
                cmd.Parameters.AddWithValue("@FlagCountry", ship.FlagCountry);
                cmd.Parameters.AddWithValue("@OwnerName", ship.OwnerName);
                cmd.Parameters.AddWithValue("@ContactNumber", (object?)ship.ContactNumber ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Status", ship.Status);
                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }

        public bool UpdateShip(int id, Ship ship)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Ships SET
                                    ShipName      = @ShipName,
                                    ShipType      = @ShipType,
                                    Capacity      = @Capacity,
                                    FlagCountry   = @FlagCountry,
                                    OwnerName     = @OwnerName,
                                    ContactNumber = @ContactNumber,
                                    Status        = @Status
                                 WHERE ShipID = @ShipID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@ShipID", id);
                cmd.Parameters.AddWithValue("@ShipName", ship.ShipName);
                cmd.Parameters.AddWithValue("@ShipType", ship.ShipType);
                cmd.Parameters.AddWithValue("@Capacity", ship.Capacity);
                cmd.Parameters.AddWithValue("@FlagCountry", ship.FlagCountry);
                cmd.Parameters.AddWithValue("@OwnerName", ship.OwnerName);
                cmd.Parameters.AddWithValue("@ContactNumber", (object?)ship.ContactNumber ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Status", ship.Status);
                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }

        public int GetArrivalCountForShip(int shipId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string checkQuery = "SELECT COUNT(*) FROM Arrivals WHERE ShipID = @ShipID";
                SqlCommand checkCmd = new SqlCommand(checkQuery, conn);
                checkCmd.Parameters.AddWithValue("@ShipID", shipId);
                conn.Open();
                return (int)checkCmd.ExecuteScalar();
            }
        }

        public bool DeleteShip(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Ships WHERE ShipID = @ShipID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@ShipID", id);
                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }
    }
}