import knex from 'knex'

const db = knex({

    client: 'sqlite3',
    connection: {
        filename: './eco-museo.sqlite'
    }
})

async function createActorTable (){

    const exist = await db.schema.hasTable('actor')

    if(!exist){
        await db.schema.createTable('actor', table => {
            table.increments('idActor').primary()
            table.string('nombre').notNullable()
            table.string('apellido').nullable()
            table.string('rol').notNullable()
        })

        console.log('table actor created')
    }else{
        console.log('table actor already exists')
    }

}

async function createTableAuthor() {
    const exist = await db.schema.hasTable('author')

    if(!exist){
        await db.schema.createTable('author', table => {
            table.increments('idAuthor').primary()
            table.string('nombre').notNullable()
            table.string('apellido').nullable()
        })

        console.log('table author created')
    }else{
        console.log('table author already exists')
    }

}

async function createHistoryTable() {
    const exist = await db.schema.hasTable('history')

    if(!exist){
        await db.schema.createTable('history', table => {
            table.increments('idHistory').primary()
            table.string('tittle')
            table.string('description')
            table.integer('idAuthor')
            table.foreign('idAuthor').references('author.idAuthor')
        })

        console.log('table history created')
    }else{
        console.log('table history already exists')
    }

}


async function createParticipationTable() {
    const exist = await db.schema.hasTable('participation')

    if(!exist){
        await db.schema.createTable('participation', table => {
            table.increments('idParticipation').primary()
            table.integer('idHistory')
            table.integer('idActor')
            table.foreign('idHistory').references('history.idHistory')
            table.foreign('idActor').references('actor.idActor')
        })

        console.log('table participation created')
    }else{
        console.log('table participation already exists')
    }

}



async function  createInitialTables() {
    await createActorTable()
    await createTableAuthor()
    await createHistoryTable()
    await createParticipationTable()
}
createInitialTables()

export default db

  
