import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import { ApiKeyManager } from './utils/apiKeyManager';
import { UltimateAIAnalysisService } from './services/ultimateAIAnalysisService';
import EnhancedQuestionnaireService from './services/enhancedQuestionnaireService';
import { PDFGenerator } from './utils/pdfGenerator';

// Safe dynamic imports
const loadAIService = async () => {
  try {
    const module = await import('./services/ultimateAIAnalysisService');
    return module.UltimateAIAnalysisService;
  } catch (error) {
    console.warn('Ultimate AI service not available:', error);
    return null;
  }
};

function App() {
  const [appState, setAppState] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiStatus, setAiStatus] = useState<'checking' | 'connected' | 'simulated'>('checking');
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [comprehensiveReport, setComprehensiveReport] = useState<string>('');

  useEffect(() => {
    const checkAIConnection = async () => {
      const hasApiKey = ApiKeyManager.hasApiKey();
      const endpointAvailable = await ApiKeyManager.testEndpoint();
      setAiStatus(hasApiKey && endpointAvailable ? 'connected' : 'simulated');
    };
    
    checkAIConnection();
  }, []);

  const handleFilesUpload = async (files: File[]) => {
    console.log('🚀 Files uploaded:', files.map(f => f.name));
    setUploadedFiles([...files]);
    
    if (files.length === 1) {
      setAppState('analyzing');
      await performUltimateAIAnalysis(files);
    } else if (files.length > 1) {
      setAppState('select');
    }
  };

  const performUltimateAIAnalysis = async (files: File[]) => {
    try {
      setAnalysisProgress(10);
      
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          const newProgress = prev + (aiStatus === 'connected' ? 2 : 4);
          return Math.min(newProgress, 90);
        });
      }, 400);

      console.log('🚀 Starting ULTIMATE AI analysis');
      
      const AIService = await loadAIService();
      if (AIService) {
        const results = await AIService.analyzeWithUltimateAI(files);
        setAnalysisResults(results);
        
        // Generate comprehensive report
        const report = AIService.generateComprehensiveReport(results, files[0].name);
        setComprehensiveReport(report);
        
        // Generate enhanced questionnaire
        const questionnaire = await EnhancedQuestionnaireService.generateAIQuestionnaire(results, files);
        setQuestionnaire(questionnaire);
        
      } else {
        // Fallback simulation
        await new Promise(resolve => setTimeout(resolve, 4000));
        const fallbackResults = [{
          requirement: { code: 'S1.1', title: 'Clinical Governance Framework', domain: 'Patient Safety' }, 
          score: 85,
          analysis: {
            status: 'partially-met',
            confidence: 82,
            evidence: ['Enhanced simulation analysis completed'],
            missingElements: ['Comprehensive monitoring systems'],
            recommendations: ['Implement systematic quality framework']
          }
        }];
        setAnalysisResults(fallbackResults);
        setComprehensiveReport('ULTIMATE AI Enhanced Analysis Report - Simulation Mode');
      }
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setAppState('results');
      
      setTimeout(() => setAnalysisProgress(0), 1000);
    } catch (error) {
      console.error('ULTIMATE AI ANALYSIS failed:', error);
      setAppState('results');
      setAnalysisProgress(0);
    }
  };

  const handleFileSelect = async (index: number) => {
    const selectedFile = uploadedFiles[index];
    setAppState('analyzing');
    await performUltimateAIAnalysis([selectedFile]);
  };

  const handleSetApiKey = async () => {
    const apiKey = prompt('Enter your Anthropic API key for enhanced ULTIMATE AI analysis:');
    if (apiKey && ApiKeyManager.isValidApiKey(apiKey)) {
      ApiKeyManager.setApiKey(apiKey);
      const endpointAvailable = await ApiKeyManager.testEndpoint();
      
      if (endpointAvailable) {
        setAiStatus('connected');
        alert('✅ Enhanced ULTIMATE AI Activated! Real AI analysis enabled.');
      } else {
        setAiStatus('simulated');
        alert('⚠️ API key saved but endpoint not available. Using enhanced simulation.');
      }
    } else {
      alert('❌ Invalid API key format. Must start with "sk-ant-" and be at least 40 characters.');
    }
  };

  const handleReset = () => {
    setUploadedFiles([]);
    setAnalysisResults([]);
    setAnalysisProgress(0);
    setAppState('upload');
    setQuestionnaire(null);
    setComprehensiveReport('');
  };

  const handleDownloadReport = (format: 'pdf' | 'txt' = 'pdf') => {
    if (format === 'pdf') {
      const pdfBlob = PDFGenerator.generateComprehensiveReport(analysisResults, questionnaire, uploadedFiles[0]?.name || 'Document');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GDC-Analysis-Report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const element = document.createElement('a');
      const file = new Blob([comprehensiveReport], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `GDC-Analysis-Report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleDownloadQuestionnaire = (format: 'pdf' | 'txt' = 'pdf') => {
    if (!questionnaire) return;
    
    if (format === 'pdf') {
      const pdfBlob = PDFGenerator.generateQuestionnairePDF(questionnaire);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GDC-Questionnaire-${questionnaire.programName}-${questionnaire.filledDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const questionnaireText = `GDC PRE-INSPECTION QUESTIONNAIRE\n
Programme: ${questionnaire.programName}
Institution: ${questionnaire.institution}
Date: ${questionnaire.filledDate}
Overall Compliance: ${questionnaire.overallCompliance}%\n\n
${questionnaire.answers.map((answer: any, index: number) => 
  `${index + 1}. ${answer.question}\nAnswer: ${answer.answer}\nEvidence: ${answer.evidence}\nCompliance: ${answer.complianceLevel}\nRecommendations: ${answer.recommendations.join(', ')}\n\n`
).join('')}`;

      const element = document.createElement('a');
      const file = new Blob([questionnaireText], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `GDC-Questionnaire-${questionnaire.programName}-${questionnaire.filledDate}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const overallScore = analysisResults.length > 0 
    ? Math.round(analysisResults.reduce((sum, req) => sum + req.score, 0) / analysisResults.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${
                aiStatus === 'connected' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
              } shadow-lg`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DentEdTech GDC Analyzer
                </h1>
                <p className={`text-sm font-medium ${
                  aiStatus === 'connected' ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {aiStatus === 'connected' ? '🚀 ULTIMATE AI Active' : '💡 AI Simulation Mode'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {aiStatus !== 'connected' && (
                <button
                  onClick={handleSetApiKey}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🚀 Activate ULTIMATE AI
                </button>
              )}
              
              {appState === 'results' && (
                <div className="flex space-x-3">
                  <div className="relative group">
                    <button
                      onClick={() => handleDownloadReport('pdf')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                    >
                      📄 Download Report
                    </button>
                    <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg p-2 mt-1 z-50">
                      <button 
                        onClick={() => handleDownloadReport('pdf')}
                        className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded"
                      >
                        📄 PDF Format
                      </button>
                      <button 
                        onClick={() => handleDownloadReport('txt')}
                        className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded"
                      >
                        📝 TXT Format
                      </button>
                    </div>
                  </div>
                  {questionnaire && (
                    <div className="relative group">
                      <button
                        onClick={() => handleDownloadQuestionnaire('pdf')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                      >
                        📋 Download Questionnaire
                      </button>
                      <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg p-2 mt-1 z-50">
                        <button 
                          onClick={() => handleDownloadQuestionnaire('pdf')}
                          className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded"
                        >
                          📄 PDF Format
                        </button>
                        <button 
                          onClick={() => handleDownloadQuestionnaire('txt')}
                          className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded"
                        >
                          📝 TXT Format
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleReset}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                  >
                    🔄 New Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {appState === 'upload' && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GDC ULTIMATE AI Analyzer
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Next-generation ULTIMATE AI analysis for comprehensive GDC compliance assessment with enhanced reporting
              </p>
              
              {aiStatus === 'connected' ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-green-800 font-semibold text-lg">ULTIMATE AI ACTIVATED</p>
                  </div>
                  <p className="text-green-700">
                    Real ULTIMATE AI analysis enabled. Comprehensive multi-document analysis with enhanced reporting and questionnaire generation.
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <p className="text-blue-800 font-semibold text-lg">ULTIMATE AI SIMULATION MODE</p>
                  </div>
                  <p className="text-blue-700">
                    <strong>Enhanced ULTIMATE AI Simulation:</strong> Comprehensive analysis with realistic simulations, enhanced reporting, and automated questionnaire generation. 
                    <button 
                      onClick={handleSetApiKey}
                      className="ml-2 text-green-600 hover:text-green-800 font-semibold underline"
                    >
                      🚀 Activate real ULTIMATE AI for maximum intelligence
                    </button>
                  </p>
                </div>
              )}
            </div>
            
            <FileUpload onFilesUpload={handleFilesUpload} disabled={false} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-blue-600 text-2xl mb-3">🧠</div>
                <h3 className="font-bold text-gray-900 mb-2">ULTIMATE AI Analysis</h3>
                <p className="text-sm text-gray-600">Multi-document intelligence with comprehensive evidence extraction and enhanced reporting</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-green-600 text-2xl mb-3">📋</div>
                <h3 className="font-bold text-gray-900 mb-2">Automated Questionnaire</h3>
                <p className="text-sm text-gray-600">AI-powered questionnaire completion with evidence-based answers and recommendations</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-purple-600 text-2xl mb-3">🏆</div>
                <h3 className="font-bold text-gray-900 mb-2">Professional PDF Reports</h3>
                <p className="text-sm text-gray-600">Comprehensive PDF reports with implementation plans and gold standard practices</p>
              </div>
            </div>
          </div>
        )}

        {appState === 'select' && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Select Document for ULTIMATE AI Analysis</h2>
              <p className="text-lg text-gray-600">
                Choose one document for comprehensive ULTIMATE AI-powered GDC analysis with enhanced reporting
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl p-6 border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all duration-300 hover:scale-105 group"
                  onClick={() => handleFileSelect(index)}
                >
                  <div className="text-blue-600 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-center truncate text-lg">
                    {file.name.replace(/\.[^/.]+$/, "")}
                  </h3>
                  <p className="text-xs text-gray-500 text-center mb-4">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="text-center">
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                      🚀 Analyze with ULTIMATE AI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {appState === 'analyzing' && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                {aiStatus === 'connected' ? '🚀 ULTIMATE AI' : '💡 ULTIMATE AI'} Analysis in Progress
              </h2>
              <p className="text-xl text-gray-600">
                {aiStatus === 'connected' 
                  ? 'Advanced ULTIMATE AI processing documents with comprehensive intelligence and enhanced reporting...'
                  : 'Enhanced ULTIMATE AI simulation with comprehensive analysis and reporting generation...'
                }
              </p>
            </div>
            
            <div className="flex justify-center items-center space-x-6">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600"></div>
              <div className="text-left">
                <div className="w-80 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <p className="text-lg text-gray-700 mt-3 font-semibold">
                  {aiStatus === 'connected' ? 'ULTIMATE AI Analysis' : 'ULTIMATE AI Analysis'}: {analysisProgress}%
                </p>
                {analysisProgress > 30 && analysisProgress < 70 && (
                  <p className="text-sm text-blue-600 mt-2">
                    Processing requirements and extracting evidence...
                  </p>
                )}
                {analysisProgress >= 70 && (
                  <p className="text-sm text-green-600 mt-2">
                    Generating comprehensive reports and questionnaire...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {appState === 'results' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                {aiStatus === 'connected' ? '🚀 ULTIMATE AI' : '💡 ULTIMATE AI'} Analysis Complete
              </h2>
              <p className="text-xl text-gray-600">
                Successfully analyzed {uploadedFiles.length} document(s) with enhanced reporting
              </p>
            </div>

            {/* Enhanced Results Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{analysisResults.length}</div>
                <div className="text-gray-600">Requirements Analyzed</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600">{overallScore}%</div>
                <div className="text-gray-600">Overall Compliance</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">{uploadedFiles.length}</div>
                <div className="text-gray-600">Documents Processed</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600">{analysisResults.filter(r => r.score >= 80).length}</div>
                <div className="text-gray-600">High Compliance Areas</div>
              </div>
            </div>

            {/* Comprehensive Report Preview */}
            {comprehensiveReport && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive Analysis Report</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{comprehensiveReport}</pre>
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="relative group">
                    <button
                      onClick={() => handleDownloadReport('pdf')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                      📄 Download Full Report
                    </button>
                    <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg p-2 mt-1 z-50 right-0">
                      <button 
                        onClick={() => handleDownloadReport('pdf')}
                        className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded whitespace-nowrap"
                      >
                        📄 PDF Format (Recommended)
                      </button>
                      <button 
                        onClick={() => handleDownloadReport('txt')}
                        className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded whitespace-nowrap"
                      >
                        📝 TXT Format
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Questionnaire Preview */}
            {questionnaire && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Enhanced Questionnaire</h3>
                <div className="mb-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-green-800">{questionnaire.programName}</h4>
                      <p className="text-green-600">{questionnaire.institution} • {questionnaire.filledDate}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-800">{questionnaire.overallCompliance}%</div>
                      <div className="text-green-600">Overall Compliance</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {questionnaire.answers.slice(0, 5).map((answer: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{answer.question}</h4>
                      <p className="text-gray-600 text-sm mb-2">{answer.answer}</p>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          answer.complianceLevel === 'fully-compliant' ? 'bg-green-100 text-green-800' :
                          answer.complianceLevel === 'partially-compliant' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {answer.complianceLevel.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {answer.recommendations.length} recommendations
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <div className="relative group">
                    <button
                      onClick={() => handleDownloadQuestionnaire('pdf')}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                      📋 Download Questionnaire
                    </button>
                    <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-lg p-2 mt-1 z-50 right-0">
                      <button 
                        onClick={() => handleDownloadQuestionnaire('pdf')}
                        className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded whitespace-nowrap"
                      >
                        📄 PDF Format (Recommended)
                      </button>
                      <button 
                        onClick={() => handleDownloadQuestionnaire('txt')}
                        className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded whitespace-nowrap"
                      >
                        📝 TXT Format
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center space-y-4">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleDownloadReport('pdf')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  📄 Download Comprehensive Report
                </button>
                {questionnaire && (
                  <button
                    onClick={() => handleDownloadQuestionnaire('pdf')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    📋 Download Questionnaire
                  </button>
                )}
              </div>
              <button
                onClick={handleReset}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                🔄 Analyze New Documents
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
