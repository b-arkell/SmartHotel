using System.Globalization;

namespace Backend.Models
{
    public class SmartDoorbell : IDevice, ISensor
    {

        public int Id { get; set; }
        public string Name { get; set; } = "Smart Doorbell";
        public string Type { get; set; } = "Sensor";
        public bool IsMotionDetected { get; set; }

        private MotionSensor motionSensor;

        public string IdleImagePath { get; set; } = "Images/idle.jpg";
        public string MotionImagePath { get; set; } = "Images/snif.jpg";

        public string CurrentImage { get; private set; }


        public SmartDoorbell()
        {
            motionSensor = new MotionSensor();

            CurrentImage = IdleImagePath;
        }

        public SmartDoorbell(string filePath)
        {
            motionSensor = new MotionSensor(filePath);
            CurrentImage = IdleImagePath;
        }
        
        public void UpdateFromFile()
        {
            motionSensor.UpdateFromFile();
            if (motionSensor.IsMotionDetected)
            {
                CurrentImage = MotionImagePath;
                IsMotionDetected = true;
            }

            else
            {
                CurrentImage = IdleImagePath;
                IsMotionDetected = false;
            }

        }
    }
}
