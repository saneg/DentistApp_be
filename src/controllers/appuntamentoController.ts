import express from 'express';
import { Appuntamento } from '../model/appuntamento';
import { TipologiaPrestazione } from '../model/tipologiaPrestazione';
import appuntamentoMapper from '../mappers/appuntamentoMapper';
 
export class AppuntamentoController {
  public router = express.Router();
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.post('/new/appuntamento', this.nuovoAppuntamento);
    this.router.get('/get/appuntamenti/:idPaziente', this.getAppuntamentiPaziente);
    this.router.get('/get/appuntamento/:id', this.getAppuntamento);
    this.router.get('/get/all/appuntamenti/:timestamp', this.getAppuntamentiInData)
    this.router.post('/update/appuntamento/:id', this.updateAppuntamento);
    this.router.post('/delete/appuntamento/:id', this.deleteAppuntamento);
    this.router.post('/close/appuntamento/:id', this.terminaAppuntamento);
  }


  nuovoAppuntamento = (request: express.Request, response: express.Response) => {

    const newAppuntamento = new Appuntamento();
    newAppuntamento.dataTimestamp = request.body.dataTimestamp.toString();
    newAppuntamento.oraInizioTimestamp = request.body.oraInizioTimestamp.toString();
    newAppuntamento.idPaziente = request.body.idPaziente.toString();
    newAppuntamento.idSanitario = request.body.idSanitario.toString();
    newAppuntamento.tipologiaPrestazione = request.body.tipologiaPrestazione.toString();
    newAppuntamento.descrizione = request.body.descrizione.toString();
    newAppuntamento.stato = request.body.stato.toString();

    let oraFine: Date = new Date(+newAppuntamento.oraInizioTimestamp);
    switch(newAppuntamento.tipologiaPrestazione) {
      case TipologiaPrestazione.VISITA:

        oraFine.setHours(oraFine.getHours() + 1);
        oraFine.setMinutes(oraFine.getMinutes() + 30);
        newAppuntamento.oraFineTimestamp = oraFine.getTime().toString();
        break;

      case TipologiaPrestazione.PULIZIA:

        oraFine.setHours(oraFine.getHours() + 1);
        newAppuntamento.oraFineTimestamp = oraFine.getTime().toString();
        break;

      case TipologiaPrestazione.OTTURAZIONE:

        oraFine.setHours(oraFine.getHours() + 2);
        newAppuntamento.oraFineTimestamp = oraFine.getTime().toString();
        break;
    }

    appuntamentoMapper.creaAppuntamento(newAppuntamento)
    .then((a: Appuntamento) => {
      response.status(200).send(JSON.stringify(a));
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }



  getAppuntamentiPaziente = (request: express.Request, response: express.Response) => {
    let idPaziente: string = request.params.idPaziente.toString();
    appuntamentoMapper.getAppuntamentiPaziente(idPaziente)
    .then((appuntamenti: Appuntamento[]) => {
      response.status(200).send(JSON.stringify(appuntamenti));
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }

  getAppuntamento = (request: express.Request, response: express.Response) => {
    let id: string = request.params.id.toString();
    appuntamentoMapper.getAppuntamento(id)
    .then((appuntamento: Appuntamento) => {
      response.status(200).send(JSON.stringify(appuntamento));
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }


  getAppuntamentiInData = (request: express.Request, response: express.Response) => {
    let timestamp: string = request.params.timestamp.toString();
    appuntamentoMapper.getAppuntamentiInData(timestamp)
    .then((appuntamenti: Appuntamento[]) => {
      response.status(200).send(JSON.stringify(appuntamenti));
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }

  updateAppuntamento = (request: express.Request, response: express.Response) => {

    let appuntamento: Appuntamento = {
      id: request.params.id.toString(),
      dataTimestamp: request.body.dataTimestamp.toString(),
      oraInizioTimestamp: request.body.oraInizioTimestamp.toString(),
      oraFineTimestamp: request.body.oraFineTimestamp.toString(),
      idPaziente: request.body.idPaziente.toString(),
      idSanitario: request.body.idSanitario.toString(),
      tipologiaPrestazione: request.body.tipologiaPrestazione.toString(),
      descrizione: request.body.descrizione.toString(),
      stato: request.body.stato.toString()
    }

    appuntamentoMapper.updateAppuntamento(appuntamento)
    .then(r => {
      response.sendStatus(200);
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }

  deleteAppuntamento = (request: express.Request, response: express.Response) => {
    let id: string = request.params.id.toString();
    appuntamentoMapper.deleteAppuntamento(id)
    .then(r => {
      response.sendStatus(200);
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }

  terminaAppuntamento = (request: express.Request, response: express.Response) => {
    let id: string = request.params.id.toString();
    appuntamentoMapper.closeAppuntamento(id)
    .then(r => {
      response.sendStatus(200);
    }).catch(e => {
      response.status(500).send({
        message: e.message
      });
    });
  }
    
}