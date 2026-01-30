
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Request } from '../types';

interface RequestCardProps {
  request: Request;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const { t } = useTranslation();
  const statusColor = request.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
  const statusText = request.status === 'Completed' ? t('home.status.completed') : t('home.status.pending');

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{request.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{request.requester}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>{statusText}</span>
      </div>
      <p className="text-sm text-gray-400 mt-3">{request.date}</p>
    </div>
  );
};

export default RequestCard;
