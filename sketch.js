let rows = 10;
let cols = rows * 2;
let cellSize;
let grid = []; //arra of cells that comprise the entire grid
let mines = []; //array of cells that are mines

let colorValues = [
	{r:235,g: 254,b: 201},
	{r:218,g: 247,b: 166},
	{r:255,g: 195,b: 0},
	{r:255,g: 87,b: 51},
	{r:199,g: 0,b: 57},
	{r:144,g: 12,b: 63},
	{r:88, g:24,b: 69},


];

let legend;



let numMines = 25;

let gameIsOver = false;

function setup()
{
	createCanvas(800, 500);
	cellSize = width / cols;

	//create the grid
	for (let i = 0; i < cols; i++)
	{
		for (let j = 0; j < rows; j++)
		{
			grid.push(new Cell(i, j, cellSize, grid.length))
		}
	}
	// revealGrid(grid);

}

function draw()
{
	background(0);
	fill(0);
	stroke(255);
	showGrid();

	showLegend();

	if(gameIsOver)
	{
		noLoop();
	}

}

function gameOver()
{
	revealGrid(grid);
	gameIsOver = true;
	showGrid();
}

function mouseClicked()
{
	let clickCoords = [mouseX, mouseY];

	let clickedCell = getClickedCell(clickCoords[0], clickCoords[1]);
	clickedCell.reveal();

	if(clickedCell.mine)
	{
		gameOver();
	}


	if (!mines.length)
	{
		makeMines(numMines);

		countMinesForEntireGrid(grid);
	}

	if(clickedCell.neighborMines === 0)
		floodFill(clickedCell);




}

function revealGrid(grid)
{
	for(let g=0;g<grid.length;g++)
	{
		grid[g].reveal();
	}
}

function countMinesForEntireGrid(grid)
{
	for(let g=0;g<grid.length;g++)
	{
		grid[g].countMines();
	}
}

function getClickedCell(mx, my)
{
	for (let g = 0; g < grid.length; g++)
	{
		let cg = grid[g];
		if (mx < cg.x || mx > cg.x + cg.d || my < cg.y || my > cg.y + cg.d)
		{
			//mouse click couldn't possibly be inside this cell
			continue;
		}
		return cg;
	}
}

function showGrid()
{
	for (let g = 0; g < grid.length; g++)
	{
		grid[g].show();
	}
}

function showLegend()
{

}

function getIndex(x, y)
{
	return (x < 0 || y < 0 || x > cols - 1 || y > rows - 1) ? -1 : y + x * rows;
}

function makeMines(n)
{
	let minesRemaining = n;
	let attempts = 0;
	while (minesRemaining > 0 && attempts < (cols * rows))
	{
		attempts++;
		let rx = floor(random(cols));
		let ry = floor(random(rows));
		let index = getIndex(rx, ry);
		if (index === -1 || grid[index].revealed)
		{
			continue;
		}


		grid[index].mine = true;
		mines.push(grid[index]);
		minesRemaining--;
	}
}

function floodFill(cell)
{
	//given a cell with no mines nearby
	//check all neighbors to find any other adjacent
	//cells with no mines nearby
	//reveal all contiguous cells with no 
	var stack = [cell]; //stack for backtracking

	while (stack.length > 0)
	{
		let curCell = stack.pop();
		curCell.reveal();
		// debugger;
		curCell.setFill();
		let neighbors = curCell.getAdjacentNeighbors();
		for(let n=0;n<neighbors.length;n++)
		{
			if(curCell.neighborMines === 0 && !neighbors[n].revealed && !neighbors[n].mine)
			{
				stack.push(neighbors[n]);
			}


		}
	}
}

function Cell(i, j, w, index)
{
	this.i = i;
	this.j = j;
	this.x = i * w;
	this.y = j * w;
	this.d = w; //dimension 
	this.index = index;
	this.red = 0;
	this.green = 0;
	this.blue = 0;

	this.mine = false;
	this.revealed = false;
	this.neighborMines = 0;

	this.reveal = function()
	{
		this.revealed = true;
	}

	this.setFill = function()
	{
		let cv = colorValues[this.neighborMines];
		this.red = cv.r;
		this.blue = cv.b;
		this.green = cv.g;
	}

	this.getAdjacentNeighbors = function()
	{
		let neighbors = [];

		let index;
		for(let i=-1;i<2;i++)
		{
			for(let j=-1;j<2;j++)
			{
				index = getIndex(this.i+i,this.j+j);
				if(index > -1)
				{
					neighbors.push(grid[index]);
				}
			}
		}

		// let wi = getIndex(this.i - 1, this.j);
		// let ni = getIndex(this.i, this.j - 1);
		// let ei = getIndex(this.i + 1, this.j);
		// let si = getIndex(this.i, this.j + 1);

		// if (wi > -1) neighbors.push(grid[wi]);
		// if (ni > -1) neighbors.push(grid[ni]);
		// if (ei > -1) neighbors.push(grid[ei]);
		// if (si > -1) neighbors.push(grid[si]);

		return neighbors;
	}

	this.show = function()
	{
		fill(16, 62, 5);
		stroke(0);
		rect(this.x, this.y, this.d, this.d);
		if (this.mine && this.revealed)
		{
			fill(0);
			ellipse(this.x + this.d * .5, this.y + this.d * .5, this.d * .3, this.d * .3);
		}
		else if (this.revealed)
		{
			// debugger;
			fill(this.red,this.green,this.blue);
			rect(this.x, this.y, this.d, this.d);
			if (this.neighborMines > 0)
			{
				textAlign(CENTER);
				fill(61, 117, 47);
				noStroke();
				text(this.neighborMines, this.x + this.d / 2, this.y + this.d / 2);
			}
		}

	}

	this.countMines = function()
	{
		for (let i = -1; i <= 1; i++)
		{
			for (let j = -1; j <= 1; j++)
			{
				let index = getIndex(this.i + i, this.j + j)
				if (index > -1 && grid[index].mine)
				{
					this.neighborMines++;
				}
			}
		}
		this.setFill();
	}
}


function Legend(n)
{
	this.blocks = [];

	for(let i=0;i<n;i++)
	{
		this.blocks.push(new Legend_Block(i));
	}

	this.update() = function()
	{
		for(let b=0;b<this.blocks.length;b++)
		{
			this.blocks[b].updateFill();
			this.blocks[b].show();
		}
	}
}

function Legend_Block(index)
{
	this.i = index;
	this.w = cellSize;
	
	this.x = this.i * this.w
	this.y = height - this.w;
	
	
	this.red;
	this.green;
	this.blue;

	this.show() = function()
	{
		rect
	}
}