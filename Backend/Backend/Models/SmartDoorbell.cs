using System.Globalization;

namespace Backend.Models
{
    public class SmartDoorbell : IDevice
    {
        public int Id { get; set; }
        public string Name { get; set; } = "Smart Doorbell";
        public string Type { get; set; } = "Sensor";

        private MotionSensor motionSensor = new MotionSensor();

        public string IdleImagePath { get; set; } = "Images/idle.jpg";
        public string MotionImagePath { get; set; } = "Images/snif.jpg";

        public string CurrentImage { get; private set; }

        public SmartDoorbell()
        {
            CurrentImage = IdleImagePath;
        }

        public void UpdateFromFile(string filePath)
        {
            motionSensor.UpdateFromFile(filePath);
            if (motionSensor.IsMotionDetected)
            {
                CurrentImage = MotionImagePath;
            }
            else
            {
                CurrentImage = IdleImagePath;
            }
        }
    }
}
