import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import CodeEditor from '../components/CodeEditor';

const InterviewRoom = () => {
    const { roomId } = useParams();
    const [code, setCode] = useState('// Loading...');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        // Connect to backend
        socketRef.current = io('http://localhost:3000');

        // Join room
        socketRef.current.emit('join-room', roomId);

        // Listen for updates
        socketRef.current.on('init-state', (state) => {
            setCode(state.code);
            setLanguage(state.language);
        });

        socketRef.current.on('code-update', (newCode) => {
            setCode(newCode);
        });

        socketRef.current.on('language-update', (newLang) => {
            setLanguage(newLang);
        });

        // Cleanup
        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        socketRef.current.emit('code-change', { roomId, code: newCode });
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        socketRef.current.emit('language-change', { roomId, language: newLang });
    };

    const [pyodide, setPyodide] = useState(null);
    const [isPyodideLoading, setIsPyodideLoading] = useState(true);

    useEffect(() => {
        // Load Pyodide
        const loadPyodideAsync = async () => {
            try {
                if (window.loadPyodide) {
                    const pyodideInstance = await window.loadPyodide();
                    setPyodide(pyodideInstance);
                    setIsPyodideLoading(false);
                } else {
                    console.error("Pyodide script not loaded");
                    setIsPyodideLoading(false);
                }
            } catch (err) {
                console.error("Failed to load Pyodide:", err);
                setIsPyodideLoading(false);
            }
        };
        loadPyodideAsync();
    }, []);

    const runCode = async () => {
        setOutput([]); // Clear previous output
        if (language === 'javascript') {
            const logs = [];
            const originalLog = console.log;
            const originalError = console.error;

            console.log = (...args) => logs.push(`LOG: ${args.join(' ')}`);
            console.error = (...args) => logs.push(`ERR: ${args.join(' ')}`);

            try {
                // Dangerous in real prod, acceptable for "safe in browser" homework context (client-side only)
                const func = new Function(code);
                func();
            } catch (err) {
                logs.push(`Runtime Error: ${err.message}`);
            } finally {
                console.log = originalLog;
                console.error = originalError;
                setOutput(logs);
            }
        } else if (language === 'python') {
            if (!pyodide) {
                setOutput(['Python environment is not ready yet. Please wait...']);
                return;
            }
            try {
                // Capture stdout
                pyodide.setStdout({ batched: (msg) => setOutput(prev => [...prev, msg]) });
                await pyodide.runPythonAsync(code);
            } catch (err) {
                setOutput(prev => [...prev, `Error: ${err}`]);
            }
        } else {
            setOutput([`Execution for ${language} is not supported in the browser safely yet.`]);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', height: '100vh', gap: '1rem', padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Room: {roomId}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {language === 'python' && isPyodideLoading && <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>Loading Python...</span>}
                        {language === 'python' && !isPyodideLoading && pyodide && <span style={{ fontSize: '0.8rem', color: '#10b981' }}>Python Ready</span>}
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="input-field"
                            style={{ width: 'auto', marginBottom: 0 }}
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                        </select>
                    </div>
                </div>
                <CodeEditor code={code} language={language} onChange={handleCodeChange} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-primary" onClick={runCode} disabled={language === 'python' && isPyodideLoading} style={{ flex: 1, opacity: (language === 'python' && isPyodideLoading) ? 0.5 : 1 }}>
                        {language === 'python' && isPyodideLoading ? 'Loading...' : 'Run Code'}
                    </button>
                    <button className="btn-primary" onClick={copyLink} style={{ backgroundColor: '#475569', flex: 1 }}>Share Link</button>
                </div>

                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Output</h3>
                <div style={{
                    flex: 1,
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    overflowY: 'auto',
                    color: '#cbd5e1'
                }}>
                    {output.length > 0 ? output.map((line, i) => (
                        <div key={i} style={{ marginBottom: '0.25rem' }}>{line}</div>
                    )) : <span style={{ color: '#64748b' }}>Run code to see output...</span>}
                </div>
            </div>
        </div>
    );
};

export default InterviewRoom;
