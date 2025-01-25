# Vi Coding Assignment 

__Both Vi and myself are huge Marvel fans!
At their request I prepared a small home assignment to get some interesting data regarding Marvel movie and actors.
The server can collect data from TMDB website using their 3rd party API system, populate and aggregate the data and return the necessary values.
The server can fetch all movies for a specific actor, provide necessary information on who played more then one marvel character as well as return characters who were played by more then one actor.__

## Tools
- Jest for testing
- __List additional tools you used...__

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

1.Please run 
```shell
npm install express
```
run the server.js file to start the application.

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



### Worth mentioning
__VMA in the commits stands for Vi-Marvel-Assignment.__
## Middlewares added:
1.actorValidatorMiddleware - validates that the actorName sent in the 1st endpoint is in the provided list within dataForQuestions.js and prevents unnecessary calls when the actor doesnt even exist.

## Funny side notes
1. for some reason poor Zoe Saldana is not returned from the credits api as an actor in guardians of the galaxy movies :(((
2. Edward Norton played the hulk before mark ruffalo however he is not in the list of actors provided in the assignment
