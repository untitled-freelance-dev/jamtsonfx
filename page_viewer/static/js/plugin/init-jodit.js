function initializeEditor() {
    return Jodit.make("#mytextarea", {
        "autofocus": true,
        "uploader": {
            "insertImageAsBase64URI": true
        },
        "spellcheck": true,
        "theme": "dark",
        "toolbarAdaptive": false,
        "height": 1000,
        "maxHeight": 2000
    });
}
export { initializeEditor }