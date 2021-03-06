import { table, autoGeneratedHashKey, attribute, hashKey } from '@aws/dynamodb-data-mapper-annotations';
import { StatoAppuntamento } from './statoAppuntamento';
import { TipologiaPrestazione } from './tipologiaPrestazione';
   
@table('appuntamenti')
export class Appuntamento {
    
    @autoGeneratedHashKey()
    @hashKey({
        indexKeyConfigurations:{
            ItemIdIndex: 'HASH'
        }
    })
    id: string;

    @attribute()
    dataTimestamp: string;

    @attribute()
    oraInizioTimestamp: string;

    @attribute()
    oraFineTimestamp: string;

    @attribute()
    idPaziente: string;

    @attribute()
    idSanitario: string;

    @attribute()
    tipologiaPrestazione: TipologiaPrestazione;

    @attribute()
    descrizione: string;

    @attribute()
    stato: StatoAppuntamento;
};