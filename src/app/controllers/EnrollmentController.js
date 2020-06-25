import { parseISO, addMonths, isAfter } from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object.shape({
      email: Yup.string().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const { plan_id, start_date } = await req.body;

    const studentId = await Student.findByPk(req.params.studentId);

    if (!studentId) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const enrollmentExists = await Enrollment.findOne({
      where: { student_id: studentId.id },
    });

    if (enrollmentExists && isAfter(enrollmentExists.end_date, new Date())) {
      return res.status(400).json({ error: 'Enrollment already exists' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    const parsedStartDate = parseISO(start_date);
    const parsedEndDate = addMonths(parsedStartDate, plan.duration);

    const enrollment = await Enrollment.create({
      student_id: studentId.id,
      plan_id: plan.id,
      start_date: parsedStartDate,
      end_date: parsedEndDate,
      price: plan.price,
    });

    return res.json(enrollment);
  }

  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      where: { end_date: { [Op.gt]: new Date() } },
      attributes: ['id', 'start_date', 'end_date', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async update(req, res) {
    const enrollment = await Enrollment.findOne({
      where: {
        student_id: req.params.studentId,
        end_date: { [Op.gt]: new Date() },
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exist' });
    }

    const { start_date, plan_id } = await req.body;

    if (start_date < new Date()) {
      return res.status(400).json({ error: 'Past dates not permitted' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const parsedStartDate = parseISO(start_date);
    const end_date = addMonths(parsedStartDate, plan.duration);

    const updatedEnrollment = await enrollment.update({
      start_date,
      end_date,
      plan_id,
      price: plan.price,
    });

    return res.json(updatedEnrollment);
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findOne({
      where: {
        student_id: req.params.studentId,
        end_date: { [Op.gt]: new Date() },
      },
    });

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exist' });
    }

    const updatedEnrollment = await enrollment.update({
      end_date: new Date(),
    });

    return res.json(updatedEnrollment);
  }
}

export default new EnrollmentController();
