import * as React from 'react';
import { get, set } from 'idb-keyval';
import { VisuElements } from '../visu/pars/elementparser';
import {
    stringToArray,
    stringToBoolean,
} from './pars/Utils/utilfunctions';
import {
    getDynamicXML,
    getVisuXML,
    stringifyVisuXML,
    parseVisuXML,
} from './pars/Utils/fetchfunctions';
import ComSocket from './communication/comsocket';
import StateManager from '../visu/statemanagement/statemanager';

type Props = {
    visuName: string;
    width: number;
    height: number;
    showFrame: boolean;
    clipFrame: boolean;
    isoFrame: boolean;
    originalFrame: boolean;
    originalScrollableFrame: boolean;
    noFrameOffset: boolean;
};

async function initVariables(XML: XMLDocument) {
    const com = ComSocket.singleton();
    // We have to reset the varibales on comsocket, if necessary
    com.stopCyclicUpdate();
    com.initObservables();
    // Rip all of <variable> in <variablelist> section
    let variables = XML.getElementsByTagName('visualisation')[0]
        .getElementsByTagName('variablelist')[0]
        .getElementsByTagName('variable');
    for (let i = 0; i < variables.length; i++) {
        const varName = variables[i].getAttribute('name');
        const rawAddress = variables[i].innerHTML;
        const varAddress = rawAddress
            .split(',')
            .slice(0, 4)
            .join(',');
        // Add the variable to the observables if not already existent
        if (!com.oVisuVariables.has(varName.toLowerCase())) {
            com.addObservableVar(varName, varAddress);
        }
    }

    // Rip all of <complexvariable> in <variablelist> section
    variables = XML.getElementsByTagName('visualisation')[0]
        .getElementsByTagName('variablelist')[0]
        .getElementsByTagName('complexvariable');
    for (let i = 0; i < variables.length; i++) {
        const varName = variables[i].getAttribute('name');
        const rawAddress = variables[i].innerHTML;
        const varAddress = 'complex,'.concat(
            rawAddress.split(',').slice(0, 3).join(','),
        );
        // Add the variable to the observables if not already existent
        if (!com.oVisuVariables.has(varName.toLowerCase())) {
            com.addObservableVar(varName, varAddress);
        }
    }

    await com.updateVarList();
    com.startCyclicUpdate();
}

