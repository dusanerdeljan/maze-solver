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

import Partition from './Partition'
import Graph from '../models/Graph'

export default function kruskal(graph) {
    const edges = [...graph.edges].sort((a, b) => a.weight - b.weight)
    let mst = []
    let maze = new Graph(graph.width, graph.height)
    const vertexCount = graph.width * graph.height
    let partition = new Partition(vertexCount)
    let i = 0
    while (mst.length < vertexCount-1 && i < graph.edges.length) {
        const edge = edges[i]
        if (!partition.doesMakeCycle(edge)) {
            mst.push(edge)
            partition.addEdge(edge)
            maze.addEdge(edge.first, edge.second)
        }
        i++
    }
    return {mst: mst, maze: maze}
}