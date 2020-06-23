import Sequelize, { Model } from 'sequelize';

class Enrollment extends Model {
  static init(sequelize) {
    super.init(
      {
        email: Sequelize.VIRTUAL,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
  }
}

export default Enrollment;
