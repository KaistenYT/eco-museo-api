import db from "../config/DatabaseConfig";


class Participation{
    static async getAll(){
        return await db('participation').select('*')
    }
    static async getById(id){
        return await db('participation').select('*').where('idParticipation', Number(id)).first()
    }
    static async create(participation){
        return await db('participation').insert(participation)
    }
    static async update(id, participation){
        return await db('participation').where('idParticipation', id).update(participation)
    }
    static async delete(id){
        return await db('participation').where('idParticipation', id).del()
    }
}
export default Participation
