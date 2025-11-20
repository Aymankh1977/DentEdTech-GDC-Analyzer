  useEffect(() => {
    const checkAIConnection = async () => {
      try {
        const endpointAvailable = await ApiKeyManager.testEndpoint();
        
        if (endpointAvailable) {
          const anthropicTest = await ApiKeyManager.testAnthropicConnection();
          setAiStatus(anthropicTest.success ? 'connected' : 'error');
          if (!anthropicTest.success) {
            setErrorMessage(`AI service configuration issue: ${anthropicTest.message}`);
          }
        } else {
          setAiStatus('error');
          setErrorMessage('Netlify functions endpoint not available.');
        }
      } catch (error) {
        setAiStatus('error');
        setErrorMessage('Failed to connect to AI service.');
      }
    };
    
    checkAIConnection();
  }, []);
