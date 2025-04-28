import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, HelpCircle } from 'lucide-react';

const DocsLinks = () => {
  const docs = [
    {
      title: 'User Guide',
      description: 'Learn how to use the application',
      icon: <BookOpen className="h-6 w-6" />,
      path: '/docs/user-guide'
    },
    {
      title: 'API Documentation',
      description: 'Technical documentation for developers',
      icon: <FileText className="h-6 w-6" />,
      path: '/docs/api'
    },
    {
      title: 'FAQ',
      description: 'Frequently asked questions',
      icon: <HelpCircle className="h-6 w-6" />,
      path: '/docs/faq'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {docs.map((doc) => (
        <Link
          key={doc.path}
          to={doc.path}
          className="group p-6 border rounded-lg hover:border-blood transition-colors duration-200"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-blood group-hover:text-blood/80 transition-colors duration-200">
              {doc.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blood transition-colors duration-200">
              {doc.title}
            </h3>
          </div>
          <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
            {doc.description}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default DocsLinks; 