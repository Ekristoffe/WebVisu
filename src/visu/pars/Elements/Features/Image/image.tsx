import * as React from 'react';
import * as util from '../../../Utils/utilfunctions';
import * as bmpHelper from 'bmp-js';
import { useObserver, useLocalStore } from 'mobx-react-lite';
import ComSocket from '../../../../communication/comsocket';
import { stringToArray } from '../../../Utils/utilfunctions';
import { getImage } from '../../../Utils/fetchfunctions';
import { get, set } from 'idb-keyval';
// import * as Buffer from "Buffer";
// import { Buffer } from 'buffer';
//  import Buffer from 'buffer';
import * as Buffer from "buffer";

type Props = {
    section: Element;
    inlineElement: boolean;
};

export const ImageField: React.FunctionComponent<Props> = ({
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
        // maxHeight: '',
        // maxWidth: '',
        // Name of the file
        fixedFileName: '',
        dynamicFileName: '',
        // margin: 'auto',
        // viewBox: '',
        transparent: false,
        transparencyColor: '',

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
            // initial.maxWidth = initial.inlineDimensions;
            // initial.maxHeight = initial.inlineDimensions;
            initial.percWidth = initial.inlineDimensions;
            initial.percHeight = initial.inlineDimensions;
            /*
            if (!inlineElement) {
                initial.margin = 'top';
            }
            */
            break;
        }
        case 'anisotropic': {
            initial.percWidth = initial.inlineDimensions;
            initial.percHeight = initial.inlineDimensions;
            // initial.viewBox = '0 0 ' + initial.rectWidth + ' ' + initial.rectHeight;
            break;
        }
    }

    if (section.getElementsByTagName('file-name').length) {
        if (
            section.getElementsByTagName('file-name')[0].innerHTML
                .length
        ) {
            Object.defineProperty(initial, 'fixedFileName', {
                get: function () {
                    const rawFileName = section
                        .getElementsByTagName('file-name')[0]
                        .innerHTML.replace(/.*\\/, '')
                        .replace(/].*/, '');
                    return rawFileName;
                },
            });
        }
    }

    if (section.getElementsByTagName('transparent').length) {
        if (
            section.getElementsByTagName('transparent')[0].innerHTML
                .length
        ) {
            Object.defineProperty(initial, 'transparent', {
                get: function () {
                    const value = util.stringToBoolean(
                        section.getElementsByTagName('transparent')[0]
                            .innerHTML,);
                    return value;
                },
            });
        }
    }

    if (section.getElementsByTagName('transparency-color').length) {
        if (
            section.getElementsByTagName('transparency-color')[0].innerHTML
                .length
        ) {
            Object.defineProperty(initial, 'transparencyColor', {
                get: function () {
                    const value = 
                        section.getElementsByTagName('transparency-color')[0]
                            .innerHTML;
                    return value;
                },
            });
        }
    }

    // Set the fileName, it could be a variable or static
    if (section.getElementsByTagName('expr-fill-color').length) {
        const expression = section
            .getElementsByTagName('expr-fill-color')[0]
            .getElementsByTagName('expr');
        const varName = expression[0]
            .getElementsByTagName('var')[0]
            .innerHTML.toLocaleLowerCase();

        Object.defineProperty(initial, 'dynamicFileName', {
            get: function () {
                const rawFilename = ComSocket.singleton()
                    .oVisuVariables.get(varName)!
                    .value.toLocaleLowerCase();
                return rawFilename;
            },
        });
    }

    const [fileName, setFileName] = React.useState<string>(null);

    React.useEffect(() => {
        const fetchImage = async function () {
            let rawFileName: string = null;
            if (
                initial.dynamicFileName !== null &&
                initial.dynamicFileName !== undefined &&
                initial.dynamicFileName !== ''
            ) {
                rawFileName = initial.dynamicFileName;
            } else if (
                initial.fixedFileName !== null &&
                initial.fixedFileName !== undefined &&
                initial.fixedFileName !== ''
            ) {
                rawFileName = initial.fixedFileName;
            }
            // Try to get the image from cache
            let plainImg: string = null;
            if ((await get(rawFileName)) === undefined) {
                const path =
                    ComSocket.singleton()
                        .getServerURL()
                        .replace('webvisu.htm', '') + rawFileName;
                plainImg = await getImage(path);
                if (plainImg === undefined || plainImg === null) {
                    console.warn(
                        'The requested image ' +
                            rawFileName +
                            ' is not available!',
                    );
                } else {
                    await set(rawFileName, plainImg);
                }
            } else {
                plainImg = await get(rawFileName);
            }

            if (plainImg !== null) {
                if (
                    initial.transparent && 
                    initial.transparencyColor !== null &&
                    initial.transparencyColor !== undefined &&
                    initial.transparencyColor !== ''
                ) {
                    // Transparency conversion

                    console.log('plainImg', plainImg);
                    let regEx = plainImg.match(/.*(?<=base64,)/);
                    console.log('regEx', regEx);
                    if (regEx !== undefined || regEx !== null) {
                        const base64Flag = regEx[0];
                        console.log('base64Flag', base64Flag);
                        regEx = plainImg.match(/(?<=base64,).*/);
                        console.log('regEx', regEx);
                        if (regEx !== undefined || regEx !== null) {
                            let base64Img = regEx[0];
                            console.log('base64Img', base64Img);
                            let binaryImg = window.atob(base64Img);
                            console.log('binaryImg', binaryImg);
                            const binaryLen = binaryImg.length;
                            let binaryData = new Uint8Array(binaryLen);
                            for (let i = 0; i < binaryLen; i++) {
                                binaryData[i] = binaryImg.charCodeAt(i);
                            }
                            console.log('binaryData', binaryData);
//                            Buffer
                            if (base64Flag === 'data:image/bmp;base64,') {
//                                const Buffer = require('buffer/').Buffer  // note: the trailing slash is important!
                                const pixelsIn = bmpHelper.decode(Buffer.Buffer.from(binaryData.buffer));
                                console.log('pixelsIn', pixelsIn);
                                const pixelsOut = pixelsIn;
                                // bmp stores the pixels as ABGR
                                for (let i = 0; i < pixelsIn.data.byteLength; i += 4) {
/*                                    if(pixelsData.data[i + 1] === 0x00 && pixelsData.data[i + 2] === 0x00 && pixelsData.data[i + 3] === 0x00){
                                        pixelsData.data[i + 0] = 0x00; // A
                                    } else {
                                        pixelsData.data[i + 0] = 0xFF; // A
                                    }
*/
/*                                    if(pixelsIn.data[i + 0] === 0x00 && pixelsIn.data[i + 1] === 0x00 && pixelsIn.data[i + 2] === 0x00){
                                        pixelsOut.data[i + 0] = 0x00; // R
                                        pixelsOut.data[i + 1] = 0xFF; // G
                                        pixelsOut.data[i + 2] = 0x00; // B
                                        pixelsOut.data[i + 3] = 0x00; // A
                                    } else {
                                        pixelsOut.data[i + 0] = 0x00; // R
                                        pixelsOut.data[i + 1] = 0x00; // G
                                        pixelsOut.data[i + 2] = 0xFF; // B
                                        pixelsOut.data[i + 3] = 0xFF; // A
                                    }
                                    */
                                    if(pixelsIn.data[i + 0] === 0x00 && pixelsIn.data[i + 1] === 0x00 && pixelsIn.data[i + 2] === 0x00){
                                        pixelsOut.data[i + 0] = 0x00; // A
                                        pixelsOut.data[i + 1] = 0x00; // B
                                        pixelsOut.data[i + 2] = 0xFF; // G
                                        pixelsOut.data[i + 3] = 0x00; // R
                                    } else {
                                        pixelsOut.data[i + 0] = 0xFF; // A
                                        pixelsOut.data[i + 1] = 0xFF; // B
                                        pixelsOut.data[i + 2] = 0x00; // G
                                        pixelsOut.data[i + 3] = 0x00; // R
                                    }
                                }
                                console.log('pixelsOut', pixelsOut);
                                binaryData = bmpHelper.encode(pixelsOut).data;
                            }
                            
                            console.log('binaryData', binaryData);
                            binaryImg = '';
                            for (let i = 0; i < binaryLen; i++) {
                                binaryImg += String.fromCharCode(binaryData[i]);
                            }
                            console.log('binaryImg', binaryImg);
                            base64Img = window.btoa(binaryImg);
                            console.log('base64Img', base64Img);
                            plainImg = base64Flag + base64Img;
                            console.log('plainImg', plainImg);
                        }
                    }
                    /**
                    const regEx = new RegExp(/(?<=base64,).* /);
                    const match = regEx.exec(visuName);
                    if (match === undefined || match === null) {
                    const base64Flag = 'data:' + mimeType + ';base64,';
                    const base64 = window.btoa(binary);
                    resolve(base64Flag + base64);


                    const image = new Image();
                    image.onload = function() {
                        const canvas = document.createElement('canvas');
                        canvas.width = image.width;
                        canvas.height = image.height;

                        const context = canvas.getContext('2d');
                        context.drawImage(image, 0, 0);

                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                        for (let i = 0; i < imageData.data.length; i+= 4) {
                            if(imageData.data[i] === 0 && imageData.data[i+1] === 0 && imageData.data[i+2] === 0){
                                console.log('modified' + i, imageData.data[i], imageData.data[i+1], imageData.data[i+2], imageData.data[i+3]);
                                imageData.data[i+3] = 0;
                            }
                        }
                        // Draw the ImageData at the given (x,y) coordinates.
                        context.putImageData(imageData, 0, 0);

                        // Now you can access pixel data from imageData.data.
                        // It's a one-dimensional array of RGBA values.
                        // Here's an example of how to get a pixel's color at (x,y)
                        /*
                        var index = (y*imageData.width + x) * 4;
                        var red = imageData.data[index];
                        var green = imageData.data[index + 1];
                        var blue = imageData.data[index + 2];
                        var alpha = imageData.data[index + 3];
                        * /

                    };
                    console.log('plainImg', plainImg);
                    image.src = plainImg;
                    console.log('image.src', image.src);
                    */
                }
                setFileName(plainImg);
            }
        };
        fetchImage();
    }, [initial.fixedFileName, initial.dynamicFileName, initial.transparent, initial.transparencyColor]);

    const state = useLocalStore(() => initial);
    return useObserver(() => (
        <React.Fragment>
            <svg
                width={inlineElement ? initial.rectWidth - 4 : '100%'}
                height={
                    inlineElement ? initial.rectHeight - 4 : '100%'
                }
                /*
                viewBox={
                    state.frameType === 'anisotropic'
                        ? state.viewBox
                        : null
                }
                */
            >
                <image
                    style={{
                        // maxHeight: state.maxHeight,
                        // maxWidth: state.maxWidth,
                        width: state.percWidth,
                        height: state.percHeight,
                        position: 'absolute',
                        pointerEvents: 'none',
                        textAlign: 'center',
                        // margin: state.margin,
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                    }}
                    preserveAspectRatio={
                        state.frameType === 'anisotropic'
                            ? 'none'
                            : state.frameType === 'isotropic'
                            ? 'xMinYMin meet'
                            : null
                    }
                    href={
                        (state.dynamicFileName !== null &&
                            state.dynamicFileName !== undefined &&
                            state.dynamicFileName !== '') ||
                        (state.fixedFileName !== null &&
                            state.fixedFileName !== undefined &&
                            state.fixedFileName !== '')
                            ? fileName
                            : null
                    }
                ></image>
            </svg>
        </React.Fragment>
    ));
};
