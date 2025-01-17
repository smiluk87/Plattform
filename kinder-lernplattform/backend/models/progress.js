module.exports = (sequelize, DataTypes) => {
  const Progress = sequelize.define(
    'Progress',
    {
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // muss mit dem Tabellennamen der Users-Tabelle übereinstimmen
          key: 'id',
        },
      },
    },
    {
      tableName: 'progresses',
      underscored: true, // für Snake-Case in der DB
      timestamps: true, // Aktiviert createdAt und updatedAt
      createdAt: 'createdat', // Mapping der Felder
      updatedAt: 'updatedat',
    }
  );

  Progress.associate = (models) => {
    Progress.belongsTo(models.User, {
      foreignKey: 'userid',
      onDelete: 'CASCADE', // Fortschritte eines Benutzers werden bei Löschung des Benutzers entfernt
    });
  };

  return Progress;
};
