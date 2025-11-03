namespace Backend.Models
{
    public class Thermostat : IDevice, IControllable
    {
        public int Id { get; set; }
        public string Name { get; set; } = "Thermostat";
        public string Type { get; set; } = "Controllable";
        public double TargetTemperature { get; set; }

        public TemperatureSensor Sensor { get; set; } = new();

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
    }
   
}
