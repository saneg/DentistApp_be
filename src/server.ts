import { App } from './app';
import { PazienteController } from './controllers/pazienteController';
import { AppuntamentoController } from './controllers/appuntamentoController';
import { SanitarioController } from './controllers/sanitarioController';
import { LogInController } from './controllers/logInController';
 
const app = new App(
  [
    new LogInController(),
    new PazienteController(),
    new SanitarioController(),
    new AppuntamentoController(),
  ],
  5000,
);
 
app.listen();