import * as React from "react";
import { IBasicShape } from "../../../../Interfaces/javainterfaces";
import { createVisuObject } from "../../../Objectmanagement/objectManager";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  simpleShape: IBasicShape;
  textField: JSX.Element | undefined;
  input: JSX.Element;
  dynamicParameters: Map<string, string[][]>;
  onmousedown: Function;
  onmouseup: Function;
  onclick: Function;
};

export const Circle: React.FunctionComponent<Props> = React.memo(
  ({
    simpleShape,
    textField,
    input,
    dynamicParameters,
    onclick,
    onmousedown,
    onmouseup,
  }) => {
    // Convert object to an observable one
    const state = useLocalStore(() =>
      createVisuObject(simpleShape, dynamicParameters)
    );

    return useObserver(() => (
      <div
        style={{
          cursor: "auto",
          overflow: "hidden",
          pointerEvents: state.eventType,
          visibility: state.display,
          position: "absolute",
          left: state.transformedCornerCoord.x1 - state.edge,
          top: state.transformedCornerCoord.y1 - state.edge,
          width: state.relCoord.width + 2 * state.edge,
          height: state.relCoord.height + 2 * state.edge,
        }}
      >
        {state.readAccess ? (
          <ErrorBoundary fallback={<div>Oh no</div>}>
            {input}
            <svg
              style={{ float: "left" }}
              width={state.relCoord.width + 2 * state.edge}
              height={state.relCoord.height + 2 * state.edge}
            >
              <svg
                onClick={
                  onclick == null
                    ? null
                    : state.writeAccess
                    ? () => onclick()
                    : null
                }
                onMouseDown={
                  onmousedown == null
                    ? null
                    : state.writeAccess
                    ? () => onmousedown()
                    : null
                }
                onMouseUp={
                  onmouseup == null
                    ? null
                    : state.writeAccess
                    ? () => onmouseup()
                    : null
                }
                onMouseLeave={
                  onmouseup == null
                    ? null
                    : state.writeAccess
                    ? () => onmouseup()
                    : null
                } // We have to reset if somebody leaves the object with pressed key
                width={state.relCoord.width + 2 * state.edge}
                height={state.relCoord.height + 2 * state.edge}
                strokeDasharray={state.strokeDashArray}
              >
                <ellipse
                  stroke={state.stroke}
                  cx={state.relMidpointCoord.x + state.edge}
                  cy={state.relMidpointCoord.y + state.edge}
                  rx={state.relMidpointCoord.x}
                  ry={state.relMidpointCoord.y}
                  fill={state.fill}
                  strokeWidth={state.strokeWidth}
                >
                  <title>{state.tooltip}</title>
                </ellipse>
                {textField == null ? null : <svg>{textField}</svg>}
              </svg>
            </svg>
          </ErrorBoundary>
        ) : null}
      </div>
    ));
  }
);
