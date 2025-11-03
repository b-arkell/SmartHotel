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
                                    new Thermostat { Id = 2, Name = "Thermostat" }
                                }
                            },
                            new Room
                            {
                                Id = 102,
                                Name = "Room 102",
                                Devices = new List<IDevice>
                                {
                                    new Light { Id = 3, Name = "Main Light" },
                                    new HVAC { Id = 4, Name = "HVAC System" }
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
                                    new Light { Id = 6, Name = "Desk Lamp" }
                                }
                            }
                        }
                    }
                }
            };
        }
        // helps controllers find rooms and devices
        public IDevice? GetDeviceById(int roomId, int deviceId)
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
    }
}
