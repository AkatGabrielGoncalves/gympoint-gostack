import { Op } from 'sequelize';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Mail from '../../lib/Mail';

class HelpOrderController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.studentId);

    if (!student) {
      return res.status(400).json({ error: "Student don't exist" });
    }

    const { question } = await req.body;

    const helpOrder = await HelpOrder.create({
      student_id: req.params.studentId,
      question,
    });

    return res.json(helpOrder);
  }

  async index(req, res) {
    const orders = await HelpOrder.findAll({
      where: { answer: { [Op.eq]: null } },
    });

    return res.json(orders);
  }

  async show(req, res) {
    const student = await Student.findByPk(req.params.studentId);

    if (!student) {
      return res.status(400).json({ error: "Student don't exist" });
    }

    const questions = await HelpOrder.findAll({
      where: { student_id: req.params.studentId },
    });

    return res.json(questions);
  }

  async update(req, res) {
    const question = await HelpOrder.findByPk(req.params.helpId, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    const { answer } = await req.body;

    const answeredQuestion = await question.update({
      answer,
      answer_at: new Date(),
    });

    await Mail.sendMail({
      to: `${question.student.name} <${question.student.email}>`,
      subject: 'Sua pergunta foi respondida! - GymPoint',
      text: answer,
    });

    return res.json(answeredQuestion);
  }
}

export default new HelpOrderController();
