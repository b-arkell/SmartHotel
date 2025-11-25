using System;

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
                if (parts.Length != 2)
                    throw new ArgumentException("SetMode requires a mode argument.");
                // validate input against the enum (case-insensitive)
                if (!Enum.TryParse<HVACMode>(parts[1], true, out var parsed))
                {
                    throw new ArgumentException($"Invalid mode for HVAC: {parts[1]}");
                }

                Mode = parsed;
            }
            else if (parts[0] == "SetFanSpeed")
            {
                if (parts.Length != 2)
                    throw new ArgumentException("SetFanSpeed requires a value.");
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
            else if (parts[0].Equals("IncreaseFanSpeed", StringComparison.OrdinalIgnoreCase))
            {
                IncreaseFanSpeed();
            }
            else if (parts[0].Equals("DecreaseFanSpeed", StringComparison.OrdinalIgnoreCase))
            {
                DecreaseFanSpeed();
            }
        }

        public bool IncreaseFanSpeed()
        {
            if (FanSpeed == FanSpeedLevel.High) return false; // cannot increment
            FanSpeed = (FanSpeedLevel)((int)FanSpeed + 1);
            return true;
        }

        public bool DecreaseFanSpeed()
        {
            if (FanSpeed == FanSpeedLevel.Low) return false; // cannot decrement
            FanSpeed = (FanSpeedLevel)((int)FanSpeed - 1);
            return true;
        }
    }
}