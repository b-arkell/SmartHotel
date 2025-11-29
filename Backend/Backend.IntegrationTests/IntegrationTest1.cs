using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Text;
using Backend;
using Backend.Models;

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
            _factory = new WebApplicationFactory<Program>();
            _client = _factory.CreateClient();
        }


        [TestMethod]
        public async Task GetDeviceByID_ReturnThermostat()
        {

            // Act
            var response = await _client!.GetAsync("/api/[controller]/101/2");

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);

            var content = await response.Content.ReadAsStringAsync();

            Assert.IsTrue(content.Contains("Thermostat"));

        }
    }
}
