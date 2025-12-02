using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Models;
using System.Collections.Generic;
using System.Reflection;

namespace Backed.UnitTests
{
    [TestClass]
    public class MotionSensorLogicTests
    {
        private MotionSensor CreateSensorWithValues(List<bool> values)
        {
            var sensor = (MotionSensor)System.Runtime.Serialization.FormatterServices
                .GetUninitializedObject(typeof(MotionSensor));

            // Use reflection to set private fields
            var motionValuesField = typeof(MotionSensor)
                .GetField("motionValues", BindingFlags.NonPublic | BindingFlags.Instance);
            motionValuesField.SetValue(sensor, values);

            var currentIndexField = typeof(MotionSensor)
                .GetField("currentIndex", BindingFlags.NonPublic | BindingFlags.Instance);
            currentIndexField.SetValue(sensor, 0);

            return sensor;
        }

        [TestMethod]
        public void GetNextMotionValue_ShouldCycleThroughValues()
        {
            var sensor = CreateSensorWithValues(new List<bool> { true, false });

            Assert.IsTrue(sensor.GetNextMotionValue());   // first value
            Assert.IsFalse(sensor.GetNextMotionValue());  // second value
            Assert.IsTrue(sensor.GetNextMotionValue());   // cycles back
        }

        [TestMethod]
        public void UpdateFromFile_ShouldUpdateIsMotionDetected()
        {
            var sensor = CreateSensorWithValues(new List<bool> { true });

            sensor.UpdateFromFile();

            Assert.IsTrue(sensor.isMotionDetected);
        }

        [TestMethod]
        public void GetNextMotionValue_ShouldUpdateIsMotionDetected()
        {
            var sensor = CreateSensorWithValues(new List<bool> { false, true });

            var result1 = sensor.GetNextMotionValue();
            Assert.IsFalse(result1);
            Assert.IsFalse(sensor.isMotionDetected);

            var result2 = sensor.GetNextMotionValue();
            Assert.IsTrue(result2);
            Assert.IsTrue(sensor.isMotionDetected);
        }
    }
}