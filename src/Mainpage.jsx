import React from 'react'
import { ReactDOM } from 'react'
import { useEffect,useState } from 'react'
import axios from 'axios'
import './Mainpage.css'
import Quotelogo from './images/Quotelogo.png'
import Cross from './images/Cross.png'
import Circle from './images/Circle.png'
import Circle1 from './images/Circle1.png'
import Refresh from './images/Refresh.png'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const initialBoard = Array(3).fill(Array(3).fill(null));

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
};

function Mainpage() {
  const [board, setBoard] = useState(initialBoard);
  const [player, setPlayer] = useState(null);
  const [winner, setWinner] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [tiescore,setTiescore] = useState(0);
  const [tie, setTie] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [winnerOverlayOpen, setWinnerOverlayOpen] = useState(false);
  const [quitConfirmationOpen, setquitConfirmationOpen] = useState(false);



  useEffect(() => {
    const storedPlayerScore = localStorage.getItem('playerScore');
    const storedComputerScore = localStorage.getItem('computerScore');
    const storedTiescore = localStorage.getItem('tiescore');
    
    if (storedPlayerScore) {
      setPlayerScore(parseInt(storedPlayerScore, 10));
    }

    if (storedComputerScore) {
      setComputerScore(parseInt(storedComputerScore, 10));
    }

    if(storedTiescore){
      setTiescore(parseInt(storedTiescore,10));
    }
  }, []);
  useEffect(() => {
    if (board.flat().every((cell) => cell !== null)) {
      setTie(true);
      setShowWinner(true);
      setWinnerOverlayOpen(true);
    } else {
      const gameWinner = calculateWinner(board.flat());
      if (gameWinner) {
        setWinner(gameWinner);
        updateScores(gameWinner);
        setShowWinner(true);
        setWinnerOverlayOpen(true);
      }
    }
  }, [board]);
  const handleClick = (row, col) => {
    if (board[row][col] || winner || tie) {
      return;
    }
  
    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = player;
    setBoard(newBoard);
  
    if (newBoard.flat().every((cell) => cell !== null)) {
      setTie(true);
      setShowWinner(true);
      setWinnerOverlayOpen(true);
      updateScores('T'); // 'T' indicates a tie in your scoring system
    } else {
      switchPlayer();
    }
  };
  const switchPlayer = ()=> {
    setPlayer((prevPlayer)=> (prevPlayer === 'X' ? 'O' : 'X'));
  }

  const resetGame = () => {
    setBoard(initialBoard);
    setPlayer(null);
    setWinner(null);
    setTie(false);
    setShowWinner(false);

  };
  const Hideoverlay= ()=>{
    setBoard(initialBoard);
    setPlayer(null);
    setWinner(null);
    setTie(false);
    setShowWinner(false);
    setWinnerOverlayOpen(false);
    setquitConfirmationOpen(false);
  }

  const makeComputerMove = () => {
    if (winner || player !=='O') {
      return;
    }

    // Basic example: Computer picks a random empty spot
    const emptySpots = [];
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell) {
          emptySpots.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptySpots.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptySpots.length);
      const { row, col } = emptySpots[randomIndex];
      handleClick(row, col);
    }
  };
  const updateScores = (gameWinner) => {
    if (gameWinner === 'X') {
      setPlayerScore((prevScore) => prevScore + 1);
    } else if (gameWinner === 'O') {
      setComputerScore((prevScore) => prevScore + 1);
    }else if(gameWinner === 'T'){
      setTiescore((prevScore) => prevScore + 1);
    }

    // Store scores in local storage
    localStorage.setItem('playerScore', playerScore + 1);
    localStorage.setItem('computerScore', computerScore + 1);
    localStorage.setItem('Tiescore', (prevScore)=>prevScore+1);
  };
  const resetScores = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setTiescore(0);

    // Reset scores in local storage
    localStorage.setItem('playerScore', 0);
    localStorage.setItem('computerScore', 0);
    localStorage.setItem('Tiescore',0);
  };

  useEffect(() => {
    if (player === 'O' && board.flat().every((cell) => cell === null)) {
      // Start the game with the player as 'O' if the player chooses 'O'
      switchPlayer();
    }

    if (player === 'O') {
      // Add a delay before the computer makes a move for a better user experience
      const timeoutId = setTimeout(() => {
        makeComputerMove();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [player, makeComputerMove, board, winner]);
  const Homepage=()=>{
    setquitConfirmationOpen(true);
    //location.reload();
  }
  const invite=()=>{
    toast("invite link copied",{
      className:"Toast-message"
    });
  }
  const quitfunction=()=>{
    location.reload();
  }
  const [quote, setquote] = useState('Click for Facts');
  const [quoteid, setquouteid] = useState('');
  const quoteDisplay =()=>{
    fetch('https://api.adviceslip.com/advice').then(res=> res.json()).then(data=>{
      setquote(data.slip.advice);
      setquouteid(data.slip.id);
    })
  }
  useEffect(()=>{
    quoteDisplay();
  },[]);
  setTimeout(() => {
    quoteDisplay();
  }, 60000);
  const hidemain=()=>{
    const hide1 = document.querySelector('.Symbol-display');
    hide1.style.display ='none';
    const hide2 = document.querySelector('.Player-pick');
    hide2.style.display ='none';
    const hide3 = document.querySelector('.Newgame-button');
    hide3.style.display ='none';
    const hide4 = document.querySelector('.Newgame-Comingsoon');
    hide4.style.display ='none';
    const hide5 = document.querySelector('.Invite-friend');
    hide5.style.display ='none';
    const show1 = document.querySelector('.Game-page');
    show1.style.display ='flex';
    const show2 = document.querySelector('.Result-area');
    show2.style.display = 'flex';
  };
  return (
    <div className='Main'>
     <div className='Quote-layout'>
        <h1 className='Quote-heading'>Quote #{quoteid}</h1>
        <p className='Quote-content'>{quote}</p>
        <div className='Quote-logo'>
          <img src={Quotelogo} className='Quote-img' alt='image'/>
        </div>  
     </div>
        <div className='Outer-layout'>
          <div className='Symbol-display'>
            <img src={Cross} style={{marginRight:"6px"}} alt='Cross-Symbol'/>
            <img src={Circle} alt='Cross-Symbol'/>
          </div>
          <div className='Player-pick'>
            <p>PICK PLAYER</p>
            <div className='Symbol-pick'>
              <div className='Cross-symbol' onClick={()=>{setPlayer('X')}}
              >
                <img src={Cross} alt=''/>
              </div>
              <div className='Circle-symbol' onClick={()=>{setPlayer('O')}}>
                <img src={Circle}  alt=''/>
              </div>
            </div>
          </div>
          <button className='Newgame-button' onClick={hidemain}>NEW GAME( VS CPU)</button>
          <button className='Newgame-Comingsoon'>NEW GAME( VS HUMAN) Coming soon</button>
          <button onClick={invite} className='Invite-friend'>Invite your friend</button>
          <div className='Game-page'>
            <div className='Turn-display'>
              <img src={Cross}/>
              <img src={Circle}/>
              <button className='Turn-button'>{player} TURN</button>
              <div className='Refresh-button' onClick={resetGame}>
                <img src={Refresh} alt=''/>
              </div>
            </div>
            <div className='Game-area'>
              <div className='Gameplay'>
                {board.map((row, rowIndex) => (
                  <div key={rowIndex} className="row">
                    {row.map((cell, colIndex) => (
                      <div
                        key={colIndex}
                        className={`cell ${cell === 'X' ? 'playerX' : cell === 'O' ? 'playerO' : ''}`}
                        onClick={() => handleClick(rowIndex, colIndex)}
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {showWinner && winnerOverlayOpen &&(
  <div className="status">
    <div>
    {tie ? (
      'GAME TIED!'
    ) : winner ? (
      <div className='Winner-info'>
          {winner === 'X' ? 'YOU WON!' : 'YOU LOSE!'}
          <br />
          <div className='Round-Taker'>
          {`${winner} TAKES THE ROUND`}
          </div>
        </div>
        ):null}
        </div>
        <div className="Home-Button">
          <button onClick={Homepage} className='quit-button'>QUIT</button>
          <button onClick={Hideoverlay} className='nextround-button'>NEXT ROUND</button>
        </div>
      </div>
)}
          {quitConfirmationOpen && (
      <div className="reset-confirmation-box">
        <p>Do you want to quit?</p>
        <div className="button-container">
          <button onClick={Hideoverlay} className='nextround-button' style={{marginLeft:"30px"}}>PLAY AGAIN</button>
          <button onClick={quitfunction} className='quit-button' style={{marginLeft:"45px"}}>QUIT</button>
        </div>
      </div>
    )}
          </div>
          <div className='Result-area'>
            <div className='Player-score'>X (YOU)<br/>{playerScore}</div>
            <div className='Tie-score'>TIES<br/>{tiescore}</div>
            <div className='Computer-score'>O (CPU)<br/>{computerScore}</div>
          </div>
          <ToastContainer position="top-right"
                          autoClose={5000}
                          hideProgressBar
                          newestOnTop={false}
                          closeOnClick
                          rtl={false}
                          pauseOnFocusLoss={false}
                          draggable
                          pauseOnHover
                          theme="dark"
                          //style={{borderRadius:50,color:"red"}}
                          />
        </div>
    </div>
  )
}

export default Mainpage