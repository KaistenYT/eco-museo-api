import db from '../config/DatabaseConfig'

class Actor{

    static async getAll(){
        return await db('actor').select('*')
    }

    static async getById(id){
        return await db('actor').select('*').where('idActor', Number(id)).first()
    }

    static async create(actor){
        return await db('actor').insert(actor)
    }

    static async update(id, actor){
        return await db('actor').where('idActor', id).update(actor)
    }

    static async delete(id){
        return await db('actor').where('idActor', id).del()
    }
}

export default Actor