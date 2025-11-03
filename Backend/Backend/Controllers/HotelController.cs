using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelController : ControllerBase
    {
        // GET: api/hotel
        [HttpGet]
        public IActionResult Get()
        {
            // Just return a simple message or dummy data
            return Ok(new
            {
                Message = "HotelController is working!",
                Time = System.DateTime.Now
            });
        }

        private readonly HotelSetup _HotelSetup;

        public HotelController(HotelSetup hotelSetup)
        {
            _HotelSetup = hotelSetup;
        }

        // Example Get endpoint
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
    }
}
