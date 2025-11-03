namespace Backend.Models
{
    public class Hotel
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public List<Floor> Floors { get; set; } = new();
    }
}
