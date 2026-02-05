import { useState, useEffect } from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageHeader = styled.div`
  h1 {
    color: ${props => props.theme.colors.accent.primary};
    font-family: ${props => props.theme.fonts.mono};
    font-weight: 700;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.theme.colors.text.secondary};
    font-family: ${props => props.theme.fonts.mono};
  }
`;

const MonitorsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
`;

const MonitorCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  transition: all ${props => props.theme.animations.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 136, 0.1);
  }
`;

const MonitorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    color: ${props => props.theme.colors.text.primary};
    font-family: ${props => props.theme.fonts.mono};
    font-size: 1.1rem;
    margin: 0;
  }
`;

const StatusBadge = styled.div<{ status: number }>`
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-family: ${props => props.theme.fonts.mono};
  font-weight: 600;
  
  ${props => {
    if (props.status === 2) {
      return `
        background: rgba(40, 167, 69, 0.2);
        border: 1px solid #28a745;
        color: #28a745;
      `;
    } else if (props.status === 9) {
      return `
        background: rgba(255, 193, 7, 0.2);
        border: 1px solid #ffc107;
        color: #ffc107;
      `;
    } else {
      return `
        background: rgba(220, 53, 69, 0.2);
        border: 1px solid #dc3545;
        color: #dc3545;
      `;
    }
  }}
`;

const MonitorStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ${props => props.theme.fonts.mono};
  font-size: 0.9rem;
  
  .label {
    color: ${props => props.theme.colors.text.secondary};
  }
  
  .value {
    color: ${props => props.theme.colors.text.primary};
    font-weight: 600;
  }
`;

const UptimeBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.tertiary};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
  
  .fill {
    height: 100%;
    background: linear-gradient(90deg, #28a745, #00ff88);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

const ResponseTimeIndicator = styled.div<{ responseTime: number }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    
    ${props => {
      if (props.responseTime < 200) {
        return 'background: #28a745;';
      } else if (props.responseTime < 500) {
        return 'background: #ffc107;';
      } else {
        return 'background: #dc3545;';
      }
    }}
  }
`;

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.colors.text.muted};
  font-family: ${props => props.theme.fonts.mono};
  padding: 4rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid ${props => props.theme.colors.border};
    border-top: 3px solid ${props => props.theme.colors.accent.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  border-radius: 8px;
  padding: 2rem;
  color: #dc3545;
  font-family: ${props => props.theme.fonts.mono};
  text-align: center;
`;

const OverallStatus = styled.div<{ allUp: boolean }>`
  max-width: 400px;
  margin: 0 auto;
  background: ${props => props.allUp 
    ? 'rgba(40, 167, 69, 0.08)' 
    : 'rgba(220, 53, 69, 0.08)'};
  border: 1px solid ${props => props.allUp ? 'rgba(40, 167, 69, 0.3)' : 'rgba(220, 53, 69, 0.3)'};
  border-radius: 6px;
  padding: 0.875rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.allUp ? '#28a745' : '#dc3545'};
    box-shadow: 0 0 0 2px ${props => props.allUp 
      ? 'rgba(40, 167, 69, 0.25)' 
      : 'rgba(220, 53, 69, 0.25)'};
    flex-shrink: 0;
  }
  
  .text {
    font-family: ${props => props.theme.fonts.mono};
    font-size: 0.95rem;
    font-weight: 600;
    color: ${props => props.allUp ? '#28a745' : '#dc3545'};
  }
`;

const ApiHealthCard = styled.div`
  background: ${props => props.theme.colors.secondary};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  transition: all ${props => props.theme.animations.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 255, 136, 0.1);
  }
  
  h3 {
    color: ${props => props.theme.colors.text.primary};
    font-family: ${props => props.theme.fonts.mono};
    font-size: 1.1rem;
    margin: 0 0 1rem 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const ApiCheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ApiCheckItem = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${props => props.theme.colors.tertiary};
  border-radius: 6px;
  border: 1px solid ${props => {
    if (props.status === 'operational') return 'rgba(40, 167, 69, 0.3)';
    if (props.status === 'degraded') return 'rgba(255, 193, 7, 0.3)';
    return 'rgba(220, 53, 69, 0.3)';
  }};
  
  .check-name {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: ${props => props.theme.fonts.mono};
    font-size: 0.875rem;
    color: ${props => props.theme.colors.text.primary};
    
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${props => {
        if (props.status === 'operational') return '#28a745';
        if (props.status === 'degraded') return '#ffc107';
        return '#dc3545';
      }};
    }
  }
  
  .check-time {
    font-family: ${props => props.theme.fonts.mono};
    font-size: 0.8rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

interface Monitor {
  id: number;
  friendly_name: string;
  url: string;
  status: number;
  average_response_time: string;
  custom_uptime_ratio: string;
}

interface UptimeRobotResponse {
  stat: string;
  monitors: Monitor[];
}

interface ApiCheck {
  name: string;
  endpoint: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime: number;
  statusCode: number;
}

interface ApiHealthResponse {
  status: 'healthy' | 'degraded';
  timestamp: string;
  totalResponseTime: number;
  checks: ApiCheck[];
}

const StatusPage = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [apiHealth, setApiHealth] = useState<ApiHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
    fetchApiHealth();
    // Refresh every 5 minutes to avoid rate limiting
    const interval = setInterval(() => {
      fetchStatus();
      fetchApiHealth();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchApiHealth = async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        const data: ApiHealthResponse = await response.json();
        setApiHealth(data);
      }
    } catch (err) {
      console.error('API health check error:', err);
    }
  };

  const fetchStatus = async () => {
    try {
      setError(null);
      const response = await fetch('/api/status');
      
      if (!response.ok) {
        throw new Error('Failed to fetch status');
      }
      
      const data: UptimeRobotResponse = await response.json();
      
      if (data.stat === 'ok' && data.monitors) {
        setMonitors(data.monitors);
      } else {
        throw new Error('Invalid response from status API');
      }
    } catch (err) {
      console.error('Status fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: number): string => {
    switch (status) {
      case 2: return 'Operational';
      case 9: return 'Paused';
      case 8: return 'Down';
      default: return 'Unknown';
    }
  };

  const allOperational = monitors.length > 0 && monitors.every(m => m.status === 2);

  if (loading) {
    return (
      <Loading>
        <div className="spinner" />
        <p>Loading system status...</p>
      </Loading>
    );
  }

  if (error) {
    return (
      <StatusContainer>
        <PageHeader>
          <h1>System Status</h1>
        </PageHeader>
        <ErrorMessage>
          <p>Unable to load status information</p>
          <p>{error}</p>
        </ErrorMessage>
      </StatusContainer>
    );
  }

  return (
    <StatusContainer>
      <PageHeader>
        <h1>System Status</h1>
        <p>Real-time monitoring of all services</p>
      </PageHeader>

      <OverallStatus allUp={allOperational}>
        <div className="status-indicator" />
        <div className="text">
          {allOperational 
            ? 'All Systems Operational' 
            : 'Some Systems Experiencing Issues'}
        </div>
      </OverallStatus>

      {monitors.length === 0 && !apiHealth ? (
        <ErrorMessage>
          No monitors configured
        </ErrorMessage>
      ) : (
        <MonitorsGrid>
          {apiHealth && (
            <ApiHealthCard>
              <h3>API Health</h3>
              <ApiCheckList>
                {apiHealth.checks.map((check, index) => (
                  <ApiCheckItem key={index} status={check.status}>
                    <div className="check-name">
                      <span className="dot" />
                      {check.name}
                    </div>
                    <div className="check-time">{check.responseTime}ms</div>
                  </ApiCheckItem>
                ))}
              </ApiCheckList>
            </ApiHealthCard>
          )}
          
          {monitors.map(monitor => (
            <MonitorCard key={monitor.id}>
              <MonitorHeader>
                <h3>{monitor.friendly_name}</h3>
                <StatusBadge status={monitor.status}>
                  {getStatusText(monitor.status)}
                </StatusBadge>
              </MonitorHeader>
              
              <MonitorStats>
                <StatRow>
                  <span className="label">URL</span>
                  <span className="value" style={{ 
                    fontSize: '0.8rem',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {monitor.url}
                  </span>
                </StatRow>
                
                <StatRow>
                  <span className="label">Uptime (30 days)</span>
                  <span className="value">{monitor.custom_uptime_ratio}%</span>
                </StatRow>
                
                <UptimeBar>
                  <div 
                    className="fill" 
                    style={{ width: `${monitor.custom_uptime_ratio}%` }}
                  />
                </UptimeBar>
                
                <StatRow>
                  <span className="label">Response Time</span>
                  <ResponseTimeIndicator responseTime={parseInt(monitor.average_response_time)}>
                    <span className="dot" />
                    <span className="value">{monitor.average_response_time}ms</span>
                  </ResponseTimeIndicator>
                </StatRow>
              </MonitorStats>
            </MonitorCard>
          ))}
        </MonitorsGrid>
      )}
      
      <div style={{ 
        textAlign: 'center', 
        color: '#666', 
        fontSize: '0.85rem',
        fontFamily: 'monospace',
        marginTop: '2rem'
      }}>
        Last updated: {new Date().toLocaleString()} • Auto-refreshes every 60 seconds
      </div>
    </StatusContainer>
  );
};

export default StatusPage;
