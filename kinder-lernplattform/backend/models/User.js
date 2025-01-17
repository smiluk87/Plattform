module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'users', // Explizit den Tabellennamen setzen
      underscored: true, // Nutzt snake_case für Felder
      createdAt: 'createdat', // Mapping für die Felder
      updatedAt: 'updatedat',
    }
  );
  return User;
};
