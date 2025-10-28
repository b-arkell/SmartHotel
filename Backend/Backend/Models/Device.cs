namespace Backend.Models
{
    public class Device
    {
        public int Id { get; set; }
        public string Name { get; set; } = "Light";

        public string Status { get; set; } = "Off";

    }
}
