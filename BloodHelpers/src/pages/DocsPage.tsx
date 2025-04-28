import React from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DocsLinks from '@/components/DocsLinks';
import UserGuide from './docs/UserGuide';
import APIDocs from './docs/APIDocs';
import FAQ from './docs/FAQ';

const DocContent = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const getDocContent = () => {
    switch (docId) {
      case 'user-guide':
        return <UserGuide />;
      case 'api':
        return <APIDocs />;
      case 'faq':
        return <FAQ />;
      default:
        return <DocsLinks />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {docId && (
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/docs')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documentation
        </Button>
      )}
      {getDocContent()}
    </div>
  );
};

const DocsPage = () => {
  return (
    <Routes>
      <Route path="/" element={<DocContent />} />
      <Route path=":docId" element={<DocContent />} />
    </Routes>
  );
};

export default DocsPage; 