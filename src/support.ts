import fetch from 'node-fetch'

export const sleep = (time) => new Promise((r) => setTimeout(r, time))

export const waitForServices = async (urls) => {
    while (true) {
        const results: string[] = await Promise.all(
            urls.map((url) =>
                fetch(url)
                    .then((_) => 'ok')
                    .catch((x) => x.message)
            )
        )
        // console.log('results ' + results)
        const errors = results.filter((x) => x.includes('ECONNREFUSED'))
        if (errors.length) {
            await sleep(1000)
            console.log('waiting for services avaliability')
        } else {
            return true
        }
    }
}

export const getConfig = () => {
    const URLS = [
        'URL_0',
        'URL_1',
        'URL_2',
        'URL_3',
        'URL_4',
        'URL_5',
        'URL_6',
        'URL_7'
    ]
    const urls = Object.entries(process.env)
        .filter(([k, v]) => {
            if (URLS.includes(k)) {
                return true
            }
            return false
        })
        .sort(([k1], [k2]) => k1.localeCompare(k2))
        .map(([k, v]) => v)
    return urls.map((url) => ({
        name: url && url.replace('https://', '').replace('http://', ''),
        url
    })) as { name: string; url: string }[]
}
