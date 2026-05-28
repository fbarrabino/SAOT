using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Billeteras.Apps.WebApiApp.Controllers;

/// Sirven para verificar end-to-end que el JWT funciona.
[ApiController]
[Route("api/time")]
public class TimeController : ControllerBase
{
    /// GET /api/time — público.
    [HttpGet]
    public ActionResult Get()
        => Ok(new { time = DateTime.Now, secured = false });

    /// GET /api/time/secure — requiere token JWT válido.
    [HttpGet("secure")]
    [Authorize]
    public ActionResult GetSecure()
        => Ok(new { time = DateTime.Now, secured = true, user = User.Identity?.Name });
}