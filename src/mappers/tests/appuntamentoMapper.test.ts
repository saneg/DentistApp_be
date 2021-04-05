import { AppuntamentoMapper } from "../appuntamentoMapper";
import { Appuntamento } from "../../model/appuntamento";
import { TipologiaPrestazione } from "../../model/tipologiaPrestazione";
import { StatoAppuntamento } from "../../model/statoAppuntamento";


describe('new Appuntamento test', () => {
    const appuntamentoMapper: AppuntamentoMapper = new AppuntamentoMapper();

    let mockAppuntamenti: Appuntamento[] = [
      {
        id: '1',
        dataTimestamp: "1617408000", // 3-04-2021 00:00:00
        oraInizioTimestamp: "1617458400", // 3-04-2021 14:00:00
        oraFineTimestamp: "1617463800", // 3-04-2021 15:30:00
        idPaziente: '11',
        idSanitario: '21',
        tipologiaPrestazione: TipologiaPrestazione.VISITA,
        descrizione: "Visita specialistica",
        stato: StatoAppuntamento.ATTIVO
      },
      {
        id: '2',
        dataTimestamp: "1617408000", // 3-04-2021 00:00:00
        oraInizioTimestamp: "1617472800", // 3-04-2021 18:00:00
        oraFineTimestamp: "1617478200", // 3-04-2021 19:30:00
        idPaziente: '13',
        idSanitario: '21',
        tipologiaPrestazione: TipologiaPrestazione.VISITA,
        descrizione: "Visita specialistica",
        stato: StatoAppuntamento.ATTIVO
      }
    ];


    it('should create a new Appuntamento', () => {

      let newAppuntamento: Appuntamento = {
        id: '3',
        dataTimestamp: "1617408000", // 3-04-2021 00:00:00
        oraInizioTimestamp: "1617465600", // 3-04-2021 16:00:00
        oraFineTimestamp: "1617471000", // 3-04-2021 17:30:00
        idPaziente: '14',
        idSanitario: '21',
        tipologiaPrestazione: TipologiaPrestazione.VISITA,
        descrizione: "Visita specialistica",
        stato: StatoAppuntamento.ATTIVO
      };

      const spy = jest.spyOn(appuntamentoMapper, 'getAppuntamentiInDataOfMedico');
      spy.mockReturnValue(Promise.resolve(mockAppuntamenti));

      appuntamentoMapper.creaAppuntamento(newAppuntamento)
      .then((result: Appuntamento) => {
        expect(result).toBe(newAppuntamento);
      });
    });


    it('should not create a new Appuntamento due to begin hour overlap', () => {

      let newAppuntamento: Appuntamento = {
        id: '3',
        dataTimestamp: "1617408000", // 3-04-2021 00:00:00
        oraInizioTimestamp: "1617462000", // 3-04-2021 15:00:00
        oraFineTimestamp: "1617467400", // 3-04-2021 16:30:00
        idPaziente: '14',
        idSanitario: '21',
        tipologiaPrestazione: TipologiaPrestazione.VISITA,
        descrizione: "Visita specialistica",
        stato: StatoAppuntamento.ATTIVO
      };

      const spy = jest.spyOn(appuntamentoMapper, 'getAppuntamentiInDataOfMedico');
      spy.mockReturnValue(Promise.resolve(mockAppuntamenti));

      appuntamentoMapper.creaAppuntamento(newAppuntamento)
      .catch(e => {
        expect(e).toBe(typeof Error);
      });
    });

    it('should not create a new Appuntamento due to end hour overlap', () => {

      let newAppuntamento: Appuntamento = {
        id: '3',
        dataTimestamp: "1617408000", // 3-04-2021 00:00:00
        oraInizioTimestamp: "1617467400", // 3-04-2021 16:30:00
        oraFineTimestamp: "1617472800", // 3-04-2021 18:00:00
        idPaziente: '14',
        idSanitario: '21',
        tipologiaPrestazione: TipologiaPrestazione.VISITA,
        descrizione: "Visita specialistica",
        stato: StatoAppuntamento.ATTIVO
      };

      const spy = jest.spyOn(appuntamentoMapper, 'getAppuntamentiInDataOfMedico');
      spy.mockReturnValue(Promise.resolve(mockAppuntamenti));

      appuntamentoMapper.creaAppuntamento(newAppuntamento)
      .catch(e => {
        expect(e).toBe(typeof Error);
      });
    });

    it('should not create a new Appuntamento due to another appuntamento between begin & end hours', () => {

      let newAppuntamentoPulizia: Appuntamento = {
        id: '3',
        dataTimestamp: "1617408000", // 3-04-2021 00:00:00
        oraInizioTimestamp: "1617465600", // 3-04-2021 16:00:00
        oraFineTimestamp: "1617469200", // 3-04-2021 17:00:00
        idPaziente: '14',
        idSanitario: '21',
        tipologiaPrestazione: TipologiaPrestazione.PULIZIA,
        descrizione: "Sostituzione Pulizia",
        stato: StatoAppuntamento.ATTIVO
      };
      mockAppuntamenti.push(newAppuntamentoPulizia);


      let newAppuntamento: Appuntamento = {
        id: '4',
        dataTimestamp: "1617408000", // 3-04-2021 00:00:00
        oraInizioTimestamp: "1617465600", // 3-04-2021 16:00:00
        oraFineTimestamp: "1617471000", // 3-04-2021 17:30:00
        idPaziente: '15',
        idSanitario: '21',
        tipologiaPrestazione: TipologiaPrestazione.VISITA,
        descrizione: "Visita Specialistica",
        stato: StatoAppuntamento.ATTIVO
      };


      const spy = jest.spyOn(appuntamentoMapper, 'getAppuntamentiInDataOfMedico');
      spy.mockReturnValue(Promise.resolve(mockAppuntamenti));

      appuntamentoMapper.creaAppuntamento(newAppuntamento)
      .catch(e => {
        expect(e).toBe(typeof Error);
      });
    });
});