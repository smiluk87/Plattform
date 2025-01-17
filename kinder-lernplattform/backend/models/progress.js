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
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      tableName: 'progresses',
      underscored: true,
      createdAt: 'createdat', // Mapping für Datenbank
      updatedAt: 'updatedat',
    }
  );

  Progress.associate = (models) => {
    Progress.belongsTo(models.User, {
      foreignKey: 'userid',
      onDelete: 'CASCADE',
    });
  };

  return Progress;
};
