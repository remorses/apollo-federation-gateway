import { ApolloServer } from 'apollo-server'
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway'
import chalk from 'chalk'
import { IncomingHttpHeaders } from 'http'

const PORT = 80
const headersToForward: string[] = process.env.FORWARD_HEADERS
    ? process.env.FORWARD_HEADERS.split(',').filter((x) => x.trim())
    : ['Authorization']


const getConfig = () => {
    try {
        return JSON.parse(process.env.CONFIG as string)
    } catch {
        throw Error('cannot parse env.CONFIG\n' + process.env.CONFIG)
    }
}

type Context = {
    headers: IncomingHttpHeaders & any
}

const makeGateway = () => {
    const headersMap = Object.fromEntries(headersToForward.map(x => [x.toLowerCase(), x]))
    // console.log(headersMap)
    return new ApolloGateway({
        serviceList: getConfig(),
        buildService({ name, url }) {
            return new RemoteGraphQLDataSource({
                url,
                willSendRequest<Context>({ request, context }) {
                    if (context.headers) {
                        // console.log(context.headers)
                        Object.entries(context.headers).forEach(([k, v]) => {
                            if (headersMap[k]) {
                                request.http.headers.set(headersMap[k], v)
                            }
                        })
                    }
                }
            })
        }
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
                apiKey: process.env.ENGINE_API_KEY
            },
            cacheControl: {
                calculateHttpHeaders: true,
                defaultMaxAge: Number(process.env.DEFAULT_MAX_AGE) || 0
            },
            context: ({ req }): Context => {
                return {
                    headers: req.headers
                }
            }
        })

        return await server.listen(PORT).then(({ url }) => {
            console.log(`🚀 Server ready at port 80`)
        })
    } catch (e) {
        console.error(chalk.red(e.name + ', ' + e.message))
    }
}

main()
