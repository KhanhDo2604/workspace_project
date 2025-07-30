function NotificationDialog() {
    const notifications = [
        {
            id: 1,
            user: 'Lois Griffin',
            avatar: 'https://i.pravatar.cc/40?img=1',
            task: '🐶 Take Brian on a walk',
            time: '11 hours ago',
            type: 'comment',
            content: [
                { sender: 'Lois Griffin', text: '@Brian Griffin when you wanna go out buddy?' },
                { sender: 'Brian Griffin', text: '@Lois Griffin I HAVE TO GO NOW PETER' },
            ],
        },
        {
            id: 2,
            user: 'Lois Griffin',
            avatar: 'https://i.pravatar.cc/40?img=1',
            task: '🐶 Take Brian on a walk',
            time: '11 hours ago',
            type: 'assigned',
            assignedTo: 'Peter Griffin',
        },
        {
            id: 3,
            user: 'Glenn Quagmire',
            avatar: 'https://i.pravatar.cc/40?img=5',
            task: '🐶 Take Brian on a walk',
            time: '11 hours ago',
            type: 'comment',
        },
    ];

    return (
        <div
            className="bg-white rounded-xl shadow-lg w-full p-4 max-h-[600rem] overflow-y-auto"
            style={{ boxShadow: '-5px 2px 15px rgba(0, 0, 0, 0.2)' }}
        >
            <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h2 className="text-lg font-semibold">
                    Inbox <span className="text-white bg-red-500 text-xs px-2 py-1 rounded-full ml-1">2</span>
                </h2>
            </div>
            <div className="flex gap-2 mb-4">
                <button className="border px-3 py-1 rounded-md text-sm hover:bg-gray-100">Mark all as read</button>
                <button className="border px-3 py-1 rounded-md text-sm hover:bg-gray-100">Archive read</button>
            </div>
            {notifications.map((noti) => (
                <div key={noti.id} className="flex items-start gap-3 mb-6">
                    <img src={noti.avatar} alt="avatar" className="w-10 h-10 rounded-full mt-1" />
                    <div className="flex-1">
                        <p className="text-sm">
                            <span className="font-semibold">{noti.user}</span> commented in{' '}
                            <span className="font-semibold">{noti.task}</span>
                        </p>
                        <p className="text-xs text-gray-500">{noti.time} · Task List</p>

                        {noti.type === 'comment' && noti.content && (
                            <div className="mt-2 p-2 bg-gray-100 rounded-md text-sm">
                                {noti.content.map((c, i) => (
                                    <p key={i}>
                                        <span className="font-medium">{c.sender}</span> {c.text}
                                    </p>
                                ))}
                                <button className="mt-2 px-3 py-1 border text-sm rounded hover:bg-gray-200">
                                    Reply
                                </button>
                            </div>
                        )}

                        {noti.type === 'assigned' && (
                            <div className="mt-2 flex items-center text-sm">
                                <span className="mr-2">👥 Assigned to</span>
                                <span className="px-2 py-1 bg-gray-200 rounded-full text-sm">{noti.assignedTo}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default NotificationDialog;
