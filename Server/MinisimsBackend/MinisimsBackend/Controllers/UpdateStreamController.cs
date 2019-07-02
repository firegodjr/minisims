using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MinisimsBackend.DI.Abstractions;

namespace MinisimsBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UpdateStreamController : ControllerBase
    {
        private IUpdateStreamHandler _handler;
        public UpdateStreamController(IUpdateStreamHandler _handler)
        {
            this._handler = _handler;
        }

        [HttpGet]
        public async Task<ActionResult<bool>> GetConnectRequestAsync()
        {
            var context = ControllerContext.HttpContext;
            return await _handler.GetConnectRequestAsync(context); ;
        }

        private async Task GetMessages(HttpContext context, WebSocket websocket)
        {

        }
    }
}