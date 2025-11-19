using System;
using System.Collections.Generic;
using System.IO;

namespace Backend.Models
{
    public class TemperatureSensor : IDevice, ISensor
    {
        private const string DefaultDirectory = "Mocks/TemperatureSensor";
        public int Id { get; set; }
        public string Name { get; set; } = "Temperature Sensor";
        public string Type { get; set; } = "Sensor";
        public double CurrentTemp { get; set; }

        // mock temperature (and index in mock file)
        private List<double> tempFromSensor = new();
        private int currentIndex = 0;

        public TemperatureSensor()
        {
            LoadTemperaturesFromFile(Path.Combine(DefaultDirectory, "default.txt"));
        }
        public TemperatureSensor(string filename)
        {
            var filePath = Path.Combine(DefaultDirectory, filename);
            LoadTemperaturesFromFile(filePath);
        }

        private void LoadTemperaturesFromFile(string filePath)
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException($"Temperature file not found: {filePath}");

            var lines = File.ReadAllLines(filePath);
            if (lines.Length != 24)
                throw new InvalidDataException("Temperature file must contain exactly 24 lines.");

            tempFromSensor.Clear();
            foreach (var line in lines)
            {
                if (double.TryParse(line, out double temp))
                    tempFromSensor.Add(temp);
                else
                    throw new InvalidDataException($"Invalid temperature value: {line}");
            }
        }

        public double GetNextTemperature()
        {
            if (tempFromSensor.Count == 0)
                throw new InvalidOperationException("No temperatures loaded.");

            var temp = tempFromSensor[currentIndex];
            currentIndex = (currentIndex + 1) % tempFromSensor.Count;
            CurrentTemp = temp;
            return temp;
        }

        public void UpdateFromFile(string filePath)
        {
            LoadTemperaturesFromFile(filePath);
            currentIndex = 0;
        }
    }
}