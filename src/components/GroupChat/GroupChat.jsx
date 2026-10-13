import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/useUser.jsx';
import axios from 'axios';

import './GroupChat.css';

const apiUrl = import.meta.env.VITE_API_URL;

export default function GroupChat({ groupId }) {
    const { authUser } = useUser();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messagesContainerRef = useRef(null);

    const fetchMessages = () => {
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authUser.token,
            },
        };

        axios
            .get(`${apiUrl}/api/group/${groupId}/chat`, {
                ...headers,
            })
            .then((response) => {
                setMessages(response.data);
            })
            .catch((error) => {
                alert(error.response?.data?.message || 'Request failed');
            });
        return;
    };

    useEffect(() => {
        fetchMessages();
        const intervalId = setInterval(() => {
            fetchMessages();
        }, 15000);

        return () => {
            clearInterval(intervalId);
        };
    }, [groupId, authUser.token]);

    useEffect(() => {
        const messagesContainer = messagesContainerRef.current;

        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });

    const sendMessage = (e) => {
        e.preventDefault();

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authUser.token,
            },
        };

        const body = {
            message,
        };

        axios
            .post(
                `${apiUrl}/api/group/${groupId}/chat`,
                JSON.stringify(body),
                headers,
            )
            .then(() => {
                setMessage('');
                fetchMessages();
            })
            .catch((error) => {
                alert(error.response?.data?.message || 'Request failed');
            });

        return;
    };

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    return (
        <div>
            <form className="group-chat-form" onSubmit={sendMessage}>
                <div ref={messagesContainerRef} className="group-chat-messages">
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <div key={index} className="group-chat-message">
                                <p className="group-chat-message-date">
                                    [{dateFormatter.format(new Date(message.created_at))},
                                    <span> </span>
                                    <span>{message.username}]</span>
                                    <span> </span>
                                    {message.message}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No messages yet</p>
                    )}
                </div>
                <div className="group-chat-input-container">
                    <input
                        className="group-chat-input"
                        type="text"
                        placeholder="Type your message..."
                        maxLength={100}
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                    />
                    <button className="group-chat-send-button" type="submit">
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}
