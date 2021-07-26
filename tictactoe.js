let cross = '✕';

const playerFactory = (identity, type) => {
    let _numWins = 0;
    let _identity = identity;
    let _type = type;
    let addWin = () => _numWins++;
    let getIdentity = () => _identity;
    let getType = () => _type;
    let setType = (type) => _type = type;
    let getWins = () => _numWins;
    return {getIdentity, getType, getWins, addWin, setType};
};

const gameBoard = (() => {

    let _board = ['', '', '',
                  '', '', '',
                  '', '', '']

    let _checkLine = (line,board=_board) => {
        let s1 = board[line[0]];
        let s2 = board[line[1]];
        let s3 = board[line[2]];

        if (s1 === 'X' && s2 === 'X' && s3 === 'X') {
            return 'X';
        } else if (s1 === 'O' && s2 === 'O' && s3 === 'O') {
            return 'O';
        } else {
            return '';
        }
    }

    let isValidMove = (index) => (_board[index] === '');
    let addX = (index) => _board[index] = 'X';
    let addO = (index) => _board[index] = 'O';
    let deleteMark = (index) => _board[index] = '';

    let clearBoard = () => _board = ['','','','','','','','',''];
    let checkWin = (board=_board) => {
        let lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (let i = 0; i < lines.length; i++) {
            let lineWinner = _checkLine(lines[i], board);
            if (lineWinner) return lineWinner;
        }
        if (!board.includes('')) return 'tie';
        return '';
    }

    let getBoard = () => _board;

    return {addX, addO, deleteMark, clearBoard, isValidMove, checkWin, getBoard};
})();

const flowController = (() => {
    let _activePlayer = 'X';
    let _status = 'before';

    let getActivePlayer = () => _activePlayer;
    let getStatus = () => _status;
    let switchPlayer = () => _activePlayer = (_activePlayer === 'X') ? 'O' : 'X';

    let setStatus = (status) => {
        _status = status;
        if (status === 'before') _activePlayer = 'X'; // by default x is chosen
    }

    return {getActivePlayer, switchPlayer, getStatus, setStatus};
})();

