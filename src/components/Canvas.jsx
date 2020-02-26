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

import React, { Component } from 'react'
import Graph from '../models/Graph'
import Node from './Node.jsx'
import Edge from './Edge.jsx'
import kruskal from '../mst/Kruskal'
import './Canvas.css'
import dfs from '../pathfinding/DFS'
import boruvka from '../mst/Boruvka'
import primJarnik from '../mst/PrimJarnik'
import bfs from '../pathfinding/BFS'
import dijkstra from '../pathfinding/Dijkstra'
import astar from '../pathfinding/AStar'
import bidirectionalSearch from '../pathfinding/BidirectionalSearch'

export class Canvas extends Component {
    constructor(props) {
        super(props)
        this.width = 50
        this.height = 25
        this.graph = null
        this.maze = null
        this.mazeGenerationFunctions = new Map()
        this.mazeGenerationFunctions.set("kruskal", kruskal)
        this.mazeGenerationFunctions.set("prim-jarnik", primJarnik)
        this.mazeGenerationFunctions.set("boruvka", boruvka)
        this.mazeSolvingFunctions = new Map()
        this.mazeGenerationFunctions.set("dfs", dfs)
        this.mazeGenerationFunctions.set("bfs", bfs)
        this.mazeGenerationFunctions.set("dijkstra", dijkstra)
        this.mazeGenerationFunctions.set("astar", astar)
        this.mazeGenerationFunctions.set("bidirectionalSearch", bidirectionalSearch)
        this.startPosX = 0.1 * window.innerWidth
        this.startPosY = 0.15 * window.innerHeight
        this.generatedMaze = false
        this.state = {
            mstEdges: [],
            startVertex: -1,
            endVertex: -1,
            nodeDimensions: 0.8 * window.innerWidth / (2*this.width-1),
            errorMessage: ""
        }
        this.generateMaze = this.generateMaze.bind(this)
        this.solveMaze = this.solveMaze.bind(this)
        this.mazeClickHandler = this.mazeClickHandler.bind(this)
        this.mazeSizeChanged = this.mazeSizeChanged.bind(this)
        this.updateNodeDimensions = this.updateNodeDimensions.bind(this)
    }

    updateNodeDimensions() {
        const silderRect = this._sizeSlider.getBoundingClientRect()
        this.startPosX = 0.1 * window.innerWidth
        this.startPosY = Math.max(0.15 * window.innerHeight, 80 + (silderRect.top + silderRect.height))
        this.setState(prevState => ({
            ...prevState,
            nodeDimensions: 0.8 * window.innerWidth / (2*this.width-1)
        }))
    }

