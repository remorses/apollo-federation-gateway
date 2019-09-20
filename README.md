
## Usage

```yml

version: '3'

services:
    gateway:
        image: xmorse/apollo-federation-gateway
        environment: 
            DEFAULT_MAX_AGE: '5'
            ENGINE_API_KEY: '...'
            CONFIG: |
                [{
                    "name": "1",
                    "url": "http://localhost:4001"
                },
                {   "name": "2",
                    "url": "http://localhost:4002"
                },
                {   "name": "3",
                    "url": "http://localhost:4003"
                }]
                
```
