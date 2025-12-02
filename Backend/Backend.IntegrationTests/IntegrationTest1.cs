using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Text;
using Backend;
using Backend.Models;
using Microsoft.AspNetCore.Hosting;

namespace Backend.IntegrationTests
{
    [TestClass]
    public sealed class RoomControllerIntegrationTests
    {
        private static WebApplicationFactory<Program>? _factory;
        private static HttpClient? _client;

        [ClassInitialize]
        public static void ClassInitialize(TestContext _)
        {
            _factory = new WebApplicationFactory<Program>()
                .WithWebHostBuilder(builder =>
                {
                    builder.UseEnvironment("IntegrationTests");
                    builder.UseContentRoot(System.IO.Directory.GetCurrentDirectory());
                });

            _client = _factory.CreateClient();
        }


        [TestMethod]
        public async Task GetDeviceByID_ReturnThermostat() // TODO: add ore getDevices (try all)
        {

            // Act
            var response = await _client!.GetAsync("/api/Room/101/2");

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);

            var content = await response.Content.ReadAsStringAsync();

            Assert.IsTrue(content.Contains("Thermostat"));

        }

        [TestMethod]
        public async Task GetDeviceByID_ReturnLight() // TODO: change this to different device
        {

            // Act
            var response = await _client!.GetAsync("/api/Room/101/1");

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);

            var content = await response.Content.ReadAsStringAsync();

            Assert.IsTrue(content.Contains("Ceiling Light"));

        }

        [TestMethod]
        public async Task GetDeviceByID_ReturnHVAC()
        {

            // Act
            var response = await _client!.GetAsync("/api/Room/102/5");

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);

            var content = await response.Content.ReadAsStringAsync();

            Assert.IsTrue(content.Contains("HVAC System"));

        }

        [TestMethod]
        public async Task GetDeviceByID_ReturnSmartDoorbell()
        {

            // Act
            var response = await _client!.GetAsync("/api/Room/102/6");

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);

            var content = await response.Content.ReadAsStringAsync();

            Assert.IsTrue(content.Contains("SmartDoorbell"));

        }

        [TestMethod]
        public async Task GetDeviceByID_ReturnSmartAlarmSystem() 
        {

            // Act
            var response = await _client!.GetAsync("/api/Room/201/9");

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);

            var content = await response.Content.ReadAsStringAsync();

            Assert.IsTrue(content.Contains("AlarmSystem"));

        }

        [TestMethod]
        public async Task GetAllDevicesInRoom() 
        {

            // Act
            var response = await _client!.GetAsync("/api/Room/101/devices");

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);

            var content = await response.Content.ReadAsStringAsync();

            Assert.IsTrue(content.Contains("Ceiling Light"), "Missing Ceiling Fan");
            Assert.IsTrue(content.Contains("Thermostat"), "Missing Thermostat");
            Assert.IsTrue(content.Contains("Lamp"), "Missing Lamp");

        }

        // Testing sending command to device

        [TestMethod]
        public async Task sendCommandToLight()
        {

            // Act
            var commandContent = new StringContent("\"TurnOn\"", Encoding.UTF8, "application/json");
            var response = await _client!.PutAsync("/api/Room/101/1/command", commandContent);

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);


            // Act
            var getResponse = await _client!.GetAsync("/api/Room/101/1");
            var light = await getResponse.Content.ReadFromJsonAsync<Light>();


            // Assert
            Assert.IsNotNull(light);
            Assert.IsTrue(light!.IsOn, "Light should be on after command.");
          

        }
    }
}
