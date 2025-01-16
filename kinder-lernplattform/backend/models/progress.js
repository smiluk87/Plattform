module.exports = (sequelize, DataTypes) => {
  const Progress = sequelize.define('Progress', {
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
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'progresses', // Tabellennamen auf Kleinbuchstaben setzen
    timestamps: true,       // Automatische Handhabung von createdAt und updatedAt
  });

  Progress.associate = (models) => {
    Progress.belongsTo(models.User, {
      foreignKey: 'userid',  // Verbindung mit der Tabelle "users"
      onDelete: 'CASCADE',
    });
  };

  return Progress;
};
