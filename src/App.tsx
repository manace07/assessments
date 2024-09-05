import React, { useState, useEffect } from 'react';

interface ProcessedData {
  objectCount: number;
  sortedStrings: Record<string, string>;
}

const InputField: React.FC = () => {
  const [url, setUrl] = useState<string>(() => localStorage.getItem('queryURL') || '');

  useEffect(() => {
    localStorage.setItem('queryURL', url);
  }, [url]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <input
      type="text"
      value={url}
      onChange={handleInputChange}
      className="border p-2 rounded"
      placeholder="Enter URL"
    />
  );
};

const DisplayResponse: React.FC<{ data: any }> = ({ data }) => {
    const processData = (data: any): ProcessedData => {
      let objectCount = 0;
      const sortedStrings: Record<string, string> = {};
  
      const traverse = (obj: any) => {
        if (typeof obj === 'object' && obj !== null) {
          objectCount++;
          Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === 'object') {
              traverse(obj[key]); // Recursively process nested objects
            } else if (typeof obj[key] === 'string') {
              sortedStrings[key] = obj[key].split('').sort().reverse().join('');
            }
          });
        }
      };
  
      traverse(data);
      return { objectCount, sortedStrings };
    };
  
    const processedData = processData(data);
  
    return (
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <div>
          <h2>Processed Data</h2>
          <div>Object Count: {processedData.objectCount}</div>
          <div>
            {Object.keys(processedData.sortedStrings).map((key, index) => (
              <span key={index} className="badge bg-blue-500 text-white">
                {processedData.sortedStrings[key]}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };
  

const App: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [url, setUrl] = useState<string>(() => localStorage.getItem('queryURL') || '');

  useEffect(() => {
    if (url) {
      fetch(url)
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.error(err));
    }
  }, [url]);

  return (
    <div className="p-4">
      <InputField />
      <button className="btn btn-primary" onClick={() => setUrl(localStorage.getItem('queryURL') || '')}>
        Query
      </button>
      {data && <DisplayResponse data={data} />}
    </div>
  );
};

export default App;
