import { Sequelize, DataTypes, Model } from 'sequelize'
import {USER_ROLES} from '../utils/enums'
import {ProgramModel} from "./program";

export interface UserModel extends Model {
    id: number;
    name: string
    surname: string
    nickName: string
    email: string
    password: string
    age: number
    role: USER_ROLES
    program: UserModel
}
export default (sequelize: Sequelize, modelName: string) => {
    const UserModelCtor = sequelize.define<UserModel>(
        modelName,
        {
            id:{
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                unique:true,
            },
            nickName: {
                type: DataTypes.STRING(100),
            },
            name: {
                type: DataTypes.STRING(200),
            },
            surname: {
                type: DataTypes.STRING(200),
            },
            email: {
                type: DataTypes.STRING(200),
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            age: {
                type: DataTypes.INTEGER,
                validate: {
                    min: 0
                }
            },
            role: {
                type: DataTypes.ENUM(...Object.values(USER_ROLES)),
                allowNull: false,
                defaultValue: USER_ROLES.USER
            }
        },
        {
            paranoid: true,
            timestamps: true,
            tableName: 'users'
        }
    )

    UserModelCtor.associate = (models) => {
        UserModelCtor.hasMany(models.ExerciseTracker, {
            foreignKey: {
                name: "userID",
                allowNull: false,
            },
            onDelete: 'CASCADE',
        });

    }

    return UserModelCtor
};

