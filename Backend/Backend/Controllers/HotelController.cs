using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelController : ControllerBase
    {
        private readonly HotelSetup _HotelSetup;

        public HotelController(HotelSetup hotelSetup)
        {
            _HotelSetup = hotelSetup;
        }

        // GET: api/hotel
        [HttpGet]
        public IActionResult Get()
        {
            var hotel = _HotelSetup.GetHotel();
            if (hotel == null)
            {
                return NotFound("Hotel data not found.");
            }
            return Ok(hotel);
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
