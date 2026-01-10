import React from 'react';
import Editor from '@monaco-editor/react';

/**
 * We chose @monaco-editor/react for the following reasons:
 * 1. It provides a rich, VS Code-like editing experience which is familiar to most developers.
 * 2. It has built-in support for syntax highlighting for dozens of languages, including JavaScript and Python, out of the box.
 * 3. It offers features like minimap, automatic layout, and robust easy-to-use API for handling value changes.
 */

const CodeEditor = ({ code, language, onChange }) => {
    return (
        <div style={{ height: '70vh', border: '1px solid #334155', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <Editor
                height="100%"
                language={language}
                value={code}
                theme="vs-dark"
                onChange={(value) => onChange(value)}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
        </div>
    );
};

export default CodeEditor;
