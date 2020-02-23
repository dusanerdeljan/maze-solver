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
import './Node.css'

export class Node extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {type, dimension, position} = this.props

        const nodeStyle = {
            position: "absolute", 
            top: position.top, 
            left: position.left,
            width: dimension, 
            height: dimension,
            backgroundColor : type === "start" ? "#139b08" : "#e3110d",
            zIndex: 650
        }

        return (
            <div style={nodeStyle}></div>
        )
    }
}

export default Node
