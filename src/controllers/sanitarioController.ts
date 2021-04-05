import express from 'express';
import { Sanitario } from '../model/sanitario';
import sanitarioMapper from '../mappers/sanitarioMapper';
 
export class SanitarioController {
  public router = express.Router();
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.post('/new/sanitario', this.nuovoSanitario);
    this.router.get('/get/sanitario/:id', this.getSanitario);
    this.router.get('/get/all/medici', this.getAllMedici);
    this.router.post('/update/sanitario/:id', this.updateSanitario);
    this.router.post('/delete/sanitario/:id', this.deleteSanitario);
  }

  nuovoSanitario = (request: express.Request, response: express.Response) => {

    const newSanitario = new Sanitario();
    newSanitario.nome = request.body.nome.toString();
    newSanitario.cognome = request.body.cognome.toString();
    newSanitario.ruolo = request.body.ruolo.toString();
    newSanitario.email = request.body.email.toString();
    newSanitario.password = request.body.password.toString();

    sanitarioMapper.creaSanitario(newSanitario)
    .then((s: Sanitario) => {
      response.sendStatus(200);
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }

  getSanitario = (request: express.Request, response: express.Response) => {
    let id: string = request.params.id.toString();
    sanitarioMapper.getSanitario(id)
    .then((sanitario: Sanitario) => {
      response.status(200).send(JSON.stringify(sanitario));
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }

  getAllMedici = (request: express.Request, response: express.Response) => {
    sanitarioMapper.getAllMedici()
    .then((sanitari: Sanitario[]) => {
      response.status(200).send(JSON.stringify(sanitari));
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }

  updateSanitario = (request: express.Request, response: express.Response) => {

    let sanitario: Sanitario = {
      id: request.params.id.toString(),
      nome: request.body.nome.toString(),
      cognome: request.body.cognome.toString(),
      ruolo: request.body.ruolo.toString(),
      email: request.body.email.toString(),
      password: request.body.password.toString()
    }

    sanitarioMapper.updateSanitario(sanitario)
    .then(r => {
      response.sendStatus(200);
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }


  deleteSanitario = (request: express.Request, response: express.Response) => {
    let id: string = request.params.id.toString();
    sanitarioMapper.deleteSanitario(id)
    .then(r => {
      response.sendStatus(200);
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }
}