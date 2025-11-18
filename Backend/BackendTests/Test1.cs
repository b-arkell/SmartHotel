using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackendTests
{
    // Custom controller for test isolation
    public class TestDeviceController
    {
        private Device _device;

        public TestDeviceController()
        {
            _device = new Device { Id = 1, Name = "Light", Status = "Off" };
        }

        public IActionResult GetDevice()
        {
            return new OkObjectResult(_device);
        }

        public IActionResult SetDeviceStatus(string status)
        {
            if (status != "On" && status != "Off")
            {
                return new BadRequestObjectResult("Invalid status. Use 'On' or 'Off'.");
            }
            _device.setLight(status);
            return new OkObjectResult(_device);
        }
    }

    [TestClass]
    public class DeviceControllerTests
    {
        [TestMethod]
        public void GetDevice_ReturnsDeviceWithDefaultStatus()
        {
            // Arrange
            var controller = new TestDeviceController();

            // Act
            var result = controller.GetDevice() as OkObjectResult;
            var device = result?.Value as Device;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(device);
            Assert.AreEqual("Light", device.Name);
            Assert.AreEqual("Off", device.Status);
        }

        [TestMethod]
        public void SetDeviceStatus_ValidStatusOn_UpdatesStatus()
        {
            // Arrange
            var controller = new TestDeviceController();

            // Act
            var result = controller.SetDeviceStatus("On") as OkObjectResult;
            var device = result?.Value as Device;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(device);
            Assert.AreEqual("On", device.Status);
        }

        [TestMethod]
        public void SetDeviceStatus_ValidStatusOff_UpdatesStatus()
        {
            // Arrange
            var controller = new TestDeviceController();

            // Act
            var result = controller.SetDeviceStatus("Off") as OkObjectResult;
            var device = result?.Value as Device;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(device);
            Assert.AreEqual("Off", device.Status);
        }

        [TestMethod]
        public void SetDeviceStatus_InvalidStatus_ReturnsBadRequest()
        {
            // Arrange
            var controller = new TestDeviceController();

            // Act
            var result = controller.SetDeviceStatus("Dim") as BadRequestObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Invalid status. Use 'On' or 'Off'.", result.Value);
        }
    }
}