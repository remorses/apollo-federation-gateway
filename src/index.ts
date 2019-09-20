import { ApolloServer } from 'apollo-server'
import { ApolloGateway } from '@apollo/gateway'
import chalk from 'chalk'

const PORT = 80

const getConfig = () => {
    try {
        return JSON.parse(process.env.CONFIG as string)
    } catch {
        throw Error('cannot parse env.CONFIG\n' + process.env.CONFIG)
    }
}

const makeGateway = () => {
    return new ApolloGateway({
        serviceList: getConfig()
    })
}

const main = async () => {
    try {
        const gateway = makeGateway()
        const { schema, executor } = await gateway.load()

        const server = new ApolloServer({
            schema,
            executor,
            engine: {
                apiKey: process.env.ENGINE_API_KEY,
            },
            cacheControl: {
                calculateHttpHeaders: true,
                defaultMaxAge: Number(process.env.DEFAULT_MAX_AGE) || 0,
            }
        })

        return await server.listen(PORT).then(({ url }) => {
            console.log(`🚀 Server ready at ${url}`)
        })
    } catch (e) {
        console.error(chalk.red(e.name + ', ' + e.message))
    }
}

main()
