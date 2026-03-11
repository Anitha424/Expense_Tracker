import { useState } from 'react';
import { Upload, Code, AlertCircle, CheckCircle, FileText, Copy, Download } from 'lucide-react';

function AnalysisPage() {
  const [codeInput, setCodeInput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleAnalyze = async () => {
    if (!codeInput.trim()) {
      alert('Please enter code to analyze');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setResults({
        issues: [
          { type: 'warning', message: 'Unused variable declared', line: 5 },
          { type: 'error', message: 'Syntax error: Missing semicolon', line: 12 },
          { type: 'info', message: 'Function complexity is too high', line: 18 },
        ],
        score: 72,
        summary: 'Code quality needs improvement. 3 issues found.',
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCodeInput(event.target.result);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeInput);
    alert('Code copied to clipboard!');
  };

  const handleDownloadReport = () => {
    const report = `Code Analysis Report\n${new Date().toLocaleString()}\n\nLanguage: ${language}\nScore: ${results?.score || 0}/100\n\nIssues:\n${results?.issues.map((i) => `- [${i.type.toUpperCase()}] Line ${i.line}: ${i.message}`).join('\n')}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis-report.txt';
    a.click();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Code Analysis
            </span>
          </h1>
          <p className="text-slate-400">Upload or paste your code to get instant analysis and recommendations</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Source Code</h2>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm text-white focus:outline-none focus:border-cyan-400/50"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                </select>
              </div>

              {/* Code Editor */}
              <textarea
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Paste your code here or upload a file..."
                className="w-full flex-1 p-4 rounded-lg bg-slate-950/50 border border-white/10 text-white font-mono text-sm resize-none focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 mb-4"
              />

              {/* File Name Display */}
              {fileName && (
                <p className="text-sm text-slate-400 mb-4">
                  <FileText className="inline mr-2 w-4 h-4" />
                  Loaded: {fileName}
                </p>
              )}

              {/* Button Group */}
              <div className="flex flex-wrap gap-3">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".js,.py,.java,.cpp,.html,.css,.txt"
                    className="hidden"
                  />
                  <div className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-center hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2">
                    <Upload size={18} />
                    Upload File
                  </div>
                </label>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Copy size={18} />
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex flex-col">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 flex-1 flex flex-col">
              <h2 className="text-xl font-bold mb-4">Analysis Results</h2>

              {!results ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
                  <Code className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-center mb-6">No analysis performed yet</p>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !codeInput.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
                  </button>
                </div>
              ) : (
                <>
                  {/* Score Card */}
                  <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">Quality Score</span>
                      <span className={`text-2xl font-bold ${results.score >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {results.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${results.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-slate-300 mb-6">{results.summary}</p>

                  {/* Issues List */}
                  <div className="flex-1 space-y-3 mb-6">
                    {results.issues.map((issue, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 flex gap-3">
                        {issue.type === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        {issue.type === 'warning' && (
                          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        )}
                        {issue.type === 'info' && (
                          <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-200">{issue.message}</p>
                          <p className="text-xs text-slate-500">Line {issue.line}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownloadReport}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Download Report
                    </button>
                    <button
                      onClick={() => setResults(null)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                    >
                      New Analysis
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 text-center">
            <p className="text-2xl font-bold text-cyan-400">2,500+</p>
            <p className="text-sm text-slate-400">Code Analyses</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 text-center">
            <p className="text-2xl font-bold text-cyan-400">98%</p>
            <p className="text-sm text-slate-400">Accuracy Rate</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 text-center">
            <p className="text-2xl font-bold text-cyan-400">&lt;1s</p>
            <p className="text-sm text-slate-400">Average Speed</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AnalysisPage;
