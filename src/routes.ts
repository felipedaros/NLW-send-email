import { Router } from 'express';
import { SurveysController } from './controllers/SurveysController';
import { UserController } from './controllers/UserController';
import { SendMailController } from './controllers/SendMailController';
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';

const router = Router();

const userController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const nps = new NpsController;

router.post("/users", userController.create);
router.post('/surveys', surveysController.create);
router.get('/surveys', surveysController.show);

router.post("/sendMail", sendMailController.execute);

router.get("/answer", answerController.execute)

router.get("/nps/:survey_id", nps.execute);

export { router }