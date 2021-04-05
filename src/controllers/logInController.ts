import express from 'express';
import { Paziente } from '../model/paziente';
import { Sanitario } from '../model/sanitario';
import pazienteMapper from '../mappers/pazienteMapper';
import sanitarioMapper from '../mappers/sanitarioMapper';

export class LogInController {
    public router = express.Router();
   
    constructor() {
      this.intializeRoutes();
    }
   
    public intializeRoutes() {
      this.router.get("/login/paziente", this.logInPaziente);
      this.router.get("/login/sanitario", this.logInSanitario);
    }
   
    logInPaziente = (request: express.Request, response: express.Response) => {
      pazienteMapper.checkUsernameAndPassword(request.body.username, request.body.password)
      .then((p: Paziente) => {
        response.status(200).send(JSON.stringify(p));
      }).catch(e => {
        response.status(500).send({
          message: e.message
        });
      });
    }

    logInSanitario = (request: express.Request, response: express.Response) => {
      sanitarioMapper.checkUsernameAndPassword(request.body.username, request.body.password)
      .then((s: Sanitario) => {
        response.status(200).send(JSON.stringify(s));
      }).catch(e => {
        response.status(500).send({
          message: e.message
        });
      });
    }
  }