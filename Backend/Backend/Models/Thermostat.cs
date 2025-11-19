namespace Backend.Models
{
    public class Thermostat : IDevice, IControllable, ISensor
    {
        public int Id { get; set; }
        public string Name { get; set; } = "Thermostat";
        public string Type { get; set; } = "Controllable";
        public double TargetTemperature { get; set; }
        public double currentTemperature { get; set; }

        public TemperatureSensor Sensor { get; set; }

        // Constructor with file path
        public Thermostat(string temperatureFilePath)
        {
            Sensor = new TemperatureSensor(temperatureFilePath);
        }
        // Default constructor without filepath
        public Thermostat()
        {
            Sensor = new TemperatureSensor();
        }

        public void ExecuteCommand(string command)
        {
            //mock execution of command
            if (command.StartsWith("SetTemperature"))
            {
                var parts = command.Split(' ');
                if (parts.Length == 2 && double.TryParse(parts[1], out double temp))
                {
                    TargetTemperature = temp;
                }
            }
           
        }

        public void UpdateFromFile()
        {
            currentTemperature = Sensor.GetNextTemperature();
        }
    }
}