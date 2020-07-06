import * as JsZip from 'jszip'
import StateManager from '../../statemanagement/statemanager'

export function getVisuxml (url : string) :Promise<XMLDocument> {
  return new Promise(resolve => {
    let encoding = StateManager.singleton().oState.get('ENCODINGSTRING')
    if (encoding === undefined) {
      encoding = 'iso-8859-1'
    }
    fetch(url, { headers: { 'Content-Type': 'text/plain; charset=UTF8' } })
      .then((response) => {
        // Try to fetch the xml as unzipped file
        if (response.ok) {
          response.arrayBuffer()
            .then((buffer) => {
              const decoder = new TextDecoder(encoding)
              const text = decoder.decode(buffer)
              const data = new window.DOMParser().parseFromString(text, 'text/xml')
              resolve(data)
            })
        }
        // Try to fetch the visu as zipped file
        else {
          const zip = new JsZip()
          const urlStack = url.split('/')
          const filename = urlStack.pop()
          const zipName = filename.split('.')[0] + '_xml.zip'
          // Push the zip filename to stack
          urlStack.push(zipName)
          fetch(urlStack.join('/'), { headers: { 'Content-Type': 'binary;' } })
            .then((response) => {
              // Try to fetch the xml as unzipped file
              if (response.ok) {
                response.arrayBuffer()
                  .then((buffer) => zip.loadAsync(buffer))
                  .then((unzipped) => unzipped.file(filename).async('arraybuffer'))
                  .then(buffer => {
                    const decoder = new TextDecoder(encoding)
                    const text = decoder.decode(buffer)
                    const data = new window.DOMParser().parseFromString(text, 'text/xml')
                    resolve(data)
                  })
              } else {
                resolve(null)
              }
            })
        }
      })
  })
}

export function stringifyVisuXML (toStringify : XMLDocument) : string {
  const serializer = new XMLSerializer()
  const stringCopy = serializer.serializeToString(toStringify)
  return stringCopy
}

export function parseVisuXML (stringXML : string) : XMLDocument {
  const parser = new DOMParser()
  const returnXML = parser.parseFromString(stringXML, 'application/xml')
  return returnXML
}

export function getImage (url : string) :Promise<string> {
  // Calculate the mimeType
  let mimeType = ''
  const fileFormat = url.split('.').pop()
  switch (fileFormat) {
    case 'bmp':
      mimeType = 'image/bmp'
      break
    case 'jpeg':
      mimeType = 'image/jpeg'
      break
    case 'jpg':
      mimeType = 'image/jpeg'
      break
  }

  return new Promise(resolve => {
    const base64Flag = 'data:' + mimeType + ';base64,'
    fetch(url)
      .then((response) => {
        // Try to fetch the xml as unzipped file
        if (response.ok) {
          response.arrayBuffer()
            .then((buffer) => {
              let binary = ''
              const bytes = new Uint8Array(buffer)
              bytes.forEach((b) => binary += String.fromCharCode(b))
              const base64 = window.btoa(binary)
              resolve(base64Flag + base64)
            })
        }
        // Try to fetch the visu as zipped file
        else {
          const zip = new JsZip()
          const urlStack = url.split('/')
          const filename = urlStack.pop()
          const zipName = filename.split('.')[0] + '_' + fileFormat + '.zip'
          // Push the zip filename to stack
          urlStack.push(zipName)
          fetch(urlStack.join('/'))
            .then((response) => {
              // Try to fetch the xml as unzipped file
              if (response.ok) {
                response.arrayBuffer()
                  .then((buffer) => zip.loadAsync(buffer))
                  .then((unzipped) => unzipped.file(filename).async('arraybuffer'))
                  .then((buffer) => {
                    let binary = ''
                    const bytes = new Uint8Array(buffer)
                    bytes.forEach((b) => binary += String.fromCharCode(b))
                    const base64 = window.btoa(binary)
                    resolve(base64Flag + base64)
                  })
              } else {
                resolve(null)
              }
            })
        }
      })
  })
}
