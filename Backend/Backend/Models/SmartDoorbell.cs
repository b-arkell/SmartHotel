using System.Globalization;

namespace Backend.Models
{
    public class SmartDoorbell : IDevice
    {
        private const string DefaultDirectory = "Mocks/MotionSensor";
        public int Id { get; set; }
        public string Name { get; set; } = "Smart Doorbell";
        public string Type { get; set; } = "Sensor";

        private MotionSensor motionSensor;

        private string filePath;

        public string IdleImagePath { get; set; } = "Images/idle.jpg";
        public string MotionImagePath { get; set; } = "Images/snif.jpg";

        public string CurrentImage { get; private set; }

        public SmartDoorbell()
        {
            filePath = Path.Combine(DefaultDirectory, "default.txt");
            motionSensor = new MotionSensor("default.txt");

            CurrentImage = IdleImagePath;
        }

        public void UpdateFromFile()
        {
            motionSensor.UpdateFromFile();
            if (motionSensor.IsMotionDetected)
                CurrentImage = MotionImagePath;
            else
                CurrentImage = IdleImagePath;

        }
    }
}
