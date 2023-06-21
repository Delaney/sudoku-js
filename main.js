class Board {
    constructor(string) {
        this.rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        this.columns = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this.places = this.cross(this.rows, this.columns);
        this.boxes = this.places.reduce((a, b) => {
            a[b] = '';
            return a;
        }, {});

        this.rowUnits = this.rows.map(r => {
            const unit = [];
            this.columns.forEach(c => {
                unit.push(this.joinString([r, c]));
            });
            return unit;
        });

        this.columnUnits = this.columns.map(c => {
            const unit = [];
            this.rows.forEach(r => {
                unit.push(this.joinString([r, c]));
            });
            return unit;
        });

        this.squareUnits = [['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']].map(t1 => {
            return [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']].map(t2 => {
                const unit = [];
                for (let x = 0; x < 3; x++) {
                    for (let y = 0; y < 3; y++) {
                        unit.push(this.joinString(t1[x], t2[y]));
                    }
                }
                return unit;
            });
        }).flat();

        this.setBoard(string);

        // console.log(this.rows);
        // console.log(squareUnits);
        // console.log(columnUnits);
    }

    solveBoard() {
        for (const key in this.boxes) {
            if (this.boxes[key] === '.') this.boxes[key] = this.columns.join('');
        }

        let tries = 0;

        while (tries < 100 || Object.values(this.boxes).filter(o => o.length > 1).length) {
            // Eliminate
            this.places.forEach(o => {
                this.eliminate(o);
            });

            // Only Choice
            this.places.forEach(o => {
                this.onlyChoice(o);
            });
            tries++;
        }


        this.printBoard();
        console.log("Solved in " + tries + " tries");
    }

    getPeers(box) {
        const peers = new Set();
        const r = box.charAt(0);
        const c = box.charAt(1);

        this.places.filter(o => o.includes(r) || o.includes(c))
            .forEach(o => {
                peers.add(o);
            });

        this.squareUnits.find(o => o.includes(box))
            .forEach(o => {
                peers.add(o);
            });

        peers.delete(box);

        return peers;
    }

    eliminate(box) {
        let str = this.boxes[box];
        if (str.length === 1) return;
        this.getPeers(box).forEach(o => {
            if (this.boxes[o].length === 1) {
                str = str.split(this.boxes[o]).join('');
            }
        });
        this.boxes[box] = str;
    }

    onlyChoice(box) {
        let str = this.boxes[box];
        if (str.length === 1) return;
        const square = this.squareUnits.find(o => o.includes(box))
            .filter(o => o !== box);
        const squareValues = square.reduce((a, b) => {
            a[b] = this.boxes[b];
            return a;
        }, {});

        str.split('').some(o => {
            let only = Object.values(squareValues).filter(p => p.includes(o));
            if (!only.length) {
                this.boxes[box] = o;
                return true;
            }
        });
    }

    printBoard() {
        let board = '';

        let y = 0;
        this.rows.forEach(r => {
            let x = 0;
            this.columns.forEach(c => {
                board += this.boxes[this.joinString(r, c)];
                x++;
                if (x < 9) board += ' ';
                if (x == 3 || x == 6) {
                    board += '|'
                }
                if (x == 9) board += '\n';
            });
            y++;
            if (y == 3 || y == 6) {
                board += '--------------------\n';
            }
        });

        console.log(board);
    }

    setBoard(numbers) {
        const board = {};
        Object.keys(this.boxes).forEach((box, i) => {
            this.boxes[box] = numbers.charAt(i);
        });
    }

    cross(a, b) {
        let crossed = [];
        a.forEach(aI => {
            b.forEach(bI => {
                crossed.push(this.joinString(aI, bI));
            });
        });
        return crossed;
    }

    joinString(...arr) {
        return arr.reduce((a, b) => a + '' + b, '');
    }
}


const b1 = new Board('..3.2.6..9..3.5..1..18.64....81.29..7.......8..67.82....26.95..8..2.3..9..5.1.3..');
b1.solveBoard();

const b2 = new Board('4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......');
b2.solveBoard();
