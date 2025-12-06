using Backend.Models;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services
{
    public class HotelSetup
    {
        public Hotel Hotel { get; private set; }

        public HotelSetup(IWebHostEnvironment env)
        {
            if (env.IsEnvironment("IntegrationTests"))
            {
                // When the test environment starts, build the test hotel structure
                Hotel = initializeHotelForTests();
            }else
            {
                // When the backend starts, build the entire hotel structure
                Hotel = InitializeHotel();
            }
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
                                    new Light {Id = 3, Name = "Lamp"},
                                    new HVAC { Id = 38, Name = "HVAC System" }
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
                                    new SmartDoorbell("MotionSensor1.txt") { Id = 8, Name = "SmartDoorbell" },
                                    new Thermostat("tempSensor1.txt") { Id = 49, Name = "Thermostat", TargetTemperature = 20},
                                    new AlarmSystem("MotionSensor1.txt") {Id = 9, Name = "AlarmSystem"},
                                     new HVAC { Id = 39, Name = "HVAC System" }
                                }
                            },
                             new Room
                            {
                                Id = 202,
                                Name = "Room 202",
                                Devices = new List<IDevice>
                                {
                                    new Light { Id = 13, Name = "Desk Lamp" },
                                    new SmartDoorbell("default.txt") { Id = 14, Name = "SmartDoorbell" },
                                    new AlarmSystem("MotionSensor1.txt") {Id = 15, Name = "AlarmSystem"},
                                     new Thermostat("tempSensor2.txt") { Id = 50, Name = "Thermostat", TargetTemperature = 20},
                                     new HVAC { Id = 40, Name = "HVAC System" }
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
                                    new AlarmSystem("MotionSensor2.txt") {Id = 12, Name = "AlarmSystem"},
                                     new Thermostat("tempSensor3.txt") { Id = 51, Name = "Thermostat", TargetTemperature = 20},
                                    new HVAC { Id = 37, Name = "HVAC System" }
                                }
                            },
                            new Room
                            {
                                Id = 302,
                                Name = "Room 302",
                                Devices = new List<IDevice>
                                {
                                    new Light { Id = 34, Name = "Desk Lamp" },
                                    new SmartDoorbell("default.txt") { Id = 35, Name = "SmartDoorbell" },
                                    new AlarmSystem("MotionSensor3.txt") {Id = 36, Name = "AlarmSystem"},
                                    new Thermostat("tempSensor1.txt") { Id = 52, Name = "Thermostat", TargetTemperature = 20},
                                    new HVAC { Id = 41, Name = "HVAC System" }
                                }
                            }
                        }
                    },
                    new Floor
                    {
                        Id = 4,
                        Name = "Fourth Floor",
                        Rooms = new List<Room>
                        {
                            new Room
                            {
                                Id = 401,
                                Name = "Room 401",
                                Devices = new List<IDevice>
                                {
                                    new Light { Id = 16, Name = "Ceiling Light" },
                                    new Thermostat("default.txt") { Id = 17, Name = "Thermostat", TargetTemperature = 20},
                                    new HVAC { Id = 42, Name = "HVAC System" },
                                    new Light {Id = 18, Name = "Lamp"}
                                }
                            },
                            new Room
                            {
                                Id = 402,
                                Name = "Room 402",
                                Devices = new List<IDevice>
                                {
                                    new Light { Id = 19, Name = "Main Light" },
                                    new Light { Id = 43, Name = "Desk Lamp" },
                                    new HVAC { Id = 43, Name = "HVAC System" },
                                    new AlarmSystem("MotionSensor3.txt") {Id = 48, Name = "AlarmSystem"},
                                     new Thermostat("tempSensor2.txt") { Id = 53, Name = "Thermostat", TargetTemperature = 20},
                                    new SmartDoorbell("default.txt") {Id = 21, Name = "SmartDoorbell" }
                                }
                            }
                        }
                    },
                    new Floor
                    {
                        Id = 5,
                        Name = "Fifth Floor",
                        Rooms = new List<Room>
                        {
                            new Room
                            {
                                Id = 501,
                                Name = "Room 501",
                                Devices = new List<IDevice>
                                {
                                    new Light { Id = 22, Name = "Desk Lamp" },
                                    new SmartDoorbell("MotionSensor2.txt") { Id = 23, Name = "SmartDoorbell" },
                                    new AlarmSystem("MotionSensor3.txt") {Id = 24, Name = "AlarmSystem"},
                                    new HVAC { Id = 44, Name = "HVAC System" }
                                }
                            },
                             new Room
                            {
                                Id = 502,
                                Name = "Room 502",
                                Devices = new List<IDevice>
                                {
                                    new Light { Id = 25, Name = "Desk Lamp" },
                                    new SmartDoorbell("MotionSensor3.txt") { Id = 26, Name = "SmartDoorbell" },
                                    new AlarmSystem("MotionSensor2.txt") {Id = 27, Name = "AlarmSystem"},
                                    new HVAC { Id = 45, Name = "HVAC System" }
                                }
                            }
                        }
                    },
                    new Floor
                    {
                        Id = 6,
                        Name = "Sixth Floor",
                        Rooms = new List<Room>
                        {
                            new Room
                            {
                                Id = 601,
                                Name = "Room 601",
                                Devices = new List<IDevice>
                                {
                                    new Light { Id = 28, Name = "Desk Lamp" },
                                    new SmartDoorbell("MotionSensor1.txt") { Id = 29, Name = "SmartDoorbell" },
                                    new AlarmSystem("MotionSensor2.txt") {Id = 30, Name = "AlarmSystem"},
                                    new HVAC { Id = 46, Name = "HVAC System" }
                                }
                            },
                            new Room
                            {
                                Id = 602,
                                Name = "Room 602",
                                Devices = new List<IDevice>
                                {
                                    new Light { Id = 31, Name = "Desk Lamp" },
                                    new SmartDoorbell("MotionSensor3.txt") { Id = 32, Name = "SmartDoorbell" },
                                    new AlarmSystem("MotionSensor1.txt") {Id = 33, Name = "AlarmSystem"},
                                    new HVAC { Id = 47, Name = "HVAC System" }
                                }
                            }
                        }
                    }
                }
            };
        }

        // test hotel structure for integration tests
        private Hotel initializeHotelForTests()
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
                                    new Thermostat() { Id = 2, Name = "Thermostat", TargetTemperature = 20},
                                    new Light {Id = 3, Name = "Lamp"}
                                }
                            },
                            new Room
                            {
                                Id = 102,
                                Name = "Room 102",
                                Devices = new List<IDevice>
                                {
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
                                    new AlarmSystem() {Id = 9, Name = "AlarmSystem"},
                                     new Thermostat() { Id = 49, Name = "Thermostat", TargetTemperature = 20},
                                     new HVAC { Id = 39, Name = "HVAC System" }
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
