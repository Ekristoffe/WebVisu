import * as React from 'react';
import { IBasicShape } from '../../../Interfaces/interfaces';
import {createVisuObject} from '../Features/objectManager'
import {useObserver, useLocalStore } from 'mobx-react-lite';

type Props = {
    simpleShape: IBasicShape,
    textField : JSX.Element|undefined,
    input : JSX.Element,
    dynamicParameters : Map<string, string>,
    onmousedown : Function,
    onmouseup : Function,
    onclick : Function 
}

export const Line :React.FunctionComponent<Props> = ({simpleShape, textField, input, dynamicParameters, onclick, onmousedown, onmouseup})=>
{ 
    // Attach the dynamic paramters like color variable
    let initial = createVisuObject(simpleShape, dynamicParameters)
        
    // Convert object to an observable one
    const state  = useLocalStore(()=>initial);

    return useObserver(()=>
    <div id={simpleShape.elem_id} style={{cursor: "auto",overflow:"hidden", pointerEvents: state.eventType, visibility : state.display, position:"absolute", left:state.transformedCornerCoord.x1-state.edge, top:state.transformedCornerCoord.y1-state.edge, width:state.relCoord.width+state.edge, height:state.relCoord.height+state.edge}}>
        {input}
        <svg>
            <svg
                onClick={()=>onclick()} 
                onMouseDown={()=>onmousedown()} 
                onMouseUp={()=>onmouseup()}
                onMouseLeave={()=>onmouseup()}  // We have to reset if somebody leaves the object with pressed key
                width={state.relCoord.width} 
                height={state.relCoord.height}>
                <line
                    x2={0}
                    y1={0}
                    x1={state.relCoord.width}
                    y2={state.relCoord.height}
                    stroke={state.stroke}
                    strokeWidth={state.strokeWidth}
                    strokeDasharray={state.strokeDashArray}>
                    <title>{state.tooltip}</title>
                </line>
                <svg>
                    {textField}
                </svg>
            </svg>
        </svg>
    </div>
    )
}