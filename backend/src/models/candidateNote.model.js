const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CandidateNote = sequelize.define(
    "CandidateNote",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        candidateId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "candidates",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: "candidate_notes",
        timestamps: true,
    }
);

module.exports = CandidateNote;
