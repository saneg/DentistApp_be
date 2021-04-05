import { DataMapper }  from "@aws/dynamodb-data-mapper";
import { DynamoDB } from "aws-sdk";
import { awsClientsManager } from "../AwsClientsManager";
import { Paziente } from "../model/paziente";


export class PazienteMapper {

    client: DynamoDB;
    mapper: DataMapper;

    constructor() {
        this.client = awsClientsManager.getDynamoClient();
        this.mapper = awsClientsManager.getDataMapper();
        this.createTableIfNotExists();
    }

    public async createTableIfNotExists() {
        return await this.mapper.ensureTableExists(Paziente, {
            readCapacityUnits: 1,
            writeCapacityUnits: 1
        }).catch(e => {
            throw e;
        })
    }

    public async creaPaziente(paziente: Paziente) {
        return await this.mapper.put(paziente).then(r => {
            return r;
        }).catch(e => {
            throw e;
        })
    }

    public async getPaziente(id: string) {
        let paziente: Paziente = new Paziente();
        paziente.id = id;
        return await this.mapper.get(paziente).then(r => {
            return r;
        }).catch(e => {
            throw e;
        })
    }

    public async deletePaziente(id: string) {
        let paziente: Paziente = new Paziente();
        paziente.id = id;

        let fetchedPaziente: void|Paziente = await this.mapper.get(paziente).then(r => {
            return r;
        }).catch(e => {
            throw e;
        });

        if (typeof fetchedPaziente === 'object') {
            return await this.mapper.delete(paziente).then(r => {
                return r;
            }).catch(e => {
                throw e;
            })
        } else {
            throw new Error('Error while removing paziente with id - '+ paziente.id);
        }
    }

    public async updatePaziente(newPaziente: Paziente) {

        let p: Paziente = new Paziente();
        p.id = newPaziente.id;
        let fetchedPaziente: void|Paziente = await this.mapper.get(p).then(r => {
            return r;
        }).catch(e => {
            throw e;
        });

        if (typeof fetchedPaziente === 'object') {

            fetchedPaziente.nome = newPaziente.nome;
            fetchedPaziente.cognome = newPaziente.cognome;
            fetchedPaziente.email = newPaziente.email;
            fetchedPaziente.password = newPaziente.password;

            return this.mapper.update(fetchedPaziente).then(r => {
                return r;
            }).catch(e => {
                throw e;
            })
        } else {
            throw new Error('Error while updating paziente with id - '+ newPaziente.id);
        }
    }


    public async checkUsernameAndPassword(username: string, password: string) {
        
        const params = {
            TableName: 'pazienti',
            FilterExpression: '(email = :username) AND (password = :password)',
            ExpressionAttributeValues: {
              ':username': {S: username},
              ':password': {S: password},
            },
        };

        const result = await this.client.scan(params).promise()
        .catch(e => {
            throw e
        });;

        if (result.Items.length == 0) {
            throw new Error("Username & password are not correct");
        } else {
            let paziente: Paziente = {
                id: result.Items[0].id.S,
                nome: result.Items[0].nome.S,
                cognome: result.Items[0].cognome.S,
                email: result.Items[0].email.S,
                password: result.Items[0].password.S,
            }
            return paziente;
        }
    }


    public async getAllPazienti() {

        const params = {
            TableName: 'pazienti',
        };
          
        const result = await this.client.scan(params).promise()
        .catch(e => {
            throw e;
        });;

        let pazienti: Paziente[] = [];

        for (const item of result.Items) {
            let paziente: Paziente = {
                id: item.id.S,
                nome: item.nome.S,
                cognome: item.cognome.S,
                email: item.email.S,
                password: item.password.S
            }
            pazienti.push(paziente);
        }
        return pazienti;
    }

}

const pazienteMapper: PazienteMapper = new PazienteMapper();

export default pazienteMapper;