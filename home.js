const Review = sequelize.define(
    "review",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: User,
          key: 'id',
          onDelete: 'CASCADE',
        },
        allowNull: false,
      },
      photographer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: PhotographerProfile,
          key: 'id',
          onDelete: 'CASCADE',
        },
        allowNull: true,
      },
      rent_equipment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: RentEquipmentProfile,
          key: 'id',
          onDelete: 'CASCADE',
        },
        allowNull: true,
      },
      review: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
  
  const Rating = sequelize.define(
    "rating",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: User,
          key: 'id',
          onDelete: 'CASCADE',
        },
        allowNull: false,
      },
      photographer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: PhotographerProfile,
          key: 'id',
          onDelete: 'CASCADE',
        },
        allowNull: true,
      },
      rent_equipment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: RentEquipmentProfile,
          key: 'id',
          onDelete: 'CASCADE',
        },
        allowNull: true,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
  