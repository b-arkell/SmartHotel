using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Models;
using System.Collections.Generic;
using System.Reflection;

namespace Backend.UnitTests
{
    [TestClass]
    public class TemperatureSensorTests
    {
        private TemperatureSensor CreateSensorWithValues(List<double> values)
        {
            // Create TemperatureSensor without running its constructor
            var sensor = (TemperatureSensor)System.Runtime.Serialization.FormatterServices
                .GetUninitializedObject(typeof(TemperatureSensor));

            // Inject private fields
            var tempValuesField = typeof(TemperatureSensor)
                .GetField("tempFromSensor", BindingFlags.NonPublic | BindingFlags.Instance);
            tempValuesField.SetValue(sensor, values);

            var currentIndexField = typeof(TemperatureSensor)
                .GetField("currentIndex", BindingFlags.NonPublic | BindingFlags.Instance);
            currentIndexField.SetValue(sensor, 0);

            return sensor;
        }

        [TestMethod]
        public void GetNextTemperature_ShouldCycleThroughValues()
        {
            var sensor = CreateSensorWithValues(new List<double> { 20.5, 21.0 });

            Assert.AreEqual(20.5, sensor.GetNextTemperature());
            Assert.AreEqual(21.0, sensor.GetNextTemperature());
            Assert.AreEqual(20.5, sensor.GetNextTemperature()); // cycles back
        }

        [TestMethod]
        public void GetNextTemperature_ShouldUpdateCurrentTemp()
        {
            var sensor = CreateSensorWithValues(new List<double> { 18.0, 19.5 });

            var temp1 = sensor.GetNextTemperature();
            Assert.AreEqual(temp1, sensor.CurrentTemp);

            var temp2 = sensor.GetNextTemperature();
            Assert.AreEqual(temp2, sensor.CurrentTemp);
        }

        [TestMethod]
        public void UpdateFromFile_ShouldUpdateCurrentTemp()
        {
            var sensor = CreateSensorWithValues(new List<double> { 22.0 });

            sensor.UpdateFromFile();

            Assert.AreEqual(22.0, sensor.CurrentTemp);
        }

        [TestMethod]
        [ExpectedException(typeof(System.InvalidOperationException))]
        public void GetNextTemperature_WithNoValues_ShouldThrow()
        {
            var sensor = CreateSensorWithValues(new List<double>()); // empty list
            sensor.GetNextTemperature();
        }
    }
}
