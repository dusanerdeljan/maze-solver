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

import Queue from '../models/Queue'

export default function bidirectionalSearch(graph, startVertex, endVertex) {
    let edgesExplored = []
    let startVisited = new Array(graph.vertexCount)
    let endVisited = new Array(graph.vertexCount)
    let startParent = new Array(graph.vertexCount)
    let endParent = new Array(graph.vertexCount)
    const startQueue = new Queue()
    const endQueue = new Queue()
    let intersect = -1
    for (let i = 0; i < graph.vertexCount; i++) {
        startVisited[i] = false
        endVisited[i] = false
    }
    startQueue.enqueue(startVertex)
    startVisited[startVertex] = true
    startParent[startVertex] = -1
    endQueue.enqueue(endVertex)
    endVisited[endVertex] = true
    endParent[endVertex] = -1
    while (!startQueue.empty() && !endQueue.empty()) {
        bfsHelper(startQueue, startVisited, startParent, graph, edgesExplored)
        bfsHelper(endQueue, endVisited, endParent, graph, edgesExplored)
        intersect = hasIntersectingNode(startVisited, endVisited)
        if (intersect !== -1) {
            return buildPath(startParent, endParent, startVertex, endVertex, intersect, edgesExplored)
        }
    }
}

function buildPath(startParent, endParent, startVertex, endVertex, intersect, edgesExplored) {
    let path = []
    path.push(intersect)
    let current = intersect
    while (current !== startVertex) {
        path.push(startParent[current])
        current = startParent[current]
    }
    path = path.reverse()
    current = intersect
    while (current !== endVertex) {
        path.push(endParent[current])
        current = endParent[current]
    }
    return {path: path, edgesExplored: edgesExplored}
}

function bfsHelper(queue, visited, parent, graph, edgesExplored) {
    const currentVertex = queue.dequeue()
    const incidentEdges = graph.getIncidentEdges(currentVertex)
    incidentEdges.forEach(edge => {
        if (!visited[edge.second]) {
            edgesExplored.push(edge)
            parent[edge.second] = currentVertex
            visited[edge.second] = true
            queue.enqueue(edge.second)
        }
    });
}

function hasIntersectingNode(startVisited, endVisited) {
    for (let i = 0; i < startVisited.length; i++) {
        if (startVisited[i] && endVisited[i]) return i;
    }
    return -1
}