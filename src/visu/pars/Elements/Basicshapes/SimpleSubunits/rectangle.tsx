import * as React from 'react';
import { IBasicShape } from '../../../../Interfaces/interfaces';
import {createVisuObject} from '../../../Objectmanagement/objectManager'
import {useObserver, useLocalStore } from 'mobx-react-lite';
import ErrorBoundary from 'react-error-boundary';

type Props = {
    simpleShape: IBasicShape,
    textField : JSX.Element,
    input : JSX.Element,
    dynamicParameters :  Map<string,string[][]>,
    onmousedown : Function,
    onmouseup : Function,
    onclick : Function 
}

export const Rectangle :React.FunctionComponent<Props> = React.memo(({simpleShape, textField, input, dynamicParameters, onclick, onmousedown, onmouseup})=>
{ 
    // Convert object to an observable one
    const state  = useLocalStore(()=>createVisuObject(simpleShape, dynamicParameters));
    
    return useObserver(()=>
        <div style={{cursor: "auto", overflow:"hidden", pointerEvents: state.eventType, visibility : state.display, position:"absolute", left:state.transformedCornerCoord.x1-state.edge, top:state.transformedCornerCoord.y1-state.edge, width:state.relCoord.width+2*state.edge, height:state.relCoord.height+2*state.edge}}>
            <ErrorBoundary>
                {input}
                <svg style={{float: "left"}} width={state.relCoord.width+2*state.edge} height={state.relCoord.height+2*state.edge} >
                    <svg 
                        onClick={onclick == null ? null : ()=>onclick()} 
                        onMouseDown={onmousedown == null ? null : ()=>onmousedown()} 
                        onMouseUp={onmouseup == null ? null : ()=>onmouseup()}
                        onMouseLeave={onmouseup == null ? null : ()=>onmouseup()}  // We have to reset if somebody leaves the object with pressed key
                        width={state.relCoord.width+2*state.edge} 
                        height={state.relCoord.height+2*state.edge} 
                        strokeDasharray={state.strokeDashArray}>   
                        <rect
                            width={state.relCoord.width}
                            height={state.relCoord.height}
                            x={state.edge}
                            y={state.edge}
                            fill={state.fill}
                            stroke={state.stroke}
                            strokeWidth={state.strokeWidth}
                            >
                            <title>{state.tooltip}</title>
                        </rect>
                        {textField == null ? null :
                        <svg>
                            {textField}
                        </svg>
                    }
                    </svg>
                </svg>
            </ErrorBoundary>
        </div>
        )
})

