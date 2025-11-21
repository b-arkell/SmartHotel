using System.Globalization;

namespace Backend.Models
{
    public class MotionSensor : IDevice, ISensor
    {
        private const string DefaultDirectory = "Mocks/MotionSensor";
        public int Id { get; set; }
        public string Name { get; set; } = "Motion Sensor";
        public string Type { get; set; } = "Sensor";
        public bool IsMotionDetected { get; set; }

        private List<bool> motionValues = new();
        private int currentIndex = 0;
        private string filePath;

        public MotionSensor()
        {
            filePath = Path.Combine(DefaultDirectory, "default.txt");
            LoadMotionValuesFromFile(filePath);
        }

        private void LoadMotionValuesFromFile(string filePath)
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException($"Motion file not found: {filePath}");

            var lines = File.ReadAllLines(filePath);

            motionValues.Clear();

            foreach (var line in lines)
            {
                if (bool.TryParse(line.Trim(), out bool detected))
                {
                    motionValues.Add(detected);
                }
                else
                {
                    throw new InvalidDataException($"Invalid motion value: {line}");
                }
            }
        }

        public MotionSensor(string filename)
        {
            filePath = Path.Combine(DefaultDirectory, filename);
        }

        public void UpdateFromFile()
        {
            try
            {
                if (!File.Exists(filePath))
                {
                    Console.WriteLine($"Motion sensor file not found: {filePath}");
                    return;
                }
                string text = File.ReadLines(filePath).First().Trim();

                if (bool.TryParse(text, out bool detected))
                    IsMotionDetected = detected;
                else
                    Console.WriteLine($"Invalid format in file: {text}");
            }
            catch (Exception)
            {
                Console.WriteLine("Error reading motion sensor file.");
            }
        }
    }
    
}   
