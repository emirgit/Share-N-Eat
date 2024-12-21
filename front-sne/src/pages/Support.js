import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminMenu from '../components/AdminMenu';
import axiosHelper from '../axiosHelper';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Fetch feedback tickets from the backend
  const fetchTickets = async () => {
    try {
      const response = await axiosHelper('/feedbacks/getFeedback'); // No `/api` prefix
      setTickets(response.content || []); // Use `content` field from the paginated response
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  // Update the status of a ticket
  const handleStatusChange = async (id) => {
    try {
      await axiosHelper(`/feedbacks/editFeedbackStatus/${id}?newStatus=${newStatus}`, 'PUT'); // No `/api` prefix
      fetchTickets(); // Refresh the ticket list
      setSelectedTicket(null); // Close the modal
      setNewStatus(''); // Reset newStatus
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  // Delete a feedback ticket
  const handleDeleteFeedback = async (id) => {
    try {
      await axiosHelper(`/feedbacks/deleteFeedback/${id}`, 'DELETE'); // No `/api` prefix
      fetchTickets(); // Refresh the ticket list
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Handler to close the modal and reset newStatus
  const handleCloseModal = () => {
    setSelectedTicket(null);
    setNewStatus('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="flex">
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>

          {/* Tickets Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left">User Name</th>
                  <th className="p-4 text-left">Subject</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.feedbackId} className="border-b">
                    <td className="p-4">{ticket.userName || 'Anonymous'}</td>
                    <td className="p-4">{ticket.feedbackSubject}</td>
                    <td className="p-4">
                      {ticket.createdDate
                        ? new Date(ticket.createdDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="p-4">
                      <span
                        className={
                          `px-3 py-1 rounded-full text-sm ` +
                          (ticket.feedbackStatus === 'OPEN'
                            ? 'bg-red-100 text-red-600'
                            : ticket.feedbackStatus === 'IN_PROGRESS'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-green-100 text-green-600')
                        }
                      >
                        {ticket.feedbackStatus}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setNewStatus(ticket.feedbackStatus);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteFeedback(ticket.feedbackId)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ticket Details Modal */}
          {selectedTicket && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white w-3/4 max-w-lg p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">
                  {selectedTicket.feedbackSubject}
                </h2>
                <p className="mb-2">
                  <strong>User:</strong> {selectedTicket.userName || 'Anonymous'}
                </p>
                <p className="mb-2">
                  <strong>Date:</strong>{' '}
                  {selectedTicket.createdDate
                    ? new Date(selectedTicket.createdDate).toLocaleDateString()
                    : 'N/A'}
                </p>
                <p className="mb-4">
                  <strong>Message:</strong> {selectedTicket.feedbackMessage}
                </p>
                <div className="mb-4">
                  <strong>Status:</strong>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="ml-2 border rounded px-2 py-1"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleStatusChange(selectedTicket.feedbackId)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <AdminMenu />
      </div>
    </div>
  );
};

export default Support;
