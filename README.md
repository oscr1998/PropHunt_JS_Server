# # Revelio!
## A top-down PropHunt Hide & Seek Game
### By Kai, Thamiem, Matthieu, Oliver
---
Revelio! is a Phaser/React Game connected to two different Backends. One Python Server and One Javascript sever, both deployed on Render.

Follow this link to go to the website!: https://revelio.netlify.app/

## Installation & Usage

- Clone or download these three repositories:
    1. https://github.com/oscr1998/Prophunt_Clientside_Deploy
    2. https://github.com/oscr1998/PropHunt_JS_Server
    3. https://github.com/oscr1998/Prophunt_PY_Server

- Or clone or download this repoistory to have all three of the above repositories in one place:
    - https://github.com/oscr1998/PropHunt_Development

- For repository 1:
    - Navigate to your terminal
    - Run `npm install` to install dependencies.
    - Run `npm start` to launch the frontend.
- For repository 2:
    - Navigate to your terminal
    - Run `npm install` to install dependencies.
    - Run `npm start` to launch the server.
- For repository 3:
    - Navigate to your terminal
    - Run `pipenv install` to install dependencies.
    - Run `pipenv shell` to create a virtual environment.
    - Run `pipenv run start` to start server.
- For repository 4:
    - Navigate to your terminal
    - cd to the `client` folder and run the commands for repository 1
    - Navigate to a new terminal
    - cd to the `JSserver` folder and run the commands for repository 2
    - Navigate to a new terminal
    - cd to the `PYserver` folder and run the commands for repository 3

## Technology Used:

| **Frontend** | **Backend**        | **Both**   | 
|:------------:|:------------------:|:----------:|
| HTML         | Python             | Javascript |
| CSS          | Python Flask       | Github     | 
| REACT        | Flask SQL\_Alchemy | Socket\.io |
| Redux        | Flask\-mail        | Node\.js   |
| Tiled        | Flask\-login       | Slack      |
| Phaser       | ElephantSQL        |            |
| Netlify      | Express            |            |
|              | Render             |            |
|              |                    |            |

## Bugs

[x] Once a game has finished, sometimes a browser restart is needed to play a new game

## Wins & Challenges

### Wins

- Fully functioning app
- Able to include lots of bonus features 

### Challenges

- Integrating React, Socket.io and Phaser all together

---

