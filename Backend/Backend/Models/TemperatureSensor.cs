namespace Backend.Models
{
    public class TemperatureSensor : IDevice, ISensor
    {
        public int Id { get; set; }
        public string Name { get; set; } = "Temperature Sensor";
        public string Type { get; set; } = "Sensor";
        public double CurrentTemp { get; set; }

        public void UpdateFromFile(string filePath)
        {
            // Simulate reading temperature from a file
            // In a real implementation, you would read the file and parse the temperature value
            CurrentTemp = 22.5; // Placeholder value
        }
    }
}
