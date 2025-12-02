using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Models;
using System.Collections.Generic;
using System.Reflection;

namespace Backend.UnitTests
{
    [TestClass]
    public class ThermostatTests
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

        private Thermostat CreateThermostatWithSensor(TemperatureSensor sensor)
        {
            var thermostat = (Thermostat)System.Runtime.Serialization.FormatterServices
                .GetUninitializedObject(typeof(Thermostat));

            // Inject Sensor
            var sensorProp = typeof(Thermostat)
                .GetProperty("Sensor", BindingFlags.Public | BindingFlags.Instance);
            sensorProp.SetValue(thermostat, sensor);

            // Initialize defaults
            thermostat.Name = "Thermostat";
            thermostat.Type = "Controllable";
            thermostat.TargetTemperature = 0;
            thermostat.currentTemperature = 0;

            return thermostat;
        }

        [TestMethod]
        public void ExecuteCommand_SetTemperature_ShouldUpdateTargetTemperature()
        {
            var sensor = CreateSensorWithValues(new List<double> { 20.0 });
            var thermostat = CreateThermostatWithSensor(sensor);

            thermostat.ExecuteCommand("SetTemperature 22.5");

            Assert.AreEqual(22.5, thermostat.TargetTemperature);
        }

        [TestMethod]
        public void ExecuteCommand_InvalidCommand_ShouldNotChangeTargetTemperature()
        {
            var sensor = CreateSensorWithValues(new List<double> { 20.0 });
            var thermostat = CreateThermostatWithSensor(sensor);

            thermostat.TargetTemperature = 21.0;
            thermostat.ExecuteCommand("InvalidCommand");

            Assert.AreEqual(21.0, thermostat.TargetTemperature);
        }

        [TestMethod]
        public void UpdateFromFile_ShouldUpdateCurrentTemperature()
        {
            var sensor = CreateSensorWithValues(new List<double> { 19.5 });
            var thermostat = CreateThermostatWithSensor(sensor);

            thermostat.UpdateFromFile();

            Assert.AreEqual(19.5, thermostat.currentTemperature);
        }

        [TestMethod]
        public void UpdateFromFile_ShouldCycleThroughSensorValues()
        {
            var sensor = CreateSensorWithValues(new List<double> { 18.0, 20.0 });
            var thermostat = CreateThermostatWithSensor(sensor);

            thermostat.UpdateFromFile();
            Assert.AreEqual(18.0, thermostat.currentTemperature);

            thermostat.UpdateFromFile();
            Assert.AreEqual(20.0, thermostat.currentTemperature);

            thermostat.UpdateFromFile();
            Assert.AreEqual(18.0, thermostat.currentTemperature); // cycles back
        }
    }
}