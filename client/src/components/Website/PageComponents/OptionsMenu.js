import React from 'react'

import {FaArrowUp,FaArrowDown} from 'react-icons/fa'
import {RiDeleteBin6Fill} from 'react-icons/ri'

import ComponentDAO from '../../../DAOs/ComponentDAO';
import ComponentDTO from '../../../DTOs/ComponentDTO';

const OptionsMenu = ({ 
    destroy = true,
    up = true,
    down = true,
    component,
    className
}) => {
    if (!component) {
        return null;
    }

    var buttons = [];
    destroy && buttons.push(
        <button
            className="btn btn-primary btn-sm m-1"
            onClick={() => ComponentDAO.delete(component._id).then((result => result))}
        >
            <RiDeleteBin6Fill/>
        </button>
    )
    up && buttons.push(
        <button
            className="btn btn-primary btn-sm m-1"
            onClick={() => {}}
        >
            <FaArrowUp/>
        </button>
    );
    down && buttons.push(
        <button
            className="btn btn-primary btn-sm m-1"
            onClick={() => {}}
        >
            <FaArrowDown/>
        </button>
    );

    return (
        <div className={`shadow-sm p-3 bg-white rounded ${className}`}>
            {buttons}
        </div>
    )
}

export default OptionsMenu;