module.exports = (path, tagIndicator) => {
    const scriptUnLoaded = !checkIfScriptExist(tagIndicator);
    if (scriptUnLoaded) {
        const script = getScript(path);
        addScriptToDoc(script, tagIndicator);
    }
}

const checkIfScriptExist = (tagIndicator) => {
    return document.getElementById(tagIndicator);
}

const getScript = (path) => {
    const xhrObj = new XMLHttpRequest();
    xhrObj.open("GET", path, false);
    xhrObj.send("");
    return xhrObj.responseText;
}

const addScriptToDoc = (scriptText, tagIndicator) => {
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.text = scriptText;
    scriptElement.id = tagIndicator;
    document.head.appendChild(scriptElement);
}
