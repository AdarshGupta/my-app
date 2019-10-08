import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return (
        <button className={"square " + props.winnerBtn} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        let btnColor = 'plain-btn';
        if(calculateWinner(this.props.squares)){
            const [a, b, c] = calculateWinner(this.props.squares)
            if(i === a || i === b || i === c){
                btnColor = 'winner-btn'
            }        
        }
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                key={i}
                winnerBtn={btnColor} 
            />
        );
    }

    designGrid(){
        var boardRows = [];
        var gridSize = 3;

        for(let row = 0; row < gridSize; row++){
            var boardCols = [];
            for(let col = row * gridSize; col < (row * gridSize) + gridSize; col++){
                boardCols.push(this.renderSquare(col));
            }
            boardRows.push(<div className="board-row" key={row}>{boardCols}</div>);
        }

        return boardRows;
    }

    render() {
        return (
            <div>
                {this.designGrid()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                }
            ],
            xIsNext: true,
            stepNumber: 0,
            order: 'ascending',
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]
        const squares = current.squares.slice();

        if(calculateWinner(squares) || squares[i] || checkDraw(squares)){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{squares: squares}]),
            stepNumber: history.length, 
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    posChanged(previous, current){
        const pos = null;
        for(let i = 0; i < current.length; i++){
            if(current[i] && previous[i] !== current[i]){
                return i;
            }
        }
        return pos;
    }

    toggleOrder(currentOrder){
        let changedOrder;
        if(currentOrder === 'ascending'){
            changedOrder = 'descending';
        }
        else{
            changedOrder = 'ascending'
        }

        this.setState({
            order: changedOrder
        });
        
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const draw = checkDraw(current.squares);
        let col = null, row = null, desc;

        var moves = history.map((steps, move, array) => {

            if(move){
                const pos = this.posChanged(array[move - 1].squares, array[move].squares)
                col = (pos % 3) + 1;
                row = parseInt(pos / 3) + 1;
                desc = 'Go to step #' + move + " (" + col + ", " + row + ") ";
            }
            else{
                desc = 'Go to start';
            }
            
            let buttonSelection = null;
            if(this.state.stepNumber === move){
                buttonSelection = 'highlight-btn'
            }

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} className={buttonSelection}>{desc}</button>
                </li>
            );
        });

        if(this.state.order === 'descending'){
            moves = moves.reverse();
        }

        let status;
        if(winner){
            status = 'Winner: ' + current.squares[winner[0]];
        }
        else{
            if(draw){
                status = "It's a draw!"
            }
            else{
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
            
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => {this.handleClick(i)}}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button className="sort-btn" onClick={() => {this.toggleOrder(this.state.order)}}>Sort Order: {this.state.order}</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for(let i = 0; i < lines.length; i++){
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return lines[i];
        }
    }
    return null;
}

function checkDraw(squares){
    for(var i = 0; i < squares.length; i++){
        if(squares[i] === null){
            return false
        }
    }
    return true;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

