const joditEditor = Jodit.make("#mytextarea", {
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