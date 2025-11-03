namespace Backend.Models
{
    public class HVAC : IDevice, IControllable
    {
        public int Id { get; set; }
        public string Name { get; set; } = "HVAC System";
        public string Type { get; set; } = "Controllable";
        public string Mode { get; set; } = "Fan";// Cool, Heat, Fan
        
        public int FanSpeed { get; set; } = 1; // 1 to 3

        public void ExecuteCommand(string command)
        {
            //mock execution of command
            var parts = command.Split(' ');
            if (parts.Length == 2)
            {
                if (parts[0] == "SetMode")
                {
                    Mode = parts[1];
                }
                else if (parts[0] == "SetFanSpeed" && int.TryParse(parts[1], out int speed))
                {
                    FanSpeed = speed;
                }
            }
        }
    }
}
