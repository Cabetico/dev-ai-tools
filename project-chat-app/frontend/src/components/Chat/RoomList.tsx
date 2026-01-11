import React from 'react';
import type { User } from '../../types';

interface RoomListProps {
    users: User[];
    currentUser: User | null;
    onlineUsers: Set<string>;
}

export const RoomList: React.FC<RoomListProps> = ({ users, currentUser, onlineUsers }) => {
    return (
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700">Online Users</h3>
            </div>
            <ul className="divide-y divide-gray-100">
                {users.map((user) => (
                    <li key={user.id} className="p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                {onlineUsers.has(user.id) && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user.username}
                                    {user.id === currentUser?.id && <span className="text-gray-400 ml-1">(You)</span>}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {onlineUsers.has(user.id) ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
