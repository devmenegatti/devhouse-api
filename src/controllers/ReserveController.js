import Reserve from '../models/Reserve';
import User from '../models/User';
import House from '../models/House';

class ReserveController {
  async index(req, res) {
    const { user_id } = req.headers;
    const reserves = await Reserve.find({ user: user_id }).populate('house');

    return res.json(reserves);
  }

  async store(req, res) {
    const { user_id } = req.headers;
    const { house_id } = req.params;
    const { date } = req.body;

    const house = await House.findById(house_id);
    if (!house) {
      return res.status(400).json({ message: 'Esse casa não existe.' });
    }

    if (house.status !== true) {
      return res.status(400).json({ message: 'Solicitação Indisponivel.' });
    }

    const user = await User.findById(user_id);

    if (String(house.user) === String(user._id)) {
      return res.status(401).json({ message: 'Reserva não permitida.' });
    }

    const reserve = await Reserve.create({
      date,
      house: house_id,
      user: user_id,
    });

    await reserve
      .populate('user')
      .populate('house')
      .execPopulate();

    return res.json(reserve);
  }

  async destroy(req, res) {
    const { reserve_id } = req.body;

    await Reserve.findByIdAndDelete({ _id: reserve_id });

    return res.json({ message: 'Deletado com sucesso' });
  }
}

export default new ReserveController();
