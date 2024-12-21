import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axiosHelper from '../axiosHelper'; // Assuming axiosHelper is correctly set up

const HelpPage = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [faqOpen, setFaqOpen] = useState(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const faqs = [
    { question: 'How do I change my username?', answer: 'Go to Settings > Change Username to update your username.' },
    { question: 'How can I reset my password?', answer: 'Go to Settings > Change Password to reset your password.' },
    { question: 'How do I delete my account?', answer: 'Go to Settings > Delete Account to permanently delete your account.' },
    { question: 'How can I upload a recipe?', answer: 'Go to the main page and click the "+" button to upload a new recipe.' },
    { question: 'Who can see my profile?', answer: 'Your profile is visible to all registered users of the platform.' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subject.trim() === '' || message.trim() === '') {
      alert('Please enter both a title and a message before submitting.');
      return;
    }

    try {
      // Prepares data for sending to the backend
      const requestData = {
        subject,
        message,
      };

      // Sends the feedback data (subject + message) as JSON
      await axiosHelper('/feedbacks/sendFeedback', 'POST', requestData, {
        'Content-Type': 'application/json',
      });

      setFeedbackSent(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setFeedbackSent(false), 3000);
    } catch (error) {
      console.error('Error sending feedback:', error);
      alert('An error occurred while sending your message. Please try again later.');
    }
  };

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-row w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Get Help and Support</h1>

          {/* Feedback Form Section */}
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-medium mb-4">Message to Admin</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter the title here..."
                className="w-full p-4 border rounded-lg mb-4"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full p-4 border rounded-lg mb-4 h-32 resize-none"
              />
              <button type="submit" className="self-end bg-blue-500 text-white px-4 py-2 rounded-lg">
                Send Message
              </button>
            </form>
            {feedbackSent && (
              <p className="text-green-500 mt-4 text-center">
                Your message has been sent successfully!
              </p>
            )}
          </div>

          {/* FAQ Section */}
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-4">Frequently Asked Questions</h2>
            <ul className="space-y-4">
              {faqs.map((faq, index) => (
                <li key={index} className="border-b last:border-none pb-4">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="text-gray-800 font-medium">{faq.question}</span>
                    <span className="text-gray-500">
                      {faqOpen === index ? '-' : '+'}
                    </span>
                  </div>
                  {faqOpen === index && (
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
