import Sequelize from 'sequelize';
// import mongoose from 'mongoose';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Enrollment from '../app/models/Enrollment';
import Checkin from '../app/models/Checkin';
import HelpOrder from '../app/models/HelpOrder';

const models = [User, Student, Plan, Enrollment, Checkin, HelpOrder];

class Database {
  constructor() {
    this.init();
    // this.mongoose();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  // mongoose() {
  //   this.mongoConnection = mongoose.connect(
  //     'mongodb://localhost:27017/gympoint',
  //     {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //       useFindAndModify: false,
  //     }
  //   );
  // }
}

export default new Database();
