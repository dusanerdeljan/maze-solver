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

import Graph from "../models/Graph"

class PQEntry {
    constructor(weight=9999999, vertex=9999999, edge=null) {
        this.weight = weight
        this.vertex = vertex
        this.edge = edge
    }
}

export default function primJarnik(graph) {
    let maze = new Graph(graph.width, graph.height)
    let mst = []
    let treeBounds = new Array(graph.vertexCount)
    let priorityQueue = []
    let entryMap = new Map()
    for (let vertex = 0; vertex < graph.vertexCount; vertex++) {
        treeBounds[vertex] = treeBounds.size === 0 ? 0 : 9999999
        entryMap.set(vertex, new PQEntry(treeBounds[vertex], vertex, null))
        priorityQueue.push(entryMap.get(vertex))
    }
    priorityQueue.sort((a, b) => b.weight - a.weight)
    while (priorityQueue.length !== 0) {
        const minElement = priorityQueue.pop()
        if (minElement.edge !== null) {
            maze.addEdge(minElement.edge.first, minElement.edge.second)
            mst.push(minElement.edge)
        }
        const incidentEdges = graph.getIncidentEdges(minElement.vertex)
        incidentEdges.forEach(edge => {
            if (entryMap.has(edge.second) && edge.weight < treeBounds[edge.second]) {
                treeBounds[edge.second] = edge.weight
                entryMap.get(edge.second).weight = edge.weight
                entryMap.get(edge.second).edge = edge
                priorityQueue.sort((a, b) => b.weight - a.weight)
            }
        });
        entryMap.delete(minElement.vertex)
    }
    return {mst: mst, maze: maze}
}