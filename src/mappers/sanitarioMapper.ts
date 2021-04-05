import { DataMapper }  from "@aws/dynamodb-data-mapper";
import { DynamoDB } from "aws-sdk";
import { awsClientsManager } from "../AwsClientsManager";
import { Sanitario } from "../model/sanitario";
import { RuoloSanitario } from "../model/ruoloSanitario";

export class SanitarioMapper {

    client: DynamoDB;
    mapper: DataMapper;

    constructor() {
        this.client = awsClientsManager.getDynamoClient();
        this.mapper = awsClientsManager.getDataMapper();
        this.createTableIfNotExists();
    }

    public async createTableIfNotExists() {
        return await this.mapper.ensureTableExists(Sanitario, {
            readCapacityUnits: 1,
            writeCapacityUnits: 1
        }).catch(e => {
            throw e;
        })
    }

    public async creaSanitario(sanitario: Sanitario) {
        return await this.mapper.put(sanitario).then(r => {
            return r;
        }).catch(e => {
            throw e;
        })
    }

    public async getSanitario(id: string) {
        let sanitario: Sanitario = new Sanitario();
        sanitario.id = id;
        return await this.mapper.get(sanitario).then(r => {
            return r;
        }).catch(e => {
            throw e;
        })
    }

    public async deleteSanitario(id: string) {
        let sanitario: Sanitario = new Sanitario();
        sanitario.id = id;

        let fetchedSanitario: void|Sanitario = await this.mapper.get(sanitario).then(r => {
            return r;
        }).catch(e => {
            throw e;
        });

        if (typeof fetchedSanitario === 'object') {
            return await this.mapper.delete(sanitario).then(r => {
                return r;
            }).catch(e => {
                throw e;
            })
        } else {
            throw new Error('Error while removing sanitario with id - '+ sanitario.id);
        }
    }

    public async updateSanitario(newSanitario: Sanitario) {
        let s: Sanitario = new Sanitario();
        s.id = newSanitario.id;
        let fetchedSanitario: void|Sanitario = await this.mapper.get(s).then(r => {
            return r;
        }).catch(e => {
            throw e;
        });

        if (typeof fetchedSanitario === 'object') {

            fetchedSanitario.nome = newSanitario.nome;
            fetchedSanitario.cognome = newSanitario.cognome;
            fetchedSanitario.ruolo = newSanitario.ruolo;
            fetchedSanitario.email = newSanitario.email;
            fetchedSanitario.password = newSanitario.password;

            return this.mapper.update(fetchedSanitario).then(r => {
                return r;
            }).catch(e => {
                throw e;
            })
        } else {
            throw new Error('Error while updating sanitario with id - '+ newSanitario.id);
        }
    }


    public async checkUsernameAndPassword(username: string, password: string) {

        const params = {
            TableName: 'sanitari',
            FilterExpression: '(email = :username) AND (password = :password)',
            ExpressionAttributeValues: {
              ':username': {S: username},
              ':password': {S: password},
            },
        };
          
        const result = await this.client.scan(params).promise()
        .catch(e => {
            throw e;
        });;

        if (result.Items.length == 0) {
            throw new Error("Username & password are not correct");
        } else {
            let sanitario: Sanitario = {
                id: result.Items[0].id.S,
                nome: result.Items[0].nome.S,
                cognome: result.Items[0].cognome.S,
                ruolo: RuoloSanitario[result.Items[0].ruolo.S],
                email: result.Items[0].email.S,
                password: result.Items[0].password.S,
            }
            return sanitario;
        }
    }



    public async getAllMedici() {
        const params = {
            TableName: 'sanitari',
            FilterExpression: '(ruolo = :dentista) OR (ruolo = :iista)',
            ExpressionAttributeValues: {
              ':dentista': {S: RuoloSanitario.DENTISTA},
              ':igienista': {S: RuoloSanitario.IGIENISTA},
            }
        };
          
        const result = await this.client.scan(params).promise()
        .catch(e => {
            throw e;
        });;

        let medici: Sanitario[] = [];

        for (const item of result.Items) {
            let medico: Sanitario = {
                id: item.id.S,
                nome: item.nome.S,
                cognome: item.cognome.S,
                ruolo: RuoloSanitario[item.ruolo.S],
                email: item.email.S,
                password: item.password.S
            }
            medici.push(medico);
        }
        return medici;
    }

}

const sanitarioMapper: SanitarioMapper = new SanitarioMapper();

export default sanitarioMapper;