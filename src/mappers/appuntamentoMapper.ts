import { DataMapper }  from "@aws/dynamodb-data-mapper";
import { DynamoDB } from "aws-sdk";
import { awsClientsManager } from "../AwsClientsManager";
import { Appuntamento } from "../model/appuntamento";
import { StatoAppuntamento } from "../model/statoAppuntamento";
import { Paziente } from "../model/paziente";
import { TipologiaPrestazione } from "../model/tipologiaPrestazione";
import pazienteMapper from "./pazienteMapper";


export class AppuntamentoMapper {

    client: DynamoDB;
    mapper: DataMapper;

    constructor() {
        this.client = awsClientsManager.getDynamoClient();
        this.mapper = awsClientsManager.getDataMapper();
        this.createTableIfNotExists();
    }

    public async createTableIfNotExists() {
        return await this.mapper.ensureTableExists(Appuntamento, {
            readCapacityUnits: 1,
            writeCapacityUnits: 1
        }).catch(e => {
            throw e;
        })
    }

    public async creaAppuntamento(appuntamento: Appuntamento) {

        let appuntamenti: Appuntamento[] = await this.getAppuntamentiInDataOfMedico(appuntamento.dataTimestamp, appuntamento.idSanitario);

        let sovrappostiInizioOra: Appuntamento[] = appuntamenti.filter(app => {
            return +app.oraInizioTimestamp <= +appuntamento.oraInizioTimestamp && +app.oraFineTimestamp >= +appuntamento.oraInizioTimestamp;
        });

        let sovrappostiFineOra: Appuntamento[] = appuntamenti.filter(app => {
            return +app.oraInizioTimestamp <= +appuntamento.oraFineTimestamp && +app.oraFineTimestamp >= +appuntamento.oraFineTimestamp;
        });

        let sovrapposti: Appuntamento[] = appuntamenti.filter(app => {
            return (+appuntamento.oraInizioTimestamp <= +app.oraInizioTimestamp && +appuntamento.oraFineTimestamp >= +app.oraInizioTimestamp) && (+appuntamento.oraInizioTimestamp <= +app.oraFineTimestamp && +appuntamento.oraFineTimestamp >= +app.oraFineTimestamp);
        });


        if (sovrappostiInizioOra.length === 0 && sovrappostiFineOra.length === 0 && sovrapposti.length === 0) {
            return await this.mapper.put(appuntamento).then(r => {
                return r;
            }).catch(e => {
                throw e;
            })
        } else {
            throw Error("Cannot create Appuntamento: the timerange is already occupied");
        }
    }

    public async getAppuntamento(id: string) {
        let appuntamento: Appuntamento = new Appuntamento();
        appuntamento.id = id;
        return await this.mapper.get(appuntamento).then(r => {
            return r;
        }).catch(e => {
            throw e;
        })
    }

    public async deleteAppuntamento(id: string) {
        let appuntamento: Appuntamento = new Appuntamento();
        appuntamento.id = id;

        let fetchedAppuntamento: void|Appuntamento = await this.mapper.get(appuntamento).then(r => {
            return r;
        }).catch(e => {
            throw e;
        });

        if (typeof fetchedAppuntamento === 'object') {
            return await this.mapper.delete(appuntamento).then(r => {
                return r;
            }).catch(e => {
                throw e;
            })
        } else {
            throw new Error('Error while removing aggiornamento object id: '+ appuntamento.id);
        }
    }

    public async updateAppuntamento(newAppuntamento: Appuntamento) {
        let a: Appuntamento = new Appuntamento();
        a.id = newAppuntamento.id;

        let fetchedAppuntamento: void|Appuntamento = await this.mapper.get(a).then(r => {
            return r;
        }).catch(e => {
            throw e;
        });

        if (typeof fetchedAppuntamento === 'object') {

            fetchedAppuntamento.dataTimestamp = newAppuntamento.dataTimestamp
            fetchedAppuntamento.oraInizioTimestamp = newAppuntamento.oraInizioTimestamp;
            fetchedAppuntamento.oraFineTimestamp = newAppuntamento.oraFineTimestamp;
            fetchedAppuntamento.idPaziente = newAppuntamento.idPaziente;
            fetchedAppuntamento.idSanitario = newAppuntamento.idSanitario;
            fetchedAppuntamento.tipologiaPrestazione = newAppuntamento.tipologiaPrestazione;
            fetchedAppuntamento.descrizione = newAppuntamento.descrizione;
            fetchedAppuntamento.stato = newAppuntamento.stato;

            return this.mapper.update(fetchedAppuntamento).then(r => {
                return r;
            }).catch(e => {
                throw e;
            });
        } else {
            throw new Error('Error while updating aggiornamento object id: '+ newAppuntamento.id);
        }
    }


