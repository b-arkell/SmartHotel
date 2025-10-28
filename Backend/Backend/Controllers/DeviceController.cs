using Microsoft.AspNetCore.Mvc;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DeviceController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetDevice()
        {
            var device = new Device
            {
                Id = 1,
                Name = "Light",
                Status = "Off"
            };
            return Ok(device);
        }
    }
}
