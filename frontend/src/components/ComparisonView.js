import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRFP, getProposalComparison } from '../api';

function ComparisonView() {
  const { rfpId } = useParams();
  const navigate = useNavigate();
  const [rfp, setRfp] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComparison();
  }, [rfpId]);

  const fetchComparison = async () => {
    try {
      const [rfpRes, comparisonRes] = await Promise.all([
        getRFP(rfpId),
        getProposalComparison(rfpId)
      ]);
      setRfp(rfpRes.data);
      setComparison(comparisonRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load comparison');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h3>🤖 AI is analyzing proposals...</h3>
        <p>This may take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comparison-view">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/')} className="btn-secondary">
          ← Back to RFPs
        </button>
      </div>
    );
  }

  if (!comparison) return null;

  return (
    <div className="comparison-view">
      <button onClick={() => navigate('/')} className="btn-secondary back-btn">
        ← Back to RFPs
      </button>

      <h2>🔍 Proposal Comparison for: {comparison.rfp_title}</h2>
      <p className="subtitle">AI-Powered Analysis of {comparison.proposals_count} Proposals</p>

      {/* AI Summary */}
      <div className="ai-summary">
        <h3>🤖 AI Analysis Summary</h3>
        <p>{comparison.ai_analysis.summary}</p>
      </div>

      {/* AI Recommendation */}
      <div className="ai-recommendation">
        <h3>💡 AI Recommendation</h3>
        <p><strong>{comparison.ai_analysis.recommendation}</strong></p>
      </div>

      {/* Comparison Table */}
      <div className="comparison-table-section">
        <h3>📊 Side-by-Side Comparison</h3>
        
        {comparison.ai_analysis.comparison && (
          <div className="comparison-highlights">
            <div className="highlight-card">
              <span className="highlight-label">💰 Best Price:</span>
              <span>{comparison.ai_analysis.comparison.best_price}</span>
            </div>
            <div className="highlight-card">
              <span className="highlight-label">⚡ Fastest Delivery:</span>
              <span>{comparison.ai_analysis.comparison.fastest_delivery}</span>
            </div>
            <div className="highlight-card">
              <span className="highlight-label">🛡️ Best Warranty:</span>
              <span>{comparison.ai_analysis.comparison.best_warranty}</span>
            </div>
            <div className="highlight-card">
              <span className="highlight-label">⭐ Best Overall:</span>
              <span>{comparison.ai_analysis.comparison.best_overall_value}</span>
            </div>
          </div>
        )}

        <div className="proposals-table">
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Pricing</th>
                <th>Delivery</th>
                <th>Warranty</th>
                <th>Payment Terms</th>
              </tr>
            </thead>
            <tbody>
              {comparison.proposals.map((proposal) => {
                const renderValue = (value) => {
                  if (!value) return 'N/A';
                  if (typeof value === 'object') return JSON.stringify(value);
                  return value;
                };
                
                return (
                  <tr key={proposal.id}>
                    <td><strong>{proposal.vendor_name}</strong></td>
                    <td>{renderValue(proposal.parsed_data.pricing)}</td>
                    <td>{renderValue(proposal.parsed_data.delivery_time)}</td>
                    <td>{renderValue(proposal.parsed_data.warranty)}</td>
                    <td>{renderValue(proposal.parsed_data.payment_terms)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Rankings */}
      {comparison.ai_analysis.vendor_rankings && (
        <div className="vendor-rankings">
          <h3>🏆 Vendor Rankings</h3>
          {comparison.ai_analysis.vendor_rankings.map((ranking, index) => (
            <div key={index} className="ranking-card">
              <div className="ranking-header">
                <h4>#{index + 1} {ranking.vendor}</h4>
                <span className="score">Score: {ranking.score}/100</span>
              </div>
              <div className="pros-cons">
                <div className="pros">
                  <strong>✅ Pros:</strong>
                  <ul>
                    {ranking.pros.map((pro, i) => (
                      <li key={i}>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div className="cons">
                  <strong>❌ Cons:</strong>
                  <ul>
                    {ranking.cons.map((con, i) => (
                      <li key={i}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Considerations */}
      {comparison.ai_analysis.key_considerations && (
        <div className="key-considerations">
          <h3>🎯 Key Considerations</h3>
          <ul>
            {comparison.ai_analysis.key_considerations.map((consideration, index) => (
              <li key={index}>{consideration}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ComparisonView;
