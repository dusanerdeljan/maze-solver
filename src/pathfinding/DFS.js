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

import Stack from '../models/Stack'

export default function dfs(graph, startVertex, endVertex) {
    let vertexStack = new Stack()
    let path = []
    let edgesExplored = []
    let visitedVertices = new Set()
    vertexStack.push(startVertex)
    let parentMap = new Array(graph.vertexCount)
    while (!vertexStack.empty()) {
        const currentVertex = vertexStack.pop()
        if (currentVertex === endVertex) break
        visitedVertices.add(currentVertex)
        const incidentEdges = graph.getIncidentEdges(currentVertex)
        incidentEdges.forEach(edge => {
            edgesExplored.push(edge)
            if (!visitedVertices.has(edge.second)) {
                visitedVertices.add(edge.second)
                vertexStack.push(edge.second)
                parentMap[edge.second] = currentVertex
            }
        });
    }
    let current = endVertex
    while (current !== startVertex) {
        path.push(current)
        current = parentMap[current]
    }
    path.push(startVertex)
    return {path: path.reverse(), edgesExplored: edgesExplored}
}