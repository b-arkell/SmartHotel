using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Models;

namespace Backend.UnitTests
{
    [TestClass]
    public class LightTests
    {
        [TestMethod]
        public void DefaultValues_ShouldBeLightAndOff()
        {
            // Arrange
            var device = new Device();

            // Assert
            Assert.AreEqual("Light", device.Name);
            Assert.AreEqual("Off", device.Status);
        }

        [TestMethod]
        public void SetLight_On_ShouldUpdateStatus()
        {
            // Arrange
            var device = new Device();

            // Act
            device.setLight("On");

            // Assert
            Assert.AreEqual("On", device.Status);
        }

        [TestMethod]
        public void SetLight_Off_ShouldUpdateStatus()
        {
            // Arrange
            var device = new Device();

            // Act
            device.setLight("Off");

            // Assert
            Assert.AreEqual("Off", device.Status);
        }

        [TestMethod]
        public void SetLight_InvalidValue_ShouldNotChangeStatus()
        {
            // Arrange
            var device = new Device();

            // Act
            device.setLight("Invalid");

            // Assert
            Assert.AreEqual("Off", device.Status); // remains unchanged
        }
    }
}
