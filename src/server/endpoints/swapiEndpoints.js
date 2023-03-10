

const applySwapiEndpoints = (server, app) => {

    server.get('/hfswapi/test', async (req, res) => {
        const data = await app.swapiFunctions.genericRequest('https://swapi.dev/api/', 'GET', null, true);
        res.send(data);
    });

    server.get('/hfswapi/getPeople/:id', async (req, res) => {        
        //const p = await app.db.swPeople.findAll();
        const stwpersonW = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/people/${req.params.id}`, 'GET', null, true);
        const stwplanet = await app.swapiFunctions.genericRequest(`${stwpersonW.homeworld}`, 'GET', null, true);
        let str = stwpersonW.homeworld.split("/");
        //If dont get any send 400
        if(stwpersonW.length == 0)
         return res.status(400).send({msg:"No se encontrĂ³ un personaje"});
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
        const stwplanetW = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/planets/${req.params.id}`, 'GET', null, true);

        const resPlanet ={
            name:stwplanetW.name,
            gravity:stwplanetW.gravity
        }

        res.status(201).send(resPlanet);
    });

    server.get('/hfswapi/getWeightOnPlanetRandom', async (req, res) => {
        let randomPe = Math.floor(Math.random()*82)+1;
        let randomPa = Math.floor(Math.random()*60)+1;
        console.log(randomPe+" "+randomPa)

        try {
            const stwperson = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/people/${randomPe}`, 'GET', null, true);
            const stwplanet = await app.swapiFunctions.genericRequest(`https://swapi.dev/api/planets/${randomPa}`, 'GET', null, true);

            const weight = await app.swapiFunctions.getWeightOnPlanet(stwperson.mass,stwplanet.gravity);
            let str = stwperson.homeworld.split("/");

            if(str[5] == randomPa.toString()){
                return res.status(403).send({msg:"No se puede calcular el peso de un personaje en su planeta natal"})
            }
            
            res.status(200).send({msg:"El personaje "+stwperson.name+" pesa "+weight+" en el planeta "+stwplanet.name});
                
        } catch (error) {
            res.status(400).send({ msj: "error", error });
        }
        
    });

    server.get('/hfswapi/getLogs',async (req, res) => {
        const data = await app.db.logging.findAll();
        res.send(data);
    });

}

module.exports = applySwapiEndpoints;