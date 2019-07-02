using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MinisimsBackend.DI.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace MinisimsBackend.Controllers
{
    public class UpdateStreamHandler : IUpdateStreamHandler
    {
        private IServerState _serverState;
        public UpdateStreamHandler(IServerState serverState)
        {
            this._serverState = serverState;
        }

        public async Task<ActionResult<bool>> GetConnectRequestAsync(HttpContext context)
        {
            bool isSocketRequest = context.WebSockets.IsWebSocketRequest;

            if (isSocketRequest)
            {
                WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                await GetMessages(context, webSocket);
            }
            else
            {
                context.Response.StatusCode = 400;
            }

            return false;
        }

        private async Task GetMessages(HttpContext context, WebSocket websocket)
        {

        }
    }
}
