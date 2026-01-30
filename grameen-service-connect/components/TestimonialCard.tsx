
import React from 'react';
import { Testimonial } from '../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
      <img src={testimonial.avatar} alt={testimonial.author} className="w-16 h-16 rounded-full mx-auto mb-4" />
      <p className="text-gray-600 italic">"{testimonial.quote}"</p>
      <div className="mt-4">
        <p className="font-semibold text-gray-900">{testimonial.author}</p>
        <p className="text-sm text-gray-500">{testimonial.role}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
