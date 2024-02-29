const createTokenUser = (user) => {
  return {
    name: user.username,
    id: user._id,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
  };
};
module.exports = createTokenUser;
