import express from 'express';
import { Paziente } from '../model/paziente';
import pazienteMapper from '../mappers/pazienteMapper';
 
export class PazienteController {
  public router = express.Router();
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.post('/new/paziente', this.nuovoPaziente);
    this.router.get('/get/paziente/:id', this.getPaziente);
    this.router.get('/get/all/pazienti', this.getAllPazienti);
    this.router.post('/update/paziente/:id', this.updatePaziente);
    this.router.post('/delete/paziente/:id', this.deletePaziente);
  }

   
  nuovoPaziente = (request: express.Request, response: express.Response) => {

    const newPaziente = new Paziente();
    newPaziente.nome = request.body.nome.toString();
    newPaziente.cognome = request.body.cognome.toString();
    newPaziente.email = request.body.email.toString();
    newPaziente.password = request.body.password.toString();
    
    pazienteMapper.creaPaziente(newPaziente)
    .then((p: Paziente) => {
      response.sendStatus(200);
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }

  getPaziente = (request: express.Request, response: express.Response) => {
    let id: string = request.params.id.toString();
    pazienteMapper.getPaziente(id)
    .then((paziente: Paziente) => {
      response.status(200).send(JSON.stringify(paziente));
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }

  getAllPazienti = (request: express.Request, response: express.Response) => {
    pazienteMapper.getAllPazienti()
    .then((pazienti: Paziente[]) => {
      response.status(200).send(JSON.stringify(pazienti));
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }

  updatePaziente = (request: express.Request, response: express.Response) => {

    let paziente: Paziente = {
      id: request.params.id.toString(),
      nome: request.body.nome.toString(),
      cognome: request.body.cognome.toString(),
      email: request.body.email.toString(),
      password: request.body.password.toString()
    }

    pazienteMapper.updatePaziente(paziente)
    .then(r => {
      response.sendStatus(200);
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }


  deletePaziente = (request: express.Request, response: express.Response) => {
    let id: string = request.params.id.toString();
    pazienteMapper.deletePaziente(id)
    .then(r => {
      response.sendStatus(200);
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }
}