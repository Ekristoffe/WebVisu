import * as React from 'react';
import { IBasicShape } from '../../../../Interfaces/javainterfaces';
import { createVisuObject } from '../../../Objectmanagement/objectManager';
import { useObserver, useLocalStore } from 'mobx-react-lite';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
    simpleShape: IBasicShape;
    textField: JSX.Element | undefined;
    inputField: JSX.Element;
    dynamicParameters: Map<string, string[][]>;
    onmousedown: Function;
    onmouseup: Function;
    onclick: Function;
};

export const Line: React.FunctionComponent<Props> = React.memo(
    ({
        simpleShape,
        textField,
        inputField,
        dynamicParameters,
        onclick,
        onmousedown,
        onmouseup,
    }) => {
        // Convert object to an observable one
        const state = useLocalStore(() =>
            createVisuObject(simpleShape, dynamicParameters),
        );

        return useObserver(() => (
            <div
                style={{
                    cursor: 'auto',
                    overflow: 'hidden',
                    pointerEvents: state.eventType,
                    visibility: state.display,
                    position: 'absolute',
                    left:
                        (state.transformedCornerCoord.x1 >
                        state.transformedCornerCoord.x2
                            ? state.transformedCornerCoord.x2
                            : state.transformedCornerCoord.x1) -
                        state.edge,
                    top:
                        (state.transformedCornerCoord.y1 >
                        state.transformedCornerCoord.y2
                            ? state.transformedCornerCoord.y2
                            : state.transformedCornerCoord.y1) -
                        state.edge,
                    width: state.relCoord.width + state.edge,
                    height: state.relCoord.height + state.edge,
                }}
            >
                {state.readAccess ? (
                    <ErrorBoundary fallback={<div>Oh no</div>}>
                        {inputField}
                        <svg
                            style={{ float: 'left' }}
                            width={
                                state.relCoord.width + 2 * state.edge
                            }
                            height={
                                state.relCoord.height + 2 * state.edge
                            }
                        >
                            <svg
                                onClick={
                                    onclick === undefined ||
                                    onclick === null
                                        ? null
                                        : state.writeAccess
                                        ? () => onclick()
                                        : null
                                }
                                onMouseDown={
                                    onmousedown === undefined ||
                                    onmousedown === null
                                        ? null
                                        : state.writeAccess
                                        ? () => onmousedown()
                                        : null
                                }
                                onMouseUp={
                                    onmouseup === undefined ||
                                    onmouseup === null
                                        ? null
                                        : state.writeAccess
                                        ? () => onmouseup()
                                        : null
                                }
                                onMouseLeave={
                                    onmouseup === undefined ||
                                    onmouseup === null
                                        ? null
                                        : state.writeAccess
                                        ? () => onmouseup()
                                        : null
                                } // We have to reset if somebody leaves the object with pressed key
                                width={
                                    state.relCoord.width +
                                    state.strokeWidth
                                }
                                height={
                                    state.relCoord.height +
                                    state.strokeWidth
                                }
                            >
                                <line
                                    x2={
                                        state.transformedCornerCoord
                                            .x1 >
                                        state.transformedCornerCoord
                                            .x2
                                            ? Math.min(
                                                  1,
                                                  state.strokeWidth /
                                                      2,
                                              )
                                            : state.relCoord.width +
                                              Math.min(
                                                  1,
                                                  state.strokeWidth /
                                                      2,
                                              )
                                    }
                                    y1={
                                        state.transformedCornerCoord
                                            .y1 >
                                        state.transformedCornerCoord
                                            .y2
                                            ? Math.min(
                                                  1,
                                                  state.strokeWidth /
                                                      2,
                                              )
                                            : state.relCoord.height +
                                              Math.min(
                                                  1,
                                                  state.strokeWidth /
                                                      2,
                                              )
                                    }
                                    x1={
                                        state.transformedCornerCoord
                                            .x1 >
                                        state.transformedCornerCoord
                                            .x2
                                            ? state.relCoord.width +
                                              Math.min(
                                                  1,
                                                  state.strokeWidth /
                                                      2,
                                              )
                                            : Math.min(
                                                  1,
                                                  state.strokeWidth /
                                                      2,
                                              )
                                    }
                                    y2={
                                        state.transformedCornerCoord
                                            .y1 >
                                        state.transformedCornerCoord
                                            .y2
                                            ? state.relCoord.height +
                                              Math.min(
                                                  1,
                                                  state.strokeWidth /
                                                      2,
                                              )
                                            : Math.min(
                                                  1,
                                                  state.strokeWidth /
                                                      2,
                                              )
                                    }
                                    stroke={state.stroke}
                                    strokeWidth={state.strokeWidth}
                                    strokeDasharray={
                                        state.strokeDashArray
                                    }
                                >
                                    <title>{state.tooltip}</title>
                                </line>
                                {textField === undefined ||
                                textField === null ? null : (
                                    <svg
                                        width={state.relCoord.width}
                                        height={state.relCoord.height}
                                        x={state.edge}
                                        y={state.edge}
                                    >
                                        {textField}
                                    </svg>
                                )}
                            </svg>
                        </svg>
                    </ErrorBoundary>
                ) : null}
            </div>
        ));
    },
);
