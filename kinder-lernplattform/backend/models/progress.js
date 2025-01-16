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
    });
  
    Progress.associate = (models) => {
      Progress.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    };
  
    return Progress;
  };
  