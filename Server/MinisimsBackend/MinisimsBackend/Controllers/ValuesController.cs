using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MinisimsServer.DTF;
using MinisimsServer.Objects;

namespace MinisimsBackend.Controllers
{
    [Route("api/values")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { FileMgr.GetFileText("game1.json") };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] GenericDTF dtf)
        {
            switch ((DTFTypes)dtf.type)
            {
                case DTFTypes.GAMESTATE:
                    {
                        if ((PostActions)dtf.action == PostActions.SAVE_FILE)
                        {
                            FileMgr.SaveFileText(dtf.id + ".json", dtf.data);
                        }
                        break;
                    }
            }
            Console.WriteLine("Handled POST");
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
