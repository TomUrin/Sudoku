// Sudoku MVP su generavimu, tikrinimu, užuominomis ir pastabomis
const boardEl = document.getElementById('board');
const newGameBtn = document.getElementById('newGameBtn');
const checkBtn = document.getElementById('checkBtn');
const hintBtn = document.getElementById('hintBtn');
const clearNotesBtn = document.getElementById('clearNotesBtn');
const difficultyEl = document.getElementById('difficulty');

let puzzle = [];     // 9x9 su 0 kaip tušti
let solution = [];   // teisingas sprendinys
let cells = [];      // DOM nuorodos

function deepCopy(grid){ return grid.map(row => row.slice()); }

function createEmptyGrid(){
  return Array.from({length:9}, () => Array(9).fill(0));
}

function isSafe(grid, r, c, val){
  for(let i=0;i<9;i++){
    if(grid[r][i]===val || grid[i][c]===val) return false;
  }
  const br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3;
  for(let i=0;i<3;i++) for(let j=0;j<3;j++){
    if(grid[br+i][bc+j]===val) return false;
  }
  return true;
}

function solveGrid(grid){
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      if(grid[r][c]===0){
        for(let val=1; val<=9; val++){
          if(isSafe(grid, r, c, val)){
            grid[r][c] = val;
            if(solveGrid(grid)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Sugeneruoja pilnai išspręstą lentą, tada pašalina langelius pagal sudėtingumą
function generateSudoku(diff='easy'){
  let grid = createEmptyGrid();

  // Užpildom diagonalinius 3x3 blokus atsitiktinai, padeda greičiau sugeneruoti
  for(let b=0;b<9;b+=3){
    let nums = [1,2,3,4,5,6,7,8,9];
    for(let r=0;r<3;r++){
      for(let c=0;c<3;c++){
        const idx = Math.floor(Math.random()*nums.length);
        const val = nums.splice(idx,1)[0];
        grid[b+r][b+c] = val;
      }
    }
  }

  // Išsprendžiam iki pilnos lentos
  const filled = deepCopy(grid);
  solveGrid(filled);

  // Kiek palikti langelių užpildytų
  let clues;
  if(diff==='easy') clues = 40;
  else if(diff==='medium') clues = 32;
  else clues = 26;

  let puzzle = deepCopy(filled);
  // Pašalinam reikšmes iki norimo clue skaičiaus
  let cellsToRemove = 81 - clues;
  const positions = Array.from({length:81}, (_,i)=>i);
  // sumaišom
  for(let i=positions.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  let idx=0;
  while(cellsToRemove>0 && idx<positions.length){
    const pos = positions[idx++];
    const r = Math.floor(pos/9);
    const c = pos%9;
    if(puzzle[r][c]!==0){
      const backup = puzzle[r][c];
      puzzle[r][c]=0;
      // Pasirinktinai: galėtume tikrinti vienintelio sprendimo sąlygą, bet MVP paliekam paprasčiau
      cellsToRemove--;
    }
  }
  return { puzzle, solution: filled };
}

function buildBoard(){
  boardEl.innerHTML='';
  cells = [];
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      if(r===2 || r===5) cell.classList.add('rowSep');
      if(c===2 || c===5) cell.classList.add('colSep');

      const input = document.createElement('input');
      input.setAttribute('inputmode','numeric');
      input.setAttribute('maxlength','1');
      input.setAttribute('aria-label', `Langelis ${r+1}-${c+1}`);

      const notes = document.createElement('div');
      notes.className = 'notes';
      for(let k=1;k<=9;k++){
        const n = document.createElement('div');
        n.className = 'note'; n.textContent='';
        notes.appendChild(n);
      }

      if(puzzle[r][c]!==0){
        input.value = puzzle[r][c];
        input.readOnly = true;
        cell.classList.add('readonly');
      }else{
        input.value = '';
      }

      input.addEventListener('keydown', e => {
        // Pastabos su Alt
        if(e.altKey){
          const d = parseInt(e.key,10);
          if(d>=1 && d<=9){
            e.preventDefault();
            const notesCells = notes.children;
            notesCells[d-1].textContent = notesCells[d-1].textContent ? '' : d.toString();
          }
          return;
        }
        // Įvedimas
        const d = parseInt(e.key,10);
        if(d>=1 && d<=9){
          e.preventDefault();
          input.value = d.toString();
          // išvalom pastabas
          for(const n of notes.children) n.textContent='';
          validateCell(r,c,input,cell);
        }else if(e.key==='Backspace' || e.key==='Delete' || e.key==='0'){
          input.value='';
          cell.classList.remove('invalid');
          for(const n of notes.children) n.textContent='';
        }
      });

      cell.appendChild(input);
      cell.appendChild(notes);
      boardEl.appendChild(cell);
      cells.push({r,c,cell,input,notes});
    }
  }
}

function validateCell(r,c,input,cell){
  const val = parseInt(input.value||'0',10);
  if(!val){ cell.classList.remove('invalid'); return; }
  // Patikrinam su sprendiniu
  if(solution[r][c] !== val){
    cell.classList.add('invalid');
  }else{
    cell.classList.remove('invalid');
  }
}

function checkBoard(){
  let ok = true;
  for(const {r,c,input,cell} of cells){
    if(input.readOnly) continue;
    const val = parseInt(input.value||'0',10);
    if(!val || val!==solution[r][c]){
      cell.classList.add('invalid');
      ok = false;
    }else{
      cell.classList.remove('invalid');
    }
  }
  if(ok) alert('Puiku. Teisingai išspręsta!');
  else alert('Dar ne viskas gerai. Pažiūrėk į pažymėtus langelius.');
}

function giveHint(){
  // Randam atsitiktinį tuščią ar neteisingą langelį ir užpildom teisinga reikšme
  const candidates = cells.filter(({r,c,input}) => {
    const val = parseInt(input.value||'0',10);
    return val!==solution[r][c];
  });
  if(candidates.length===0){ alert('Užuominų nebereikia. Viskas teisinga.'); return; }
  const pick = candidates[Math.floor(Math.random()*candidates.length)];
  pick.input.value = solution[pick.r][pick.c];
  pick.cell.classList.remove('invalid');
  // Išvalom pastabas
  for(const n of pick.notes.children) n.textContent='';
}

function clearNotes(){
  for(const {notes} of cells){
    for(const n of notes.children) n.textContent='';
  }
}

function newGame(){
  const diff = difficultyEl.value;
  const data = generateSudoku(diff);
  puzzle = data.puzzle;
  solution = data.solution;
  buildBoard();
}

newGameBtn.addEventListener('click', newGame);
checkBtn.addEventListener('click', checkBoard);
hintBtn.addEventListener('click', giveHint);
clearNotesBtn.addEventListener('click', clearNotes);

// Start
newGame();
