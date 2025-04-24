import db from '../config/DatabaseConfig'

class Author{
    static async getAll(){
        return await db('author').select('*')
    }
    static async getById(id){
        return await db('author').select('*').where('idAuthor', Number(id)).first()
    }
    static async create(author){
        return await db('author').insert(author)
    }
    static async update(id, author){
        return await db('author').where('idAuthor', id).update(author)
    }
    static async delete(id){
        return await db('author').where('idAuthor', id).del()
    }
}
export default Author