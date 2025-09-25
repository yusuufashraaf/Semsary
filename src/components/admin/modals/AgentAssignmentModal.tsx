import React, { useEffect, useState } from "react";
import { getChats, assignChat, unassignChat } from "@services/AdminChat";
import { useAppSelector } from "@store/hook";
import { Chat, ChatUser } from "src/types/chats";
import { Button } from "@components/ui/Button";
import { LoadingSpinner } from "@components/ui/LoadingSpinner";
import Swal from "sweetalert2";

export const AgentAssignmentModal: React.FC = () => {
  const { jwt } = useAppSelector((state) => state.Authslice);
  const [chats, setChats] = useState<Chat[]>([]);
  const [agents, setAgents] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<Record<number, number | null>>({});

  // Fetch chats + agents
  useEffect(() => {
    const fetchData = async () => {
      if (!jwt) return;

      setLoading(true);
      try {
        const result = await getChats(jwt, 1);
        if (result.success) {
          setChats(result.data.data);
          setAgents(result.data.agents || []);
        }
      } catch (err) {
        console.error("Error fetching chats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jwt]);

  // Assign agent
  const handleAssign = async (chatId: number) => {
    const agentId = selectedAgents[chatId];
    if (!agentId) {
      Swal.fire("Missing Info", "Please select an agent first.", "warning");
      return;
    }

    try {
      const result = await assignChat(chatId, agentId, jwt!);
      if (result.success) {
        Swal.fire("Success", "Agent assigned successfully.", "success");
        setChats((prev) => prev.map((c) => (c.id === chatId ? result.data : c)));
      } else {
        Swal.fire("Failed", result.message || "Assignment failed.", "error");
      }
    } catch (err) {
      console.error("Error assigning agent", err);
      Swal.fire("Error", "Unexpected error occurred.", "error");
    }
  };

  // Unassign agent
  const handleUnassign = async (chatId: number) => {
    try {
      const result = await unassignChat(chatId, jwt!);
      if (result.success) {
        Swal.fire("Success", "Agent unassigned successfully.", "success");
        setChats((prev) => prev.map((c) => (c.id === chatId ? result.data : c)));
        setSelectedAgents((prev) => ({ ...prev, [chatId]: null }));
      } else {
        Swal.fire("Failed", result.message || "Unassignment failed.", "error");
      }
    } catch (err) {
      console.error("Error unassigning agent", err);
      Swal.fire("Error", "Unexpected error occurred.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Chats Assignment</h2>

      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Chat ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Property</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Assigned Agent</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {chats.map((chat) => (
            <tr key={chat.id}>
              <td className="px-4 py-2">{chat.id}</td>
              <td className="px-4 py-2">{chat.property?.title || "N/A"}</td>
              <td className="px-4 py-2">
                <select
                  value={selectedAgents[chat.id] ?? chat.assignedAgent?.id ?? ""}
                  onChange={(e) =>
                    setSelectedAgents((prev) => ({
                      ...prev,
                      [chat.id]: Number(e.target.value),
                    }))
                  }
                  className="border rounded px-2 py-1"
                >
                  <option value="">Select agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.first_name} {agent.last_name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2 space-x-2">
                <Button
                  variant="primary"
                  onClick={() => handleAssign(chat.id)}
                  disabled={!selectedAgents[chat.id] && !chat.assignedAgent}
                >
                  Assign
                </Button>
                {chat.assignedAgent && (
                  <Button variant="secondary" onClick={() => handleUnassign(chat.id)}>
                    Unassign
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentAssignmentModal;
