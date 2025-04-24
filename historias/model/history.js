import db from '../config/DatabaseConfig'


class History{
    static async getAll(){
        return await db('history').select('*')
    }
    static async getById(id){
        return await db('history').select('*').where('idHistory', Number(id)).first()
    }
    static async create(history){
        return await db('history').insert(history)
    }
    static async update(id, history){
        return await db('history').where('idHistory', id).update(history)
    }
    static async delete(id){
        return await db('history').where('idHistory', id).del()
    }
}
export default History
