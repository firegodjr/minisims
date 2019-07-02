using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface IUpdateStreamHandler
    {
        Task<ActionResult<bool>> GetConnectRequestAsync(HttpContext context);
    }
}
