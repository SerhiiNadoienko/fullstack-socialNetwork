import User from '../models/User';

export const getUser = async (req, res) => {
  try {
    const { id } = req.params; //достаем id из параметров
    const user = await User.findById(id); //встроенным  методом монгуса ищем по id в базе данных этого  перса
    res.status(200).json(user); //отдаем все данные о персонаже
  } catch (error) {
    res.status(404).json({ message: error.message }); // в случае ошибки отправляем сообщение об ошибке
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params; //достаем id из параметров
    const user = await User.findById(id); //ищем юзера в базе данных

    const friends = await Promise.all(user.friends.map((id) => User.friendId(id))); //обернули в Promise.all чтобы подождать когда получим всех друзей
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }; //форматируем друзей для фронтенда, так как содержит доп поля ненужные
      },
    );
    res.status(200).json(formattedFriends); // отдаем отформатированных друзей на фронт
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* Update */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params; //достаем id и id друга из параметров
    const user = await User.findById(id); //ищем id в базе данных
    const friend = await User.findById(friendId); //ищем друга у пользователя через его id
    //если юзер уже содержит в друзьях этог id
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId); //то мы удаляем этого перса через банальную фильтрацию
      friendId.friends = friend.friends.filter((id) => id !== id); //удаляем себя у друга
      //или если юзера ещё не было у нас в друзьях
    } else {
      user.friends.push(friendId); // то пушим новый id в друзья юзера
      friend.friens.push(id); //и пушим себя в дурзья друга
    }
    await user.save(); //сохраняем изменения у юзера
    await friend.save(); //сохраняем изменения у друга

    const friends = await Promise.all(user.friends.map((id) => User.friendId(id))); //обернули в Promise.all чтобы подождать когда получим всех друзей
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath }; //форматируем друзей для фронтенда, так как содержит доп поля ненужные
      },
    );
    res.status(200).json(formattedFriends); // отдаем отформатированных друзей на фронт
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
