namespace Backend.Models
{
    public class MotionSensor : IDevice, ISensor
    {
        public int Id { get; set; }
        public string Name { get; set; } = "Motion Sensor";
        public string Type { get; set; } = "Sensor";
        public bool IsMotionDetected { get; set; }
        public void UpdateFromFile()
        {
            // Simulate reading motion detection status from a file
            // In a real implementation, you would read the file and parse the motion detection value
            IsMotionDetected = false; // Placeholder value
        }
    }
    
}
