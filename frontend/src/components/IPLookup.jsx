import React, { useState, useEffect, useRef, useCallback, useContext, useMemo } from 'react';
import { LanguageContext } from '../contexts/LanguageContext.jsx';
import { FiMapPin, FiGlobe, FiClock, FiServer, FiPhone, FiShield, FiSearch } from 'react-icons/fi';
import './IPLookup.css';

const IPLookup = () => {
  const [ip, setIp] = useState('');
  const [ipInfo, setIpInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { language, t, changeLanguage } = useContext(LanguageContext);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const languageGroups = [
    {
      name: '东亚',
      languages: [
        { code: 'zh', name: 'Chinese', native: '中文' },
        { code: 'ja', name: 'Japanese', native: '日本語' },
        { code: 'ko', name: 'Korean', native: '한국어' }
      ]
    },
    {
      name: '东南亚',
      languages: [
        { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
        { code: 'th', name: 'Thai', native: 'ไทย' },
        { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
        { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' }
      ]
    },
    {
      name: '欧洲',
      languages: [
        { code: 'en', name: 'English', native: 'English' },
        { code: 'es', name: 'Spanish', native: 'Español' },
        { code: 'fr', name: 'French', native: 'Français' },
        { code: 'de', name: 'German', native: 'Deutsch' },
        { code: 'it', name: 'Italian', native: 'Italiano' },
        { code: 'nl', name: 'Dutch', native: 'Nederlands' },
        { code: 'pl', name: 'Polish', native: 'Polski' },
        { code: 'pt', name: 'Portuguese', native: 'Português' },
        { code: 'ru', name: 'Russian', native: 'Русский' }
      ]
    }
  ];

  const validateIp = useCallback((ip) => {
    const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Pattern = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;
    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
  }, []);

  const handleLookup = useCallback(async (lookupIp, isInitialLookup = false) => {
    // Don't make API call if IP is empty and not initial lookup
    if (!isInitialLookup && !lookupIp) {
      setError(t.ipRequired || 'IP address is required');
      return;
    }

    if (!isInitialLookup && lookupIp && !validateIp(lookupIp)) {
      setError(t.invalidIp || 'Invalid IP address');
      return;
    }

    setLoading(true);
    setError('');
    setIpInfo(null);

    try {
      // Use '' for initial lookup, otherwise use the provided ip
      const finalIp = isInitialLookup ? '' : lookupIp;
      
      // 构建 API URL
      let apiUrl = 'https://api.ispinfo.io';
      if (finalIp) {
        // 确保 URL 格式正确，避免双斜杠
        apiUrl = `${apiUrl.replace(/\/+$/, '')}/${finalIp}`;
      }
      
      // 添加调试信息
      console.group('API Request');
      console.log('Final IP:', finalIp);
      console.log('Constructed URL:', apiUrl);
      
      console.log('Fetching from:', apiUrl); // 调试信息
      
      console.log('Full API URL:', apiUrl);
      
      let response;
      try {
        response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          credentials: 'same-origin'
        });
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw new Error(t.lookupError || '无法连接到服务器');
      }
      
      // 检查响应状态
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Status:', response.status);
        console.error('API Error Headers:', Object.fromEntries(response.headers.entries()));
        console.error('API Error Body:', errorText);
        throw new Error(t.lookupError || `错误: ${response.status} - 获取 IP 信息失败`);
      }
      
      // 检查响应内容类型
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Unexpected response:', text);
        throw new Error(t.lookupError || 'Received invalid response from server');
      }
      
      const data = await response.json();
      
      // 记录响应数据
      console.log('API Response:', data);
      console.groupEnd();

      setIpInfo(data);
      
      // Only update the input field if this is not the initial lookup
      if (!isInitialLookup) {
        setIp(lookupIp);
      }
    } catch (err) {
      console.error('Error looking up IP:', err);
      setError(err.message || t.lookupError || 'An error occurred while looking up the IP');
    } finally {
      setLoading(false);
    }
  }, [t, validateIp]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add event listener for '/' key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        setIp('');
        inputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputRef]);

  // Initial load and language change
  useEffect(() => {
    // Initial IP lookup
    handleLookup('', true);
  }, [handleLookup]);

  // On initial load, look up the user's own IP
  useEffect(() => {
    const fetchInitialIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        // Don't set the IP in the input, just perform the initial lookup
        await handleLookup(data.ip, true);
      } catch (error) {
        console.error('Error fetching initial IP:', error);
        // Pass an empty string to look up the server-detected IP
        await handleLookup('', true);
      }
    };

    fetchInitialIp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // This effect should only run once on mount.

  // Create a map of language codes to language objects
  const languageMap = useMemo(() => {
    const map = {};
    languageGroups.forEach(group => {
      group.languages.forEach(lang => {
        map[lang.code] = lang;
      });
    });
    return map;
  }, [languageGroups]);
  
  // For backward compatibility
  const languages = languageMap;

  // Format security status
  const getSecurityStatus = useCallback((status) => {
    return status ? (
      <span className="status-badge status-false">{t.yes}</span>
    ) : (
      <span className="status-badge status-true">{t.no}</span>
    );
  }, [t]);

  // Format type badge
  const getTypeBadge = useCallback((type) => {
    if (!type) return <span className="status-badge status-false">{t.unknown}</span>;
    
    const typeLower = type.toLowerCase();
    let statusClass = '';
    
    if (typeLower.includes('isp')) {
      statusClass = 'status-isp';
    } else if (typeLower.includes('hosting')) {
      statusClass = 'status-hosting';
    } else if (typeLower.includes('business')) {
      statusClass = 'status-business';
    } else {
      statusClass = 'status-true'; // Default style for other types
    }
    
    return <span className={`status-badge ${statusClass}`}>{type}</span>;
  }, [t]);

  const toggleLanguageDropdown = useCallback(() => {
    setShowLanguageDropdown(prev => !prev);
  }, []);

  const handleLanguageSelect = useCallback((langCode) => {
    changeLanguage(langCode);
    setShowLanguageDropdown(false);
  }, [changeLanguage]);

  return (
    <div className="ip-lookup">
      <div className="language-selector" ref={dropdownRef}>
        <div className="language-dropdown">
          <button 
            type="button" 
            className="language-dropdown-btn"
            onClick={toggleLanguageDropdown}
            aria-expanded={showLanguageDropdown}
            aria-haspopup="true"
          >
            {languages[language]?.native || 'Select Language'}
            <span className={`dropdown-arrow ${showLanguageDropdown ? 'rotate' : ''}`}>▼</span>
          </button>
          <div className={`language-dropdown-content ${showLanguageDropdown ? 'show' : ''}`}>
            {languageGroups.map((group, index) => (
              <div key={index} className="language-group">
                <div className="language-group-title">{group.name}</div>
                <div className="language-options">
                  {group.languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      className={`language-option ${language === lang.code ? 'active' : ''}`}
                      onClick={() => handleLanguageSelect(lang.code)}
                    >
                      <span className="native-name">{lang.native}</span>
                      <span className="english-name">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <h1>{t.title}</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleLookup(ip);
      }} className="input-container">
        <input
          type="text"
          ref={inputRef}
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder={`${t.placeholder} (Press / to focus)`}
          className="ip-input"
          aria-label="IP address input"
        />
        <button type="submit" className="lookup-button" disabled={loading}>
          {loading ? t.loading : <><FiSearch /> {t.lookup}</>}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {ipInfo && (
        <div className="results-container">
          <div className="info-grid">
            {/* Basic Info Card */}
            <div className="info-card">
              <div className="card-header">
                <FiGlobe /> {t.basicInfo}
              </div>
              <div className="card-body">
                <div className="info-item ip-address-item">
                  <span className="info-label">{t.ipAddress}</span>
                  <div className="ip-address-display">
                    <span className="ip-address-value">{ipInfo.ip}</span>
                    <button 
                      className={`copy-ip-button ${copied ? 'copied' : ''}`} 
                      onClick={() => {
                        navigator.clipboard.writeText(ipInfo.ip);
                        setCopied(true);
                        
                        // Clear any existing timeout
                        if (copyTimeoutRef.current) {
                          clearTimeout(copyTimeoutRef.current);
                        }
                        
                        // Set a new timeout to reset the copied state after 2 seconds
                        copyTimeoutRef.current = setTimeout(() => {
                          setCopied(false);
                        }, 2000);
                      }}
                      title={copied ? 'Copied!' : 'Copy IP address'}
                      aria-label={copied ? 'IP address copied to clipboard' : 'Copy IP address to clipboard'}
                    >
                      {copied ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.ipType}</span>
                  <span className="info-value">{ipInfo.type || t.unknown}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.hostname}</span>
                  <span className="info-value">{ipInfo.hostname || t.unknown}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">ASN</span>
                  <span className="info-value">
                    {ipInfo.connection?.asn ? `AS${ipInfo.connection.asn}` : t.unknown}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.organization}</span>
                  <span className="info-value">
                    {ipInfo.connection?.organization || t.unknown}
                  </span>
                </div>
              </div>
            </div>

            {/* Location Info Card */}
            <div className="info-card">
              <div className="card-header">
                <FiMapPin /> {t.locationInfo}
              </div>
              <div className="card-body">
                <div className="info-item">
                  <span className="info-label">{t.country}</span>
                  <span className="info-value">{ipInfo.location?.country?.name || t.unknown}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.region}</span>
                  <span className="info-value">{ipInfo.location?.region?.name || t.unknown}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.city}</span>
                  <span className="info-value">{ipInfo.location?.city || t.unknown}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.postalCode}</span>
                  <span className="info-value">{ipInfo.location?.postal || t.unknown}</span>
                </div>
              </div>
            </div>

            {/* Time Zone Info Card */}
            <div className="info-card">
              <div className="card-header">
                <FiClock /> {t.timeZoneInfo}
              </div>
              <div className="card-body">
                <div className="info-item">
                  <span className="info-label">{t.timeZoneId}</span>
                  <span className="info-value">{ipInfo.time_zone?.id || t.unknown}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.timeZoneName}</span>
                  <span className="info-value">{ipInfo.time_zone?.name || t.unknown}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.timeZoneAbbr}</span>
                  <span className="info-value">{ipInfo.time_zone?.abbreviation || t.unknown}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.currentTime}</span>
                  <span className="info-value">
                    {ipInfo.time_zone?.current_time ? new Date(ipInfo.time_zone.current_time).toLocaleString(
                      language === 'zh' ? 'zh-CN' : 'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        timeZoneName: 'short'
                      }
                    ) : t.unknown}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.timeZoneOffset}</span>
                  <span className="info-value">
                    {ipInfo.time_zone?.offset ? 
                      `UTC${ipInfo.time_zone.offset >= 0 ? '+' : ''}${ipInfo.time_zone.offset / 3600}` : 
                      t.unknown}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.daylightSaving}</span>
                  <span className="info-value">
                    {ipInfo.time_zone?.in_daylight_saving !== undefined ? 
                      (ipInfo.time_zone.in_daylight_saving ? t.yes : t.no) : 
                      t.unknown}
                  </span>
                </div>
              </div>
            </div>

            {/* Connection Info Card */}
            <div className="info-card">
              <div className="card-header">
                <FiServer /> {t.connectionInfo}
              </div>
              <div className="card-body">
                <div className="info-item">
                  <span className="info-label">{t.asn}</span>
                  <span className="info-value">
                    {ipInfo.connection?.asn ? `AS${ipInfo.connection.asn}` : t.unknown}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.organization}</span>
                  <span className="info-value">
                    {ipInfo.connection?.organization || t.unknown}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.domain}</span>
                  <span className="info-value">
                    {ipInfo.connection?.domain ? (
                      <a 
                        href={`https://${ipInfo.connection.domain}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="link"
                      >
                        {ipInfo.connection.domain}
                      </a>
                    ) : (
                      t.unknown
                    )}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.route}</span>
                  <span className="info-value">{ipInfo.connection?.route || t.unknown}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.connectionType}</span>
                  <span className="info-value">
                    {ipInfo.connection?.type ? getTypeBadge(ipInfo.connection.type) : t.unknown}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Info Card */}
            <div className="info-card">
              <div className="card-header">
                <FiPhone /> {t.companyInfo}
              </div>
              <div className="card-body">
                <div className="info-item">
                  <span className="info-label">{t.companyName}</span>
                  <span className="info-value">{ipInfo.company.name || t.unknown}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.domain}</span>
                  <span className="info-value">
                    {ipInfo.company.domain ? (
                      <a href={`https://${ipInfo.company.domain}`} target="_blank" rel="noopener noreferrer">
                        {ipInfo.company.domain}
                      </a>
                    ) : (
                      t.unknown
                    )}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.companyType}</span>
                  <span className="info-value">
                    {getTypeBadge(ipInfo.company.type)}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Info Card */}
            <div className="info-card">
              <div className="card-header">
                <FiShield /> {t.securityInfo}
              </div>
              <div className="card-body">
                <div className="info-item">
                  <span className="info-label">{t.vpn}</span>
                  <span className="info-value">{getSecurityStatus(ipInfo.security.is_vpn)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.proxy}</span>
                  <span className="info-value">{getSecurityStatus(ipInfo.security.is_proxy)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.tor}</span>
                  <span className="info-value">{getSecurityStatus(ipInfo.security.is_tor)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.cloudProvider}</span>
                  <span className="info-value">{getSecurityStatus(ipInfo.security.is_cloud_provider)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.anonymous}</span>
                  <span className="info-value">{getSecurityStatus(ipInfo.security.is_anonymous)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t.threat}</span>
                  <span className="info-value">{getSecurityStatus(ipInfo.security.is_threat)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          {ipInfo.location && ipInfo.location.latitude && ipInfo.location.longitude && (
            <div className="map-section">
              <iframe
                title="IP Location Map"
                width="100%"
                height="400px"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://maps.google.com/maps?q=${ipInfo.location.latitude},${ipInfo.location.longitude}&hl=${language}&z=10&output=embed`}
              ></iframe>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IPLookup;
