using API_Seport_Management_System.Models;
using Microsoft.Data.SqlClient;

namespace SeaportAPI.Data
{
    public class CargoData
    {
        private readonly string _connectionString;

        public CargoData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("SeaportDB")!;
        }

        public List<Cargo> GetAllCargo()
        {
            var cargoList = new List<Cargo>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Cargo";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    cargoList.Add(new Cargo
                    {
                        CargoID = (int)reader["CargoID"],
                        CargoType = reader["CargoType"].ToString()!,
                        Weight = (decimal)reader["Weight"],
                        Description = reader["Description"] == DBNull.Value ? null : reader["Description"].ToString(),
                        OwnerName = reader["OwnerName"].ToString()!,
                        OwnerEmail = reader["OwnerEmail"] == DBNull.Value ? null : reader["OwnerEmail"].ToString(),
                        IsHazardous = (bool)reader["IsHazardous"]
                    });
                }
            }
            return cargoList;
        }

        public Cargo? GetCargoById(int id)
        {
            Cargo? cargo = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Cargo WHERE CargoID = @CargoID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@CargoID", id);
                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    cargo = new Cargo
                    {
                        CargoID = (int)reader["CargoID"],
                        CargoType = reader["CargoType"].ToString()!,
                        Weight = (decimal)reader["Weight"],
                        Description = reader["Description"] == DBNull.Value ? null : reader["Description"].ToString(),
                        OwnerName = reader["OwnerName"].ToString()!,
                        OwnerEmail = reader["OwnerEmail"] == DBNull.Value ? null : reader["OwnerEmail"].ToString(),
                        IsHazardous = (bool)reader["IsHazardous"]
                    };
                }
            }
            return cargo;
        }

        public bool CargoExists(int cargoId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string dupCheck = "SELECT COUNT(*) FROM Cargo WHERE CargoID = @CargoID";
                SqlCommand dupCmd = new SqlCommand(dupCheck, conn);
                dupCmd.Parameters.AddWithValue("@CargoID", cargoId);
                conn.Open();
                int exists = (int)dupCmd.ExecuteScalar();
                return exists > 0;
            }
        }

        public bool AddCargo(Cargo cargo)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO Cargo (CargoID, CargoType, Weight, Description, OwnerName, OwnerEmail, IsHazardous)
                                 VALUES (@CargoID, @CargoType, @Weight, @Description, @OwnerName, @OwnerEmail, @IsHazardous)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@CargoID", cargo.CargoID);
                cmd.Parameters.AddWithValue("@CargoType", cargo.CargoType);
                cmd.Parameters.AddWithValue("@Weight", cargo.Weight);
                cmd.Parameters.AddWithValue("@Description", (object?)cargo.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@OwnerName", cargo.OwnerName);
                cmd.Parameters.AddWithValue("@OwnerEmail", (object?)cargo.OwnerEmail ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IsHazardous", cargo.IsHazardous);
                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }

        public bool UpdateCargo(int id, Cargo cargo)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Cargo SET
                                    CargoType   = @CargoType,
                                    Weight      = @Weight,
                                    Description = @Description,
                                    OwnerName   = @OwnerName,
                                    OwnerEmail  = @OwnerEmail,
                                    IsHazardous = @IsHazardous
                                 WHERE CargoID = @CargoID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@CargoID", id);
                cmd.Parameters.AddWithValue("@CargoType", cargo.CargoType);
                cmd.Parameters.AddWithValue("@Weight", cargo.Weight);
                cmd.Parameters.AddWithValue("@Description", (object?)cargo.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@OwnerName", cargo.OwnerName);
                cmd.Parameters.AddWithValue("@OwnerEmail", (object?)cargo.OwnerEmail ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IsHazardous", cargo.IsHazardous);
                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }

        public int GetArrivalCountForCargo(int cargoId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string checkQuery = "SELECT COUNT(*) FROM Arrivals WHERE CargoID = @CargoID";
                SqlCommand checkCmd = new SqlCommand(checkQuery, conn);
                checkCmd.Parameters.AddWithValue("@CargoID", cargoId);
                conn.Open();
                return (int)checkCmd.ExecuteScalar();
            }
        }

        public bool DeleteCargo(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Cargo WHERE CargoID = @CargoID";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@CargoID", id);
                conn.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }
    }
}