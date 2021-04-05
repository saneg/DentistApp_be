import DynamoDB from 'aws-sdk/clients/dynamodb';
import {DataMapper} from "@aws/dynamodb-data-mapper";
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

class AwsClientsManager {

    private readonly awsConfig:ServiceConfigurationOptions;
    private readonly dynamoDb:DynamoDB;
    private readonly dataMapper:DataMapper;

    constructor() {

        const serviceConfigOptions: ServiceConfigurationOptions = {
            region: "eu-south-1",
            endpoint: "http://localhost:8000",
        };

        this.awsConfig = serviceConfigOptions;

        this.dynamoDb = this.setDynamoDbClient();

        this.dataMapper = this.setDataMapper();

    }

    private setDynamoDbClient(): DynamoDB {
        return new DynamoDB(this.awsConfig);
    }

    private setDataMapper(): DataMapper {
        return new DataMapper({
            client: this.getDynamoClient()
        });
    }

    public getDynamoClient(): DynamoDB {
        return this.dynamoDb;
    }

    public getDataMapper(): DataMapper {
        return this.dataMapper;
    }

}

const awsClientsManager: AwsClientsManager = new AwsClientsManager();
export { awsClientsManager };