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
          model: 'users', // Name der Users-Tabelle in der Datenbank
          key: 'id',
        },
      },
    },
    {
      tableName: 'progresses', // Name der Tabelle in der Datenbank
      underscored: true, // Verwende Snake-Case für DB-Felder
      timestamps: true, // Aktiviert `createdAt` und `updatedAt`
      createdAt: 'createdat', // Mapping für `createdAt`
      updatedAt: 'updatedat', // Mapping für `updatedAt`
    }
  );

  // Assoziationen definieren
  Progress.associate = (models) => {
    Progress.belongsTo(models.User, {
      foreignKey: 'userid', // Verknüpfung mit der User-Tabelle
      onDelete: 'CASCADE', // Lösche Fortschritte, wenn Benutzer gelöscht wird
    });
  };

  return Progress;
};
