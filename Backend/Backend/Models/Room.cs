namespace Backend.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";

        public List<IDevice> Devices { get; set; } = new();
    }
}
