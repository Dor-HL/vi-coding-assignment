# Vi Coding Assignment 

__Both Vi and myself are huge Marvel fans!
At their request I prepared a small home assignment to get some interesting data regarding Marvel movie and actors.
The server can collect data from TMDB website using their 3rd party API system, populate and aggregate the data and return the necessary values.
The server can fetch all movies for a specific actor, provide necessary information on who played more then one marvel character as well as return characters who were played by more then one actor.__

## Tools
- Jest for testing
- dotenv for secrets handling
- express.js
- axios for http requests
- node-cache for caching service
- supertest for http request unitets

## Getting Started

### Install dependencies

Before starting to code, don't forget to install all dependencies.

```shell
yarn
```

### Running tests

Run all tests once:

```shell
yarn test
```

### How to use

1. __Add a .env file at your root project (under the vi-coding-assignment) with__
```shell
TMDB_API_KEY=<your api key>
```

2. Please run 
```shell
npm i
```
3.run the server.js file to start the application
From root of project write the following command in terminal:

```shell
node src/server.js
```

## Endpoints:
All the routes begin with /api/v1/marvel/

1.Endpoint to fetch movies for an actor name:
```shell
GET http://localhost:3000/api/v1/marvel/moviesPerActor?actorName=Paul Rudd
```

will return the following response: 

```shell
{
    "Paul Rudd": [
        "Ant-Man",
        "Captain America: Civil War",
        "Ant-Man and the Wasp",
        "Avengers: Endgame"
    ]
}
```

In the Following 2 Endpoints as per my understanding of the assignment if An actor played the character in several movies they will be displayed so that all relevant movies are part of the answer for example Chris Evans played Johnny Storm / Human Torch in Fantastic Four (2005) as well as Fantastic Four: Rise of the Silver Surfer - hence both movies will be apparent in the returned list.

2. Endpoint to get actors with multiple characters in the given marvel movies
```shell
GET http://localhost:3000/api/v1/marvel/actorsWithMultipleCharacters
```


will return a json response with entries such as this:
```shell
{
    "Michael B. Jordan": [
        {
            "movieName": "Fantastic Four (2015)",
            "characterName": "Johnny Storm / Human Torch"
        },
        {
            "movieName": "Black Panther",
            "characterName": "Erik Killmonger"
        }
    ]
}
```

3. Endpoint to get characters who were played by multiple actors
```shell
GET http://localhost:3000/api/v1/marvel/charactersWithMultipleActors
```

will return a json response with entries such as this:
```shell
{
    "Johnny Storm / Human Torch": [
        {
            "movieName": "Fantastic Four (2005)",
            "actorName": "Chris Evans"
        },
        {
            "movieName": "Fantastic Four: Rise of the Silver Surfer",
            "actorName": "Chris Evans"
        },
        {
            "movieName": "Fantastic Four (2015)",
            "actorName": "Michael B. Jordan"
        }
    ]
}
```


__



## Worth mentioning
__VMA in the commits stands for Vi-Marvel-Assignment.__

### Middlewares added:
actorValidatorMiddleware - validates that the actorName sent in the 1st endpoint is in the provided list within dataForQuestions.js and prevents unnecessary calls when the actor doesnt even exist.

### Data aggregation and processing:
For the usage of the APIs requiring finding multiple actors for character as well as multiple character for a single actor, I came across an issue where there was a lack of format in character names within different movies - for example "Tony Stark" and "Tony Stark / Iron man" are the same character.
To handle that I had to change how I process the data and normalize the  character names.
I used a few rules:
- All words within a name will begin with a capital letter - to avoid duplicates due to case sensitivty
- I ignored the redundant(at the beginning or end of names) blank spaces within names.
- I split by "/" and sort the words to preserve the same order to avoid duplications such as "Tony Stark / Iron Man" and "Iron Man/ Tony Stark"
- I avoided normalization of single worded names such as Loki to prevent issues like  "Loki" and  "Loki as Captain America" being recognized as same character.
- I added an exclude list for a specific case of James Rhodes (War Machine) who had several titels in his name such as "Lt.", "Rhodney" etc etc. I would have liked to avoid this however there seems to be no naming rules for the character names - in a real world application - I would probably have a DB with known Aliases for the charcaters to avoid such lists.

### Data Caching:
I used node-cache to implement a small-scale caching service, which efficiently stores and retrieves data in-memory with a simple API. This is ideal for use cases with limited data size and a single-instance application. However, in a real-world application, especially when dealing with larger-scale data or distributed systems, I would have leveraged Redis. Redis offers more advanced features such as persistent storage and support for distributed caching, making it better suited for handling high-volume traffic, complex datasets, and ensuring data consistency across multiple application instances. Given more time, I would have integrated Redis to provide scalability, fault tolerance, and better performance for large-scale applications.

### More improvements I would have liked to have made given more time:
- create a scheduling solution to repopulate the data using an executor at both the init of the application and every 12/24 hours or other configurable ammount of time.
- create a logging service that will be used to give out more details in the given logs.
- I would have liked to have used a DB for aliases and other data manipulations - As this data is structured I would have probably chosen postgress or MySql however MongoDB is also an extremely good candidate. this would be our "cold storage" as the caching service is the "hot storage".
- I would have liked to have added more unitests as well as a pipeline to run integration tests through jenkins/gitlab.
- I would have liked to implement an awsSecretsManager service and handle secrets and a client to fetch and store said secrets.

### Funny side notes
1. for some reason poor Zoe Saldana is not returned from the credits api as an actor in guardians of the galaxy movies :(((
2. Edward Norton played the hulk before Mark Ruffalo however he is not in the list of actors provided in the assignment
