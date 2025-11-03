namespace Backend.Models
{
    public class Light : IDevice, IControllable
    {
        public int Id { get; set; }

        public string Name { get; set; } = "Light";

        public string Type { get; set; } = "Controllable";

        public bool IsOn { get; set; }

        public void ExecuteCommand(string command)
        {
            //mock execution of command
            if (command == "TurnOn")
            {
                IsOn = true;
            }
            else if (command == "TurnOff")
            {
                IsOn = false;
            }
        }
    }
}
