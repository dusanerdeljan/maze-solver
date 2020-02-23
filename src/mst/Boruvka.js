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

export default function boruvka(graph) {
    let partition = new Partition(graph.vertexCount)
    let maze = new Graph(graph.width, graph.height)
    let mst = []
    let treeCount = graph.vertexCount
    let cheapest = new Array(graph.vertexCount)
    while (treeCount > 1) {
        for (let i = 0; i < graph.vertexCount; i++) cheapest[i] = -1
        for (let i = 0; i < graph.edges.length; i++) {
            const edge = graph.edges[i]
            if (!partition.doesMakeCycle(edge)) {
                const firstRoot = partition.find(edge.first)
                const secondRoot = partition.find(edge.second)
                if (cheapest[firstRoot] === -1 || graph.edges[cheapest[firstRoot]].weight > edge.weight)
                    cheapest[firstRoot] = i
                if (cheapest[secondRoot] === -1 || graph.edges[cheapest[secondRoot]].weight > edge.weight)
                    cheapest[secondRoot] = i
            }
        }
        for (let vertex = 0; vertex < graph.vertexCount; vertex++) {
            if (cheapest[vertex] !== -1) {
                if (!partition.doesMakeCycle(graph.edges[cheapest[vertex]])) {
                    maze.addEdge(graph.edges[cheapest[vertex]].first, graph.edges[cheapest[vertex]].second)
                    mst.push(graph.edges[cheapest[vertex]])
                    partition.addEdge(graph.edges[cheapest[vertex]])
                    treeCount--
                }
            }
        }
    }
    return {mst: mst, maze: maze}
}