const displayController = (() => {
    let _spaces = document.querySelectorAll('.space');
    let _xBtn = document.getElementById('x-btn');
    let _oBtn = document.getElementById('o-btn');
    let _restartBtn = document.getElementById('restart-btn')
    let _diffDropdown = document.getElementById('difficulty-dropdown');
    let _gameText = document.getElementById('game-text');
    let _winText = document.getElementById('win-text');

    let _addXToDisplay = (index) => {
        let space = document.getElementById(`space${index}`);
        space.textContent = cross;
        space.classList.remove('inactive');
        space.classList.add('x-on');
    }

    let _addOToDisplay = (index) => {
        let space = document.getElementById(`space${index}`);
        space.textContent = 'O';
        space.classList.remove('inactive');
        space.classList.add('o-on');
    }

    let _deleteFromDisplay = (index) => {
        let space = document.getElementById(`space${index}`);
        space.classList.remove('x-on');
        space.classList.remove('o-on');
        space.classList.add('inactive');
    }

    let updateWins = () => {
        let xWins = gameController.getXWins();
        let oWins = gameController.getOWins();
        if (xWins > 0) document.getElementById('x-wins').textContent = xWins;
        if (oWins > 0) document.getElementById('o-wins').textContent = oWins;
    }

    let _updateDisplay = () => {
        _render();
        _updateText();
        _switchToActivePlayer();
    }

    let _render = () => {
        let placements = gameBoard.getBoard();
        for (let i = 0; i < 9; i++) {
            if (placements[i] == 'X') {
                _addXToDisplay(i);
            } else if (placements[i] == 'O') {
                _addOToDisplay(i);
            } else {
                _deleteFromDisplay(i);
            }
        }
    }

    let _updateText = () => {
        let winCondition = gameBoard.checkWin();
        if (winCondition === 'X') {
            _gameText.textContent = 'X wins!';
        } else if (winCondition === 'O') {
            _gameText.textContent = 'O wins!';
        } else if (winCondition === 'tie') {
            _gameText.textContent = 'Tied!';
        } else if (flowController.getStatus() === 'before') {
            _gameText.textContent = 'Start game or select player';
        } else if (flowController.getActivePlayer() === 'X') {
            _gameText.textContent = 'X\'s turn';
        } else if (flowController.getActivePlayer() === 'O') {
            _gameText.textContent = 'O\'s turn';
        } else {
            console.log('issue with text');
        }
    }

    let _switchToActivePlayer = () => {
        let active = flowController.getActivePlayer();
        if (active === 'X') {
            _oBtn.classList.remove('active');
            _xBtn.classList.add('active');
        } else if (active === 'O') {
            _xBtn.classList.remove('active');
            _oBtn.classList.add('active');
        }
    }

    let _removeWinScreen = () => {
        let background = document.querySelector("body > *:not(#win-text)");
        if (flowController.getStatus() === 'after') {
            _winText.style.display = 'none';
            background.classList.remove('blur');
            gameController.restartGame();
            _updateDisplay();
        }
    }

    let showWinScreen = (winner) => {
        console.log('showing');
        let background = document.querySelector("body > *:not(#win-text)");
        if (winner === 'tie') {
            _winText.textContent = 'The game is a tie!';
        } else {
            _winText.textContent = `The winner is ${winner}`;
        }
        
        _winText.style.display = 'block';
        background.classList.add('blur');

        window.addEventListener('click', _removeWinScreen);
        window.addEventListener('keydown', _removeWinScreen);
    }

    _oBtn.addEventListener('click', () => {
        // may need to change for AI implmenetation
        if (flowController.getStatus() === 'before' && gameController.getDifficulty() !== 'two-players') {
            gameController.startGame('O');
            _updateText();
            setTimeout((() => {
                gameController.makeMove(botController.makeMove())
                _updateDisplay();
            }), 500);
        }
    });

    _restartBtn.addEventListener('click', () => {
        gameController.restartGame();
        _updateDisplay();
    });

    _spaces.forEach(space => {
        space.addEventListener('click', () => {

            if (!gameController.botActive()) {
                // might start game
                if (flowController.getStatus() === 'before') {
                    if (gameController.getDifficulty() === 'two-players') {
                        gameController.startGame('')
                    }
                    else {
                        gameController.startGame('X');
                    }
                }

                // make move
                if (flowController.getStatus() === 'during') {
                    spaceIndex = space.id.slice(-1);
                    gameController.makeMove(spaceIndex);
                    _updateDisplay();
                }

                // bot move 
                if (gameController.botActive() && flowController.getStatus() !== 'after') {
                    setTimeout(() => {
                        gameController.makeMove(botController.makeMove());
                        _updateDisplay();
                    }, 500); 
                }
            }
        });
    });

    _diffDropdown.addEventListener('change', () => {
        gameController.setDifficulty(_diffDropdown.value);
        gameController.restartGame();
        _updateDisplay();
    });

    return {showWinScreen, updateWins};
})();

