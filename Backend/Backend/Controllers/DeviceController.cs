using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DeviceController : ControllerBase
    {
        private static Device _device = new Device
        {
            Id = 1,
            Name = "Light",
            Status = "Off"
        };

        [HttpGet]
        public IActionResult GetDevice()
        {
            return Ok(_device);
        }

        [HttpPut]
        public IActionResult SetDeviceStatus([FromBody] string status)
        {
            if (status != "On" && status != "Off")
            {
                return BadRequest("Invalid status. Use 'On' or 'Off'.");
            }
            _device.setLight(status);
            return Ok(_device);
        }
    }
}
