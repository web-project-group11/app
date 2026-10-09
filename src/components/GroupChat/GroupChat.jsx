import React, { useState, useEffect } from "react";
import { useUser } from "../../context/useUser.jsx";
import axios from "axios";

import "./GroupChat.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function GroupChat({ groupId }) {
  const { authUser } = useUser();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const fetchMessages = () => {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authUser.token,
      },
    };

    axios
      .get(`${apiUrl}/api/group/${groupId}/chat`, {
        ...headers,
      })
      .then((response) => {
        setMessages(response.data);
        // console.log("Fetched data", response.data);
      })
      .catch((error) => {
        // console.log(error);
        alert(error.response?.data?.message || "Request failed");
      });
    //   console.log(messages);
    //   console.log("First message:", messages[0]);
    return;
  };

  useEffect(() => {
    fetchMessages();
  }, [groupId, authUser.token]);

  const sendMessage = (e) => {
    e.preventDefault();

    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authUser.token,
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
      .then((response) => {
        // console.log("Message sent", response.data);
        setMessage("");
        fetchMessages();
      })
      .catch((error) => {
        // console.log(error);
        alert(error.response?.data?.message || "Request failed");
      });

    return;
  };

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div>
      <form className="group-chat-form" onSubmit={sendMessage}>
        <div className="group-chat-messages">
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
