import { Request, Response} from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUserRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UserRepository';
import SendMailService from '../services/SendMailService';

class SendMailController {
  async execute(request: Request, response: Response){
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUserRepository);

    const user = await usersRepository.findOne({ email });
    const npsPath = resolve(__dirname, "..", "view", "emails", "npsMail.hbs")
    const survey = await surveysRepository.findOne({id: survey_id})
    
    if(!user){
      throw new AppError(("User does not exists!"))
    }

      if(!survey){
        throw new AppError(("Survey does not exists!"))
      }

      const surveyAlreadyExists = await surveysRepository.findOne({
        where: {user_id: user.id, value: null},
        relations: ["user", "survey"]
      })

      const variables = {
        name: user.name,
        title: survey.title,
        description: survey.description,
        id: "",
        link: process.env.URL_MAIL
      }

      if(surveyAlreadyExists){
        variables.id = surveyAlreadyExists.id
        await SendMailService.execute(email, survey.title, variables, npsPath)

        return response.json(surveyAlreadyExists)
      }

      const surveyUser = surveysUsersRepository.create({
        user_id: user.id,
        survey_id,
      })
      await surveysUsersRepository.save(surveyUser);

      variables.id = surveyUser.id;

      await SendMailService.execute(email, survey.title, variables, npsPath)

      return response.json(surveyUser);
    }
  }

export { SendMailController }