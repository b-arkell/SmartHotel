using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Models;
using System.Collections.Generic;
using System.Reflection;

namespace Backend.UnitTests
{
    [TestClass]
    public class SmartDoorbellTests
    {
        // Helper: create a MotionSensor with injected values (no file I/O)
        private MotionSensor CreateSensorWithValues(List<bool> values)
        {
            var sensor = (MotionSensor)System.Runtime.Serialization.FormatterServices
                .GetUninitializedObject(typeof(MotionSensor));

            var motionValuesField = typeof(MotionSensor)
                .GetField("motionValues", BindingFlags.NonPublic | BindingFlags.Instance);
            motionValuesField.SetValue(sensor, values);

            var currentIndexField = typeof(MotionSensor)
                .GetField("currentIndex", BindingFlags.NonPublic | BindingFlags.Instance);
            currentIndexField.SetValue(sensor, 0);

            return sensor;
        }

        [TestMethod]
        public void Constructor_ShouldInitializeIdleImage()
        {
            var sensor = CreateSensorWithValues(new List<bool> { false });
            var doorbell = new SmartDoorbell(sensor);

            Assert.AreEqual("Smart Doorbell", doorbell.Name);
            Assert.AreEqual("Doorbell", doorbell.Type);
            Assert.AreEqual(doorbell.IdleImagePath, doorbell.currentImage);
            Assert.IsFalse(doorbell.isMotionDetected);
        }

        [TestMethod]
        public void UpdateFromFile_WhenMotionDetected_ShouldSwitchToMotionImage()
        {
            var sensor = CreateSensorWithValues(new List<bool> { true });
            var doorbell = new SmartDoorbell(sensor);

            doorbell.UpdateFromFile();

            Assert.IsTrue(doorbell.isMotionDetected);
            Assert.AreEqual(doorbell.MotionImagePath, doorbell.currentImage);
        }

        [TestMethod]
        public void UpdateFromFile_WhenNoMotion_ShouldStayIdleImage()
        {
            var sensor = CreateSensorWithValues(new List<bool> { false });
            var doorbell = new SmartDoorbell(sensor);

            doorbell.UpdateFromFile();

            Assert.IsFalse(doorbell.isMotionDetected);
            Assert.AreEqual(doorbell.IdleImagePath, doorbell.currentImage);
        }

        [TestMethod]
        public void UpdateFromFile_ShouldCycleImagesBasedOnSensorValues()
        {
            var sensor = CreateSensorWithValues(new List<bool> { true, false });
            var doorbell = new SmartDoorbell(sensor);

            // First update: motion detected
            doorbell.UpdateFromFile();
            Assert.AreEqual(doorbell.MotionImagePath, doorbell.currentImage);

            // Second update: no motion
            doorbell.UpdateFromFile();
            Assert.AreEqual(doorbell.IdleImagePath, doorbell.currentImage);
        }
    }
}