    public async getAppuntamentiPaziente(idPaziente: string) {

        return pazienteMapper.getPaziente(idPaziente)
        .then(async (paziente: Paziente) => {
            const params = {
                TableName: 'appuntamenti',
                FilterExpression: '(idPaziente = :idPaziente) AND (stato = :stato)',
                ExpressionAttributeValues: {
                  ':idPaziente': {S: idPaziente},
                  ':stato': {S: StatoAppuntamento.ATTIVO}
                },
            };
    
            const result = await this.client.scan(params).promise()
            .catch(e => {
                throw e;
            });
    
            let appuntamentiPaziente: Appuntamento[] = [];
    
            for (const item of result.Items) {
                let appuntamento: Appuntamento = {
                    id: item.id.S,
                    dataTimestamp: item.dataTimestamp.S,
                    oraInizioTimestamp: item.oraInizioTimestamp.S,
                    oraFineTimestamp: item.oraFineTimestamp.S,
                    idPaziente: item.idPaziente.S,
                    idSanitario: item.idSanitario.S,
                    tipologiaPrestazione: TipologiaPrestazione[item.tipologiaPrestazione.S],
                    descrizione: item.descrizione.S,
                    stato: StatoAppuntamento[item.stato.S]
                }
                appuntamentiPaziente.push(appuntamento);
            }
            return appuntamentiPaziente;
        });
    }


    public async closeAppuntamento(id: string) {

        let a: Appuntamento = new Appuntamento();
        a.id = id;
        let fetchedAppuntamento: void|Appuntamento = await this.mapper.get(a).then(r => {
            return r;
        }).catch(e => {
            throw e;
        });

        if (typeof fetchedAppuntamento === 'object') {

            fetchedAppuntamento.stato = StatoAppuntamento.ESEGUITO;

            return this.mapper.update(fetchedAppuntamento).then(r => {
                return r;
            }).catch(e => {
                throw e;
            })
        } else {
            throw new Error('Error while updating appuntamento with id: '+ id);
        }
    }


    public async getAppuntamentiInData(timestamp: string) {

        const params = {
            TableName: 'appuntamenti',
            FilterExpression: '(dataTimestamp = :timestamp)',
            ExpressionAttributeValues: {
              ':timestamp': {S: timestamp},
            },
        };

        const result = await this.client.scan(params).promise()
            .catch(e => {
                throw e;
            });
    
            let appuntamentiPaziente: Appuntamento[] = [];
    
            for (const item of result.Items) {
                let appuntamento: Appuntamento = {
                    id: item.id.S,
                    dataTimestamp: item.dataTimestamp.S,
                    oraInizioTimestamp: item.oraInizioTimestamp.S,
                    oraFineTimestamp: item.oraFineTimestamp.S,
                    idPaziente: item.idPaziente.S,
                    idSanitario: item.idSanitario.S,
                    tipologiaPrestazione: TipologiaPrestazione[item.tipologiaPrestazione.S],
                    descrizione: item.descrizione.S,
                    stato: StatoAppuntamento[item.stato.S]
                }
                appuntamentiPaziente.push(appuntamento);
            }
            return appuntamentiPaziente;
    }


    public async getAppuntamentiInDataOfMedico(timestamp: string, idSanitario: string) {

        const params = {
            TableName: 'appuntamenti',
            FilterExpression: '(dataTimestamp = :timestamp) AND (idSanitario = :idSanitario)',
            ExpressionAttributeValues: {
              ':timestamp': {S: timestamp},
              ':idSanitario': {S: idSanitario}
            },
        };

        const result = await this.client.scan(params).promise()
        .catch(e => {
            throw e;
        });

        let appuntamenti: Appuntamento[] = [];

        for (const item of result.Items) {
            let appuntamento: Appuntamento = {
                id: item.id.S,
                dataTimestamp: item.dataTimestamp.S,
                oraInizioTimestamp: item.oraInizioTimestamp.S,
                oraFineTimestamp: item.oraFineTimestamp.S,
                idPaziente: item.idPaziente.S,
                idSanitario: item.idSanitario.S,
                tipologiaPrestazione: TipologiaPrestazione[item.tipologiaPrestazione.S],
                descrizione: item.descrizione.S,
                stato: StatoAppuntamento[item.stato.S]
            }
            appuntamenti.push(appuntamento);
        }
        return appuntamenti;
    }
 
}

const appuntamentoMapper: AppuntamentoMapper = new AppuntamentoMapper();

export default appuntamentoMapper;