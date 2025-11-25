using System.Globalization;

namespace Backend.Models
{
    public class AlarmSystem : IDevice, IControllable, ISensor
    {

        public int Id { get; set; }
        public string Name { get; set; } = "Smart Doorbell";
        public string Type { get; set; } = "Sensor";
        public bool IsMotionDetected { get; set; }
        public bool IsAlarmTriggered { get; set; }

        private MotionSensor motionSensor;
        
        public void UpdateFromFile()
        {
            motionSensor.UpdateFromFile();
            if (motionSensor.IsMotionDetected)
            {
                IsAlarmTriggered = true;
            }
        }
        public void ExecuteCommand(string command)
        {
            //mock execution of command
            if (command == "PlayAlarm")
            {
                IsAlarmTriggered = true;
            }
            else if (command == "DisarmAlarm")
            {
                IsAlarmTriggered = false;
            }
        }
    }
}
