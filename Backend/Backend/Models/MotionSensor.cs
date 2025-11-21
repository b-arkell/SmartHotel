using System.Globalization;

namespace Backend.Models
{
    public class MotionSensor : IDevice, ISensor
    {
        public int Id { get; set; }
        public string Name { get; set; } = "Motion Sensor";
        public string Type { get; set; } = "Sensor";
        public bool IsMotionDetected { get; set; }
        public void UpdateFromFile(string filePath)
        {
            try
            {
                if (!File.Exists(filePath))
                {
                    Console.WriteLine("Motion sensor file not found.");
                    return;
                }
                string text = File.ReadLines(filePath).First().Trim();

                if (bool.TryParse(text, out bool detected))
                {
                    IsMotionDetected = detected;
                }
                else
                {
                    Console.WriteLine("Invalid format in file.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error reading motion sensor file.");
            }
        }
    }
    
}   
