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

export default class Graph {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.adjacencyMatrix = []
        this.edges = []
        this.vertexCount = this.width * this.height
        this._buildAdjacencyMatrix()
    }

    _buildAdjacencyMatrix() {
        for (let i=0;i<this.vertexCount;i++) {
            this.adjacencyMatrix.push([])
            for (let j=0;j<this.vertexCount;j++) {
                this.adjacencyMatrix[i].push(0)
            }
        }
    }

    edgeExists(first, second) {
        if (first < 0 || first >= this.vertexCount || second < 0 || second >= this.vertexCount) {
            return 0
        } else {
            return this.adjacencyMatrix[first][second]
        }
    }

    getIncidentEdges(vertex) {
        let edges = []
        for (let i = 0; i < this.vertexCount; i++) {
            if (i !== vertex && this.adjacencyMatrix[vertex][i]) {
                edges.push({first: vertex, second: i, weight: this.adjacencyMatrix[vertex][i]})
            }
        }
        return edges
    }

    hasTopNeighbour(vertex) {
        return ((vertex-this.width) >= 0 && this.adjacencyMatrix[vertex][vertex-this.width] !== 0)
    }

    addEdge(firstVertex, secondVertex, weight=1) {
        this.adjacencyMatrix[firstVertex][secondVertex] = weight
        this.adjacencyMatrix[secondVertex][firstVertex] = weight
        this.edges.push({first: firstVertex, second: secondVertex, weight: weight})
    }

    static getRandomEdgeWeight() {
        return 2 + Math.floor(Math.random() * Math.floor(9999))
    }

    static buildGraph(width, height) {
        let g = new Graph(width, height)
        for (let vertex = 0; vertex < g.height*g.width; vertex++) {
            const edgeWeight = this.getRandomEdgeWeight()
            if (vertex === 0) { // top-left
                g.addEdge(vertex, vertex+g.width, edgeWeight)
                g.addEdge(vertex, vertex+1, edgeWeight)
            } else if (vertex === g.width-1) { // top-right
                g.addEdge(vertex, vertex-1, edgeWeight)
                g.addEdge(vertex, vertex+g.width, edgeWeight)
            } else if (vertex === g.height*g.width - g.width) { // bottom-left
                g.addEdge(vertex, vertex+1, edgeWeight)
                g.addEdge(vertex, vertex-g.width, edgeWeight)
            } else if (vertex === g.width*g.height-1) { // bottom-right
                g.addEdge(vertex, vertex-1, edgeWeight)
                g.addEdge(vertex, vertex-g.width, edgeWeight)
            } else if (vertex % g.width === 0) { // left-edge
                g.addEdge(vertex, vertex+g.width, edgeWeight)
                g.addEdge(vertex, vertex-g.width, edgeWeight)
                g.addEdge(vertex, vertex+1, edgeWeight)
            } else if (vertex % g.width + 1 === g.width) { // right-edge
                g.addEdge(vertex, vertex+g.width, edgeWeight)
                g.addEdge(vertex, vertex-g.width, edgeWeight)
                g.addEdge(vertex, vertex-1, edgeWeight)
            } else if (vertex < g.width) { // top-edge
                g.addEdge(vertex, vertex+1, edgeWeight)
                g.addEdge(vertex, vertex-1, edgeWeight)
                g.addEdge(vertex, vertex+g.width, edgeWeight)
            } else if (vertex >= (g.width*g.height)-g.width) { // bottom-edge
                g.addEdge(vertex, vertex+1, edgeWeight)
                g.addEdge(vertex, vertex-1, edgeWeight)
                g.addEdge(vertex, vertex-g.width, edgeWeight)
            } else { // center
                g.addEdge(vertex, vertex+1, edgeWeight)
                g.addEdge(vertex, vertex-1, edgeWeight)
                g.addEdge(vertex, vertex-g.width, edgeWeight)
                g.addEdge(vertex, vertex+g.width, edgeWeight)
            }
        }
        return g
    }
}