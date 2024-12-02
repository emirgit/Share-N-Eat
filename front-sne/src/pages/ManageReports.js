import React, { useState } from 'react';

// Mock veriler (Ticket listesi)
const mockTickets = [
    {
        id: 1,
        email: 'user1@example.com',
        subject: 'Login Issue',
        content: 'I cannot log into my account. Please help!',
    },
    {
        id: 2,
        email: 'user2@example.com',
        subject: 'Feature Request',
        content: 'Can you add a dark mode to the platform?',
    },
    {
        id: 3,
        email: 'admin@example.com',
        subject: 'Payment Problem',
        content: 'I was charged twice for my subscription.',
    },
];

const ManageReports = () => {
    const [respondingTicket, setRespondingTicket] = useState(null); // Cevaplanan ticket
    const [responseContent, setResponseContent] = useState(''); // Admin cevabı

    const handleRespond = (ticket) => {
        setRespondingTicket(ticket); // Cevaplanan ticket'ı ayarla
    };

    const handleResponseSubmit = () => {
        alert(
            `Response submitted for ticket "${respondingTicket.subject}":\n\n${responseContent}`
        );
        setRespondingTicket(null); // Ticket cevaplandıktan sonra sıfırla
        setResponseContent(''); // Cevap içeriğini temizle
    };

    return (
        <div>
            {!respondingTicket ? (
                <div className="ticket-list">
                    {mockTickets.map((ticket) => (
                        <div
                            key={ticket.id}
                            className="ticket-item border p-4 rounded mb-4 bg-white shadow-sm"
                        >
                            <h3 className="text-lg font-bold">{ticket.subject}</h3>
                            <p className="text-gray-600">
                                <strong>Email:</strong> {ticket.email}
                            </p>
                            <p className="text-gray-700">{ticket.content}</p>
                            <button
                                className="respond-button mt-2"
                                onClick={() => handleRespond(ticket)}
                            >
                                Respond
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="respond-template mt-6 p-4 border rounded bg-gray-100 shadow-md">
                    <h3 className="text-lg font-bold">
                        Respond to: {respondingTicket.subject}
                    </h3>
                    <p className="text-gray-600">
                        <strong>Email:</strong> {respondingTicket.email}
                    </p>
                    <p className="text-gray-700">{respondingTicket.content}</p>
                    <textarea
                        value={responseContent}
                        onChange={(e) => setResponseContent(e.target.value)}
                        placeholder="Write your response..."
                        className="w-full p-2 border rounded mt-4"
                        rows={4}
                    ></textarea>
                    <button
                        className="submit-button mt-4"
                        onClick={handleResponseSubmit}
                    >
                        Submit Response
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManageReports;
