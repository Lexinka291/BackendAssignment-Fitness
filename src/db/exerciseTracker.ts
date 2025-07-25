﻿import { Sequelize, DataTypes, Model } from 'sequelize'
import {ExerciseModel} from "./exercise";
import {UserModel} from "./user";

export interface ExerciseTrackerModel extends Model {
    id: number
    completedAt : Date;
    durationSeconds: number;

    user: UserModel
    exercise: ExerciseModel
}


export default (sequelize: Sequelize, modelName: string) => {
    const ExerciseTrackerModelCtor = sequelize.define(
        modelName,
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            completedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            durationSeconds: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "tracker",
            timestamps: true,
            paranoid: true,
        }
    );

    ExerciseTrackerModelCtor.associate = (models) => {
        ExerciseTrackerModelCtor.belongsTo(models.User, {
            foreignKey: {
                name: "userID",
                allowNull: false,
            },
        });

        ExerciseTrackerModelCtor.belongsTo(models.Exercise, {
            foreignKey: {
                name: "exerciseID",
                allowNull: false,
            },
        });
    };

    return ExerciseTrackerModelCtor
}

