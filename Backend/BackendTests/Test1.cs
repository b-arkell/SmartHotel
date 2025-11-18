using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Controllers;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackendTests
{
    [TestClass]
    public class DeviceControllerTests
    {
        [TestInitialize]
        public void TestInit()
        {
            typeof(DeviceController)
                .GetField("_device", System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.NonPublic)
                ?.SetValue(null, new Device { Id = 1, Name = "Light", Status = "Off" });
        }

        [TestMethod]
        public void GetDevice_ReturnsDeviceWithDefaultStatus()
        {
            // Arrange
            var controller = new DeviceController();

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
            var controller = new DeviceController();

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
            var controller = new DeviceController();

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
            var controller = new DeviceController();

            // Act
            var result = controller.SetDeviceStatus("Dim") as BadRequestObjectResult;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual("Invalid status. Use 'On' or 'Off'.", result.Value);
        }
    }
}