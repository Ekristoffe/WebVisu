import * as React from 'react';
import { HorizontalScrollbar } from './horizontal';
import { VerticalScrollbar } from './vertical';
import { IScrollbarShape } from '../../../Interfaces/javainterfaces';
import * as util from '../../Utils/utilfunctions';
import {
    parseDynamicShapeParameters,
    parseScrollUpdate,
} from '../Features/Events/eventManager';

type Props = {
    section: Element;
};

export const Scrollbar: React.FunctionComponent<Props> = ({
    section,
}) => {
    const rect = util.stringToArray(
        section.getElementsByTagName('rect')[0].innerHTML,
    );
    const horzPosition: boolean =
        rect[1] - rect[0] > rect[3] - rect[2] ? true : false;
    // Parsing of the fixed parameters
    const scrollbar: IScrollbarShape = {
        shape: 'scrollbar',
        rect: rect,
        horzPosition: horzPosition,
        tooltip:
            section.getElementsByTagName('tooltip').length > 0
                ? section.getElementsByTagName('tooltip')[0].innerHTML
                : '',
    };

    // Parsing of observable events
    const dynamicShapeParameters = parseDynamicShapeParameters(section);
    // Parse the scroll update function
    const update = parseScrollUpdate(section);
    // Return of the react node
    if (horzPosition) {
        return (
            <HorizontalScrollbar
                shape={scrollbar}
                dynamicParameters={dynamicShapeParameters}
                updateFunction={update}
            ></HorizontalScrollbar>
        );
    } else {
        return (
            <VerticalScrollbar
                shape={scrollbar}
                dynamicParameters={dynamicShapeParameters}
                updateFunction={update}
            ></VerticalScrollbar>
        );
    }
};
