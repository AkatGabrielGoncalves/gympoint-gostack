import { Op } from 'sequelize';
import { addDays } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';

class CheckinController {
  async store(req, res) {
    const studentExists = await Student.findByPk(req.params.studentId);

    if (!studentExists) {
      return res.status(400).json({ error: "Student don't exist" });
    }

    const plan = await Enrollment.findOne({
      where: {
        student_id: req.params.studentId,
        end_date: { [Op.gt]: new Date() },
      },
    });

    if (!plan) {
      return res
        .status(401)
        .json({ error: "You don't have an active enrollment" });
    }

    const { count } = await Checkin.findAndCountAll({
      where: {
        created_at: { [Op.between]: [addDays(new Date(), -7), new Date()] },
      },
    });

    if (count >= 5) {
      return res
        .status(401)
        .json({ error: 'You reached the maximum check-ins per week' });
    }

    const student = await Checkin.create({ student_id: req.params.studentId });

    return res.json(student);
  }

  async index(req, res) {
    const studentExists = await Student.findByPk(req.params.studentId);

    if (!studentExists) {
      return res.status(400).json({ error: "Student don't exist" });
    }

    const checkins = await Checkin.findAll({
      where: {
        student_id: req.params.studentId,
        created_at: { [Op.between]: [addDays(new Date(), -7), new Date()] },
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
