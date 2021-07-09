import { FastifyInstance } from 'fastify'
import { startFastify } from '../server'
import { Server, IncomingMessage, ServerResponse } from 'http'
import * as dbHandler from './db'
import * as E from 'fp-ts/Either'
import { ITodo } from '../types/todo'
import { constTrue } from 'fp-ts/lib/function'

describe('Form test', () => {
    let server: FastifyInstance<Server, IncomingMessage, ServerResponse>

    beforeAll(async () => {
        await dbHandler.connect()
        server = startFastify(8888)
    })

    afterEach(async () => {
        await dbHandler.clearDatabase()
    })

    afterAll(async () => {
        E.match(
            (e) => console.log(e),
            (_) => console.log('Closing Fastify server is done!')
        )(
            E.tryCatch(
                () => {
                    dbHandler.closeDatabase()
                    server.close((): void => { })
                },
                (reason) => new Error(`Failed to close a Fastify server, reason: ${reason}`)
            )
        )
    })    

    // TODO: Add some test cases like CRUD, i.e. get, post, update, delete

    it('should get todo item after input', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/api/todos',
            payload: {
                name: 'clean my desk',
                description: 'Should clean my desk before dinner.',
                status: false
            }
        })

        expect(response.statusCode).toBe(201)
        const res: { todo: ITodo } = JSON.parse(response.body)
        expect(res.todo.name).toBe('clean my desk')
        expect(res.todo.description).toBe('Should clean my desk before dinner.')


            
        //get
        const getResponse = await server.inject({
            method: 'GET',
            url: '/api/todos'
        })

        expect(getResponse.statusCode).toBe(200)
        const getRes: { todos: Array<ITodo> } = JSON.parse(getResponse.body)
        console.log(`post Todo: ${getResponse.body}`)
        expect(getRes.todos.length).toBe(1)
        expect(getRes.todos[0].name).toBe('clean my desk')
        expect(getRes.todos[0].description).toBe('Should clean my desk before dinner.')
        expect(getRes.todos[0].status).toBe(false)

        //update
        
        
        
    })
})
