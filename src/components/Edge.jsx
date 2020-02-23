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
import './Edge.css'

export class Edge extends Component {
    render() {
        const horizontalEdgeStyle = {
            position: "absolute",
            top: this.props.position.top,
            left: this.props.position.left,
            width: 3*this.props.dimension,
            height: this.props.dimension,
            backgroundColor: "white",
            textAlign: "center"
        }
        const verticalEdgeStyle = {
            position: "absolute",
            top: this.props.position.top,
            left: this.props.position.left,
            width: this.props.dimension,
            height: 3*this.props.dimension,
            backgroundColor: "white",
            textAlign: "center"
        }
        const minVertex = Math.min(this.props.edge.first, this.props.edge.second)
        const maxVertex = Math.max(this.props.edge.first, this.props.edge.second)
        if (Math.abs(this.props.edge.first - this.props.edge.second) === 1) {
            return <div id={`edge-${minVertex}-${maxVertex}`} style={horizontalEdgeStyle}></div>
        } else {
            return <div id={`edge-${minVertex}-${maxVertex}`} style={verticalEdgeStyle}></div>
        }
    }
}

export default Edge
