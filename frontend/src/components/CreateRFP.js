import React, { useState } from 'react';
import { createRFP } from '../api';
import { useNavigate } from 'react-router-dom';

function CreateRFP() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await createRFP(description);
      setResult(response.data);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create RFP');
    } finally {
      setLoading(false);
    }
  };

  const exampleText = "I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty.";

  return (
    <div className="create-rfp">
      <h2>🤖 Create RFP with AI</h2>
      <p className="subtitle">Describe your procurement needs in natural language, and AI will create a structured RFP</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Describe your RFP requirements:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={exampleText}
            rows="8"
            required
          />
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setDescription(exampleText)}
          >
            Use Example
          </button>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? '🤖 AI Processing...' : '✨ Generate RFP'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {result && (
        <div className="success-message">
          <h3>✅ RFP Created Successfully!</h3>
          <div className="rfp-preview">
            <h4>{result.title}</h4>
            <div className="structured-data">
              <pre>{JSON.stringify(result.structured_data, null, 2)}</pre>
            </div>
          </div>
          <p>Redirecting to RFP list...</p>
        </div>
      )}
    </div>
  );
}

export default CreateRFP;
