
## Usage

```yml

version: '3'

services:
    service1:
        build: service1
    service2:
        build: service2
    gateway:
        ports:
            - 80:80
        image: xmorse/apollo-federation-gateway
        environment: 
            - CACHE_MAX_AGE=5
            - "FORWARD_HEADERS=Authorization, X-Custom-Header" # default is Authorization, pass '' to reset
            - URL_0=http://service1
            - URL_1=http://service2
                
```

To see an example run the docker-compose in this repository
