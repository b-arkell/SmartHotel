using Backend.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        // Preserve the concrete type of each object in JSON
        options.SerializerSettings.TypeNameHandling = Newtonsoft.Json.TypeNameHandling.Auto;

        // Optional: make JSON more readable
        options.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;

        // Optional: ignore nulls if desired
        // options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
    });


// Add singleton service for hotel setup
builder.Services.AddSingleton<Backend.Services.HotelSetup>(); // This will initialize the hotel structure at startup
builder.Services.AddHostedService<SensorUpdateService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.UseAllOfToExtendReferenceSchemas();
    c.SelectSubTypesUsing(baseType =>
    {
        if (baseType == typeof(IDevice))
            return new[] { typeof(Light), typeof(Thermostat) }; // add your other device types here
        return Enumerable.Empty<Type>();
    });
});


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin() // Adjust the origin as needed
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Images")),
    RequestPath = "/Images"
});


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

// Required for integration tests
public partial class Program { }