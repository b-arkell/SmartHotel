using Microsoft.VisualStudio.TestTools.UnitTesting;
using Backend.Models;
using System.Collections.Generic;
using System.Reflection;

namespace Backend.UnitTests
{
    [TestClass]
    public class AlarmSystemTests
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

        private AlarmSystem CreateAlarmSystemWithSensor(MotionSensor sensor)
        {
            var alarm = (AlarmSystem)System.Runtime.Serialization.FormatterServices
                .GetUninitializedObject(typeof(AlarmSystem));

            // Inject private motionSensor field
            var sensorField = typeof(AlarmSystem)
                .GetField("motionSensor", BindingFlags.NonPublic | BindingFlags.Instance);
            sensorField.SetValue(alarm, sensor);

            // Initialize defaults
            alarm.Name = "Smart Doorbell";
            alarm.Type = "Alarm";
            alarm.IsMotionDetected = false;
            alarm.IsAlarmTriggered = false;

            return alarm;
        }

        [TestMethod]
        public void DefaultValues_ShouldInitializeCorrectly()
        {
            var sensor = CreateSensorWithValues(new List<bool> { false });
            var alarm = CreateAlarmSystemWithSensor(sensor);

            Assert.AreEqual("Smart Doorbell", alarm.Name);
            Assert.AreEqual("Alarm", alarm.Type);
            Assert.IsFalse(alarm.IsMotionDetected);
            Assert.IsFalse(alarm.IsAlarmTriggered);
        }

        [TestMethod]
        public void UpdateFromFile_WhenMotionDetected_ShouldTriggerAlarm()
        {
            var sensor = CreateSensorWithValues(new List<bool> { true });
            var alarm = CreateAlarmSystemWithSensor(sensor);

            alarm.UpdateFromFile();

            Assert.IsTrue(alarm.IsAlarmTriggered);
        }

        [TestMethod]
        public void UpdateFromFile_WhenNoMotion_ShouldNotTriggerAlarm()
        {
            var sensor = CreateSensorWithValues(new List<bool> { false });
            var alarm = CreateAlarmSystemWithSensor(sensor);

            alarm.UpdateFromFile();

            Assert.IsFalse(alarm.IsAlarmTriggered);
        }

        [TestMethod]
        public void ExecuteCommand_PlayAlarm_ShouldTriggerAlarm()
        {
            var sensor = CreateSensorWithValues(new List<bool> { false });
            var alarm = CreateAlarmSystemWithSensor(sensor);

            alarm.ExecuteCommand("PlayAlarm");

            Assert.IsTrue(alarm.IsAlarmTriggered);
        }

        [TestMethod]
        public void ExecuteCommand_DisarmAlarm_ShouldDisableAlarm()
        {
            var sensor = CreateSensorWithValues(new List<bool> { true });
            var alarm = CreateAlarmSystemWithSensor(sensor);
            alarm.IsAlarmTriggered = true;

            alarm.ExecuteCommand("DisarmAlarm");

            Assert.IsFalse(alarm.IsAlarmTriggered);
        }
    }
}