const gameController = (() => {
    let _difficulty = 'easy';
    let _playerX = playerFactory('X', 'human');
    let _playerO = playerFactory('O', 'human');

    let setDifficulty = difficulty => _difficulty = difficulty;
    let getDifficulty = () => _difficulty;
    let botActive = () => {
        return (
            flowController.getActivePlayer() === 'X' && _playerX.getType() === 'bot' ||
            flowController.getActivePlayer() === 'O' && _playerO.getType() === 'bot');
    }

    let currentBot = () => {
        return (_playerX.getType() === 'bot') ? 'X' : 
               (_playerO.getType() === 'bot') ? 'O' : 
               '';
    }

    let makeMove = (index) => {
        if (gameBoard.isValidMove(index)) {
            let status = flowController.getStatus();
            let activePlayer = flowController.getActivePlayer();

            if (status === 'during') {
                if (activePlayer === 'X') {

                    gameBoard.addX(index);
                } else if (activePlayer === 'O') {
                    gameBoard.addO(index);
                }
            }
            if (!checkWinStatus()) switchPlayer();
        }
    };

    let startGame = (playerIdentity='') => {
        flowController.setStatus('during');
        if (playerIdentity == '') {
            _playerX.setType('human');
            _playerO.setType('human');
        } else if (playerIdentity === 'O') {
            _playerX.setType('bot');
            _playerO.setType('human');
        } else if (playerIdentity === 'X') {
            _playerX.setType('human');
            _playerO.setType('bot');
        }
    }

    let restartGame = () => {
        flowController.setStatus('before');
        gameBoard.clearBoard();
        _playerO.setType('human');
        _playerX.setType('human');
    };

    let checkWinStatus = () => {
        let winStatus = gameBoard.checkWin();

        if (winStatus === 'X') {
            _playerX.addWin();
        }
        else if (winStatus === 'O') {
            _playerO.addWin();
        }

        if (winStatus !== '') {
            displayController.showWinScreen(winStatus);
            setTimeout((() => flowController.setStatus('after')),500); // timeout allows win screen to show
            displayController.updateWins();
        }

        return winStatus;
    };

    let switchPlayer = () => {
        flowController.switchPlayer();
    };

    let getXWins = () => _playerX.getWins();
    let getOWins = () => _playerO.getWins();

    return {setDifficulty, getDifficulty, makeMove, restartGame,
            startGame, checkWinStatus, getXWins, getOWins, botActive, currentBot};
})();
 

const botController = (() => {

    // if bot is x, it wants to maximize
    // if bot is y, it wants to minimize
    
    let _bot = gameController.currentBot();
    let _player = (_bot === 'X') ? 'O' : 'X';

    let _remainingSpots = (board) => {
        let remainingSpots = [];
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') remainingSpots.push(i);
        }
        return remainingSpots;
    }

    let _randomMove = () => {
        let spots = _remainingSpots(gameBoard.getBoard());
        return spots[Math.floor(Math.random() * spots.length)];
    }

    let _evaluate = (board) => {
        // check for terminal state
        let winner = gameBoard.checkWin(board);
        switch (winner) {
            case 'X': return 10;
            case 'O': return -10;
            default: 0;
        }
    }

    let _minmax = (board, depth, player) => {
        let score = _evaluate(board); // check for winner
        if (score === 10 || score === -10) {
            return score;
        }

        if (_remainingSpots(board).length === 0) {
            return 0;
        }
        if (player === 'X') { // x tries to maximize score
            let best = -10000;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';  // make the move
                    best = Math.max(best, _minmax(board, depth + 1, 'O')); // the opponent attempts the lowest score
                    board[i] = ''; //undo the move
                }
            }
            return best;

        } else if (player === 'O') {
            let best = 10000;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';  // make the move
                    best = Math.min(best, _minmax(board, depth + 1, 'X')); // the opponent attempts the highest score
                    board[i] = ''; //undo the move
                }
            }
            return best;
        }
    }

    let _findBestMove = (board) => {
        let botPlayer = gameController.currentBot();
        let humanPlayer = (botPlayer === 'X') ? 'O' : 'X';
        let bestVal = (botPlayer === 'X') ? -10000 : 10000;
        let bestMove = null;
        
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = botPlayer;
                let moveVal = _minmax(board, 0, humanPlayer);
                board[i] = '';

                if (moveVal > bestVal && botPlayer === 'X' || moveVal < bestVal && botPlayer === 'O') {
                    bestMove = i;
                    bestVal = moveVal;
                } 
            }
        }
        return bestMove;
    }

    let makeMove = () => {
        let bestMove = _findBestMove(gameBoard.getBoard());
        console.log(bestMove);
        let randomMove = _randomMove();
        let diffVal = Math.floor(Math.random() * 100);
        switch (gameController.getDifficulty()) {
            case 'easy':
                return randomMove;
            case 'medium':
                return (diffVal < 55) ? bestMove : randomMove;
            case 'hard':
                return (diffVal < 85) ? bestMove : randomMove;
            case 'impossible':
                return bestMove;
        }
    }

    return {makeMove};
})();