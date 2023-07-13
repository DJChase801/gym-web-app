import models, { sequelize } from "../models";

// Controller function that gets all the members from the database
export const getMembers = async () => {
    const members = await models.member.findAll({
        order: [['first_name', 'ASC']],
    });

    return members;
}

export const removeMember = async (member_id: string) => {
    await models.member.destroy({
        where: {
            member_id,
        },
    });

    const members = await models.member.findAll(); 
    return members; 
}
