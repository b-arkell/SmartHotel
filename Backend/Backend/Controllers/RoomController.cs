using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController : Controller
    {
        private readonly HotelSetup _HotelSetup;


        public RoomController(HotelSetup hotelSetup)
        {
            _HotelSetup = hotelSetup;
        }

        // get a device by id   
        [HttpGet("{roomId}/{deviceId}")]
        public IActionResult GetDeviceStatus(int roomId, int deviceId)
        {
            var device = _HotelSetup.GetDeviceById(roomId, deviceId);
            if (device == null)
            {
                return NotFound("Device not found.");
            }
            return Ok(device);
        }

        // get all devices in a room
        [HttpGet("{roomId}/devices")]
        public IActionResult GetAllDevicesInRoom(int roomId)
        {
            var devices = _HotelSetup.GetDevicesInRoom(roomId);
            if (devices == null)
            {
                return NotFound("No devices found in the specified room.");
            }
            return Ok(devices);

        }

        //  send command to a device
        [HttpPut("{roomId}/{deviceId}/command")]
        public IActionResult SendCommandToDevice(int roomId, int deviceId, [FromBody] string command)
        {
            var success = _HotelSetup.SendCommmand(roomId, deviceId, command);
            if (!success)
            {
                return BadRequest("Failed to send command to device.");
            }
            return Ok("Command sent successfully.");

        }
    } 
}
