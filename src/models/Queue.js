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

export default class Queue {
    constructor() {
        this.queue = []
    }

    empty() {
        return (this.queue.length === 0)
    }

    enqueue(item) {
        this.queue.push(item)
    }

    dequeue() {
        return this.queue.shift()
    }
}