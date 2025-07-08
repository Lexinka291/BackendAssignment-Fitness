import http from 'http'
import express from 'express'

// import { sequelize } from './db'
import {Sequelize} from "sequelize";
import ProgramRouter from './routes/programs'
import ExerciseRouter from './routes/exercises'
import UserRouter from './routes/users'
import TestRouter from './routes/test'
import AdminRouter from './routes/admin'
import TrackerRouter from './routes/tracker'
import * as dotenv from "dotenv"
import passport from './config/passport'
import {errorHandler} from "./middlewares/errorHandler";

dotenv.config();


export const sequelize = new Sequelize(
  'postgresql://postgres:postgres@localhost:5432/fitness_app',
  {
    dialect: 'postgres',
  }
);

const auth = require('./middlewares/jwtAuth');

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
// app.use(passport.session())
app.use('/programs', ProgramRouter())
app.use('/exercises', ExerciseRouter())
app.use('/users', UserRouter())
app.use('/admin', AdminRouter())
app.use('/test', TestRouter());
app.use('/tracker', TrackerRouter());
app.use(errorHandler)
const httpServer = http.createServer(app)

try {
    sequelize.sync()
} catch (error) {
    console.log('Sequelize sync error')
}

httpServer.listen(8000).on('listening', () => console.log(`Server started at port ${8000}`))

export default httpServer
