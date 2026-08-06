import { useState } from 'react';
import api from '../api/axios';

export default function GenAIAssistantPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please choose a PDF file first.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    setLoading(true);
    setError('');
    setUploadMessage('');

    try {
      const response = await api.post('/api/genai/upload', formData);
      setUploadMessage(response.data.message || 'PDF uploaded successfully.');
    } catch (err) {
      setError(err?.response?.data?.error || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    setAnswer('');
    setSources([]);

    try {
      const response = await api.post('/api/genai/ask', { question });
      setAnswer(response.data.answer || 'No answer returned.');
      setSources(response.data.sources || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong while contacting the AI assistant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="glass rounded-3xl border border-sky-900/30 p-6 md:p-8 shadow-2xl shadow-sky-950/30">
        <div className="mb-8">
          <p className="study-pill mb-3">GenAI Assistant</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Ask questions about your course PDF</h1>
          <p className="text-slate-400 mt-3 max-w-2xl">
            This assistant uses a retrieval-based chatbot so it can answer using the uploaded document context instead of guessing.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            Upload a PDF first
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="mt-2 block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500"
            />
          </label>

          <button type="submit" disabled={loading} className="btn-primary px-5 py-2.5 disabled:opacity-60">
            {loading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </form>

        {uploadMessage && (
          <div className="mt-4 rounded-2xl border border-emerald-900/30 bg-emerald-500/10 p-3 text-emerald-300">
            {uploadMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows="5"
            placeholder="Example: What topics are covered in week 2?"
            className="w-full rounded-2xl border border-sky-900/40 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400"
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-5 py-2.5 disabled:opacity-60"
            >
              {loading ? 'Thinking...' : 'Ask Assistant'}
            </button>
            <button
              type="button"
              onClick={() => setQuestion('What topics are covered in this document?')}
              className="btn-secondary px-5 py-2.5"
            >
              Try sample question
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300">
            {error}
          </div>
        )}

        {answer && (
          <div className="mt-6 rounded-2xl border border-sky-900/40 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold text-sky-300 mb-2">Answer</p>
            <p className="text-slate-200 leading-7">{answer}</p>
          </div>
        )}

        {sources.length > 0 && (
          <div className="mt-6 rounded-2xl border border-emerald-900/30 bg-emerald-500/10 p-4">
            <p className="text-sm font-semibold text-emerald-300 mb-2">Sources</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
              {sources.map((source, index) => (
                <li key={`${source}-${index}`}>{source}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
