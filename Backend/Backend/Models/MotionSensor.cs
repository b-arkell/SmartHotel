using System.Globalization;

namespace Backend.Models
{
    public class MotionSensor : IDevice, ISensor
    {
        private const string DefaultDirectory = "Mocks/MotionSensor";
        public int Id { get; set; }
        public string Name { get; set; } = "Motion Sensor";
        public string Type { get; set; } = "Sensor";
        public bool isMotionDetected { get; set; }

        private List<bool> motionValues = new();
        private int currentIndex = 0;

        public MotionSensor()
        {
            LoadMotionValuesFromFile(Path.Combine(DefaultDirectory, "default.txt"));
        }


        public MotionSensor(string filename)
        {
            var filePath = Path.Combine(DefaultDirectory, filename);
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
            if (motionValues.Count == 0)
                throw new InvalidDataException("Motion sensor file contains no data.");
        }


        public bool GetNextMotionValue()
        {
            if (motionValues.Count == 0)
                throw new InvalidDataException("No motion data loaded.");

            bool detected = motionValues[currentIndex];
            currentIndex = (currentIndex +1) % motionValues.Count;

            isMotionDetected = detected;
            return detected;
        }

        public void UpdateFromFile()
        {
            GetNextMotionValue();
        }
    }
    
}   
