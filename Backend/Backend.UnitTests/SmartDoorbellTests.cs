using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Models;
using System.Collections.Generic;
using System.Reflection;

namespace Backed.UnitTests
{
    [TestClass]
    public class SmartDoorbellTests
    {
        private MotionSensor CreateSensorWithValues(List<bool> values)
        {
            // Create MotionSensor without running its constructor
            var sensor = (MotionSensor)System.Runtime.Serialization.FormatterServices
                .GetUninitializedObject(typeof(MotionSensor));

            // Inject private fields
            var motionValuesField = typeof(MotionSensor)
                .GetField("motionValues", BindingFlags.NonPublic | BindingFlags.Instance);
            motionValuesField.SetValue(sensor, values);

            var currentIndexField = typeof(MotionSensor)
                .GetField("currentIndex", BindingFlags.NonPublic | BindingFlags.Instance);
            currentIndexField.SetValue(sensor, 0);

            return sensor;
        }

        private SmartDoorbell CreateDoorbellWithSensor(MotionSensor sensor)
        {
            var doorbell = new SmartDoorbell();

            // Replace private Sensor field with our fake sensor
            var sensorField = typeof(SmartDoorbell)
                .GetField("Sensor", BindingFlags.NonPublic | BindingFlags.Instance);
            sensorField.SetValue(doorbell, sensor);

            return doorbell;
        }

        [TestMethod]
        public void DefaultConstructor_ShouldInitializeIdleImage()
        {
            var doorbell = new SmartDoorbell();

            Assert.AreEqual("Smart Doorbell", doorbell.Name);
            Assert.AreEqual("Doorbell", doorbell.Type);
            Assert.AreEqual(doorbell.IdleImagePath, doorbell.currentImage);
            Assert.IsFalse(doorbell.isMotionDetected);
        }

        [TestMethod]
        public void UpdateFromFile_WhenMotionDetected_ShouldSwitchToMotionImage()
        {
            var sensor = CreateSensorWithValues(new List<bool> { true });
            var doorbell = CreateDoorbellWithSensor(sensor);

            doorbell.UpdateFromFile();

            Assert.IsTrue(doorbell.isMotionDetected);
            Assert.AreEqual(doorbell.MotionImagePath, doorbell.currentImage);
        }

        [TestMethod]
        public void UpdateFromFile_WhenNoMotion_ShouldStayIdleImage()
        {
            var sensor = CreateSensorWithValues(new List<bool> { false });
            var doorbell = CreateDoorbellWithSensor(sensor);

            doorbell.UpdateFromFile();

            Assert.IsFalse(doorbell.isMotionDetected);
            Assert.AreEqual(doorbell.IdleImagePath, doorbell.currentImage);
        }

        [TestMethod]
        public void UpdateFromFile_ShouldCycleImagesBasedOnSensorValues()
        {
            var sensor = CreateSensorWithValues(new List<bool> { true, false });
            var doorbell = CreateDoorbellWithSensor(sensor);

            // First update: motion detected
            doorbell.UpdateFromFile();
            Assert.AreEqual(doorbell.MotionImagePath, doorbell.currentImage);

            // Second update: no motion
            doorbell.UpdateFromFile();
            Assert.AreEqual(doorbell.IdleImagePath, doorbell.currentImage);
        }
    }
}