/*
Maze generation and solving using graph algorithms
Copyright (C) 2020 Dušan Erdeljan

This file is part of maze-solver

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

export default class Partition {
    constructor(vertexCount) {
        this.positions = new Array(vertexCount)
        for (let i = 0; i < this.positions.length; i++) {
            this.positions[i] = {parent: i, size: 1}
        }
    }

    find(vertex) {
        if (this.positions[vertex].parent !== vertex)
            this.positions[vertex].parent = this.find(this.positions[vertex].parent)
        return this.positions[vertex].parent
    }

    union(x, y) {
        const xRoot = this.find(x)
        const yRoot = this.find(y)
        if (this.positions[xRoot].size < this.positions[yRoot].size)
		    this.positions[xRoot].parent = yRoot;
	    else if (this.positions[xRoot].size > this.positions[yRoot].size)
		    this.positions[yRoot].parent = xRoot;
        else
        {
            this.positions[yRoot].parent = xRoot;
            this.positions[xRoot].size++;
        }
    }

    doesMakeCycle(edge) {
        return (this.find(edge.first) === this.find(edge.second))
    }

    addEdge(edge) {
        this.union(this.find(edge.first), this.find(edge.second))
    }
}