    componentDidMount() {
        this.initState()
        window.addEventListener('resize', this.updateNodeDimensions)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateNodeDimensions)
    }

    generateMaze() {
        this.graph = Graph.buildGraph(this.width, this.height)
        this._generateButton.disabled = true
        this._solveButton.disabled = true
        this._sizeSlider.disabled = true
        this.generatedMaze = false
        this.setState(prevState => ({
            mstEdges: [],
            startVertex: -1,
            endVertex: -1,
            errorMessage: ""
        }))
        const {mst, maze} = this.mazeGenerationFunctions.get(this._generationSelect.value)(this.graph)
        this.maze = maze
        for (let i = 0; i < mst.length; i++) {
            setTimeout(() => {
                this.setState(prevState => ({
                    ...prevState, 
                    mstEdges: mst.slice(0, i+1)
                }))
            }, i*5);
        }
        setTimeout(() => {
            this.generatedMaze = true
            this._generateButton.disabled = false
            this._solveButton.disabled = false
            this._sizeSlider.disabled = false
            this.setState(prevState=> ({
                ...prevState,
                startVertex: 0,
                endVertex: this.maze.vertexCount-1
            }))
        }, mst.length*5);
    }

    displayPath(path) {
        for (let i = 1; i < path.length; i++) {
            setTimeout(() => {
                const edge = {first: path[i], second: path[i-1]}
                const minVertex = Math.min(edge.first, edge.second)
                const maxVertex = Math.max(edge.first, edge.second)
                let edgeStyle = document.getElementById(`edge-${minVertex}-${maxVertex}`).style
                edgeStyle.backgroundColor = "#4fb813"
                edgeStyle.zIndex = 600
                edgeStyle.animation = "path"
                edgeStyle.animationDuration = "0.5s"

            }, i*50);
        }
        setTimeout(() => {
            this._generateButton.disabled = false
            this._solveButton.disabled = false
            this._sizeSlider.disabled = false
            this.maze = null
        }, path.length*50);
    }

    checkStartEndVertex() {
        if (this.maze == null) return false
        if (this.state.startVertex === -1) {
            this.setState(prevState => ({
                ...prevState,
                errorMessage: "Start vertex is not set. Click on the desired location on the board to set start vertex."
            }))
            return false
        }
        if (this.state.endVertex === -1) {
            this.setState(prevState => ({
                ...prevState,
                errorMessage: "End vertex is not set. Shift+Click on the desired location on the board to set end vertex."
            }))
            return false
        }
        return true
    }

    solveMaze() {
        if (!this.checkStartEndVertex())
            return
        this._generateButton.disabled = true
        this._solveButton.disabled = true
        this.generatedMaze = false
        this._sizeSlider.disabled = true
        const {path, edgesExplored} = this.mazeGenerationFunctions.get(this._solvingSelect.value)(this.maze, this.state.startVertex, this.state.endVertex)
        this.setState(prevState => ({
            ...prevState,
            errorMessage: ""
        }))
        for (let i = 0; i <= edgesExplored.length; i++) {
            if (i === edgesExplored.length) {
                setTimeout(() => {
                    this.displayPath(path)
                }, i*20);
            } else {
                setTimeout(() => {
                    const edge = edgesExplored[i]
                    const minVertex = Math.min(edge.first, edge.second)
                    const maxVertex = Math.max(edge.first, edge.second)
                    let edgeStyle = document.getElementById(`edge-${minVertex}-${maxVertex}`).style
                    edgeStyle.backgroundColor = "#df6f3f"
                    edgeStyle.zIndex = 500
                    edgeStyle.animation = "solving"
                    edgeStyle.animationDuration = "0.5s"
                }, i*20);
            }
        }
    }

    initState() {
        const silderRect = this._sizeSlider.getBoundingClientRect()
        this.startPosX = 0.1 * window.innerWidth
        this.startPosY = Math.max(0.15 * window.innerHeight, 80 + (silderRect.top + silderRect.height))
        this.graph = Graph.buildGraph(this.width, this.height)
        const {mst, maze} = kruskal(this.graph)
        this.maze = maze
        this.setState({
            mstEdges: mst,
            startVertex: 0,
            endVertex: maze.vertexCount-1,
            errorMessage: ""
        })
        this.generatedMaze = true
    }

    mazeSizeChanged(event) {
        const testWidth = parseInt(this._sizeSlider.value)
        if (testWidth === this.width) return
        this.width = testWidth
        this.height = Math.floor(this.width / 2)
        this.setState(prevState => ({
            mstEdges: [],
            startVertex: -1,
            endVertex: -1,
            errorMessage: "",
            nodeDimensions: 0.8 * window.innerWidth / (2*this.width-1)
        }), () => this.initState())
    }

    mazeClickHandler(event) {
        if (!this.generatedMaze || !(event.nativeEvent.target)) return
        const nodeDimensions = 0.8 * window.innerWidth / (2*this.width-1)
        const column = Math.floor((event.nativeEvent.x - this.startPosX)/nodeDimensions)
        const row = Math.floor((event.nativeEvent.y - this.startPosY)/nodeDimensions)
        if (column % 2 === 1 || row % 2 === 1) return
        const vertexRow = Math.floor((row+1)/2)
        const vertexColumn = Math.floor((column+1)/2)
        const vertex = vertexRow*this.width + vertexColumn
        if (event.shiftKey && this.state.startVertex !== vertex) {
            this.setState(prevState => ({
                mstEdges: prevState.mstEdges,
                startVertex: prevState.startVertex,
                endVertex: prevState.endVertex === vertex ? -1 : vertex
            }))
        } else if (this.state.endVertex !== vertex) {
            this.setState(prevState => ({
                mstEdges: prevState.mstEdges,
                startVertex: prevState.startVertex === vertex ? -1 : vertex,
                endVertex: prevState.endVertex
            }))
        }
    }

    render() {
        const nodeDimensions = this.state.nodeDimensions
        const edges = this.state.mstEdges.map((edge, index) => {
            const minVertex = Math.min(edge.first, edge.second)
            const pos = {
                top: this.startPosY + 2*(Math.floor(minVertex / this.width)) * nodeDimensions, 
                left: this.startPosX + 2*(minVertex % this.width) * nodeDimensions
            }
            return <div key={index}><Edge edge={edge} position={pos} dimension={nodeDimensions}/></div>
        })
        const nodes = []
        if (this.state.startVertex !== -1) {
            const pos = {
                top: this.startPosY + 2*(Math.floor(this.state.startVertex / this.width)) * nodeDimensions, 
                left: this.startPosX + 2*(this.state.startVertex % this.width) * nodeDimensions
            }
            nodes.push(<div key={this.state.mstEdges.length}><Node type="start" position={pos} dimension={nodeDimensions} /></div>)
        }
        if (this.state.endVertex !== -1) {
            const pos = {
                top: this.startPosY + 2*(Math.floor(this.state.endVertex / this.width)) * nodeDimensions, 
                left: this.startPosX + 2*(this.state.endVertex % this.width) * nodeDimensions
            }
            nodes.push(<div key={this.state.mstEdges.length+1}><Node type="end" position={pos} dimension={nodeDimensions} /></div>)
        }
        return (
            <div>
                <div className="options">
                    <label htmlFor="mst" style={{color: "white"}}>Select maze generation algorithm: </label>
                    <select id="mst" ref={ref => {this._generationSelect = ref}}>
                        <option value="kruskal">Kruskal</option>
                        <option value="prim-jarnik">Prim-Jarnik</option>
                        <option value="boruvka">Boruvka</option>
                    </select>
                    <button onClick={this.generateMaze} ref={ref => {this._generateButton = ref}}>
                        Generate maze
                    </button>
                    <label htmlFor="solver" style={{color: "white"}}>Select maze solving algorithm: </label>
                    <select id="solver" ref={ref => {this._solvingSelect = ref}}>
                        <option value="dfs">DFS</option>
                        <option value="bfs">BFS</option>
                        <option value="dijkstra">Dijkstra</option>
                        <option value="astar">A*</option>
                        <option value="bidirectionalSearch">Bidirectional search</option>
                    </select>
                    <button onClick={this.solveMaze} ref={ref => {this._solveButton = ref}}>
                        Solve maze
                    </button>
                    <label htmlFor="size-slider" style={{color: "white"}}>Select maze size: </label>
                    <input id="size-slider" className="slider" type="range" min={20} max={100} step={2} onChange={this.mazeSizeChanged} ref={ref => {this._sizeSlider = ref}}></input>
                </div>
                <div className="error">
                    {this.state.errorMessage}
                </div>
                <div className="canvas" onClick={this.mazeClickHandler}>
                    {edges}
                    {nodes}
                </div>
            </div>
        )
    }
}

export default Canvas
