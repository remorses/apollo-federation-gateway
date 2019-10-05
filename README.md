
## Usage

```yml

version: '3'

services:
    gateway:
        ports:
            - 80:80
        image: xmorse/apollo-federation-gateway
        environment: 
            CACHE_MAX_AGE: '5'
            ENGINE_API_KEY: '...'
            FORWARD_HEADERS: 'Authorization, X-Custom-Header' # default is Authorization, pass '' to reset
            URL_0: http://service1
            URL_1: http://service2
                
```

To see an example run the docker-compose in this repository
