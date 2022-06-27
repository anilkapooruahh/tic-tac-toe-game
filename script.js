// Globals
const pageContainer = document.getElementById("page-container")



const gameBoard = (() => {
    let gameBoard
    // () => gameBoard
    // retrieves gameboard or creates it if undefined
    const getGameBoard = () => {
        if(gameBoard === undefined) {
            gameBoard = createGameBoard([[],[],[]])
            return gameBoard
        }
        return gameBoard
    }

    let createGameBoard = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                arr[i][j] = Spot(j, i, "")                
            }
        }
        return arr
    }

    // gameBoard Spot => gameBoard
    // sets a spot in the gameBoard

    const setGameBoard = (spot) => {
        gameBoard[spot.getJ()][spot.getI()] = spot
        return gameBoard
    }



    // Spot -> Boolean
    // produces true if spot is valid
    const isValid = (i, j) => {
        return gameBoard[Number(j)][Number(i)].getSym() === ""
    }

    // Symbol Symbol -> String
    // declares winnner if any, D if no winner

    return {getGameBoard, setGameBoard, isValid}
})()


const Spot = (i ,j, sym) => {
    const getI = () => i
    const getJ = () => j
    const getSym = () => sym
    const setSym = (newSym) => {
        sym = newSym
    }
    return {getI, getJ, getSym, setSym}
}

const Player = (sym) => {
    const getSym = () => sym
    const setSym = (newSym) => {
        sym = newSym
        return sym
    }
    //  gameBoard number number => gameboard
    //  places symbol on board at spot at gameboard[j][i]
    const pick = (gameBoard, i, j) => {
        if (gameBoard.isValid(i,j)) {
            return gameBoard.setGameBoard(Spot(i,j, getSym()))
        }
        alert("not valid move")
        return
    }

    return {pick, getSym, setSym}
}

const Game = ((gameBoard, PlayerOne, PlayerTwo) =>  {
    // inits gameboard
    const init = () => {gameBoard.getGameBoard() 
        return } 

        // Symbol Symbol -> Symbol
    // decides turn
    const turn = () => {
        const sym1 = PlayerOne.getSym()
        const sym2 = PlayerTwo.getSym()
        if (search(sym1) === search(sym2)) {
            return PlayerOne
        }
        return PlayerTwo
    }

    // Symbol => Number
    // how many times a symbol appears in the grid
    const search = sym => {
        times = 0
        for (let i = 0; i < gameBoard.getGameBoard().length; i++) {
            for (let j = 0; j < gameBoard.getGameBoard().length; j++) {
                if (gameBoard.getGameBoard()[i][j].getSym() === sym) {
                    times++
                }   
            }
        }
        return times
    }
    const isWinner = (sym1 , sym2) => {
        if ((search(sym1) <= 2) && (search(sym2) <= 2)) {
            return "D"
        }
        if (winRows(gameBoard.getGameBoard(), sym1, sym2) !== "D") {
            return winRows(gameBoard.getGameBoard(), sym1,sym2)
        }
        if (winCols(gameBoard.getGameBoard(),sym1, sym2) !== "D") {
            return winCols(gameBoard.getGameBoard(), sym1, sym2)
        }
        if (winDiagonals(gameBoard.getGameBoard(), sym1, sym2) !== "D") {
            return winDiagonals(gameBoard.getGameBoard(), sym1, sym2)
        }

        return "D"
    }
    // Symbol Symbol -> String
    // checks row condition for winning
    const winRows = (gameBoard, sym1, sym2) => {
        if (gameBoard.some(row => row.every(spot => spot.getSym() === sym1))) {
            return sym1
        }
        if (gameBoard.some(row => row.every(spot => spot.getSym() === sym2))) {
            return sym2
        }
        return "D"
    }

    // Symbol Symbol -> String
    // checks column condition for winning
    const winCols = (gameBoard, sym1, sym2) => {
        for (let i = 0; i < 3; i++) {
            if (arrayColumn(gameBoard, i).every(spot => spot.getSym() === sym1)) {
                return sym1
            }
            if (arrayColumn(gameBoard, i).every(spot => spot.getSym() === sym2)) {
                return sym2
            }
        }
        return "D"
    }

    // Symbol Symbol -> String
    // checks diagonals condition for winning 
    const winDiagonals = (gameBoard, sym1, sym2) => {
        if([[gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]],
            [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]]].some(row => row.every(spot => spot.getSym() === sym1))) {
                return sym1
        }
        if([[gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]],
            [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]]].some(row => row.every(spot => spot.getSym() === sym2))) {
                return sym2
        }
        return "D"
    }

    const arrayColumn = (arr, n) => arr.map(x => x[n]);
    
    
    //  () => String
    // symbol of Player if  
    const round = (i,j) => {
        init()

        if (!(gameBoard.isValid(i, j)))  { return }
        turn().pick(gameBoard, i, j)
        declareWinner()

    }

    const declareWinner = () => { 
        if (search(PlayerOne.getSym()) + search(PlayerTwo.getSym()) === 9) {
            return "D"
        }
        if (isWinner(PlayerOne.getSym(), PlayerTwo.getSym()) !== "D") {
            return isWinner(PlayerOne.getSym(), PlayerTwo.getSym())
        }

        return undefined
    }


    return {round, isWinner, declareWinner}
})(gameBoard, Player("X"), Player("O"))

const Display = (() => {
    const createGrid = () => {
        const gridContainer = document.createElement("div")
        gridContainer.classList.add('grid-container')
        pageContainer.appendChild(gridContainer)
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const spot = document.createElement("div")
                spot.classList.add("grid-element")
                createSpot(gridContainer, spot, i, j)
                gridContainer.appendChild(spot)
            }
            
        }
    }

    const createSpot = (gridContainer, spot,i,j) => {
        const gridButton = document.createElement("button")
        gridButton.classList.add("spot")
        const gridButtonText = document.createElement("p")
        gridButton.addEventListener("click", () => {Game.round(j,i)})
        gridButton.addEventListener("click", () => changeSpotText(gridButtonText, i, j))
        gridButton.addEventListener("click", () => displayWin(gridContainer))
        gridButton.appendChild(gridButtonText)
        spot.appendChild(gridButton)
    }

    const changeSpotText = (text, i, j) => {
        text.innerText = gameBoard.getGameBoard()[i][j].getSym()
    }

    const displayWin = (container) => {
       
        if (Game.declareWinner() !== undefined) {
            const VictoryText = document.createElement("div")

            VictoryText.innerText = `${Game.declareWinner()}`
            container.appendChild(VictoryText)
        }

       
    } 
    return {createGrid}
})()


Display.createGrid()