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

//  Connection string (appsettings.json → IConfiguration) 
var connStr = builder.Configuration.GetConnectionString("BilleterasDB")
    ?? throw new InvalidOperationException("Falta la connection string 'BilleterasDB' en appsettings.json.");

//  DbContext (EF Core / SQL Server) 
builder.Services.AddDbContext<BilleterasContext>(opt => opt.UseSqlServer(connStr));


builder.Services.AddScoped<IUsuarioRepository>(_ => new UsuarioRepositoryAdo(connStr));

builder.Services.AddScoped<IBilleteraRepository>(_ => new BilleteraRepositoryAdo(connStr));

builder.Services.AddScoped<ICategoriaRepository>(_ => new CategoriaRepositoryAdo(connStr));

builder.Services.AddScoped<ICuentaBilleteraRepository>(_ => new CuentaBilleteraRepositoryAdo(connStr));

builder.Services.AddScoped<IMovimientoRepository>(_ => new MovimientoRepositoryAdo(connStr));

//  Servicios de Negocio 
builder.Services.AddScoped<IUsuarioNegocio, UsuarioNegocio>();
builder.Services.AddScoped<IBilleteraNegocio, BilleteraNegocio>();
builder.Services.AddScoped<ICategoriaNegocio, CategoriaNegocio>();
builder.Services.AddScoped<ICuentaBilleteraNegocio, CuentaBilleteraNegocio>();
builder.Services.AddScoped<IMovimientoNegocio, MovimientoNegocio>();

//  Autenticación JWT (Key, Issuer, Audience, ExpiresInMinutes desde appsettings.json) 
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
builder.Services.AddControllers();

//  CORS abierto (política "AllowAll") 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

//  Pipeline 
app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();