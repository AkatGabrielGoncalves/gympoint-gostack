import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      idade: Yup.number().required().min(0).max(130),
      peso: Yup.number().required().min(10),
      altura: Yup.number().required().min(0),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const { id, name, email, idade, peso, altura } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      idade,
      peso,
      altura,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email().required(),
      newEmail: Yup.string().email(),
      idade: Yup.number().min(0).max(130),
      peso: Yup.number().min(10),
      altura: Yup.number().min(0),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const { email, newEmail } = req.body;

    const student = await Student.findOne({ where: { email } });

    if (!student) {
      return res.status(400).json({ error: "Email doesn't exist" });
    }

    const existEmail = await Student.findOne({ where: { email: newEmail } });

    if (newEmail && existEmail) {
      return res.status(400).json({ error: 'Email already taken' });
    }

    if (newEmail && email) {
      req.body.email = newEmail;
    }

    const { id, name, idade, peso, altura } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      newEmail,
      idade,
      peso,
      altura,
    });
  }

  async index(req, res) {
    const students = await Student.findAll();

    res.json(students);
  }
}

export default new StudentController();
