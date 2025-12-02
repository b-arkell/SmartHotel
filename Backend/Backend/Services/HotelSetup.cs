using Backend.Models;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services
{
    public class HotelSetup
    {
        public Hotel Hotel { get; private set; }

        public HotelSetup()
        {
            // When the backend starts, build the entire hotel structure
            Hotel = InitializeHotel();
        }

        private Hotel InitializeHotel()
        {
            return new Hotel
            {
                Floors = new List<Floor>
                {
                    new Floor
                    {
                        Id = 1,
                        Name = "First Floor",
                        Rooms = new List<Room>
                        {
                            new Room
                            {
                                Id = 101,
                                Name = "Room 101",
                                Devices = new List<IDevice>
                                {
                                    new Light { Id = 1, Name = "Ceiling Light" },
                                    new Thermostat("default.txt") { Id = 2, Name = "Thermostat", TargetTemperature = 20},
                                    new Light {Id = 3, Name = "Lamp"}
                                }
                            },
                            new Room
                            {
                                Id = 102,
                                Name = "Room 102",
                                Devices = new List<IDevice>
                                {
                                    new Light { Id = 4, Name = "Main Light" },
                                    new HVAC { Id = 5, Name = "HVAC System" },
                                    new SmartDoorbell("default.txt") {Id = 6, Name = "SmartDoorbell" }
                                }
                            }
                        }
                    },
                    new Floor
                    {
                        Id = 2,
                        Name = "Second Floor",
                        Rooms = new List<Room>
                        {
                            new Room
                            {
                                Id = 201,
                                Name = "Room 201",
                                Devices = new List<IDevice>
                                {
                                    new Light { Id = 7, Name = "Desk Lamp" },
                                    new SmartDoorbell("default.txt") { Id = 8, Name = "SmartDoorbell" },
                                    new AlarmSystem("default.txt") {Id = 9, Name = "AlarmSystem"}
                                }
                            }
                        }
                    },
                    new Floor
                    {
                        Id = 3,
                        Name = "Third Floor",
                        Rooms = new List<Room>
                        {
                            new Room
                            {
                                Id = 301,
                                Name = "Room 301",
                                Devices = new List<IDevice>
                                {
                                    new Light { Id = 10, Name = "Desk Lamp" },
                                    new SmartDoorbell("default.txt") { Id = 11, Name = "SmartDoorbell" },
                                    new AlarmSystem("default.txt") {Id = 12, Name = "AlarmSystem"}
                                }
                            }
                        }
                    }
                }
            };
        }
        // helps controllers find rooms and devices
        public object? GetDeviceById(int roomId, int deviceId)
        {
            return Hotel.Floors
                .SelectMany(f => f.Rooms)
                .FirstOrDefault(r => r.Id == roomId)?
                .Devices.FirstOrDefault(d => d.Id == deviceId);
        }

        public Room? GetRoom(int roomId)
        {
            return Hotel.Floors
                .SelectMany(f => f.Rooms)
                .FirstOrDefault(r => r.Id == roomId);
        }

        public IEnumerable<IDevice>? GetDevicesInRoom(int roomId)
        {
            var room = GetRoom(roomId);
            return room?.Devices;
        }

        // send command to a device
        public bool SendCommmand(int roomId, int deviceId, string command)
        {
            var device = GetDeviceById(roomId, deviceId);
            if (device == null)
            {
                return false;
            }

            if (device is IControllable controllable)
            {
                controllable.ExecuteCommand(command);
                return true;
            }

            return false;
        }

        public Hotel GetHotel()
        {
            return  Hotel;
        }
    }
}
