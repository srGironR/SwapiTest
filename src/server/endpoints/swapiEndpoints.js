

const applySwapiEndpoints = (server, app) => {

    server.get('/hfswapi/test', async (req, res) => {
        const data = await app.swapiFunctions.genericRequest('https://swapi.dev/api/', 'GET', null, true);
        res.send(data);
    });

    server.get('/hfswapi/getPeople/:id', async (req, res) => {        
        
        const stwpersonW = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/people/${req.params.id}`, 'GET', null, true);
        const stwplanet = await app.swapiFunctions.genericRequest(`${stwpersonW.homeworld}`, 'GET', null, true);
        let str = stwpersonW.homeworld.split("/");
        //If dont get any send 400
        if(stwpersonW.length == 0)
         return res.status(400).send({msg:"No se encontró un personaje"});
        //If get any send 200 
       const resFindstperson = {
        name:stwpersonW.name, 
        mass:stwpersonW.mass, 
        height:stwpersonW.height, 
        homeworld_name:stwplanet.name, 
        homeworld_id:str[5]
        };

        res.status(201).send(resFindstperson);
    });

    server.get('/hfswapi/getPlanet/:id', async (req, res) => {
        res.sendStatus(501);
    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
        res.sendStatus(501);
    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;