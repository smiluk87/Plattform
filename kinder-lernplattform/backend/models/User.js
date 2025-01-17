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
      tableName: 'users', // Expliziter Tabellenname
      underscored: true, // Nutzt snake_case für Spalten
      timestamps: true, // Aktiviert automatisch createdAt und updatedAt
      createdAt: 'createdat', // Mapt Sequelize's createdAt auf createdat in der DB
      updatedAt: 'updatedat', // Mapt Sequelize's updatedAt auf updatedat in der DB
    }
  );

  return User;
};