export const Visualisation: React.FunctionComponent<Props> = React.memo(
    ({
        visuName,
        width,
        height,
        // showFrame,
        clipFrame,
        isoFrame,
        originalFrame,
        // originalScrollableFrame,
        // noFrameOffset,
    }) => {
        const [loading, setLoading] = React.useState<boolean>(true);
        const [adaptedXML, setAdaptedXML] = React.useState<Element>(
            null,
        );
        const [originSize, setOriginSize] = React.useState<
            Array<number>
        >([0, 0]);
        const [scale, setScale] = React.useState('scale(1)');

        // const [useLanguageFile, setUseLanguageFile] = React.useState<boolean>(false);
        const [
            useDynamicText,
            setUseDynamicText,
        ] = React.useState<boolean>(false);
        const [dynamicTextXMLs, setDynamicTextXMLs] = React.useState<
            Array<Element>
        >(null);

        // Get new xml on change of visuName
        React.useEffect(() => {
            const fetchXML = async function () {
                // Set the loading flag. This will unmount all elements from calling visu
                setLoading(true);
                const url =
                    StateManager.singleton().oState.get('ROOTDIR') +
                    '/' +
                    visuName +
                    '.xml';
                // Files that are needed several times will be saved internally for loading speed up
                let plainxml: string;
                if (typeof (await get(visuName)) === 'undefined') {
                    const xml = await getVisuXML(url);
                    if (typeof xml === 'undefined' || xml === null) {
                        console.warn(
                            'The requested visualisation ' +
                                visuName +
                                ' is not available!',
                        );
                    } else {
                        plainxml = stringifyVisuXML(xml);
                        // eslint-disable-next-line no-console
                        console.log(visuName, 'plainxml', plainxml);
                        await set(visuName, plainxml);
                    }
                } else {
                    plainxml = await get(visuName);
                }

                if (plainxml !== null) {
                    const xmlDoc = parseVisuXML(plainxml);
                    await initVariables(xmlDoc);
                    setAdaptedXML(xmlDoc.children[0]);
                    setOriginSize(
                        stringToArray(
                            xmlDoc
                                .getElementsByTagName(
                                    'visualisation',
                                )[0]
                                .getElementsByTagName('size')[0]
                                .innerHTML,
                        ),
                    );
                    if (
                        xmlDoc.getElementsByTagName(
                            'use-dynamic-text',
                        ).length > 0
                    ) {
                        setUseDynamicText(
                            stringToBoolean(
                                xmlDoc.getElementsByTagName(
                                    'use-dynamic-text',
                                )[0].textContent,
                            ),
                        );
                    }
                    let language = '';
                    if (
                        xmlDoc.getElementsByTagName('language')
                            .length > 0
                    ) {
                        language = xmlDoc.getElementsByTagName('language')[0].textContent;
                    }
                    // Check, if saved id and received id are not equal
                    if ((typeof localStorage.getItem('language') === 'undefined') || (localStorage.getItem('language') === null)) {
                        // Save the language
                        localStorage.setItem(
                            'language',
                            language,
                        );
                    }
                    if (
                        xmlDoc.getElementsByTagName(
                            'dynamic-text-file',
                        ).length > 0
                    ) {
                        // Iterate over the childs to find the dynamic text file
                        const dynamicTextXMLs: Element[] = [null];
                        for (
                            let i = 0;
                            i <
                            xmlDoc.getElementsByTagName(
                                'dynamic-text-file',
                            ).length;
                            i++
                        ) {
                            const dynamicTextName = xmlDoc
                                .getElementsByTagName(
                                    'dynamic-text-file',
                                )
                                [i].textContent.toLowerCase();
                            const url =
                                StateManager.singleton().oState.get(
                                    'ROOTDIR',
                                ) +
                                '/' +
                                dynamicTextName;
                            if (
                                typeof (await get(
                                    dynamicTextName,
                                )) === 'undefined'
                            ) {
                                const xml = await getDynamicXML(url);
                                if (
                                    typeof xml === 'undefined' ||
                                    xml === null
                                ) {
                                    console.warn(
                                        'The requested dynamic text file ' +
                                            dynamicTextName +
                                            ' is not available!',
                                    );
                                } else {
                                    plainxml = stringifyVisuXML(xml);
                                    // eslint-disable-next-line no-console
                                    console.log(
                                        dynamicTextName,
                                        'plainxml',
                                        plainxml,
                                    );
                                    await set(
                                        dynamicTextName,
                                        plainxml,
                                    );
                                }
                            } else {
                                plainxml = await get(dynamicTextName);
                            }

                            if (plainxml !== null) {
                                const xmlDoc = parseVisuXML(plainxml);
                                dynamicTextXMLs[i] =
                                    xmlDoc.children[0];
                            }
                        }
                        setDynamicTextXMLs(dynamicTextXMLs);
                    }
                    setLoading(false);
                }
            };
            fetchXML();
        }, [visuName]);

        // Scaling on main window resize for responsive behavior
        React.useEffect(() => {
            const xscaleFactor = width / (originSize[0] + 2);
            const yscaleFactor = height / (originSize[1] + 2);
            if (originalFrame) {
                setScale(
                    'scale(' +
                        (
                            (originSize[0] / (originSize[0] + 2) +
                                originSize[1] / (originSize[1] + 2)) /
                            2
                        ).toString() +
                        ')',
                );
            } else if (isoFrame) {
                setScale(
                    'scale(' +
                        Math.min(
                            xscaleFactor,
                            yscaleFactor,
                        ).toString() +
                        ')',
                );
            } else {
                setScale(
                    'scale(' +
                        xscaleFactor.toString() +
                        ',' +
                        yscaleFactor.toString() +
                        ')',
                );
            }
        }, [width, height, originSize, originalFrame, isoFrame]);

        return (
            <div
                style={{
                    display: 'block',
                    position: 'absolute',
                    overflow: clipFrame ? 'hidden' : 'visible',
                    left: 0,
                    top: 0,
                    width: originSize[0] + 1,
                    height: originSize[1] + 1,
                    transformOrigin: '0 0',
                    transform: scale,
                }}
            >
                {loading ? null : (
                    <VisuElements
                        visualisation={adaptedXML}
                        // useLanguageFile={useLanguageFile}
                        useDynamicText={useDynamicText}
                        dynamicTextXMLs={dynamicTextXMLs}
                    ></VisuElements>
                )}
            </div>
        );
    },
);
