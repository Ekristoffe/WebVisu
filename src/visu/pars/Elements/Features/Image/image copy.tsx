import * as React from 'react';
import ComSocket from '../../../../communication/comsocket';
import { stringToArray } from '../../../Utils/utilfunctions';
import { getImage } from '../../../Utils/fetchfunctions';
import { useObserver, useLocalStore } from 'mobx-react-lite';
import { get, set } from 'idb-keyval';

type Props = {
    section: Element;
    inlineElement: boolean;
};

export const Image: React.FunctionComponent<Props> = ({
    section,
    inlineElement,
}) => {
    // Auxiliary variables
    const rect = stringToArray(
        section.getElementsByTagName('rect')[0].innerHTML,
    );

    const initial = {
        // frameType defines the type of scaling. Possible are isotrophic, anisotrophic or static
        frameType: section.getElementsByTagName('frame-type')[0]
            .innerHTML,
        inlineDimensions: '100%',
        // Dimensions of the surrounding div
        rectHeight: rect[3] - rect[1],
        rectWidth: rect[2] - rect[0],
        // Dimensions of the original
        naturalHeight: rect[3] - rect[1],
        naturalWidth: rect[2] - rect[0],
        // Percent dimensions
        percHeight: '',
        percWidth: '',
        maxHeight: '',
        maxWidth: '',
        // Name of the file
        filename: '',
        margin: 'auto',
    };
    /*
    // With surrounding frame?
    if (inlineElement){
        if(section.getElementsByTagName("no-frame-around-bitmap")[0].innerHTML.length){
            initial.inlineDimensions = "100%";
        } else {
            initial.inlineDimensions = "92%";
        }
    }
    */

    switch (initial.frameType) {
        case 'static': {
            break;
        }
        case 'isotropic': {
            initial.maxWidth = initial.inlineDimensions;
            initial.maxHeight = initial.inlineDimensions;
            if (!inlineElement) {
                initial.margin = 'top';
            }
            break;
        }
        case 'anisotropic': {
            initial.percWidth = initial.inlineDimensions;
            initial.percHeight = initial.inlineDimensions;
            break;
        }
    }

    const state = useLocalStore(() => initial);

    if (section.getElementsByTagName('file-name').length) {
        if (
            section.getElementsByTagName('file-name')[0].innerHTML
                .length
        ) {
            console.log(
                'file-name len',
                section.getElementsByTagName('file-name').length,
            );
            console.log(
                'file-name data',
                section.getElementsByTagName('file-name'),
            );
            console.log(
                'file-name inner',
                section.getElementsByTagName('file-name')[0]
                    .innerHTML,
            );
            const rawFilename = section
                .getElementsByTagName('file-name')[0]
                .innerHTML.replace(/.*\\/, '')
                .replace(/].*/, '');
            console.log('rawFilename', rawFilename);
            // Try to get the image from cache
            get(rawFilename).then((cacheReturn) => {
                if (cacheReturn === undefined) {
                    const path =
                        ComSocket.singleton()
                            .getServerURL()
                            .replace('webvisu.htm', '') + rawFilename;
                    console.log('get image', path);
                    getImage(path).then((datauri) => {
                        console.log(
                            'got image',
                            rawFilename,
                            datauri,
                        );
                        state.filename = datauri;
                        set(rawFilename, datauri);
                    });
                } else {
                    state.filename = cacheReturn as any;
                }
            });
        }
    }

    // Set the filename, it could be a variable or static
    if (section.getElementsByTagName('expr-fill-color').length) {
        /* */ console.log(
            'expr-fill-color len',
            section.getElementsByTagName('expr-fill-color').length,
        );
        /* */ console.log(
            'expr-fill-color data',
            section.getElementsByTagName('expr-fill-color'),
        );
        const expression = section
            .getElementsByTagName('expr-fill-color')[0]
            .getElementsByTagName('expr');
        const varName = expression[0]
            .getElementsByTagName('var')[0]
            .innerHTML.toLocaleLowerCase();

        /*
        const rawFilename = ComSocket.singleton()
            .oVisuVariables.get(varName)!
            .value.toLocaleLowerCase();

        // Try to get the image from cache
        get(rawFilename).then((cacheReturn) => {
            if (cacheReturn === undefined) {
                const path =
                    ComSocket.singleton()
                        .getServerURL()
                        .replace('webvisu.htm', '') + rawFilename;
                console.log('get variable image', path);
                getImage(path).then((datauri) => {
                    console.log(
                        'got variable image',
                        rawFilename,
                        datauri,
                    );
                    state.filename = datauri;
                    set(rawFilename, datauri);
                });
            } else {
                state.filename = cacheReturn as any;
            }
        });
        */
        Object.defineProperty(state, 'filename', {
            get: function () {
                const rawFilename = ComSocket.singleton()
                    .oVisuVariables.get(varName)!
                    .value.toLocaleLowerCase();
                // Try to get the image from cache
                get(rawFilename).then((cacheReturn) => {
                    if (cacheReturn === undefined) {
                        const path =
                            ComSocket.singleton()
                                .getServerURL()
                                .replace('webvisu.htm', '') +
                            rawFilename;
                        console.log('rawFilename', rawFilename);
                        getImage(path).then((datauri) => {
                            console.log('datauri', datauri);
                            set(rawFilename, datauri);
                            return datauri;
                        });
                    } else {
                        return cacheReturn as any;
                    }
                });
            },
        });
        /*
        Object.defineProperty(state, 'filename', {
            get: function () {
                const rawFilename = ComSocket.singleton()
                    .oVisuVariables.get(varName)!
                    .value.toLocaleLowerCase();
                // Try to get the image from cache
                get(rawFilename).then((cacheReturn) => {
                    if (cacheReturn === undefined) {
                        const path =
                            ComSocket.singleton()
                                .getServerURL()
                                .replace('webvisu.htm', '') +
                            rawFilename;
                        getImage(path).then((datauri) => {
                            set(rawFilename, datauri);
                            state.filename = datauri;
                            return datauri;
                        });
                    } else {
                        state.filename = cacheReturn as any;
                        return cacheReturn as any;
                    }
                });
            },
        });
        */
    }

    /* */ console.log('state.filename', state.filename);
    return useObserver(() => (
        <React.Fragment>
            <img
                src={state.filename}
                style={{
                    maxHeight: state.maxHeight,
                    maxWidth: state.maxWidth,
                    width: state.percWidth,
                    height: state.percHeight,
                    position: 'absolute',
                    pointerEvents: 'none',
                    textAlign: 'center',
                    margin: state.margin,
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }}
            ></img>
        </React.Fragment>
    ));
};
