namespace Backend.Models
{
    public class HVAC : IDevice, IControllable
    {
        public enum HVACMode {Fan, Cool, Heat}
        public enum FanSpeedLevel { Low = 1, Medium = 2, High = 3 }
        public int Id { get; set; }
        public string Name { get; set; } = "HVAC System";
        public string Type { get; set; } = "Controllable";
        public HVACMode Mode { get; set; } = HVACMode.Fan; // Fan, Cool, Heat
        public FanSpeedLevel FanSpeed { get; set; } = FanSpeedLevel.Low; // Low, Medium, High

        public void ExecuteCommand(string command)
        {
            //mock execution of command
            var parts = command?.Split(' ');
            if (parts?.Length != 2)
            {
                throw new ArgumentException($"Invalid ExecuteCommand usage.");
            }
            if (parts[0] == "SetMode")
            {
                // validate input against the enum (case-insensitive)
                if (!Enum.TryParse<HVACMode>(parts[1], true, out var parsed))
                {
                    throw new ArgumentException($"Invalid mode for HVAC: {parts[1]}");
                }

                Mode = parsed;
            }
            else if (parts[0] == "SetFanSpeed")
            {
                // validate input against the enum (case-insensitive)
                if (!Enum.TryParse<FanSpeedLevel>(parts[1], true, out var parsedSpeed))
                {
                    if (int.TryParse(parts[1], out var numeric) && Enum.IsDefined(typeof(FanSpeedLevel), numeric))
                    {
                        parsedSpeed = (FanSpeedLevel)numeric;
                    }
                    else
                    {
                        throw new ArgumentException($"Invalid fan speed for HVAC: {parts[1]}");
                    }
                }

                FanSpeed = parsedSpeed;
            }
        }
    }
}