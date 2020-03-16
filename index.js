const { Engine, Render, Runner, World, Bodies } = Matter;

//MaZe Demensions
const cells = 8;
const width = 1200;
const height = 1200;

const unitLength = width / cells;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		wireframes: true,
		width,
		height
	}
});

Render.run(render);
Runner.run(Runner.create(), engine);

//Walls
const walls = [
	Bodies.rectangle(width / 2, 0, width, 40, {
		isStatic: true
	}),
	Bodies.rectangle(width / 2, height, width, 40, {
		isStatic: true
	}),
	Bodies.rectangle(0, height / 2, 40, height, {
		isStatic: true
	}),
	Bodies.rectangle(width, height / 2, 40, height, {
		isStatic: true
	})
];
World.add(world, walls);

// MaZe Generation
const shuffle = (arr) => {
	let counter = arr.length;
	while (counter > 0) {
		const index = Math.floor(Math.random() * counter);
		counter--;
		const temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}
	return arr;
};

const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));

const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));
const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startCol = Math.floor(Math.random() * cells);

stepThruCell = (row, col) => {
	//If i have visited the cell at {row, column}, then return
	if (grid[row][col] === true) {
		return;
	}

	//Mark this cell as being visited
	grid[row][col] = true;

	//Assemble randomly-ordered list of neighbors
	const neighbors = shuffle([
		[ row - 1, col, 'up' ],
		[ row + 1, col, 'down' ],
		[ row, col - 1, 'left' ],
		[ row, col + 1, 'right' ]
	]);

	//For each neighbor...
	for (let neighbor of neighbors) {
		const [ nextRow, nextCol, direction ] = neighbor;

		//see if that neighbor is out of bounds
		if (nextRow < 0 || nextRow >= cells || nextCol < 0 || nextCol >= cells) {
			continue;
		}

		//if we have visited that neighbor continue to next neighbor
		if (grid[nextRow][nextCol]) {
			continue;
		}

		//remove wall from either horizontal or verticle array
		if (direction === 'left') {
			verticals[row][col - 1] = true;
		} else if (direction === 'right') {
			verticals[row][col] = true;
		} else if (direction === 'up') {
			horizontals[row - 1][col] = true;
		} else if (direction === 'down') {
			horizontals[row][col] = true;
		}

		//visit next cell
		stepThruCell(nextRow, nextCol);
	}
};
stepThruCell(startRow, startCol);

//horizontal walls
horizontals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}

		const wall = Bodies.rectangle(
			columnIndex * unitLength + unitLength / 2,
			rowIndex * unitLength + unitLength,
			unitLength,
			2,
			{
				isStatic: true
			}
		);
		World.add(world, wall);
	});
});

//vertical walls
verticals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}

		const wall = Bodies.rectangle(
			columnIndex * unitLength + unitLength,
			rowIndex * unitLength + unitLength / 2,
			2,
			unitLength,
			{
				isStatic: true
			}
		);
		World.add(world, wall);
	});
});
