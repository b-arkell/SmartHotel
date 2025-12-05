using System.Globalization;

namespace Backend.Models
{
    public class SmartDoorbell : IDevice, ISensor
    {

        public int Id { get; set; }
        public string Name { get; set; } = "Smart Doorbell";
        public string Type { get; set; } = "Doorbell";

        public string IdleImagePath { get; set; } = "Images/idle.jpg";
        public string MotionImagePath { get; set; } = "Images/snif.jpg";

        public string currentImage { get; private set; }

        private MotionSensor Sensor;
        public bool isMotionDetected { get; private set; }

        public SmartDoorbell()
        {
            Sensor = new MotionSensor();

            currentImage = IdleImagePath;
        }

        public SmartDoorbell(string motionFileName)
        {
            Sensor = new MotionSensor(motionFileName);
            currentImage = IdleImagePath;
        }
        // Needed for testing, takes a mock sensor
        public SmartDoorbell(MotionSensor sensor)
        {
            Sensor = sensor;
            currentImage = IdleImagePath;
        }

        public void UpdateFromFile()
        {
            Sensor.GetNextMotionValue();

            isMotionDetected = Sensor.isMotionDetected;
            currentImage = Sensor.isMotionDetected ? MotionImagePath : IdleImagePath;

        }
    }
}
