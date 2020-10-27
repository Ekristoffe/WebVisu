import * as React from 'react';
import { IBasicShape } from '../../../../Interfaces/javainterfaces';
import { createVisuObject } from '../../../Objectmanagement/objectManager';
import { useObserver, useLocalStore } from 'mobx-react-lite';
import { coordArrayToBezierString } from '../../../Utils/utilfunctions';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
    polyShape: IBasicShape;
    textField: JSX.Element | undefined;
    inputField: JSX.Element;
    dynamicParameters: Map<string, string[][]>;
    onmousedown: Function;
    onmouseup: Function;
    onclick: Function;
};

export const Bezier: React.FunctionComponent<Props> = ({
    polyShape,
    textField,
    inputField,
    dynamicParameters,
    onclick,
    onmousedown,
    onmouseup,
}) => {
    // Convert object to an observable one
    const state = useLocalStore(() =>
        createVisuObject(polyShape, dynamicParameters),
    );

    return useObserver(() => (
        <div
            style={{
                transform: state.cssTransform,
                transformOrigin: state.cssTransformOrigin,
                cursor: 'auto',
                pointerEvents: state.eventType,
                visibility: state.display,
                position: 'absolute',
                left: state.transformedCornerCoord.x1 - state.edge,
                top: state.transformedCornerCoord.y1 - state.edge,
                width: state.relCoord.width + 2 * state.edge,
                height: state.relCoord.height + 2 * state.edge,
            }}
        >
            <ErrorBoundary fallback={<div>Oh no</div>}>
                {inputField}
                <svg
                    style={{ float: 'left' }}
                    width={state.relCoord.width + 2 * state.edge}
                    height={state.relCoord.height + 2 * state.edge}
                    overflow="visible"
                >
                    <svg
                        onClick={
                            onclick === undefined || onclick === null
                                ? null
                                : () => onclick()
                        }
                        onMouseDown={
                            onmousedown === undefined ||
                            onmousedown === null
                                ? null
                                : () => onmousedown()
                        }
                        onMouseUp={
                            onmouseup === undefined ||
                            onmouseup === null
                                ? null
                                : () => onmouseup()
                        }
                        onMouseLeave={
                            onmouseup === undefined ||
                            onmouseup === null
                                ? null
                                : () => onmouseup()
                        } // We have to reset if somebody leaves the object with pressed key
                        strokeDasharray={state.strokeDashArray}
                        overflow="visible"
                    >
                        <path
                            d={coordArrayToBezierString(
                                state.relPoints,
                            )}
                            fill={state.fill}
                            strokeWidth={state.strokeWidth}
                            stroke={state.stroke}
                            transform={state.transform}
                        />
                        <title>{state.tooltip}</title>
                    </svg>
                    {textField === undefined ||
                    textField === null ? null : (
                        <svg
                            width={
                                state.relCoord.width + 2 * state.edge
                            }
                            height={
                                state.relCoord.height + 2 * state.edge
                            }
                            overflow="visible"
                        >
                            {textField}
                        </svg>
                    )}
                </svg>
            </ErrorBoundary>
        </div>
    ));
};
