using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Models;
using System;

namespace Backend.UnitTests
{
    [TestClass]
    public class HVACTests
    {
        [TestMethod]
        public void DefaultValues_ShouldInitializeCorrectly()
        {
            var hvac = new HVAC();

            Assert.AreEqual("HVAC System", hvac.Name);
            Assert.AreEqual("HVAC", hvac.Type);
            Assert.AreEqual(HVAC.HVACMode.Fan, hvac.Mode);
            Assert.AreEqual(HVAC.FanSpeedLevel.Low, hvac.FanSpeed);
        }

        [TestMethod]
        public void ExecuteCommand_SetMode_ShouldUpdateMode()
        {
            var hvac = new HVAC();

            hvac.ExecuteCommand("SetMode Cool");
            Assert.AreEqual(HVAC.HVACMode.Cool, hvac.Mode);

            hvac.ExecuteCommand("SetMode Heat");
            Assert.AreEqual(HVAC.HVACMode.Heat, hvac.Mode);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void ExecuteCommand_SetMode_Invalid_ShouldThrow()
        {
            var hvac = new HVAC();
            hvac.ExecuteCommand("SetMode InvalidMode");
        }

        [TestMethod]
        public void ExecuteCommand_SetFanSpeed_ShouldUpdateFanSpeed()
        {
            var hvac = new HVAC();

            hvac.ExecuteCommand("SetFanSpeed Medium");
            Assert.AreEqual(HVAC.FanSpeedLevel.Medium, hvac.FanSpeed);

            hvac.ExecuteCommand("SetFanSpeed 3"); // numeric
            Assert.AreEqual(HVAC.FanSpeedLevel.High, hvac.FanSpeed);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void ExecuteCommand_SetFanSpeed_Invalid_ShouldThrow()
        {
            var hvac = new HVAC();
            hvac.ExecuteCommand("SetFanSpeed Ultra");
        }

        [TestMethod]
        public void IncreaseFanSpeed_AtHigh_ShouldReturnFalse()
        {
            var hvac = new HVAC { FanSpeed = HVAC.FanSpeedLevel.High };

            var result = hvac.IncreaseFanSpeed();

            Assert.IsFalse(result);
            Assert.AreEqual(HVAC.FanSpeedLevel.High, hvac.FanSpeed);
        }

        [TestMethod]
        public void DecreaseFanSpeed_AtLow_ShouldReturnFalse()
        {
            var hvac = new HVAC { FanSpeed = HVAC.FanSpeedLevel.Low };

            var result = hvac.DecreaseFanSpeed();

            Assert.IsFalse(result);
            Assert.AreEqual(HVAC.FanSpeedLevel.Low, hvac.FanSpeed);
        }
    }
}
