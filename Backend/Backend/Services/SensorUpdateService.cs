using Backend.Models;
using Backend.Services;
using Microsoft.Extensions.Hosting;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;



public class SensorUpdateService : BackgroundService
{
    private readonly HotelSetup _hotelSetup;

    public SensorUpdateService(HotelSetup hotelSetup)
    {
        _hotelSetup = hotelSetup;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var sensors = _hotelSetup.Hotel.Floors
                .SelectMany(f => f.Rooms)
                .SelectMany(r => r.Devices)
                .OfType<ISensor>();

            foreach (var sensor in sensors)
            {
                sensor.UpdateFromFile(); // call update for every sensor in HotelSetup
            }

            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken); // 20 second refreshes.
        }
        
    }
}

