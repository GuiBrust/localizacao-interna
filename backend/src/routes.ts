import { Router } from 'express';
import multer from 'multer';

import { CreateUserController } from './controllers/user/CreateUserController';
import { DeleteUserController } from './controllers/user/DeleteUserController';
import { UpdateUserController } from './controllers/user/UpdateUserController';
import { ListUsersController } from './controllers/user/ListUsersController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';

import { isAuthenticated } from './middlewares/IsAuthenticated';
import uploadConfig from './config/multer';

import {
  GetBlocosController,
  GetBlocoByIdController,
  UpdateBlocoController,
  DeleteBlocoController,
  CreateBlocoController
} from './controllers/bloco/BlocoController';

import {
  GetAndaresController,
  GetAndarToBlocoController,
  UpdateAndarController,
  DeleteAndarController,
  CreateAndarController
} from './controllers/andar/AndarController';

import {
  GetPlantasBaixasController,
  GetBlocoPlantasBaixasController,
  GetPlantaBaixaByIdController,
  UpdatePlantaBaixaController,
  DeletePlantaBaixaController,
  CreatePlantaBaixaController
} from './controllers/planta_baixa/PlantaBaixaController';

import {
  GetSalasPorPlantaBaixaController,
  GetSalasController,
  CreateSalaController,
  UpdateSalaController,
  DeleteSalaController,
  DeleteSalasPorPlantaBaixaController
} from './controllers/sala/SalaController';

const router = Router();
const upload = multer(uploadConfig.upload('./tmp'));

// ROTAS DE USUÁRIO
router.post('/users', isAuthenticated, new CreateUserController().handle);
router.delete('/users', isAuthenticated, new DeleteUserController().handle);
router.put('/users', isAuthenticated, new UpdateUserController().handle);
router.get('/users', isAuthenticated, new ListUsersController().handle);
router.get('/me', isAuthenticated, new DetailUserController().handle);

router.post('/session', new AuthUserController().handle);

// ROTAS DE BLOCO
router.post('/blocos', isAuthenticated, new CreateBlocoController().handle);
router.get('/blocos', new GetBlocosController().handle);
router.get('/blocos/:id', new GetBlocoByIdController().handle);
router.put('/blocos/:id', isAuthenticated, new UpdateBlocoController().handle);
router.delete('/blocos/:id', isAuthenticated, new DeleteBlocoController().handle);

// ROTAS DE ANDAR
router.post('/andares', isAuthenticated, new CreateAndarController().handle);
router.get('/andares', new GetAndaresController().handle);
router.get('/andares/:bloco_id', new GetAndarToBlocoController().handle);
router.put('/andares/:id', isAuthenticated, new UpdateAndarController().handle);
router.delete('/andares/:id', isAuthenticated, new DeleteAndarController().handle);

// ROTAS DE PLANTA BAIXA
router.post('/plantas_baixas', isAuthenticated, upload.single('file'), new CreatePlantaBaixaController().handle);
router.get('/plantas_baixas', new GetPlantasBaixasController().handle);
router.get('/plantas_baixas_bloco', new GetBlocoPlantasBaixasController().handle);
router.get('/plantas_baixas/:id', new GetPlantaBaixaByIdController().handle);
router.put('/plantas_baixas/:id', upload.single('file'), isAuthenticated, new UpdatePlantaBaixaController().handle);
router.delete('/plantas_baixas/:id', isAuthenticated, new DeletePlantaBaixaController().handle);

// ROTAS DE SALA
router.post('/salas', isAuthenticated, new CreateSalaController().handle);
router.get('/salas', new GetSalasPorPlantaBaixaController().handle);
router.put('/salas/:id', isAuthenticated, new UpdateSalaController().handle);
router.delete('/salas/:id', isAuthenticated, new DeleteSalaController().handle);
router.delete('/salas/planta_baixa/:planta_baixa_id', isAuthenticated, new DeleteSalasPorPlantaBaixaController().handle);
router.get('/salas/all', new GetSalasController().handle);

export { router };