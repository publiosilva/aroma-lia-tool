import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ToastContainer, toast } from 'react-toastify';

const TestSmellDetector = () => {
  const [languageFramework, setLanguageFramework] = useState('csharp-xunit');
  const [repositoryURL, setRepositoryURL] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [collapsedIndexes, setCollapsedIndexes] = useState(new Set());

  const handleDetect = async () => {
    setLoading(true);
    const [language, framework] = languageFramework.split('-');
    try {
      const response = await axios.post('http://localhost:3000/test-smells/detect', {
        language,
        framework,
        repositoryURL
      });
      setResults(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred while detecting test smells. Please try again later.';

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadJson = () => {
    const data = JSON.stringify(results, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'test-smells-report.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleCollapse = (index) => {
    const newCollapsedIndexes = new Set(collapsedIndexes);
    if (newCollapsedIndexes.has(index)) {
      newCollapsedIndexes.delete(index);
    } else {
      newCollapsedIndexes.add(index);
    }
    setCollapsedIndexes(newCollapsedIndexes);
  };

  return (
    <div className="flex flex-column justify-center items-center min-h-screen bg-f4f7fa p-3">
      <h1 className="text-4xl font-bold text-white mb-6 text-center">AromaLIA</h1>
      <div className="card p-6" style={{ width: 600 }}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-3">Language and Framework</label>
          <select
            className="input-field"
            value={languageFramework}
            onChange={(e) => setLanguageFramework(e.target.value)}
          >
            <option value="csharp-xunit">C# - xUnit</option>
            <option value="java-junit">Java - JUnit</option>
            <option value="python-pytest">Python - PyTest</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-3">Repository URL</label>
          <Input
            className="input-field"
            placeholder="Enter repository URL"
            value={repositoryURL}
            onChange={(e) => setRepositoryURL(e.target.value)}
          />
        </div>
        <Button className="btn" onClick={handleDetect} disabled={loading}>
          {loading ? 'Detecting...' : 'Detect Test Smells'}
        </Button>
      </div>
      {results && (
        <div className="mt-4">
          <Button className="w-full bg-green-600 text-white" onClick={downloadJson}>
            Download JSON Report
          </Button>
        </div>
      )}
      {results && (
        <div className="mt-8 max-w-4xl mx-auto text-white">
          {results.map((result, index) => (
            <Card key={index} className="mb-4 bg-gray-800 border border-gray-700">
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-gray-300 font-semibold">
                    {result.testFilePath}
                  </p>
                  <Button
                    className="text-sm bg-transparent text-gray-400 hover:bg-gray-700 hover:text-white px-2 py-1"
                    onClick={() => toggleCollapse(index)}
                  >
                    {collapsedIndexes.has(index) ? 'Expand' : 'Collapse'}
                  </Button>
                </div>
                {!collapsedIndexes.has(index) && (
                  <div className="overflow-x-auto mt-3">
                    <SyntaxHighlighter
                      language={languageFramework.split('-')[0]}
                      style={darcula}
                      showLineNumbers
                      wrapLines
                      lineProps={(lineNumber) => {
                        const smell = result.testSmells.find(smell => lineNumber >= smell.startLine && lineNumber <= smell.endLine);
                        return smell ? {
                          style: {
                            borderLeftColor: 'red',
                            borderLeftStyle: 'solid',
                            borderLeftWidth: 2,
                            backgroundColor: 'rgba(255, 0, 0, 0.2)',
                            display: 'block',
                            width: '100%'
                          },
                          'data-smell': smell.name,
                          className: 'test-smell-line',
                        } : {};
                      }}
                    >
                      {result.testFileContent}
                    </SyntaxHighlighter>
                  </div>
                )}
                {result.testSmells.length > 0 && (
                  <p>
                    <strong>
                      Test Smells:
                    </strong>
                  </p>
                )}
                {result.testSmells && result.testSmells.map((smell, index) => (
                  <div
                    key={index}
                    className="mt-2 text-white p-2"
                    style={{ backgroundColor: 'rgba(255, 0, 0, 0.4)', borderRadius: 5, fontSize: '0.875rem' }}
                  >
                    <strong>{smell.name}</strong> at lines {smell.startLine}-{smell.endLine}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default TestSmellDetector;
