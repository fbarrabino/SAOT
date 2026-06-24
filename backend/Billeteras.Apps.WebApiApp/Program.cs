using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Billeteras.Datos;
using Billeteras.Datos.Interfaces;
using Billeteras.DatosEF;
using Billeteras.Negocio;
using Billeteras.Negocio.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Connection string (appsettings.json → IConfiguration, no hardcodeada)
var connStr = builder.Configuration.GetConnectionString("BilleterasDB")
    ?? throw new InvalidOperationException("Falta la connection string 'BilleterasDB' en appsettings.json.");

// DbContext (EF Core / SQL Server)
builder.Services.AddDbContext<BilleterasContext>(opt => opt.UseSqlServer(connStr));

// Repositorios: por DEFECTO EF Core.
//    Para usar ADO.NET, se comenta la línea EF y se descomentá la ADO de al lado.
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepositoryEF>();
// builder.Services.AddScoped<IUsuarioRepository>(_ => new UsuarioRepositoryAdo(connStr));
builder.Services.AddScoped<IBilleteraRepository, BilleteraRepositoryEF>();
// builder.Services.AddScoped<IBilleteraRepository>(_ => new BilleteraRepositoryAdo(connStr));
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepositoryEF>();
// builder.Services.AddScoped<ICategoriaRepository>(_ => new CategoriaRepositoryAdo(connStr));
builder.Services.AddScoped<ICuentaBilleteraRepository, CuentaBilleteraRepositoryEF>();
// builder.Services.AddScoped<ICuentaBilleteraRepository>(_ => new CuentaBilleteraRepositoryAdo(connStr));
builder.Services.AddScoped<IMovimientoRepository, MovimientoRepositoryEF>();
// builder.Services.AddScoped<IMovimientoRepository>(_ => new MovimientoRepositoryAdo(connStr));

// Servicios de Negocio
builder.Services.AddScoped<IUsuarioNegocio, UsuarioNegocio>();
builder.Services.AddScoped<IBilleteraNegocio, BilleteraNegocio>();
builder.Services.AddScoped<ICategoriaNegocio, CategoriaNegocio>();
builder.Services.AddScoped<ICuentaBilleteraNegocio, CuentaBilleteraNegocio>();
builder.Services.AddScoped<IMovimientoNegocio, MovimientoNegocio>();

// Autenticación JWT (Key, Issuer, Audience, ExpiresInMinutes desde appsettings.json)
var jwt = builder.Configuration.GetSection("Jwt");
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = signingKey
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllersWithViews();

// CORS abierto (política "AllowAll")
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// Pipeline
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

// Mapeo de controladores API (attribute routing — [Route], [HttpGet], etc.)
// IMPORTANTE: sin esta línea ningún endpoint /api/* responde.
app.MapControllers();

// Ruta MVC convencional para las vistas Razor existentes (CuentaBilletera/Index, etc.)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=CuentaBilletera}/{action=Index}/{id?}");

app.Run();