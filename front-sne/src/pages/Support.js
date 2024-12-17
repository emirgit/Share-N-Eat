import React, { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import AdminMenu from '../components/AdminMenu';

const Support = () => {
    const [tickets, setTickets] = useState([
        {
            id: 1,
            username: 'DummyTheUser',
            subject: 'Unable to reset my password',
            date: '2024-12-17',
            status: 'Open',
            message: 'I tried to reset my password but didn’t receive the email.',
        },
    ]);

    const [selectedTicket, setSelectedTicket] = useState(null); // For viewing ticket details
    const [newStatus, setNewStatus] = useState(''); // To update ticket status

    // Handle ticket status change
    const handleStatusChange = (id, newStatus) => {
        setTickets(
            tickets.map((ticket) =>
                ticket.id === id ? { ...ticket, status: newStatus } : ticket
            )
        );
        setSelectedTicket(null); // Close the ticket view after updating
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Admin Navbar */}
            <AdminNavbar />

            <div className="flex">
                {/* Main Content */}
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
                                    <tr key={ticket.id} className="border-b">
                                        <td className="p-4">{ticket.username}</td>
                                        <td className="p-4">{ticket.subject}</td>
                                        <td className="p-4">{ticket.date}</td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm ${
                                                    ticket.status === 'Open'
                                                        ? 'bg-red-100 text-red-600'
                                                        : ticket.status === 'In Progress'
                                                        ? 'bg-yellow-100 text-yellow-600'
                                                        : 'bg-green-100 text-green-600'
                                                }`}
                                            >
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => setSelectedTicket(ticket)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                            >
                                                View
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
                                    {selectedTicket.subject}
                                </h2>
                                <p className="mb-2">
                                    <strong>User:</strong> {selectedTicket.username}
                                </p>
                                <p className="mb-2">
                                    <strong>Date:</strong> {selectedTicket.date}
                                </p>
                                <p className="mb-4">
                                    <strong>Message:</strong> {selectedTicket.message}
                                </p>
                                <div className="mb-4">
                                    <strong>Status:</strong>
                                    <select
                                        value={selectedTicket.status}
                                        onChange={(e) =>
                                            setNewStatus(e.target.value)
                                        }
                                        className="ml-2 border rounded px-2 py-1"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => handleStatusChange(selectedTicket.id, newStatus || selectedTicket.status)}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                    >
                                        Update Status
                                    </button>
                                    <button
                                        onClick={() => setSelectedTicket(null)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Admin Menu */}
                <AdminMenu />
            </div>
        </div>
    );
};

export default Support;
