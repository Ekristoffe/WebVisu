import * as React from 'react';
import { uid } from 'react-uid';
import { SimpleShape } from './Elements/Basicshapes/simpleshape';
import { PolyShape } from './Elements/Basicshapes/polyshape';
import { Button } from './Elements/Button/button';
import { Piechart } from './Elements/Piechart/piechart';
import { Scrollbar } from './Elements/Scrollbar/scrollbar';
// import { ArrayTable } from './Elements/Arraytable/arraytable';
import { Bitmap } from './Elements/Bitmap/bitmap';
import { Group } from './Elements/Group/group';
import { Subvisu } from './Elements/Subvisu/subvisu';
import {
    parseDynamicTextFont,
    parseDynamicTextParameters,
} from './Elements/Features/Events/eventManager';

type Props = {
    visualisation: Element;
    // useLanguageFile: boolean;
    useDynamicText: boolean;
    dynamicTextXMLs: Element[];
};
export const VisuElements: React.FunctionComponent<Props> = React.memo(
    ({ visualisation, useDynamicText, dynamicTextXMLs }) => {
        const visuObjects: Array<{
            obj: JSX.Element;
            id: string;
        }> = [];
        const addVisuObject = (visuObject: JSX.Element) => {
            const obj = { obj: visuObject, id: uid(visuObject) };
            visuObjects.push(obj);
        };
        const dynamicTextFont = parseDynamicTextFont(dynamicTextXMLs);
        const dynamicTextParameters = parseDynamicTextParameters(
            dynamicTextXMLs,
        );
        // The effect is called if the visualisation prop change
        // Rip all <element> sections
        for (let i = 0; i < visualisation.children.length; i++) {
            const section = visualisation.children[i];
            if (visualisation.children[i].nodeName === 'element') {
                // Determine the type of the element
                const type = section.getAttribute('type');
                switch (type) {
                    // Is a simple shape like rectangle, round-rectangle, circle or line
                    case 'simple': {
                        addVisuObject(
                            <SimpleShape
                                section={section}
                                useDynamicText={useDynamicText}
                                dynamicTextXMLs={dynamicTextXMLs}
                            ></SimpleShape>,
                        );
                        break;
                    }
                    // Is a bitmap
                    case 'bitmap': {
                        addVisuObject(
                            <Bitmap
                                section={section}
                                useDynamicText={useDynamicText}
                                dynamicTextXMLs={dynamicTextXMLs}
                            ></Bitmap>,
                        );
                        break;
                    }
                    // Is a button
                    case 'button': {
                        addVisuObject(
                            <Button
                                section={section}
                                useDynamicText={useDynamicText}
                                dynamicTextXMLs={dynamicTextXMLs}
                            ></Button>,
                        );
                        break;
                    }
                    // Is a polygon - As polygon, polyline or bezier
                    case 'polygon': {
                        addVisuObject(
                            <PolyShape
                                section={section}
                                useDynamicText={useDynamicText}
                                dynamicTextXMLs={dynamicTextXMLs}
                            ></PolyShape>,
                        );
                        break;
                    }
                    // Is a piechart
                    case 'piechart': {
                        addVisuObject(
                            <Piechart
                                section={section}
                                useDynamicText={useDynamicText}
                                dynamicTextXMLs={dynamicTextXMLs}
                            ></Piechart>,
                        );
                        break;
                    }
                    // Is a group (Dynamic elements like a graph)
                    case 'group': {
                        addVisuObject(
                            <Group
                                section={section}
                                useDynamicText={useDynamicText}
                                dynamicTextXMLs={dynamicTextXMLs}
                            ></Group>,
                        );
                        break;
                    }
                    // Is a Scrollbar
                    case 'scrollbar': {
                        addVisuObject(
                            <Scrollbar section={section}></Scrollbar>,
                        );
                        break;
                    }
                    case 'reference': {
                        addVisuObject(
                            <Subvisu
                                section={section}
                                // useLanguageFile={useLanguageFile}
                                useDynamicText={useDynamicText}
                                dynamicTextXMLs={dynamicTextXMLs}
                            ></Subvisu>,
                        );
                        break;
                    }
                }
            }
        }

        return (
            <React.Fragment>
                {
                    // visuObjects.map((element, index) => (
                    visuObjects.map((element) => (
                        <React.Fragment key={element.id}>
                            {element.obj}
                        </React.Fragment>
                    ))
                }
            </React.Fragment>
        );
    },
);
